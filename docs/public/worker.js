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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZG9jcy93b3JrZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0JWSC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQlZIQnVpbGRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQlZITm9kZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQlZIVmVjdG9yMy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBLGlFQUFvRTtBQUVwRSxJQUFJLEdBQU8sQ0FBQztBQUVaLFNBQVMsR0FBRyxVQUFlLEVBQUMsSUFBSSxFQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxFQUFDOztRQUNoRCxJQUFHLE9B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RSxXQUFtQixHQUFHO0lBQ3RHLElBQUksVUFBVSxJQUFJLFFBQVE7UUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFELElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQztJQUNwQixJQUFJLElBQUksR0FBRyxRQUFRLENBQUM7SUFDcEIsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBQ3BCLElBQUksSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDO0lBQ3JCLElBQUksSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDO0lBQ3JCLElBQUksSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDO0lBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDM0MsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEIsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3RDO0lBQ0QsT0FBTztRQUNOLENBQUMsSUFBSSxHQUFHLFFBQVEsRUFBRSxJQUFJLEdBQUcsUUFBUSxFQUFFLElBQUksR0FBRyxRQUFRLENBQUM7UUFDbkQsQ0FBQyxJQUFJLEdBQUcsUUFBUSxFQUFFLElBQUksR0FBRyxRQUFRLEVBQUUsSUFBSSxHQUFHLFFBQVEsQ0FBQztLQUNuRCxDQUFDO0FBQ0gsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQUMsY0FBNEI7SUFDdEQsTUFBTSxhQUFhLEdBQVUsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDdkQsTUFBTSxTQUFTLEdBQWdCLElBQUksWUFBWSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUVuRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3ZDLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWhDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzVEO0lBRUQsT0FBTyxTQUFTLENBQUM7QUFDbEIsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQUMsU0FBb0I7SUFDL0MsTUFBTSxjQUFjLEdBQUcsSUFBSSxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUU5RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMxQyxNQUFNLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsTUFBTSxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0IsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QixjQUFjLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTdCLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0IsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QixjQUFjLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTdCLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0IsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QixjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUMzQjtJQUVELE9BQU8sY0FBYyxDQUFDO0FBQ3ZCLENBQUM7QUFFRCxTQUFTLE1BQU0sQ0FBQyxTQUFzQixFQUFFLEdBQVUsRUFBRSxVQUFpQixFQUFFLElBQVcsRUFBRSxJQUFXLEVBQUUsSUFBVyxFQUFFLElBQVcsRUFBRSxJQUFXLEVBQUUsSUFBVztJQUNsSixJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUM5QixTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDeEIsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUN4QixTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDeEIsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDdkIsQ0FBQztBQUVELFNBQVMsT0FBTyxDQUFDLFdBQXdCLEVBQUUsU0FBZ0IsRUFBRSxTQUFzQixFQUFFLE9BQWM7SUFDbEcsSUFBSSxHQUFHLEdBQUcsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUN0QixJQUFJLEdBQUcsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkMsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFDLFNBQWtCO0lBQ3RDLElBQUcsQ0FBQyxLQUFLLENB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V0FBVyxHQUFXLENBQUMsQ0FBQztJQUM1QixJQUFJLE9BQU8sR0FBVSxDQUFDLENBQUM7SUFDdkIsSUFBSSxjQUFxQixDQUFDO0lBQzFCLElBQUksVUFBVSxHQUFVLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDbEMsT0FBTSxDQUFDLGNBQWMsR0FBRyxTQUFTLEVBQUUsRUFBRSxjQUFjLEdBQUcsQ0FBQyxDQUFDLEVBQUU7UUFDekQsSUFBSSxFQUFFLENBQUM7UUFDUCxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUcsY0FBYyxHQUFHLE9BQU8sRUFBRTtZQUM1QixXQUFXLElBQUksQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sS0FBSyxDQUFDO1lBQ1osT0FBTyxHQUFHLGNBQWMsR0FBRyxVQUFVLENBQUM7U0FDdEM7S0FDRDtJQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFJRCxNQUFNLE9BQU8sR0FBRyxHQUFpQixFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFRLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6Ii4vd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9kb2NzL3dvcmtlci50c1wiKTtcbiIsImltcG9ydCB7IEJWSEJ1aWxkZXIsIEJWSEJ1aWxkZXJBc3luYywgQlZILCBCVkhWZWN0b3IzIH0gZnJvbSAnQHNyYyc7XG5cbmxldCBidmg6QlZIO1xuXG5vbm1lc3NhZ2UgPSBhc3luYyBmdW5jdGlvbih7ZGF0YTp7bWVzc2FnZSwgZGF0YX19KSB7XG5cdGlmKG1lc3NhZ2UgPT09IFwiYnZoX2luZm9cIikge1xuXHRcdGJ1aWxkQlZIKGRhdGEuZmFjZXNBcnJheSk7XG5cdH0gZWxzZSBpZiAobWVzc2FnZSA9PT0gXCJyYXlfY2FzdFwiKSB7XG5cdFx0cmF5Q2FzdChkYXRhLm9yaWdpbiwgZGF0YS5kaXJlY3Rpb24pO1xuXHR9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkQlZIKGFycmF5OmFueSApIHtcblx0YnZoID0gYXdhaXQgQlZIQnVpbGRlckFzeW5jKGFycmF5LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZnVuY3Rpb24odmFsdWUpIHtcblx0XHQoc2VsZiBhcyBhbnkpLnBvc3RNZXNzYWdlKHtcblx0XHRcdG1lc3NhZ2U6IFwicHJvZ3Jlc3NcIixcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0dmFsdWVcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cdChzZWxmIGFzIGFueSkucG9zdE1lc3NhZ2Uoe1xuXHRcdG1lc3NhZ2U6IFwiZG9uZVwiXG5cdH0pO1xufVxuXG5mdW5jdGlvbiByYXlDYXN0KG9yaWdpbjphbnksIGRpcmVjdGlvbjphbnkpIHtcblx0bGV0IHJlc3VsdCA9IGJ2aC5pbnRlcnNlY3RSYXkob3JpZ2luLCBkaXJlY3Rpb24sIGZhbHNlKTtcblx0KHNlbGYgYXMgYW55KS5wb3N0TWVzc2FnZSgge1xuXHRcdG1lc3NhZ2U6IFwicmF5X3RyYWNlZFwiLFxuXHRcdGRhdGE6IHJlc3VsdFxuXHR9KTtcbn0iLCJpbXBvcnQgeyBCVkhWZWN0b3IzIH0gZnJvbSAnLi9CVkhWZWN0b3IzJztcbmltcG9ydCB7IEJWSE5vZGUgfSBmcm9tICcuL0JWSE5vZGUnO1xuXG5leHBvcnQgY2xhc3MgQlZIIHtcblx0cm9vdE5vZGU6IEJWSE5vZGU7XG5cdGJib3hBcnJheTogRmxvYXQzMkFycmF5O1xuXHR0cmlhbmdsZXNBcnJheTogRmxvYXQzMkFycmF5O1xuXHRjb25zdHJ1Y3Rvcihyb290Tm9kZTpCVkhOb2RlLCBib3VuZGluZ0JveEFycmF5OkZsb2F0MzJBcnJheSwgdHJpYW5nbGVBcnJheTpGbG9hdDMyQXJyYXkpIHtcblx0XHR0aGlzLnJvb3ROb2RlID0gcm9vdE5vZGU7XG5cdFx0dGhpcy5iYm94QXJyYXkgPSBib3VuZGluZ0JveEFycmF5O1xuXHRcdHRoaXMudHJpYW5nbGVzQXJyYXkgPSB0cmlhbmdsZUFycmF5O1xuXHR9XG5cdGludGVyc2VjdFJheShyYXlPcmlnaW46YW55LCByYXlEaXJlY3Rpb246YW55LCBiYWNrZmFjZUN1bGxpbmc6Ym9vbGVhbiA9IHRydWUpOmFueVtdIHtcblx0XHR0cnkge1xuXHRcdFx0cmF5T3JpZ2luID0gQlZIVmVjdG9yMy5mcm9tQW55KHJheU9yaWdpbik7XG5cdFx0XHRyYXlEaXJlY3Rpb24gPSBCVkhWZWN0b3IzLmZyb21BbnkocmF5RGlyZWN0aW9uKTtcblx0XHR9IGNhdGNoKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiT3JpZ2luIG9yIERpcmVjdGlvbiBjb3VsZG4ndCBiZSBjb252ZXJ0ZWQgdG8gYSBCVkhWZWN0b3IzLlwiKTtcblx0XHR9XG5cdFx0Y29uc3Qgbm9kZXNUb0ludGVyc2VjdDpCVkhOb2RlW10gPSBbdGhpcy5yb290Tm9kZV07XG5cdFx0Y29uc3QgdHJpYW5nbGVzSW5JbnRlcnNlY3RpbmdOb2RlczpudW1iZXJbXSA9IFtdOyAvLyBhIGxpc3Qgb2Ygbm9kZXMgdGhhdCBpbnRlcnNlY3QgdGhlIHJheSAoYWNjb3JkaW5nIHRvIHRoZWlyIGJvdW5kaW5nIGJveClcblx0XHRjb25zdCBpbnRlcnNlY3RpbmdUcmlhbmdsZXM6b2JqZWN0W10gPSBbXTtcblxuXHRcdGNvbnN0IGludlJheURpcmVjdGlvbiA9IG5ldyBCVkhWZWN0b3IzKFxuXHRcdFx0MS4wIC8gcmF5RGlyZWN0aW9uLngsXG5cdFx0XHQxLjAgLyByYXlEaXJlY3Rpb24ueSxcblx0XHRcdDEuMCAvIHJheURpcmVjdGlvbi56XG5cdFx0KTtcblxuXHRcdC8vIGdvIG92ZXIgdGhlIEJWSCB0cmVlLCBhbmQgZXh0cmFjdCB0aGUgbGlzdCBvZiB0cmlhbmdsZXMgdGhhdCBsaWUgaW4gbm9kZXMgdGhhdCBpbnRlcnNlY3QgdGhlIHJheS5cblx0XHQvLyBub3RlOiB0aGVzZSB0cmlhbmdsZXMgbWF5IG5vdCBpbnRlcnNlY3QgdGhlIHJheSB0aGVtc2VsdmVzXG5cdFx0d2hpbGUobm9kZXNUb0ludGVyc2VjdC5sZW5ndGggPiAwKSB7XG5cdFx0XHRjb25zdCBub2RlOkJWSE5vZGUgfCB1bmRlZmluZWQgPSBub2Rlc1RvSW50ZXJzZWN0LnBvcCgpO1xuXHRcdFx0aWYoIW5vZGUpIGNvbnRpbnVlO1xuXHRcdFx0aWYoQlZILmludGVyc2VjdE5vZGVCb3gocmF5T3JpZ2luLCBpbnZSYXlEaXJlY3Rpb24sIG5vZGUpKSB7XG5cdFx0XHRcdGlmKG5vZGUubm9kZTApIHtcblx0XHRcdFx0XHRub2Rlc1RvSW50ZXJzZWN0LnB1c2gobm9kZS5ub2RlMCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobm9kZS5ub2RlMSkge1xuXHRcdFx0XHRcdG5vZGVzVG9JbnRlcnNlY3QucHVzaChub2RlLm5vZGUxKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IobGV0IGkgPSBub2RlLnN0YXJ0SW5kZXg7IGkgPCBub2RlLmVuZEluZGV4OyBpKyspIHtcblx0XHRcdFx0XHR0cmlhbmdsZXNJbkludGVyc2VjdGluZ05vZGVzLnB1c2godGhpcy5iYm94QXJyYXlbaSo3XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBnbyBvdmVyIHRoZSBsaXN0IG9mIGNhbmRpZGF0ZSB0cmlhbmdsZXMsIGFuZCBjaGVjayBlYWNoIG9mIHRoZW0gdXNpbmcgcmF5IHRyaWFuZ2xlIGludGVyc2VjdGlvblxuXHRcdGxldCBhOkJWSFZlY3RvcjMgPSBuZXcgQlZIVmVjdG9yMygpO1xuXHRcdGxldCBiOkJWSFZlY3RvcjMgPSBuZXcgQlZIVmVjdG9yMygpO1xuXHRcdGxldCBjOkJWSFZlY3RvcjMgPSBuZXcgQlZIVmVjdG9yMygpO1xuXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IHRyaWFuZ2xlc0luSW50ZXJzZWN0aW5nTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IHRyaUluZGV4ID0gdHJpYW5nbGVzSW5JbnRlcnNlY3RpbmdOb2Rlc1tpXTtcblxuXHRcdFx0YS5zZXRGcm9tQXJyYXkodGhpcy50cmlhbmdsZXNBcnJheSwgdHJpSW5kZXgqOSk7XG5cdFx0XHRiLnNldEZyb21BcnJheSh0aGlzLnRyaWFuZ2xlc0FycmF5LCB0cmlJbmRleCo5KzMpO1xuXHRcdFx0Yy5zZXRGcm9tQXJyYXkodGhpcy50cmlhbmdsZXNBcnJheSwgdHJpSW5kZXgqOSs2KTtcblxuXHRcdFx0Y29uc3QgaW50ZXJzZWN0aW9uUG9pbnQgPSBCVkguaW50ZXJzZWN0UmF5VHJpYW5nbGUoYSwgYiwgYywgcmF5T3JpZ2luLCByYXlEaXJlY3Rpb24sIGJhY2tmYWNlQ3VsbGluZyk7XG5cblx0XHRcdGlmKCFpbnRlcnNlY3Rpb25Qb2ludCkgY29udGludWU7XG5cdFx0XHRpbnRlcnNlY3RpbmdUcmlhbmdsZXMucHVzaCh7XG5cdFx0XHRcdC8vdHJpYW5nbGU6IFthLmNsb25lKCksIGIuY2xvbmUoKSwgYy5jbG9uZSgpXSxcblx0XHRcdFx0dHJpYW5nbGVJbmRleDogdHJpSW5kZXgsXG5cdFx0XHRcdGludGVyc2VjdGlvblBvaW50OiBpbnRlcnNlY3Rpb25Qb2ludFxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGludGVyc2VjdGluZ1RyaWFuZ2xlcztcblx0fVxuXHRzdGF0aWMgY2FsY1RWYWx1ZXMobWluVmFsOm51bWJlciwgbWF4VmFsOm51bWJlciwgcmF5T3JpZ2luQ29vcmQ6bnVtYmVyLCBpbnZkaXI6IG51bWJlcik6bnVtYmVyW10ge1xuXHRcdGlmKGludmRpciA+PSAwKSB7XG5cdFx0XHRyZXR1cm4gWyhtaW5WYWwgLSByYXlPcmlnaW5Db29yZCkgKiBpbnZkaXIsIChtYXhWYWwgLSByYXlPcmlnaW5Db29yZCkgKiBpbnZkaXJdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gWyhtYXhWYWwgLSByYXlPcmlnaW5Db29yZCkgKiBpbnZkaXIsIChtaW5WYWwgLSByYXlPcmlnaW5Db29yZCkgKiBpbnZkaXJdO1xuXHRcdH1cblx0fVxuXG5cdHN0YXRpYyBpbnRlcnNlY3ROb2RlQm94KHJheU9yaWdpbjogQlZIVmVjdG9yMywgaW52UmF5RGlyZWN0aW9uOiBCVkhWZWN0b3IzLCBub2RlOiBCVkhOb2RlKTpib29sZWFuIHtcblx0XHRsZXQgW3RtaW4sIHRtYXhdOm51bWJlcltdID0gQlZILmNhbGNUVmFsdWVzKG5vZGUuZXh0ZW50c01pblswXSwgbm9kZS5leHRlbnRzTWF4WzBdLCByYXlPcmlnaW4ueCwgaW52UmF5RGlyZWN0aW9uLngpO1xuXHRcdGxldCBbdHltaW4sIHR5bWF4XTpudW1iZXJbXSA9IEJWSC5jYWxjVFZhbHVlcyhub2RlLmV4dGVudHNNaW5bMV0sIG5vZGUuZXh0ZW50c01heFsxXSwgcmF5T3JpZ2luLnksIGludlJheURpcmVjdGlvbi55KTtcblxuXHRcdGlmKHRtaW4gPiB0eW1heCB8fCB0eW1pbiA+IHRtYXgpIHJldHVybiBmYWxzZTtcblxuXHRcdC8vIFRoZXNlIGxpbmVzIGFsc28gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHRtaW4gb3IgdG1heCBpcyBOYU5cblx0XHQvLyAocmVzdWx0IG9mIDAgKiBJbmZpbml0eSkuIHggIT09IHggcmV0dXJucyB0cnVlIGlmIHggaXMgTmFOXG5cdFx0aWYodHltaW4gPiB0bWluIHx8IHRtaW4gIT09IHRtaW4pIHtcblx0XHRcdHRtaW4gPSB0eW1pbjtcblx0XHR9XG5cblx0XHRpZih0eW1heCA8IHRtYXggfHwgdG1heCAhPT0gdG1heCkge1xuXHRcdFx0dG1heCA9IHR5bWF4O1xuXHRcdH1cblxuXHRcdGxldCBbdHptaW4sIHR6bWF4XTpudW1iZXJbXSA9IEJWSC5jYWxjVFZhbHVlcyhub2RlLmV4dGVudHNNaW5bMl0sIG5vZGUuZXh0ZW50c01heFsyXSwgcmF5T3JpZ2luLnosIGludlJheURpcmVjdGlvbi56KTtcblxuXHRcdGlmKHRtaW4gPiB0em1heCB8fCB0em1pbiA+IHRtYXgpIHJldHVybiBmYWxzZTtcblxuXHRcdGlmKHR6bWF4IDwgdG1heCB8fCB0bWF4ICE9PSB0bWF4KSB7XG5cdFx0XHR0bWF4ID0gdHptYXg7XG5cdFx0fVxuXG5cdFx0Ly9yZXR1cm4gcG9pbnQgY2xvc2VzdCB0byB0aGUgcmF5IChwb3NpdGl2ZSBzaWRlKVxuXHRcdGlmKHRtYXggPCAwKSByZXR1cm4gZmFsc2U7XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHN0YXRpYyBpbnRlcnNlY3RSYXlUcmlhbmdsZShhOkJWSFZlY3RvcjMsIGI6QlZIVmVjdG9yMywgYzpCVkhWZWN0b3IzLCByYXlPcmlnaW46QlZIVmVjdG9yMywgcmF5RGlyZWN0aW9uOkJWSFZlY3RvcjMsIGJhY2tmYWNlQ3VsbGluZzpib29sZWFuKTpCVkhWZWN0b3IzIHwgbnVsbCB7XG5cdFx0dmFyIGRpZmY6QlZIVmVjdG9yMyA9IG5ldyBCVkhWZWN0b3IzKCk7XG5cdFx0dmFyIGVkZ2UxOkJWSFZlY3RvcjMgPSBuZXcgQlZIVmVjdG9yMygpO1xuXHRcdHZhciBlZGdlMjpCVkhWZWN0b3IzID0gbmV3IEJWSFZlY3RvcjMoKTtcblx0XHR2YXIgbm9ybWFsOkJWSFZlY3RvcjMgPSBuZXcgQlZIVmVjdG9yMygpO1xuXG5cdFx0Ly8gZnJvbSBodHRwOi8vd3d3Lmdlb21ldHJpY3Rvb2xzLmNvbS9MaWJNYXRoZW1hdGljcy9JbnRlcnNlY3Rpb24vV201SW50clJheTNUcmlhbmdsZTMuY3BwXG5cdFx0ZWRnZTEuc3ViVmVjdG9ycyhiLCBhKTtcblx0XHRlZGdlMi5zdWJWZWN0b3JzKGMsIGEpO1xuXHRcdG5vcm1hbC5jcm9zc1ZlY3RvcnMoZWRnZTEsIGVkZ2UyKTtcblxuXHRcdC8vIFNvbHZlIFEgKyB0KkQgPSBiMSpFMSArIGJMKkUyIChRID0ga0RpZmYsIEQgPSByYXkgZGlyZWN0aW9uLFxuXHRcdC8vIEUxID0ga0VkZ2UxLCBFMiA9IGtFZGdlMiwgTiA9IENyb3NzKEUxLEUyKSkgYnlcblx0XHQvLyAgIHxEb3QoRCxOKXwqYjEgPSBzaWduKERvdChELE4pKSpEb3QoRCxDcm9zcyhRLEUyKSlcblx0XHQvLyAgIHxEb3QoRCxOKXwqYjIgPSBzaWduKERvdChELE4pKSpEb3QoRCxDcm9zcyhFMSxRKSlcblx0XHQvLyAgIHxEb3QoRCxOKXwqdCA9IC1zaWduKERvdChELE4pKSpEb3QoUSxOKVxuXHRcdGxldCBEZE46bnVtYmVyID0gcmF5RGlyZWN0aW9uLmRvdChub3JtYWwpO1xuXHRcdGlmKERkTiA9PT0gMCkgcmV0dXJuIG51bGw7XG5cdFx0aWYoRGROID4gMCAmJiBiYWNrZmFjZUN1bGxpbmcpIHJldHVybiBudWxsO1xuXHRcdGxldCBzaWduOm51bWJlciA9IE1hdGguc2lnbihEZE4pO1xuXHRcdERkTiAqPSBzaWduO1xuXG5cdFx0ZGlmZi5zdWJWZWN0b3JzKHJheU9yaWdpbiwgYSk7XG5cdFx0dmFyIERkUXhFMiA9IHNpZ24gKiByYXlEaXJlY3Rpb24uZG90KGVkZ2UyLmNyb3NzVmVjdG9ycyhkaWZmLCBlZGdlMikpO1xuXG5cdFx0Ly8gYjEgPCAwLCBubyBpbnRlcnNlY3Rpb25cblx0XHRpZihEZFF4RTIgPCAwKSByZXR1cm4gbnVsbDtcblxuXHRcdHZhciBEZEUxeFEgPSBzaWduICogcmF5RGlyZWN0aW9uLmRvdChlZGdlMS5jcm9zcyhkaWZmKSk7XG5cblx0XHQvLyBiMiA8IDAsIG5vIGludGVyc2VjdGlvblxuXHRcdGlmKERkRTF4USA8IDApIHJldHVybiBudWxsO1xuXG5cdFx0Ly8gYjErYjIgPiAxLCBubyBpbnRlcnNlY3Rpb25cblx0XHRpZihEZFF4RTIgKyBEZEUxeFEgPiBEZE4pIHJldHVybiBudWxsO1xuXG5cdFx0Ly8gTGluZSBpbnRlcnNlY3RzIHRyaWFuZ2xlLCBjaGVjayBpZiByYXkgZG9lcy5cblx0XHRjb25zdCBRZE46bnVtYmVyID0gLXNpZ24gKiBkaWZmLmRvdChub3JtYWwpO1xuXG5cdFx0Ly8gdCA8IDAsIG5vIGludGVyc2VjdGlvblxuXHRcdGlmKFFkTiA8IDApIHJldHVybiBudWxsO1xuXG5cdFx0Ly8gUmF5IGludGVyc2VjdHMgdHJpYW5nbGUuXG5cdFx0cmV0dXJuIHJheURpcmVjdGlvbi5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKFFkTiAvIERkTikuYWRkKHJheU9yaWdpbik7XG5cdH1cbn1cbiIsImRlY2xhcmUgZ2xvYmFsIHtcblx0aW50ZXJmYWNlIFhZWiB7XG5cdFx0MDogbnVtYmVyLFxuXHRcdDE6IG51bWJlcixcblx0XHQyOiBudW1iZXJcblx0fVxuXHRcblx0aW50ZXJmYWNlIFZlY3RvciB7XG5cdFx0eDogbnVtYmVyO1xuXHRcdHk6IG51bWJlcjtcblx0XHR6OiBudW1iZXI7XG5cdH1cblxuXHR0eXBlIEV2YWx1YXRvciA9ICgpID0+IG51bWJlcjtcblx0dHlwZSBXb3JrID0gKCkgPT4gdm9pZDtcblx0dHlwZSBXb3JrUHJvZ3Jlc3MgPSB7bm9kZXNTcGxpdDogbnVtYmVyfTtcblx0dHlwZSBXb3JrUHJvZ3Jlc3NDYWxsYmFjayA9IChwcm9ncmVzc09iajpXb3JrUHJvZ3Jlc3MpID0+IHZvaWQ7XG5cdHR5cGUgQlZIUHJvZ3Jlc3MgPSB7bm9kZXNTcGxpdDogbnVtYmVyLCB0cmlhbmdsZXNMZWFmZWQ6IG51bWJlcn07XG5cdHR5cGUgQXN5bmNpZnlQYXJhbXMgPSB7bXM/OiBudW1iZXIsIHN0ZXBzPzogbnVtYmVyfTtcbn1cblxuY29uc3QgRVBTSUxPTiA9IDFlLTY7XG5cbmltcG9ydCB7IEJWSFZlY3RvcjMgfSBmcm9tIFwiLi9CVkhWZWN0b3IzXCI7XG5pbXBvcnQgeyBCVkhOb2RlIH0gZnJvbSBcIi4vQlZITm9kZVwiO1xuaW1wb3J0IHsgQlZIIH0gZnJvbSBcIi4vQlZIXCI7XG5pbXBvcnQgeyBhc3luY1dvcmsgfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgZnVuY3Rpb24gQlZIQnVpbGRlcih0cmlhbmdsZXM6dW5rbm93biB8IFZlY3RvcltdW10gfCBudW1iZXJbXSB8IEZsb2F0MzJBcnJheSwgbWF4VHJpYW5nbGVzUGVyTm9kZTpudW1iZXIgPSAxMCkge1xuXHRpZih0eXBlb2YgbWF4VHJpYW5nbGVzUGVyTm9kZSAhPT0gJ251bWJlcicpIHRocm93IG5ldyBFcnJvcihgbWF4VHJpYW5nbGVzUGVyTm9kZSBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyLCBnb3Q6ICR7dHlwZW9mIG1heFRyaWFuZ2xlc1Blck5vZGV9YCk7XG5cdGlmKG1heFRyaWFuZ2xlc1Blck5vZGUgPCAxKSB0aHJvdyBuZXcgRXJyb3IoYG1heFRyaWFuZ2xlc1Blck5vZGUgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gMSwgZ290OiAke21heFRyaWFuZ2xlc1Blck5vZGV9YCk7XG5cdGlmKE51bWJlci5pc05hTihtYXhUcmlhbmdsZXNQZXJOb2RlKSkgdGhyb3cgbmV3IEVycm9yKGBtYXhUcmlhbmdsZXNQZXJOb2RlIGlzIE5hTmApO1xuXHRpZighTnVtYmVyLmlzSW50ZWdlcihtYXhUcmlhbmdsZXNQZXJOb2RlKSkgY29uc29sZS53YXJuKGBtYXhUcmlhbmdsZXNQZXJOb2RlIGlzIGV4cGVjdGVkIHRvIGJlIGFuIGludGVnZXIsIGdvdDogJHttYXhUcmlhbmdsZXNQZXJOb2RlfWApO1xuXHRsZXQgdHJpYW5nbGVzQXJyYXk6RmxvYXQzMkFycmF5O1xuXHQvL1ZlY3RvcltdW10gfCBudW1iZXJbXSB8IEZsb2F0MzJBcnJheVxuXHRpZihBcnJheS5pc0FycmF5KHRyaWFuZ2xlcykgJiYgdHJpYW5nbGVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdGNvbnNvbGUud2FybihgdHJpYW5nbGVzIGFwcGVhcnMgdG8gYmUgYW4gYXJyYXkgd2l0aCAwIGVsZW1lbnRzLmApO1xuXHR9XG5cdGlmKGlzRmFjZUFycmF5KHRyaWFuZ2xlcykpIHtcblx0XHR0cmlhbmdsZXNBcnJheSA9IGJ1aWxkVHJpYW5nbGVBcnJheSh0cmlhbmdsZXMpO1xuXHR9IGVsc2UgaWYgKHRyaWFuZ2xlcyBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSkge1xuXHRcdHRyaWFuZ2xlc0FycmF5ID0gdHJpYW5nbGVzO1xuXHR9IGVsc2UgaWYgKGlzTnVtYmVyQXJyYXkodHJpYW5nbGVzKSkge1xuXHRcdHRyaWFuZ2xlc0FycmF5ID0gbmV3IEZsb2F0MzJBcnJheSh0cmlhbmdsZXMpXG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGB0cmlhbmdsZXMgbXVzdCBiZSBvZiB0eXBlIFZlY3RvcltdW10gfCBudW1iZXJbXSB8IEZsb2F0MzJBcnJheSwgZ290OiAke3R5cGVvZiB0cmlhbmdsZXN9YCk7XG5cdH1cblx0bGV0IGJib3hBcnJheTpGbG9hdDMyQXJyYXkgPSBjYWxjQm91bmRpbmdCb3hlcyh0cmlhbmdsZXNBcnJheSk7XG5cdC8vIGNsb25lIGEgaGVscGVyIGFycmF5XG5cdGxldCBiYm94SGVscGVyOkZsb2F0MzJBcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoYmJveEFycmF5Lmxlbmd0aCk7XG5cdGJib3hIZWxwZXIuc2V0KGJib3hBcnJheSk7XG5cblx0Ly8gY3JlYXRlIHRoZSByb290IG5vZGUsIGFkZCBhbGwgdGhlIHRyaWFuZ2xlcyB0byBpdFxuXHR2YXIgdHJpYW5nbGVDb3VudDpudW1iZXIgPSB0cmlhbmdsZXNBcnJheS5sZW5ndGggLyA5O1xuXHR2YXIgZXh0ZW50czpYWVpbXSA9IGNhbGNFeHRlbnRzKGJib3hBcnJheSwgMCwgdHJpYW5nbGVDb3VudCwgRVBTSUxPTik7XG5cdGxldCByb290Tm9kZTpCVkhOb2RlID0gbmV3IEJWSE5vZGUoZXh0ZW50c1swXSwgZXh0ZW50c1sxXSwgMCwgdHJpYW5nbGVDb3VudCwgMCk7XG5cdGxldCBub2Rlc1RvU3BsaXQ6QlZITm9kZVtdID0gW3Jvb3ROb2RlXTtcblx0bGV0IG5vZGU6QlZITm9kZSB8IHVuZGVmaW5lZDtcblxuXHR3aGlsZShub2RlID0gbm9kZXNUb1NwbGl0LnBvcCgpKSB7XG5cdFx0bGV0IG5vZGVzID0gc3BsaXROb2RlKG5vZGUsIG1heFRyaWFuZ2xlc1Blck5vZGUsIGJib3hBcnJheSwgYmJveEhlbHBlcik7XG5cdFx0bm9kZXNUb1NwbGl0LnB1c2goLi4ubm9kZXMpO1xuXHR9XG5cdFxuXHRyZXR1cm4gbmV3IEJWSChyb290Tm9kZSwgYmJveEFycmF5LCB0cmlhbmdsZXNBcnJheSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBCVkhCdWlsZGVyQXN5bmModHJpYW5nbGVzOnVua25vd24gfCBWZWN0b3JbXVtdIHwgbnVtYmVyW10gfCBGbG9hdDMyQXJyYXksIG1heFRyaWFuZ2xlc1Blck5vZGU6bnVtYmVyID0gMTAsIGFzeW5jUGFyYW1zOkFzeW5jaWZ5UGFyYW1zID0ge30sIHByb2dyZXNzQ2FsbGJhY2s/OihvYmo6QlZIUHJvZ3Jlc3MpID0+IHZvaWQpOlByb21pc2U8QlZIPiB7XG5cdGlmKHR5cGVvZiBtYXhUcmlhbmdsZXNQZXJOb2RlICE9PSAnbnVtYmVyJykgdGhyb3cgbmV3IEVycm9yKGBtYXhUcmlhbmdsZXNQZXJOb2RlIG11c3QgYmUgb2YgdHlwZSBudW1iZXIsIGdvdDogJHt0eXBlb2YgbWF4VHJpYW5nbGVzUGVyTm9kZX1gKTtcblx0aWYobWF4VHJpYW5nbGVzUGVyTm9kZSA8IDEpIHRocm93IG5ldyBFcnJvcihgbWF4VHJpYW5nbGVzUGVyTm9kZSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAxLCBnb3Q6ICR7bWF4VHJpYW5nbGVzUGVyTm9kZX1gKTtcblx0aWYoTnVtYmVyLmlzTmFOKG1heFRyaWFuZ2xlc1Blck5vZGUpKSB0aHJvdyBuZXcgRXJyb3IoYG1heFRyaWFuZ2xlc1Blck5vZGUgaXMgTmFOYCk7XG5cdGlmKCFOdW1iZXIuaXNJbnRlZ2VyKG1heFRyaWFuZ2xlc1Blck5vZGUpKSBjb25zb2xlLndhcm4oYG1heFRyaWFuZ2xlc1Blck5vZGUgaXMgZXhwZWN0ZWQgdG8gYmUgYW4gaW50ZWdlciwgZ290OiAke21heFRyaWFuZ2xlc1Blck5vZGV9YCk7XG5cdGxldCB0cmlhbmdsZXNBcnJheTpGbG9hdDMyQXJyYXk7XG5cdC8vVmVjdG9yW11bXSB8IG51bWJlcltdIHwgRmxvYXQzMkFycmF5XG5cdGlmKEFycmF5LmlzQXJyYXkodHJpYW5nbGVzKSAmJiB0cmlhbmdsZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0Y29uc29sZS53YXJuKGB0cmlhbmdsZXMgYXBwZWFycyB0byBiZSBhbiBhcnJheSB3aXRoIDAgZWxlbWVudHMuYCk7XG5cdH1cblx0aWYoaXNGYWNlQXJyYXkodHJpYW5nbGVzKSkge1xuXHRcdHRyaWFuZ2xlc0FycmF5ID0gYnVpbGRUcmlhbmdsZUFycmF5KHRyaWFuZ2xlcyk7XG5cdH0gZWxzZSBpZiAodHJpYW5nbGVzIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5KSB7XG5cdFx0dHJpYW5nbGVzQXJyYXkgPSB0cmlhbmdsZXM7XG5cdH0gZWxzZSBpZiAoaXNOdW1iZXJBcnJheSh0cmlhbmdsZXMpKSB7XG5cdFx0dHJpYW5nbGVzQXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KHRyaWFuZ2xlcylcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYHRyaWFuZ2xlcyBtdXN0IGJlIG9mIHR5cGUgVmVjdG9yW11bXSB8IG51bWJlcltdIHwgRmxvYXQzMkFycmF5LCBnb3Q6ICR7dHlwZW9mIHRyaWFuZ2xlc31gKTtcblx0fVxuXHRsZXQgYmJveEFycmF5OkZsb2F0MzJBcnJheSA9IGNhbGNCb3VuZGluZ0JveGVzKHRyaWFuZ2xlc0FycmF5KTtcblx0Ly8gY2xvbmUgYSBoZWxwZXIgYXJyYXlcblx0bGV0IGJib3hIZWxwZXI6RmxvYXQzMkFycmF5ID0gbmV3IEZsb2F0MzJBcnJheShiYm94QXJyYXkubGVuZ3RoKTtcblx0YmJveEhlbHBlci5zZXQoYmJveEFycmF5KTtcblxuXHQvLyBjcmVhdGUgdGhlIHJvb3Qgbm9kZSwgYWRkIGFsbCB0aGUgdHJpYW5nbGVzIHRvIGl0XG5cdHZhciB0cmlhbmdsZUNvdW50Om51bWJlciA9IHRyaWFuZ2xlc0FycmF5Lmxlbmd0aCAvIDk7XG5cdHZhciBleHRlbnRzOlhZWltdID0gY2FsY0V4dGVudHMoYmJveEFycmF5LCAwLCB0cmlhbmdsZUNvdW50LCBFUFNJTE9OKTtcblx0bGV0IHJvb3ROb2RlOkJWSE5vZGUgPSBuZXcgQlZITm9kZShleHRlbnRzWzBdLCBleHRlbnRzWzFdLCAwLCB0cmlhbmdsZUNvdW50LCAwKTtcblx0bGV0IG5vZGVzVG9TcGxpdDpCVkhOb2RlW10gPSBbcm9vdE5vZGVdO1xuXHRsZXQgbm9kZTpCVkhOb2RlIHwgdW5kZWZpbmVkO1xuXG5cdGxldCB0YWxseSA9IDA7XG5cdGF3YWl0IGFzeW5jV29yaygoKSA9PiB7XG5cdFx0bm9kZSA9IG5vZGVzVG9TcGxpdC5wb3AoKTtcblx0XHRyZXR1cm4gdGFsbHkgKiA5IC8gdHJpYW5nbGVzQXJyYXkubGVuZ3RoO1xuXHR9LCAoKSA9PiB7XG5cdFx0aWYoIW5vZGUpIHJldHVybjtcblx0XHRsZXQgbm9kZXMgPSBzcGxpdE5vZGUobm9kZSwgbWF4VHJpYW5nbGVzUGVyTm9kZSwgYmJveEFycmF5LCBiYm94SGVscGVyKTtcblx0XHRpZighbm9kZXMubGVuZ3RoKSB0YWxseSArPSBub2RlLmVsZW1lbnRDb3VudCgpO1xuXHRcdG5vZGVzVG9TcGxpdC5wdXNoKC4uLm5vZGVzKTtcblx0fSwgYXN5bmNQYXJhbXMsIHByb2dyZXNzQ2FsbGJhY2sgP1xuXHRcdChub2Rlc1NwbGl0OldvcmtQcm9ncmVzcykgPT4gcHJvZ3Jlc3NDYWxsYmFjayhPYmplY3QuYXNzaWduKHt0cmlhbmdsZXNMZWFmZWQ6IHRhbGx5fSwgbm9kZXNTcGxpdCkpXG5cdFx0OiB1bmRlZmluZWRcblx0KTtcblx0cmV0dXJuIG5ldyBCVkgocm9vdE5vZGUsIGJib3hBcnJheSwgdHJpYW5nbGVzQXJyYXkpO1xufVxuXG5mdW5jdGlvbiBzcGxpdE5vZGUobm9kZTogQlZITm9kZSwgbWF4VHJpYW5nbGVzOm51bWJlciwgYmJveEFycmF5OkZsb2F0MzJBcnJheSwgYmJveEhlbHBlcjpGbG9hdDMyQXJyYXkpOkJWSE5vZGVbXSB7XG5cdGNvbnN0IG5vZGVDb3VudDpudW1iZXIgPSBub2RlLmVsZW1lbnRDb3VudCgpXG5cdGlmIChub2RlQ291bnQgPD0gbWF4VHJpYW5nbGVzIHx8IG5vZGVDb3VudCA9PT0gMCkgcmV0dXJuIFtdO1xuXG5cdGxldCBzdGFydEluZGV4Om51bWJlciA9IG5vZGUuc3RhcnRJbmRleDtcblx0bGV0IGVuZEluZGV4Om51bWJlciA9IG5vZGUuZW5kSW5kZXg7XG5cblx0bGV0IGxlZnROb2RlOm51bWJlcltdW10gPSBbIFtdLFtdLFtdIF07XG5cdGxldCByaWdodE5vZGU6bnVtYmVyW11bXSA9IFsgW10sW10sW10gXTtcblx0bGV0IGV4dGVudENlbnRlcnM6bnVtYmVyW10gPSBbbm9kZS5jZW50ZXJYKCksIG5vZGUuY2VudGVyWSgpLCBub2RlLmNlbnRlclooKV07XG5cblx0bGV0IG9iamVjdENlbnRlcjpudW1iZXJbXSA9IFtdO1xuXHRvYmplY3RDZW50ZXIubGVuZ3RoID0gMztcblxuXHRmb3IgKGxldCBpID0gc3RhcnRJbmRleDsgaSA8IGVuZEluZGV4OyBpKyspIHtcblx0XHRsZXQgaWR4ID0gaSAqIDcgKyAxO1xuXHRcdG9iamVjdENlbnRlclswXSA9IChiYm94QXJyYXlbaWR4XSArIGJib3hBcnJheVtpZHgrKyArIDNdKSAqIDAuNTsgLy8gY2VudGVyID0gKG1pbiArIG1heCkgLyAyXG5cdFx0b2JqZWN0Q2VudGVyWzFdID0gKGJib3hBcnJheVtpZHhdICsgYmJveEFycmF5W2lkeCsrICsgM10pICogMC41OyAvLyBjZW50ZXIgPSAobWluICsgbWF4KSAvIDJcblx0XHRvYmplY3RDZW50ZXJbMl0gPSAoYmJveEFycmF5W2lkeF0gKyBiYm94QXJyYXlbaWR4ICsgM10pICogMC41OyAvLyBjZW50ZXIgPSAobWluICsgbWF4KSAvIDJcblx0XHRmb3IgKGxldCBqID0gMDsgaiA8IDM7IGorKykge1xuXHRcdFx0aWYgKG9iamVjdENlbnRlcltqXSA8IGV4dGVudENlbnRlcnNbal0pIHtcblx0XHRcdFx0bGVmdE5vZGVbal0ucHVzaChpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJpZ2h0Tm9kZVtqXS5wdXNoKGkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIGNoZWNrIGlmIHdlIGNvdWxkbid0IHNwbGl0IHRoZSBub2RlIGJ5IGFueSBvZiB0aGUgYXhlcyAoeCwgeSBvciB6KS4gaGFsdCBoZXJlLCBkb250IHRyeSB0byBzcGxpdCBhbnkgbW9yZSAoY2F1c2UgaXQgd2lsbCBhbHdheXMgZmFpbCwgYW5kIHdlJ2xsIGVudGVyIGFuIGluZmluaXRlIGxvb3Bcblx0dmFyIHNwbGl0RmFpbGVkOmJvb2xlYW5bXSA9IFtdO1xuXHRzcGxpdEZhaWxlZC5sZW5ndGggPSAzO1xuXG5cdHNwbGl0RmFpbGVkWzBdID0gKGxlZnROb2RlWzBdLmxlbmd0aCA9PT0gMCkgfHwgKHJpZ2h0Tm9kZVswXS5sZW5ndGggPT09IDApO1xuXHRzcGxpdEZhaWxlZFsxXSA9IChsZWZ0Tm9kZVsxXS5sZW5ndGggPT09IDApIHx8IChyaWdodE5vZGVbMV0ubGVuZ3RoID09PSAwKTtcblx0c3BsaXRGYWlsZWRbMl0gPSAobGVmdE5vZGVbMl0ubGVuZ3RoID09PSAwKSB8fCAocmlnaHROb2RlWzJdLmxlbmd0aCA9PT0gMCk7XG5cblx0aWYgKHNwbGl0RmFpbGVkWzBdICYmIHNwbGl0RmFpbGVkWzFdICYmIHNwbGl0RmFpbGVkWzJdKSByZXR1cm4gW107XG5cblx0Ly8gY2hvb3NlIHRoZSBsb25nZXN0IHNwbGl0IGF4aXMuIGlmIHdlIGNhbid0IHNwbGl0IGJ5IGl0LCBjaG9vc2UgbmV4dCBiZXN0IG9uZS5cblx0dmFyIHNwbGl0T3JkZXIgPSBbMCwgMSwgMl07XG5cblx0dmFyIGV4dGVudHNMZW5ndGggPSBbXG5cdFx0bm9kZS5leHRlbnRzTWF4WzBdIC0gbm9kZS5leHRlbnRzTWluWzBdLFxuXHRcdG5vZGUuZXh0ZW50c01heFsxXSAtIG5vZGUuZXh0ZW50c01pblsxXSxcblx0XHRub2RlLmV4dGVudHNNYXhbMl0gLSBub2RlLmV4dGVudHNNaW5bMl1cblx0XTtcblxuXHRzcGxpdE9yZGVyLnNvcnQoKGF4aXMwLCBheGlzMSkgPT4gZXh0ZW50c0xlbmd0aFtheGlzMV0gLSBleHRlbnRzTGVuZ3RoW2F4aXMwXSk7XG5cblx0bGV0IGxlZnRFbGVtZW50czpudW1iZXJbXSB8IHVuZGVmaW5lZCA9IFtdO1xuXHRsZXQgcmlnaHRFbGVtZW50czpudW1iZXJbXSB8IHVuZGVmaW5lZCA9IFtdO1xuXG5cdGZvciAobGV0IGogPSAwOyBqIDwgMzsgaisrKSB7XG5cdFx0dmFyIGNhbmRpZGF0ZUluZGV4ID0gc3BsaXRPcmRlcltqXTtcblx0XHRpZiAoIXNwbGl0RmFpbGVkW2NhbmRpZGF0ZUluZGV4XSkge1xuXHRcdFx0bGVmdEVsZW1lbnRzID0gbGVmdE5vZGVbY2FuZGlkYXRlSW5kZXhdO1xuXHRcdFx0cmlnaHRFbGVtZW50cyA9IHJpZ2h0Tm9kZVtjYW5kaWRhdGVJbmRleF07XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblxuXG5cdC8vIHNvcnQgdGhlIGVsZW1lbnRzIGluIHJhbmdlIChzdGFydEluZGV4LCBlbmRJbmRleCkgYWNjb3JkaW5nIHRvIHdoaWNoIG5vZGUgdGhleSBzaG91bGQgYmUgYXRcblx0dmFyIG5vZGUwU3RhcnQgPSBzdGFydEluZGV4O1xuXHR2YXIgbm9kZTBFbmQgPSBub2RlMFN0YXJ0ICsgbGVmdEVsZW1lbnRzLmxlbmd0aDtcblx0dmFyIG5vZGUxU3RhcnQgPSBub2RlMEVuZDtcblx0dmFyIG5vZGUxRW5kID0gZW5kSW5kZXg7XG5cdFxuXHRjb3B5Qm94ZXMobGVmdEVsZW1lbnRzLCByaWdodEVsZW1lbnRzLCBub2RlLnN0YXJ0SW5kZXgsIGJib3hBcnJheSwgYmJveEhlbHBlcik7XG5cblx0Ly8gY29weSByZXN1bHRzIGJhY2sgdG8gbWFpbiBhcnJheVxuXHR2YXIgc3ViQXJyID0gYmJveEhlbHBlci5zdWJhcnJheShub2RlLnN0YXJ0SW5kZXggKiA3LCBub2RlLmVuZEluZGV4ICogNyk7XG5cdGJib3hBcnJheS5zZXQoc3ViQXJyLCBub2RlLnN0YXJ0SW5kZXggKiA3KTtcblxuXHQvLyBjcmVhdGUgMiBuZXcgbm9kZXMgZm9yIHRoZSBub2RlIHdlIGp1c3Qgc3BsaXQsIGFuZCBhZGQgbGlua3MgdG8gdGhlbSBmcm9tIHRoZSBwYXJlbnQgbm9kZVxuXHR2YXIgbm9kZTBFeHRlbnRzID0gY2FsY0V4dGVudHMoYmJveEFycmF5LCBub2RlMFN0YXJ0LCBub2RlMEVuZCwgRVBTSUxPTik7XG5cdHZhciBub2RlMUV4dGVudHMgPSBjYWxjRXh0ZW50cyhiYm94QXJyYXksIG5vZGUxU3RhcnQsIG5vZGUxRW5kLCBFUFNJTE9OKTtcblxuXHR2YXIgbm9kZTAgPSBuZXcgQlZITm9kZShub2RlMEV4dGVudHNbMF0sIG5vZGUwRXh0ZW50c1sxXSwgbm9kZTBTdGFydCwgbm9kZTBFbmQsIG5vZGUubGV2ZWwgKyAxKTtcblx0dmFyIG5vZGUxID0gbmV3IEJWSE5vZGUobm9kZTFFeHRlbnRzWzBdLCBub2RlMUV4dGVudHNbMV0sIG5vZGUxU3RhcnQsIG5vZGUxRW5kLCBub2RlLmxldmVsICsgMSk7XG5cblx0bm9kZS5ub2RlMCA9IG5vZGUwO1xuXHRub2RlLm5vZGUxID0gbm9kZTE7XG5cdG5vZGUuY2xlYXJTaGFwZXMoKTtcblxuXHQvLyBhZGQgbmV3IG5vZGVzIHRvIHRoZSBzcGxpdCBxdWV1ZVxuXHRyZXR1cm4gW25vZGUwLCBub2RlMV07XG59XG5cbmZ1bmN0aW9uIGNvcHlCb3hlcyhsZWZ0RWxlbWVudHM6bnVtYmVyW10sIHJpZ2h0RWxlbWVudHM6bnVtYmVyW10sIHN0YXJ0SW5kZXg6bnVtYmVyLCBiYm94QXJyYXk6RmxvYXQzMkFycmF5LCBiYm94SGVscGVyOkZsb2F0MzJBcnJheSkge1xuXHR2YXIgY29uY2F0ZW5hdGVkRWxlbWVudHMgPSBsZWZ0RWxlbWVudHMuY29uY2F0KHJpZ2h0RWxlbWVudHMpO1xuXHR2YXIgaGVscGVyUG9zID0gc3RhcnRJbmRleDtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb25jYXRlbmF0ZWRFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBjdXJyRWxlbWVudCA9IGNvbmNhdGVuYXRlZEVsZW1lbnRzW2ldO1xuXHRcdGNvcHlCb3goYmJveEFycmF5LCBjdXJyRWxlbWVudCwgYmJveEhlbHBlciwgaGVscGVyUG9zKTtcblx0XHRoZWxwZXJQb3MrKztcblx0fVxufVxuXG5mdW5jdGlvbiBjYWxjRXh0ZW50cyhiYm94QXJyYXk6RmxvYXQzMkFycmF5LCBzdGFydEluZGV4Om51bWJlciwgZW5kSW5kZXg6bnVtYmVyLCBleHBhbmRCeTogbnVtYmVyID0gMC4wKTpYWVpbXSB7XG5cdGlmIChzdGFydEluZGV4ID49IGVuZEluZGV4KSByZXR1cm4gW1swLCAwLCAwXSwgWzAsIDAsIDBdXTtcblx0bGV0IG1pblggPSBJbmZpbml0eTtcblx0bGV0IG1pblkgPSBJbmZpbml0eTtcblx0bGV0IG1pblogPSBJbmZpbml0eTtcblx0bGV0IG1heFggPSAtSW5maW5pdHk7XG5cdGxldCBtYXhZID0gLUluZmluaXR5O1xuXHRsZXQgbWF4WiA9IC1JbmZpbml0eTtcblx0Zm9yIChsZXQgaSA9IHN0YXJ0SW5kZXg7IGkgPCBlbmRJbmRleDsgaSsrKSB7XG5cdFx0bGV0IGlkeCA9IGkgKiA3ICsgMTtcblx0XHRtaW5YID0gTWF0aC5taW4oYmJveEFycmF5W2lkeCsrXSwgbWluWCk7XG5cdFx0bWluWSA9IE1hdGgubWluKGJib3hBcnJheVtpZHgrK10sIG1pblkpO1xuXHRcdG1pblogPSBNYXRoLm1pbihiYm94QXJyYXlbaWR4KytdLCBtaW5aKTtcblx0XHRtYXhYID0gTWF0aC5tYXgoYmJveEFycmF5W2lkeCsrXSwgbWF4WCk7XG5cdFx0bWF4WSA9IE1hdGgubWF4KGJib3hBcnJheVtpZHgrK10sIG1heFkpO1xuXHRcdG1heFogPSBNYXRoLm1heChiYm94QXJyYXlbaWR4XSwgbWF4Wik7XG5cdH1cblx0cmV0dXJuIFtcblx0XHRbbWluWCAtIGV4cGFuZEJ5LCBtaW5ZIC0gZXhwYW5kQnksIG1pblogLSBleHBhbmRCeV0sXG5cdFx0W21heFggKyBleHBhbmRCeSwgbWF4WSArIGV4cGFuZEJ5LCBtYXhaICsgZXhwYW5kQnldXG5cdF07XG59XG5cbmZ1bmN0aW9uIGNhbGNCb3VuZGluZ0JveGVzKHRyaWFuZ2xlc0FycmF5OiBGbG9hdDMyQXJyYXkpOkZsb2F0MzJBcnJheSB7XG5cdGNvbnN0IHRyaWFuZ2xlQ291bnQ6bnVtYmVyID0gdHJpYW5nbGVzQXJyYXkubGVuZ3RoIC8gOTtcblx0Y29uc3QgYmJveEFycmF5OkZsb2F0MzJBcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkodHJpYW5nbGVDb3VudCAqIDcpO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgdHJpYW5nbGVDb3VudDsgaSsrKSB7XG5cdFx0bGV0IGlkeCA9IGkgKiA5O1xuXHRcdGNvbnN0IHAweCA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcblx0XHRjb25zdCBwMHkgPSB0cmlhbmdsZXNBcnJheVtpZHgrK107XG5cdFx0Y29uc3QgcDB6ID0gdHJpYW5nbGVzQXJyYXlbaWR4KytdO1xuXHRcdGNvbnN0IHAxeCA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcblx0XHRjb25zdCBwMXkgPSB0cmlhbmdsZXNBcnJheVtpZHgrK107XG5cdFx0Y29uc3QgcDF6ID0gdHJpYW5nbGVzQXJyYXlbaWR4KytdO1xuXHRcdGNvbnN0IHAyeCA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcblx0XHRjb25zdCBwMnkgPSB0cmlhbmdsZXNBcnJheVtpZHgrK107XG5cdFx0Y29uc3QgcDJ6ID0gdHJpYW5nbGVzQXJyYXlbaWR4XTtcblxuXHRcdGNvbnN0IG1pblggPSBNYXRoLm1pbihwMHgsIHAxeCwgcDJ4KTtcblx0XHRjb25zdCBtaW5ZID0gTWF0aC5taW4ocDB5LCBwMXksIHAyeSk7XG5cdFx0Y29uc3QgbWluWiA9IE1hdGgubWluKHAweiwgcDF6LCBwMnopO1xuXHRcdGNvbnN0IG1heFggPSBNYXRoLm1heChwMHgsIHAxeCwgcDJ4KTtcblx0XHRjb25zdCBtYXhZID0gTWF0aC5tYXgocDB5LCBwMXksIHAyeSk7XG5cdFx0Y29uc3QgbWF4WiA9IE1hdGgubWF4KHAweiwgcDF6LCBwMnopO1xuXHRcdHNldEJveChiYm94QXJyYXksIGksIGksIG1pblgsIG1pblksIG1pblosIG1heFgsIG1heFksIG1heFopO1xuXHR9XG5cblx0cmV0dXJuIGJib3hBcnJheTtcbn1cblxuZnVuY3Rpb24gYnVpbGRUcmlhbmdsZUFycmF5KHRyaWFuZ2xlczpWZWN0b3JbXVtdKTpGbG9hdDMyQXJyYXkge1xuXHRjb25zdCB0cmlhbmdsZXNBcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkodHJpYW5nbGVzLmxlbmd0aCAqIDkpO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgdHJpYW5nbGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3QgcDAgPSB0cmlhbmdsZXNbaV1bMF07XG5cdFx0Y29uc3QgcDEgPSB0cmlhbmdsZXNbaV1bMV07XG5cdFx0Y29uc3QgcDIgPSB0cmlhbmdsZXNbaV1bMl07XG5cdFx0bGV0IGlkeCA9IGkgKiA5O1xuXHRcdHRyaWFuZ2xlc0FycmF5W2lkeCsrXSA9IHAwLng7XG5cdFx0dHJpYW5nbGVzQXJyYXlbaWR4KytdID0gcDAueTtcblx0XHR0cmlhbmdsZXNBcnJheVtpZHgrK10gPSBwMC56O1xuXG5cdFx0dHJpYW5nbGVzQXJyYXlbaWR4KytdID0gcDEueDtcblx0XHR0cmlhbmdsZXNBcnJheVtpZHgrK10gPSBwMS55O1xuXHRcdHRyaWFuZ2xlc0FycmF5W2lkeCsrXSA9IHAxLno7XG5cblx0XHR0cmlhbmdsZXNBcnJheVtpZHgrK10gPSBwMi54O1xuXHRcdHRyaWFuZ2xlc0FycmF5W2lkeCsrXSA9IHAyLnk7XG5cdFx0dHJpYW5nbGVzQXJyYXlbaWR4XSA9IHAyLno7XG5cdH1cblxuXHRyZXR1cm4gdHJpYW5nbGVzQXJyYXk7XG59XG5cbmZ1bmN0aW9uIHNldEJveChiYm94QXJyYXk6RmxvYXQzMkFycmF5LCBwb3M6bnVtYmVyLCB0cmlhbmdsZUlkOm51bWJlciwgbWluWDpudW1iZXIsIG1pblk6bnVtYmVyLCBtaW5aOm51bWJlciwgbWF4WDpudW1iZXIsIG1heFk6bnVtYmVyLCBtYXhaOm51bWJlcik6dm9pZCB7XG5cdGxldCBpZHggPSBwb3MgKiA3O1xuXHRiYm94QXJyYXlbaWR4KytdID0gdHJpYW5nbGVJZDtcblx0YmJveEFycmF5W2lkeCsrXSA9IG1pblg7XG5cdGJib3hBcnJheVtpZHgrK10gPSBtaW5ZO1xuXHRiYm94QXJyYXlbaWR4KytdID0gbWluWjtcblx0YmJveEFycmF5W2lkeCsrXSA9IG1heFg7XG5cdGJib3hBcnJheVtpZHgrK10gPSBtYXhZO1xuXHRiYm94QXJyYXlbaWR4XSA9IG1heFo7XG59XG5cbmZ1bmN0aW9uIGNvcHlCb3goc291cmNlQXJyYXk6RmxvYXQzMkFycmF5LCBzb3VyY2VQb3M6bnVtYmVyLCBkZXN0QXJyYXk6RmxvYXQzMkFycmF5LCBkZXN0UG9zOm51bWJlcik6dm9pZCB7XG5cdGxldCBpZHggPSBkZXN0UG9zICogNztcblx0bGV0IGpkeCA9IHNvdXJjZVBvcyAqIDc7XG5cdGRlc3RBcnJheVtpZHgrK10gPSBzb3VyY2VBcnJheVtqZHgrK107XG5cdGRlc3RBcnJheVtpZHgrK10gPSBzb3VyY2VBcnJheVtqZHgrK107XG5cdGRlc3RBcnJheVtpZHgrK10gPSBzb3VyY2VBcnJheVtqZHgrK107XG5cdGRlc3RBcnJheVtpZHgrK10gPSBzb3VyY2VBcnJheVtqZHgrK107XG5cdGRlc3RBcnJheVtpZHgrK10gPSBzb3VyY2VBcnJheVtqZHgrK107XG5cdGRlc3RBcnJheVtpZHgrK10gPSBzb3VyY2VBcnJheVtqZHgrK107XG5cdGRlc3RBcnJheVtpZHhdID0gc291cmNlQXJyYXlbamR4XTtcbn1cblxuZnVuY3Rpb24gaXNGYWNlQXJyYXkodGVzdEFycmF5OiB1bmtub3duKTogdGVzdEFycmF5IGlzIFZlY3RvcltdW10ge1xuXHRpZighQXJyYXkuaXNBcnJheSh0ZXN0QXJyYXkpKSByZXR1cm4gZmFsc2U7XG5cdGZvcihsZXQgaSA9IDA7IGkgPCB0ZXN0QXJyYXkubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBmYWNlID0gdGVzdEFycmF5W2ldO1xuXHRcdGlmKCFBcnJheS5pc0FycmF5KGZhY2UpKSByZXR1cm4gZmFsc2U7XG5cdFx0aWYoZmFjZS5sZW5ndGggIT09IDMpIHJldHVybiBmYWxzZTtcblx0XHRmb3IobGV0IGogPSAwOyBqIDwgMzsgaisrKSB7XG5cdFx0XHRjb25zdCB2ZXJ0ZXg6VmVjdG9yID0gPFZlY3Rvcj5mYWNlW2pdO1xuXHRcdFx0aWYodHlwZW9mIHZlcnRleC54ICE9PSBcIm51bWJlclwiIHx8IHR5cGVvZiB2ZXJ0ZXgueSAhPT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgdmVydGV4LnogIT09IFwibnVtYmVyXCIpIHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyQXJyYXkodGVzdEFycmF5OiB1bmtub3duKTogdGVzdEFycmF5IGlzIG51bWJlcltdIHtcblx0aWYoIUFycmF5LmlzQXJyYXkodGVzdEFycmF5KSkgcmV0dXJuIGZhbHNlO1xuXHRmb3IobGV0IGkgPSAwOyBpIDwgdGVzdEFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYodHlwZW9mIHRlc3RBcnJheVtpXSAhPT0gXCJudW1iZXJcIikgcmV0dXJuIGZhbHNlO1xuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuIiwiZXhwb3J0IGNsYXNzIEJWSE5vZGUge1xuXHRleHRlbnRzTWluOiBYWVo7XG5cdGV4dGVudHNNYXg6IFhZWjtcblx0c3RhcnRJbmRleDogbnVtYmVyO1xuXHRlbmRJbmRleDogbnVtYmVyO1xuXHRsZXZlbDogbnVtYmVyO1xuXHRub2RlMDogQlZITm9kZSB8IG51bGw7XG5cdG5vZGUxOiBCVkhOb2RlIHwgbnVsbDtcblx0Y29uc3RydWN0b3IoZXh0ZW50c01pbjogWFlaLCBleHRlbnRzTWF4OiBYWVosIHN0YXJ0SW5kZXg6IG51bWJlciwgZW5kSW5kZXg6IG51bWJlciwgbGV2ZWw6IG51bWJlcikge1xuXHRcdHRoaXMuZXh0ZW50c01pbiA9IGV4dGVudHNNaW47XG5cdFx0dGhpcy5leHRlbnRzTWF4ID0gZXh0ZW50c01heDtcblx0XHR0aGlzLnN0YXJ0SW5kZXggPSBzdGFydEluZGV4O1xuXHRcdHRoaXMuZW5kSW5kZXggPSBlbmRJbmRleDtcblx0XHR0aGlzLmxldmVsID0gbGV2ZWw7XG5cdFx0dGhpcy5ub2RlMCA9IG51bGw7XG5cdFx0dGhpcy5ub2RlMSA9IG51bGw7XG5cdH1cblx0c3RhdGljIGZyb21PYmooe2V4dGVudHNNaW4sIGV4dGVudHNNYXgsIHN0YXJ0SW5kZXgsIGVuZEluZGV4LCBsZXZlbCwgbm9kZTAsIG5vZGUxfTphbnkpIHtcblx0XHRjb25zdCB0ZW1wTm9kZSA9IG5ldyBCVkhOb2RlKGV4dGVudHNNaW4sIGV4dGVudHNNYXgsIHN0YXJ0SW5kZXgsIGVuZEluZGV4LCBsZXZlbCk7XG5cdFx0aWYobm9kZTApIHRlbXBOb2RlLm5vZGUwID0gQlZITm9kZS5mcm9tT2JqKG5vZGUwKTtcblx0XHRpZihub2RlMSkgdGVtcE5vZGUubm9kZTEgPSBCVkhOb2RlLmZyb21PYmoobm9kZTEpO1xuXHRcdHJldHVybiB0ZW1wTm9kZTtcblx0fVxuXHRlbGVtZW50Q291bnQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZW5kSW5kZXggLSB0aGlzLnN0YXJ0SW5kZXg7XG5cdH1cblxuXHRjZW50ZXJYKCkge1xuXHRcdHJldHVybiAodGhpcy5leHRlbnRzTWluWzBdICsgdGhpcy5leHRlbnRzTWF4WzBdKSAqIDAuNTtcblx0fVxuXG5cdGNlbnRlclkoKSB7XG5cdFx0cmV0dXJuICh0aGlzLmV4dGVudHNNaW5bMV0gKyB0aGlzLmV4dGVudHNNYXhbMV0pICogMC41O1xuXHR9XG5cblx0Y2VudGVyWigpIHtcblx0XHRyZXR1cm4gKHRoaXMuZXh0ZW50c01pblsyXSArIHRoaXMuZXh0ZW50c01heFsyXSkgKiAwLjU7XG5cdH1cblxuXHRjbGVhclNoYXBlcygpIHtcblx0XHR0aGlzLnN0YXJ0SW5kZXggPSAtMTtcblx0XHR0aGlzLmVuZEluZGV4ID0gLTE7XG5cdH1cbn1cbiIsImV4cG9ydCBjbGFzcyBCVkhWZWN0b3IzICB7XG5cdHg6IG51bWJlciA9IDA7XG5cdHk6IG51bWJlciA9IDA7XG5cdHo6IG51bWJlciA9IDA7XG5cdGNvbnN0cnVjdG9yKHg6bnVtYmVyID0gMCwgeTpudW1iZXIgPSAwLCB6Om51bWJlciA9IDApIHtcblx0XHR0aGlzLnggPSB4O1xuXHRcdHRoaXMueSA9IHk7XG5cdFx0dGhpcy56ID0gejtcblx0fVxuXHRjb3B5KHY6QlZIVmVjdG9yMykge1xuXHRcdHRoaXMueCA9IHYueDtcblx0XHR0aGlzLnkgPSB2Lnk7XG5cdFx0dGhpcy56ID0gdi56O1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdHNldEZyb21BcnJheShhcnJheTpGbG9hdDMyQXJyYXksIGZpcnN0RWxlbWVudFBvczpudW1iZXIpIHtcblx0XHR0aGlzLnggPSBhcnJheVtmaXJzdEVsZW1lbnRQb3NdO1xuXHRcdHRoaXMueSA9IGFycmF5W2ZpcnN0RWxlbWVudFBvcysxXTtcblx0XHR0aGlzLnogPSBhcnJheVtmaXJzdEVsZW1lbnRQb3MrMl07XG5cdH1cblx0c2V0RnJvbUFycmF5Tm9PZmZzZXQoYXJyYXk6bnVtYmVyW10pIHtcblx0XHR0aGlzLnggPSBhcnJheVswXTtcblx0XHR0aGlzLnkgPSBhcnJheVsxXTtcblx0XHR0aGlzLnogPSBhcnJheVsyXTtcblx0fVxuXG5cdHNldEZyb21BcmdzKGE6bnVtYmVyLCBiOm51bWJlciwgYzpudW1iZXIpIHtcblx0XHR0aGlzLnggPSBhO1xuXHRcdHRoaXMueSA9IGI7XG5cdFx0dGhpcy56ID0gYztcblx0fVxuXHRhZGQodjpCVkhWZWN0b3IzKSB7XG5cdFx0dGhpcy54ICs9IHYueDtcblx0XHR0aGlzLnkgKz0gdi55O1xuXHRcdHRoaXMueiArPSB2Lno7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0bXVsdGlwbHlTY2FsYXIoc2NhbGFyOm51bWJlcikge1xuXHRcdHRoaXMueCAqPSBzY2FsYXI7XG5cdFx0dGhpcy55ICo9IHNjYWxhcjtcblx0XHR0aGlzLnogKj0gc2NhbGFyO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdHN1YlZlY3RvcnMoYTpCVkhWZWN0b3IzLCBiOkJWSFZlY3RvcjMpIHtcblx0XHR0aGlzLnggPSBhLnggLSBiLng7XG5cdFx0dGhpcy55ID0gYS55IC0gYi55O1xuXHRcdHRoaXMueiA9IGEueiAtIGIuejtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRkb3QodjpCVkhWZWN0b3IzKSB7XG5cdFx0cmV0dXJuIHRoaXMueCAqIHYueCArIHRoaXMueSAqIHYueSArIHRoaXMueiAqIHYuejtcblx0fVxuXHRjcm9zcyh2OkJWSFZlY3RvcjMpIHtcblx0XHRjb25zdCB4ID0gdGhpcy54LCB5ID0gdGhpcy55LCB6ID0gdGhpcy56O1xuXHRcdHRoaXMueCA9IHkgKiB2LnogLSB6ICogdi55O1xuXHRcdHRoaXMueSA9IHogKiB2LnggLSB4ICogdi56O1xuXHRcdHRoaXMueiA9IHggKiB2LnkgLSB5ICogdi54O1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdGNyb3NzVmVjdG9ycyhhOkJWSFZlY3RvcjMsIGI6QlZIVmVjdG9yMykge1xuXHRcdGNvbnN0IGF4ID0gYS54LCBheSA9IGEueSwgYXogPSBhLno7XG5cdFx0Y29uc3QgYnggPSBiLngsIGJ5ID0gYi55LCBieiA9IGIuejtcblx0XHR0aGlzLnggPSBheSAqIGJ6IC0gYXogKiBieTtcblx0XHR0aGlzLnkgPSBheiAqIGJ4IC0gYXggKiBiejtcblx0XHR0aGlzLnogPSBheCAqIGJ5IC0gYXkgKiBieDtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRjbG9uZSgpIHtcblx0XHRyZXR1cm4gbmV3IEJWSFZlY3RvcjModGhpcy54LCB0aGlzLnksIHRoaXMueik7XG5cdH1cblx0c3RhdGljIGZyb21BbnkocG90ZW50aWFsVmVjdG9yOmFueSk6QlZIVmVjdG9yMyB7XG5cdFx0aWYocG90ZW50aWFsVmVjdG9yIGluc3RhbmNlb2YgQlZIVmVjdG9yMykge1xuXHRcdFx0cmV0dXJuIHBvdGVudGlhbFZlY3Rvcjtcblx0XHR9IGVsc2UgaWYgKHBvdGVudGlhbFZlY3Rvci54ICE9PSB1bmRlZmluZWQgJiYgcG90ZW50aWFsVmVjdG9yLnggIT09IG51bGwpIHtcblx0XHRcdHJldHVybiBuZXcgQlZIVmVjdG9yMyhwb3RlbnRpYWxWZWN0b3IueCwgcG90ZW50aWFsVmVjdG9yLnksIHBvdGVudGlhbFZlY3Rvci56KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcIkNvdWxkbid0IGNvbnZlcnQgdG8gQlZIVmVjdG9yMy5cIik7XG5cdFx0fVxuXHR9XG59XG4iLCJleHBvcnQgKiBmcm9tICcuL0JWSCc7XG5leHBvcnQgKiBmcm9tICcuL0JWSEJ1aWxkZXInO1xuZXhwb3J0ICogZnJvbSAnLi9CVkhOb2RlJztcbmV4cG9ydCAqIGZyb20gJy4vQlZIVmVjdG9yMyc7XG4iLCJpbXBvcnQgeyBCVkhOb2RlIH0gZnJvbSAnLi9CVkhOb2RlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvdW50Tm9kZXMobm9kZTpCVkhOb2RlLCBjb3VudDpudW1iZXIgPSAwKTpudW1iZXIge1xuXHRjb3VudCArPSAxO1xuXHRpZihub2RlLm5vZGUwKSB7XG5cdFx0Y291bnQgKz0gY291bnROb2Rlcyhub2RlLm5vZGUwKTtcblx0fVxuXHRpZihub2RlLm5vZGUxKSB7XG5cdFx0Y291bnQgKz0gY291bnROb2Rlcyhub2RlLm5vZGUxKTtcblx0fVxuXHRpZigobm9kZSBhcyBhbnkpLl9ub2RlMCkge1xuXHRcdGNvdW50ICs9IGNvdW50Tm9kZXMoKG5vZGUgYXMgYW55KS5fbm9kZTApO1xuXHR9XG5cdGlmKChub2RlIGFzIGFueSkuX25vZGUxKSB7XG5cdFx0Y291bnQgKz0gY291bnROb2Rlcygobm9kZSBhcyBhbnkpLl9ub2RlMSk7XG5cdH1cblx0cmV0dXJuIGNvdW50O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYXN5bmNXb3JrKHdvcmtDaGVjazpFdmFsdWF0b3IsIHdvcms6V29yaywgb3B0aW9uczpBc3luY2lmeVBhcmFtcywgcHJvZ3Jlc3NDYWxsYmFjaz86V29ya1Byb2dyZXNzQ2FsbGJhY2spOlByb21pc2U8dm9pZD4ge1xuXHRpZihvcHRpb25zLm1zICE9PSB1bmRlZmluZWQgJiYgb3B0aW9ucy5zdGVwcyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0Y29uc29sZS53YXJuKFwiQXN5bmNpZnkgZ290IGJvdGggc3RlcHMgYW5kIG1zLCBkZWZhdWx0aW5nIHRvIHN0ZXBzLlwiKTtcblx0fVxuXHRjb25zdCB3b3JrZXI6R2VuZXJhdG9yID0gKG9wdGlvbnMuc3RlcHMgIT09IHVuZGVmaW5lZCA/IHBlcmNlbnRhZ2VBc3luY2lmeSA6IHRpbWVBc3luY2lmeSkod29ya0NoZWNrLCB3b3JrLCBvcHRpb25zKTtcblx0bGV0IGRvbmU6IGJvb2xlYW47XG5cdGxldCBub2Rlc1NwbGl0OiBudW1iZXI7XG5cdHdoaWxlKCEoe3ZhbHVlOiBub2Rlc1NwbGl0LCBkb25lfSA9IHdvcmtlci5uZXh0KCksIGRvbmUpKSB7XG5cdFx0aWYodHlwZW9mIHByb2dyZXNzQ2FsbGJhY2sgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRwcm9ncmVzc0NhbGxiYWNrKHtub2Rlc1NwbGl0fSk7XG5cdFx0fVxuXHRcdGF3YWl0IHRpY2tpZnkoKTtcblx0fVxufVxuXG5mdW5jdGlvbiogdGltZUFzeW5jaWZ5KHdvcmtDaGVjazpFdmFsdWF0b3IsIHdvcms6V29yaywge21zPTEwMDAgLyAzMH06QXN5bmNpZnlQYXJhbXMpIHtcblx0bGV0IHNUaW1lOm51bWJlciA9IERhdGUubm93KCk7XG5cdGxldCBuOm51bWJlciA9IDA7XG5cdGxldCB0aHJlczpudW1iZXIgPSAwO1xuXHRsZXQgY291bnQ6bnVtYmVyID0gMDtcblx0d2hpbGUod29ya0NoZWNrKCkgPCAxKSB7XG5cdFx0d29yaygpO1xuXHRcdGNvdW50Kys7XG5cdFx0aWYoKytuID49IHRocmVzKSB7XG5cdFx0XHRjb25zdCBjVGltZSA9IERhdGUubm93KCk7XG5cdFx0XHRjb25zdCB0RGlmZiA9IGNUaW1lIC0gc1RpbWU7XG5cdFx0XHRpZih0RGlmZiA+IG1zKSB7XG5cdFx0XHRcdHlpZWxkIGNvdW50O1xuXHRcdFx0XHR0aHJlcyA9IG4gKiAobXMgLyB0RGlmZik7XG5cdFx0XHRcdHNUaW1lID0gY1RpbWU7XG5cdFx0XHRcdG4gPSAwO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiogcGVyY2VudGFnZUFzeW5jaWZ5KHdvcmtDaGVjazpFdmFsdWF0b3IsIHdvcms6V29yaywge3N0ZXBzPTEwfTpBc3luY2lmeVBhcmFtcykge1xuXHRpZihzdGVwcyA8PSAwKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQXN5bmNpZnkgc3RlcHMgd2FzIGxlc3MgdGhhbiBvciBlcXVhbCB0byB6ZXJvXCIpO1xuXHR9XG5cdGxldCBjb3VudDpudW1iZXIgPSAwO1xuXHRsZXQgdG90YWxOdW1iZXI6IG51bWJlciA9IDA7XG5cdGxldCBsYXN0SW5jOm51bWJlciA9IDA7XG5cdGxldCB3b3JrUGVyY2VudGFnZTpudW1iZXI7XG5cdGxldCBwZXJjZW50YWdlOm51bWJlciA9IDEgLyBzdGVwcztcblx0d2hpbGUoKHdvcmtQZXJjZW50YWdlID0gd29ya0NoZWNrKCksIHdvcmtQZXJjZW50YWdlIDwgMSkpIHtcblx0XHR3b3JrKCk7XG5cdFx0Y291bnQrKztcblx0XHRpZih3b3JrUGVyY2VudGFnZSA+IGxhc3RJbmMpIHtcblx0XHRcdHRvdGFsTnVtYmVyICs9IDE7XG5cdFx0XHR5aWVsZCBjb3VudDtcblx0XHRcdGxhc3RJbmMgPSB3b3JrUGVyY2VudGFnZSArIHBlcmNlbnRhZ2U7XG5cdFx0fVxuXHR9XG5cdGNvbnNvbGUubG9nKFwiVG90YWxcIiwgdG90YWxOdW1iZXIpO1xufVxuXG5cblxuY29uc3QgdGlja2lmeSA9ICgpOlByb21pc2U8dm9pZD4gPT4gbmV3IFByb21pc2UoKHJlczpXb3JrKSA9PiBzZXRUaW1lb3V0KHJlcykpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==