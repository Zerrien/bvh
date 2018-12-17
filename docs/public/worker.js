/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./docs/worker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./docs/worker.ts":
/*!************************!*\
  !*** ./docs/worker.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _src_1 = __webpack_require__(/*! @src */ "./src/index.ts");
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
        bvh = yield _src_1.BVHBuilderAsync(array, undefined, function (value) {
            self.postMessage({
                message: "progress",
                data: {
                    value
                }
            });
        });
        self.postMessage({
            message: "done"
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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
                intersectionPoint: intersectionPoint
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
        var diff = new BVHVector3_1.BVHVector3();
        var edge1 = new BVHVector3_1.BVHVector3();
        var edge2 = new BVHVector3_1.BVHVector3();
        var normal = new BVHVector3_1.BVHVector3();
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
        var DdQxE2 = sign * rayDirection.dot(edge2.crossVectors(diff, edge2));
        // b1 < 0, no intersection
        if (DdQxE2 < 0)
            return null;
        var DdE1xQ = sign * rayDirection.dot(edge1.cross(diff));
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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const EPSILON = 1e-6;
const BVHNode_1 = __webpack_require__(/*! ./BVHNode */ "./src/BVHNode.ts");
const BVH_1 = __webpack_require__(/*! ./BVH */ "./src/BVH.ts");
const utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
function BVHBuilder(triangles, maxTrianglesPerNode = 10) {
    if (typeof maxTrianglesPerNode !== 'number')
        throw new Error(`maxTrianglesPerNode must be of type number, got: ${typeof maxTrianglesPerNode}`);
    if (maxTrianglesPerNode < 1)
        throw new Error(`maxTrianglesPerNode must be greater than or equal to 1, got: ${maxTrianglesPerNode}`);
    if (Number.isNaN(maxTrianglesPerNode))
        throw new Error(`maxTrianglesPerNode is NaN`);
    if (!Number.isInteger(maxTrianglesPerNode))
        console.warn(`maxTrianglesPerNode is expected to be an integer, got: ${maxTrianglesPerNode}`);
    //Vector[][] | number[] | Float32Array
    let trianglesArray = triangles instanceof Float32Array ? triangles : buildTriangleArray(triangles);
    let bboxArray = calcBoundingBoxes(trianglesArray);
    // clone a helper array
    let bboxHelper = new Float32Array(bboxArray.length);
    bboxHelper.set(bboxArray);
    // create the root node, add all the triangles to it
    var triangleCount = trianglesArray.length / 9;
    var extents = calcExtents(bboxArray, 0, triangleCount, EPSILON);
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
function BVHBuilderAsync(triangles, maxTrianglesPerNode = 10, progressCallback) {
    return __awaiter(this, void 0, void 0, function* () {
        //Vector[][] | number[] | Float32Array
        let trianglesArray = triangles instanceof Float32Array ? triangles : buildTriangleArray(triangles);
        let bboxArray = calcBoundingBoxes(trianglesArray);
        // clone a helper array
        let bboxHelper = new Float32Array(bboxArray.length);
        bboxHelper.set(bboxArray);
        // create the root node, add all the triangles to it
        var triangleCount = trianglesArray.length / 9;
        var extents = calcExtents(bboxArray, 0, triangleCount, EPSILON);
        let rootNode = new BVHNode_1.BVHNode(extents[0], extents[1], 0, triangleCount, 0);
        let nodesToSplit = [rootNode];
        let node;
        let tally = 0;
        yield utils_1.asyncWork(() => {
            node = nodesToSplit.pop();
            return node !== undefined;
        }, () => {
            if (!node)
                return;
            let nodes = splitNode(node, maxTrianglesPerNode, bboxArray, bboxHelper);
            if (!nodes.length)
                tally += node.elementCount();
            nodesToSplit.push(...nodes);
        }, progressCallback ?
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
    let objectCenter = [];
    objectCenter.length = 3;
    for (let i = startIndex; i < endIndex; i++) {
        objectCenter[0] = (bboxArray[i * 7 + 1] + bboxArray[i * 7 + 4]) * 0.5; // center = (min + max) / 2
        objectCenter[1] = (bboxArray[i * 7 + 2] + bboxArray[i * 7 + 5]) * 0.5; // center = (min + max) / 2
        objectCenter[2] = (bboxArray[i * 7 + 3] + bboxArray[i * 7 + 6]) * 0.5; // center = (min + max) / 2
        for (let j = 0; j < 3; j++) {
            if (objectCenter[j] < extentCenters[j]) {
                leftNode[j].push(i);
            }
            else {
                rightNode[j].push(i);
            }
        }
    }
    // check if we couldn't split the node by any of the axes (x, y or z). halt here, dont try to split any more (cause it will always fail, and we'll enter an infinite loop
    var splitFailed = [];
    splitFailed.length = 3;
    splitFailed[0] = (leftNode[0].length === 0) || (rightNode[0].length === 0);
    splitFailed[1] = (leftNode[1].length === 0) || (rightNode[1].length === 0);
    splitFailed[2] = (leftNode[2].length === 0) || (rightNode[2].length === 0);
    if (splitFailed[0] && splitFailed[1] && splitFailed[2])
        return [];
    // choose the longest split axis. if we can't split by it, choose next best one.
    var splitOrder = [0, 1, 2];
    var extentsLength = [
        node.extentsMax[0] - node.extentsMin[0],
        node.extentsMax[1] - node.extentsMin[1],
        node.extentsMax[2] - node.extentsMin[2]
    ];
    splitOrder.sort((axis0, axis1) => extentsLength[axis1] - extentsLength[axis0]);
    let leftElements = [];
    let rightElements = [];
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
    var node0 = new BVHNode_1.BVHNode(node0Extents[0], node0Extents[1], node0Start, node0End, node.level + 1);
    var node1 = new BVHNode_1.BVHNode(node1Extents[0], node1Extents[1], node1Start, node1End, node.level + 1);
    node.node0 = node0;
    node.node1 = node1;
    node.clearShapes();
    // add new nodes to the split queue
    return [node0, node1];
}
function copyBoxes(leftElements, rightElements, startIndex, bboxArray, bboxHelper) {
    var concatenatedElements = leftElements.concat(rightElements);
    var helperPos = startIndex;
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
        minX = Math.min(bboxArray[i * 7 + 1], minX);
        minY = Math.min(bboxArray[i * 7 + 2], minY);
        minZ = Math.min(bboxArray[i * 7 + 3], minZ);
        maxX = Math.max(bboxArray[i * 7 + 4], maxX);
        maxY = Math.max(bboxArray[i * 7 + 5], maxY);
        maxZ = Math.max(bboxArray[i * 7 + 6], maxZ);
    }
    return [
        [minX - expandBy, minY - expandBy, minZ - expandBy],
        [maxX + expandBy, maxY + expandBy, maxZ + expandBy]
    ];
}
function calcBoundingBoxes(trianglesArray) {
    const triangleCount = trianglesArray.length / 9;
    const bboxArray = new Float32Array(triangleCount * 7);
    for (let i = 0; i < triangleCount; i++) {
        const p0x = trianglesArray[i * 9];
        const p0y = trianglesArray[i * 9 + 1];
        const p0z = trianglesArray[i * 9 + 2];
        const p1x = trianglesArray[i * 9 + 3];
        const p1y = trianglesArray[i * 9 + 4];
        const p1z = trianglesArray[i * 9 + 5];
        const p2x = trianglesArray[i * 9 + 6];
        const p2y = trianglesArray[i * 9 + 7];
        const p2z = trianglesArray[i * 9 + 8];
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
        trianglesArray[i * 9] = p0.x;
        trianglesArray[i * 9 + 1] = p0.y;
        trianglesArray[i * 9 + 2] = p0.z;
        trianglesArray[i * 9 + 3] = p1.x;
        trianglesArray[i * 9 + 4] = p1.y;
        trianglesArray[i * 9 + 5] = p1.z;
        trianglesArray[i * 9 + 6] = p2.x;
        trianglesArray[i * 9 + 7] = p2.y;
        trianglesArray[i * 9 + 8] = p2.z;
    }
    return trianglesArray;
}
function setBox(bboxArray, pos, triangleId, minX, minY, minZ, maxX, maxY, maxZ) {
    bboxArray[pos * 7] = triangleId;
    bboxArray[pos * 7 + 1] = minX;
    bboxArray[pos * 7 + 2] = minY;
    bboxArray[pos * 7 + 3] = minZ;
    bboxArray[pos * 7 + 4] = maxX;
    bboxArray[pos * 7 + 5] = maxY;
    bboxArray[pos * 7 + 6] = maxZ;
}
function copyBox(sourceArray, sourcePos, destArray, destPos) {
    destArray[destPos * 7] = sourceArray[sourcePos * 7];
    destArray[destPos * 7 + 1] = sourceArray[sourcePos * 7 + 1];
    destArray[destPos * 7 + 2] = sourceArray[sourcePos * 7 + 2];
    destArray[destPos * 7 + 3] = sourceArray[sourcePos * 7 + 3];
    destArray[destPos * 7 + 4] = sourceArray[sourcePos * 7 + 4];
    destArray[destPos * 7 + 5] = sourceArray[sourcePos * 7 + 5];
    destArray[destPos * 7 + 6] = sourceArray[sourcePos * 7 + 6];
}


/***/ }),

/***/ "./src/BVHNode.ts":
/*!************************!*\
  !*** ./src/BVHNode.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
        return (this.extentsMin[0] + this.extentsMax[0]) * 0.5;
    }
    centerY() {
        return (this.extentsMin[1] + this.extentsMax[1]) * 0.5;
    }
    centerZ() {
        return (this.extentsMin[2] + this.extentsMax[2]) * 0.5;
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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./BVH */ "./src/BVH.ts"));
__export(__webpack_require__(/*! ./BVHBuilder */ "./src/BVHBuilder.ts"));
__export(__webpack_require__(/*! ./BVHNode */ "./src/BVHNode.ts"));
__export(__webpack_require__(/*! ./BVHVector3 */ "./src/BVHVector3.ts"));


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
function asyncWork(workCheck, work, progressCallback) {
    return __awaiter(this, void 0, void 0, function* () {
        const a = asyncify(workCheck, work);
        let done;
        let nodesSplit;
        while (!({ value: nodesSplit, done } = a.next(), done)) {
            if (typeof progressCallback !== 'undefined') {
                progressCallback({ nodesSplit });
            }
            yield tickify();
        }
    });
}
exports.asyncWork = asyncWork;
function* asyncify(workCheck, work) {
    let sTime = Date.now();
    let n = 0;
    let thres = 0;
    let count = 0;
    while (workCheck()) {
        work();
        count++;
        if (++n >= thres) {
            if (Date.now() - sTime > 10) {
                yield count;
                sTime = Date.now();
                thres = n;
                n = 0;
            }
        }
    }
}
const tickify = () => new Promise((res) => setTimeout(res));


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZG9jcy93b3JrZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0JWSC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQlZIQnVpbGRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQlZITm9kZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQlZIVmVjdG9yMy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBLGlFQUFvRTtBQUVwRSxJQUFJLEdBQU8sQ0FBQztBQUVaLFNBQVMsR0FBRyxVQUFlLEVBQUMsSUFBSSxFQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxFQUFDOztRQUNoRCxJQUFHLE9B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SUFBSSxHQUFHLFFBQVEsQ0FBQztJQUNwQixJQUFJLElBQUksR0FBRyxRQUFRLENBQUM7SUFDcEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDckIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDckIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDckIsS0FBSyxJQUFJLENBQUMsR0FBRyxVQUFVLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMzQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN4QztJQUNELE9BQU87UUFDTixDQUFDLElBQUksR0FBRyxRQUFRLEVBQUUsSUFBSSxHQUFHLFFBQVEsRUFBRSxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQ25ELENBQUMsSUFBSSxHQUFHLFFBQVEsRUFBRSxJQUFJLEdBQUcsUUFBUSxFQUFFLElBQUksR0FBRyxRQUFRLENBQUM7S0FDbkQsQ0FBQztBQUNILENBQUM7QUFFRCxTQUFTLGlCQUFpQixDQUFDLGNBQTRCO0lBQ3RELE1BQU0sYUFBYSxHQUFVLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sU0FBUyxHQUFnQixJQUFJLFlBQVksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFbkUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN2QyxNQUFNLEdBQUcsR0FBRyxjQUFjLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWxDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzVEO0lBRUQsT0FBTyxTQUFTLENBQUM7QUFDbEIsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQUMsU0FBb0I7SUFDL0MsTUFBTSxjQUFjLEdBQUcsSUFBSSxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUU5RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMxQyxNQUFNLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsTUFBTSxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUzQixjQUFjLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0IsY0FBYyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QixjQUFjLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTdCLGNBQWMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0IsY0FBYyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QixjQUFjLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTdCLGNBQWMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0IsY0FBYyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QixjQUFjLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzdCO0lBRUQsT0FBTyxjQUFjLENBQUM7QUFDdkIsQ0FBQztBQUVELFNBQVMsTUFBTSxDQUFDLFNBQXNCLEVBQUUsR0FBVSxFQUFFLFVBQWlCLEVBQUUsSUFBVyxFQUFFLElBQVcsRUFBRSxJQUFXLEVBQUUsSUFBVyxFQUFFLElBQVcsRUFBRSxJQUFXO0lBQ2xKLFNBQVMsQ0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDO0lBQzlCLFNBQVMsQ0FBQyxHQUFHLEdBQUMsQ0FB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LEVBQUMsVUFBVSxFQUFDLENBQUMsQ0FBQzthQUMvQjtZQUNELE1BQU0sT0FBTyxFQUFFLENBQUM7U0FDaEI7SUFDRixDQUFDO0NBQUE7QUFWRCw4QkFVQztBQUVELFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFtQixFQUFFLElBQVc7SUFDbEQsSUFBSSxLQUFLLEdBQVUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzlCLElBQUksQ0FBQyxHQUFVLENBQUMsQ0FBQztJQUNqQixJQUFJLEtBQUssR0FBVSxDQUFDLENBQUM7SUFDckIsSUFBSSxLQUFLLEdBQVUsQ0FBQyxDQUFDO0lBQ3JCLE9BQU0sU0FBUyxFQUFFLEVBQUU7UUFDbEIsSUFBSSxFQUFFLENBQUM7UUFDUCxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUcsRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFO1lBQ2hCLElBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssR0FBRyxFQUFFLEVBQUU7Z0JBQzNCLE1BQU0sS0FBSyxDQUFDO2dCQUNaLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ25CLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ1YsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNOO1NBQ0Q7S0FDRDtBQUNGLENBQUM7QUFFRCxNQUFNLE9BQU8sR0FBRyxHQUFpQixFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6Ii4vd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9kb2NzL3dvcmtlci50c1wiKTtcbiIsImltcG9ydCB7IEJWSEJ1aWxkZXIsIEJWSEJ1aWxkZXJBc3luYywgQlZILCBCVkhWZWN0b3IzIH0gZnJvbSAnQHNyYyc7XHJcblxyXG5sZXQgYnZoOkJWSDtcclxuXHJcbm9ubWVzc2FnZSA9IGFzeW5jIGZ1bmN0aW9uKHtkYXRhOnttZXNzYWdlLCBkYXRhfX0pIHtcclxuXHRpZihtZXNzYWdlID09PSBcImJ2aF9pbmZvXCIpIHtcclxuXHRcdGJ1aWxkQlZIKGRhdGEuZmFjZXNBcnJheSk7XHJcblx0fSBlbHNlIGlmIChtZXNzYWdlID09PSBcInJheV9jYXN0XCIpIHtcclxuXHRcdHJheUNhc3QoZGF0YS5vcmlnaW4sIGRhdGEuZGlyZWN0aW9uKTtcclxuXHR9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkQlZIKGFycmF5OmFueSApIHtcclxuXHRidmggPSBhd2FpdCBCVkhCdWlsZGVyQXN5bmMoYXJyYXksIHVuZGVmaW5lZCwgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdChzZWxmIGFzIGFueSkucG9zdE1lc3NhZ2Uoe1xyXG5cdFx0XHRtZXNzYWdlOiBcInByb2dyZXNzXCIsXHJcblx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHR2YWx1ZVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHQoc2VsZiBhcyBhbnkpLnBvc3RNZXNzYWdlKHtcclxuXHRcdG1lc3NhZ2U6IFwiZG9uZVwiXHJcblx0fSlcclxufVxyXG5cclxuZnVuY3Rpb24gcmF5Q2FzdChvcmlnaW46YW55LCBkaXJlY3Rpb246YW55KSB7XHJcblx0bGV0IHJlc3VsdCA9IGJ2aC5pbnRlcnNlY3RSYXkob3JpZ2luLCBkaXJlY3Rpb24sIGZhbHNlKTtcclxuXHQoc2VsZiBhcyBhbnkpLnBvc3RNZXNzYWdlKCB7XHJcblx0XHRtZXNzYWdlOiBcInJheV90cmFjZWRcIixcclxuXHRcdGRhdGE6IHJlc3VsdFxyXG5cdH0pO1xyXG59IiwiaW1wb3J0IHsgQlZIVmVjdG9yMyB9IGZyb20gJy4vQlZIVmVjdG9yMyc7XHJcbmltcG9ydCB7IEJWSE5vZGUgfSBmcm9tICcuL0JWSE5vZGUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJWSCB7XHJcblx0cm9vdE5vZGU6IEJWSE5vZGU7XHJcblx0YmJveEFycmF5OiBGbG9hdDMyQXJyYXk7XHJcblx0dHJpYW5nbGVzQXJyYXk6IEZsb2F0MzJBcnJheTtcclxuXHRjb25zdHJ1Y3Rvcihyb290Tm9kZTpCVkhOb2RlLCBib3VuZGluZ0JveEFycmF5OkZsb2F0MzJBcnJheSwgdHJpYW5nbGVBcnJheTpGbG9hdDMyQXJyYXkpIHtcclxuXHRcdHRoaXMucm9vdE5vZGUgPSByb290Tm9kZTtcclxuXHRcdHRoaXMuYmJveEFycmF5ID0gYm91bmRpbmdCb3hBcnJheTtcclxuXHRcdHRoaXMudHJpYW5nbGVzQXJyYXkgPSB0cmlhbmdsZUFycmF5O1xyXG5cdH1cclxuXHRpbnRlcnNlY3RSYXkocmF5T3JpZ2luOmFueSwgcmF5RGlyZWN0aW9uOmFueSwgYmFja2ZhY2VDdWxsaW5nOmJvb2xlYW4gPSB0cnVlKTphbnlbXSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRyYXlPcmlnaW4gPSBCVkhWZWN0b3IzLmZyb21BbnkocmF5T3JpZ2luKTtcclxuXHRcdFx0cmF5RGlyZWN0aW9uID0gQlZIVmVjdG9yMy5mcm9tQW55KHJheURpcmVjdGlvbik7XHJcblx0XHR9IGNhdGNoKGVycm9yKSB7XHJcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJPcmlnaW4gb3IgRGlyZWN0aW9uIGNvdWxkbid0IGJlIGNvbnZlcnRlZCB0byBhIEJWSFZlY3RvcjMuXCIpO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3Qgbm9kZXNUb0ludGVyc2VjdDpCVkhOb2RlW10gPSBbdGhpcy5yb290Tm9kZV07XHJcblx0XHRjb25zdCB0cmlhbmdsZXNJbkludGVyc2VjdGluZ05vZGVzOm51bWJlcltdID0gW107IC8vIGEgbGlzdCBvZiBub2RlcyB0aGF0IGludGVyc2VjdCB0aGUgcmF5IChhY2NvcmRpbmcgdG8gdGhlaXIgYm91bmRpbmcgYm94KVxyXG5cdFx0Y29uc3QgaW50ZXJzZWN0aW5nVHJpYW5nbGVzOm9iamVjdFtdID0gW107XHJcblxyXG5cdFx0Y29uc3QgaW52UmF5RGlyZWN0aW9uID0gbmV3IEJWSFZlY3RvcjMoXHJcblx0XHRcdDEuMCAvIHJheURpcmVjdGlvbi54LFxyXG5cdFx0XHQxLjAgLyByYXlEaXJlY3Rpb24ueSxcclxuXHRcdFx0MS4wIC8gcmF5RGlyZWN0aW9uLnpcclxuXHRcdCk7XHJcblxyXG5cdFx0Ly8gZ28gb3ZlciB0aGUgQlZIIHRyZWUsIGFuZCBleHRyYWN0IHRoZSBsaXN0IG9mIHRyaWFuZ2xlcyB0aGF0IGxpZSBpbiBub2RlcyB0aGF0IGludGVyc2VjdCB0aGUgcmF5LlxyXG5cdFx0Ly8gbm90ZTogdGhlc2UgdHJpYW5nbGVzIG1heSBub3QgaW50ZXJzZWN0IHRoZSByYXkgdGhlbXNlbHZlc1xyXG5cdFx0d2hpbGUobm9kZXNUb0ludGVyc2VjdC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGNvbnN0IG5vZGU6QlZITm9kZSB8IHVuZGVmaW5lZCA9IG5vZGVzVG9JbnRlcnNlY3QucG9wKCk7XHJcblx0XHRcdGlmKCFub2RlKSBjb250aW51ZTtcclxuXHRcdFx0aWYoQlZILmludGVyc2VjdE5vZGVCb3gocmF5T3JpZ2luLCBpbnZSYXlEaXJlY3Rpb24sIG5vZGUpKSB7XHJcblx0XHRcdFx0aWYobm9kZS5ub2RlMCkge1xyXG5cdFx0XHRcdFx0bm9kZXNUb0ludGVyc2VjdC5wdXNoKG5vZGUubm9kZTApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihub2RlLm5vZGUxKSB7XHJcblx0XHRcdFx0XHRub2Rlc1RvSW50ZXJzZWN0LnB1c2gobm9kZS5ub2RlMSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZvcihsZXQgaSA9IG5vZGUuc3RhcnRJbmRleDsgaSA8IG5vZGUuZW5kSW5kZXg7IGkrKykge1xyXG5cdFx0XHRcdFx0dHJpYW5nbGVzSW5JbnRlcnNlY3RpbmdOb2Rlcy5wdXNoKHRoaXMuYmJveEFycmF5W2kqN10pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIG92ZXIgdGhlIGxpc3Qgb2YgY2FuZGlkYXRlIHRyaWFuZ2xlcywgYW5kIGNoZWNrIGVhY2ggb2YgdGhlbSB1c2luZyByYXkgdHJpYW5nbGUgaW50ZXJzZWN0aW9uXHJcblx0XHRsZXQgYTpCVkhWZWN0b3IzID0gbmV3IEJWSFZlY3RvcjMoKTtcclxuXHRcdGxldCBiOkJWSFZlY3RvcjMgPSBuZXcgQlZIVmVjdG9yMygpO1xyXG5cdFx0bGV0IGM6QlZIVmVjdG9yMyA9IG5ldyBCVkhWZWN0b3IzKCk7XHJcblxyXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IHRyaWFuZ2xlc0luSW50ZXJzZWN0aW5nTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgdHJpSW5kZXggPSB0cmlhbmdsZXNJbkludGVyc2VjdGluZ05vZGVzW2ldO1xyXG5cclxuXHRcdFx0YS5zZXRGcm9tQXJyYXkodGhpcy50cmlhbmdsZXNBcnJheSwgdHJpSW5kZXgqOSk7XHJcblx0XHRcdGIuc2V0RnJvbUFycmF5KHRoaXMudHJpYW5nbGVzQXJyYXksIHRyaUluZGV4KjkrMyk7XHJcblx0XHRcdGMuc2V0RnJvbUFycmF5KHRoaXMudHJpYW5nbGVzQXJyYXksIHRyaUluZGV4KjkrNik7XHJcblxyXG5cdFx0XHRjb25zdCBpbnRlcnNlY3Rpb25Qb2ludCA9IEJWSC5pbnRlcnNlY3RSYXlUcmlhbmdsZShhLCBiLCBjLCByYXlPcmlnaW4sIHJheURpcmVjdGlvbiwgYmFja2ZhY2VDdWxsaW5nKTtcclxuXHJcblx0XHRcdGlmKCFpbnRlcnNlY3Rpb25Qb2ludCkgY29udGludWU7XHJcblx0XHRcdGludGVyc2VjdGluZ1RyaWFuZ2xlcy5wdXNoKHtcclxuXHRcdFx0XHQvL3RyaWFuZ2xlOiBbYS5jbG9uZSgpLCBiLmNsb25lKCksIGMuY2xvbmUoKV0sXHJcblx0XHRcdFx0dHJpYW5nbGVJbmRleDogdHJpSW5kZXgsXHJcblx0XHRcdFx0aW50ZXJzZWN0aW9uUG9pbnQ6IGludGVyc2VjdGlvblBvaW50XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBpbnRlcnNlY3RpbmdUcmlhbmdsZXM7XHJcblx0fVxyXG5cdHN0YXRpYyBjYWxjVFZhbHVlcyhtaW5WYWw6bnVtYmVyLCBtYXhWYWw6bnVtYmVyLCByYXlPcmlnaW5Db29yZDpudW1iZXIsIGludmRpcjogbnVtYmVyKTpudW1iZXJbXSB7XHJcblx0XHRpZihpbnZkaXIgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gWyhtaW5WYWwgLSByYXlPcmlnaW5Db29yZCkgKiBpbnZkaXIsIChtYXhWYWwgLSByYXlPcmlnaW5Db29yZCkgKiBpbnZkaXJdO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIFsobWF4VmFsIC0gcmF5T3JpZ2luQ29vcmQpICogaW52ZGlyLCAobWluVmFsIC0gcmF5T3JpZ2luQ29vcmQpICogaW52ZGlyXTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBpbnRlcnNlY3ROb2RlQm94KHJheU9yaWdpbjogQlZIVmVjdG9yMywgaW52UmF5RGlyZWN0aW9uOiBCVkhWZWN0b3IzLCBub2RlOiBCVkhOb2RlKTpib29sZWFuIHtcclxuXHRcdGxldCBbdG1pbiwgdG1heF06bnVtYmVyW10gPSBCVkguY2FsY1RWYWx1ZXMobm9kZS5leHRlbnRzTWluWzBdLCBub2RlLmV4dGVudHNNYXhbMF0sIHJheU9yaWdpbi54LCBpbnZSYXlEaXJlY3Rpb24ueCk7XHJcblx0XHRsZXQgW3R5bWluLCB0eW1heF06bnVtYmVyW10gPSBCVkguY2FsY1RWYWx1ZXMobm9kZS5leHRlbnRzTWluWzFdLCBub2RlLmV4dGVudHNNYXhbMV0sIHJheU9yaWdpbi55LCBpbnZSYXlEaXJlY3Rpb24ueSk7XHJcblxyXG5cdFx0aWYodG1pbiA+IHR5bWF4IHx8IHR5bWluID4gdG1heCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdC8vIFRoZXNlIGxpbmVzIGFsc28gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHRtaW4gb3IgdG1heCBpcyBOYU5cclxuXHRcdC8vIChyZXN1bHQgb2YgMCAqIEluZmluaXR5KS4geCAhPT0geCByZXR1cm5zIHRydWUgaWYgeCBpcyBOYU5cclxuXHRcdGlmKHR5bWluID4gdG1pbiB8fCB0bWluICE9PSB0bWluKSB7XHJcblx0XHRcdHRtaW4gPSB0eW1pbjtcclxuXHRcdH1cclxuXHJcblx0XHRpZih0eW1heCA8IHRtYXggfHwgdG1heCAhPT0gdG1heCkge1xyXG5cdFx0XHR0bWF4ID0gdHltYXg7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IFt0em1pbiwgdHptYXhdOm51bWJlcltdID0gQlZILmNhbGNUVmFsdWVzKG5vZGUuZXh0ZW50c01pblsyXSwgbm9kZS5leHRlbnRzTWF4WzJdLCByYXlPcmlnaW4ueiwgaW52UmF5RGlyZWN0aW9uLnopO1xyXG5cclxuXHRcdGlmKHRtaW4gPiB0em1heCB8fCB0em1pbiA+IHRtYXgpIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRpZih0em1heCA8IHRtYXggfHwgdG1heCAhPT0gdG1heCkge1xyXG5cdFx0XHR0bWF4ID0gdHptYXg7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9yZXR1cm4gcG9pbnQgY2xvc2VzdCB0byB0aGUgcmF5IChwb3NpdGl2ZSBzaWRlKVxyXG5cdFx0aWYodG1heCA8IDApIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBpbnRlcnNlY3RSYXlUcmlhbmdsZShhOkJWSFZlY3RvcjMsIGI6QlZIVmVjdG9yMywgYzpCVkhWZWN0b3IzLCByYXlPcmlnaW46QlZIVmVjdG9yMywgcmF5RGlyZWN0aW9uOkJWSFZlY3RvcjMsIGJhY2tmYWNlQ3VsbGluZzpib29sZWFuKTpCVkhWZWN0b3IzIHwgbnVsbCB7XHJcblx0XHR2YXIgZGlmZjpCVkhWZWN0b3IzID0gbmV3IEJWSFZlY3RvcjMoKTtcclxuXHRcdHZhciBlZGdlMTpCVkhWZWN0b3IzID0gbmV3IEJWSFZlY3RvcjMoKTtcclxuXHRcdHZhciBlZGdlMjpCVkhWZWN0b3IzID0gbmV3IEJWSFZlY3RvcjMoKTtcclxuXHRcdHZhciBub3JtYWw6QlZIVmVjdG9yMyA9IG5ldyBCVkhWZWN0b3IzKCk7XHJcblxyXG5cdFx0Ly8gZnJvbSBodHRwOi8vd3d3Lmdlb21ldHJpY3Rvb2xzLmNvbS9MaWJNYXRoZW1hdGljcy9JbnRlcnNlY3Rpb24vV201SW50clJheTNUcmlhbmdsZTMuY3BwXHJcblx0XHRlZGdlMS5zdWJWZWN0b3JzKGIsIGEpO1xyXG5cdFx0ZWRnZTIuc3ViVmVjdG9ycyhjLCBhKTtcclxuXHRcdG5vcm1hbC5jcm9zc1ZlY3RvcnMoZWRnZTEsIGVkZ2UyKTtcclxuXHJcblx0XHQvLyBTb2x2ZSBRICsgdCpEID0gYjEqRTEgKyBiTCpFMiAoUSA9IGtEaWZmLCBEID0gcmF5IGRpcmVjdGlvbixcclxuXHRcdC8vIEUxID0ga0VkZ2UxLCBFMiA9IGtFZGdlMiwgTiA9IENyb3NzKEUxLEUyKSkgYnlcclxuXHRcdC8vICAgfERvdChELE4pfCpiMSA9IHNpZ24oRG90KEQsTikpKkRvdChELENyb3NzKFEsRTIpKVxyXG5cdFx0Ly8gICB8RG90KEQsTil8KmIyID0gc2lnbihEb3QoRCxOKSkqRG90KEQsQ3Jvc3MoRTEsUSkpXHJcblx0XHQvLyAgIHxEb3QoRCxOKXwqdCA9IC1zaWduKERvdChELE4pKSpEb3QoUSxOKVxyXG5cdFx0bGV0IERkTjpudW1iZXIgPSByYXlEaXJlY3Rpb24uZG90KG5vcm1hbCk7XHJcblx0XHRpZihEZE4gPT09IDApIHJldHVybiBudWxsO1xyXG5cdFx0aWYoRGROID4gMCAmJiBiYWNrZmFjZUN1bGxpbmcpIHJldHVybiBudWxsO1xyXG5cdFx0bGV0IHNpZ246bnVtYmVyID0gTWF0aC5zaWduKERkTik7XHJcblx0XHREZE4gKj0gc2lnbjtcclxuXHJcblx0XHRkaWZmLnN1YlZlY3RvcnMocmF5T3JpZ2luLCBhKTtcclxuXHRcdHZhciBEZFF4RTIgPSBzaWduICogcmF5RGlyZWN0aW9uLmRvdChlZGdlMi5jcm9zc1ZlY3RvcnMoZGlmZiwgZWRnZTIpKTtcclxuXHJcblx0XHQvLyBiMSA8IDAsIG5vIGludGVyc2VjdGlvblxyXG5cdFx0aWYoRGRReEUyIDwgMCkgcmV0dXJuIG51bGw7XHJcblxyXG5cdFx0dmFyIERkRTF4USA9IHNpZ24gKiByYXlEaXJlY3Rpb24uZG90KGVkZ2UxLmNyb3NzKGRpZmYpKTtcclxuXHJcblx0XHQvLyBiMiA8IDAsIG5vIGludGVyc2VjdGlvblxyXG5cdFx0aWYoRGRFMXhRIDwgMCkgcmV0dXJuIG51bGw7XHJcblxyXG5cdFx0Ly8gYjErYjIgPiAxLCBubyBpbnRlcnNlY3Rpb25cclxuXHRcdGlmKERkUXhFMiArIERkRTF4USA+IERkTikgcmV0dXJuIG51bGw7XHJcblxyXG5cdFx0Ly8gTGluZSBpbnRlcnNlY3RzIHRyaWFuZ2xlLCBjaGVjayBpZiByYXkgZG9lcy5cclxuXHRcdGNvbnN0IFFkTjpudW1iZXIgPSAtc2lnbiAqIGRpZmYuZG90KG5vcm1hbCk7XHJcblxyXG5cdFx0Ly8gdCA8IDAsIG5vIGludGVyc2VjdGlvblxyXG5cdFx0aWYoUWROIDwgMCkgcmV0dXJuIG51bGw7XHJcblxyXG5cdFx0Ly8gUmF5IGludGVyc2VjdHMgdHJpYW5nbGUuXHJcblx0XHRyZXR1cm4gcmF5RGlyZWN0aW9uLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoUWROIC8gRGROKS5hZGQocmF5T3JpZ2luKTtcclxuXHR9XHJcbn1cclxuIiwiZGVjbGFyZSBnbG9iYWwge1xyXG5cdGludGVyZmFjZSBYWVoge1xyXG5cdFx0MDogbnVtYmVyLFxyXG5cdFx0MTogbnVtYmVyLFxyXG5cdFx0MjogbnVtYmVyXHJcblx0fVxyXG5cdFxyXG5cdGludGVyZmFjZSBWZWN0b3Ige1xyXG5cdFx0eDogbnVtYmVyO1xyXG5cdFx0eTogbnVtYmVyO1xyXG5cdFx0ejogbnVtYmVyO1xyXG5cdH1cclxuXHJcblx0dHlwZSBFdmFsdWF0b3IgPSAoKSA9PiBib29sZWFuO1xyXG5cdHR5cGUgRWZmb3J0ID0gKCkgPT4gdm9pZDtcclxuXHR0eXBlIFdvcmtQcm9ncmVzcyA9IHtub2Rlc1NwbGl0OiBudW1iZXJ9O1xyXG5cdHR5cGUgV29ya1Byb2dyZXNzQ2FsbGJhY2sgPSAocHJvZ3Jlc3NPYmo6V29ya1Byb2dyZXNzKSA9PiB2b2lkO1xyXG5cdHR5cGUgQlZIUHJvZ3Jlc3MgPSB7bm9kZXNTcGxpdDogbnVtYmVyLCB0cmlhbmdsZXNMZWFmZWQ6IG51bWJlcn07XHJcbn1cclxuXHJcbmNvbnN0IEVQU0lMT04gPSAxZS02O1xyXG5cclxuaW1wb3J0IHsgQlZIVmVjdG9yMyB9IGZyb20gXCIuL0JWSFZlY3RvcjNcIjtcclxuaW1wb3J0IHsgQlZITm9kZSB9IGZyb20gXCIuL0JWSE5vZGVcIjtcclxuaW1wb3J0IHsgQlZIIH0gZnJvbSBcIi4vQlZIXCI7XHJcbmltcG9ydCB7IGFzeW5jV29yayB9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQlZIQnVpbGRlcih0cmlhbmdsZXM6YW55LCBtYXhUcmlhbmdsZXNQZXJOb2RlOm51bWJlciA9IDEwKTpCVkgge1xyXG5cdGlmKHR5cGVvZiBtYXhUcmlhbmdsZXNQZXJOb2RlICE9PSAnbnVtYmVyJykgdGhyb3cgbmV3IEVycm9yKGBtYXhUcmlhbmdsZXNQZXJOb2RlIG11c3QgYmUgb2YgdHlwZSBudW1iZXIsIGdvdDogJHt0eXBlb2YgbWF4VHJpYW5nbGVzUGVyTm9kZX1gKTtcclxuXHRpZihtYXhUcmlhbmdsZXNQZXJOb2RlIDwgMSkgdGhyb3cgbmV3IEVycm9yKGBtYXhUcmlhbmdsZXNQZXJOb2RlIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDEsIGdvdDogJHttYXhUcmlhbmdsZXNQZXJOb2RlfWApO1xyXG5cdGlmKE51bWJlci5pc05hTihtYXhUcmlhbmdsZXNQZXJOb2RlKSkgdGhyb3cgbmV3IEVycm9yKGBtYXhUcmlhbmdsZXNQZXJOb2RlIGlzIE5hTmApO1xyXG5cdGlmKCFOdW1iZXIuaXNJbnRlZ2VyKG1heFRyaWFuZ2xlc1Blck5vZGUpKSBjb25zb2xlLndhcm4oYG1heFRyaWFuZ2xlc1Blck5vZGUgaXMgZXhwZWN0ZWQgdG8gYmUgYW4gaW50ZWdlciwgZ290OiAke21heFRyaWFuZ2xlc1Blck5vZGV9YCk7XHJcblx0Ly9WZWN0b3JbXVtdIHwgbnVtYmVyW10gfCBGbG9hdDMyQXJyYXlcclxuXHRsZXQgdHJpYW5nbGVzQXJyYXk6RmxvYXQzMkFycmF5ID0gdHJpYW5nbGVzIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5ID8gdHJpYW5nbGVzIDogYnVpbGRUcmlhbmdsZUFycmF5KHRyaWFuZ2xlcyk7XHJcblx0bGV0IGJib3hBcnJheTpGbG9hdDMyQXJyYXkgPSBjYWxjQm91bmRpbmdCb3hlcyh0cmlhbmdsZXNBcnJheSk7XHJcblx0Ly8gY2xvbmUgYSBoZWxwZXIgYXJyYXlcclxuXHRsZXQgYmJveEhlbHBlcjpGbG9hdDMyQXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KGJib3hBcnJheS5sZW5ndGgpO1xyXG5cdGJib3hIZWxwZXIuc2V0KGJib3hBcnJheSk7XHJcblxyXG5cdC8vIGNyZWF0ZSB0aGUgcm9vdCBub2RlLCBhZGQgYWxsIHRoZSB0cmlhbmdsZXMgdG8gaXRcclxuXHR2YXIgdHJpYW5nbGVDb3VudDpudW1iZXIgPSB0cmlhbmdsZXNBcnJheS5sZW5ndGggLyA5O1xyXG5cdHZhciBleHRlbnRzOlhZWltdID0gY2FsY0V4dGVudHMoYmJveEFycmF5LCAwLCB0cmlhbmdsZUNvdW50LCBFUFNJTE9OKTtcclxuXHRsZXQgcm9vdE5vZGU6QlZITm9kZSA9IG5ldyBCVkhOb2RlKGV4dGVudHNbMF0sIGV4dGVudHNbMV0sIDAsIHRyaWFuZ2xlQ291bnQsIDApO1xyXG5cdGxldCBub2Rlc1RvU3BsaXQ6QlZITm9kZVtdID0gW3Jvb3ROb2RlXTtcclxuXHRsZXQgbm9kZTpCVkhOb2RlIHwgdW5kZWZpbmVkO1xyXG5cclxuXHR3aGlsZShub2RlID0gbm9kZXNUb1NwbGl0LnBvcCgpKSB7XHJcblx0XHRsZXQgbm9kZXMgPSBzcGxpdE5vZGUobm9kZSwgbWF4VHJpYW5nbGVzUGVyTm9kZSwgYmJveEFycmF5LCBiYm94SGVscGVyKTtcclxuXHRcdG5vZGVzVG9TcGxpdC5wdXNoKC4uLm5vZGVzKTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIG5ldyBCVkgocm9vdE5vZGUsIGJib3hBcnJheSwgdHJpYW5nbGVzQXJyYXkpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQlZIQnVpbGRlckFzeW5jKHRyaWFuZ2xlczphbnksIG1heFRyaWFuZ2xlc1Blck5vZGU6bnVtYmVyID0gMTAsIHByb2dyZXNzQ2FsbGJhY2s/OihvYmo6QlZIUHJvZ3Jlc3MpID0+IHZvaWQpOlByb21pc2U8QlZIPiB7XHJcblx0Ly9WZWN0b3JbXVtdIHwgbnVtYmVyW10gfCBGbG9hdDMyQXJyYXlcclxuXHRsZXQgdHJpYW5nbGVzQXJyYXk6RmxvYXQzMkFycmF5ID0gdHJpYW5nbGVzIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5ID8gdHJpYW5nbGVzIDogYnVpbGRUcmlhbmdsZUFycmF5KHRyaWFuZ2xlcyk7XHJcblx0bGV0IGJib3hBcnJheTpGbG9hdDMyQXJyYXkgPSBjYWxjQm91bmRpbmdCb3hlcyh0cmlhbmdsZXNBcnJheSk7XHJcblx0Ly8gY2xvbmUgYSBoZWxwZXIgYXJyYXlcclxuXHRsZXQgYmJveEhlbHBlcjpGbG9hdDMyQXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KGJib3hBcnJheS5sZW5ndGgpO1xyXG5cdGJib3hIZWxwZXIuc2V0KGJib3hBcnJheSk7XHJcblxyXG5cdC8vIGNyZWF0ZSB0aGUgcm9vdCBub2RlLCBhZGQgYWxsIHRoZSB0cmlhbmdsZXMgdG8gaXRcclxuXHR2YXIgdHJpYW5nbGVDb3VudDpudW1iZXIgPSB0cmlhbmdsZXNBcnJheS5sZW5ndGggLyA5O1xyXG5cdHZhciBleHRlbnRzOlhZWltdID0gY2FsY0V4dGVudHMoYmJveEFycmF5LCAwLCB0cmlhbmdsZUNvdW50LCBFUFNJTE9OKTtcclxuXHRsZXQgcm9vdE5vZGU6QlZITm9kZSA9IG5ldyBCVkhOb2RlKGV4dGVudHNbMF0sIGV4dGVudHNbMV0sIDAsIHRyaWFuZ2xlQ291bnQsIDApO1xyXG5cdGxldCBub2Rlc1RvU3BsaXQ6QlZITm9kZVtdID0gW3Jvb3ROb2RlXTtcclxuXHRsZXQgbm9kZTpCVkhOb2RlIHwgdW5kZWZpbmVkO1xyXG5cclxuXHRsZXQgdGFsbHkgPSAwO1xyXG5cdGF3YWl0IGFzeW5jV29yaygoKSA9PiB7XHJcblx0XHRub2RlID0gbm9kZXNUb1NwbGl0LnBvcCgpO1xyXG5cdFx0cmV0dXJuIG5vZGUgIT09IHVuZGVmaW5lZDtcclxuXHR9LCAoKSA9PiB7XHJcblx0XHRpZighbm9kZSkgcmV0dXJuO1xyXG5cdFx0bGV0IG5vZGVzID0gc3BsaXROb2RlKG5vZGUsIG1heFRyaWFuZ2xlc1Blck5vZGUsIGJib3hBcnJheSwgYmJveEhlbHBlcik7XHJcblx0XHRpZighbm9kZXMubGVuZ3RoKSB0YWxseSArPSBub2RlLmVsZW1lbnRDb3VudCgpO1xyXG5cdFx0bm9kZXNUb1NwbGl0LnB1c2goLi4ubm9kZXMpO1xyXG5cdH0sIHByb2dyZXNzQ2FsbGJhY2sgP1xyXG5cdFx0KG5vZGVzU3BsaXQ6V29ya1Byb2dyZXNzKSA9PiBwcm9ncmVzc0NhbGxiYWNrKE9iamVjdC5hc3NpZ24oe3RyaWFuZ2xlc0xlYWZlZDogdGFsbHl9LCBub2Rlc1NwbGl0KSlcclxuXHRcdDogdW5kZWZpbmVkXHJcblx0KTtcclxuXHRyZXR1cm4gbmV3IEJWSChyb290Tm9kZSwgYmJveEFycmF5LCB0cmlhbmdsZXNBcnJheSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwbGl0Tm9kZShub2RlOiBCVkhOb2RlLCBtYXhUcmlhbmdsZXM6bnVtYmVyLCBiYm94QXJyYXk6RmxvYXQzMkFycmF5LCBiYm94SGVscGVyOkZsb2F0MzJBcnJheSk6QlZITm9kZVtdIHtcclxuXHRjb25zdCBub2RlQ291bnQ6bnVtYmVyID0gbm9kZS5lbGVtZW50Q291bnQoKVxyXG5cdGlmIChub2RlQ291bnQgPD0gbWF4VHJpYW5nbGVzIHx8IG5vZGVDb3VudCA9PT0gMCkgcmV0dXJuIFtdO1xyXG5cclxuXHRsZXQgc3RhcnRJbmRleDpudW1iZXIgPSBub2RlLnN0YXJ0SW5kZXg7XHJcblx0bGV0IGVuZEluZGV4Om51bWJlciA9IG5vZGUuZW5kSW5kZXg7XHJcblxyXG5cdGxldCBsZWZ0Tm9kZTpudW1iZXJbXVtdID0gWyBbXSxbXSxbXSBdO1xyXG5cdGxldCByaWdodE5vZGU6bnVtYmVyW11bXSA9IFsgW10sW10sW10gXTtcclxuXHRsZXQgZXh0ZW50Q2VudGVyczpudW1iZXJbXSA9IFtub2RlLmNlbnRlclgoKSwgbm9kZS5jZW50ZXJZKCksIG5vZGUuY2VudGVyWigpXTtcclxuXHJcblx0bGV0IG9iamVjdENlbnRlcjpudW1iZXJbXSA9IFtdO1xyXG5cdG9iamVjdENlbnRlci5sZW5ndGggPSAzO1xyXG5cclxuXHRmb3IgKGxldCBpID0gc3RhcnRJbmRleDsgaSA8IGVuZEluZGV4OyBpKyspIHtcclxuXHRcdG9iamVjdENlbnRlclswXSA9IChiYm94QXJyYXlbaSAqIDcgKyAxXSArIGJib3hBcnJheVtpICogNyArIDRdKSAqIDAuNTsgLy8gY2VudGVyID0gKG1pbiArIG1heCkgLyAyXHJcblx0XHRvYmplY3RDZW50ZXJbMV0gPSAoYmJveEFycmF5W2kgKiA3ICsgMl0gKyBiYm94QXJyYXlbaSAqIDcgKyA1XSkgKiAwLjU7IC8vIGNlbnRlciA9IChtaW4gKyBtYXgpIC8gMlxyXG5cdFx0b2JqZWN0Q2VudGVyWzJdID0gKGJib3hBcnJheVtpICogNyArIDNdICsgYmJveEFycmF5W2kgKiA3ICsgNl0pICogMC41OyAvLyBjZW50ZXIgPSAobWluICsgbWF4KSAvIDJcclxuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgMzsgaisrKSB7XHJcblx0XHRcdGlmIChvYmplY3RDZW50ZXJbal0gPCBleHRlbnRDZW50ZXJzW2pdKSB7XHJcblx0XHRcdFx0bGVmdE5vZGVbal0ucHVzaChpKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyaWdodE5vZGVbal0ucHVzaChpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gY2hlY2sgaWYgd2UgY291bGRuJ3Qgc3BsaXQgdGhlIG5vZGUgYnkgYW55IG9mIHRoZSBheGVzICh4LCB5IG9yIHopLiBoYWx0IGhlcmUsIGRvbnQgdHJ5IHRvIHNwbGl0IGFueSBtb3JlIChjYXVzZSBpdCB3aWxsIGFsd2F5cyBmYWlsLCBhbmQgd2UnbGwgZW50ZXIgYW4gaW5maW5pdGUgbG9vcFxyXG5cdHZhciBzcGxpdEZhaWxlZDpib29sZWFuW10gPSBbXTtcclxuXHRzcGxpdEZhaWxlZC5sZW5ndGggPSAzO1xyXG5cclxuXHRzcGxpdEZhaWxlZFswXSA9IChsZWZ0Tm9kZVswXS5sZW5ndGggPT09IDApIHx8IChyaWdodE5vZGVbMF0ubGVuZ3RoID09PSAwKTtcclxuXHRzcGxpdEZhaWxlZFsxXSA9IChsZWZ0Tm9kZVsxXS5sZW5ndGggPT09IDApIHx8IChyaWdodE5vZGVbMV0ubGVuZ3RoID09PSAwKTtcclxuXHRzcGxpdEZhaWxlZFsyXSA9IChsZWZ0Tm9kZVsyXS5sZW5ndGggPT09IDApIHx8IChyaWdodE5vZGVbMl0ubGVuZ3RoID09PSAwKTtcclxuXHJcblx0aWYgKHNwbGl0RmFpbGVkWzBdICYmIHNwbGl0RmFpbGVkWzFdICYmIHNwbGl0RmFpbGVkWzJdKSByZXR1cm4gW107XHJcblxyXG5cdC8vIGNob29zZSB0aGUgbG9uZ2VzdCBzcGxpdCBheGlzLiBpZiB3ZSBjYW4ndCBzcGxpdCBieSBpdCwgY2hvb3NlIG5leHQgYmVzdCBvbmUuXHJcblx0dmFyIHNwbGl0T3JkZXIgPSBbMCwgMSwgMl07XHJcblxyXG5cdHZhciBleHRlbnRzTGVuZ3RoID0gW1xyXG5cdFx0bm9kZS5leHRlbnRzTWF4WzBdIC0gbm9kZS5leHRlbnRzTWluWzBdLFxyXG5cdFx0bm9kZS5leHRlbnRzTWF4WzFdIC0gbm9kZS5leHRlbnRzTWluWzFdLFxyXG5cdFx0bm9kZS5leHRlbnRzTWF4WzJdIC0gbm9kZS5leHRlbnRzTWluWzJdXHJcblx0XTtcclxuXHJcblx0c3BsaXRPcmRlci5zb3J0KChheGlzMCwgYXhpczEpID0+IGV4dGVudHNMZW5ndGhbYXhpczFdIC0gZXh0ZW50c0xlbmd0aFtheGlzMF0pO1xyXG5cclxuXHRsZXQgbGVmdEVsZW1lbnRzOm51bWJlcltdIHwgdW5kZWZpbmVkID0gW107XHJcblx0bGV0IHJpZ2h0RWxlbWVudHM6bnVtYmVyW10gfCB1bmRlZmluZWQgPSBbXTtcclxuXHJcblx0Zm9yIChsZXQgaiA9IDA7IGogPCAzOyBqKyspIHtcclxuXHRcdHZhciBjYW5kaWRhdGVJbmRleCA9IHNwbGl0T3JkZXJbal07XHJcblx0XHRpZiAoIXNwbGl0RmFpbGVkW2NhbmRpZGF0ZUluZGV4XSkge1xyXG5cdFx0XHRsZWZ0RWxlbWVudHMgPSBsZWZ0Tm9kZVtjYW5kaWRhdGVJbmRleF07XHJcblx0XHRcdHJpZ2h0RWxlbWVudHMgPSByaWdodE5vZGVbY2FuZGlkYXRlSW5kZXhdO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvLyBzb3J0IHRoZSBlbGVtZW50cyBpbiByYW5nZSAoc3RhcnRJbmRleCwgZW5kSW5kZXgpIGFjY29yZGluZyB0byB3aGljaCBub2RlIHRoZXkgc2hvdWxkIGJlIGF0XHJcblx0dmFyIG5vZGUwU3RhcnQgPSBzdGFydEluZGV4O1xyXG5cdHZhciBub2RlMEVuZCA9IG5vZGUwU3RhcnQgKyBsZWZ0RWxlbWVudHMubGVuZ3RoO1xyXG5cdHZhciBub2RlMVN0YXJ0ID0gbm9kZTBFbmQ7XHJcblx0dmFyIG5vZGUxRW5kID0gZW5kSW5kZXg7XHJcblx0XHJcblx0Y29weUJveGVzKGxlZnRFbGVtZW50cywgcmlnaHRFbGVtZW50cywgbm9kZS5zdGFydEluZGV4LCBiYm94QXJyYXksIGJib3hIZWxwZXIpO1xyXG5cclxuXHQvLyBjb3B5IHJlc3VsdHMgYmFjayB0byBtYWluIGFycmF5XHJcblx0dmFyIHN1YkFyciA9IGJib3hIZWxwZXIuc3ViYXJyYXkobm9kZS5zdGFydEluZGV4ICogNywgbm9kZS5lbmRJbmRleCAqIDcpO1xyXG5cdGJib3hBcnJheS5zZXQoc3ViQXJyLCBub2RlLnN0YXJ0SW5kZXggKiA3KTtcclxuXHJcblx0Ly8gY3JlYXRlIDIgbmV3IG5vZGVzIGZvciB0aGUgbm9kZSB3ZSBqdXN0IHNwbGl0LCBhbmQgYWRkIGxpbmtzIHRvIHRoZW0gZnJvbSB0aGUgcGFyZW50IG5vZGVcclxuXHR2YXIgbm9kZTBFeHRlbnRzID0gY2FsY0V4dGVudHMoYmJveEFycmF5LCBub2RlMFN0YXJ0LCBub2RlMEVuZCwgRVBTSUxPTik7XHJcblx0dmFyIG5vZGUxRXh0ZW50cyA9IGNhbGNFeHRlbnRzKGJib3hBcnJheSwgbm9kZTFTdGFydCwgbm9kZTFFbmQsIEVQU0lMT04pO1xyXG5cclxuXHR2YXIgbm9kZTAgPSBuZXcgQlZITm9kZShub2RlMEV4dGVudHNbMF0sIG5vZGUwRXh0ZW50c1sxXSwgbm9kZTBTdGFydCwgbm9kZTBFbmQsIG5vZGUubGV2ZWwgKyAxKTtcclxuXHR2YXIgbm9kZTEgPSBuZXcgQlZITm9kZShub2RlMUV4dGVudHNbMF0sIG5vZGUxRXh0ZW50c1sxXSwgbm9kZTFTdGFydCwgbm9kZTFFbmQsIG5vZGUubGV2ZWwgKyAxKTtcclxuXHJcblx0bm9kZS5ub2RlMCA9IG5vZGUwO1xyXG5cdG5vZGUubm9kZTEgPSBub2RlMTtcclxuXHRub2RlLmNsZWFyU2hhcGVzKCk7XHJcblxyXG5cdC8vIGFkZCBuZXcgbm9kZXMgdG8gdGhlIHNwbGl0IHF1ZXVlXHJcblx0cmV0dXJuIFtub2RlMCwgbm9kZTFdO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb3B5Qm94ZXMobGVmdEVsZW1lbnRzOm51bWJlcltdLCByaWdodEVsZW1lbnRzOm51bWJlcltdLCBzdGFydEluZGV4Om51bWJlciwgYmJveEFycmF5OkZsb2F0MzJBcnJheSwgYmJveEhlbHBlcjpGbG9hdDMyQXJyYXkpIHtcclxuXHR2YXIgY29uY2F0ZW5hdGVkRWxlbWVudHMgPSBsZWZ0RWxlbWVudHMuY29uY2F0KHJpZ2h0RWxlbWVudHMpO1xyXG5cdHZhciBoZWxwZXJQb3MgPSBzdGFydEluZGV4O1xyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgY29uY2F0ZW5hdGVkRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGxldCBjdXJyRWxlbWVudCA9IGNvbmNhdGVuYXRlZEVsZW1lbnRzW2ldO1xyXG5cdFx0Y29weUJveChiYm94QXJyYXksIGN1cnJFbGVtZW50LCBiYm94SGVscGVyLCBoZWxwZXJQb3MpO1xyXG5cdFx0aGVscGVyUG9zKys7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBjYWxjRXh0ZW50cyhiYm94QXJyYXk6RmxvYXQzMkFycmF5LCBzdGFydEluZGV4Om51bWJlciwgZW5kSW5kZXg6bnVtYmVyLCBleHBhbmRCeTogbnVtYmVyID0gMC4wKTpYWVpbXSB7XHJcblx0aWYgKHN0YXJ0SW5kZXggPj0gZW5kSW5kZXgpIHJldHVybiBbWzAsIDAsIDBdLCBbMCwgMCwgMF1dO1xyXG5cdGxldCBtaW5YID0gSW5maW5pdHk7XHJcblx0bGV0IG1pblkgPSBJbmZpbml0eTtcclxuXHRsZXQgbWluWiA9IEluZmluaXR5O1xyXG5cdGxldCBtYXhYID0gLUluZmluaXR5O1xyXG5cdGxldCBtYXhZID0gLUluZmluaXR5O1xyXG5cdGxldCBtYXhaID0gLUluZmluaXR5O1xyXG5cdGZvciAobGV0IGkgPSBzdGFydEluZGV4OyBpIDwgZW5kSW5kZXg7IGkrKykge1xyXG5cdFx0bWluWCA9IE1hdGgubWluKGJib3hBcnJheVtpKjcrMV0sIG1pblgpO1xyXG5cdFx0bWluWSA9IE1hdGgubWluKGJib3hBcnJheVtpKjcrMl0sIG1pblkpO1xyXG5cdFx0bWluWiA9IE1hdGgubWluKGJib3hBcnJheVtpKjcrM10sIG1pblopO1xyXG5cdFx0bWF4WCA9IE1hdGgubWF4KGJib3hBcnJheVtpKjcrNF0sIG1heFgpO1xyXG5cdFx0bWF4WSA9IE1hdGgubWF4KGJib3hBcnJheVtpKjcrNV0sIG1heFkpO1xyXG5cdFx0bWF4WiA9IE1hdGgubWF4KGJib3hBcnJheVtpKjcrNl0sIG1heFopO1xyXG5cdH1cclxuXHRyZXR1cm4gW1xyXG5cdFx0W21pblggLSBleHBhbmRCeSwgbWluWSAtIGV4cGFuZEJ5LCBtaW5aIC0gZXhwYW5kQnldLFxyXG5cdFx0W21heFggKyBleHBhbmRCeSwgbWF4WSArIGV4cGFuZEJ5LCBtYXhaICsgZXhwYW5kQnldXHJcblx0XTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2FsY0JvdW5kaW5nQm94ZXModHJpYW5nbGVzQXJyYXk6IEZsb2F0MzJBcnJheSk6RmxvYXQzMkFycmF5IHtcclxuXHRjb25zdCB0cmlhbmdsZUNvdW50Om51bWJlciA9IHRyaWFuZ2xlc0FycmF5Lmxlbmd0aCAvIDk7XHJcblx0Y29uc3QgYmJveEFycmF5OkZsb2F0MzJBcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkodHJpYW5nbGVDb3VudCAqIDcpO1xyXG5cclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IHRyaWFuZ2xlQ291bnQ7IGkrKykge1xyXG5cdFx0Y29uc3QgcDB4ID0gdHJpYW5nbGVzQXJyYXlbaSo5XTtcclxuXHRcdGNvbnN0IHAweSA9IHRyaWFuZ2xlc0FycmF5W2kqOSsxXTtcclxuXHRcdGNvbnN0IHAweiA9IHRyaWFuZ2xlc0FycmF5W2kqOSsyXTtcclxuXHRcdGNvbnN0IHAxeCA9IHRyaWFuZ2xlc0FycmF5W2kqOSszXTtcclxuXHRcdGNvbnN0IHAxeSA9IHRyaWFuZ2xlc0FycmF5W2kqOSs0XTtcclxuXHRcdGNvbnN0IHAxeiA9IHRyaWFuZ2xlc0FycmF5W2kqOSs1XTtcclxuXHRcdGNvbnN0IHAyeCA9IHRyaWFuZ2xlc0FycmF5W2kqOSs2XTtcclxuXHRcdGNvbnN0IHAyeSA9IHRyaWFuZ2xlc0FycmF5W2kqOSs3XTtcclxuXHRcdGNvbnN0IHAyeiA9IHRyaWFuZ2xlc0FycmF5W2kqOSs4XTtcclxuXHJcblx0XHRjb25zdCBtaW5YID0gTWF0aC5taW4ocDB4LCBwMXgsIHAyeCk7XHJcblx0XHRjb25zdCBtaW5ZID0gTWF0aC5taW4ocDB5LCBwMXksIHAyeSk7XHJcblx0XHRjb25zdCBtaW5aID0gTWF0aC5taW4ocDB6LCBwMXosIHAyeik7XHJcblx0XHRjb25zdCBtYXhYID0gTWF0aC5tYXgocDB4LCBwMXgsIHAyeCk7XHJcblx0XHRjb25zdCBtYXhZID0gTWF0aC5tYXgocDB5LCBwMXksIHAyeSk7XHJcblx0XHRjb25zdCBtYXhaID0gTWF0aC5tYXgocDB6LCBwMXosIHAyeik7XHJcblx0XHRzZXRCb3goYmJveEFycmF5LCBpLCBpLCBtaW5YLCBtaW5ZLCBtaW5aLCBtYXhYLCBtYXhZLCBtYXhaKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBiYm94QXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJ1aWxkVHJpYW5nbGVBcnJheSh0cmlhbmdsZXM6VmVjdG9yW11bXSk6RmxvYXQzMkFycmF5IHtcclxuXHRjb25zdCB0cmlhbmdsZXNBcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkodHJpYW5nbGVzLmxlbmd0aCAqIDkpO1xyXG5cclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IHRyaWFuZ2xlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0Y29uc3QgcDAgPSB0cmlhbmdsZXNbaV1bMF07XHJcblx0XHRjb25zdCBwMSA9IHRyaWFuZ2xlc1tpXVsxXTtcclxuXHRcdGNvbnN0IHAyID0gdHJpYW5nbGVzW2ldWzJdO1xyXG5cclxuXHRcdHRyaWFuZ2xlc0FycmF5W2kqOV0gPSBwMC54O1xyXG5cdFx0dHJpYW5nbGVzQXJyYXlbaSo5KzFdID0gcDAueTtcclxuXHRcdHRyaWFuZ2xlc0FycmF5W2kqOSsyXSA9IHAwLno7XHJcblxyXG5cdFx0dHJpYW5nbGVzQXJyYXlbaSo5KzNdID0gcDEueDtcclxuXHRcdHRyaWFuZ2xlc0FycmF5W2kqOSs0XSA9IHAxLnk7XHJcblx0XHR0cmlhbmdsZXNBcnJheVtpKjkrNV0gPSBwMS56O1xyXG5cclxuXHRcdHRyaWFuZ2xlc0FycmF5W2kqOSs2XSA9IHAyLng7XHJcblx0XHR0cmlhbmdsZXNBcnJheVtpKjkrN10gPSBwMi55O1xyXG5cdFx0dHJpYW5nbGVzQXJyYXlbaSo5KzhdID0gcDIuejtcclxuXHR9XHJcblxyXG5cdHJldHVybiB0cmlhbmdsZXNBcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0Qm94KGJib3hBcnJheTpGbG9hdDMyQXJyYXksIHBvczpudW1iZXIsIHRyaWFuZ2xlSWQ6bnVtYmVyLCBtaW5YOm51bWJlciwgbWluWTpudW1iZXIsIG1pblo6bnVtYmVyLCBtYXhYOm51bWJlciwgbWF4WTpudW1iZXIsIG1heFo6bnVtYmVyKTp2b2lkIHtcclxuXHRiYm94QXJyYXlbcG9zKjddID0gdHJpYW5nbGVJZDtcclxuXHRiYm94QXJyYXlbcG9zKjcrMV0gPSBtaW5YO1xyXG5cdGJib3hBcnJheVtwb3MqNysyXSA9IG1pblk7XHJcblx0YmJveEFycmF5W3Bvcyo3KzNdID0gbWluWjtcclxuXHRiYm94QXJyYXlbcG9zKjcrNF0gPSBtYXhYO1xyXG5cdGJib3hBcnJheVtwb3MqNys1XSA9IG1heFk7XHJcblx0YmJveEFycmF5W3Bvcyo3KzZdID0gbWF4WjtcclxufVxyXG5cclxuZnVuY3Rpb24gY29weUJveChzb3VyY2VBcnJheTpGbG9hdDMyQXJyYXksIHNvdXJjZVBvczpudW1iZXIsIGRlc3RBcnJheTpGbG9hdDMyQXJyYXksIGRlc3RQb3M6bnVtYmVyKTp2b2lkIHtcclxuXHRkZXN0QXJyYXlbZGVzdFBvcyo3XSA9IHNvdXJjZUFycmF5W3NvdXJjZVBvcyo3XTtcclxuXHRkZXN0QXJyYXlbZGVzdFBvcyo3KzFdID0gc291cmNlQXJyYXlbc291cmNlUG9zKjcrMV07XHJcblx0ZGVzdEFycmF5W2Rlc3RQb3MqNysyXSA9IHNvdXJjZUFycmF5W3NvdXJjZVBvcyo3KzJdO1xyXG5cdGRlc3RBcnJheVtkZXN0UG9zKjcrM10gPSBzb3VyY2VBcnJheVtzb3VyY2VQb3MqNyszXTtcclxuXHRkZXN0QXJyYXlbZGVzdFBvcyo3KzRdID0gc291cmNlQXJyYXlbc291cmNlUG9zKjcrNF07XHJcblx0ZGVzdEFycmF5W2Rlc3RQb3MqNys1XSA9IHNvdXJjZUFycmF5W3NvdXJjZVBvcyo3KzVdO1xyXG5cdGRlc3RBcnJheVtkZXN0UG9zKjcrNl0gPSBzb3VyY2VBcnJheVtzb3VyY2VQb3MqNys2XTtcclxufVxyXG4iLCJleHBvcnQgY2xhc3MgQlZITm9kZSB7XHJcblx0ZXh0ZW50c01pbjogWFlaO1xyXG5cdGV4dGVudHNNYXg6IFhZWjtcclxuXHRzdGFydEluZGV4OiBudW1iZXI7XHJcblx0ZW5kSW5kZXg6IG51bWJlcjtcclxuXHRsZXZlbDogbnVtYmVyO1xyXG5cdG5vZGUwOiBCVkhOb2RlIHwgbnVsbDtcclxuXHRub2RlMTogQlZITm9kZSB8IG51bGw7XHJcblx0Y29uc3RydWN0b3IoZXh0ZW50c01pbjogWFlaLCBleHRlbnRzTWF4OiBYWVosIHN0YXJ0SW5kZXg6IG51bWJlciwgZW5kSW5kZXg6IG51bWJlciwgbGV2ZWw6IG51bWJlcikge1xyXG5cdFx0dGhpcy5leHRlbnRzTWluID0gZXh0ZW50c01pbjtcclxuXHRcdHRoaXMuZXh0ZW50c01heCA9IGV4dGVudHNNYXg7XHJcblx0XHR0aGlzLnN0YXJ0SW5kZXggPSBzdGFydEluZGV4O1xyXG5cdFx0dGhpcy5lbmRJbmRleCA9IGVuZEluZGV4O1xyXG5cdFx0dGhpcy5sZXZlbCA9IGxldmVsO1xyXG5cdFx0dGhpcy5ub2RlMCA9IG51bGw7XHJcblx0XHR0aGlzLm5vZGUxID0gbnVsbDtcclxuXHR9XHJcblx0c3RhdGljIGZyb21PYmooe2V4dGVudHNNaW4sIGV4dGVudHNNYXgsIHN0YXJ0SW5kZXgsIGVuZEluZGV4LCBsZXZlbCwgbm9kZTAsIG5vZGUxfTphbnkpIHtcclxuXHRcdGNvbnN0IHRlbXBOb2RlID0gbmV3IEJWSE5vZGUoZXh0ZW50c01pbiwgZXh0ZW50c01heCwgc3RhcnRJbmRleCwgZW5kSW5kZXgsIGxldmVsKTtcclxuXHRcdGlmKG5vZGUwKSB0ZW1wTm9kZS5ub2RlMCA9IEJWSE5vZGUuZnJvbU9iaihub2RlMCk7XHJcblx0XHRpZihub2RlMSkgdGVtcE5vZGUubm9kZTEgPSBCVkhOb2RlLmZyb21PYmoobm9kZTEpO1xyXG5cdFx0cmV0dXJuIHRlbXBOb2RlO1xyXG5cdH1cclxuXHRlbGVtZW50Q291bnQoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lbmRJbmRleCAtIHRoaXMuc3RhcnRJbmRleDtcclxuXHR9XHJcblxyXG5cdGNlbnRlclgoKSB7XHJcblx0XHRyZXR1cm4gKHRoaXMuZXh0ZW50c01pblswXSArIHRoaXMuZXh0ZW50c01heFswXSkgKiAwLjU7XHJcblx0fVxyXG5cclxuXHRjZW50ZXJZKCkge1xyXG5cdFx0cmV0dXJuICh0aGlzLmV4dGVudHNNaW5bMV0gKyB0aGlzLmV4dGVudHNNYXhbMV0pICogMC41O1xyXG5cdH1cclxuXHJcblx0Y2VudGVyWigpIHtcclxuXHRcdHJldHVybiAodGhpcy5leHRlbnRzTWluWzJdICsgdGhpcy5leHRlbnRzTWF4WzJdKSAqIDAuNTtcclxuXHR9XHJcblxyXG5cdGNsZWFyU2hhcGVzKCkge1xyXG5cdFx0dGhpcy5zdGFydEluZGV4ID0gLTE7XHJcblx0XHR0aGlzLmVuZEluZGV4ID0gLTE7XHJcblx0fVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBCVkhWZWN0b3IzICB7XHJcblx0eDogbnVtYmVyID0gMDtcclxuXHR5OiBudW1iZXIgPSAwO1xyXG5cdHo6IG51bWJlciA9IDA7XHJcblx0Y29uc3RydWN0b3IoeDpudW1iZXIgPSAwLCB5Om51bWJlciA9IDAsIHo6bnVtYmVyID0gMCkge1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHR0aGlzLnogPSB6O1xyXG5cdH1cclxuXHRjb3B5KHY6QlZIVmVjdG9yMykge1xyXG5cdFx0dGhpcy54ID0gdi54O1xyXG5cdFx0dGhpcy55ID0gdi55O1xyXG5cdFx0dGhpcy56ID0gdi56O1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdHNldEZyb21BcnJheShhcnJheTpGbG9hdDMyQXJyYXksIGZpcnN0RWxlbWVudFBvczpudW1iZXIpIHtcclxuXHRcdHRoaXMueCA9IGFycmF5W2ZpcnN0RWxlbWVudFBvc107XHJcblx0XHR0aGlzLnkgPSBhcnJheVtmaXJzdEVsZW1lbnRQb3MrMV07XHJcblx0XHR0aGlzLnogPSBhcnJheVtmaXJzdEVsZW1lbnRQb3MrMl07XHJcblx0fVxyXG5cdHNldEZyb21BcnJheU5vT2Zmc2V0KGFycmF5Om51bWJlcltdKSB7XHJcblx0XHR0aGlzLnggPSBhcnJheVswXTtcclxuXHRcdHRoaXMueSA9IGFycmF5WzFdO1xyXG5cdFx0dGhpcy56ID0gYXJyYXlbMl07XHJcblx0fVxyXG5cclxuXHRzZXRGcm9tQXJncyhhOm51bWJlciwgYjpudW1iZXIsIGM6bnVtYmVyKSB7XHJcblx0XHR0aGlzLnggPSBhO1xyXG5cdFx0dGhpcy55ID0gYjtcclxuXHRcdHRoaXMueiA9IGM7XHJcblx0fVxyXG5cdGFkZCh2OkJWSFZlY3RvcjMpIHtcclxuXHRcdHRoaXMueCArPSB2Lng7XHJcblx0XHR0aGlzLnkgKz0gdi55O1xyXG5cdFx0dGhpcy56ICs9IHYuejtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRtdWx0aXBseVNjYWxhcihzY2FsYXI6bnVtYmVyKSB7XHJcblx0XHR0aGlzLnggKj0gc2NhbGFyO1xyXG5cdFx0dGhpcy55ICo9IHNjYWxhcjtcclxuXHRcdHRoaXMueiAqPSBzY2FsYXI7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0c3ViVmVjdG9ycyhhOkJWSFZlY3RvcjMsIGI6QlZIVmVjdG9yMykge1xyXG5cdFx0dGhpcy54ID0gYS54IC0gYi54O1xyXG5cdFx0dGhpcy55ID0gYS55IC0gYi55O1xyXG5cdFx0dGhpcy56ID0gYS56IC0gYi56O1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdGRvdCh2OkJWSFZlY3RvcjMpIHtcclxuXHRcdHJldHVybiB0aGlzLnggKiB2LnggKyB0aGlzLnkgKiB2LnkgKyB0aGlzLnogKiB2Lno7XHJcblx0fVxyXG5cdGNyb3NzKHY6QlZIVmVjdG9yMykge1xyXG5cdFx0Y29uc3QgeCA9IHRoaXMueCwgeSA9IHRoaXMueSwgeiA9IHRoaXMuejtcclxuXHRcdHRoaXMueCA9IHkgKiB2LnogLSB6ICogdi55O1xyXG5cdFx0dGhpcy55ID0geiAqIHYueCAtIHggKiB2Lno7XHJcblx0XHR0aGlzLnogPSB4ICogdi55IC0geSAqIHYueDtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRjcm9zc1ZlY3RvcnMoYTpCVkhWZWN0b3IzLCBiOkJWSFZlY3RvcjMpIHtcclxuXHRcdGNvbnN0IGF4ID0gYS54LCBheSA9IGEueSwgYXogPSBhLno7XHJcblx0XHRjb25zdCBieCA9IGIueCwgYnkgPSBiLnksIGJ6ID0gYi56O1xyXG5cdFx0dGhpcy54ID0gYXkgKiBieiAtIGF6ICogYnk7XHJcblx0XHR0aGlzLnkgPSBheiAqIGJ4IC0gYXggKiBiejtcclxuXHRcdHRoaXMueiA9IGF4ICogYnkgLSBheSAqIGJ4O1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdGNsb25lKCkge1xyXG5cdFx0cmV0dXJuIG5ldyBCVkhWZWN0b3IzKHRoaXMueCwgdGhpcy55LCB0aGlzLnopO1xyXG5cdH1cclxuXHRzdGF0aWMgZnJvbUFueShwb3RlbnRpYWxWZWN0b3I6YW55KTpCVkhWZWN0b3IzIHtcclxuXHRcdGlmKHBvdGVudGlhbFZlY3RvciBpbnN0YW5jZW9mIEJWSFZlY3RvcjMpIHtcclxuXHRcdFx0cmV0dXJuIHBvdGVudGlhbFZlY3RvcjtcclxuXHRcdH0gZWxzZSBpZiAocG90ZW50aWFsVmVjdG9yLnggIT09IHVuZGVmaW5lZCAmJiBwb3RlbnRpYWxWZWN0b3IueCAhPT0gbnVsbCkge1xyXG5cdFx0XHRyZXR1cm4gbmV3IEJWSFZlY3RvcjMocG90ZW50aWFsVmVjdG9yLngsIHBvdGVudGlhbFZlY3Rvci55LCBwb3RlbnRpYWxWZWN0b3Iueik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ291bGRuJ3QgY29udmVydCB0byBCVkhWZWN0b3IzLlwiKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiZXhwb3J0ICogZnJvbSAnLi9CVkgnO1xyXG5leHBvcnQgKiBmcm9tICcuL0JWSEJ1aWxkZXInO1xyXG5leHBvcnQgKiBmcm9tICcuL0JWSE5vZGUnO1xyXG5leHBvcnQgKiBmcm9tICcuL0JWSFZlY3RvcjMnO1xyXG4iLCJpbXBvcnQgeyBCVkhOb2RlIH0gZnJvbSAnLi9CVkhOb2RlJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb3VudE5vZGVzKG5vZGU6QlZITm9kZSwgY291bnQ6bnVtYmVyID0gMCk6bnVtYmVyIHtcclxuXHRjb3VudCArPSAxO1xyXG5cdGlmKG5vZGUubm9kZTApIHtcclxuXHRcdGNvdW50ICs9IGNvdW50Tm9kZXMobm9kZS5ub2RlMCk7XHJcblx0fVxyXG5cdGlmKG5vZGUubm9kZTEpIHtcclxuXHRcdGNvdW50ICs9IGNvdW50Tm9kZXMobm9kZS5ub2RlMSk7XHJcblx0fVxyXG5cdGlmKChub2RlIGFzIGFueSkuX25vZGUwKSB7XHJcblx0XHRjb3VudCArPSBjb3VudE5vZGVzKChub2RlIGFzIGFueSkuX25vZGUwKTtcclxuXHR9XHJcblx0aWYoKG5vZGUgYXMgYW55KS5fbm9kZTEpIHtcclxuXHRcdGNvdW50ICs9IGNvdW50Tm9kZXMoKG5vZGUgYXMgYW55KS5fbm9kZTEpO1xyXG5cdH1cclxuXHRyZXR1cm4gY291bnQ7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhc3luY1dvcmsod29ya0NoZWNrOkV2YWx1YXRvciwgd29yazpFZmZvcnQsIHByb2dyZXNzQ2FsbGJhY2s/OldvcmtQcm9ncmVzc0NhbGxiYWNrKTpQcm9taXNlPHZvaWQ+IHtcclxuXHRjb25zdCBhOkdlbmVyYXRvciA9IGFzeW5jaWZ5KHdvcmtDaGVjaywgd29yayk7XHJcblx0bGV0IGRvbmU6IGJvb2xlYW47XHJcblx0bGV0IG5vZGVzU3BsaXQ6IG51bWJlcjtcclxuXHR3aGlsZSghKHt2YWx1ZTogbm9kZXNTcGxpdCwgZG9uZX0gPSBhLm5leHQoKSwgZG9uZSkpIHtcclxuXHRcdGlmKHR5cGVvZiBwcm9ncmVzc0NhbGxiYWNrICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRwcm9ncmVzc0NhbGxiYWNrKHtub2Rlc1NwbGl0fSk7XHJcblx0XHR9XHJcblx0XHRhd2FpdCB0aWNraWZ5KCk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiogYXN5bmNpZnkod29ya0NoZWNrOkV2YWx1YXRvciwgd29yazpFZmZvcnQpIHtcclxuXHRsZXQgc1RpbWU6bnVtYmVyID0gRGF0ZS5ub3coKTtcclxuXHRsZXQgbjpudW1iZXIgPSAwO1xyXG5cdGxldCB0aHJlczpudW1iZXIgPSAwO1xyXG5cdGxldCBjb3VudDpudW1iZXIgPSAwO1xyXG5cdHdoaWxlKHdvcmtDaGVjaygpKSB7XHJcblx0XHR3b3JrKCk7XHJcblx0XHRjb3VudCsrO1xyXG5cdFx0aWYoKytuID49IHRocmVzKSB7XHJcblx0XHRcdGlmKERhdGUubm93KCkgLSBzVGltZSA+IDEwKSB7XHJcblx0XHRcdFx0eWllbGQgY291bnQ7XHJcblx0XHRcdFx0c1RpbWUgPSBEYXRlLm5vdygpO1xyXG5cdFx0XHRcdHRocmVzID0gbjtcclxuXHRcdFx0XHRuID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuY29uc3QgdGlja2lmeSA9ICgpOlByb21pc2U8dm9pZD4gPT4gbmV3IFByb21pc2UoKHJlczpFZmZvcnQpID0+IHNldFRpbWVvdXQocmVzKSk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=