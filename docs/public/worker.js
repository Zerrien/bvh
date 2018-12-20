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
        bvh = yield _src_1.BVHBuilderAsync(array, undefined, undefined, function (value) {
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
    const sDate = Date.now();
    while (node = nodesToSplit.pop()) {
        let nodes = splitNode(node, maxTrianglesPerNode, bboxArray, bboxHelper);
        nodesToSplit.push(...nodes);
    }
    console.log(Date.now() - sDate);
    return new BVH_1.BVH(rootNode, bboxArray, trianglesArray);
}
exports.BVHBuilder = BVHBuilder;
function BVHBuilderAsync(triangles, maxTrianglesPerNode = 10, asyncParams = {}, progressCallback) {
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
        const sDate = Date.now();
        yield utils_1.asyncWork(() => {
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
        console.log(Date.now() - sDate);
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
        let idx = i * 7 + 1;
        objectCenter[0] = (bboxArray[idx] + bboxArray[idx++ + 3]) * 0.5; // center = (min + max) / 2
        objectCenter[1] = (bboxArray[idx] + bboxArray[idx++ + 3]) * 0.5; // center = (min + max) / 2
        objectCenter[2] = (bboxArray[idx] + bboxArray[idx + 3]) * 0.5; // center = (min + max) / 2
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
        [maxX + expandBy, maxY + expandBy, maxZ + expandBy]
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

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZG9jcy93b3JrZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0JWSC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQlZIQnVpbGRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQlZITm9kZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQlZIVmVjdG9yMy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBLGlFQUFvRTtBQUVwRSxJQUFJLEdBQU8sQ0FBQztBQUVaLFNBQVMsR0FBRyxVQUFlLEVBQUMsSUFBSSxFQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxFQUFDOztRQUNoRCxJQUFHLE9B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Q0FBQztLQUNaO0FBQ0YsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFDLFNBQXNCLEVBQUUsVUFBaUIsRUFBRSxRQUFlLEVBQUUsV0FBbUIsR0FBRztJQUN0RyxJQUFJLFVBQVUsSUFBSSxRQUFRO1FBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxRCxJQUFJLElBQUksR0FBRyxRQUFRLENBQUM7SUFDcEIsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBQ3BCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQztJQUNwQixJQUFJLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUNyQixJQUFJLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUNyQixJQUFJLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUNyQixLQUFLLElBQUksQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzNDLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN0QztJQUNELE9BQU87UUFDTixDQUFDLElBQUksR0FBRyxRQUFRLEVBQUUsSUFBSSxHQUFHLFFBQVEsRUFBRSxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQ25ELENBQUMsSUFBSSxHQUFHLFFBQVEsRUFBRSxJQUFJLEdBQUcsUUFBUSxFQUFFLElBQUksR0FBRyxRQUFRLENBQUM7S0FDbkQsQ0FBQztBQUNILENBQUM7QUFFRCxTQUFTLGlCQUFpQixDQUFDLGNBQTRCO0lBQ3RELE1BQU0sYUFBYSxHQUFVLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sU0FBUyxHQUFnQixJQUFJLFlBQVksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFbkUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN2QyxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVoQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUM1RDtJQUVELE9BQU8sU0FBUyxDQUFDO0FBQ2xCLENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUFDLFNBQW9CO0lBQy9DLE1BQU0sY0FBYyxHQUFHLElBQUksWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFOUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDMUMsTUFBTSxFQUFFLEdB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Q0FBK0MsQ0FBQyxDQUFDO0tBQ2pFO0lBQ0QsSUFBSSxLQUFLLEdBQVUsQ0FBQyxDQUFDO0lBQ3JCLElBQUksV0FBVyxHQUFXLENBQUMsQ0FBQztJQUM1QixJQUFJLE9BQU8sR0FBVSxDQUFDLENBQUM7SUFDdkIsSUFBSSxjQUFxQixDQUFDO0lBQzFCLElBQUksVUFBVSxHQUFVLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDbEMsT0FBTSxDQUFDLGNBQWMsR0FBRyxTQUFTLEVBQUUsRUFBRSxjQUFjLEdBQUcsQ0FBQyxDQUFDLEVBQUU7UUFDekQsSUFBSSxFQUFFLENBQUM7UUFDUCxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUcsY0FBYyxHQUFHLE9BQU8sRUFBRTtZQUM1QixXQUFXLElBQUksQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sS0FBSyxDQUFDO1lBQ1osT0FBTyxHQUFHLGNBQWMsR0FBRyxVQUFVLENBQUM7U0FDdEM7S0FDRDtJQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFJRCxNQUFNLE9BQU8sR0FBRyxHQUFpQixFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFRLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6Ii4vd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9kb2NzL3dvcmtlci50c1wiKTtcbiIsImltcG9ydCB7IEJWSEJ1aWxkZXIsIEJWSEJ1aWxkZXJBc3luYywgQlZILCBCVkhWZWN0b3IzIH0gZnJvbSAnQHNyYyc7XHJcblxyXG5sZXQgYnZoOkJWSDtcclxuXHJcbm9ubWVzc2FnZSA9IGFzeW5jIGZ1bmN0aW9uKHtkYXRhOnttZXNzYWdlLCBkYXRhfX0pIHtcclxuXHRpZihtZXNzYWdlID09PSBcImJ2aF9pbmZvXCIpIHtcclxuXHRcdGJ1aWxkQlZIKGRhdGEuZmFjZXNBcnJheSk7XHJcblx0fSBlbHNlIGlmIChtZXNzYWdlID09PSBcInJheV9jYXN0XCIpIHtcclxuXHRcdHJheUNhc3QoZGF0YS5vcmlnaW4sIGRhdGEuZGlyZWN0aW9uKTtcclxuXHR9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkQlZIKGFycmF5OmFueSApIHtcclxuXHRidmggPSBhd2FpdCBCVkhCdWlsZGVyQXN5bmMoYXJyYXksIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0KHNlbGYgYXMgYW55KS5wb3N0TWVzc2FnZSh7XHJcblx0XHRcdG1lc3NhZ2U6IFwicHJvZ3Jlc3NcIixcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdHZhbHVlXHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdChzZWxmIGFzIGFueSkucG9zdE1lc3NhZ2Uoe1xyXG5cdFx0bWVzc2FnZTogXCJkb25lXCJcclxuXHR9KVxyXG59XHJcblxyXG5mdW5jdGlvbiByYXlDYXN0KG9yaWdpbjphbnksIGRpcmVjdGlvbjphbnkpIHtcclxuXHRsZXQgcmVzdWx0ID0gYnZoLmludGVyc2VjdFJheShvcmlnaW4sIGRpcmVjdGlvbiwgZmFsc2UpO1xyXG5cdChzZWxmIGFzIGFueSkucG9zdE1lc3NhZ2UoIHtcclxuXHRcdG1lc3NhZ2U6IFwicmF5X3RyYWNlZFwiLFxyXG5cdFx0ZGF0YTogcmVzdWx0XHJcblx0fSk7XHJcbn0iLCJpbXBvcnQgeyBCVkhWZWN0b3IzIH0gZnJvbSAnLi9CVkhWZWN0b3IzJztcclxuaW1wb3J0IHsgQlZITm9kZSB9IGZyb20gJy4vQlZITm9kZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgQlZIIHtcclxuXHRyb290Tm9kZTogQlZITm9kZTtcclxuXHRiYm94QXJyYXk6IEZsb2F0MzJBcnJheTtcclxuXHR0cmlhbmdsZXNBcnJheTogRmxvYXQzMkFycmF5O1xyXG5cdGNvbnN0cnVjdG9yKHJvb3ROb2RlOkJWSE5vZGUsIGJvdW5kaW5nQm94QXJyYXk6RmxvYXQzMkFycmF5LCB0cmlhbmdsZUFycmF5OkZsb2F0MzJBcnJheSkge1xyXG5cdFx0dGhpcy5yb290Tm9kZSA9IHJvb3ROb2RlO1xyXG5cdFx0dGhpcy5iYm94QXJyYXkgPSBib3VuZGluZ0JveEFycmF5O1xyXG5cdFx0dGhpcy50cmlhbmdsZXNBcnJheSA9IHRyaWFuZ2xlQXJyYXk7XHJcblx0fVxyXG5cdGludGVyc2VjdFJheShyYXlPcmlnaW46YW55LCByYXlEaXJlY3Rpb246YW55LCBiYWNrZmFjZUN1bGxpbmc6Ym9vbGVhbiA9IHRydWUpOmFueVtdIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHJheU9yaWdpbiA9IEJWSFZlY3RvcjMuZnJvbUFueShyYXlPcmlnaW4pO1xyXG5cdFx0XHRyYXlEaXJlY3Rpb24gPSBCVkhWZWN0b3IzLmZyb21BbnkocmF5RGlyZWN0aW9uKTtcclxuXHRcdH0gY2F0Y2goZXJyb3IpIHtcclxuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcIk9yaWdpbiBvciBEaXJlY3Rpb24gY291bGRuJ3QgYmUgY29udmVydGVkIHRvIGEgQlZIVmVjdG9yMy5cIik7XHJcblx0XHR9XHJcblx0XHRjb25zdCBub2Rlc1RvSW50ZXJzZWN0OkJWSE5vZGVbXSA9IFt0aGlzLnJvb3ROb2RlXTtcclxuXHRcdGNvbnN0IHRyaWFuZ2xlc0luSW50ZXJzZWN0aW5nTm9kZXM6bnVtYmVyW10gPSBbXTsgLy8gYSBsaXN0IG9mIG5vZGVzIHRoYXQgaW50ZXJzZWN0IHRoZSByYXkgKGFjY29yZGluZyB0byB0aGVpciBib3VuZGluZyBib3gpXHJcblx0XHRjb25zdCBpbnRlcnNlY3RpbmdUcmlhbmdsZXM6b2JqZWN0W10gPSBbXTtcclxuXHJcblx0XHRjb25zdCBpbnZSYXlEaXJlY3Rpb24gPSBuZXcgQlZIVmVjdG9yMyhcclxuXHRcdFx0MS4wIC8gcmF5RGlyZWN0aW9uLngsXHJcblx0XHRcdDEuMCAvIHJheURpcmVjdGlvbi55LFxyXG5cdFx0XHQxLjAgLyByYXlEaXJlY3Rpb24uelxyXG5cdFx0KTtcclxuXHJcblx0XHQvLyBnbyBvdmVyIHRoZSBCVkggdHJlZSwgYW5kIGV4dHJhY3QgdGhlIGxpc3Qgb2YgdHJpYW5nbGVzIHRoYXQgbGllIGluIG5vZGVzIHRoYXQgaW50ZXJzZWN0IHRoZSByYXkuXHJcblx0XHQvLyBub3RlOiB0aGVzZSB0cmlhbmdsZXMgbWF5IG5vdCBpbnRlcnNlY3QgdGhlIHJheSB0aGVtc2VsdmVzXHJcblx0XHR3aGlsZShub2Rlc1RvSW50ZXJzZWN0Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0Y29uc3Qgbm9kZTpCVkhOb2RlIHwgdW5kZWZpbmVkID0gbm9kZXNUb0ludGVyc2VjdC5wb3AoKTtcclxuXHRcdFx0aWYoIW5vZGUpIGNvbnRpbnVlO1xyXG5cdFx0XHRpZihCVkguaW50ZXJzZWN0Tm9kZUJveChyYXlPcmlnaW4sIGludlJheURpcmVjdGlvbiwgbm9kZSkpIHtcclxuXHRcdFx0XHRpZihub2RlLm5vZGUwKSB7XHJcblx0XHRcdFx0XHRub2Rlc1RvSW50ZXJzZWN0LnB1c2gobm9kZS5ub2RlMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKG5vZGUubm9kZTEpIHtcclxuXHRcdFx0XHRcdG5vZGVzVG9JbnRlcnNlY3QucHVzaChub2RlLm5vZGUxKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Zm9yKGxldCBpID0gbm9kZS5zdGFydEluZGV4OyBpIDwgbm9kZS5lbmRJbmRleDsgaSsrKSB7XHJcblx0XHRcdFx0XHR0cmlhbmdsZXNJbkludGVyc2VjdGluZ05vZGVzLnB1c2godGhpcy5iYm94QXJyYXlbaSo3XSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ28gb3ZlciB0aGUgbGlzdCBvZiBjYW5kaWRhdGUgdHJpYW5nbGVzLCBhbmQgY2hlY2sgZWFjaCBvZiB0aGVtIHVzaW5nIHJheSB0cmlhbmdsZSBpbnRlcnNlY3Rpb25cclxuXHRcdGxldCBhOkJWSFZlY3RvcjMgPSBuZXcgQlZIVmVjdG9yMygpO1xyXG5cdFx0bGV0IGI6QlZIVmVjdG9yMyA9IG5ldyBCVkhWZWN0b3IzKCk7XHJcblx0XHRsZXQgYzpCVkhWZWN0b3IzID0gbmV3IEJWSFZlY3RvcjMoKTtcclxuXHJcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgdHJpYW5nbGVzSW5JbnRlcnNlY3RpbmdOb2Rlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCB0cmlJbmRleCA9IHRyaWFuZ2xlc0luSW50ZXJzZWN0aW5nTm9kZXNbaV07XHJcblxyXG5cdFx0XHRhLnNldEZyb21BcnJheSh0aGlzLnRyaWFuZ2xlc0FycmF5LCB0cmlJbmRleCo5KTtcclxuXHRcdFx0Yi5zZXRGcm9tQXJyYXkodGhpcy50cmlhbmdsZXNBcnJheSwgdHJpSW5kZXgqOSszKTtcclxuXHRcdFx0Yy5zZXRGcm9tQXJyYXkodGhpcy50cmlhbmdsZXNBcnJheSwgdHJpSW5kZXgqOSs2KTtcclxuXHJcblx0XHRcdGNvbnN0IGludGVyc2VjdGlvblBvaW50ID0gQlZILmludGVyc2VjdFJheVRyaWFuZ2xlKGEsIGIsIGMsIHJheU9yaWdpbiwgcmF5RGlyZWN0aW9uLCBiYWNrZmFjZUN1bGxpbmcpO1xyXG5cclxuXHRcdFx0aWYoIWludGVyc2VjdGlvblBvaW50KSBjb250aW51ZTtcclxuXHRcdFx0aW50ZXJzZWN0aW5nVHJpYW5nbGVzLnB1c2goe1xyXG5cdFx0XHRcdC8vdHJpYW5nbGU6IFthLmNsb25lKCksIGIuY2xvbmUoKSwgYy5jbG9uZSgpXSxcclxuXHRcdFx0XHR0cmlhbmdsZUluZGV4OiB0cmlJbmRleCxcclxuXHRcdFx0XHRpbnRlcnNlY3Rpb25Qb2ludDogaW50ZXJzZWN0aW9uUG9pbnRcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGludGVyc2VjdGluZ1RyaWFuZ2xlcztcclxuXHR9XHJcblx0c3RhdGljIGNhbGNUVmFsdWVzKG1pblZhbDpudW1iZXIsIG1heFZhbDpudW1iZXIsIHJheU9yaWdpbkNvb3JkOm51bWJlciwgaW52ZGlyOiBudW1iZXIpOm51bWJlcltdIHtcclxuXHRcdGlmKGludmRpciA+PSAwKSB7XHJcblx0XHRcdHJldHVybiBbKG1pblZhbCAtIHJheU9yaWdpbkNvb3JkKSAqIGludmRpciwgKG1heFZhbCAtIHJheU9yaWdpbkNvb3JkKSAqIGludmRpcl07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gWyhtYXhWYWwgLSByYXlPcmlnaW5Db29yZCkgKiBpbnZkaXIsIChtaW5WYWwgLSByYXlPcmlnaW5Db29yZCkgKiBpbnZkaXJdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGludGVyc2VjdE5vZGVCb3gocmF5T3JpZ2luOiBCVkhWZWN0b3IzLCBpbnZSYXlEaXJlY3Rpb246IEJWSFZlY3RvcjMsIG5vZGU6IEJWSE5vZGUpOmJvb2xlYW4ge1xyXG5cdFx0bGV0IFt0bWluLCB0bWF4XTpudW1iZXJbXSA9IEJWSC5jYWxjVFZhbHVlcyhub2RlLmV4dGVudHNNaW5bMF0sIG5vZGUuZXh0ZW50c01heFswXSwgcmF5T3JpZ2luLngsIGludlJheURpcmVjdGlvbi54KTtcclxuXHRcdGxldCBbdHltaW4sIHR5bWF4XTpudW1iZXJbXSA9IEJWSC5jYWxjVFZhbHVlcyhub2RlLmV4dGVudHNNaW5bMV0sIG5vZGUuZXh0ZW50c01heFsxXSwgcmF5T3JpZ2luLnksIGludlJheURpcmVjdGlvbi55KTtcclxuXHJcblx0XHRpZih0bWluID4gdHltYXggfHwgdHltaW4gPiB0bWF4KSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0Ly8gVGhlc2UgbGluZXMgYWxzbyBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgdG1pbiBvciB0bWF4IGlzIE5hTlxyXG5cdFx0Ly8gKHJlc3VsdCBvZiAwICogSW5maW5pdHkpLiB4ICE9PSB4IHJldHVybnMgdHJ1ZSBpZiB4IGlzIE5hTlxyXG5cdFx0aWYodHltaW4gPiB0bWluIHx8IHRtaW4gIT09IHRtaW4pIHtcclxuXHRcdFx0dG1pbiA9IHR5bWluO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKHR5bWF4IDwgdG1heCB8fCB0bWF4ICE9PSB0bWF4KSB7XHJcblx0XHRcdHRtYXggPSB0eW1heDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgW3R6bWluLCB0em1heF06bnVtYmVyW10gPSBCVkguY2FsY1RWYWx1ZXMobm9kZS5leHRlbnRzTWluWzJdLCBub2RlLmV4dGVudHNNYXhbMl0sIHJheU9yaWdpbi56LCBpbnZSYXlEaXJlY3Rpb24ueik7XHJcblxyXG5cdFx0aWYodG1pbiA+IHR6bWF4IHx8IHR6bWluID4gdG1heCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdGlmKHR6bWF4IDwgdG1heCB8fCB0bWF4ICE9PSB0bWF4KSB7XHJcblx0XHRcdHRtYXggPSB0em1heDtcclxuXHRcdH1cclxuXHJcblx0XHQvL3JldHVybiBwb2ludCBjbG9zZXN0IHRvIHRoZSByYXkgKHBvc2l0aXZlIHNpZGUpXHJcblx0XHRpZih0bWF4IDwgMCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGludGVyc2VjdFJheVRyaWFuZ2xlKGE6QlZIVmVjdG9yMywgYjpCVkhWZWN0b3IzLCBjOkJWSFZlY3RvcjMsIHJheU9yaWdpbjpCVkhWZWN0b3IzLCByYXlEaXJlY3Rpb246QlZIVmVjdG9yMywgYmFja2ZhY2VDdWxsaW5nOmJvb2xlYW4pOkJWSFZlY3RvcjMgfCBudWxsIHtcclxuXHRcdHZhciBkaWZmOkJWSFZlY3RvcjMgPSBuZXcgQlZIVmVjdG9yMygpO1xyXG5cdFx0dmFyIGVkZ2UxOkJWSFZlY3RvcjMgPSBuZXcgQlZIVmVjdG9yMygpO1xyXG5cdFx0dmFyIGVkZ2UyOkJWSFZlY3RvcjMgPSBuZXcgQlZIVmVjdG9yMygpO1xyXG5cdFx0dmFyIG5vcm1hbDpCVkhWZWN0b3IzID0gbmV3IEJWSFZlY3RvcjMoKTtcclxuXHJcblx0XHQvLyBmcm9tIGh0dHA6Ly93d3cuZ2VvbWV0cmljdG9vbHMuY29tL0xpYk1hdGhlbWF0aWNzL0ludGVyc2VjdGlvbi9XbTVJbnRyUmF5M1RyaWFuZ2xlMy5jcHBcclxuXHRcdGVkZ2UxLnN1YlZlY3RvcnMoYiwgYSk7XHJcblx0XHRlZGdlMi5zdWJWZWN0b3JzKGMsIGEpO1xyXG5cdFx0bm9ybWFsLmNyb3NzVmVjdG9ycyhlZGdlMSwgZWRnZTIpO1xyXG5cclxuXHRcdC8vIFNvbHZlIFEgKyB0KkQgPSBiMSpFMSArIGJMKkUyIChRID0ga0RpZmYsIEQgPSByYXkgZGlyZWN0aW9uLFxyXG5cdFx0Ly8gRTEgPSBrRWRnZTEsIEUyID0ga0VkZ2UyLCBOID0gQ3Jvc3MoRTEsRTIpKSBieVxyXG5cdFx0Ly8gICB8RG90KEQsTil8KmIxID0gc2lnbihEb3QoRCxOKSkqRG90KEQsQ3Jvc3MoUSxFMikpXHJcblx0XHQvLyAgIHxEb3QoRCxOKXwqYjIgPSBzaWduKERvdChELE4pKSpEb3QoRCxDcm9zcyhFMSxRKSlcclxuXHRcdC8vICAgfERvdChELE4pfCp0ID0gLXNpZ24oRG90KEQsTikpKkRvdChRLE4pXHJcblx0XHRsZXQgRGROOm51bWJlciA9IHJheURpcmVjdGlvbi5kb3Qobm9ybWFsKTtcclxuXHRcdGlmKERkTiA9PT0gMCkgcmV0dXJuIG51bGw7XHJcblx0XHRpZihEZE4gPiAwICYmIGJhY2tmYWNlQ3VsbGluZykgcmV0dXJuIG51bGw7XHJcblx0XHRsZXQgc2lnbjpudW1iZXIgPSBNYXRoLnNpZ24oRGROKTtcclxuXHRcdERkTiAqPSBzaWduO1xyXG5cclxuXHRcdGRpZmYuc3ViVmVjdG9ycyhyYXlPcmlnaW4sIGEpO1xyXG5cdFx0dmFyIERkUXhFMiA9IHNpZ24gKiByYXlEaXJlY3Rpb24uZG90KGVkZ2UyLmNyb3NzVmVjdG9ycyhkaWZmLCBlZGdlMikpO1xyXG5cclxuXHRcdC8vIGIxIDwgMCwgbm8gaW50ZXJzZWN0aW9uXHJcblx0XHRpZihEZFF4RTIgPCAwKSByZXR1cm4gbnVsbDtcclxuXHJcblx0XHR2YXIgRGRFMXhRID0gc2lnbiAqIHJheURpcmVjdGlvbi5kb3QoZWRnZTEuY3Jvc3MoZGlmZikpO1xyXG5cclxuXHRcdC8vIGIyIDwgMCwgbm8gaW50ZXJzZWN0aW9uXHJcblx0XHRpZihEZEUxeFEgPCAwKSByZXR1cm4gbnVsbDtcclxuXHJcblx0XHQvLyBiMStiMiA+IDEsIG5vIGludGVyc2VjdGlvblxyXG5cdFx0aWYoRGRReEUyICsgRGRFMXhRID4gRGROKSByZXR1cm4gbnVsbDtcclxuXHJcblx0XHQvLyBMaW5lIGludGVyc2VjdHMgdHJpYW5nbGUsIGNoZWNrIGlmIHJheSBkb2VzLlxyXG5cdFx0Y29uc3QgUWROOm51bWJlciA9IC1zaWduICogZGlmZi5kb3Qobm9ybWFsKTtcclxuXHJcblx0XHQvLyB0IDwgMCwgbm8gaW50ZXJzZWN0aW9uXHJcblx0XHRpZihRZE4gPCAwKSByZXR1cm4gbnVsbDtcclxuXHJcblx0XHQvLyBSYXkgaW50ZXJzZWN0cyB0cmlhbmdsZS5cclxuXHRcdHJldHVybiByYXlEaXJlY3Rpb24uY2xvbmUoKS5tdWx0aXBseVNjYWxhcihRZE4gLyBEZE4pLmFkZChyYXlPcmlnaW4pO1xyXG5cdH1cclxufVxyXG4iLCJkZWNsYXJlIGdsb2JhbCB7XHJcblx0aW50ZXJmYWNlIFhZWiB7XHJcblx0XHQwOiBudW1iZXIsXHJcblx0XHQxOiBudW1iZXIsXHJcblx0XHQyOiBudW1iZXJcclxuXHR9XHJcblx0XHJcblx0aW50ZXJmYWNlIFZlY3RvciB7XHJcblx0XHR4OiBudW1iZXI7XHJcblx0XHR5OiBudW1iZXI7XHJcblx0XHR6OiBudW1iZXI7XHJcblx0fVxyXG5cclxuXHR0eXBlIEV2YWx1YXRvciA9ICgpID0+IG51bWJlcjtcclxuXHR0eXBlIFdvcmsgPSAoKSA9PiB2b2lkO1xyXG5cdHR5cGUgV29ya1Byb2dyZXNzID0ge25vZGVzU3BsaXQ6IG51bWJlcn07XHJcblx0dHlwZSBXb3JrUHJvZ3Jlc3NDYWxsYmFjayA9IChwcm9ncmVzc09iajpXb3JrUHJvZ3Jlc3MpID0+IHZvaWQ7XHJcblx0dHlwZSBCVkhQcm9ncmVzcyA9IHtub2Rlc1NwbGl0OiBudW1iZXIsIHRyaWFuZ2xlc0xlYWZlZDogbnVtYmVyfTtcclxuXHR0eXBlIEFzeW5jaWZ5UGFyYW1zID0ge21zPzogbnVtYmVyLCBzdGVwcz86IG51bWJlcn07XHJcbn1cclxuXHJcbmNvbnN0IEVQU0lMT04gPSAxZS02O1xyXG5cclxuaW1wb3J0IHsgQlZIVmVjdG9yMyB9IGZyb20gXCIuL0JWSFZlY3RvcjNcIjtcclxuaW1wb3J0IHsgQlZITm9kZSB9IGZyb20gXCIuL0JWSE5vZGVcIjtcclxuaW1wb3J0IHsgQlZIIH0gZnJvbSBcIi4vQlZIXCI7XHJcbmltcG9ydCB7IGFzeW5jV29yayB9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQlZIQnVpbGRlcih0cmlhbmdsZXM6YW55LCBtYXhUcmlhbmdsZXNQZXJOb2RlOm51bWJlciA9IDEwKTpCVkgge1xyXG5cdGlmKHR5cGVvZiBtYXhUcmlhbmdsZXNQZXJOb2RlICE9PSAnbnVtYmVyJykgdGhyb3cgbmV3IEVycm9yKGBtYXhUcmlhbmdsZXNQZXJOb2RlIG11c3QgYmUgb2YgdHlwZSBudW1iZXIsIGdvdDogJHt0eXBlb2YgbWF4VHJpYW5nbGVzUGVyTm9kZX1gKTtcclxuXHRpZihtYXhUcmlhbmdsZXNQZXJOb2RlIDwgMSkgdGhyb3cgbmV3IEVycm9yKGBtYXhUcmlhbmdsZXNQZXJOb2RlIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDEsIGdvdDogJHttYXhUcmlhbmdsZXNQZXJOb2RlfWApO1xyXG5cdGlmKE51bWJlci5pc05hTihtYXhUcmlhbmdsZXNQZXJOb2RlKSkgdGhyb3cgbmV3IEVycm9yKGBtYXhUcmlhbmdsZXNQZXJOb2RlIGlzIE5hTmApO1xyXG5cdGlmKCFOdW1iZXIuaXNJbnRlZ2VyKG1heFRyaWFuZ2xlc1Blck5vZGUpKSBjb25zb2xlLndhcm4oYG1heFRyaWFuZ2xlc1Blck5vZGUgaXMgZXhwZWN0ZWQgdG8gYmUgYW4gaW50ZWdlciwgZ290OiAke21heFRyaWFuZ2xlc1Blck5vZGV9YCk7XHJcblx0Ly9WZWN0b3JbXVtdIHwgbnVtYmVyW10gfCBGbG9hdDMyQXJyYXlcclxuXHRsZXQgdHJpYW5nbGVzQXJyYXk6RmxvYXQzMkFycmF5ID0gdHJpYW5nbGVzIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5ID8gdHJpYW5nbGVzIDogYnVpbGRUcmlhbmdsZUFycmF5KHRyaWFuZ2xlcyk7XHJcblx0bGV0IGJib3hBcnJheTpGbG9hdDMyQXJyYXkgPSBjYWxjQm91bmRpbmdCb3hlcyh0cmlhbmdsZXNBcnJheSk7XHJcblx0Ly8gY2xvbmUgYSBoZWxwZXIgYXJyYXlcclxuXHRsZXQgYmJveEhlbHBlcjpGbG9hdDMyQXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KGJib3hBcnJheS5sZW5ndGgpO1xyXG5cdGJib3hIZWxwZXIuc2V0KGJib3hBcnJheSk7XHJcblxyXG5cdC8vIGNyZWF0ZSB0aGUgcm9vdCBub2RlLCBhZGQgYWxsIHRoZSB0cmlhbmdsZXMgdG8gaXRcclxuXHR2YXIgdHJpYW5nbGVDb3VudDpudW1iZXIgPSB0cmlhbmdsZXNBcnJheS5sZW5ndGggLyA5O1xyXG5cdHZhciBleHRlbnRzOlhZWltdID0gY2FsY0V4dGVudHMoYmJveEFycmF5LCAwLCB0cmlhbmdsZUNvdW50LCBFUFNJTE9OKTtcclxuXHRsZXQgcm9vdE5vZGU6QlZITm9kZSA9IG5ldyBCVkhOb2RlKGV4dGVudHNbMF0sIGV4dGVudHNbMV0sIDAsIHRyaWFuZ2xlQ291bnQsIDApO1xyXG5cdGxldCBub2Rlc1RvU3BsaXQ6QlZITm9kZVtdID0gW3Jvb3ROb2RlXTtcclxuXHRsZXQgbm9kZTpCVkhOb2RlIHwgdW5kZWZpbmVkO1xyXG5cclxuXHRjb25zdCBzRGF0ZSA9IERhdGUubm93KCk7XHJcblx0d2hpbGUobm9kZSA9IG5vZGVzVG9TcGxpdC5wb3AoKSkge1xyXG5cdFx0bGV0IG5vZGVzID0gc3BsaXROb2RlKG5vZGUsIG1heFRyaWFuZ2xlc1Blck5vZGUsIGJib3hBcnJheSwgYmJveEhlbHBlcik7XHJcblx0XHRub2Rlc1RvU3BsaXQucHVzaCguLi5ub2Rlcyk7XHJcblx0fVxyXG5cdGNvbnNvbGUubG9nKERhdGUubm93KCkgLSBzRGF0ZSk7XHJcblx0cmV0dXJuIG5ldyBCVkgocm9vdE5vZGUsIGJib3hBcnJheSwgdHJpYW5nbGVzQXJyYXkpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQlZIQnVpbGRlckFzeW5jKHRyaWFuZ2xlczphbnksIG1heFRyaWFuZ2xlc1Blck5vZGU6bnVtYmVyID0gMTAsIGFzeW5jUGFyYW1zOkFzeW5jaWZ5UGFyYW1zID0ge30sIHByb2dyZXNzQ2FsbGJhY2s/OihvYmo6QlZIUHJvZ3Jlc3MpID0+IHZvaWQpOlByb21pc2U8QlZIPiB7XHJcblx0Ly9WZWN0b3JbXVtdIHwgbnVtYmVyW10gfCBGbG9hdDMyQXJyYXlcclxuXHRsZXQgdHJpYW5nbGVzQXJyYXk6RmxvYXQzMkFycmF5ID0gdHJpYW5nbGVzIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5ID8gdHJpYW5nbGVzIDogYnVpbGRUcmlhbmdsZUFycmF5KHRyaWFuZ2xlcyk7XHJcblx0bGV0IGJib3hBcnJheTpGbG9hdDMyQXJyYXkgPSBjYWxjQm91bmRpbmdCb3hlcyh0cmlhbmdsZXNBcnJheSk7XHJcblx0Ly8gY2xvbmUgYSBoZWxwZXIgYXJyYXlcclxuXHRsZXQgYmJveEhlbHBlcjpGbG9hdDMyQXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KGJib3hBcnJheS5sZW5ndGgpO1xyXG5cdGJib3hIZWxwZXIuc2V0KGJib3hBcnJheSk7XHJcblxyXG5cdC8vIGNyZWF0ZSB0aGUgcm9vdCBub2RlLCBhZGQgYWxsIHRoZSB0cmlhbmdsZXMgdG8gaXRcclxuXHR2YXIgdHJpYW5nbGVDb3VudDpudW1iZXIgPSB0cmlhbmdsZXNBcnJheS5sZW5ndGggLyA5O1xyXG5cdHZhciBleHRlbnRzOlhZWltdID0gY2FsY0V4dGVudHMoYmJveEFycmF5LCAwLCB0cmlhbmdsZUNvdW50LCBFUFNJTE9OKTtcclxuXHRsZXQgcm9vdE5vZGU6QlZITm9kZSA9IG5ldyBCVkhOb2RlKGV4dGVudHNbMF0sIGV4dGVudHNbMV0sIDAsIHRyaWFuZ2xlQ291bnQsIDApO1xyXG5cdGxldCBub2Rlc1RvU3BsaXQ6QlZITm9kZVtdID0gW3Jvb3ROb2RlXTtcclxuXHRsZXQgbm9kZTpCVkhOb2RlIHwgdW5kZWZpbmVkO1xyXG5cclxuXHRsZXQgdGFsbHkgPSAwO1xyXG5cdFx0Y29uc3Qgc0RhdGUgPSBEYXRlLm5vdygpO1xyXG5cdGF3YWl0IGFzeW5jV29yaygoKSA9PiB7XHJcblx0XHRub2RlID0gbm9kZXNUb1NwbGl0LnBvcCgpO1xyXG5cdFx0cmV0dXJuIHRhbGx5ICogOSAvIHRyaWFuZ2xlc0FycmF5Lmxlbmd0aDtcclxuXHR9LCAoKSA9PiB7XHJcblx0XHRpZighbm9kZSkgcmV0dXJuO1xyXG5cdFx0bGV0IG5vZGVzID0gc3BsaXROb2RlKG5vZGUsIG1heFRyaWFuZ2xlc1Blck5vZGUsIGJib3hBcnJheSwgYmJveEhlbHBlcik7XHJcblx0XHRpZighbm9kZXMubGVuZ3RoKSB0YWxseSArPSBub2RlLmVsZW1lbnRDb3VudCgpO1xyXG5cdFx0bm9kZXNUb1NwbGl0LnB1c2goLi4ubm9kZXMpO1xyXG5cdH0sIGFzeW5jUGFyYW1zLCBwcm9ncmVzc0NhbGxiYWNrID9cclxuXHRcdChub2Rlc1NwbGl0OldvcmtQcm9ncmVzcykgPT4gcHJvZ3Jlc3NDYWxsYmFjayhPYmplY3QuYXNzaWduKHt0cmlhbmdsZXNMZWFmZWQ6IHRhbGx5fSwgbm9kZXNTcGxpdCkpXHJcblx0XHQ6IHVuZGVmaW5lZFxyXG5cdCk7XHJcblx0Y29uc29sZS5sb2coRGF0ZS5ub3coKSAtIHNEYXRlKTtcclxuXHRyZXR1cm4gbmV3IEJWSChyb290Tm9kZSwgYmJveEFycmF5LCB0cmlhbmdsZXNBcnJheSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwbGl0Tm9kZShub2RlOiBCVkhOb2RlLCBtYXhUcmlhbmdsZXM6bnVtYmVyLCBiYm94QXJyYXk6RmxvYXQzMkFycmF5LCBiYm94SGVscGVyOkZsb2F0MzJBcnJheSk6QlZITm9kZVtdIHtcclxuXHRjb25zdCBub2RlQ291bnQ6bnVtYmVyID0gbm9kZS5lbGVtZW50Q291bnQoKVxyXG5cdGlmIChub2RlQ291bnQgPD0gbWF4VHJpYW5nbGVzIHx8IG5vZGVDb3VudCA9PT0gMCkgcmV0dXJuIFtdO1xyXG5cclxuXHRsZXQgc3RhcnRJbmRleDpudW1iZXIgPSBub2RlLnN0YXJ0SW5kZXg7XHJcblx0bGV0IGVuZEluZGV4Om51bWJlciA9IG5vZGUuZW5kSW5kZXg7XHJcblxyXG5cdGxldCBsZWZ0Tm9kZTpudW1iZXJbXVtdID0gWyBbXSxbXSxbXSBdO1xyXG5cdGxldCByaWdodE5vZGU6bnVtYmVyW11bXSA9IFsgW10sW10sW10gXTtcclxuXHRsZXQgZXh0ZW50Q2VudGVyczpudW1iZXJbXSA9IFtub2RlLmNlbnRlclgoKSwgbm9kZS5jZW50ZXJZKCksIG5vZGUuY2VudGVyWigpXTtcclxuXHJcblx0bGV0IG9iamVjdENlbnRlcjpudW1iZXJbXSA9IFtdO1xyXG5cdG9iamVjdENlbnRlci5sZW5ndGggPSAzO1xyXG5cclxuXHRmb3IgKGxldCBpID0gc3RhcnRJbmRleDsgaSA8IGVuZEluZGV4OyBpKyspIHtcclxuXHRcdGxldCBpZHggPSBpICogNyArIDE7XHJcblx0XHRvYmplY3RDZW50ZXJbMF0gPSAoYmJveEFycmF5W2lkeF0gKyBiYm94QXJyYXlbaWR4KysgKyAzXSkgKiAwLjU7IC8vIGNlbnRlciA9IChtaW4gKyBtYXgpIC8gMlxyXG5cdFx0b2JqZWN0Q2VudGVyWzFdID0gKGJib3hBcnJheVtpZHhdICsgYmJveEFycmF5W2lkeCsrICsgM10pICogMC41OyAvLyBjZW50ZXIgPSAobWluICsgbWF4KSAvIDJcclxuXHRcdG9iamVjdENlbnRlclsyXSA9IChiYm94QXJyYXlbaWR4XSArIGJib3hBcnJheVtpZHggKyAzXSkgKiAwLjU7IC8vIGNlbnRlciA9IChtaW4gKyBtYXgpIC8gMlxyXG5cdFx0Zm9yIChsZXQgaiA9IDA7IGogPCAzOyBqKyspIHtcclxuXHRcdFx0aWYgKG9iamVjdENlbnRlcltqXSA8IGV4dGVudENlbnRlcnNbal0pIHtcclxuXHRcdFx0XHRsZWZ0Tm9kZVtqXS5wdXNoKGkpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJpZ2h0Tm9kZVtqXS5wdXNoKGkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBjaGVjayBpZiB3ZSBjb3VsZG4ndCBzcGxpdCB0aGUgbm9kZSBieSBhbnkgb2YgdGhlIGF4ZXMgKHgsIHkgb3IgeikuIGhhbHQgaGVyZSwgZG9udCB0cnkgdG8gc3BsaXQgYW55IG1vcmUgKGNhdXNlIGl0IHdpbGwgYWx3YXlzIGZhaWwsIGFuZCB3ZSdsbCBlbnRlciBhbiBpbmZpbml0ZSBsb29wXHJcblx0dmFyIHNwbGl0RmFpbGVkOmJvb2xlYW5bXSA9IFtdO1xyXG5cdHNwbGl0RmFpbGVkLmxlbmd0aCA9IDM7XHJcblxyXG5cdHNwbGl0RmFpbGVkWzBdID0gKGxlZnROb2RlWzBdLmxlbmd0aCA9PT0gMCkgfHwgKHJpZ2h0Tm9kZVswXS5sZW5ndGggPT09IDApO1xyXG5cdHNwbGl0RmFpbGVkWzFdID0gKGxlZnROb2RlWzFdLmxlbmd0aCA9PT0gMCkgfHwgKHJpZ2h0Tm9kZVsxXS5sZW5ndGggPT09IDApO1xyXG5cdHNwbGl0RmFpbGVkWzJdID0gKGxlZnROb2RlWzJdLmxlbmd0aCA9PT0gMCkgfHwgKHJpZ2h0Tm9kZVsyXS5sZW5ndGggPT09IDApO1xyXG5cclxuXHRpZiAoc3BsaXRGYWlsZWRbMF0gJiYgc3BsaXRGYWlsZWRbMV0gJiYgc3BsaXRGYWlsZWRbMl0pIHJldHVybiBbXTtcclxuXHJcblx0Ly8gY2hvb3NlIHRoZSBsb25nZXN0IHNwbGl0IGF4aXMuIGlmIHdlIGNhbid0IHNwbGl0IGJ5IGl0LCBjaG9vc2UgbmV4dCBiZXN0IG9uZS5cclxuXHR2YXIgc3BsaXRPcmRlciA9IFswLCAxLCAyXTtcclxuXHJcblx0dmFyIGV4dGVudHNMZW5ndGggPSBbXHJcblx0XHRub2RlLmV4dGVudHNNYXhbMF0gLSBub2RlLmV4dGVudHNNaW5bMF0sXHJcblx0XHRub2RlLmV4dGVudHNNYXhbMV0gLSBub2RlLmV4dGVudHNNaW5bMV0sXHJcblx0XHRub2RlLmV4dGVudHNNYXhbMl0gLSBub2RlLmV4dGVudHNNaW5bMl1cclxuXHRdO1xyXG5cclxuXHRzcGxpdE9yZGVyLnNvcnQoKGF4aXMwLCBheGlzMSkgPT4gZXh0ZW50c0xlbmd0aFtheGlzMV0gLSBleHRlbnRzTGVuZ3RoW2F4aXMwXSk7XHJcblxyXG5cdGxldCBsZWZ0RWxlbWVudHM6bnVtYmVyW10gfCB1bmRlZmluZWQgPSBbXTtcclxuXHRsZXQgcmlnaHRFbGVtZW50czpudW1iZXJbXSB8IHVuZGVmaW5lZCA9IFtdO1xyXG5cclxuXHRmb3IgKGxldCBqID0gMDsgaiA8IDM7IGorKykge1xyXG5cdFx0dmFyIGNhbmRpZGF0ZUluZGV4ID0gc3BsaXRPcmRlcltqXTtcclxuXHRcdGlmICghc3BsaXRGYWlsZWRbY2FuZGlkYXRlSW5kZXhdKSB7XHJcblx0XHRcdGxlZnRFbGVtZW50cyA9IGxlZnROb2RlW2NhbmRpZGF0ZUluZGV4XTtcclxuXHRcdFx0cmlnaHRFbGVtZW50cyA9IHJpZ2h0Tm9kZVtjYW5kaWRhdGVJbmRleF07XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdC8vIHNvcnQgdGhlIGVsZW1lbnRzIGluIHJhbmdlIChzdGFydEluZGV4LCBlbmRJbmRleCkgYWNjb3JkaW5nIHRvIHdoaWNoIG5vZGUgdGhleSBzaG91bGQgYmUgYXRcclxuXHR2YXIgbm9kZTBTdGFydCA9IHN0YXJ0SW5kZXg7XHJcblx0dmFyIG5vZGUwRW5kID0gbm9kZTBTdGFydCArIGxlZnRFbGVtZW50cy5sZW5ndGg7XHJcblx0dmFyIG5vZGUxU3RhcnQgPSBub2RlMEVuZDtcclxuXHR2YXIgbm9kZTFFbmQgPSBlbmRJbmRleDtcclxuXHRcclxuXHRjb3B5Qm94ZXMobGVmdEVsZW1lbnRzLCByaWdodEVsZW1lbnRzLCBub2RlLnN0YXJ0SW5kZXgsIGJib3hBcnJheSwgYmJveEhlbHBlcik7XHJcblxyXG5cdC8vIGNvcHkgcmVzdWx0cyBiYWNrIHRvIG1haW4gYXJyYXlcclxuXHR2YXIgc3ViQXJyID0gYmJveEhlbHBlci5zdWJhcnJheShub2RlLnN0YXJ0SW5kZXggKiA3LCBub2RlLmVuZEluZGV4ICogNyk7XHJcblx0YmJveEFycmF5LnNldChzdWJBcnIsIG5vZGUuc3RhcnRJbmRleCAqIDcpO1xyXG5cclxuXHQvLyBjcmVhdGUgMiBuZXcgbm9kZXMgZm9yIHRoZSBub2RlIHdlIGp1c3Qgc3BsaXQsIGFuZCBhZGQgbGlua3MgdG8gdGhlbSBmcm9tIHRoZSBwYXJlbnQgbm9kZVxyXG5cdHZhciBub2RlMEV4dGVudHMgPSBjYWxjRXh0ZW50cyhiYm94QXJyYXksIG5vZGUwU3RhcnQsIG5vZGUwRW5kLCBFUFNJTE9OKTtcclxuXHR2YXIgbm9kZTFFeHRlbnRzID0gY2FsY0V4dGVudHMoYmJveEFycmF5LCBub2RlMVN0YXJ0LCBub2RlMUVuZCwgRVBTSUxPTik7XHJcblxyXG5cdHZhciBub2RlMCA9IG5ldyBCVkhOb2RlKG5vZGUwRXh0ZW50c1swXSwgbm9kZTBFeHRlbnRzWzFdLCBub2RlMFN0YXJ0LCBub2RlMEVuZCwgbm9kZS5sZXZlbCArIDEpO1xyXG5cdHZhciBub2RlMSA9IG5ldyBCVkhOb2RlKG5vZGUxRXh0ZW50c1swXSwgbm9kZTFFeHRlbnRzWzFdLCBub2RlMVN0YXJ0LCBub2RlMUVuZCwgbm9kZS5sZXZlbCArIDEpO1xyXG5cclxuXHRub2RlLm5vZGUwID0gbm9kZTA7XHJcblx0bm9kZS5ub2RlMSA9IG5vZGUxO1xyXG5cdG5vZGUuY2xlYXJTaGFwZXMoKTtcclxuXHJcblx0Ly8gYWRkIG5ldyBub2RlcyB0byB0aGUgc3BsaXQgcXVldWVcclxuXHRyZXR1cm4gW25vZGUwLCBub2RlMV07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvcHlCb3hlcyhsZWZ0RWxlbWVudHM6bnVtYmVyW10sIHJpZ2h0RWxlbWVudHM6bnVtYmVyW10sIHN0YXJ0SW5kZXg6bnVtYmVyLCBiYm94QXJyYXk6RmxvYXQzMkFycmF5LCBiYm94SGVscGVyOkZsb2F0MzJBcnJheSkge1xyXG5cdHZhciBjb25jYXRlbmF0ZWRFbGVtZW50cyA9IGxlZnRFbGVtZW50cy5jb25jYXQocmlnaHRFbGVtZW50cyk7XHJcblx0dmFyIGhlbHBlclBvcyA9IHN0YXJ0SW5kZXg7XHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb25jYXRlbmF0ZWRFbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0bGV0IGN1cnJFbGVtZW50ID0gY29uY2F0ZW5hdGVkRWxlbWVudHNbaV07XHJcblx0XHRjb3B5Qm94KGJib3hBcnJheSwgY3VyckVsZW1lbnQsIGJib3hIZWxwZXIsIGhlbHBlclBvcyk7XHJcblx0XHRoZWxwZXJQb3MrKztcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhbGNFeHRlbnRzKGJib3hBcnJheTpGbG9hdDMyQXJyYXksIHN0YXJ0SW5kZXg6bnVtYmVyLCBlbmRJbmRleDpudW1iZXIsIGV4cGFuZEJ5OiBudW1iZXIgPSAwLjApOlhZWltdIHtcclxuXHRpZiAoc3RhcnRJbmRleCA+PSBlbmRJbmRleCkgcmV0dXJuIFtbMCwgMCwgMF0sIFswLCAwLCAwXV07XHJcblx0bGV0IG1pblggPSBJbmZpbml0eTtcclxuXHRsZXQgbWluWSA9IEluZmluaXR5O1xyXG5cdGxldCBtaW5aID0gSW5maW5pdHk7XHJcblx0bGV0IG1heFggPSAtSW5maW5pdHk7XHJcblx0bGV0IG1heFkgPSAtSW5maW5pdHk7XHJcblx0bGV0IG1heFogPSAtSW5maW5pdHk7XHJcblx0Zm9yIChsZXQgaSA9IHN0YXJ0SW5kZXg7IGkgPCBlbmRJbmRleDsgaSsrKSB7XHJcblx0XHRsZXQgaWR4ID0gaSAqIDcgKyAxO1xyXG5cdFx0bWluWCA9IE1hdGgubWluKGJib3hBcnJheVtpZHgrK10sIG1pblgpO1xyXG5cdFx0bWluWSA9IE1hdGgubWluKGJib3hBcnJheVtpZHgrK10sIG1pblkpO1xyXG5cdFx0bWluWiA9IE1hdGgubWluKGJib3hBcnJheVtpZHgrK10sIG1pblopO1xyXG5cdFx0bWF4WCA9IE1hdGgubWF4KGJib3hBcnJheVtpZHgrK10sIG1heFgpO1xyXG5cdFx0bWF4WSA9IE1hdGgubWF4KGJib3hBcnJheVtpZHgrK10sIG1heFkpO1xyXG5cdFx0bWF4WiA9IE1hdGgubWF4KGJib3hBcnJheVtpZHhdLCBtYXhaKTtcclxuXHR9XHJcblx0cmV0dXJuIFtcclxuXHRcdFttaW5YIC0gZXhwYW5kQnksIG1pblkgLSBleHBhbmRCeSwgbWluWiAtIGV4cGFuZEJ5XSxcclxuXHRcdFttYXhYICsgZXhwYW5kQnksIG1heFkgKyBleHBhbmRCeSwgbWF4WiArIGV4cGFuZEJ5XVxyXG5cdF07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhbGNCb3VuZGluZ0JveGVzKHRyaWFuZ2xlc0FycmF5OiBGbG9hdDMyQXJyYXkpOkZsb2F0MzJBcnJheSB7XHJcblx0Y29uc3QgdHJpYW5nbGVDb3VudDpudW1iZXIgPSB0cmlhbmdsZXNBcnJheS5sZW5ndGggLyA5O1xyXG5cdGNvbnN0IGJib3hBcnJheTpGbG9hdDMyQXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KHRyaWFuZ2xlQ291bnQgKiA3KTtcclxuXHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0cmlhbmdsZUNvdW50OyBpKyspIHtcclxuXHRcdGxldCBpZHggPSBpICogOTtcclxuXHRcdGNvbnN0IHAweCA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcclxuXHRcdGNvbnN0IHAweSA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcclxuXHRcdGNvbnN0IHAweiA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcclxuXHRcdGNvbnN0IHAxeCA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcclxuXHRcdGNvbnN0IHAxeSA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcclxuXHRcdGNvbnN0IHAxeiA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcclxuXHRcdGNvbnN0IHAyeCA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcclxuXHRcdGNvbnN0IHAyeSA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcclxuXHRcdGNvbnN0IHAyeiA9IHRyaWFuZ2xlc0FycmF5W2lkeF07XHJcblxyXG5cdFx0Y29uc3QgbWluWCA9IE1hdGgubWluKHAweCwgcDF4LCBwMngpO1xyXG5cdFx0Y29uc3QgbWluWSA9IE1hdGgubWluKHAweSwgcDF5LCBwMnkpO1xyXG5cdFx0Y29uc3QgbWluWiA9IE1hdGgubWluKHAweiwgcDF6LCBwMnopO1xyXG5cdFx0Y29uc3QgbWF4WCA9IE1hdGgubWF4KHAweCwgcDF4LCBwMngpO1xyXG5cdFx0Y29uc3QgbWF4WSA9IE1hdGgubWF4KHAweSwgcDF5LCBwMnkpO1xyXG5cdFx0Y29uc3QgbWF4WiA9IE1hdGgubWF4KHAweiwgcDF6LCBwMnopO1xyXG5cdFx0c2V0Qm94KGJib3hBcnJheSwgaSwgaSwgbWluWCwgbWluWSwgbWluWiwgbWF4WCwgbWF4WSwgbWF4Wik7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gYmJveEFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZFRyaWFuZ2xlQXJyYXkodHJpYW5nbGVzOlZlY3RvcltdW10pOkZsb2F0MzJBcnJheSB7XHJcblx0Y29uc3QgdHJpYW5nbGVzQXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KHRyaWFuZ2xlcy5sZW5ndGggKiA5KTtcclxuXHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0cmlhbmdsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGNvbnN0IHAwID0gdHJpYW5nbGVzW2ldWzBdO1xyXG5cdFx0Y29uc3QgcDEgPSB0cmlhbmdsZXNbaV1bMV07XHJcblx0XHRjb25zdCBwMiA9IHRyaWFuZ2xlc1tpXVsyXTtcclxuXHRcdGxldCBpZHggPSBpICogOTtcclxuXHRcdHRyaWFuZ2xlc0FycmF5W2lkeCsrXSA9IHAwLng7XHJcblx0XHR0cmlhbmdsZXNBcnJheVtpZHgrK10gPSBwMC55O1xyXG5cdFx0dHJpYW5nbGVzQXJyYXlbaWR4KytdID0gcDAuejtcclxuXHJcblx0XHR0cmlhbmdsZXNBcnJheVtpZHgrK10gPSBwMS54O1xyXG5cdFx0dHJpYW5nbGVzQXJyYXlbaWR4KytdID0gcDEueTtcclxuXHRcdHRyaWFuZ2xlc0FycmF5W2lkeCsrXSA9IHAxLno7XHJcblxyXG5cdFx0dHJpYW5nbGVzQXJyYXlbaWR4KytdID0gcDIueDtcclxuXHRcdHRyaWFuZ2xlc0FycmF5W2lkeCsrXSA9IHAyLnk7XHJcblx0XHR0cmlhbmdsZXNBcnJheVtpZHhdID0gcDIuejtcclxuXHR9XHJcblxyXG5cdHJldHVybiB0cmlhbmdsZXNBcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0Qm94KGJib3hBcnJheTpGbG9hdDMyQXJyYXksIHBvczpudW1iZXIsIHRyaWFuZ2xlSWQ6bnVtYmVyLCBtaW5YOm51bWJlciwgbWluWTpudW1iZXIsIG1pblo6bnVtYmVyLCBtYXhYOm51bWJlciwgbWF4WTpudW1iZXIsIG1heFo6bnVtYmVyKTp2b2lkIHtcclxuXHRsZXQgaWR4ID0gcG9zICogNztcclxuXHRiYm94QXJyYXlbaWR4KytdID0gdHJpYW5nbGVJZDtcclxuXHRiYm94QXJyYXlbaWR4KytdID0gbWluWDtcclxuXHRiYm94QXJyYXlbaWR4KytdID0gbWluWTtcclxuXHRiYm94QXJyYXlbaWR4KytdID0gbWluWjtcclxuXHRiYm94QXJyYXlbaWR4KytdID0gbWF4WDtcclxuXHRiYm94QXJyYXlbaWR4KytdID0gbWF4WTtcclxuXHRiYm94QXJyYXlbaWR4XSA9IG1heFo7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvcHlCb3goc291cmNlQXJyYXk6RmxvYXQzMkFycmF5LCBzb3VyY2VQb3M6bnVtYmVyLCBkZXN0QXJyYXk6RmxvYXQzMkFycmF5LCBkZXN0UG9zOm51bWJlcik6dm9pZCB7XHJcblx0bGV0IGlkeCA9IGRlc3RQb3MgKiA3O1xyXG5cdGxldCBqZHggPSBzb3VyY2VQb3MgKiA3O1xyXG5cdGRlc3RBcnJheVtpZHgrK10gPSBzb3VyY2VBcnJheVtqZHgrK107XHJcblx0ZGVzdEFycmF5W2lkeCsrXSA9IHNvdXJjZUFycmF5W2pkeCsrXTtcclxuXHRkZXN0QXJyYXlbaWR4KytdID0gc291cmNlQXJyYXlbamR4KytdO1xyXG5cdGRlc3RBcnJheVtpZHgrK10gPSBzb3VyY2VBcnJheVtqZHgrK107XHJcblx0ZGVzdEFycmF5W2lkeCsrXSA9IHNvdXJjZUFycmF5W2pkeCsrXTtcclxuXHRkZXN0QXJyYXlbaWR4KytdID0gc291cmNlQXJyYXlbamR4KytdO1xyXG5cdGRlc3RBcnJheVtpZHhdID0gc291cmNlQXJyYXlbamR4XTtcclxufVxyXG4iLCJleHBvcnQgY2xhc3MgQlZITm9kZSB7XHJcblx0ZXh0ZW50c01pbjogWFlaO1xyXG5cdGV4dGVudHNNYXg6IFhZWjtcclxuXHRzdGFydEluZGV4OiBudW1iZXI7XHJcblx0ZW5kSW5kZXg6IG51bWJlcjtcclxuXHRsZXZlbDogbnVtYmVyO1xyXG5cdG5vZGUwOiBCVkhOb2RlIHwgbnVsbDtcclxuXHRub2RlMTogQlZITm9kZSB8IG51bGw7XHJcblx0Y29uc3RydWN0b3IoZXh0ZW50c01pbjogWFlaLCBleHRlbnRzTWF4OiBYWVosIHN0YXJ0SW5kZXg6IG51bWJlciwgZW5kSW5kZXg6IG51bWJlciwgbGV2ZWw6IG51bWJlcikge1xyXG5cdFx0dGhpcy5leHRlbnRzTWluID0gZXh0ZW50c01pbjtcclxuXHRcdHRoaXMuZXh0ZW50c01heCA9IGV4dGVudHNNYXg7XHJcblx0XHR0aGlzLnN0YXJ0SW5kZXggPSBzdGFydEluZGV4O1xyXG5cdFx0dGhpcy5lbmRJbmRleCA9IGVuZEluZGV4O1xyXG5cdFx0dGhpcy5sZXZlbCA9IGxldmVsO1xyXG5cdFx0dGhpcy5ub2RlMCA9IG51bGw7XHJcblx0XHR0aGlzLm5vZGUxID0gbnVsbDtcclxuXHR9XHJcblx0c3RhdGljIGZyb21PYmooe2V4dGVudHNNaW4sIGV4dGVudHNNYXgsIHN0YXJ0SW5kZXgsIGVuZEluZGV4LCBsZXZlbCwgbm9kZTAsIG5vZGUxfTphbnkpIHtcclxuXHRcdGNvbnN0IHRlbXBOb2RlID0gbmV3IEJWSE5vZGUoZXh0ZW50c01pbiwgZXh0ZW50c01heCwgc3RhcnRJbmRleCwgZW5kSW5kZXgsIGxldmVsKTtcclxuXHRcdGlmKG5vZGUwKSB0ZW1wTm9kZS5ub2RlMCA9IEJWSE5vZGUuZnJvbU9iaihub2RlMCk7XHJcblx0XHRpZihub2RlMSkgdGVtcE5vZGUubm9kZTEgPSBCVkhOb2RlLmZyb21PYmoobm9kZTEpO1xyXG5cdFx0cmV0dXJuIHRlbXBOb2RlO1xyXG5cdH1cclxuXHRlbGVtZW50Q291bnQoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lbmRJbmRleCAtIHRoaXMuc3RhcnRJbmRleDtcclxuXHR9XHJcblxyXG5cdGNlbnRlclgoKSB7XHJcblx0XHRyZXR1cm4gKHRoaXMuZXh0ZW50c01pblswXSArIHRoaXMuZXh0ZW50c01heFswXSkgKiAwLjU7XHJcblx0fVxyXG5cclxuXHRjZW50ZXJZKCkge1xyXG5cdFx0cmV0dXJuICh0aGlzLmV4dGVudHNNaW5bMV0gKyB0aGlzLmV4dGVudHNNYXhbMV0pICogMC41O1xyXG5cdH1cclxuXHJcblx0Y2VudGVyWigpIHtcclxuXHRcdHJldHVybiAodGhpcy5leHRlbnRzTWluWzJdICsgdGhpcy5leHRlbnRzTWF4WzJdKSAqIDAuNTtcclxuXHR9XHJcblxyXG5cdGNsZWFyU2hhcGVzKCkge1xyXG5cdFx0dGhpcy5zdGFydEluZGV4ID0gLTE7XHJcblx0XHR0aGlzLmVuZEluZGV4ID0gLTE7XHJcblx0fVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBCVkhWZWN0b3IzICB7XHJcblx0eDogbnVtYmVyID0gMDtcclxuXHR5OiBudW1iZXIgPSAwO1xyXG5cdHo6IG51bWJlciA9IDA7XHJcblx0Y29uc3RydWN0b3IoeDpudW1iZXIgPSAwLCB5Om51bWJlciA9IDAsIHo6bnVtYmVyID0gMCkge1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHR0aGlzLnogPSB6O1xyXG5cdH1cclxuXHRjb3B5KHY6QlZIVmVjdG9yMykge1xyXG5cdFx0dGhpcy54ID0gdi54O1xyXG5cdFx0dGhpcy55ID0gdi55O1xyXG5cdFx0dGhpcy56ID0gdi56O1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdHNldEZyb21BcnJheShhcnJheTpGbG9hdDMyQXJyYXksIGZpcnN0RWxlbWVudFBvczpudW1iZXIpIHtcclxuXHRcdHRoaXMueCA9IGFycmF5W2ZpcnN0RWxlbWVudFBvc107XHJcblx0XHR0aGlzLnkgPSBhcnJheVtmaXJzdEVsZW1lbnRQb3MrMV07XHJcblx0XHR0aGlzLnogPSBhcnJheVtmaXJzdEVsZW1lbnRQb3MrMl07XHJcblx0fVxyXG5cdHNldEZyb21BcnJheU5vT2Zmc2V0KGFycmF5Om51bWJlcltdKSB7XHJcblx0XHR0aGlzLnggPSBhcnJheVswXTtcclxuXHRcdHRoaXMueSA9IGFycmF5WzFdO1xyXG5cdFx0dGhpcy56ID0gYXJyYXlbMl07XHJcblx0fVxyXG5cclxuXHRzZXRGcm9tQXJncyhhOm51bWJlciwgYjpudW1iZXIsIGM6bnVtYmVyKSB7XHJcblx0XHR0aGlzLnggPSBhO1xyXG5cdFx0dGhpcy55ID0gYjtcclxuXHRcdHRoaXMueiA9IGM7XHJcblx0fVxyXG5cdGFkZCh2OkJWSFZlY3RvcjMpIHtcclxuXHRcdHRoaXMueCArPSB2Lng7XHJcblx0XHR0aGlzLnkgKz0gdi55O1xyXG5cdFx0dGhpcy56ICs9IHYuejtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRtdWx0aXBseVNjYWxhcihzY2FsYXI6bnVtYmVyKSB7XHJcblx0XHR0aGlzLnggKj0gc2NhbGFyO1xyXG5cdFx0dGhpcy55ICo9IHNjYWxhcjtcclxuXHRcdHRoaXMueiAqPSBzY2FsYXI7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0c3ViVmVjdG9ycyhhOkJWSFZlY3RvcjMsIGI6QlZIVmVjdG9yMykge1xyXG5cdFx0dGhpcy54ID0gYS54IC0gYi54O1xyXG5cdFx0dGhpcy55ID0gYS55IC0gYi55O1xyXG5cdFx0dGhpcy56ID0gYS56IC0gYi56O1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdGRvdCh2OkJWSFZlY3RvcjMpIHtcclxuXHRcdHJldHVybiB0aGlzLnggKiB2LnggKyB0aGlzLnkgKiB2LnkgKyB0aGlzLnogKiB2Lno7XHJcblx0fVxyXG5cdGNyb3NzKHY6QlZIVmVjdG9yMykge1xyXG5cdFx0Y29uc3QgeCA9IHRoaXMueCwgeSA9IHRoaXMueSwgeiA9IHRoaXMuejtcclxuXHRcdHRoaXMueCA9IHkgKiB2LnogLSB6ICogdi55O1xyXG5cdFx0dGhpcy55ID0geiAqIHYueCAtIHggKiB2Lno7XHJcblx0XHR0aGlzLnogPSB4ICogdi55IC0geSAqIHYueDtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRjcm9zc1ZlY3RvcnMoYTpCVkhWZWN0b3IzLCBiOkJWSFZlY3RvcjMpIHtcclxuXHRcdGNvbnN0IGF4ID0gYS54LCBheSA9IGEueSwgYXogPSBhLno7XHJcblx0XHRjb25zdCBieCA9IGIueCwgYnkgPSBiLnksIGJ6ID0gYi56O1xyXG5cdFx0dGhpcy54ID0gYXkgKiBieiAtIGF6ICogYnk7XHJcblx0XHR0aGlzLnkgPSBheiAqIGJ4IC0gYXggKiBiejtcclxuXHRcdHRoaXMueiA9IGF4ICogYnkgLSBheSAqIGJ4O1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdGNsb25lKCkge1xyXG5cdFx0cmV0dXJuIG5ldyBCVkhWZWN0b3IzKHRoaXMueCwgdGhpcy55LCB0aGlzLnopO1xyXG5cdH1cclxuXHRzdGF0aWMgZnJvbUFueShwb3RlbnRpYWxWZWN0b3I6YW55KTpCVkhWZWN0b3IzIHtcclxuXHRcdGlmKHBvdGVudGlhbFZlY3RvciBpbnN0YW5jZW9mIEJWSFZlY3RvcjMpIHtcclxuXHRcdFx0cmV0dXJuIHBvdGVudGlhbFZlY3RvcjtcclxuXHRcdH0gZWxzZSBpZiAocG90ZW50aWFsVmVjdG9yLnggIT09IHVuZGVmaW5lZCAmJiBwb3RlbnRpYWxWZWN0b3IueCAhPT0gbnVsbCkge1xyXG5cdFx0XHRyZXR1cm4gbmV3IEJWSFZlY3RvcjMocG90ZW50aWFsVmVjdG9yLngsIHBvdGVudGlhbFZlY3Rvci55LCBwb3RlbnRpYWxWZWN0b3Iueik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ291bGRuJ3QgY29udmVydCB0byBCVkhWZWN0b3IzLlwiKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiZXhwb3J0ICogZnJvbSAnLi9CVkgnO1xyXG5leHBvcnQgKiBmcm9tICcuL0JWSEJ1aWxkZXInO1xyXG5leHBvcnQgKiBmcm9tICcuL0JWSE5vZGUnO1xyXG5leHBvcnQgKiBmcm9tICcuL0JWSFZlY3RvcjMnO1xyXG4iLCJpbXBvcnQgeyBCVkhOb2RlIH0gZnJvbSAnLi9CVkhOb2RlJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb3VudE5vZGVzKG5vZGU6QlZITm9kZSwgY291bnQ6bnVtYmVyID0gMCk6bnVtYmVyIHtcclxuXHRjb3VudCArPSAxO1xyXG5cdGlmKG5vZGUubm9kZTApIHtcclxuXHRcdGNvdW50ICs9IGNvdW50Tm9kZXMobm9kZS5ub2RlMCk7XHJcblx0fVxyXG5cdGlmKG5vZGUubm9kZTEpIHtcclxuXHRcdGNvdW50ICs9IGNvdW50Tm9kZXMobm9kZS5ub2RlMSk7XHJcblx0fVxyXG5cdGlmKChub2RlIGFzIGFueSkuX25vZGUwKSB7XHJcblx0XHRjb3VudCArPSBjb3VudE5vZGVzKChub2RlIGFzIGFueSkuX25vZGUwKTtcclxuXHR9XHJcblx0aWYoKG5vZGUgYXMgYW55KS5fbm9kZTEpIHtcclxuXHRcdGNvdW50ICs9IGNvdW50Tm9kZXMoKG5vZGUgYXMgYW55KS5fbm9kZTEpO1xyXG5cdH1cclxuXHRyZXR1cm4gY291bnQ7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhc3luY1dvcmsod29ya0NoZWNrOkV2YWx1YXRvciwgd29yazpXb3JrLCBvcHRpb25zOkFzeW5jaWZ5UGFyYW1zLCBwcm9ncmVzc0NhbGxiYWNrPzpXb3JrUHJvZ3Jlc3NDYWxsYmFjayk6UHJvbWlzZTx2b2lkPiB7XHJcblx0aWYob3B0aW9ucy5tcyAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuc3RlcHMgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0Y29uc29sZS53YXJuKFwiQXN5bmNpZnkgZ290IGJvdGggc3RlcHMgYW5kIG1zLCBkZWZhdWx0aW5nIHRvIHN0ZXBzLlwiKTtcclxuXHR9XHJcblx0Y29uc3Qgd29ya2VyOkdlbmVyYXRvciA9IChvcHRpb25zLnN0ZXBzICE9PSB1bmRlZmluZWQgPyBwZXJjZW50YWdlQXN5bmNpZnkgOiB0aW1lQXN5bmNpZnkpKHdvcmtDaGVjaywgd29yaywgb3B0aW9ucyk7XHJcblx0bGV0IGRvbmU6IGJvb2xlYW47XHJcblx0bGV0IG5vZGVzU3BsaXQ6IG51bWJlcjtcclxuXHR3aGlsZSghKHt2YWx1ZTogbm9kZXNTcGxpdCwgZG9uZX0gPSB3b3JrZXIubmV4dCgpLCBkb25lKSkge1xyXG5cdFx0aWYodHlwZW9mIHByb2dyZXNzQ2FsbGJhY2sgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHByb2dyZXNzQ2FsbGJhY2soe25vZGVzU3BsaXR9KTtcclxuXHRcdH1cclxuXHRcdGF3YWl0IHRpY2tpZnkoKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uKiB0aW1lQXN5bmNpZnkod29ya0NoZWNrOkV2YWx1YXRvciwgd29yazpXb3JrLCB7bXM9MTAwMCAvIDMwfTpBc3luY2lmeVBhcmFtcykge1xyXG5cdGxldCBzVGltZTpudW1iZXIgPSBEYXRlLm5vdygpO1xyXG5cdGxldCBuOm51bWJlciA9IDA7XHJcblx0bGV0IHRocmVzOm51bWJlciA9IDA7XHJcblx0bGV0IGNvdW50Om51bWJlciA9IDA7XHJcblx0d2hpbGUod29ya0NoZWNrKCkgPCAxKSB7XHJcblx0XHR3b3JrKCk7XHJcblx0XHRjb3VudCsrO1xyXG5cdFx0aWYoKytuID49IHRocmVzKSB7XHJcblx0XHRcdGNvbnN0IGNUaW1lID0gRGF0ZS5ub3coKTtcclxuXHRcdFx0Y29uc3QgdERpZmYgPSBjVGltZSAtIHNUaW1lO1xyXG5cdFx0XHRpZih0RGlmZiA+IG1zKSB7XHJcblx0XHRcdFx0eWllbGQgY291bnQ7XHJcblx0XHRcdFx0dGhyZXMgPSBuICogKG1zIC8gdERpZmYpO1xyXG5cdFx0XHRcdHNUaW1lID0gY1RpbWU7XHJcblx0XHRcdFx0biA9IDA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uKiBwZXJjZW50YWdlQXN5bmNpZnkod29ya0NoZWNrOkV2YWx1YXRvciwgd29yazpXb3JrLCB7c3RlcHM9MTB9OkFzeW5jaWZ5UGFyYW1zKSB7XHJcblx0aWYoc3RlcHMgPD0gMCkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQXN5bmNpZnkgc3RlcHMgd2FzIGxlc3MgdGhhbiBvciBlcXVhbCB0byB6ZXJvXCIpO1xyXG5cdH1cclxuXHRsZXQgY291bnQ6bnVtYmVyID0gMDtcclxuXHRsZXQgdG90YWxOdW1iZXI6IG51bWJlciA9IDA7XHJcblx0bGV0IGxhc3RJbmM6bnVtYmVyID0gMDtcclxuXHRsZXQgd29ya1BlcmNlbnRhZ2U6bnVtYmVyO1xyXG5cdGxldCBwZXJjZW50YWdlOm51bWJlciA9IDEgLyBzdGVwcztcclxuXHR3aGlsZSgod29ya1BlcmNlbnRhZ2UgPSB3b3JrQ2hlY2soKSwgd29ya1BlcmNlbnRhZ2UgPCAxKSkge1xyXG5cdFx0d29yaygpO1xyXG5cdFx0Y291bnQrKztcclxuXHRcdGlmKHdvcmtQZXJjZW50YWdlID4gbGFzdEluYykge1xyXG5cdFx0XHR0b3RhbE51bWJlciArPSAxO1xyXG5cdFx0XHR5aWVsZCBjb3VudDtcclxuXHRcdFx0bGFzdEluYyA9IHdvcmtQZXJjZW50YWdlICsgcGVyY2VudGFnZTtcclxuXHRcdH1cclxuXHR9XHJcblx0Y29uc29sZS5sb2coXCJUb3RhbFwiLCB0b3RhbE51bWJlcik7XHJcbn1cclxuXHJcblxyXG5cclxuY29uc3QgdGlja2lmeSA9ICgpOlByb21pc2U8dm9pZD4gPT4gbmV3IFByb21pc2UoKHJlczpXb3JrKSA9PiBzZXRUaW1lb3V0KHJlcykpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9