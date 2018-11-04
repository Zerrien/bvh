const EPSILON = 1e-6;

import { BVHVector3 } from "./BVHVector3";
import { BVHNode } from "./BVHNode";
import { BVH } from "./BVH";
import { asyncWork } from './utils'

declare global {
	interface XYZ {
		0: number,
		1: number,
		2: number
	}
	interface Vector {
		x: number;
		y: number;
		z: number;
	}
}

export function BVHBuilder(triangles:any, maxTrianglesPerNode:number = 10):BVH {
	//Vector[][] | number[] | Float32Array
	let trianglesArray:Float32Array = triangles instanceof Float32Array ? triangles : buildTriangleArray(triangles);
	let bboxArray:Float32Array = calcBoundingBoxes(trianglesArray);
	// clone a helper array
	let bboxHelper:Float32Array = new Float32Array(bboxArray.length);
	bboxHelper.set(bboxArray);

	// create the root node, add all the triangles to it
	var triangleCount:number = trianglesArray.length / 9;
	var extents:XYZ[] = calcExtents(bboxArray, 0, triangleCount, EPSILON);
	let rootNode:BVHNode = new BVHNode(extents[0], extents[1], 0, triangleCount, 0);
	let nodesToSplit:BVHNode[] = [rootNode];
	let node:BVHNode | undefined;
	while (node = nodesToSplit.pop()) {
		let nodes = splitNode(node, maxTrianglesPerNode, bboxArray, bboxHelper);
		nodesToSplit.push(...nodes);
	}
	
	return new BVH(rootNode, bboxArray, trianglesArray);
}

export async function BVHBuilderAsync(triangles:any, maxTrianglesPerNode:number = 10, progressCallback?:(obj:{nodesSplit: number}) => void):Promise<BVH> {
	//Vector[][] | number[] | Float32Array
	let trianglesArray:Float32Array = triangles instanceof Float32Array ? triangles : buildTriangleArray(triangles);
	let bboxArray:Float32Array = calcBoundingBoxes(trianglesArray);
	// clone a helper array
	let bboxHelper:Float32Array = new Float32Array(bboxArray.length);
	bboxHelper.set(bboxArray);

	// create the root node, add all the triangles to it
	var triangleCount:number = trianglesArray.length / 9;
	var extents:XYZ[] = calcExtents(bboxArray, 0, triangleCount, EPSILON);
	let rootNode:BVHNode = new BVHNode(extents[0], extents[1], 0, triangleCount, 0);
	let nodesToSplit:BVHNode[] = [rootNode];
	let node:BVHNode | undefined;

	await asyncWork(() => {
		node = nodesToSplit.pop();
		return node !== undefined;
	}, () => {
		if(node !== undefined) {
			let nodes = splitNode(node, maxTrianglesPerNode, bboxArray, bboxHelper);
			nodesToSplit.push(...nodes);
		}
	}, progressCallback);

	return new BVH(rootNode, bboxArray, trianglesArray);
}

function splitNode(node: BVHNode, maxTriangles:number, bboxArray:Float32Array, bboxHelper:Float32Array):BVHNode[] {
	const nodeCount:number = node.elementCount()
	if (nodeCount <= maxTriangles || nodeCount === 0) return [];

	let startIndex:number = node.startIndex;
	let endIndex:number = node.endIndex;

	let leftNode:number[][] = [ [],[],[] ];
	let rightNode:number[][] = [ [],[],[] ];
	let extentCenters:number[] = [node.centerX(), node.centerY(), node.centerZ()];

	let objectCenter:number[] = [];
	objectCenter.length = 3;

	for (let i = startIndex; i < endIndex; i++) {
		objectCenter[0] = (bboxArray[i * 7 + 1] + bboxArray[i * 7 + 4]) * 0.5; // center = (min + max) / 2
		objectCenter[1] = (bboxArray[i * 7 + 2] + bboxArray[i * 7 + 5]) * 0.5; // center = (min + max) / 2
		objectCenter[2] = (bboxArray[i * 7 + 3] + bboxArray[i * 7 + 6]) * 0.5; // center = (min + max) / 2
		for (let j = 0; j < 3; j++) {
			if (objectCenter[j] < extentCenters[j]) {
				leftNode[j].push(i);
			} else {
				rightNode[j].push(i);
			}
		}
	}

	// check if we couldn't split the node by any of the axes (x, y or z). halt here, dont try to split any more (cause it will always fail, and we'll enter an infinite loop
	var splitFailed:boolean[] = [];
	splitFailed.length = 3;

	splitFailed[0] = (leftNode[0].length === 0) || (rightNode[0].length === 0);
	splitFailed[1] = (leftNode[1].length === 0) || (rightNode[1].length === 0);
	splitFailed[2] = (leftNode[2].length === 0) || (rightNode[2].length === 0);

	if (splitFailed[0] && splitFailed[1] && splitFailed[2]) return [];

	// choose the longest split axis. if we can't split by it, choose next best one.
	var splitOrder = [0, 1, 2];

	var extentsLength = [
		node.extentsMax[0] - node.extentsMin[0],
		node.extentsMax[1] - node.extentsMin[1],
		node.extentsMax[2] - node.extentsMin[2]
	];

	splitOrder.sort((axis0, axis1) => extentsLength[axis1] - extentsLength[axis0]);

	let leftElements:number[] | undefined = [];
	let rightElements:number[] | undefined = [];

	for (let j = 0; j < 3; j++) {
		var candidateIndex = splitOrder[j];
		if (!splitFailed[candidateIndex]) {
			leftElements = leftNode[candidateIndex];
			rightElements = rightNode[candidateIndex];
			break;
		}
	}


	// sort the elements in range (startIndex, endIndex) according to which node they should be at
	var node0Start = startIndex;
	var node0End = node0Start + leftElements.length;
	var node1Start = node0End;
	var node1End = endIndex;
	
	copyBoxes(leftElements, rightElements, node.startIndex, bboxArray, bboxHelper);

	// copy results back to main array
	var subArr = bboxHelper.subarray(node.startIndex * 7, node.endIndex * 7);
	bboxArray.set(subArr, node.startIndex * 7);

	// create 2 new nodes for the node we just split, and add links to them from the parent node
	var node0Extents = calcExtents(bboxArray, node0Start, node0End, EPSILON);
	var node1Extents = calcExtents(bboxArray, node1Start, node1End, EPSILON);

	var node0 = new BVHNode(node0Extents[0], node0Extents[1], node0Start, node0End, node.level + 1);
	var node1 = new BVHNode(node1Extents[0], node1Extents[1], node1Start, node1End, node.level + 1);

	node.node0 = node0;
	node.node1 = node1;
	node.clearShapes();

	// add new nodes to the split queue
	return [node0, node1];
}

