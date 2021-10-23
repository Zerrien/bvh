/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./docs/worker.ts":
/*!************************!*\
  !*** ./docs/worker.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const src_1 = __webpack_require__(/*! ../src */ "./src/index.ts");
let bvh;
onmessage = function ({ data: { message, data } }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message === "bvh_info") {
            buildBVH(data.facesArray);
        }
        else if (message === "ray_cast") {
            rayCast(data.origin, data.direction);
        }
    });
};
function buildBVH(array) {
    return __awaiter(this, void 0, void 0, function* () {
        bvh = yield (0, src_1.BVHBuilderAsync)(array, undefined, undefined, function (value) {
            self.postMessage({
                message: "progress",
                data: {
                    value
                }
            });
        });
        self.postMessage({
            message: "done",
        });
    });
}
function rayCast(origin, direction) {
    let result = bvh.intersectRay(origin, direction, false);
    self.postMessage({
        message: "ray_traced",
        data: result
    });
}


/***/ }),

/***/ "./src/BVH.ts":
/*!********************!*\
  !*** ./src/BVH.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BVH = void 0;
const BVHVector3_1 = __webpack_require__(/*! ./BVHVector3 */ "./src/BVHVector3.ts");
class BVH {
    constructor(rootNode, boundingBoxArray, triangleArray) {
        this.rootNode = rootNode;
        this.bboxArray = boundingBoxArray;
        this.trianglesArray = triangleArray;
    }
    intersectRay(rayOrigin, rayDirection, backfaceCulling = true) {
        try {
            rayOrigin = BVHVector3_1.BVHVector3.fromAny(rayOrigin);
            rayDirection = BVHVector3_1.BVHVector3.fromAny(rayDirection);
        }
        catch (error) {
            throw new TypeError("Origin or Direction couldn't be converted to a BVHVector3.");
        }
        const nodesToIntersect = [this.rootNode];
        const trianglesInIntersectingNodes = []; // a list of nodes that intersect the ray (according to their bounding box)
        const intersectingTriangles = [];
        const invRayDirection = new BVHVector3_1.BVHVector3(1.0 / rayDirection.x, 1.0 / rayDirection.y, 1.0 / rayDirection.z);
        // go over the BVH tree, and extract the list of triangles that lie in nodes that intersect the ray.
        // note: these triangles may not intersect the ray themselves
        while (nodesToIntersect.length > 0) {
            const node = nodesToIntersect.pop();
            if (!node)
                continue;
            if (BVH.intersectNodeBox(rayOrigin, invRayDirection, node)) {
                if (node.node0) {
                    nodesToIntersect.push(node.node0);
                }
                if (node.node1) {
                    nodesToIntersect.push(node.node1);
                }
                for (let i = node.startIndex; i < node.endIndex; i++) {
                    trianglesInIntersectingNodes.push(this.bboxArray[i * 7]);
                }
            }
        }
        // go over the list of candidate triangles, and check each of them using ray triangle intersection
        let a = new BVHVector3_1.BVHVector3();
        let b = new BVHVector3_1.BVHVector3();
        let c = new BVHVector3_1.BVHVector3();
        for (let i = 0; i < trianglesInIntersectingNodes.length; i++) {
            const triIndex = trianglesInIntersectingNodes[i];
            a.setFromArray(this.trianglesArray, triIndex * 9);
            b.setFromArray(this.trianglesArray, triIndex * 9 + 3);
            c.setFromArray(this.trianglesArray, triIndex * 9 + 6);
            const intersectionPoint = BVH.intersectRayTriangle(a, b, c, rayOrigin, rayDirection, backfaceCulling);
            if (!intersectionPoint)
                continue;
            intersectingTriangles.push({
                //triangle: [a.clone(), b.clone(), c.clone()],
                triangleIndex: triIndex,
                intersectionPoint: intersectionPoint,
            });
        }
        return intersectingTriangles;
    }
    static calcTValues(minVal, maxVal, rayOriginCoord, invdir) {
        if (invdir >= 0) {
            return [(minVal - rayOriginCoord) * invdir, (maxVal - rayOriginCoord) * invdir];
        }
        else {
            return [(maxVal - rayOriginCoord) * invdir, (minVal - rayOriginCoord) * invdir];
        }
    }
    static intersectNodeBox(rayOrigin, invRayDirection, node) {
        let [tmin, tmax] = BVH.calcTValues(node.extentsMin[0], node.extentsMax[0], rayOrigin.x, invRayDirection.x);
        let [tymin, tymax] = BVH.calcTValues(node.extentsMin[1], node.extentsMax[1], rayOrigin.y, invRayDirection.y);
        if (tmin > tymax || tymin > tmax)
            return false;
        // These lines also handle the case where tmin or tmax is NaN
        // (result of 0 * Infinity). x !== x returns true if x is NaN
        if (tymin > tmin || tmin !== tmin) {
            tmin = tymin;
        }
        if (tymax < tmax || tmax !== tmax) {
            tmax = tymax;
        }
        let [tzmin, tzmax] = BVH.calcTValues(node.extentsMin[2], node.extentsMax[2], rayOrigin.z, invRayDirection.z);
        if (tmin > tzmax || tzmin > tmax)
            return false;
        if (tzmax < tmax || tmax !== tmax) {
            tmax = tzmax;
        }
        //return point closest to the ray (positive side)
        if (tmax < 0)
            return false;
        return true;
    }
    static intersectRayTriangle(a, b, c, rayOrigin, rayDirection, backfaceCulling) {
        let diff = new BVHVector3_1.BVHVector3();
        let edge1 = new BVHVector3_1.BVHVector3();
        let edge2 = new BVHVector3_1.BVHVector3();
        let normal = new BVHVector3_1.BVHVector3();
        // from http://www.geometrictools.com/LibMathematics/Intersection/Wm5IntrRay3Triangle3.cpp
        edge1.subVectors(b, a);
        edge2.subVectors(c, a);
        normal.crossVectors(edge1, edge2);
        // Solve Q + t*D = b1*E1 + bL*E2 (Q = kDiff, D = ray direction,
        // E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
        //   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
        //   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
        //   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
        let DdN = rayDirection.dot(normal);
        if (DdN === 0)
            return null;
        if (DdN > 0 && backfaceCulling)
            return null;
        let sign = Math.sign(DdN);
        DdN *= sign;
        diff.subVectors(rayOrigin, a);
        const DdQxE2 = sign * rayDirection.dot(edge2.crossVectors(diff, edge2));
        // b1 < 0, no intersection
        if (DdQxE2 < 0)
            return null;
        const DdE1xQ = sign * rayDirection.dot(edge1.cross(diff));
        // b2 < 0, no intersection
        if (DdE1xQ < 0)
            return null;
        // b1+b2 > 1, no intersection
        if (DdQxE2 + DdE1xQ > DdN)
            return null;
        // Line intersects triangle, check if ray does.
        const QdN = -sign * diff.dot(normal);
        // t < 0, no intersection
        if (QdN < 0)
            return null;
        // Ray intersects triangle.
        return rayDirection.clone().multiplyScalar(QdN / DdN).add(rayOrigin);
    }
}
exports.BVH = BVH;


/***/ }),

