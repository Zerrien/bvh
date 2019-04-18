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
function BVHBuilderAsync(triangles, maxTrianglesPerNode = 10, asyncParams = {}, progressCallback) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof maxTrianglesPerNode !== 'number')
            throw new Error(`maxTrianglesPerNode must be of type number, got: ${typeof maxTrianglesPerNode}`);
        if (maxTrianglesPerNode < 1)
            throw new Error(`maxTrianglesPerNode must be greater than or equal to 1, got: ${maxTrianglesPerNode}`);
        if (Number.isNaN(maxTrianglesPerNode))
            throw new Error(`maxTrianglesPerNode is NaN`);
        if (!Number.isInteger(maxTrianglesPerNode))
            console.warn(`maxTrianglesPerNode is expected to be an integer, got: ${maxTrianglesPerNode}`);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZG9jcy93b3JrZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0JWSC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQlZIQnVpbGRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQlZITm9kZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQlZIVmVjdG9yMy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBLGlFQUFvRTtBQUVwRSxJQUFJLEdBQU8sQ0FBQztBQUVaLFNBQVMsR0FBRyxVQUFlLEVBQUMsSUFBSSxFQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxFQUFDOztRQUNoRCxJQUFHLE9B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bUIsR0FBRztJQUN0RyxJQUFJLFVBQVUsSUFBSSxRQUFRO1FBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxRCxJQUFJLElBQUksR0FBRyxRQUFRLENBQUM7SUFDcEIsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBQ3BCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQztJQUNwQixJQUFJLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUNyQixJQUFJLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUNyQixJQUFJLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUNyQixLQUFLLElBQUksQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzNDLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN0QztJQUNELE9BQU87UUFDTixDQUFDLElBQUksR0FBRyxRQUFRLEVBQUUsSUFBSSxHQUFHLFFBQVEsRUFBRSxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQ25ELENBQUMsSUFBSSxHQUFHLFFBQVEsRUFBRSxJQUFJLEdBQUcsUUFBUSxFQUFFLElBQUksR0FBRyxRQUFRLENBQUM7S0FDbkQsQ0FBQztBQUNILENBQUM7QUFFRCxTQUFTLGlCQUFpQixDQUFDLGNBQTRCO0lBQ3RELE1BQU0sYUFBYSxHQUFVLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sU0FBUyxHQUFnQixJQUFJLFlBQVksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFbkUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN2QyxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVoQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUM1RDtJQUVELE9BQU8sU0FBUyxDQUFDO0FBQ2xCLENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUFDLFNBQW9CO0lBQy9DLE1BQU0sY0FBYyxHQUFHLElBQUksWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFOUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDMUMsTUFBTSxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sRUFBRSxHQUFHLFNBQVMsQ0FBQyxD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R0FBVyxDQUFDLENBQUM7SUFDNUIsSUFBSSxPQUFPLEdBQVUsQ0FBQyxDQUFDO0lBQ3ZCLElBQUksY0FBcUIsQ0FBQztJQUMxQixJQUFJLFVBQVUsR0FBVSxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ2xDLE9BQU0sQ0FBQyxjQUFjLEdBQUcsU0FBUyxFQUFFLEVBQUUsY0FBYyxHQUFHLENBQUMsQ0FBQyxFQUFFO1FBQ3pELElBQUksRUFBRSxDQUFDO1FBQ1AsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFHLGNBQWMsR0FBRyxPQUFPLEVBQUU7WUFDNUIsV0FBVyxJQUFJLENBQUMsQ0FBQztZQUNqQixNQUFNLEtBQUssQ0FBQztZQUNaLE9BQU8sR0FBRyxjQUFjLEdBQUcsVUFBVSxDQUFDO1NBQ3RDO0tBQ0Q7SUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBSUQsTUFBTSxPQUFPLEdBQUcsR0FBaUIsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiIuL3dvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vZG9jcy93b3JrZXIudHNcIik7XG4iLCJpbXBvcnQgeyBCVkhCdWlsZGVyLCBCVkhCdWlsZGVyQXN5bmMsIEJWSCwgQlZIVmVjdG9yMyB9IGZyb20gJ0BzcmMnO1xyXG5cclxubGV0IGJ2aDpCVkg7XHJcblxyXG5vbm1lc3NhZ2UgPSBhc3luYyBmdW5jdGlvbih7ZGF0YTp7bWVzc2FnZSwgZGF0YX19KSB7XHJcblx0aWYobWVzc2FnZSA9PT0gXCJidmhfaW5mb1wiKSB7XHJcblx0XHRidWlsZEJWSChkYXRhLmZhY2VzQXJyYXkpO1xyXG5cdH0gZWxzZSBpZiAobWVzc2FnZSA9PT0gXCJyYXlfY2FzdFwiKSB7XHJcblx0XHRyYXlDYXN0KGRhdGEub3JpZ2luLCBkYXRhLmRpcmVjdGlvbik7XHJcblx0fVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBidWlsZEJWSChhcnJheTphbnkgKSB7XHJcblx0YnZoID0gYXdhaXQgQlZIQnVpbGRlckFzeW5jKGFycmF5LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdChzZWxmIGFzIGFueSkucG9zdE1lc3NhZ2Uoe1xyXG5cdFx0XHRtZXNzYWdlOiBcInByb2dyZXNzXCIsXHJcblx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHR2YWx1ZVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHQoc2VsZiBhcyBhbnkpLnBvc3RNZXNzYWdlKHtcclxuXHRcdG1lc3NhZ2U6IFwiZG9uZVwiXHJcblx0fSlcclxufVxyXG5cclxuZnVuY3Rpb24gcmF5Q2FzdChvcmlnaW46YW55LCBkaXJlY3Rpb246YW55KSB7XHJcblx0bGV0IHJlc3VsdCA9IGJ2aC5pbnRlcnNlY3RSYXkob3JpZ2luLCBkaXJlY3Rpb24sIGZhbHNlKTtcclxuXHQoc2VsZiBhcyBhbnkpLnBvc3RNZXNzYWdlKCB7XHJcblx0XHRtZXNzYWdlOiBcInJheV90cmFjZWRcIixcclxuXHRcdGRhdGE6IHJlc3VsdFxyXG5cdH0pO1xyXG59IiwiaW1wb3J0IHsgQlZIVmVjdG9yMyB9IGZyb20gJy4vQlZIVmVjdG9yMyc7XHJcbmltcG9ydCB7IEJWSE5vZGUgfSBmcm9tICcuL0JWSE5vZGUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJWSCB7XHJcblx0cm9vdE5vZGU6IEJWSE5vZGU7XHJcblx0YmJveEFycmF5OiBGbG9hdDMyQXJyYXk7XHJcblx0dHJpYW5nbGVzQXJyYXk6IEZsb2F0MzJBcnJheTtcclxuXHRjb25zdHJ1Y3Rvcihyb290Tm9kZTpCVkhOb2RlLCBib3VuZGluZ0JveEFycmF5OkZsb2F0MzJBcnJheSwgdHJpYW5nbGVBcnJheTpGbG9hdDMyQXJyYXkpIHtcclxuXHRcdHRoaXMucm9vdE5vZGUgPSByb290Tm9kZTtcclxuXHRcdHRoaXMuYmJveEFycmF5ID0gYm91bmRpbmdCb3hBcnJheTtcclxuXHRcdHRoaXMudHJpYW5nbGVzQXJyYXkgPSB0cmlhbmdsZUFycmF5O1xyXG5cdH1cclxuXHRpbnRlcnNlY3RSYXkocmF5T3JpZ2luOmFueSwgcmF5RGlyZWN0aW9uOmFueSwgYmFja2ZhY2VDdWxsaW5nOmJvb2xlYW4gPSB0cnVlKTphbnlbXSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRyYXlPcmlnaW4gPSBCVkhWZWN0b3IzLmZyb21BbnkocmF5T3JpZ2luKTtcclxuXHRcdFx0cmF5RGlyZWN0aW9uID0gQlZIVmVjdG9yMy5mcm9tQW55KHJheURpcmVjdGlvbik7XHJcblx0XHR9IGNhdGNoKGVycm9yKSB7XHJcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJPcmlnaW4gb3IgRGlyZWN0aW9uIGNvdWxkbid0IGJlIGNvbnZlcnRlZCB0byBhIEJWSFZlY3RvcjMuXCIpO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3Qgbm9kZXNUb0ludGVyc2VjdDpCVkhOb2RlW10gPSBbdGhpcy5yb290Tm9kZV07XHJcblx0XHRjb25zdCB0cmlhbmdsZXNJbkludGVyc2VjdGluZ05vZGVzOm51bWJlcltdID0gW107IC8vIGEgbGlzdCBvZiBub2RlcyB0aGF0IGludGVyc2VjdCB0aGUgcmF5IChhY2NvcmRpbmcgdG8gdGhlaXIgYm91bmRpbmcgYm94KVxyXG5cdFx0Y29uc3QgaW50ZXJzZWN0aW5nVHJpYW5nbGVzOm9iamVjdFtdID0gW107XHJcblxyXG5cdFx0Y29uc3QgaW52UmF5RGlyZWN0aW9uID0gbmV3IEJWSFZlY3RvcjMoXHJcblx0XHRcdDEuMCAvIHJheURpcmVjdGlvbi54LFxyXG5cdFx0XHQxLjAgLyByYXlEaXJlY3Rpb24ueSxcclxuXHRcdFx0MS4wIC8gcmF5RGlyZWN0aW9uLnpcclxuXHRcdCk7XHJcblxyXG5cdFx0Ly8gZ28gb3ZlciB0aGUgQlZIIHRyZWUsIGFuZCBleHRyYWN0IHRoZSBsaXN0IG9mIHRyaWFuZ2xlcyB0aGF0IGxpZSBpbiBub2RlcyB0aGF0IGludGVyc2VjdCB0aGUgcmF5LlxyXG5cdFx0Ly8gbm90ZTogdGhlc2UgdHJpYW5nbGVzIG1heSBub3QgaW50ZXJzZWN0IHRoZSByYXkgdGhlbXNlbHZlc1xyXG5cdFx0d2hpbGUobm9kZXNUb0ludGVyc2VjdC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGNvbnN0IG5vZGU6QlZITm9kZSB8IHVuZGVmaW5lZCA9IG5vZGVzVG9JbnRlcnNlY3QucG9wKCk7XHJcblx0XHRcdGlmKCFub2RlKSBjb250aW51ZTtcclxuXHRcdFx0aWYoQlZILmludGVyc2VjdE5vZGVCb3gocmF5T3JpZ2luLCBpbnZSYXlEaXJlY3Rpb24sIG5vZGUpKSB7XHJcblx0XHRcdFx0aWYobm9kZS5ub2RlMCkge1xyXG5cdFx0XHRcdFx0bm9kZXNUb0ludGVyc2VjdC5wdXNoKG5vZGUubm9kZTApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihub2RlLm5vZGUxKSB7XHJcblx0XHRcdFx0XHRub2Rlc1RvSW50ZXJzZWN0LnB1c2gobm9kZS5ub2RlMSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZvcihsZXQgaSA9IG5vZGUuc3RhcnRJbmRleDsgaSA8IG5vZGUuZW5kSW5kZXg7IGkrKykge1xyXG5cdFx0XHRcdFx0dHJpYW5nbGVzSW5JbnRlcnNlY3RpbmdOb2Rlcy5wdXNoKHRoaXMuYmJveEFycmF5W2kqN10pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIG92ZXIgdGhlIGxpc3Qgb2YgY2FuZGlkYXRlIHRyaWFuZ2xlcywgYW5kIGNoZWNrIGVhY2ggb2YgdGhlbSB1c2luZyByYXkgdHJpYW5nbGUgaW50ZXJzZWN0aW9uXHJcblx0XHRsZXQgYTpCVkhWZWN0b3IzID0gbmV3IEJWSFZlY3RvcjMoKTtcclxuXHRcdGxldCBiOkJWSFZlY3RvcjMgPSBuZXcgQlZIVmVjdG9yMygpO1xyXG5cdFx0bGV0IGM6QlZIVmVjdG9yMyA9IG5ldyBCVkhWZWN0b3IzKCk7XHJcblxyXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IHRyaWFuZ2xlc0luSW50ZXJzZWN0aW5nTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgdHJpSW5kZXggPSB0cmlhbmdsZXNJbkludGVyc2VjdGluZ05vZGVzW2ldO1xyXG5cclxuXHRcdFx0YS5zZXRGcm9tQXJyYXkodGhpcy50cmlhbmdsZXNBcnJheSwgdHJpSW5kZXgqOSk7XHJcblx0XHRcdGIuc2V0RnJvbUFycmF5KHRoaXMudHJpYW5nbGVzQXJyYXksIHRyaUluZGV4KjkrMyk7XHJcblx0XHRcdGMuc2V0RnJvbUFycmF5KHRoaXMudHJpYW5nbGVzQXJyYXksIHRyaUluZGV4KjkrNik7XHJcblxyXG5cdFx0XHRjb25zdCBpbnRlcnNlY3Rpb25Qb2ludCA9IEJWSC5pbnRlcnNlY3RSYXlUcmlhbmdsZShhLCBiLCBjLCByYXlPcmlnaW4sIHJheURpcmVjdGlvbiwgYmFja2ZhY2VDdWxsaW5nKTtcclxuXHJcblx0XHRcdGlmKCFpbnRlcnNlY3Rpb25Qb2ludCkgY29udGludWU7XHJcblx0XHRcdGludGVyc2VjdGluZ1RyaWFuZ2xlcy5wdXNoKHtcclxuXHRcdFx0XHQvL3RyaWFuZ2xlOiBbYS5jbG9uZSgpLCBiLmNsb25lKCksIGMuY2xvbmUoKV0sXHJcblx0XHRcdFx0dHJpYW5nbGVJbmRleDogdHJpSW5kZXgsXHJcblx0XHRcdFx0aW50ZXJzZWN0aW9uUG9pbnQ6IGludGVyc2VjdGlvblBvaW50XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBpbnRlcnNlY3RpbmdUcmlhbmdsZXM7XHJcblx0fVxyXG5cdHN0YXRpYyBjYWxjVFZhbHVlcyhtaW5WYWw6bnVtYmVyLCBtYXhWYWw6bnVtYmVyLCByYXlPcmlnaW5Db29yZDpudW1iZXIsIGludmRpcjogbnVtYmVyKTpudW1iZXJbXSB7XHJcblx0XHRpZihpbnZkaXIgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gWyhtaW5WYWwgLSByYXlPcmlnaW5Db29yZCkgKiBpbnZkaXIsIChtYXhWYWwgLSByYXlPcmlnaW5Db29yZCkgKiBpbnZkaXJdO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIFsobWF4VmFsIC0gcmF5T3JpZ2luQ29vcmQpICogaW52ZGlyLCAobWluVmFsIC0gcmF5T3JpZ2luQ29vcmQpICogaW52ZGlyXTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBpbnRlcnNlY3ROb2RlQm94KHJheU9yaWdpbjogQlZIVmVjdG9yMywgaW52UmF5RGlyZWN0aW9uOiBCVkhWZWN0b3IzLCBub2RlOiBCVkhOb2RlKTpib29sZWFuIHtcclxuXHRcdGxldCBbdG1pbiwgdG1heF06bnVtYmVyW10gPSBCVkguY2FsY1RWYWx1ZXMobm9kZS5leHRlbnRzTWluWzBdLCBub2RlLmV4dGVudHNNYXhbMF0sIHJheU9yaWdpbi54LCBpbnZSYXlEaXJlY3Rpb24ueCk7XHJcblx0XHRsZXQgW3R5bWluLCB0eW1heF06bnVtYmVyW10gPSBCVkguY2FsY1RWYWx1ZXMobm9kZS5leHRlbnRzTWluWzFdLCBub2RlLmV4dGVudHNNYXhbMV0sIHJheU9yaWdpbi55LCBpbnZSYXlEaXJlY3Rpb24ueSk7XHJcblxyXG5cdFx0aWYodG1pbiA+IHR5bWF4IHx8IHR5bWluID4gdG1heCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdC8vIFRoZXNlIGxpbmVzIGFsc28gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHRtaW4gb3IgdG1heCBpcyBOYU5cclxuXHRcdC8vIChyZXN1bHQgb2YgMCAqIEluZmluaXR5KS4geCAhPT0geCByZXR1cm5zIHRydWUgaWYgeCBpcyBOYU5cclxuXHRcdGlmKHR5bWluID4gdG1pbiB8fCB0bWluICE9PSB0bWluKSB7XHJcblx0XHRcdHRtaW4gPSB0eW1pbjtcclxuXHRcdH1cclxuXHJcblx0XHRpZih0eW1heCA8IHRtYXggfHwgdG1heCAhPT0gdG1heCkge1xyXG5cdFx0XHR0bWF4ID0gdHltYXg7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IFt0em1pbiwgdHptYXhdOm51bWJlcltdID0gQlZILmNhbGNUVmFsdWVzKG5vZGUuZXh0ZW50c01pblsyXSwgbm9kZS5leHRlbnRzTWF4WzJdLCByYXlPcmlnaW4ueiwgaW52UmF5RGlyZWN0aW9uLnopO1xyXG5cclxuXHRcdGlmKHRtaW4gPiB0em1heCB8fCB0em1pbiA+IHRtYXgpIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRpZih0em1heCA8IHRtYXggfHwgdG1heCAhPT0gdG1heCkge1xyXG5cdFx0XHR0bWF4ID0gdHptYXg7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9yZXR1cm4gcG9pbnQgY2xvc2VzdCB0byB0aGUgcmF5IChwb3NpdGl2ZSBzaWRlKVxyXG5cdFx0aWYodG1heCA8IDApIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBpbnRlcnNlY3RSYXlUcmlhbmdsZShhOkJWSFZlY3RvcjMsIGI6QlZIVmVjdG9yMywgYzpCVkhWZWN0b3IzLCByYXlPcmlnaW46QlZIVmVjdG9yMywgcmF5RGlyZWN0aW9uOkJWSFZlY3RvcjMsIGJhY2tmYWNlQ3VsbGluZzpib29sZWFuKTpCVkhWZWN0b3IzIHwgbnVsbCB7XHJcblx0XHR2YXIgZGlmZjpCVkhWZWN0b3IzID0gbmV3IEJWSFZlY3RvcjMoKTtcclxuXHRcdHZhciBlZGdlMTpCVkhWZWN0b3IzID0gbmV3IEJWSFZlY3RvcjMoKTtcclxuXHRcdHZhciBlZGdlMjpCVkhWZWN0b3IzID0gbmV3IEJWSFZlY3RvcjMoKTtcclxuXHRcdHZhciBub3JtYWw6QlZIVmVjdG9yMyA9IG5ldyBCVkhWZWN0b3IzKCk7XHJcblxyXG5cdFx0Ly8gZnJvbSBodHRwOi8vd3d3Lmdlb21ldHJpY3Rvb2xzLmNvbS9MaWJNYXRoZW1hdGljcy9JbnRlcnNlY3Rpb24vV201SW50clJheTNUcmlhbmdsZTMuY3BwXHJcblx0XHRlZGdlMS5zdWJWZWN0b3JzKGIsIGEpO1xyXG5cdFx0ZWRnZTIuc3ViVmVjdG9ycyhjLCBhKTtcclxuXHRcdG5vcm1hbC5jcm9zc1ZlY3RvcnMoZWRnZTEsIGVkZ2UyKTtcclxuXHJcblx0XHQvLyBTb2x2ZSBRICsgdCpEID0gYjEqRTEgKyBiTCpFMiAoUSA9IGtEaWZmLCBEID0gcmF5IGRpcmVjdGlvbixcclxuXHRcdC8vIEUxID0ga0VkZ2UxLCBFMiA9IGtFZGdlMiwgTiA9IENyb3NzKEUxLEUyKSkgYnlcclxuXHRcdC8vICAgfERvdChELE4pfCpiMSA9IHNpZ24oRG90KEQsTikpKkRvdChELENyb3NzKFEsRTIpKVxyXG5cdFx0Ly8gICB8RG90KEQsTil8KmIyID0gc2lnbihEb3QoRCxOKSkqRG90KEQsQ3Jvc3MoRTEsUSkpXHJcblx0XHQvLyAgIHxEb3QoRCxOKXwqdCA9IC1zaWduKERvdChELE4pKSpEb3QoUSxOKVxyXG5cdFx0bGV0IERkTjpudW1iZXIgPSByYXlEaXJlY3Rpb24uZG90KG5vcm1hbCk7XHJcblx0XHRpZihEZE4gPT09IDApIHJldHVybiBudWxsO1xyXG5cdFx0aWYoRGROID4gMCAmJiBiYWNrZmFjZUN1bGxpbmcpIHJldHVybiBudWxsO1xyXG5cdFx0bGV0IHNpZ246bnVtYmVyID0gTWF0aC5zaWduKERkTik7XHJcblx0XHREZE4gKj0gc2lnbjtcclxuXHJcblx0XHRkaWZmLnN1YlZlY3RvcnMocmF5T3JpZ2luLCBhKTtcclxuXHRcdHZhciBEZFF4RTIgPSBzaWduICogcmF5RGlyZWN0aW9uLmRvdChlZGdlMi5jcm9zc1ZlY3RvcnMoZGlmZiwgZWRnZTIpKTtcclxuXHJcblx0XHQvLyBiMSA8IDAsIG5vIGludGVyc2VjdGlvblxyXG5cdFx0aWYoRGRReEUyIDwgMCkgcmV0dXJuIG51bGw7XHJcblxyXG5cdFx0dmFyIERkRTF4USA9IHNpZ24gKiByYXlEaXJlY3Rpb24uZG90KGVkZ2UxLmNyb3NzKGRpZmYpKTtcclxuXHJcblx0XHQvLyBiMiA8IDAsIG5vIGludGVyc2VjdGlvblxyXG5cdFx0aWYoRGRFMXhRIDwgMCkgcmV0dXJuIG51bGw7XHJcblxyXG5cdFx0Ly8gYjErYjIgPiAxLCBubyBpbnRlcnNlY3Rpb25cclxuXHRcdGlmKERkUXhFMiArIERkRTF4USA+IERkTikgcmV0dXJuIG51bGw7XHJcblxyXG5cdFx0Ly8gTGluZSBpbnRlcnNlY3RzIHRyaWFuZ2xlLCBjaGVjayBpZiByYXkgZG9lcy5cclxuXHRcdGNvbnN0IFFkTjpudW1iZXIgPSAtc2lnbiAqIGRpZmYuZG90KG5vcm1hbCk7XHJcblxyXG5cdFx0Ly8gdCA8IDAsIG5vIGludGVyc2VjdGlvblxyXG5cdFx0aWYoUWROIDwgMCkgcmV0dXJuIG51bGw7XHJcblxyXG5cdFx0Ly8gUmF5IGludGVyc2VjdHMgdHJpYW5nbGUuXHJcblx0XHRyZXR1cm4gcmF5RGlyZWN0aW9uLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoUWROIC8gRGROKS5hZGQocmF5T3JpZ2luKTtcclxuXHR9XHJcbn1cclxuIiwiZGVjbGFyZSBnbG9iYWwge1xyXG5cdGludGVyZmFjZSBYWVoge1xyXG5cdFx0MDogbnVtYmVyLFxyXG5cdFx0MTogbnVtYmVyLFxyXG5cdFx0MjogbnVtYmVyXHJcblx0fVxyXG5cdFxyXG5cdGludGVyZmFjZSBWZWN0b3Ige1xyXG5cdFx0eDogbnVtYmVyO1xyXG5cdFx0eTogbnVtYmVyO1xyXG5cdFx0ejogbnVtYmVyO1xyXG5cdH1cclxuXHJcblx0dHlwZSBFdmFsdWF0b3IgPSAoKSA9PiBudW1iZXI7XHJcblx0dHlwZSBXb3JrID0gKCkgPT4gdm9pZDtcclxuXHR0eXBlIFdvcmtQcm9ncmVzcyA9IHtub2Rlc1NwbGl0OiBudW1iZXJ9O1xyXG5cdHR5cGUgV29ya1Byb2dyZXNzQ2FsbGJhY2sgPSAocHJvZ3Jlc3NPYmo6V29ya1Byb2dyZXNzKSA9PiB2b2lkO1xyXG5cdHR5cGUgQlZIUHJvZ3Jlc3MgPSB7bm9kZXNTcGxpdDogbnVtYmVyLCB0cmlhbmdsZXNMZWFmZWQ6IG51bWJlcn07XHJcblx0dHlwZSBBc3luY2lmeVBhcmFtcyA9IHttcz86IG51bWJlciwgc3RlcHM/OiBudW1iZXJ9O1xyXG59XHJcblxyXG5jb25zdCBFUFNJTE9OID0gMWUtNjtcclxuXHJcbmltcG9ydCB7IEJWSFZlY3RvcjMgfSBmcm9tIFwiLi9CVkhWZWN0b3IzXCI7XHJcbmltcG9ydCB7IEJWSE5vZGUgfSBmcm9tIFwiLi9CVkhOb2RlXCI7XHJcbmltcG9ydCB7IEJWSCB9IGZyb20gXCIuL0JWSFwiO1xyXG5pbXBvcnQgeyBhc3luY1dvcmsgfSBmcm9tICcuL3V0aWxzJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEJWSEJ1aWxkZXIodHJpYW5nbGVzOnVua25vd24gfCBWZWN0b3JbXVtdIHwgbnVtYmVyW10gfCBGbG9hdDMyQXJyYXksIG1heFRyaWFuZ2xlc1Blck5vZGU6bnVtYmVyID0gMTApIHtcclxuXHRpZih0eXBlb2YgbWF4VHJpYW5nbGVzUGVyTm9kZSAhPT0gJ251bWJlcicpIHRocm93IG5ldyBFcnJvcihgbWF4VHJpYW5nbGVzUGVyTm9kZSBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyLCBnb3Q6ICR7dHlwZW9mIG1heFRyaWFuZ2xlc1Blck5vZGV9YCk7XHJcblx0aWYobWF4VHJpYW5nbGVzUGVyTm9kZSA8IDEpIHRocm93IG5ldyBFcnJvcihgbWF4VHJpYW5nbGVzUGVyTm9kZSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAxLCBnb3Q6ICR7bWF4VHJpYW5nbGVzUGVyTm9kZX1gKTtcclxuXHRpZihOdW1iZXIuaXNOYU4obWF4VHJpYW5nbGVzUGVyTm9kZSkpIHRocm93IG5ldyBFcnJvcihgbWF4VHJpYW5nbGVzUGVyTm9kZSBpcyBOYU5gKTtcclxuXHRpZighTnVtYmVyLmlzSW50ZWdlcihtYXhUcmlhbmdsZXNQZXJOb2RlKSkgY29uc29sZS53YXJuKGBtYXhUcmlhbmdsZXNQZXJOb2RlIGlzIGV4cGVjdGVkIHRvIGJlIGFuIGludGVnZXIsIGdvdDogJHttYXhUcmlhbmdsZXNQZXJOb2RlfWApO1xyXG5cdGxldCB0cmlhbmdsZXNBcnJheTpGbG9hdDMyQXJyYXk7XHJcblx0Ly9WZWN0b3JbXVtdIHwgbnVtYmVyW10gfCBGbG9hdDMyQXJyYXlcclxuXHRpZihBcnJheS5pc0FycmF5KHRyaWFuZ2xlcykgJiYgdHJpYW5nbGVzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0Y29uc29sZS53YXJuKGB0cmlhbmdsZXMgYXBwZWFycyB0byBiZSBhbiBhcnJheSB3aXRoIDAgZWxlbWVudHMuYCk7XHJcblx0fVxyXG5cdGlmKGlzRmFjZUFycmF5KHRyaWFuZ2xlcykpIHtcclxuXHRcdHRyaWFuZ2xlc0FycmF5ID0gYnVpbGRUcmlhbmdsZUFycmF5KHRyaWFuZ2xlcyk7XHJcblx0fSBlbHNlIGlmICh0cmlhbmdsZXMgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkpIHtcclxuXHRcdHRyaWFuZ2xlc0FycmF5ID0gdHJpYW5nbGVzO1xyXG5cdH0gZWxzZSBpZiAoaXNOdW1iZXJBcnJheSh0cmlhbmdsZXMpKSB7XHJcblx0XHR0cmlhbmdsZXNBcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkodHJpYW5nbGVzKVxyXG5cdH0gZWxzZSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoYHRyaWFuZ2xlcyBtdXN0IGJlIG9mIHR5cGUgVmVjdG9yW11bXSB8IG51bWJlcltdIHwgRmxvYXQzMkFycmF5LCBnb3Q6ICR7dHlwZW9mIHRyaWFuZ2xlc31gKTtcclxuXHR9XHJcblx0bGV0IGJib3hBcnJheTpGbG9hdDMyQXJyYXkgPSBjYWxjQm91bmRpbmdCb3hlcyh0cmlhbmdsZXNBcnJheSk7XHJcblx0Ly8gY2xvbmUgYSBoZWxwZXIgYXJyYXlcclxuXHRsZXQgYmJveEhlbHBlcjpGbG9hdDMyQXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KGJib3hBcnJheS5sZW5ndGgpO1xyXG5cdGJib3hIZWxwZXIuc2V0KGJib3hBcnJheSk7XHJcblxyXG5cdC8vIGNyZWF0ZSB0aGUgcm9vdCBub2RlLCBhZGQgYWxsIHRoZSB0cmlhbmdsZXMgdG8gaXRcclxuXHR2YXIgdHJpYW5nbGVDb3VudDpudW1iZXIgPSB0cmlhbmdsZXNBcnJheS5sZW5ndGggLyA5O1xyXG5cdHZhciBleHRlbnRzOlhZWltdID0gY2FsY0V4dGVudHMoYmJveEFycmF5LCAwLCB0cmlhbmdsZUNvdW50LCBFUFNJTE9OKTtcclxuXHRsZXQgcm9vdE5vZGU6QlZITm9kZSA9IG5ldyBCVkhOb2RlKGV4dGVudHNbMF0sIGV4dGVudHNbMV0sIDAsIHRyaWFuZ2xlQ291bnQsIDApO1xyXG5cdGxldCBub2Rlc1RvU3BsaXQ6QlZITm9kZVtdID0gW3Jvb3ROb2RlXTtcclxuXHRsZXQgbm9kZTpCVkhOb2RlIHwgdW5kZWZpbmVkO1xyXG5cclxuXHR3aGlsZShub2RlID0gbm9kZXNUb1NwbGl0LnBvcCgpKSB7XHJcblx0XHRsZXQgbm9kZXMgPSBzcGxpdE5vZGUobm9kZSwgbWF4VHJpYW5nbGVzUGVyTm9kZSwgYmJveEFycmF5LCBiYm94SGVscGVyKTtcclxuXHRcdG5vZGVzVG9TcGxpdC5wdXNoKC4uLm5vZGVzKTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIG5ldyBCVkgocm9vdE5vZGUsIGJib3hBcnJheSwgdHJpYW5nbGVzQXJyYXkpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gQlZIQnVpbGRlckFzeW5jKHRyaWFuZ2xlczp1bmtub3duIHwgVmVjdG9yW11bXSB8IG51bWJlcltdIHwgRmxvYXQzMkFycmF5LCBtYXhUcmlhbmdsZXNQZXJOb2RlOm51bWJlciA9IDEwLCBhc3luY1BhcmFtczpBc3luY2lmeVBhcmFtcyA9IHt9LCBwcm9ncmVzc0NhbGxiYWNrPzoob2JqOkJWSFByb2dyZXNzKSA9PiB2b2lkKTpQcm9taXNlPEJWSD4ge1xyXG5cdGlmKHR5cGVvZiBtYXhUcmlhbmdsZXNQZXJOb2RlICE9PSAnbnVtYmVyJykgdGhyb3cgbmV3IEVycm9yKGBtYXhUcmlhbmdsZXNQZXJOb2RlIG11c3QgYmUgb2YgdHlwZSBudW1iZXIsIGdvdDogJHt0eXBlb2YgbWF4VHJpYW5nbGVzUGVyTm9kZX1gKTtcclxuXHRpZihtYXhUcmlhbmdsZXNQZXJOb2RlIDwgMSkgdGhyb3cgbmV3IEVycm9yKGBtYXhUcmlhbmdsZXNQZXJOb2RlIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDEsIGdvdDogJHttYXhUcmlhbmdsZXNQZXJOb2RlfWApO1xyXG5cdGlmKE51bWJlci5pc05hTihtYXhUcmlhbmdsZXNQZXJOb2RlKSkgdGhyb3cgbmV3IEVycm9yKGBtYXhUcmlhbmdsZXNQZXJOb2RlIGlzIE5hTmApO1xyXG5cdGlmKCFOdW1iZXIuaXNJbnRlZ2VyKG1heFRyaWFuZ2xlc1Blck5vZGUpKSBjb25zb2xlLndhcm4oYG1heFRyaWFuZ2xlc1Blck5vZGUgaXMgZXhwZWN0ZWQgdG8gYmUgYW4gaW50ZWdlciwgZ290OiAke21heFRyaWFuZ2xlc1Blck5vZGV9YCk7XHJcblx0bGV0IHRyaWFuZ2xlc0FycmF5OkZsb2F0MzJBcnJheTtcclxuXHQvL1ZlY3RvcltdW10gfCBudW1iZXJbXSB8IEZsb2F0MzJBcnJheVxyXG5cdGlmKEFycmF5LmlzQXJyYXkodHJpYW5nbGVzKSAmJiB0cmlhbmdsZXMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRjb25zb2xlLndhcm4oYHRyaWFuZ2xlcyBhcHBlYXJzIHRvIGJlIGFuIGFycmF5IHdpdGggMCBlbGVtZW50cy5gKTtcclxuXHR9XHJcblx0aWYoaXNGYWNlQXJyYXkodHJpYW5nbGVzKSkge1xyXG5cdFx0dHJpYW5nbGVzQXJyYXkgPSBidWlsZFRyaWFuZ2xlQXJyYXkodHJpYW5nbGVzKTtcclxuXHR9IGVsc2UgaWYgKHRyaWFuZ2xlcyBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSkge1xyXG5cdFx0dHJpYW5nbGVzQXJyYXkgPSB0cmlhbmdsZXM7XHJcblx0fSBlbHNlIGlmIChpc051bWJlckFycmF5KHRyaWFuZ2xlcykpIHtcclxuXHRcdHRyaWFuZ2xlc0FycmF5ID0gbmV3IEZsb2F0MzJBcnJheSh0cmlhbmdsZXMpXHJcblx0fSBlbHNlIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihgdHJpYW5nbGVzIG11c3QgYmUgb2YgdHlwZSBWZWN0b3JbXVtdIHwgbnVtYmVyW10gfCBGbG9hdDMyQXJyYXksIGdvdDogJHt0eXBlb2YgdHJpYW5nbGVzfWApO1xyXG5cdH1cclxuXHRsZXQgYmJveEFycmF5OkZsb2F0MzJBcnJheSA9IGNhbGNCb3VuZGluZ0JveGVzKHRyaWFuZ2xlc0FycmF5KTtcclxuXHQvLyBjbG9uZSBhIGhlbHBlciBhcnJheVxyXG5cdGxldCBiYm94SGVscGVyOkZsb2F0MzJBcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoYmJveEFycmF5Lmxlbmd0aCk7XHJcblx0YmJveEhlbHBlci5zZXQoYmJveEFycmF5KTtcclxuXHJcblx0Ly8gY3JlYXRlIHRoZSByb290IG5vZGUsIGFkZCBhbGwgdGhlIHRyaWFuZ2xlcyB0byBpdFxyXG5cdHZhciB0cmlhbmdsZUNvdW50Om51bWJlciA9IHRyaWFuZ2xlc0FycmF5Lmxlbmd0aCAvIDk7XHJcblx0dmFyIGV4dGVudHM6WFlaW10gPSBjYWxjRXh0ZW50cyhiYm94QXJyYXksIDAsIHRyaWFuZ2xlQ291bnQsIEVQU0lMT04pO1xyXG5cdGxldCByb290Tm9kZTpCVkhOb2RlID0gbmV3IEJWSE5vZGUoZXh0ZW50c1swXSwgZXh0ZW50c1sxXSwgMCwgdHJpYW5nbGVDb3VudCwgMCk7XHJcblx0bGV0IG5vZGVzVG9TcGxpdDpCVkhOb2RlW10gPSBbcm9vdE5vZGVdO1xyXG5cdGxldCBub2RlOkJWSE5vZGUgfCB1bmRlZmluZWQ7XHJcblxyXG5cdGxldCB0YWxseSA9IDA7XHJcblx0YXdhaXQgYXN5bmNXb3JrKCgpID0+IHtcclxuXHRcdG5vZGUgPSBub2Rlc1RvU3BsaXQucG9wKCk7XHJcblx0XHRyZXR1cm4gdGFsbHkgKiA5IC8gdHJpYW5nbGVzQXJyYXkubGVuZ3RoO1xyXG5cdH0sICgpID0+IHtcclxuXHRcdGlmKCFub2RlKSByZXR1cm47XHJcblx0XHRsZXQgbm9kZXMgPSBzcGxpdE5vZGUobm9kZSwgbWF4VHJpYW5nbGVzUGVyTm9kZSwgYmJveEFycmF5LCBiYm94SGVscGVyKTtcclxuXHRcdGlmKCFub2Rlcy5sZW5ndGgpIHRhbGx5ICs9IG5vZGUuZWxlbWVudENvdW50KCk7XHJcblx0XHRub2Rlc1RvU3BsaXQucHVzaCguLi5ub2Rlcyk7XHJcblx0fSwgYXN5bmNQYXJhbXMsIHByb2dyZXNzQ2FsbGJhY2sgP1xyXG5cdFx0KG5vZGVzU3BsaXQ6V29ya1Byb2dyZXNzKSA9PiBwcm9ncmVzc0NhbGxiYWNrKE9iamVjdC5hc3NpZ24oe3RyaWFuZ2xlc0xlYWZlZDogdGFsbHl9LCBub2Rlc1NwbGl0KSlcclxuXHRcdDogdW5kZWZpbmVkXHJcblx0KTtcclxuXHRyZXR1cm4gbmV3IEJWSChyb290Tm9kZSwgYmJveEFycmF5LCB0cmlhbmdsZXNBcnJheSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwbGl0Tm9kZShub2RlOiBCVkhOb2RlLCBtYXhUcmlhbmdsZXM6bnVtYmVyLCBiYm94QXJyYXk6RmxvYXQzMkFycmF5LCBiYm94SGVscGVyOkZsb2F0MzJBcnJheSk6QlZITm9kZVtdIHtcclxuXHRjb25zdCBub2RlQ291bnQ6bnVtYmVyID0gbm9kZS5lbGVtZW50Q291bnQoKVxyXG5cdGlmIChub2RlQ291bnQgPD0gbWF4VHJpYW5nbGVzIHx8IG5vZGVDb3VudCA9PT0gMCkgcmV0dXJuIFtdO1xyXG5cclxuXHRsZXQgc3RhcnRJbmRleDpudW1iZXIgPSBub2RlLnN0YXJ0SW5kZXg7XHJcblx0bGV0IGVuZEluZGV4Om51bWJlciA9IG5vZGUuZW5kSW5kZXg7XHJcblxyXG5cdGxldCBsZWZ0Tm9kZTpudW1iZXJbXVtdID0gWyBbXSxbXSxbXSBdO1xyXG5cdGxldCByaWdodE5vZGU6bnVtYmVyW11bXSA9IFsgW10sW10sW10gXTtcclxuXHRsZXQgZXh0ZW50Q2VudGVyczpudW1iZXJbXSA9IFtub2RlLmNlbnRlclgoKSwgbm9kZS5jZW50ZXJZKCksIG5vZGUuY2VudGVyWigpXTtcclxuXHJcblx0bGV0IG9iamVjdENlbnRlcjpudW1iZXJbXSA9IFtdO1xyXG5cdG9iamVjdENlbnRlci5sZW5ndGggPSAzO1xyXG5cclxuXHRmb3IgKGxldCBpID0gc3RhcnRJbmRleDsgaSA8IGVuZEluZGV4OyBpKyspIHtcclxuXHRcdGxldCBpZHggPSBpICogNyArIDE7XHJcblx0XHRvYmplY3RDZW50ZXJbMF0gPSAoYmJveEFycmF5W2lkeF0gKyBiYm94QXJyYXlbaWR4KysgKyAzXSkgKiAwLjU7IC8vIGNlbnRlciA9IChtaW4gKyBtYXgpIC8gMlxyXG5cdFx0b2JqZWN0Q2VudGVyWzFdID0gKGJib3hBcnJheVtpZHhdICsgYmJveEFycmF5W2lkeCsrICsgM10pICogMC41OyAvLyBjZW50ZXIgPSAobWluICsgbWF4KSAvIDJcclxuXHRcdG9iamVjdENlbnRlclsyXSA9IChiYm94QXJyYXlbaWR4XSArIGJib3hBcnJheVtpZHggKyAzXSkgKiAwLjU7IC8vIGNlbnRlciA9IChtaW4gKyBtYXgpIC8gMlxyXG5cdFx0Zm9yIChsZXQgaiA9IDA7IGogPCAzOyBqKyspIHtcclxuXHRcdFx0aWYgKG9iamVjdENlbnRlcltqXSA8IGV4dGVudENlbnRlcnNbal0pIHtcclxuXHRcdFx0XHRsZWZ0Tm9kZVtqXS5wdXNoKGkpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJpZ2h0Tm9kZVtqXS5wdXNoKGkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBjaGVjayBpZiB3ZSBjb3VsZG4ndCBzcGxpdCB0aGUgbm9kZSBieSBhbnkgb2YgdGhlIGF4ZXMgKHgsIHkgb3IgeikuIGhhbHQgaGVyZSwgZG9udCB0cnkgdG8gc3BsaXQgYW55IG1vcmUgKGNhdXNlIGl0IHdpbGwgYWx3YXlzIGZhaWwsIGFuZCB3ZSdsbCBlbnRlciBhbiBpbmZpbml0ZSBsb29wXHJcblx0dmFyIHNwbGl0RmFpbGVkOmJvb2xlYW5bXSA9IFtdO1xyXG5cdHNwbGl0RmFpbGVkLmxlbmd0aCA9IDM7XHJcblxyXG5cdHNwbGl0RmFpbGVkWzBdID0gKGxlZnROb2RlWzBdLmxlbmd0aCA9PT0gMCkgfHwgKHJpZ2h0Tm9kZVswXS5sZW5ndGggPT09IDApO1xyXG5cdHNwbGl0RmFpbGVkWzFdID0gKGxlZnROb2RlWzFdLmxlbmd0aCA9PT0gMCkgfHwgKHJpZ2h0Tm9kZVsxXS5sZW5ndGggPT09IDApO1xyXG5cdHNwbGl0RmFpbGVkWzJdID0gKGxlZnROb2RlWzJdLmxlbmd0aCA9PT0gMCkgfHwgKHJpZ2h0Tm9kZVsyXS5sZW5ndGggPT09IDApO1xyXG5cclxuXHRpZiAoc3BsaXRGYWlsZWRbMF0gJiYgc3BsaXRGYWlsZWRbMV0gJiYgc3BsaXRGYWlsZWRbMl0pIHJldHVybiBbXTtcclxuXHJcblx0Ly8gY2hvb3NlIHRoZSBsb25nZXN0IHNwbGl0IGF4aXMuIGlmIHdlIGNhbid0IHNwbGl0IGJ5IGl0LCBjaG9vc2UgbmV4dCBiZXN0IG9uZS5cclxuXHR2YXIgc3BsaXRPcmRlciA9IFswLCAxLCAyXTtcclxuXHJcblx0dmFyIGV4dGVudHNMZW5ndGggPSBbXHJcblx0XHRub2RlLmV4dGVudHNNYXhbMF0gLSBub2RlLmV4dGVudHNNaW5bMF0sXHJcblx0XHRub2RlLmV4dGVudHNNYXhbMV0gLSBub2RlLmV4dGVudHNNaW5bMV0sXHJcblx0XHRub2RlLmV4dGVudHNNYXhbMl0gLSBub2RlLmV4dGVudHNNaW5bMl1cclxuXHRdO1xyXG5cclxuXHRzcGxpdE9yZGVyLnNvcnQoKGF4aXMwLCBheGlzMSkgPT4gZXh0ZW50c0xlbmd0aFtheGlzMV0gLSBleHRlbnRzTGVuZ3RoW2F4aXMwXSk7XHJcblxyXG5cdGxldCBsZWZ0RWxlbWVudHM6bnVtYmVyW10gfCB1bmRlZmluZWQgPSBbXTtcclxuXHRsZXQgcmlnaHRFbGVtZW50czpudW1iZXJbXSB8IHVuZGVmaW5lZCA9IFtdO1xyXG5cclxuXHRmb3IgKGxldCBqID0gMDsgaiA8IDM7IGorKykge1xyXG5cdFx0dmFyIGNhbmRpZGF0ZUluZGV4ID0gc3BsaXRPcmRlcltqXTtcclxuXHRcdGlmICghc3BsaXRGYWlsZWRbY2FuZGlkYXRlSW5kZXhdKSB7XHJcblx0XHRcdGxlZnRFbGVtZW50cyA9IGxlZnROb2RlW2NhbmRpZGF0ZUluZGV4XTtcclxuXHRcdFx0cmlnaHRFbGVtZW50cyA9IHJpZ2h0Tm9kZVtjYW5kaWRhdGVJbmRleF07XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdC8vIHNvcnQgdGhlIGVsZW1lbnRzIGluIHJhbmdlIChzdGFydEluZGV4LCBlbmRJbmRleCkgYWNjb3JkaW5nIHRvIHdoaWNoIG5vZGUgdGhleSBzaG91bGQgYmUgYXRcclxuXHR2YXIgbm9kZTBTdGFydCA9IHN0YXJ0SW5kZXg7XHJcblx0dmFyIG5vZGUwRW5kID0gbm9kZTBTdGFydCArIGxlZnRFbGVtZW50cy5sZW5ndGg7XHJcblx0dmFyIG5vZGUxU3RhcnQgPSBub2RlMEVuZDtcclxuXHR2YXIgbm9kZTFFbmQgPSBlbmRJbmRleDtcclxuXHRcclxuXHRjb3B5Qm94ZXMobGVmdEVsZW1lbnRzLCByaWdodEVsZW1lbnRzLCBub2RlLnN0YXJ0SW5kZXgsIGJib3hBcnJheSwgYmJveEhlbHBlcik7XHJcblxyXG5cdC8vIGNvcHkgcmVzdWx0cyBiYWNrIHRvIG1haW4gYXJyYXlcclxuXHR2YXIgc3ViQXJyID0gYmJveEhlbHBlci5zdWJhcnJheShub2RlLnN0YXJ0SW5kZXggKiA3LCBub2RlLmVuZEluZGV4ICogNyk7XHJcblx0YmJveEFycmF5LnNldChzdWJBcnIsIG5vZGUuc3RhcnRJbmRleCAqIDcpO1xyXG5cclxuXHQvLyBjcmVhdGUgMiBuZXcgbm9kZXMgZm9yIHRoZSBub2RlIHdlIGp1c3Qgc3BsaXQsIGFuZCBhZGQgbGlua3MgdG8gdGhlbSBmcm9tIHRoZSBwYXJlbnQgbm9kZVxyXG5cdHZhciBub2RlMEV4dGVudHMgPSBjYWxjRXh0ZW50cyhiYm94QXJyYXksIG5vZGUwU3RhcnQsIG5vZGUwRW5kLCBFUFNJTE9OKTtcclxuXHR2YXIgbm9kZTFFeHRlbnRzID0gY2FsY0V4dGVudHMoYmJveEFycmF5LCBub2RlMVN0YXJ0LCBub2RlMUVuZCwgRVBTSUxPTik7XHJcblxyXG5cdHZhciBub2RlMCA9IG5ldyBCVkhOb2RlKG5vZGUwRXh0ZW50c1swXSwgbm9kZTBFeHRlbnRzWzFdLCBub2RlMFN0YXJ0LCBub2RlMEVuZCwgbm9kZS5sZXZlbCArIDEpO1xyXG5cdHZhciBub2RlMSA9IG5ldyBCVkhOb2RlKG5vZGUxRXh0ZW50c1swXSwgbm9kZTFFeHRlbnRzWzFdLCBub2RlMVN0YXJ0LCBub2RlMUVuZCwgbm9kZS5sZXZlbCArIDEpO1xyXG5cclxuXHRub2RlLm5vZGUwID0gbm9kZTA7XHJcblx0bm9kZS5ub2RlMSA9IG5vZGUxO1xyXG5cdG5vZGUuY2xlYXJTaGFwZXMoKTtcclxuXHJcblx0Ly8gYWRkIG5ldyBub2RlcyB0byB0aGUgc3BsaXQgcXVldWVcclxuXHRyZXR1cm4gW25vZGUwLCBub2RlMV07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvcHlCb3hlcyhsZWZ0RWxlbWVudHM6bnVtYmVyW10sIHJpZ2h0RWxlbWVudHM6bnVtYmVyW10sIHN0YXJ0SW5kZXg6bnVtYmVyLCBiYm94QXJyYXk6RmxvYXQzMkFycmF5LCBiYm94SGVscGVyOkZsb2F0MzJBcnJheSkge1xyXG5cdHZhciBjb25jYXRlbmF0ZWRFbGVtZW50cyA9IGxlZnRFbGVtZW50cy5jb25jYXQocmlnaHRFbGVtZW50cyk7XHJcblx0dmFyIGhlbHBlclBvcyA9IHN0YXJ0SW5kZXg7XHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb25jYXRlbmF0ZWRFbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0bGV0IGN1cnJFbGVtZW50ID0gY29uY2F0ZW5hdGVkRWxlbWVudHNbaV07XHJcblx0XHRjb3B5Qm94KGJib3hBcnJheSwgY3VyckVsZW1lbnQsIGJib3hIZWxwZXIsIGhlbHBlclBvcyk7XHJcblx0XHRoZWxwZXJQb3MrKztcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhbGNFeHRlbnRzKGJib3hBcnJheTpGbG9hdDMyQXJyYXksIHN0YXJ0SW5kZXg6bnVtYmVyLCBlbmRJbmRleDpudW1iZXIsIGV4cGFuZEJ5OiBudW1iZXIgPSAwLjApOlhZWltdIHtcclxuXHRpZiAoc3RhcnRJbmRleCA+PSBlbmRJbmRleCkgcmV0dXJuIFtbMCwgMCwgMF0sIFswLCAwLCAwXV07XHJcblx0bGV0IG1pblggPSBJbmZpbml0eTtcclxuXHRsZXQgbWluWSA9IEluZmluaXR5O1xyXG5cdGxldCBtaW5aID0gSW5maW5pdHk7XHJcblx0bGV0IG1heFggPSAtSW5maW5pdHk7XHJcblx0bGV0IG1heFkgPSAtSW5maW5pdHk7XHJcblx0bGV0IG1heFogPSAtSW5maW5pdHk7XHJcblx0Zm9yIChsZXQgaSA9IHN0YXJ0SW5kZXg7IGkgPCBlbmRJbmRleDsgaSsrKSB7XHJcblx0XHRsZXQgaWR4ID0gaSAqIDcgKyAxO1xyXG5cdFx0bWluWCA9IE1hdGgubWluKGJib3hBcnJheVtpZHgrK10sIG1pblgpO1xyXG5cdFx0bWluWSA9IE1hdGgubWluKGJib3hBcnJheVtpZHgrK10sIG1pblkpO1xyXG5cdFx0bWluWiA9IE1hdGgubWluKGJib3hBcnJheVtpZHgrK10sIG1pblopO1xyXG5cdFx0bWF4WCA9IE1hdGgubWF4KGJib3hBcnJheVtpZHgrK10sIG1heFgpO1xyXG5cdFx0bWF4WSA9IE1hdGgubWF4KGJib3hBcnJheVtpZHgrK10sIG1heFkpO1xyXG5cdFx0bWF4WiA9IE1hdGgubWF4KGJib3hBcnJheVtpZHhdLCBtYXhaKTtcclxuXHR9XHJcblx0cmV0dXJuIFtcclxuXHRcdFttaW5YIC0gZXhwYW5kQnksIG1pblkgLSBleHBhbmRCeSwgbWluWiAtIGV4cGFuZEJ5XSxcclxuXHRcdFttYXhYICsgZXhwYW5kQnksIG1heFkgKyBleHBhbmRCeSwgbWF4WiArIGV4cGFuZEJ5XVxyXG5cdF07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhbGNCb3VuZGluZ0JveGVzKHRyaWFuZ2xlc0FycmF5OiBGbG9hdDMyQXJyYXkpOkZsb2F0MzJBcnJheSB7XHJcblx0Y29uc3QgdHJpYW5nbGVDb3VudDpudW1iZXIgPSB0cmlhbmdsZXNBcnJheS5sZW5ndGggLyA5O1xyXG5cdGNvbnN0IGJib3hBcnJheTpGbG9hdDMyQXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KHRyaWFuZ2xlQ291bnQgKiA3KTtcclxuXHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0cmlhbmdsZUNvdW50OyBpKyspIHtcclxuXHRcdGxldCBpZHggPSBpICogOTtcclxuXHRcdGNvbnN0IHAweCA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcclxuXHRcdGNvbnN0IHAweSA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcclxuXHRcdGNvbnN0IHAweiA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcclxuXHRcdGNvbnN0IHAxeCA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcclxuXHRcdGNvbnN0IHAxeSA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcclxuXHRcdGNvbnN0IHAxeiA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcclxuXHRcdGNvbnN0IHAyeCA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcclxuXHRcdGNvbnN0IHAyeSA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcclxuXHRcdGNvbnN0IHAyeiA9IHRyaWFuZ2xlc0FycmF5W2lkeF07XHJcblxyXG5cdFx0Y29uc3QgbWluWCA9IE1hdGgubWluKHAweCwgcDF4LCBwMngpO1xyXG5cdFx0Y29uc3QgbWluWSA9IE1hdGgubWluKHAweSwgcDF5LCBwMnkpO1xyXG5cdFx0Y29uc3QgbWluWiA9IE1hdGgubWluKHAweiwgcDF6LCBwMnopO1xyXG5cdFx0Y29uc3QgbWF4WCA9IE1hdGgubWF4KHAweCwgcDF4LCBwMngpO1xyXG5cdFx0Y29uc3QgbWF4WSA9IE1hdGgubWF4KHAweSwgcDF5LCBwMnkpO1xyXG5cdFx0Y29uc3QgbWF4WiA9IE1hdGgubWF4KHAweiwgcDF6LCBwMnopO1xyXG5cdFx0c2V0Qm94KGJib3hBcnJheSwgaSwgaSwgbWluWCwgbWluWSwgbWluWiwgbWF4WCwgbWF4WSwgbWF4Wik7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gYmJveEFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZFRyaWFuZ2xlQXJyYXkodHJpYW5nbGVzOlZlY3RvcltdW10pOkZsb2F0MzJBcnJheSB7XHJcblx0Y29uc3QgdHJpYW5nbGVzQXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KHRyaWFuZ2xlcy5sZW5ndGggKiA5KTtcclxuXHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0cmlhbmdsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGNvbnN0IHAwID0gdHJpYW5nbGVzW2ldWzBdO1xyXG5cdFx0Y29uc3QgcDEgPSB0cmlhbmdsZXNbaV1bMV07XHJcblx0XHRjb25zdCBwMiA9IHRyaWFuZ2xlc1tpXVsyXTtcclxuXHRcdGxldCBpZHggPSBpICogOTtcclxuXHRcdHRyaWFuZ2xlc0FycmF5W2lkeCsrXSA9IHAwLng7XHJcblx0XHR0cmlhbmdsZXNBcnJheVtpZHgrK10gPSBwMC55O1xyXG5cdFx0dHJpYW5nbGVzQXJyYXlbaWR4KytdID0gcDAuejtcclxuXHJcblx0XHR0cmlhbmdsZXNBcnJheVtpZHgrK10gPSBwMS54O1xyXG5cdFx0dHJpYW5nbGVzQXJyYXlbaWR4KytdID0gcDEueTtcclxuXHRcdHRyaWFuZ2xlc0FycmF5W2lkeCsrXSA9IHAxLno7XHJcblxyXG5cdFx0dHJpYW5nbGVzQXJyYXlbaWR4KytdID0gcDIueDtcclxuXHRcdHRyaWFuZ2xlc0FycmF5W2lkeCsrXSA9IHAyLnk7XHJcblx0XHR0cmlhbmdsZXNBcnJheVtpZHhdID0gcDIuejtcclxuXHR9XHJcblxyXG5cdHJldHVybiB0cmlhbmdsZXNBcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0Qm94KGJib3hBcnJheTpGbG9hdDMyQXJyYXksIHBvczpudW1iZXIsIHRyaWFuZ2xlSWQ6bnVtYmVyLCBtaW5YOm51bWJlciwgbWluWTpudW1iZXIsIG1pblo6bnVtYmVyLCBtYXhYOm51bWJlciwgbWF4WTpudW1iZXIsIG1heFo6bnVtYmVyKTp2b2lkIHtcclxuXHRsZXQgaWR4ID0gcG9zICogNztcclxuXHRiYm94QXJyYXlbaWR4KytdID0gdHJpYW5nbGVJZDtcclxuXHRiYm94QXJyYXlbaWR4KytdID0gbWluWDtcclxuXHRiYm94QXJyYXlbaWR4KytdID0gbWluWTtcclxuXHRiYm94QXJyYXlbaWR4KytdID0gbWluWjtcclxuXHRiYm94QXJyYXlbaWR4KytdID0gbWF4WDtcclxuXHRiYm94QXJyYXlbaWR4KytdID0gbWF4WTtcclxuXHRiYm94QXJyYXlbaWR4XSA9IG1heFo7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvcHlCb3goc291cmNlQXJyYXk6RmxvYXQzMkFycmF5LCBzb3VyY2VQb3M6bnVtYmVyLCBkZXN0QXJyYXk6RmxvYXQzMkFycmF5LCBkZXN0UG9zOm51bWJlcik6dm9pZCB7XHJcblx0bGV0IGlkeCA9IGRlc3RQb3MgKiA3O1xyXG5cdGxldCBqZHggPSBzb3VyY2VQb3MgKiA3O1xyXG5cdGRlc3RBcnJheVtpZHgrK10gPSBzb3VyY2VBcnJheVtqZHgrK107XHJcblx0ZGVzdEFycmF5W2lkeCsrXSA9IHNvdXJjZUFycmF5W2pkeCsrXTtcclxuXHRkZXN0QXJyYXlbaWR4KytdID0gc291cmNlQXJyYXlbamR4KytdO1xyXG5cdGRlc3RBcnJheVtpZHgrK10gPSBzb3VyY2VBcnJheVtqZHgrK107XHJcblx0ZGVzdEFycmF5W2lkeCsrXSA9IHNvdXJjZUFycmF5W2pkeCsrXTtcclxuXHRkZXN0QXJyYXlbaWR4KytdID0gc291cmNlQXJyYXlbamR4KytdO1xyXG5cdGRlc3RBcnJheVtpZHhdID0gc291cmNlQXJyYXlbamR4XTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNGYWNlQXJyYXkodGVzdEFycmF5OiB1bmtub3duKTogdGVzdEFycmF5IGlzIFZlY3RvcltdW10ge1xyXG5cdGlmKCFBcnJheS5pc0FycmF5KHRlc3RBcnJheSkpIHJldHVybiBmYWxzZTtcclxuXHRmb3IobGV0IGkgPSAwOyBpIDwgdGVzdEFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRjb25zdCBmYWNlID0gdGVzdEFycmF5W2ldO1xyXG5cdFx0aWYoIUFycmF5LmlzQXJyYXkoZmFjZSkpIHJldHVybiBmYWxzZTtcclxuXHRcdGlmKGZhY2UubGVuZ3RoICE9PSAzKSByZXR1cm4gZmFsc2U7XHJcblx0XHRmb3IobGV0IGogPSAwOyBqIDwgMzsgaisrKSB7XHJcblx0XHRcdGNvbnN0IHZlcnRleDpWZWN0b3IgPSA8VmVjdG9yPmZhY2Vbal07XHJcblx0XHRcdGlmKHR5cGVvZiB2ZXJ0ZXgueCAhPT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgdmVydGV4LnkgIT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIHZlcnRleC56ICE9PSBcIm51bWJlclwiKSByZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc051bWJlckFycmF5KHRlc3RBcnJheTogdW5rbm93bik6IHRlc3RBcnJheSBpcyBudW1iZXJbXSB7XHJcblx0aWYoIUFycmF5LmlzQXJyYXkodGVzdEFycmF5KSkgcmV0dXJuIGZhbHNlO1xyXG5cdGZvcihsZXQgaSA9IDA7IGkgPCB0ZXN0QXJyYXkubGVuZ3RoOyBpKyspIHtcclxuXHRcdGlmKHR5cGVvZiB0ZXN0QXJyYXlbaV0gIT09IFwibnVtYmVyXCIpIHJldHVybiBmYWxzZTtcclxuXHR9XHJcblx0cmV0dXJuIHRydWU7XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIEJWSE5vZGUge1xyXG5cdGV4dGVudHNNaW46IFhZWjtcclxuXHRleHRlbnRzTWF4OiBYWVo7XHJcblx0c3RhcnRJbmRleDogbnVtYmVyO1xyXG5cdGVuZEluZGV4OiBudW1iZXI7XHJcblx0bGV2ZWw6IG51bWJlcjtcclxuXHRub2RlMDogQlZITm9kZSB8IG51bGw7XHJcblx0bm9kZTE6IEJWSE5vZGUgfCBudWxsO1xyXG5cdGNvbnN0cnVjdG9yKGV4dGVudHNNaW46IFhZWiwgZXh0ZW50c01heDogWFlaLCBzdGFydEluZGV4OiBudW1iZXIsIGVuZEluZGV4OiBudW1iZXIsIGxldmVsOiBudW1iZXIpIHtcclxuXHRcdHRoaXMuZXh0ZW50c01pbiA9IGV4dGVudHNNaW47XHJcblx0XHR0aGlzLmV4dGVudHNNYXggPSBleHRlbnRzTWF4O1xyXG5cdFx0dGhpcy5zdGFydEluZGV4ID0gc3RhcnRJbmRleDtcclxuXHRcdHRoaXMuZW5kSW5kZXggPSBlbmRJbmRleDtcclxuXHRcdHRoaXMubGV2ZWwgPSBsZXZlbDtcclxuXHRcdHRoaXMubm9kZTAgPSBudWxsO1xyXG5cdFx0dGhpcy5ub2RlMSA9IG51bGw7XHJcblx0fVxyXG5cdHN0YXRpYyBmcm9tT2JqKHtleHRlbnRzTWluLCBleHRlbnRzTWF4LCBzdGFydEluZGV4LCBlbmRJbmRleCwgbGV2ZWwsIG5vZGUwLCBub2RlMX06YW55KSB7XHJcblx0XHRjb25zdCB0ZW1wTm9kZSA9IG5ldyBCVkhOb2RlKGV4dGVudHNNaW4sIGV4dGVudHNNYXgsIHN0YXJ0SW5kZXgsIGVuZEluZGV4LCBsZXZlbCk7XHJcblx0XHRpZihub2RlMCkgdGVtcE5vZGUubm9kZTAgPSBCVkhOb2RlLmZyb21PYmoobm9kZTApO1xyXG5cdFx0aWYobm9kZTEpIHRlbXBOb2RlLm5vZGUxID0gQlZITm9kZS5mcm9tT2JqKG5vZGUxKTtcclxuXHRcdHJldHVybiB0ZW1wTm9kZTtcclxuXHR9XHJcblx0ZWxlbWVudENvdW50KCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZW5kSW5kZXggLSB0aGlzLnN0YXJ0SW5kZXg7XHJcblx0fVxyXG5cclxuXHRjZW50ZXJYKCkge1xyXG5cdFx0cmV0dXJuICh0aGlzLmV4dGVudHNNaW5bMF0gKyB0aGlzLmV4dGVudHNNYXhbMF0pICogMC41O1xyXG5cdH1cclxuXHJcblx0Y2VudGVyWSgpIHtcclxuXHRcdHJldHVybiAodGhpcy5leHRlbnRzTWluWzFdICsgdGhpcy5leHRlbnRzTWF4WzFdKSAqIDAuNTtcclxuXHR9XHJcblxyXG5cdGNlbnRlclooKSB7XHJcblx0XHRyZXR1cm4gKHRoaXMuZXh0ZW50c01pblsyXSArIHRoaXMuZXh0ZW50c01heFsyXSkgKiAwLjU7XHJcblx0fVxyXG5cclxuXHRjbGVhclNoYXBlcygpIHtcclxuXHRcdHRoaXMuc3RhcnRJbmRleCA9IC0xO1xyXG5cdFx0dGhpcy5lbmRJbmRleCA9IC0xO1xyXG5cdH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgQlZIVmVjdG9yMyAge1xyXG5cdHg6IG51bWJlciA9IDA7XHJcblx0eTogbnVtYmVyID0gMDtcclxuXHR6OiBudW1iZXIgPSAwO1xyXG5cdGNvbnN0cnVjdG9yKHg6bnVtYmVyID0gMCwgeTpudW1iZXIgPSAwLCB6Om51bWJlciA9IDApIHtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0dGhpcy56ID0gejtcclxuXHR9XHJcblx0Y29weSh2OkJWSFZlY3RvcjMpIHtcclxuXHRcdHRoaXMueCA9IHYueDtcclxuXHRcdHRoaXMueSA9IHYueTtcclxuXHRcdHRoaXMueiA9IHYuejtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRzZXRGcm9tQXJyYXkoYXJyYXk6RmxvYXQzMkFycmF5LCBmaXJzdEVsZW1lbnRQb3M6bnVtYmVyKSB7XHJcblx0XHR0aGlzLnggPSBhcnJheVtmaXJzdEVsZW1lbnRQb3NdO1xyXG5cdFx0dGhpcy55ID0gYXJyYXlbZmlyc3RFbGVtZW50UG9zKzFdO1xyXG5cdFx0dGhpcy56ID0gYXJyYXlbZmlyc3RFbGVtZW50UG9zKzJdO1xyXG5cdH1cclxuXHRzZXRGcm9tQXJyYXlOb09mZnNldChhcnJheTpudW1iZXJbXSkge1xyXG5cdFx0dGhpcy54ID0gYXJyYXlbMF07XHJcblx0XHR0aGlzLnkgPSBhcnJheVsxXTtcclxuXHRcdHRoaXMueiA9IGFycmF5WzJdO1xyXG5cdH1cclxuXHJcblx0c2V0RnJvbUFyZ3MoYTpudW1iZXIsIGI6bnVtYmVyLCBjOm51bWJlcikge1xyXG5cdFx0dGhpcy54ID0gYTtcclxuXHRcdHRoaXMueSA9IGI7XHJcblx0XHR0aGlzLnogPSBjO1xyXG5cdH1cclxuXHRhZGQodjpCVkhWZWN0b3IzKSB7XHJcblx0XHR0aGlzLnggKz0gdi54O1xyXG5cdFx0dGhpcy55ICs9IHYueTtcclxuXHRcdHRoaXMueiArPSB2Lno7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0bXVsdGlwbHlTY2FsYXIoc2NhbGFyOm51bWJlcikge1xyXG5cdFx0dGhpcy54ICo9IHNjYWxhcjtcclxuXHRcdHRoaXMueSAqPSBzY2FsYXI7XHJcblx0XHR0aGlzLnogKj0gc2NhbGFyO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdHN1YlZlY3RvcnMoYTpCVkhWZWN0b3IzLCBiOkJWSFZlY3RvcjMpIHtcclxuXHRcdHRoaXMueCA9IGEueCAtIGIueDtcclxuXHRcdHRoaXMueSA9IGEueSAtIGIueTtcclxuXHRcdHRoaXMueiA9IGEueiAtIGIuejtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRkb3QodjpCVkhWZWN0b3IzKSB7XHJcblx0XHRyZXR1cm4gdGhpcy54ICogdi54ICsgdGhpcy55ICogdi55ICsgdGhpcy56ICogdi56O1xyXG5cdH1cclxuXHRjcm9zcyh2OkJWSFZlY3RvcjMpIHtcclxuXHRcdGNvbnN0IHggPSB0aGlzLngsIHkgPSB0aGlzLnksIHogPSB0aGlzLno7XHJcblx0XHR0aGlzLnggPSB5ICogdi56IC0geiAqIHYueTtcclxuXHRcdHRoaXMueSA9IHogKiB2LnggLSB4ICogdi56O1xyXG5cdFx0dGhpcy56ID0geCAqIHYueSAtIHkgKiB2Lng7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0Y3Jvc3NWZWN0b3JzKGE6QlZIVmVjdG9yMywgYjpCVkhWZWN0b3IzKSB7XHJcblx0XHRjb25zdCBheCA9IGEueCwgYXkgPSBhLnksIGF6ID0gYS56O1xyXG5cdFx0Y29uc3QgYnggPSBiLngsIGJ5ID0gYi55LCBieiA9IGIuejtcclxuXHRcdHRoaXMueCA9IGF5ICogYnogLSBheiAqIGJ5O1xyXG5cdFx0dGhpcy55ID0gYXogKiBieCAtIGF4ICogYno7XHJcblx0XHR0aGlzLnogPSBheCAqIGJ5IC0gYXkgKiBieDtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRjbG9uZSgpIHtcclxuXHRcdHJldHVybiBuZXcgQlZIVmVjdG9yMyh0aGlzLngsIHRoaXMueSwgdGhpcy56KTtcclxuXHR9XHJcblx0c3RhdGljIGZyb21BbnkocG90ZW50aWFsVmVjdG9yOmFueSk6QlZIVmVjdG9yMyB7XHJcblx0XHRpZihwb3RlbnRpYWxWZWN0b3IgaW5zdGFuY2VvZiBCVkhWZWN0b3IzKSB7XHJcblx0XHRcdHJldHVybiBwb3RlbnRpYWxWZWN0b3I7XHJcblx0XHR9IGVsc2UgaWYgKHBvdGVudGlhbFZlY3Rvci54ICE9PSB1bmRlZmluZWQgJiYgcG90ZW50aWFsVmVjdG9yLnggIT09IG51bGwpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBCVkhWZWN0b3IzKHBvdGVudGlhbFZlY3Rvci54LCBwb3RlbnRpYWxWZWN0b3IueSwgcG90ZW50aWFsVmVjdG9yLnopO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcIkNvdWxkbid0IGNvbnZlcnQgdG8gQlZIVmVjdG9yMy5cIik7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImV4cG9ydCAqIGZyb20gJy4vQlZIJztcclxuZXhwb3J0ICogZnJvbSAnLi9CVkhCdWlsZGVyJztcclxuZXhwb3J0ICogZnJvbSAnLi9CVkhOb2RlJztcclxuZXhwb3J0ICogZnJvbSAnLi9CVkhWZWN0b3IzJztcclxuIiwiaW1wb3J0IHsgQlZITm9kZSB9IGZyb20gJy4vQlZITm9kZSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY291bnROb2Rlcyhub2RlOkJWSE5vZGUsIGNvdW50Om51bWJlciA9IDApOm51bWJlciB7XHJcblx0Y291bnQgKz0gMTtcclxuXHRpZihub2RlLm5vZGUwKSB7XHJcblx0XHRjb3VudCArPSBjb3VudE5vZGVzKG5vZGUubm9kZTApO1xyXG5cdH1cclxuXHRpZihub2RlLm5vZGUxKSB7XHJcblx0XHRjb3VudCArPSBjb3VudE5vZGVzKG5vZGUubm9kZTEpO1xyXG5cdH1cclxuXHRpZigobm9kZSBhcyBhbnkpLl9ub2RlMCkge1xyXG5cdFx0Y291bnQgKz0gY291bnROb2Rlcygobm9kZSBhcyBhbnkpLl9ub2RlMCk7XHJcblx0fVxyXG5cdGlmKChub2RlIGFzIGFueSkuX25vZGUxKSB7XHJcblx0XHRjb3VudCArPSBjb3VudE5vZGVzKChub2RlIGFzIGFueSkuX25vZGUxKTtcclxuXHR9XHJcblx0cmV0dXJuIGNvdW50O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYXN5bmNXb3JrKHdvcmtDaGVjazpFdmFsdWF0b3IsIHdvcms6V29yaywgb3B0aW9uczpBc3luY2lmeVBhcmFtcywgcHJvZ3Jlc3NDYWxsYmFjaz86V29ya1Byb2dyZXNzQ2FsbGJhY2spOlByb21pc2U8dm9pZD4ge1xyXG5cdGlmKG9wdGlvbnMubXMgIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLnN0ZXBzICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdGNvbnNvbGUud2FybihcIkFzeW5jaWZ5IGdvdCBib3RoIHN0ZXBzIGFuZCBtcywgZGVmYXVsdGluZyB0byBzdGVwcy5cIik7XHJcblx0fVxyXG5cdGNvbnN0IHdvcmtlcjpHZW5lcmF0b3IgPSAob3B0aW9ucy5zdGVwcyAhPT0gdW5kZWZpbmVkID8gcGVyY2VudGFnZUFzeW5jaWZ5IDogdGltZUFzeW5jaWZ5KSh3b3JrQ2hlY2ssIHdvcmssIG9wdGlvbnMpO1xyXG5cdGxldCBkb25lOiBib29sZWFuO1xyXG5cdGxldCBub2Rlc1NwbGl0OiBudW1iZXI7XHJcblx0d2hpbGUoISh7dmFsdWU6IG5vZGVzU3BsaXQsIGRvbmV9ID0gd29ya2VyLm5leHQoKSwgZG9uZSkpIHtcclxuXHRcdGlmKHR5cGVvZiBwcm9ncmVzc0NhbGxiYWNrICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRwcm9ncmVzc0NhbGxiYWNrKHtub2Rlc1NwbGl0fSk7XHJcblx0XHR9XHJcblx0XHRhd2FpdCB0aWNraWZ5KCk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiogdGltZUFzeW5jaWZ5KHdvcmtDaGVjazpFdmFsdWF0b3IsIHdvcms6V29yaywge21zPTEwMDAgLyAzMH06QXN5bmNpZnlQYXJhbXMpIHtcclxuXHRsZXQgc1RpbWU6bnVtYmVyID0gRGF0ZS5ub3coKTtcclxuXHRsZXQgbjpudW1iZXIgPSAwO1xyXG5cdGxldCB0aHJlczpudW1iZXIgPSAwO1xyXG5cdGxldCBjb3VudDpudW1iZXIgPSAwO1xyXG5cdHdoaWxlKHdvcmtDaGVjaygpIDwgMSkge1xyXG5cdFx0d29yaygpO1xyXG5cdFx0Y291bnQrKztcclxuXHRcdGlmKCsrbiA+PSB0aHJlcykge1xyXG5cdFx0XHRjb25zdCBjVGltZSA9IERhdGUubm93KCk7XHJcblx0XHRcdGNvbnN0IHREaWZmID0gY1RpbWUgLSBzVGltZTtcclxuXHRcdFx0aWYodERpZmYgPiBtcykge1xyXG5cdFx0XHRcdHlpZWxkIGNvdW50O1xyXG5cdFx0XHRcdHRocmVzID0gbiAqIChtcyAvIHREaWZmKTtcclxuXHRcdFx0XHRzVGltZSA9IGNUaW1lO1xyXG5cdFx0XHRcdG4gPSAwO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiogcGVyY2VudGFnZUFzeW5jaWZ5KHdvcmtDaGVjazpFdmFsdWF0b3IsIHdvcms6V29yaywge3N0ZXBzPTEwfTpBc3luY2lmeVBhcmFtcykge1xyXG5cdGlmKHN0ZXBzIDw9IDApIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkFzeW5jaWZ5IHN0ZXBzIHdhcyBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gemVyb1wiKTtcclxuXHR9XHJcblx0bGV0IGNvdW50Om51bWJlciA9IDA7XHJcblx0bGV0IHRvdGFsTnVtYmVyOiBudW1iZXIgPSAwO1xyXG5cdGxldCBsYXN0SW5jOm51bWJlciA9IDA7XHJcblx0bGV0IHdvcmtQZXJjZW50YWdlOm51bWJlcjtcclxuXHRsZXQgcGVyY2VudGFnZTpudW1iZXIgPSAxIC8gc3RlcHM7XHJcblx0d2hpbGUoKHdvcmtQZXJjZW50YWdlID0gd29ya0NoZWNrKCksIHdvcmtQZXJjZW50YWdlIDwgMSkpIHtcclxuXHRcdHdvcmsoKTtcclxuXHRcdGNvdW50Kys7XHJcblx0XHRpZih3b3JrUGVyY2VudGFnZSA+IGxhc3RJbmMpIHtcclxuXHRcdFx0dG90YWxOdW1iZXIgKz0gMTtcclxuXHRcdFx0eWllbGQgY291bnQ7XHJcblx0XHRcdGxhc3RJbmMgPSB3b3JrUGVyY2VudGFnZSArIHBlcmNlbnRhZ2U7XHJcblx0XHR9XHJcblx0fVxyXG5cdGNvbnNvbGUubG9nKFwiVG90YWxcIiwgdG90YWxOdW1iZXIpO1xyXG59XHJcblxyXG5cclxuXHJcbmNvbnN0IHRpY2tpZnkgPSAoKTpQcm9taXNlPHZvaWQ+ID0+IG5ldyBQcm9taXNlKChyZXM6V29yaykgPT4gc2V0VGltZW91dChyZXMpKTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==