function copyBoxes(leftElements:number[], rightElements:number[], startIndex:number, bboxArray:Float32Array, bboxHelper:Float32Array) {
	var concatenatedElements = leftElements.concat(rightElements);
	var helperPos = startIndex;
	for (let i = 0; i < concatenatedElements.length; i++) {
		let currElement = concatenatedElements[i];
		copyBox(bboxArray, currElement, bboxHelper, helperPos);
		helperPos++;
	}
}

function calcExtents(bboxArray:Float32Array, startIndex:number, endIndex:number, expandBy: number = 0.0):XYZ[] {
	if (startIndex >= endIndex) return [[0, 0, 0], [0, 0, 0]];
	let minX = Infinity;
	let minY = Infinity;
	let minZ = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;
	let maxZ = -Infinity;
	for (let i = startIndex; i < endIndex; i++) {
		minX = Math.min(bboxArray[i*7+1], minX);
		minY = Math.min(bboxArray[i*7+2], minY);
		minZ = Math.min(bboxArray[i*7+3], minZ);
		maxX = Math.max(bboxArray[i*7+4], maxX);
		maxY = Math.max(bboxArray[i*7+5], maxY);
		maxZ = Math.max(bboxArray[i*7+6], maxZ);
	}
	return [
		[minX - expandBy, minY - expandBy, minZ - expandBy],
		[maxX + expandBy, maxY + expandBy, maxZ + expandBy]
	];
}

function calcBoundingBoxes(trianglesArray: Float32Array):Float32Array {
	const triangleCount:number = trianglesArray.length / 9;
	const bboxArray:Float32Array = new Float32Array(triangleCount * 7);

	for (let i = 0; i < triangleCount; i++) {
		const p0x = trianglesArray[i*9];
		const p0y = trianglesArray[i*9+1];
		const p0z = trianglesArray[i*9+2];
		const p1x = trianglesArray[i*9+3];
		const p1y = trianglesArray[i*9+4];
		const p1z = trianglesArray[i*9+5];
		const p2x = trianglesArray[i*9+6];
		const p2y = trianglesArray[i*9+7];
		const p2z = trianglesArray[i*9+8];

		const minX = Math.min(p0x, p1x, p2x);
		const minY = Math.min(p0y, p1y, p2y);
		const minZ = Math.min(p0z, p1z, p2z);
		const maxX = Math.max(p0x, p1x, p2x);
		const maxY = Math.max(p0y, p1y, p2y);
		const maxZ = Math.max(p0z, p1z, p2z);
		setBox(bboxArray, i, i, minX, minY, minZ, maxX, maxY, maxZ);
	}

	return bboxArray;
}

function buildTriangleArray(triangles:Vector[][]):Float32Array {
	const trianglesArray = new Float32Array(triangles.length * 9);

	for (let i = 0; i < triangles.length; i++) {
		const p0 = triangles[i][0];
		const p1 = triangles[i][1];
		const p2 = triangles[i][2];

		trianglesArray[i*9] = p0.x;
		trianglesArray[i*9+1] = p0.y;
		trianglesArray[i*9+2] = p0.z;

		trianglesArray[i*9+3] = p1.x;
		trianglesArray[i*9+4] = p1.y;
		trianglesArray[i*9+5] = p1.z;

		trianglesArray[i*9+6] = p2.x;
		trianglesArray[i*9+7] = p2.y;
		trianglesArray[i*9+8] = p2.z;
	}

	return trianglesArray;
}

function setBox(bboxArray:Float32Array, pos:number, triangleId:number, minX:number, minY:number, minZ:number, maxX:number, maxY:number, maxZ:number):void {
	bboxArray[pos*7] = triangleId;
	bboxArray[pos*7+1] = minX;
	bboxArray[pos*7+2] = minY;
	bboxArray[pos*7+3] = minZ;
	bboxArray[pos*7+4] = maxX;
	bboxArray[pos*7+5] = maxY;
	bboxArray[pos*7+6] = maxZ;
}

function copyBox(sourceArray:Float32Array, sourcePos:number, destArray:Float32Array, destPos:number):void {
	destArray[destPos*7] = sourceArray[sourcePos*7];
	destArray[destPos*7+1] = sourceArray[sourcePos*7+1];
	destArray[destPos*7+2] = sourceArray[sourcePos*7+2];
	destArray[destPos*7+3] = sourceArray[sourcePos*7+3];
	destArray[destPos*7+4] = sourceArray[sourcePos*7+4];
	destArray[destPos*7+5] = sourceArray[sourcePos*7+5];
	destArray[destPos*7+6] = sourceArray[sourcePos*7+6];
}