/***/ "./src/BVHBuilder.ts":
/*!***************************!*\
  !*** ./src/BVHBuilder.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BVHBuilderAsync = exports.BVHBuilder = void 0;
const EPSILON = 1e-6;
const BVHNode_1 = __webpack_require__(/*! ./BVHNode */ "./src/BVHNode.ts");
const BVH_1 = __webpack_require__(/*! ./BVH */ "./src/BVH.ts");
const utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
function BVHBuilder(triangles, maxTrianglesPerNode = 10) {
    validateMaxTrianglesPerNode(maxTrianglesPerNode);
    let trianglesArray = validateTriangles(triangles);
    let bboxArray = calcBoundingBoxes(trianglesArray);
    // clone a helper array
    let bboxHelper = new Float32Array(bboxArray.length);
    bboxHelper.set(bboxArray);
    // create the root node, add all the triangles to it
    const triangleCount = trianglesArray.length / 9;
    const extents = calcExtents(bboxArray, 0, triangleCount, EPSILON);
    let rootNode = new BVHNode_1.BVHNode(extents[0], extents[1], 0, triangleCount, 0);
    let nodesToSplit = [rootNode];
    let node;
    while (node = nodesToSplit.pop()) {
        let nodes = splitNode(node, maxTrianglesPerNode, bboxArray, bboxHelper);
        nodesToSplit.push(...nodes);
    }
    return new BVH_1.BVH(rootNode, bboxArray, trianglesArray);
}
exports.BVHBuilder = BVHBuilder;
function BVHBuilderAsync(triangles, maxTrianglesPerNode = 10, asyncParams = {}, progressCallback) {
    return __awaiter(this, void 0, void 0, function* () {
        validateMaxTrianglesPerNode(maxTrianglesPerNode);
        let trianglesArray = validateTriangles(triangles);
        let bboxArray = calcBoundingBoxes(trianglesArray);
        // clone a helper array
        let bboxHelper = new Float32Array(bboxArray.length);
        bboxHelper.set(bboxArray);
        // create the root node, add all the triangles to it
        const triangleCount = trianglesArray.length / 9;
        const extents = calcExtents(bboxArray, 0, triangleCount, EPSILON);
        let rootNode = new BVHNode_1.BVHNode(extents[0], extents[1], 0, triangleCount, 0);
        let nodesToSplit = [rootNode];
        let node;
        let tally = 0;
        yield (0, utils_1.asyncWork)(() => {
            node = nodesToSplit.pop();
            return tally * 9 / trianglesArray.length;
        }, () => {
            if (!node)
                return;
            let nodes = splitNode(node, maxTrianglesPerNode, bboxArray, bboxHelper);
            if (!nodes.length)
                tally += node.elementCount();
            nodesToSplit.push(...nodes);
        }, asyncParams, progressCallback ?
            (nodesSplit) => progressCallback(Object.assign({ trianglesLeafed: tally }, nodesSplit))
            : undefined);
        return new BVH_1.BVH(rootNode, bboxArray, trianglesArray);
    });
}
exports.BVHBuilderAsync = BVHBuilderAsync;
function splitNode(node, maxTriangles, bboxArray, bboxHelper) {
    const nodeCount = node.elementCount();
    if (nodeCount <= maxTriangles || nodeCount === 0)
        return [];
    let startIndex = node.startIndex;
    let endIndex = node.endIndex;
    let leftNode = [[], [], []];
    let rightNode = [[], [], []];
    let extentCenters = [node.centerX(), node.centerY(), node.centerZ()];
    for (let i = startIndex; i < endIndex; i++) {
        let idx = i * 7 + 1;
        for (let j = 0; j < 3; j++) {
            if (bboxArray[idx] + bboxArray[idx++ + 3] < extentCenters[j]) {
                leftNode[j].push(i);
            }
            else {
                rightNode[j].push(i);
            }
        }
    }
    // check if we couldn't split the node by any of the axes (x, y or z). halt here, dont try to split any more (cause it will always fail, and we'll enter an infinite loop
    let splitFailed = [];
    splitFailed.length = 3;
    splitFailed[0] = (leftNode[0].length === 0) || (rightNode[0].length === 0);
    splitFailed[1] = (leftNode[1].length === 0) || (rightNode[1].length === 0);
    splitFailed[2] = (leftNode[2].length === 0) || (rightNode[2].length === 0);
    if (splitFailed[0] && splitFailed[1] && splitFailed[2])
        return [];
    // choose the longest split axis. if we can't split by it, choose next best one.
    let splitOrder = [0, 1, 2];
    const extentsLength = [
        node.extentsMax[0] - node.extentsMin[0],
        node.extentsMax[1] - node.extentsMin[1],
        node.extentsMax[2] - node.extentsMin[2],
    ];
    splitOrder.sort((axis0, axis1) => extentsLength[axis1] - extentsLength[axis0]);
    let leftElements = [];
    let rightElements = [];
    for (let j = 0; j < 3; j++) {
        const candidateIndex = splitOrder[j];
        if (!splitFailed[candidateIndex]) {
            leftElements = leftNode[candidateIndex];
            rightElements = rightNode[candidateIndex];
            break;
        }
    }
    // sort the elements in range (startIndex, endIndex) according to which node they should be at
    const node0End = startIndex + leftElements.length;
    copyBoxes(leftElements, rightElements, node.startIndex, bboxArray, bboxHelper);
    // copy results back to main array
    const subArr = bboxHelper.subarray(node.startIndex * 7, node.endIndex * 7);
    bboxArray.set(subArr, node.startIndex * 7);
    // create 2 new nodes for the node we just split, and add links to them from the parent node
    const node0Extents = calcExtents(bboxArray, startIndex, node0End, EPSILON);
    const node1Extents = calcExtents(bboxArray, node0End, endIndex, EPSILON);
    const node0 = new BVHNode_1.BVHNode(node0Extents[0], node0Extents[1], startIndex, node0End, node.level + 1);
    const node1 = new BVHNode_1.BVHNode(node1Extents[0], node1Extents[1], node0End, endIndex, node.level + 1);
    node.node0 = node0;
    node.node1 = node1;
    node.clearShapes();
    // add new nodes to the split queue
    return [node0, node1];
}
function copyBoxes(leftElements, rightElements, startIndex, bboxArray, bboxHelper) {
    const concatenatedElements = leftElements.concat(rightElements);
    let helperPos = startIndex;
    for (let i = 0; i < concatenatedElements.length; i++) {
        let currElement = concatenatedElements[i];
        copyBox(bboxArray, currElement, bboxHelper, helperPos);
        helperPos++;
    }
}
function calcExtents(bboxArray, startIndex, endIndex, expandBy = 0.0) {
    if (startIndex >= endIndex)
        return [[0, 0, 0], [0, 0, 0]];
    let minX = Infinity;
    let minY = Infinity;
    let minZ = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let maxZ = -Infinity;
    for (let i = startIndex; i < endIndex; i++) {
        let idx = i * 7 + 1;
        minX = Math.min(bboxArray[idx++], minX);
        minY = Math.min(bboxArray[idx++], minY);
        minZ = Math.min(bboxArray[idx++], minZ);
        maxX = Math.max(bboxArray[idx++], maxX);
        maxY = Math.max(bboxArray[idx++], maxY);
        maxZ = Math.max(bboxArray[idx], maxZ);
    }
    return [
        [minX - expandBy, minY - expandBy, minZ - expandBy],
        [maxX + expandBy, maxY + expandBy, maxZ + expandBy],
    ];
}
function calcBoundingBoxes(trianglesArray) {
    const triangleCount = trianglesArray.length / 9;
    const bboxArray = new Float32Array(triangleCount * 7);
    for (let i = 0; i < triangleCount; i++) {
        let idx = i * 9;
        const p0x = trianglesArray[idx++];
        const p0y = trianglesArray[idx++];
        const p0z = trianglesArray[idx++];
        const p1x = trianglesArray[idx++];
        const p1y = trianglesArray[idx++];
        const p1z = trianglesArray[idx++];
        const p2x = trianglesArray[idx++];
        const p2y = trianglesArray[idx++];
        const p2z = trianglesArray[idx];
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
function buildTriangleArray(triangles) {
    const trianglesArray = new Float32Array(triangles.length * 9);
    for (let i = 0; i < triangles.length; i++) {
        const p0 = triangles[i][0];
        const p1 = triangles[i][1];
        const p2 = triangles[i][2];
        let idx = i * 9;
        trianglesArray[idx++] = p0.x;
        trianglesArray[idx++] = p0.y;
        trianglesArray[idx++] = p0.z;
        trianglesArray[idx++] = p1.x;
        trianglesArray[idx++] = p1.y;
        trianglesArray[idx++] = p1.z;
        trianglesArray[idx++] = p2.x;
        trianglesArray[idx++] = p2.y;
        trianglesArray[idx] = p2.z;
    }
    return trianglesArray;
}
function setBox(bboxArray, pos, triangleId, minX, minY, minZ, maxX, maxY, maxZ) {
    let idx = pos * 7;
    bboxArray[idx++] = triangleId;
    bboxArray[idx++] = minX;
    bboxArray[idx++] = minY;
    bboxArray[idx++] = minZ;
    bboxArray[idx++] = maxX;
    bboxArray[idx++] = maxY;
    bboxArray[idx] = maxZ;
}
function copyBox(sourceArray, sourcePos, destArray, destPos) {
    let idx = destPos * 7;
    let jdx = sourcePos * 7;
    destArray[idx++] = sourceArray[jdx++];
    destArray[idx++] = sourceArray[jdx++];
    destArray[idx++] = sourceArray[jdx++];
    destArray[idx++] = sourceArray[jdx++];
    destArray[idx++] = sourceArray[jdx++];
    destArray[idx++] = sourceArray[jdx++];
    destArray[idx] = sourceArray[jdx];
}
function isFaceArray(testArray) {
    if (!Array.isArray(testArray))
        return false;
    for (let i = 0; i < testArray.length; i++) {
        const face = testArray[i];
        if (!Array.isArray(face))
            return false;
        if (face.length !== 3)
            return false;
        for (let j = 0; j < 3; j++) {
            const vertex = face[j];
            if (typeof vertex.x !== "number" || typeof vertex.y !== "number" || typeof vertex.z !== "number")
                return false;
        }
    }
    return true;
}
function isNumberArray(testArray) {
    if (!Array.isArray(testArray))
        return false;
    for (let i = 0; i < testArray.length; i++) {
        if (typeof testArray[i] !== "number")
            return false;
    }
    return true;
}
function validateMaxTrianglesPerNode(maxTrianglesPerNode) {
    if (typeof maxTrianglesPerNode !== 'number')
        throw new Error(`maxTrianglesPerNode must be of type number, got: ${typeof maxTrianglesPerNode}`);
    if (maxTrianglesPerNode < 1)
        throw new Error(`maxTrianglesPerNode must be greater than or equal to 1, got: ${maxTrianglesPerNode}`);
    if (Number.isNaN(maxTrianglesPerNode))
        throw new Error(`maxTrianglesPerNode is NaN`);
    if (!Number.isInteger(maxTrianglesPerNode))
        console.warn(`maxTrianglesPerNode is expected to be an integer, got: ${maxTrianglesPerNode}`);
}
function validateTriangles(triangles) {
    let trianglesArray;
    //Vector[][] | number[] | Float32Array
    if (Array.isArray(triangles) && triangles.length === 0) {
        console.warn(`triangles appears to be an array with 0 elements.`);
    }
    if (isFaceArray(triangles)) {
        trianglesArray = buildTriangleArray(triangles);
    }
    else if (triangles instanceof Float32Array) {
        trianglesArray = triangles;
    }
    else if (isNumberArray(triangles)) {
        trianglesArray = new Float32Array(triangles);
    }
    else {
        throw new Error(`triangles must be of type Vector[][] | number[] | Float32Array, got: ${typeof triangles}`);
    }
    return trianglesArray;
}


/***/ }),

/***/ "./src/BVHNode.ts":
/*!************************!*\
  !*** ./src/BVHNode.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BVHNode = void 0;
class BVHNode {
    constructor(extentsMin, extentsMax, startIndex, endIndex, level) {
        this.extentsMin = extentsMin;
        this.extentsMax = extentsMax;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.level = level;
        this.node0 = null;
        this.node1 = null;
    }
    static fromObj({ extentsMin, extentsMax, startIndex, endIndex, level, node0, node1 }) {
        const tempNode = new BVHNode(extentsMin, extentsMax, startIndex, endIndex, level);
        if (node0)
            tempNode.node0 = BVHNode.fromObj(node0);
        if (node1)
            tempNode.node1 = BVHNode.fromObj(node1);
        return tempNode;
    }
    elementCount() {
        return this.endIndex - this.startIndex;
    }
    centerX() {
        return (this.extentsMin[0] + this.extentsMax[0]);
    }
    centerY() {
        return (this.extentsMin[1] + this.extentsMax[1]);
    }
    centerZ() {
        return (this.extentsMin[2] + this.extentsMax[2]);
    }
    clearShapes() {
        this.startIndex = -1;
        this.endIndex = -1;
    }
}
exports.BVHNode = BVHNode;


/***/ }),

/***/ "./src/BVHVector3.ts":
/*!***************************!*\
  !*** ./src/BVHVector3.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BVHVector3 = void 0;
class BVHVector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
    setFromArray(array, firstElementPos) {
        this.x = array[firstElementPos];
        this.y = array[firstElementPos + 1];
        this.z = array[firstElementPos + 2];
    }
    setFromArrayNoOffset(array) {
        this.x = array[0];
        this.y = array[1];
        this.z = array[2];
    }
    setFromArgs(a, b, c) {
        this.x = a;
        this.y = b;
        this.z = c;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }
    subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    cross(v) {
        const x = this.x, y = this.y, z = this.z;
        this.x = y * v.z - z * v.y;
        this.y = z * v.x - x * v.z;
        this.z = x * v.y - y * v.x;
        return this;
    }
    crossVectors(a, b) {
        const ax = a.x, ay = a.y, az = a.z;
        const bx = b.x, by = b.y, bz = b.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    }
    clone() {
        return new BVHVector3(this.x, this.y, this.z);
    }
    static fromAny(potentialVector) {
        if (potentialVector instanceof BVHVector3) {
            return potentialVector;
        }
        else if (potentialVector.x !== undefined && potentialVector.x !== null) {
            return new BVHVector3(potentialVector.x, potentialVector.y, potentialVector.z);
        }
        else {
            throw new TypeError("Couldn't convert to BVHVector3.");
        }
    }
}
exports.BVHVector3 = BVHVector3;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./BVH */ "./src/BVH.ts"), exports);
__exportStar(__webpack_require__(/*! ./BVHBuilder */ "./src/BVHBuilder.ts"), exports);
__exportStar(__webpack_require__(/*! ./BVHNode */ "./src/BVHNode.ts"), exports);
__exportStar(__webpack_require__(/*! ./BVHVector3 */ "./src/BVHVector3.ts"), exports);


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.asyncWork = exports.countNodes = void 0;
function countNodes(node, count = 0) {
    count += 1;
    if (node.node0) {
        count += countNodes(node.node0);
    }
    if (node.node1) {
        count += countNodes(node.node1);
    }
    if (node._node0) {
        count += countNodes(node._node0);
    }
    if (node._node1) {
        count += countNodes(node._node1);
    }
    return count;
}
exports.countNodes = countNodes;
function asyncWork(workCheck, work, options, progressCallback) {
    return __awaiter(this, void 0, void 0, function* () {
        if (options.ms !== undefined && options.steps !== undefined) {
            console.warn("Asyncify got both steps and ms, defaulting to steps.");
        }
        const worker = (options.steps !== undefined ? percentageAsyncify : timeAsyncify)(workCheck, work, options);
        let done;
        let nodesSplit;
        while (!({ value: nodesSplit, done } = worker.next(), done)) {
            if (typeof progressCallback !== 'undefined') {
                progressCallback({ nodesSplit });
            }
            yield tickify();
        }
    });
}
exports.asyncWork = asyncWork;
function* timeAsyncify(workCheck, work, { ms = 1000 / 30 }) {
    let sTime = Date.now();
    let n = 0;
    let thres = 0;
    let count = 0;
    while (workCheck() < 1) {
        work();
        count++;
        if (++n >= thres) {
            const cTime = Date.now();
            const tDiff = cTime - sTime;
            if (tDiff > ms) {
                yield count;
                thres = n * (ms / tDiff);
                sTime = cTime;
                n = 0;
            }
        }
    }
}
function* percentageAsyncify(workCheck, work, { steps = 10 }) {
    if (steps <= 0) {
        throw new Error("Asyncify steps was less than or equal to zero");
    }
    let count = 0;
    let totalNumber = 0;
    let lastInc = 0;
    let workPercentage;
    let percentage = 1 / steps;
    while ((workPercentage = workCheck(), workPercentage < 1)) {
        work();
        count++;
        if (workPercentage > lastInc) {
            totalNumber += 1;
            yield count;
            lastInc = workPercentage + percentage;
        }
    }
    console.log("Total", totalNumber);
}
const tickify = () => new Promise((res) => setTimeout(res));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./docs/worker.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QixFQUFFLFFBQWUsRUFBRSxXQUFtQixHQUFHO0lBQ3RHLElBQUksVUFBVSxJQUFJLFFBQVE7UUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFELElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQztJQUNwQixJQUFJLElBQUksR0FBRyxRQUFRLENBQUM7SUFDcEIsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBQ3BCLElBQUksSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDO0lBQ3JCLElBQUksSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDO0lBQ3JCLElBQUksSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDO0lBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDM0MsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEIsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3RDO0lBQ0QsT0FBTztRQUNOLENBQUMsSUFBSSxHQUFHLFFBQVEsRUFBRSxJQUFJLEdBQUcsUUFBUSxFQUFFLElBQUksR0FBRyxRQUFRLENBQUM7UUFDbkQsQ0FBQyxJQUFJLEdBQUcsUUFBUSxFQUFFLElBQUksR0FBRyxRQUFRLEVBQUUsSUFBSSxHQUFHLFFBQVEsQ0FBQztLQUNuRCxDQUFDO0FBQ0gsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQUMsY0FBNEI7SUFDdEQsTUFBTSxhQUFhLEdBQVUsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDdkQsTUFBTSxTQUFTLEdBQWdCLElBQUksWUFBWSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUVuRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3ZDLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWhDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzVEO0lBRUQsT0FBTyxTQUFTLENBQUM7QUFDbEIsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQUMsU0FBb0I7SUFDL0MsTUFBTSxjQUFjLEdBQUcsSUFBSSxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUU5RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMxQyxNQUFNLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsTUFBTSxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0IsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QixjQUFjLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTdCLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0IsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QixjQUFjLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTdCLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0IsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QixjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUMzQjtJQUVELE9BQU8sY0FBYyxDQUFDO0FBQ3ZCLENBQUM7QUFFRCxTQUFTLE1BQU0sQ0FBQyxTQUFzQixFQUFFLEdBQVUsRUFBRSxVQUFpQixFQUFFLElBQVcsRUFBRSxJQUFXLEVBQUUsSUFBVyxFQUFFLElBQVcsRUFBRSxJQUFXLEVBQUUsSUFBVztJQUNsSixJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUM5QixTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDeEIsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUN4QixTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDeEIsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDdkIsQ0FBQztBQUVELFNBQVMsT0FBTyxDQUFDLFdBQXdCLEVBQUUsU0FBZ0IsRUFBRSxTQUFzQixFQUFFLE9BQWM7SUFDbEcsSUFBSSxHQUFHLEdBQUcsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUN0QixJQUFJLEdBQUcsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkMsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFDLFNBQWtCO0lBQ3RDLElB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V0FBVyxHQUFXLENBQUMsQ0FBQztJQUM1QixJQUFJLE9BQU8sR0FBVSxDQUFDLENBQUM7SUFDdkIsSUFBSSxjQUFxQixDQUFDO0lBQzFCLElBQUksVUFBVSxHQUFVLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDbEMsT0FBTSxDQUFDLGNBQWMsR0FBRyxTQUFTLEVBQUUsRUFBRSxjQUFjLEdBQUcsQ0FBQyxDQUFDLEVBQUU7UUFDekQsSUFBSSxFQUFFLENBQUM7UUFDUCxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUcsY0FBYyxHQUFHLE9BQU8sRUFBRTtZQUM1QixXQUFXLElBQUksQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sS0FBSyxDQUFDO1lBQ1osT0FBTyxHQUFHLGNBQWMsR0FBRyxVQUFVLENBQUM7U0FDdEM7S0FDRDtJQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFJRCxNQUFNLE9BQU8sR0FBRyxHQUFpQixFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFRLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOzs7Ozs7O1VDL0UvRTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYnZoLy4vZG9jcy93b3JrZXIudHMiLCJ3ZWJwYWNrOi8vYnZoLy4vc3JjL0JWSC50cyIsIndlYnBhY2s6Ly9idmgvLi9zcmMvQlZIQnVpbGRlci50cyIsIndlYnBhY2s6Ly9idmgvLi9zcmMvQlZITm9kZS50cyIsIndlYnBhY2s6Ly9idmgvLi9zcmMvQlZIVmVjdG9yMy50cyIsIndlYnBhY2s6Ly9idmgvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vYnZoLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL2J2aC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9idmgvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9idmgvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2J2aC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQlZIQnVpbGRlciwgQlZIQnVpbGRlckFzeW5jLCBCVkgsIEJWSFZlY3RvcjMgfSBmcm9tICcuLi9zcmMnO1xuXG5sZXQgYnZoOkJWSDtcblxub25tZXNzYWdlID0gYXN5bmMgZnVuY3Rpb24oe2RhdGE6e21lc3NhZ2UsIGRhdGF9fSkge1xuXHRpZihtZXNzYWdlID09PSBcImJ2aF9pbmZvXCIpIHtcblx0XHRidWlsZEJWSChkYXRhLmZhY2VzQXJyYXkpO1xuXHR9IGVsc2UgaWYgKG1lc3NhZ2UgPT09IFwicmF5X2Nhc3RcIikge1xuXHRcdHJheUNhc3QoZGF0YS5vcmlnaW4sIGRhdGEuZGlyZWN0aW9uKTtcblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiBidWlsZEJWSChhcnJheTphbnkgKSB7XG5cdGJ2aCA9IGF3YWl0IEJWSEJ1aWxkZXJBc3luYyhhcnJheSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0KHNlbGYgYXMgYW55KS5wb3N0TWVzc2FnZSh7XG5cdFx0XHRtZXNzYWdlOiBcInByb2dyZXNzXCIsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHZhbHVlXG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXHQoc2VsZiBhcyBhbnkpLnBvc3RNZXNzYWdlKHtcblx0XHRtZXNzYWdlOiBcImRvbmVcIixcblx0fSk7XG59XG5cbmZ1bmN0aW9uIHJheUNhc3Qob3JpZ2luOmFueSwgZGlyZWN0aW9uOmFueSkge1xuXHRsZXQgcmVzdWx0ID0gYnZoLmludGVyc2VjdFJheShvcmlnaW4sIGRpcmVjdGlvbiwgZmFsc2UpO1xuXHQoc2VsZiBhcyBhbnkpLnBvc3RNZXNzYWdlKCB7XG5cdFx0bWVzc2FnZTogXCJyYXlfdHJhY2VkXCIsXG5cdFx0ZGF0YTogcmVzdWx0XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgQlZIVmVjdG9yMyB9IGZyb20gJy4vQlZIVmVjdG9yMyc7XG5pbXBvcnQgeyBCVkhOb2RlIH0gZnJvbSAnLi9CVkhOb2RlJztcblxuZXhwb3J0IGNsYXNzIEJWSCB7XG5cdHJvb3ROb2RlOiBCVkhOb2RlO1xuXHRiYm94QXJyYXk6IEZsb2F0MzJBcnJheTtcblx0dHJpYW5nbGVzQXJyYXk6IEZsb2F0MzJBcnJheTtcblx0Y29uc3RydWN0b3Iocm9vdE5vZGU6QlZITm9kZSwgYm91bmRpbmdCb3hBcnJheTpGbG9hdDMyQXJyYXksIHRyaWFuZ2xlQXJyYXk6RmxvYXQzMkFycmF5KSB7XG5cdFx0dGhpcy5yb290Tm9kZSA9IHJvb3ROb2RlO1xuXHRcdHRoaXMuYmJveEFycmF5ID0gYm91bmRpbmdCb3hBcnJheTtcblx0XHR0aGlzLnRyaWFuZ2xlc0FycmF5ID0gdHJpYW5nbGVBcnJheTtcblx0fVxuXHRpbnRlcnNlY3RSYXkocmF5T3JpZ2luOmFueSwgcmF5RGlyZWN0aW9uOmFueSwgYmFja2ZhY2VDdWxsaW5nOmJvb2xlYW4gPSB0cnVlKTphbnlbXSB7XG5cdFx0dHJ5IHtcblx0XHRcdHJheU9yaWdpbiA9IEJWSFZlY3RvcjMuZnJvbUFueShyYXlPcmlnaW4pO1xuXHRcdFx0cmF5RGlyZWN0aW9uID0gQlZIVmVjdG9yMy5mcm9tQW55KHJheURpcmVjdGlvbik7XG5cdFx0fSBjYXRjaChlcnJvcikge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcIk9yaWdpbiBvciBEaXJlY3Rpb24gY291bGRuJ3QgYmUgY29udmVydGVkIHRvIGEgQlZIVmVjdG9yMy5cIik7XG5cdFx0fVxuXHRcdGNvbnN0IG5vZGVzVG9JbnRlcnNlY3Q6QlZITm9kZVtdID0gW3RoaXMucm9vdE5vZGVdO1xuXHRcdGNvbnN0IHRyaWFuZ2xlc0luSW50ZXJzZWN0aW5nTm9kZXM6bnVtYmVyW10gPSBbXTsgLy8gYSBsaXN0IG9mIG5vZGVzIHRoYXQgaW50ZXJzZWN0IHRoZSByYXkgKGFjY29yZGluZyB0byB0aGVpciBib3VuZGluZyBib3gpXG5cdFx0Y29uc3QgaW50ZXJzZWN0aW5nVHJpYW5nbGVzOm9iamVjdFtdID0gW107XG5cblx0XHRjb25zdCBpbnZSYXlEaXJlY3Rpb24gPSBuZXcgQlZIVmVjdG9yMyhcblx0XHRcdDEuMCAvIHJheURpcmVjdGlvbi54LFxuXHRcdFx0MS4wIC8gcmF5RGlyZWN0aW9uLnksXG5cdFx0XHQxLjAgLyByYXlEaXJlY3Rpb24uelxuXHRcdCk7XG5cblx0XHQvLyBnbyBvdmVyIHRoZSBCVkggdHJlZSwgYW5kIGV4dHJhY3QgdGhlIGxpc3Qgb2YgdHJpYW5nbGVzIHRoYXQgbGllIGluIG5vZGVzIHRoYXQgaW50ZXJzZWN0IHRoZSByYXkuXG5cdFx0Ly8gbm90ZTogdGhlc2UgdHJpYW5nbGVzIG1heSBub3QgaW50ZXJzZWN0IHRoZSByYXkgdGhlbXNlbHZlc1xuXHRcdHdoaWxlKG5vZGVzVG9JbnRlcnNlY3QubGVuZ3RoID4gMCkge1xuXHRcdFx0Y29uc3Qgbm9kZTpCVkhOb2RlIHwgdW5kZWZpbmVkID0gbm9kZXNUb0ludGVyc2VjdC5wb3AoKTtcblx0XHRcdGlmKCFub2RlKSBjb250aW51ZTtcblx0XHRcdGlmKEJWSC5pbnRlcnNlY3ROb2RlQm94KHJheU9yaWdpbiwgaW52UmF5RGlyZWN0aW9uLCBub2RlKSkge1xuXHRcdFx0XHRpZihub2RlLm5vZGUwKSB7XG5cdFx0XHRcdFx0bm9kZXNUb0ludGVyc2VjdC5wdXNoKG5vZGUubm9kZTApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKG5vZGUubm9kZTEpIHtcblx0XHRcdFx0XHRub2Rlc1RvSW50ZXJzZWN0LnB1c2gobm9kZS5ub2RlMSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Zm9yKGxldCBpID0gbm9kZS5zdGFydEluZGV4OyBpIDwgbm9kZS5lbmRJbmRleDsgaSsrKSB7XG5cdFx0XHRcdFx0dHJpYW5nbGVzSW5JbnRlcnNlY3RpbmdOb2Rlcy5wdXNoKHRoaXMuYmJveEFycmF5W2kqN10pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gZ28gb3ZlciB0aGUgbGlzdCBvZiBjYW5kaWRhdGUgdHJpYW5nbGVzLCBhbmQgY2hlY2sgZWFjaCBvZiB0aGVtIHVzaW5nIHJheSB0cmlhbmdsZSBpbnRlcnNlY3Rpb25cblx0XHRsZXQgYTpCVkhWZWN0b3IzID0gbmV3IEJWSFZlY3RvcjMoKTtcblx0XHRsZXQgYjpCVkhWZWN0b3IzID0gbmV3IEJWSFZlY3RvcjMoKTtcblx0XHRsZXQgYzpCVkhWZWN0b3IzID0gbmV3IEJWSFZlY3RvcjMoKTtcblxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCB0cmlhbmdsZXNJbkludGVyc2VjdGluZ05vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCB0cmlJbmRleCA9IHRyaWFuZ2xlc0luSW50ZXJzZWN0aW5nTm9kZXNbaV07XG5cblx0XHRcdGEuc2V0RnJvbUFycmF5KHRoaXMudHJpYW5nbGVzQXJyYXksIHRyaUluZGV4KjkpO1xuXHRcdFx0Yi5zZXRGcm9tQXJyYXkodGhpcy50cmlhbmdsZXNBcnJheSwgdHJpSW5kZXgqOSszKTtcblx0XHRcdGMuc2V0RnJvbUFycmF5KHRoaXMudHJpYW5nbGVzQXJyYXksIHRyaUluZGV4KjkrNik7XG5cblx0XHRcdGNvbnN0IGludGVyc2VjdGlvblBvaW50ID0gQlZILmludGVyc2VjdFJheVRyaWFuZ2xlKGEsIGIsIGMsIHJheU9yaWdpbiwgcmF5RGlyZWN0aW9uLCBiYWNrZmFjZUN1bGxpbmcpO1xuXG5cdFx0XHRpZighaW50ZXJzZWN0aW9uUG9pbnQpIGNvbnRpbnVlO1xuXHRcdFx0aW50ZXJzZWN0aW5nVHJpYW5nbGVzLnB1c2goe1xuXHRcdFx0XHQvL3RyaWFuZ2xlOiBbYS5jbG9uZSgpLCBiLmNsb25lKCksIGMuY2xvbmUoKV0sXG5cdFx0XHRcdHRyaWFuZ2xlSW5kZXg6IHRyaUluZGV4LFxuXHRcdFx0XHRpbnRlcnNlY3Rpb25Qb2ludDogaW50ZXJzZWN0aW9uUG9pbnQsXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gaW50ZXJzZWN0aW5nVHJpYW5nbGVzO1xuXHR9XG5cdHN0YXRpYyBjYWxjVFZhbHVlcyhtaW5WYWw6bnVtYmVyLCBtYXhWYWw6bnVtYmVyLCByYXlPcmlnaW5Db29yZDpudW1iZXIsIGludmRpcjogbnVtYmVyKTpudW1iZXJbXSB7XG5cdFx0aWYoaW52ZGlyID49IDApIHtcblx0XHRcdHJldHVybiBbKG1pblZhbCAtIHJheU9yaWdpbkNvb3JkKSAqIGludmRpciwgKG1heFZhbCAtIHJheU9yaWdpbkNvb3JkKSAqIGludmRpcl07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBbKG1heFZhbCAtIHJheU9yaWdpbkNvb3JkKSAqIGludmRpciwgKG1pblZhbCAtIHJheU9yaWdpbkNvb3JkKSAqIGludmRpcl07XG5cdFx0fVxuXHR9XG5cblx0c3RhdGljIGludGVyc2VjdE5vZGVCb3gocmF5T3JpZ2luOiBCVkhWZWN0b3IzLCBpbnZSYXlEaXJlY3Rpb246IEJWSFZlY3RvcjMsIG5vZGU6IEJWSE5vZGUpOmJvb2xlYW4ge1xuXHRcdGxldCBbdG1pbiwgdG1heF06bnVtYmVyW10gPSBCVkguY2FsY1RWYWx1ZXMobm9kZS5leHRlbnRzTWluWzBdLCBub2RlLmV4dGVudHNNYXhbMF0sIHJheU9yaWdpbi54LCBpbnZSYXlEaXJlY3Rpb24ueCk7XG5cdFx0bGV0IFt0eW1pbiwgdHltYXhdOm51bWJlcltdID0gQlZILmNhbGNUVmFsdWVzKG5vZGUuZXh0ZW50c01pblsxXSwgbm9kZS5leHRlbnRzTWF4WzFdLCByYXlPcmlnaW4ueSwgaW52UmF5RGlyZWN0aW9uLnkpO1xuXG5cdFx0aWYodG1pbiA+IHR5bWF4IHx8IHR5bWluID4gdG1heCkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0Ly8gVGhlc2UgbGluZXMgYWxzbyBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgdG1pbiBvciB0bWF4IGlzIE5hTlxuXHRcdC8vIChyZXN1bHQgb2YgMCAqIEluZmluaXR5KS4geCAhPT0geCByZXR1cm5zIHRydWUgaWYgeCBpcyBOYU5cblx0XHRpZih0eW1pbiA+IHRtaW4gfHwgdG1pbiAhPT0gdG1pbikge1xuXHRcdFx0dG1pbiA9IHR5bWluO1xuXHRcdH1cblxuXHRcdGlmKHR5bWF4IDwgdG1heCB8fCB0bWF4ICE9PSB0bWF4KSB7XG5cdFx0XHR0bWF4ID0gdHltYXg7XG5cdFx0fVxuXG5cdFx0bGV0IFt0em1pbiwgdHptYXhdOm51bWJlcltdID0gQlZILmNhbGNUVmFsdWVzKG5vZGUuZXh0ZW50c01pblsyXSwgbm9kZS5leHRlbnRzTWF4WzJdLCByYXlPcmlnaW4ueiwgaW52UmF5RGlyZWN0aW9uLnopO1xuXG5cdFx0aWYodG1pbiA+IHR6bWF4IHx8IHR6bWluID4gdG1heCkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0aWYodHptYXggPCB0bWF4IHx8IHRtYXggIT09IHRtYXgpIHtcblx0XHRcdHRtYXggPSB0em1heDtcblx0XHR9XG5cblx0XHQvL3JldHVybiBwb2ludCBjbG9zZXN0IHRvIHRoZSByYXkgKHBvc2l0aXZlIHNpZGUpXG5cdFx0aWYodG1heCA8IDApIHJldHVybiBmYWxzZTtcblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0c3RhdGljIGludGVyc2VjdFJheVRyaWFuZ2xlKGE6QlZIVmVjdG9yMywgYjpCVkhWZWN0b3IzLCBjOkJWSFZlY3RvcjMsIHJheU9yaWdpbjpCVkhWZWN0b3IzLCByYXlEaXJlY3Rpb246QlZIVmVjdG9yMywgYmFja2ZhY2VDdWxsaW5nOmJvb2xlYW4pOkJWSFZlY3RvcjMgfCBudWxsIHtcblx0XHRsZXQgZGlmZjpCVkhWZWN0b3IzID0gbmV3IEJWSFZlY3RvcjMoKTtcblx0XHRsZXQgZWRnZTE6QlZIVmVjdG9yMyA9IG5ldyBCVkhWZWN0b3IzKCk7XG5cdFx0bGV0IGVkZ2UyOkJWSFZlY3RvcjMgPSBuZXcgQlZIVmVjdG9yMygpO1xuXHRcdGxldCBub3JtYWw6QlZIVmVjdG9yMyA9IG5ldyBCVkhWZWN0b3IzKCk7XG5cblx0XHQvLyBmcm9tIGh0dHA6Ly93d3cuZ2VvbWV0cmljdG9vbHMuY29tL0xpYk1hdGhlbWF0aWNzL0ludGVyc2VjdGlvbi9XbTVJbnRyUmF5M1RyaWFuZ2xlMy5jcHBcblx0XHRlZGdlMS5zdWJWZWN0b3JzKGIsIGEpO1xuXHRcdGVkZ2UyLnN1YlZlY3RvcnMoYywgYSk7XG5cdFx0bm9ybWFsLmNyb3NzVmVjdG9ycyhlZGdlMSwgZWRnZTIpO1xuXG5cdFx0Ly8gU29sdmUgUSArIHQqRCA9IGIxKkUxICsgYkwqRTIgKFEgPSBrRGlmZiwgRCA9IHJheSBkaXJlY3Rpb24sXG5cdFx0Ly8gRTEgPSBrRWRnZTEsIEUyID0ga0VkZ2UyLCBOID0gQ3Jvc3MoRTEsRTIpKSBieVxuXHRcdC8vICAgfERvdChELE4pfCpiMSA9IHNpZ24oRG90KEQsTikpKkRvdChELENyb3NzKFEsRTIpKVxuXHRcdC8vICAgfERvdChELE4pfCpiMiA9IHNpZ24oRG90KEQsTikpKkRvdChELENyb3NzKEUxLFEpKVxuXHRcdC8vICAgfERvdChELE4pfCp0ID0gLXNpZ24oRG90KEQsTikpKkRvdChRLE4pXG5cdFx0bGV0IERkTjpudW1iZXIgPSByYXlEaXJlY3Rpb24uZG90KG5vcm1hbCk7XG5cdFx0aWYoRGROID09PSAwKSByZXR1cm4gbnVsbDtcblx0XHRpZihEZE4gPiAwICYmIGJhY2tmYWNlQ3VsbGluZykgcmV0dXJuIG51bGw7XG5cdFx0bGV0IHNpZ246bnVtYmVyID0gTWF0aC5zaWduKERkTik7XG5cdFx0RGROICo9IHNpZ247XG5cblx0XHRkaWZmLnN1YlZlY3RvcnMocmF5T3JpZ2luLCBhKTtcblx0XHRjb25zdCBEZFF4RTIgPSBzaWduICogcmF5RGlyZWN0aW9uLmRvdChlZGdlMi5jcm9zc1ZlY3RvcnMoZGlmZiwgZWRnZTIpKTtcblxuXHRcdC8vIGIxIDwgMCwgbm8gaW50ZXJzZWN0aW9uXG5cdFx0aWYoRGRReEUyIDwgMCkgcmV0dXJuIG51bGw7XG5cblx0XHRjb25zdCBEZEUxeFEgPSBzaWduICogcmF5RGlyZWN0aW9uLmRvdChlZGdlMS5jcm9zcyhkaWZmKSk7XG5cblx0XHQvLyBiMiA8IDAsIG5vIGludGVyc2VjdGlvblxuXHRcdGlmKERkRTF4USA8IDApIHJldHVybiBudWxsO1xuXG5cdFx0Ly8gYjErYjIgPiAxLCBubyBpbnRlcnNlY3Rpb25cblx0XHRpZihEZFF4RTIgKyBEZEUxeFEgPiBEZE4pIHJldHVybiBudWxsO1xuXG5cdFx0Ly8gTGluZSBpbnRlcnNlY3RzIHRyaWFuZ2xlLCBjaGVjayBpZiByYXkgZG9lcy5cblx0XHRjb25zdCBRZE46bnVtYmVyID0gLXNpZ24gKiBkaWZmLmRvdChub3JtYWwpO1xuXG5cdFx0Ly8gdCA8IDAsIG5vIGludGVyc2VjdGlvblxuXHRcdGlmKFFkTiA8IDApIHJldHVybiBudWxsO1xuXG5cdFx0Ly8gUmF5IGludGVyc2VjdHMgdHJpYW5nbGUuXG5cdFx0cmV0dXJuIHJheURpcmVjdGlvbi5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKFFkTiAvIERkTikuYWRkKHJheU9yaWdpbik7XG5cdH1cbn1cbiIsImltcG9ydCB7IFZlY3RvciwgWFlaLCBXb3JrUHJvZ3Jlc3MsIEJWSFByb2dyZXNzLCBBc3luY2lmeVBhcmFtcyB9IGZyb20gXCIuL1wiO1xuXG5jb25zdCBFUFNJTE9OID0gMWUtNjtcblxuaW1wb3J0IHsgQlZITm9kZSB9IGZyb20gXCIuL0JWSE5vZGVcIjtcbmltcG9ydCB7IEJWSCB9IGZyb20gXCIuL0JWSFwiO1xuaW1wb3J0IHsgYXN5bmNXb3JrIH0gZnJvbSAnLi91dGlscydcblxuZXhwb3J0IGZ1bmN0aW9uIEJWSEJ1aWxkZXIodHJpYW5nbGVzOnVua25vd24gfCBWZWN0b3JbXVtdIHwgbnVtYmVyW10gfCBGbG9hdDMyQXJyYXksIG1heFRyaWFuZ2xlc1Blck5vZGU6bnVtYmVyID0gMTApIHtcblx0dmFsaWRhdGVNYXhUcmlhbmdsZXNQZXJOb2RlKG1heFRyaWFuZ2xlc1Blck5vZGUpO1xuXHRsZXQgdHJpYW5nbGVzQXJyYXk6RmxvYXQzMkFycmF5ID0gdmFsaWRhdGVUcmlhbmdsZXModHJpYW5nbGVzKTtcblx0bGV0IGJib3hBcnJheTpGbG9hdDMyQXJyYXkgPSBjYWxjQm91bmRpbmdCb3hlcyh0cmlhbmdsZXNBcnJheSk7XG5cdC8vIGNsb25lIGEgaGVscGVyIGFycmF5XG5cdGxldCBiYm94SGVscGVyOkZsb2F0MzJBcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoYmJveEFycmF5Lmxlbmd0aCk7XG5cdGJib3hIZWxwZXIuc2V0KGJib3hBcnJheSk7XG5cblx0Ly8gY3JlYXRlIHRoZSByb290IG5vZGUsIGFkZCBhbGwgdGhlIHRyaWFuZ2xlcyB0byBpdFxuXHRjb25zdCB0cmlhbmdsZUNvdW50Om51bWJlciA9IHRyaWFuZ2xlc0FycmF5Lmxlbmd0aCAvIDk7XG5cdGNvbnN0IGV4dGVudHM6WFlaW10gPSBjYWxjRXh0ZW50cyhiYm94QXJyYXksIDAsIHRyaWFuZ2xlQ291bnQsIEVQU0lMT04pO1xuXHRsZXQgcm9vdE5vZGU6QlZITm9kZSA9IG5ldyBCVkhOb2RlKGV4dGVudHNbMF0sIGV4dGVudHNbMV0sIDAsIHRyaWFuZ2xlQ291bnQsIDApO1xuXHRsZXQgbm9kZXNUb1NwbGl0OkJWSE5vZGVbXSA9IFtyb290Tm9kZV07XG5cdGxldCBub2RlOkJWSE5vZGUgfCB1bmRlZmluZWQ7XG5cblx0d2hpbGUobm9kZSA9IG5vZGVzVG9TcGxpdC5wb3AoKSkge1xuXHRcdGxldCBub2RlcyA9IHNwbGl0Tm9kZShub2RlLCBtYXhUcmlhbmdsZXNQZXJOb2RlLCBiYm94QXJyYXksIGJib3hIZWxwZXIpO1xuXHRcdG5vZGVzVG9TcGxpdC5wdXNoKC4uLm5vZGVzKTtcblx0fVxuXHRcblx0cmV0dXJuIG5ldyBCVkgocm9vdE5vZGUsIGJib3hBcnJheSwgdHJpYW5nbGVzQXJyYXkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQlZIQnVpbGRlckFzeW5jKHRyaWFuZ2xlczp1bmtub3duIHwgVmVjdG9yW11bXSB8IG51bWJlcltdIHwgRmxvYXQzMkFycmF5LCBtYXhUcmlhbmdsZXNQZXJOb2RlOm51bWJlciA9IDEwLCBhc3luY1BhcmFtczpBc3luY2lmeVBhcmFtcyA9IHt9LCBwcm9ncmVzc0NhbGxiYWNrPzoob2JqOkJWSFByb2dyZXNzKSA9PiB2b2lkKTpQcm9taXNlPEJWSD4ge1xuXHR2YWxpZGF0ZU1heFRyaWFuZ2xlc1Blck5vZGUobWF4VHJpYW5nbGVzUGVyTm9kZSk7XG5cdGxldCB0cmlhbmdsZXNBcnJheTpGbG9hdDMyQXJyYXkgPSB2YWxpZGF0ZVRyaWFuZ2xlcyh0cmlhbmdsZXMpO1xuXHRsZXQgYmJveEFycmF5OkZsb2F0MzJBcnJheSA9IGNhbGNCb3VuZGluZ0JveGVzKHRyaWFuZ2xlc0FycmF5KTtcblx0Ly8gY2xvbmUgYSBoZWxwZXIgYXJyYXlcblx0bGV0IGJib3hIZWxwZXI6RmxvYXQzMkFycmF5ID0gbmV3IEZsb2F0MzJBcnJheShiYm94QXJyYXkubGVuZ3RoKTtcblx0YmJveEhlbHBlci5zZXQoYmJveEFycmF5KTtcblxuXHQvLyBjcmVhdGUgdGhlIHJvb3Qgbm9kZSwgYWRkIGFsbCB0aGUgdHJpYW5nbGVzIHRvIGl0XG5cdGNvbnN0IHRyaWFuZ2xlQ291bnQ6bnVtYmVyID0gdHJpYW5nbGVzQXJyYXkubGVuZ3RoIC8gOTtcblx0Y29uc3QgZXh0ZW50czpYWVpbXSA9IGNhbGNFeHRlbnRzKGJib3hBcnJheSwgMCwgdHJpYW5nbGVDb3VudCwgRVBTSUxPTik7XG5cdGxldCByb290Tm9kZTpCVkhOb2RlID0gbmV3IEJWSE5vZGUoZXh0ZW50c1swXSwgZXh0ZW50c1sxXSwgMCwgdHJpYW5nbGVDb3VudCwgMCk7XG5cdGxldCBub2Rlc1RvU3BsaXQ6QlZITm9kZVtdID0gW3Jvb3ROb2RlXTtcblx0bGV0IG5vZGU6QlZITm9kZSB8IHVuZGVmaW5lZDtcblxuXHRsZXQgdGFsbHkgPSAwO1xuXHRhd2FpdCBhc3luY1dvcmsoKCkgPT4ge1xuXHRcdG5vZGUgPSBub2Rlc1RvU3BsaXQucG9wKCk7XG5cdFx0cmV0dXJuIHRhbGx5ICogOSAvIHRyaWFuZ2xlc0FycmF5Lmxlbmd0aDtcblx0fSwgKCkgPT4ge1xuXHRcdGlmKCFub2RlKSByZXR1cm47XG5cdFx0bGV0IG5vZGVzID0gc3BsaXROb2RlKG5vZGUsIG1heFRyaWFuZ2xlc1Blck5vZGUsIGJib3hBcnJheSwgYmJveEhlbHBlcik7XG5cdFx0aWYoIW5vZGVzLmxlbmd0aCkgdGFsbHkgKz0gbm9kZS5lbGVtZW50Q291bnQoKTtcblx0XHRub2Rlc1RvU3BsaXQucHVzaCguLi5ub2Rlcyk7XG5cdH0sIGFzeW5jUGFyYW1zLCBwcm9ncmVzc0NhbGxiYWNrID9cblx0XHQobm9kZXNTcGxpdDpXb3JrUHJvZ3Jlc3MpID0+IHByb2dyZXNzQ2FsbGJhY2soT2JqZWN0LmFzc2lnbih7dHJpYW5nbGVzTGVhZmVkOiB0YWxseX0sIG5vZGVzU3BsaXQpKVxuXHRcdDogdW5kZWZpbmVkXG5cdCk7XG5cdHJldHVybiBuZXcgQlZIKHJvb3ROb2RlLCBiYm94QXJyYXksIHRyaWFuZ2xlc0FycmF5KTtcbn1cblxuZnVuY3Rpb24gc3BsaXROb2RlKG5vZGU6IEJWSE5vZGUsIG1heFRyaWFuZ2xlczpudW1iZXIsIGJib3hBcnJheTpGbG9hdDMyQXJyYXksIGJib3hIZWxwZXI6RmxvYXQzMkFycmF5KTpCVkhOb2RlW10ge1xuXHRjb25zdCBub2RlQ291bnQ6bnVtYmVyID0gbm9kZS5lbGVtZW50Q291bnQoKVxuXHRpZiAobm9kZUNvdW50IDw9IG1heFRyaWFuZ2xlcyB8fCBub2RlQ291bnQgPT09IDApIHJldHVybiBbXTtcblxuXHRsZXQgc3RhcnRJbmRleDpudW1iZXIgPSBub2RlLnN0YXJ0SW5kZXg7XG5cdGxldCBlbmRJbmRleDpudW1iZXIgPSBub2RlLmVuZEluZGV4O1xuXG5cdGxldCBsZWZ0Tm9kZTpudW1iZXJbXVtdID0gWyBbXSxbXSxbXSBdO1xuXHRsZXQgcmlnaHROb2RlOm51bWJlcltdW10gPSBbIFtdLFtdLFtdIF07XG5cdGxldCBleHRlbnRDZW50ZXJzOm51bWJlcltdID0gW25vZGUuY2VudGVyWCgpLCBub2RlLmNlbnRlclkoKSwgbm9kZS5jZW50ZXJaKCldO1xuXG5cdGZvciAobGV0IGkgPSBzdGFydEluZGV4OyBpIDwgZW5kSW5kZXg7IGkrKykge1xuXHRcdGxldCBpZHggPSBpICogNyArIDE7XG5cdFx0Zm9yIChsZXQgaiA9IDA7IGogPCAzOyBqKyspIHtcblx0XHRcdGlmIChiYm94QXJyYXlbaWR4XSArIGJib3hBcnJheVtpZHgrKyArIDNdIDwgZXh0ZW50Q2VudGVyc1tqXSkge1xuXHRcdFx0XHRsZWZ0Tm9kZVtqXS5wdXNoKGkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmlnaHROb2RlW2pdLnB1c2goaSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gY2hlY2sgaWYgd2UgY291bGRuJ3Qgc3BsaXQgdGhlIG5vZGUgYnkgYW55IG9mIHRoZSBheGVzICh4LCB5IG9yIHopLiBoYWx0IGhlcmUsIGRvbnQgdHJ5IHRvIHNwbGl0IGFueSBtb3JlIChjYXVzZSBpdCB3aWxsIGFsd2F5cyBmYWlsLCBhbmQgd2UnbGwgZW50ZXIgYW4gaW5maW5pdGUgbG9vcFxuXHRsZXQgc3BsaXRGYWlsZWQ6Ym9vbGVhbltdID0gW107XG5cdHNwbGl0RmFpbGVkLmxlbmd0aCA9IDM7XG5cblx0c3BsaXRGYWlsZWRbMF0gPSAobGVmdE5vZGVbMF0ubGVuZ3RoID09PSAwKSB8fCAocmlnaHROb2RlWzBdLmxlbmd0aCA9PT0gMCk7XG5cdHNwbGl0RmFpbGVkWzFdID0gKGxlZnROb2RlWzFdLmxlbmd0aCA9PT0gMCkgfHwgKHJpZ2h0Tm9kZVsxXS5sZW5ndGggPT09IDApO1xuXHRzcGxpdEZhaWxlZFsyXSA9IChsZWZ0Tm9kZVsyXS5sZW5ndGggPT09IDApIHx8IChyaWdodE5vZGVbMl0ubGVuZ3RoID09PSAwKTtcblxuXHRpZiAoc3BsaXRGYWlsZWRbMF0gJiYgc3BsaXRGYWlsZWRbMV0gJiYgc3BsaXRGYWlsZWRbMl0pIHJldHVybiBbXTtcblxuXHQvLyBjaG9vc2UgdGhlIGxvbmdlc3Qgc3BsaXQgYXhpcy4gaWYgd2UgY2FuJ3Qgc3BsaXQgYnkgaXQsIGNob29zZSBuZXh0IGJlc3Qgb25lLlxuXHRsZXQgc3BsaXRPcmRlciA9IFswLCAxLCAyXTtcblxuXHRjb25zdCBleHRlbnRzTGVuZ3RoID0gW1xuXHRcdG5vZGUuZXh0ZW50c01heFswXSAtIG5vZGUuZXh0ZW50c01pblswXSxcblx0XHRub2RlLmV4dGVudHNNYXhbMV0gLSBub2RlLmV4dGVudHNNaW5bMV0sXG5cdFx0bm9kZS5leHRlbnRzTWF4WzJdIC0gbm9kZS5leHRlbnRzTWluWzJdLFxuXHRdO1xuXG5cdHNwbGl0T3JkZXIuc29ydCgoYXhpczAsIGF4aXMxKSA9PiBleHRlbnRzTGVuZ3RoW2F4aXMxXSAtIGV4dGVudHNMZW5ndGhbYXhpczBdKTtcblxuXHRsZXQgbGVmdEVsZW1lbnRzOm51bWJlcltdIHwgdW5kZWZpbmVkID0gW107XG5cdGxldCByaWdodEVsZW1lbnRzOm51bWJlcltdIHwgdW5kZWZpbmVkID0gW107XG5cblx0Zm9yIChsZXQgaiA9IDA7IGogPCAzOyBqKyspIHtcblx0XHRjb25zdCBjYW5kaWRhdGVJbmRleCA9IHNwbGl0T3JkZXJbal07XG5cdFx0aWYgKCFzcGxpdEZhaWxlZFtjYW5kaWRhdGVJbmRleF0pIHtcblx0XHRcdGxlZnRFbGVtZW50cyA9IGxlZnROb2RlW2NhbmRpZGF0ZUluZGV4XTtcblx0XHRcdHJpZ2h0RWxlbWVudHMgPSByaWdodE5vZGVbY2FuZGlkYXRlSW5kZXhdO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblxuXHQvLyBzb3J0IHRoZSBlbGVtZW50cyBpbiByYW5nZSAoc3RhcnRJbmRleCwgZW5kSW5kZXgpIGFjY29yZGluZyB0byB3aGljaCBub2RlIHRoZXkgc2hvdWxkIGJlIGF0XG5cdGNvbnN0IG5vZGUwRW5kID0gc3RhcnRJbmRleCArIGxlZnRFbGVtZW50cy5sZW5ndGg7XG5cdFxuXHRjb3B5Qm94ZXMobGVmdEVsZW1lbnRzLCByaWdodEVsZW1lbnRzLCBub2RlLnN0YXJ0SW5kZXgsIGJib3hBcnJheSwgYmJveEhlbHBlcik7XG5cblx0Ly8gY29weSByZXN1bHRzIGJhY2sgdG8gbWFpbiBhcnJheVxuXHRjb25zdCBzdWJBcnIgPSBiYm94SGVscGVyLnN1YmFycmF5KG5vZGUuc3RhcnRJbmRleCAqIDcsIG5vZGUuZW5kSW5kZXggKiA3KTtcblx0YmJveEFycmF5LnNldChzdWJBcnIsIG5vZGUuc3RhcnRJbmRleCAqIDcpO1xuXG5cdC8vIGNyZWF0ZSAyIG5ldyBub2RlcyBmb3IgdGhlIG5vZGUgd2UganVzdCBzcGxpdCwgYW5kIGFkZCBsaW5rcyB0byB0aGVtIGZyb20gdGhlIHBhcmVudCBub2RlXG5cdGNvbnN0IG5vZGUwRXh0ZW50cyA9IGNhbGNFeHRlbnRzKGJib3hBcnJheSwgc3RhcnRJbmRleCwgbm9kZTBFbmQsIEVQU0lMT04pO1xuXHRjb25zdCBub2RlMUV4dGVudHMgPSBjYWxjRXh0ZW50cyhiYm94QXJyYXksIG5vZGUwRW5kLCBlbmRJbmRleCwgRVBTSUxPTik7XG5cblx0Y29uc3Qgbm9kZTAgPSBuZXcgQlZITm9kZShub2RlMEV4dGVudHNbMF0sIG5vZGUwRXh0ZW50c1sxXSwgc3RhcnRJbmRleCwgbm9kZTBFbmQsIG5vZGUubGV2ZWwgKyAxKTtcblx0Y29uc3Qgbm9kZTEgPSBuZXcgQlZITm9kZShub2RlMUV4dGVudHNbMF0sIG5vZGUxRXh0ZW50c1sxXSwgbm9kZTBFbmQsIGVuZEluZGV4LCBub2RlLmxldmVsICsgMSk7XG5cblx0bm9kZS5ub2RlMCA9IG5vZGUwO1xuXHRub2RlLm5vZGUxID0gbm9kZTE7XG5cdG5vZGUuY2xlYXJTaGFwZXMoKTtcblxuXHQvLyBhZGQgbmV3IG5vZGVzIHRvIHRoZSBzcGxpdCBxdWV1ZVxuXHRyZXR1cm4gW25vZGUwLCBub2RlMV07XG59XG5cbmZ1bmN0aW9uIGNvcHlCb3hlcyhsZWZ0RWxlbWVudHM6bnVtYmVyW10sIHJpZ2h0RWxlbWVudHM6bnVtYmVyW10sIHN0YXJ0SW5kZXg6bnVtYmVyLCBiYm94QXJyYXk6RmxvYXQzMkFycmF5LCBiYm94SGVscGVyOkZsb2F0MzJBcnJheSkge1xuXHRjb25zdCBjb25jYXRlbmF0ZWRFbGVtZW50cyA9IGxlZnRFbGVtZW50cy5jb25jYXQocmlnaHRFbGVtZW50cyk7XG5cdGxldCBoZWxwZXJQb3MgPSBzdGFydEluZGV4O1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGNvbmNhdGVuYXRlZEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IGN1cnJFbGVtZW50ID0gY29uY2F0ZW5hdGVkRWxlbWVudHNbaV07XG5cdFx0Y29weUJveChiYm94QXJyYXksIGN1cnJFbGVtZW50LCBiYm94SGVscGVyLCBoZWxwZXJQb3MpO1xuXHRcdGhlbHBlclBvcysrO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNhbGNFeHRlbnRzKGJib3hBcnJheTpGbG9hdDMyQXJyYXksIHN0YXJ0SW5kZXg6bnVtYmVyLCBlbmRJbmRleDpudW1iZXIsIGV4cGFuZEJ5OiBudW1iZXIgPSAwLjApOlhZWltdIHtcblx0aWYgKHN0YXJ0SW5kZXggPj0gZW5kSW5kZXgpIHJldHVybiBbWzAsIDAsIDBdLCBbMCwgMCwgMF1dO1xuXHRsZXQgbWluWCA9IEluZmluaXR5O1xuXHRsZXQgbWluWSA9IEluZmluaXR5O1xuXHRsZXQgbWluWiA9IEluZmluaXR5O1xuXHRsZXQgbWF4WCA9IC1JbmZpbml0eTtcblx0bGV0IG1heFkgPSAtSW5maW5pdHk7XG5cdGxldCBtYXhaID0gLUluZmluaXR5O1xuXHRmb3IgKGxldCBpID0gc3RhcnRJbmRleDsgaSA8IGVuZEluZGV4OyBpKyspIHtcblx0XHRsZXQgaWR4ID0gaSAqIDcgKyAxO1xuXHRcdG1pblggPSBNYXRoLm1pbihiYm94QXJyYXlbaWR4KytdLCBtaW5YKTtcblx0XHRtaW5ZID0gTWF0aC5taW4oYmJveEFycmF5W2lkeCsrXSwgbWluWSk7XG5cdFx0bWluWiA9IE1hdGgubWluKGJib3hBcnJheVtpZHgrK10sIG1pblopO1xuXHRcdG1heFggPSBNYXRoLm1heChiYm94QXJyYXlbaWR4KytdLCBtYXhYKTtcblx0XHRtYXhZID0gTWF0aC5tYXgoYmJveEFycmF5W2lkeCsrXSwgbWF4WSk7XG5cdFx0bWF4WiA9IE1hdGgubWF4KGJib3hBcnJheVtpZHhdLCBtYXhaKTtcblx0fVxuXHRyZXR1cm4gW1xuXHRcdFttaW5YIC0gZXhwYW5kQnksIG1pblkgLSBleHBhbmRCeSwgbWluWiAtIGV4cGFuZEJ5XSxcblx0XHRbbWF4WCArIGV4cGFuZEJ5LCBtYXhZICsgZXhwYW5kQnksIG1heFogKyBleHBhbmRCeV0sXG5cdF07XG59XG5cbmZ1bmN0aW9uIGNhbGNCb3VuZGluZ0JveGVzKHRyaWFuZ2xlc0FycmF5OiBGbG9hdDMyQXJyYXkpOkZsb2F0MzJBcnJheSB7XG5cdGNvbnN0IHRyaWFuZ2xlQ291bnQ6bnVtYmVyID0gdHJpYW5nbGVzQXJyYXkubGVuZ3RoIC8gOTtcblx0Y29uc3QgYmJveEFycmF5OkZsb2F0MzJBcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkodHJpYW5nbGVDb3VudCAqIDcpO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgdHJpYW5nbGVDb3VudDsgaSsrKSB7XG5cdFx0bGV0IGlkeCA9IGkgKiA5O1xuXHRcdGNvbnN0IHAweCA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcblx0XHRjb25zdCBwMHkgPSB0cmlhbmdsZXNBcnJheVtpZHgrK107XG5cdFx0Y29uc3QgcDB6ID0gdHJpYW5nbGVzQXJyYXlbaWR4KytdO1xuXHRcdGNvbnN0IHAxeCA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcblx0XHRjb25zdCBwMXkgPSB0cmlhbmdsZXNBcnJheVtpZHgrK107XG5cdFx0Y29uc3QgcDF6ID0gdHJpYW5nbGVzQXJyYXlbaWR4KytdO1xuXHRcdGNvbnN0IHAyeCA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcblx0XHRjb25zdCBwMnkgPSB0cmlhbmdsZXNBcnJheVtpZHgrK107XG5cdFx0Y29uc3QgcDJ6ID0gdHJpYW5nbGVzQXJyYXlbaWR4XTtcblxuXHRcdGNvbnN0IG1pblggPSBNYXRoLm1pbihwMHgsIHAxeCwgcDJ4KTtcblx0XHRjb25zdCBtaW5ZID0gTWF0aC5taW4ocDB5LCBwMXksIHAyeSk7XG5cdFx0Y29uc3QgbWluWiA9IE1hdGgubWluKHAweiwgcDF6LCBwMnopO1xuXHRcdGNvbnN0IG1heFggPSBNYXRoLm1heChwMHgsIHAxeCwgcDJ4KTtcblx0XHRjb25zdCBtYXhZID0gTWF0aC5tYXgocDB5LCBwMXksIHAyeSk7XG5cdFx0Y29uc3QgbWF4WiA9IE1hdGgubWF4KHAweiwgcDF6LCBwMnopO1xuXHRcdHNldEJveChiYm94QXJyYXksIGksIGksIG1pblgsIG1pblksIG1pblosIG1heFgsIG1heFksIG1heFopO1xuXHR9XG5cblx0cmV0dXJuIGJib3hBcnJheTtcbn1cblxuZnVuY3Rpb24gYnVpbGRUcmlhbmdsZUFycmF5KHRyaWFuZ2xlczpWZWN0b3JbXVtdKTpGbG9hdDMyQXJyYXkge1xuXHRjb25zdCB0cmlhbmdsZXNBcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkodHJpYW5nbGVzLmxlbmd0aCAqIDkpO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgdHJpYW5nbGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3QgcDAgPSB0cmlhbmdsZXNbaV1bMF07XG5cdFx0Y29uc3QgcDEgPSB0cmlhbmdsZXNbaV1bMV07XG5cdFx0Y29uc3QgcDIgPSB0cmlhbmdsZXNbaV1bMl07XG5cdFx0bGV0IGlkeCA9IGkgKiA5O1xuXHRcdHRyaWFuZ2xlc0FycmF5W2lkeCsrXSA9IHAwLng7XG5cdFx0dHJpYW5nbGVzQXJyYXlbaWR4KytdID0gcDAueTtcblx0XHR0cmlhbmdsZXNBcnJheVtpZHgrK10gPSBwMC56O1xuXG5cdFx0dHJpYW5nbGVzQXJyYXlbaWR4KytdID0gcDEueDtcblx0XHR0cmlhbmdsZXNBcnJheVtpZHgrK10gPSBwMS55O1xuXHRcdHRyaWFuZ2xlc0FycmF5W2lkeCsrXSA9IHAxLno7XG5cblx0XHR0cmlhbmdsZXNBcnJheVtpZHgrK10gPSBwMi54O1xuXHRcdHRyaWFuZ2xlc0FycmF5W2lkeCsrXSA9IHAyLnk7XG5cdFx0dHJpYW5nbGVzQXJyYXlbaWR4XSA9IHAyLno7XG5cdH1cblxuXHRyZXR1cm4gdHJpYW5nbGVzQXJyYXk7XG59XG5cbmZ1bmN0aW9uIHNldEJveChiYm94QXJyYXk6RmxvYXQzMkFycmF5LCBwb3M6bnVtYmVyLCB0cmlhbmdsZUlkOm51bWJlciwgbWluWDpudW1iZXIsIG1pblk6bnVtYmVyLCBtaW5aOm51bWJlciwgbWF4WDpudW1iZXIsIG1heFk6bnVtYmVyLCBtYXhaOm51bWJlcik6dm9pZCB7XG5cdGxldCBpZHggPSBwb3MgKiA3O1xuXHRiYm94QXJyYXlbaWR4KytdID0gdHJpYW5nbGVJZDtcblx0YmJveEFycmF5W2lkeCsrXSA9IG1pblg7XG5cdGJib3hBcnJheVtpZHgrK10gPSBtaW5ZO1xuXHRiYm94QXJyYXlbaWR4KytdID0gbWluWjtcblx0YmJveEFycmF5W2lkeCsrXSA9IG1heFg7XG5cdGJib3hBcnJheVtpZHgrK10gPSBtYXhZO1xuXHRiYm94QXJyYXlbaWR4XSA9IG1heFo7XG59XG5cbmZ1bmN0aW9uIGNvcHlCb3goc291cmNlQXJyYXk6RmxvYXQzMkFycmF5LCBzb3VyY2VQb3M6bnVtYmVyLCBkZXN0QXJyYXk6RmxvYXQzMkFycmF5LCBkZXN0UG9zOm51bWJlcik6dm9pZCB7XG5cdGxldCBpZHggPSBkZXN0UG9zICogNztcblx0bGV0IGpkeCA9IHNvdXJjZVBvcyAqIDc7XG5cdGRlc3RBcnJheVtpZHgrK10gPSBzb3VyY2VBcnJheVtqZHgrK107XG5cdGRlc3RBcnJheVtpZHgrK10gPSBzb3VyY2VBcnJheVtqZHgrK107XG5cdGRlc3RBcnJheVtpZHgrK10gPSBzb3VyY2VBcnJheVtqZHgrK107XG5cdGRlc3RBcnJheVtpZHgrK10gPSBzb3VyY2VBcnJheVtqZHgrK107XG5cdGRlc3RBcnJheVtpZHgrK10gPSBzb3VyY2VBcnJheVtqZHgrK107XG5cdGRlc3RBcnJheVtpZHgrK10gPSBzb3VyY2VBcnJheVtqZHgrK107XG5cdGRlc3RBcnJheVtpZHhdID0gc291cmNlQXJyYXlbamR4XTtcbn1cblxuZnVuY3Rpb24gaXNGYWNlQXJyYXkodGVzdEFycmF5OiB1bmtub3duKTogdGVzdEFycmF5IGlzIFZlY3RvcltdW10ge1xuXHRpZighQXJyYXkuaXNBcnJheSh0ZXN0QXJyYXkpKSByZXR1cm4gZmFsc2U7XG5cdGZvcihsZXQgaSA9IDA7IGkgPCB0ZXN0QXJyYXkubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBmYWNlID0gdGVzdEFycmF5W2ldO1xuXHRcdGlmKCFBcnJheS5pc0FycmF5KGZhY2UpKSByZXR1cm4gZmFsc2U7XG5cdFx0aWYoZmFjZS5sZW5ndGggIT09IDMpIHJldHVybiBmYWxzZTtcblx0XHRmb3IobGV0IGogPSAwOyBqIDwgMzsgaisrKSB7XG5cdFx0XHRjb25zdCB2ZXJ0ZXg6VmVjdG9yID0gPFZlY3Rvcj5mYWNlW2pdO1xuXHRcdFx0aWYodHlwZW9mIHZlcnRleC54ICE9PSBcIm51bWJlclwiIHx8IHR5cGVvZiB2ZXJ0ZXgueSAhPT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgdmVydGV4LnogIT09IFwibnVtYmVyXCIpIHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyQXJyYXkodGVzdEFycmF5OiB1bmtub3duKTogdGVzdEFycmF5IGlzIG51bWJlcltdIHtcblx0aWYoIUFycmF5LmlzQXJyYXkodGVzdEFycmF5KSkgcmV0dXJuIGZhbHNlO1xuXHRmb3IobGV0IGkgPSAwOyBpIDwgdGVzdEFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYodHlwZW9mIHRlc3RBcnJheVtpXSAhPT0gXCJudW1iZXJcIikgcmV0dXJuIGZhbHNlO1xuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZU1heFRyaWFuZ2xlc1Blck5vZGUobWF4VHJpYW5nbGVzUGVyTm9kZTpudW1iZXIpOnZvaWQge1xuXHRpZih0eXBlb2YgbWF4VHJpYW5nbGVzUGVyTm9kZSAhPT0gJ251bWJlcicpIHRocm93IG5ldyBFcnJvcihgbWF4VHJpYW5nbGVzUGVyTm9kZSBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyLCBnb3Q6ICR7dHlwZW9mIG1heFRyaWFuZ2xlc1Blck5vZGV9YCk7XG5cdGlmKG1heFRyaWFuZ2xlc1Blck5vZGUgPCAxKSB0aHJvdyBuZXcgRXJyb3IoYG1heFRyaWFuZ2xlc1Blck5vZGUgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gMSwgZ290OiAke21heFRyaWFuZ2xlc1Blck5vZGV9YCk7XG5cdGlmKE51bWJlci5pc05hTihtYXhUcmlhbmdsZXNQZXJOb2RlKSkgdGhyb3cgbmV3IEVycm9yKGBtYXhUcmlhbmdsZXNQZXJOb2RlIGlzIE5hTmApO1xuXHRpZighTnVtYmVyLmlzSW50ZWdlcihtYXhUcmlhbmdsZXNQZXJOb2RlKSkgY29uc29sZS53YXJuKGBtYXhUcmlhbmdsZXNQZXJOb2RlIGlzIGV4cGVjdGVkIHRvIGJlIGFuIGludGVnZXIsIGdvdDogJHttYXhUcmlhbmdsZXNQZXJOb2RlfWApO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZVRyaWFuZ2xlcyh0cmlhbmdsZXM6dW5rbm93biB8IFZlY3RvcltdW10gfCBudW1iZXJbXSB8IEZsb2F0MzJBcnJheSk6IEZsb2F0MzJBcnJheSB7XG5cdGxldCB0cmlhbmdsZXNBcnJheTpGbG9hdDMyQXJyYXk7XG5cdC8vVmVjdG9yW11bXSB8IG51bWJlcltdIHwgRmxvYXQzMkFycmF5XG5cdGlmKEFycmF5LmlzQXJyYXkodHJpYW5nbGVzKSAmJiB0cmlhbmdsZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0Y29uc29sZS53YXJuKGB0cmlhbmdsZXMgYXBwZWFycyB0byBiZSBhbiBhcnJheSB3aXRoIDAgZWxlbWVudHMuYCk7XG5cdH1cblx0aWYoaXNGYWNlQXJyYXkodHJpYW5nbGVzKSkge1xuXHRcdHRyaWFuZ2xlc0FycmF5ID0gYnVpbGRUcmlhbmdsZUFycmF5KHRyaWFuZ2xlcyk7XG5cdH0gZWxzZSBpZiAodHJpYW5nbGVzIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5KSB7XG5cdFx0dHJpYW5nbGVzQXJyYXkgPSB0cmlhbmdsZXM7XG5cdH0gZWxzZSBpZiAoaXNOdW1iZXJBcnJheSh0cmlhbmdsZXMpKSB7XG5cdFx0dHJpYW5nbGVzQXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KHRyaWFuZ2xlcylcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYHRyaWFuZ2xlcyBtdXN0IGJlIG9mIHR5cGUgVmVjdG9yW11bXSB8IG51bWJlcltdIHwgRmxvYXQzMkFycmF5LCBnb3Q6ICR7dHlwZW9mIHRyaWFuZ2xlc31gKTtcblx0fVxuXHRyZXR1cm4gdHJpYW5nbGVzQXJyYXlcbn1cbiIsImltcG9ydCB7IFhZWiB9IGZyb20gXCIuL1wiO1xuXG5leHBvcnQgY2xhc3MgQlZITm9kZSB7XG5cdGV4dGVudHNNaW46IFhZWjtcblx0ZXh0ZW50c01heDogWFlaO1xuXHRzdGFydEluZGV4OiBudW1iZXI7XG5cdGVuZEluZGV4OiBudW1iZXI7XG5cdGxldmVsOiBudW1iZXI7XG5cdG5vZGUwOiBCVkhOb2RlIHwgbnVsbDtcblx0bm9kZTE6IEJWSE5vZGUgfCBudWxsO1xuXHRjb25zdHJ1Y3RvcihleHRlbnRzTWluOiBYWVosIGV4dGVudHNNYXg6IFhZWiwgc3RhcnRJbmRleDogbnVtYmVyLCBlbmRJbmRleDogbnVtYmVyLCBsZXZlbDogbnVtYmVyKSB7XG5cdFx0dGhpcy5leHRlbnRzTWluID0gZXh0ZW50c01pbjtcblx0XHR0aGlzLmV4dGVudHNNYXggPSBleHRlbnRzTWF4O1xuXHRcdHRoaXMuc3RhcnRJbmRleCA9IHN0YXJ0SW5kZXg7XG5cdFx0dGhpcy5lbmRJbmRleCA9IGVuZEluZGV4O1xuXHRcdHRoaXMubGV2ZWwgPSBsZXZlbDtcblx0XHR0aGlzLm5vZGUwID0gbnVsbDtcblx0XHR0aGlzLm5vZGUxID0gbnVsbDtcblx0fVxuXHRzdGF0aWMgZnJvbU9iaih7ZXh0ZW50c01pbiwgZXh0ZW50c01heCwgc3RhcnRJbmRleCwgZW5kSW5kZXgsIGxldmVsLCBub2RlMCwgbm9kZTF9OmFueSkge1xuXHRcdGNvbnN0IHRlbXBOb2RlID0gbmV3IEJWSE5vZGUoZXh0ZW50c01pbiwgZXh0ZW50c01heCwgc3RhcnRJbmRleCwgZW5kSW5kZXgsIGxldmVsKTtcblx0XHRpZihub2RlMCkgdGVtcE5vZGUubm9kZTAgPSBCVkhOb2RlLmZyb21PYmoobm9kZTApO1xuXHRcdGlmKG5vZGUxKSB0ZW1wTm9kZS5ub2RlMSA9IEJWSE5vZGUuZnJvbU9iaihub2RlMSk7XG5cdFx0cmV0dXJuIHRlbXBOb2RlO1xuXHR9XG5cdGVsZW1lbnRDb3VudCgpIHtcblx0XHRyZXR1cm4gdGhpcy5lbmRJbmRleCAtIHRoaXMuc3RhcnRJbmRleDtcblx0fVxuXG5cdGNlbnRlclgoKSB7XG5cdFx0cmV0dXJuICh0aGlzLmV4dGVudHNNaW5bMF0gKyB0aGlzLmV4dGVudHNNYXhbMF0pO1xuXHR9XG5cblx0Y2VudGVyWSgpIHtcblx0XHRyZXR1cm4gKHRoaXMuZXh0ZW50c01pblsxXSArIHRoaXMuZXh0ZW50c01heFsxXSk7XG5cdH1cblxuXHRjZW50ZXJaKCkge1xuXHRcdHJldHVybiAodGhpcy5leHRlbnRzTWluWzJdICsgdGhpcy5leHRlbnRzTWF4WzJdKTtcblx0fVxuXG5cdGNsZWFyU2hhcGVzKCkge1xuXHRcdHRoaXMuc3RhcnRJbmRleCA9IC0xO1xuXHRcdHRoaXMuZW5kSW5kZXggPSAtMTtcblx0fVxufVxuIiwiZXhwb3J0IGNsYXNzIEJWSFZlY3RvcjMgIHtcblx0eDogbnVtYmVyID0gMDtcblx0eTogbnVtYmVyID0gMDtcblx0ejogbnVtYmVyID0gMDtcblx0Y29uc3RydWN0b3IoeDpudW1iZXIgPSAwLCB5Om51bWJlciA9IDAsIHo6bnVtYmVyID0gMCkge1xuXHRcdHRoaXMueCA9IHg7XG5cdFx0dGhpcy55ID0geTtcblx0XHR0aGlzLnogPSB6O1xuXHR9XG5cdGNvcHkodjpCVkhWZWN0b3IzKSB7XG5cdFx0dGhpcy54ID0gdi54O1xuXHRcdHRoaXMueSA9IHYueTtcblx0XHR0aGlzLnogPSB2Lno7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0c2V0RnJvbUFycmF5KGFycmF5OkZsb2F0MzJBcnJheSwgZmlyc3RFbGVtZW50UG9zOm51bWJlcikge1xuXHRcdHRoaXMueCA9IGFycmF5W2ZpcnN0RWxlbWVudFBvc107XG5cdFx0dGhpcy55ID0gYXJyYXlbZmlyc3RFbGVtZW50UG9zKzFdO1xuXHRcdHRoaXMueiA9IGFycmF5W2ZpcnN0RWxlbWVudFBvcysyXTtcblx0fVxuXHRzZXRGcm9tQXJyYXlOb09mZnNldChhcnJheTpudW1iZXJbXSkge1xuXHRcdHRoaXMueCA9IGFycmF5WzBdO1xuXHRcdHRoaXMueSA9IGFycmF5WzFdO1xuXHRcdHRoaXMueiA9IGFycmF5WzJdO1xuXHR9XG5cblx0c2V0RnJvbUFyZ3MoYTpudW1iZXIsIGI6bnVtYmVyLCBjOm51bWJlcikge1xuXHRcdHRoaXMueCA9IGE7XG5cdFx0dGhpcy55ID0gYjtcblx0XHR0aGlzLnogPSBjO1xuXHR9XG5cdGFkZCh2OkJWSFZlY3RvcjMpIHtcblx0XHR0aGlzLnggKz0gdi54O1xuXHRcdHRoaXMueSArPSB2Lnk7XG5cdFx0dGhpcy56ICs9IHYuejtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRtdWx0aXBseVNjYWxhcihzY2FsYXI6bnVtYmVyKSB7XG5cdFx0dGhpcy54ICo9IHNjYWxhcjtcblx0XHR0aGlzLnkgKj0gc2NhbGFyO1xuXHRcdHRoaXMueiAqPSBzY2FsYXI7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0c3ViVmVjdG9ycyhhOkJWSFZlY3RvcjMsIGI6QlZIVmVjdG9yMykge1xuXHRcdHRoaXMueCA9IGEueCAtIGIueDtcblx0XHR0aGlzLnkgPSBhLnkgLSBiLnk7XG5cdFx0dGhpcy56ID0gYS56IC0gYi56O1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdGRvdCh2OkJWSFZlY3RvcjMpIHtcblx0XHRyZXR1cm4gdGhpcy54ICogdi54ICsgdGhpcy55ICogdi55ICsgdGhpcy56ICogdi56O1xuXHR9XG5cdGNyb3NzKHY6QlZIVmVjdG9yMykge1xuXHRcdGNvbnN0IHggPSB0aGlzLngsIHkgPSB0aGlzLnksIHogPSB0aGlzLno7XG5cdFx0dGhpcy54ID0geSAqIHYueiAtIHogKiB2Lnk7XG5cdFx0dGhpcy55ID0geiAqIHYueCAtIHggKiB2Lno7XG5cdFx0dGhpcy56ID0geCAqIHYueSAtIHkgKiB2Lng7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0Y3Jvc3NWZWN0b3JzKGE6QlZIVmVjdG9yMywgYjpCVkhWZWN0b3IzKSB7XG5cdFx0Y29uc3QgYXggPSBhLngsIGF5ID0gYS55LCBheiA9IGEuejtcblx0XHRjb25zdCBieCA9IGIueCwgYnkgPSBiLnksIGJ6ID0gYi56O1xuXHRcdHRoaXMueCA9IGF5ICogYnogLSBheiAqIGJ5O1xuXHRcdHRoaXMueSA9IGF6ICogYnggLSBheCAqIGJ6O1xuXHRcdHRoaXMueiA9IGF4ICogYnkgLSBheSAqIGJ4O1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdGNsb25lKCkge1xuXHRcdHJldHVybiBuZXcgQlZIVmVjdG9yMyh0aGlzLngsIHRoaXMueSwgdGhpcy56KTtcblx0fVxuXHRzdGF0aWMgZnJvbUFueShwb3RlbnRpYWxWZWN0b3I6YW55KTpCVkhWZWN0b3IzIHtcblx0XHRpZihwb3RlbnRpYWxWZWN0b3IgaW5zdGFuY2VvZiBCVkhWZWN0b3IzKSB7XG5cdFx0XHRyZXR1cm4gcG90ZW50aWFsVmVjdG9yO1xuXHRcdH0gZWxzZSBpZiAocG90ZW50aWFsVmVjdG9yLnggIT09IHVuZGVmaW5lZCAmJiBwb3RlbnRpYWxWZWN0b3IueCAhPT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIG5ldyBCVkhWZWN0b3IzKHBvdGVudGlhbFZlY3Rvci54LCBwb3RlbnRpYWxWZWN0b3IueSwgcG90ZW50aWFsVmVjdG9yLnopO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ291bGRuJ3QgY29udmVydCB0byBCVkhWZWN0b3IzLlwiKTtcblx0XHR9XG5cdH1cbn1cbiIsImV4cG9ydCAqIGZyb20gJy4vQlZIJztcbmV4cG9ydCAqIGZyb20gJy4vQlZIQnVpbGRlcic7XG5leHBvcnQgKiBmcm9tICcuL0JWSE5vZGUnO1xuZXhwb3J0ICogZnJvbSAnLi9CVkhWZWN0b3IzJztcblxuZXhwb3J0IGludGVyZmFjZSBYWVoge1xuXHQwOiBudW1iZXI7XG5cdDE6IG51bWJlcjtcblx0MjogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFZlY3RvciB7XG5cdHg6IG51bWJlcjtcblx0eTogbnVtYmVyO1xuXHR6OiBudW1iZXI7XG59XG5cbmV4cG9ydCB0eXBlIEV2YWx1YXRvciA9ICgpID0+IG51bWJlcjtcbmV4cG9ydCB0eXBlIFdvcmsgPSAoKSA9PiB2b2lkO1xuZXhwb3J0IHR5cGUgV29ya1Byb2dyZXNzID0ge25vZGVzU3BsaXQ6IG51bWJlcn07XG5leHBvcnQgdHlwZSBXb3JrUHJvZ3Jlc3NDYWxsYmFjayA9IChwcm9ncmVzc09iajpXb3JrUHJvZ3Jlc3MpID0+IHZvaWQ7XG5leHBvcnQgdHlwZSBCVkhQcm9ncmVzcyA9IHtub2Rlc1NwbGl0OiBudW1iZXIsIHRyaWFuZ2xlc0xlYWZlZDogbnVtYmVyfTtcbmV4cG9ydCB0eXBlIEFzeW5jaWZ5UGFyYW1zID0ge21zPzogbnVtYmVyLCBzdGVwcz86IG51bWJlcn07XG4iLCJpbXBvcnQgeyBFdmFsdWF0b3IsIFdvcmssIEFzeW5jaWZ5UGFyYW1zLCBXb3JrUHJvZ3Jlc3NDYWxsYmFjayB9IGZyb20gJy4vJztcbmltcG9ydCB7IEJWSE5vZGUgfSBmcm9tICcuL0JWSE5vZGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gY291bnROb2Rlcyhub2RlOkJWSE5vZGUsIGNvdW50Om51bWJlciA9IDApOm51bWJlciB7XG5cdGNvdW50ICs9IDE7XG5cdGlmKG5vZGUubm9kZTApIHtcblx0XHRjb3VudCArPSBjb3VudE5vZGVzKG5vZGUubm9kZTApO1xuXHR9XG5cdGlmKG5vZGUubm9kZTEpIHtcblx0XHRjb3VudCArPSBjb3VudE5vZGVzKG5vZGUubm9kZTEpO1xuXHR9XG5cdGlmKChub2RlIGFzIGFueSkuX25vZGUwKSB7XG5cdFx0Y291bnQgKz0gY291bnROb2Rlcygobm9kZSBhcyBhbnkpLl9ub2RlMCk7XG5cdH1cblx0aWYoKG5vZGUgYXMgYW55KS5fbm9kZTEpIHtcblx0XHRjb3VudCArPSBjb3VudE5vZGVzKChub2RlIGFzIGFueSkuX25vZGUxKTtcblx0fVxuXHRyZXR1cm4gY291bnQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhc3luY1dvcmsod29ya0NoZWNrOkV2YWx1YXRvciwgd29yazpXb3JrLCBvcHRpb25zOkFzeW5jaWZ5UGFyYW1zLCBwcm9ncmVzc0NhbGxiYWNrPzpXb3JrUHJvZ3Jlc3NDYWxsYmFjayk6UHJvbWlzZTx2b2lkPiB7XG5cdGlmKG9wdGlvbnMubXMgIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLnN0ZXBzICE9PSB1bmRlZmluZWQpIHtcblx0XHRjb25zb2xlLndhcm4oXCJBc3luY2lmeSBnb3QgYm90aCBzdGVwcyBhbmQgbXMsIGRlZmF1bHRpbmcgdG8gc3RlcHMuXCIpO1xuXHR9XG5cdGNvbnN0IHdvcmtlcjpHZW5lcmF0b3IgPSAob3B0aW9ucy5zdGVwcyAhPT0gdW5kZWZpbmVkID8gcGVyY2VudGFnZUFzeW5jaWZ5IDogdGltZUFzeW5jaWZ5KSh3b3JrQ2hlY2ssIHdvcmssIG9wdGlvbnMpO1xuXHRsZXQgZG9uZTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblx0bGV0IG5vZGVzU3BsaXQ6IG51bWJlcjtcblx0d2hpbGUoISh7dmFsdWU6IG5vZGVzU3BsaXQsIGRvbmV9ID0gd29ya2VyLm5leHQoKSwgZG9uZSkpIHtcblx0XHRpZih0eXBlb2YgcHJvZ3Jlc3NDYWxsYmFjayAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdHByb2dyZXNzQ2FsbGJhY2soe25vZGVzU3BsaXR9KTtcblx0XHR9XG5cdFx0YXdhaXQgdGlja2lmeSgpO1xuXHR9XG59XG5cbmZ1bmN0aW9uKiB0aW1lQXN5bmNpZnkod29ya0NoZWNrOkV2YWx1YXRvciwgd29yazpXb3JrLCB7bXM9MTAwMCAvIDMwfTpBc3luY2lmeVBhcmFtcykge1xuXHRsZXQgc1RpbWU6bnVtYmVyID0gRGF0ZS5ub3coKTtcblx0bGV0IG46bnVtYmVyID0gMDtcblx0bGV0IHRocmVzOm51bWJlciA9IDA7XG5cdGxldCBjb3VudDpudW1iZXIgPSAwO1xuXHR3aGlsZSh3b3JrQ2hlY2soKSA8IDEpIHtcblx0XHR3b3JrKCk7XG5cdFx0Y291bnQrKztcblx0XHRpZigrK24gPj0gdGhyZXMpIHtcblx0XHRcdGNvbnN0IGNUaW1lID0gRGF0ZS5ub3coKTtcblx0XHRcdGNvbnN0IHREaWZmID0gY1RpbWUgLSBzVGltZTtcblx0XHRcdGlmKHREaWZmID4gbXMpIHtcblx0XHRcdFx0eWllbGQgY291bnQ7XG5cdFx0XHRcdHRocmVzID0gbiAqIChtcyAvIHREaWZmKTtcblx0XHRcdFx0c1RpbWUgPSBjVGltZTtcblx0XHRcdFx0biA9IDA7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uKiBwZXJjZW50YWdlQXN5bmNpZnkod29ya0NoZWNrOkV2YWx1YXRvciwgd29yazpXb3JrLCB7c3RlcHM9MTB9OkFzeW5jaWZ5UGFyYW1zKSB7XG5cdGlmKHN0ZXBzIDw9IDApIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJBc3luY2lmeSBzdGVwcyB3YXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHplcm9cIik7XG5cdH1cblx0bGV0IGNvdW50Om51bWJlciA9IDA7XG5cdGxldCB0b3RhbE51bWJlcjogbnVtYmVyID0gMDtcblx0bGV0IGxhc3RJbmM6bnVtYmVyID0gMDtcblx0bGV0IHdvcmtQZXJjZW50YWdlOm51bWJlcjtcblx0bGV0IHBlcmNlbnRhZ2U6bnVtYmVyID0gMSAvIHN0ZXBzO1xuXHR3aGlsZSgod29ya1BlcmNlbnRhZ2UgPSB3b3JrQ2hlY2soKSwgd29ya1BlcmNlbnRhZ2UgPCAxKSkge1xuXHRcdHdvcmsoKTtcblx0XHRjb3VudCsrO1xuXHRcdGlmKHdvcmtQZXJjZW50YWdlID4gbGFzdEluYykge1xuXHRcdFx0dG90YWxOdW1iZXIgKz0gMTtcblx0XHRcdHlpZWxkIGNvdW50O1xuXHRcdFx0bGFzdEluYyA9IHdvcmtQZXJjZW50YWdlICsgcGVyY2VudGFnZTtcblx0XHR9XG5cdH1cblx0Y29uc29sZS5sb2coXCJUb3RhbFwiLCB0b3RhbE51bWJlcik7XG59XG5cblxuXG5jb25zdCB0aWNraWZ5ID0gKCk6UHJvbWlzZTx2b2lkPiA9PiBuZXcgUHJvbWlzZSgocmVzOldvcmspID0+IHNldFRpbWVvdXQocmVzKSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9kb2NzL3dvcmtlci50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==