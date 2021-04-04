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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZG9jcy93b3JrZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0JWSC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQlZIQnVpbGRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQlZITm9kZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQlZIVmVjdG9yMy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQSxpRUFBb0U7QUFFcEUsSUFBSSxHQUFPLENBQUM7QUFFWixTQUFTLEdBQUcsVUFBZSxFQUFDLElBQUksRUFBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsRUFBQzs7UUFDaEQsSUFBRyxP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QUFRLENBQUM7SUFDcEIsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBQ3BCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQztJQUNwQixJQUFJLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUNyQixJQUFJLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUNyQixJQUFJLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUNyQixLQUFLLElBQUksQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzNDLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN0QztJQUNELE9BQU87UUFDTixDQUFDLElBQUksR0FBRyxRQUFRLEVBQUUsSUFBSSxHQUFHLFFBQVEsRUFBRSxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQ25ELENBQUMsSUFBSSxHQUFHLFFBQVEsRUFBRSxJ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RTtRQUN6RCxJQUFJLEVBQUUsQ0FBQztRQUNQLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBRyxjQUFjLEdBQUcsT0FBTyxFQUFFO1lBQzVCLFdBQVcsSUFBSSxDQUFDLENBQUM7WUFDakIsTUFBTSxLQUFLLENBQUM7WUFDWixPQUFPLEdBQUcsY0FBYyxHQUFHLFVBQVUsQ0FBQztTQUN0QztLQUNEO0lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDbkMsQ0FBQztBQUlELE1BQU0sT0FBTyxHQUFHLEdBQWlCLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQVEsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiLi93b3JrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2RvY3Mvd29ya2VyLnRzXCIpO1xuIiwiaW1wb3J0IHsgQlZIQnVpbGRlciwgQlZIQnVpbGRlckFzeW5jLCBCVkgsIEJWSFZlY3RvcjMgfSBmcm9tICdAc3JjJztcblxubGV0IGJ2aDpCVkg7XG5cbm9ubWVzc2FnZSA9IGFzeW5jIGZ1bmN0aW9uKHtkYXRhOnttZXNzYWdlLCBkYXRhfX0pIHtcblx0aWYobWVzc2FnZSA9PT0gXCJidmhfaW5mb1wiKSB7XG5cdFx0YnVpbGRCVkgoZGF0YS5mYWNlc0FycmF5KTtcblx0fSBlbHNlIGlmIChtZXNzYWdlID09PSBcInJheV9jYXN0XCIpIHtcblx0XHRyYXlDYXN0KGRhdGEub3JpZ2luLCBkYXRhLmRpcmVjdGlvbik7XG5cdH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gYnVpbGRCVkgoYXJyYXk6YW55ICkge1xuXHRidmggPSBhd2FpdCBCVkhCdWlsZGVyQXN5bmMoYXJyYXksIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdChzZWxmIGFzIGFueSkucG9zdE1lc3NhZ2Uoe1xuXHRcdFx0bWVzc2FnZTogXCJwcm9ncmVzc1wiLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHR2YWx1ZVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblx0KHNlbGYgYXMgYW55KS5wb3N0TWVzc2FnZSh7XG5cdFx0bWVzc2FnZTogXCJkb25lXCIsXG5cdH0pO1xufVxuXG5mdW5jdGlvbiByYXlDYXN0KG9yaWdpbjphbnksIGRpcmVjdGlvbjphbnkpIHtcblx0bGV0IHJlc3VsdCA9IGJ2aC5pbnRlcnNlY3RSYXkob3JpZ2luLCBkaXJlY3Rpb24sIGZhbHNlKTtcblx0KHNlbGYgYXMgYW55KS5wb3N0TWVzc2FnZSgge1xuXHRcdG1lc3NhZ2U6IFwicmF5X3RyYWNlZFwiLFxuXHRcdGRhdGE6IHJlc3VsdFxuXHR9KTtcbn0iLCJpbXBvcnQgeyBCVkhWZWN0b3IzIH0gZnJvbSAnLi9CVkhWZWN0b3IzJztcbmltcG9ydCB7IEJWSE5vZGUgfSBmcm9tICcuL0JWSE5vZGUnO1xuXG5leHBvcnQgY2xhc3MgQlZIIHtcblx0cm9vdE5vZGU6IEJWSE5vZGU7XG5cdGJib3hBcnJheTogRmxvYXQzMkFycmF5O1xuXHR0cmlhbmdsZXNBcnJheTogRmxvYXQzMkFycmF5O1xuXHRjb25zdHJ1Y3Rvcihyb290Tm9kZTpCVkhOb2RlLCBib3VuZGluZ0JveEFycmF5OkZsb2F0MzJBcnJheSwgdHJpYW5nbGVBcnJheTpGbG9hdDMyQXJyYXkpIHtcblx0XHR0aGlzLnJvb3ROb2RlID0gcm9vdE5vZGU7XG5cdFx0dGhpcy5iYm94QXJyYXkgPSBib3VuZGluZ0JveEFycmF5O1xuXHRcdHRoaXMudHJpYW5nbGVzQXJyYXkgPSB0cmlhbmdsZUFycmF5O1xuXHR9XG5cdGludGVyc2VjdFJheShyYXlPcmlnaW46YW55LCByYXlEaXJlY3Rpb246YW55LCBiYWNrZmFjZUN1bGxpbmc6Ym9vbGVhbiA9IHRydWUpOmFueVtdIHtcblx0XHR0cnkge1xuXHRcdFx0cmF5T3JpZ2luID0gQlZIVmVjdG9yMy5mcm9tQW55KHJheU9yaWdpbik7XG5cdFx0XHRyYXlEaXJlY3Rpb24gPSBCVkhWZWN0b3IzLmZyb21BbnkocmF5RGlyZWN0aW9uKTtcblx0XHR9IGNhdGNoKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiT3JpZ2luIG9yIERpcmVjdGlvbiBjb3VsZG4ndCBiZSBjb252ZXJ0ZWQgdG8gYSBCVkhWZWN0b3IzLlwiKTtcblx0XHR9XG5cdFx0Y29uc3Qgbm9kZXNUb0ludGVyc2VjdDpCVkhOb2RlW10gPSBbdGhpcy5yb290Tm9kZV07XG5cdFx0Y29uc3QgdHJpYW5nbGVzSW5JbnRlcnNlY3RpbmdOb2RlczpudW1iZXJbXSA9IFtdOyAvLyBhIGxpc3Qgb2Ygbm9kZXMgdGhhdCBpbnRlcnNlY3QgdGhlIHJheSAoYWNjb3JkaW5nIHRvIHRoZWlyIGJvdW5kaW5nIGJveClcblx0XHRjb25zdCBpbnRlcnNlY3RpbmdUcmlhbmdsZXM6b2JqZWN0W10gPSBbXTtcblxuXHRcdGNvbnN0IGludlJheURpcmVjdGlvbiA9IG5ldyBCVkhWZWN0b3IzKFxuXHRcdFx0MS4wIC8gcmF5RGlyZWN0aW9uLngsXG5cdFx0XHQxLjAgLyByYXlEaXJlY3Rpb24ueSxcblx0XHRcdDEuMCAvIHJheURpcmVjdGlvbi56XG5cdFx0KTtcblxuXHRcdC8vIGdvIG92ZXIgdGhlIEJWSCB0cmVlLCBhbmQgZXh0cmFjdCB0aGUgbGlzdCBvZiB0cmlhbmdsZXMgdGhhdCBsaWUgaW4gbm9kZXMgdGhhdCBpbnRlcnNlY3QgdGhlIHJheS5cblx0XHQvLyBub3RlOiB0aGVzZSB0cmlhbmdsZXMgbWF5IG5vdCBpbnRlcnNlY3QgdGhlIHJheSB0aGVtc2VsdmVzXG5cdFx0d2hpbGUobm9kZXNUb0ludGVyc2VjdC5sZW5ndGggPiAwKSB7XG5cdFx0XHRjb25zdCBub2RlOkJWSE5vZGUgfCB1bmRlZmluZWQgPSBub2Rlc1RvSW50ZXJzZWN0LnBvcCgpO1xuXHRcdFx0aWYoIW5vZGUpIGNvbnRpbnVlO1xuXHRcdFx0aWYoQlZILmludGVyc2VjdE5vZGVCb3gocmF5T3JpZ2luLCBpbnZSYXlEaXJlY3Rpb24sIG5vZGUpKSB7XG5cdFx0XHRcdGlmKG5vZGUubm9kZTApIHtcblx0XHRcdFx0XHRub2Rlc1RvSW50ZXJzZWN0LnB1c2gobm9kZS5ub2RlMCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobm9kZS5ub2RlMSkge1xuXHRcdFx0XHRcdG5vZGVzVG9JbnRlcnNlY3QucHVzaChub2RlLm5vZGUxKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IobGV0IGkgPSBub2RlLnN0YXJ0SW5kZXg7IGkgPCBub2RlLmVuZEluZGV4OyBpKyspIHtcblx0XHRcdFx0XHR0cmlhbmdsZXNJbkludGVyc2VjdGluZ05vZGVzLnB1c2godGhpcy5iYm94QXJyYXlbaSo3XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBnbyBvdmVyIHRoZSBsaXN0IG9mIGNhbmRpZGF0ZSB0cmlhbmdsZXMsIGFuZCBjaGVjayBlYWNoIG9mIHRoZW0gdXNpbmcgcmF5IHRyaWFuZ2xlIGludGVyc2VjdGlvblxuXHRcdGxldCBhOkJWSFZlY3RvcjMgPSBuZXcgQlZIVmVjdG9yMygpO1xuXHRcdGxldCBiOkJWSFZlY3RvcjMgPSBuZXcgQlZIVmVjdG9yMygpO1xuXHRcdGxldCBjOkJWSFZlY3RvcjMgPSBuZXcgQlZIVmVjdG9yMygpO1xuXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IHRyaWFuZ2xlc0luSW50ZXJzZWN0aW5nTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IHRyaUluZGV4ID0gdHJpYW5nbGVzSW5JbnRlcnNlY3RpbmdOb2Rlc1tpXTtcblxuXHRcdFx0YS5zZXRGcm9tQXJyYXkodGhpcy50cmlhbmdsZXNBcnJheSwgdHJpSW5kZXgqOSk7XG5cdFx0XHRiLnNldEZyb21BcnJheSh0aGlzLnRyaWFuZ2xlc0FycmF5LCB0cmlJbmRleCo5KzMpO1xuXHRcdFx0Yy5zZXRGcm9tQXJyYXkodGhpcy50cmlhbmdsZXNBcnJheSwgdHJpSW5kZXgqOSs2KTtcblxuXHRcdFx0Y29uc3QgaW50ZXJzZWN0aW9uUG9pbnQgPSBCVkguaW50ZXJzZWN0UmF5VHJpYW5nbGUoYSwgYiwgYywgcmF5T3JpZ2luLCByYXlEaXJlY3Rpb24sIGJhY2tmYWNlQ3VsbGluZyk7XG5cblx0XHRcdGlmKCFpbnRlcnNlY3Rpb25Qb2ludCkgY29udGludWU7XG5cdFx0XHRpbnRlcnNlY3RpbmdUcmlhbmdsZXMucHVzaCh7XG5cdFx0XHRcdC8vdHJpYW5nbGU6IFthLmNsb25lKCksIGIuY2xvbmUoKSwgYy5jbG9uZSgpXSxcblx0XHRcdFx0dHJpYW5nbGVJbmRleDogdHJpSW5kZXgsXG5cdFx0XHRcdGludGVyc2VjdGlvblBvaW50OiBpbnRlcnNlY3Rpb25Qb2ludCxcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBpbnRlcnNlY3RpbmdUcmlhbmdsZXM7XG5cdH1cblx0c3RhdGljIGNhbGNUVmFsdWVzKG1pblZhbDpudW1iZXIsIG1heFZhbDpudW1iZXIsIHJheU9yaWdpbkNvb3JkOm51bWJlciwgaW52ZGlyOiBudW1iZXIpOm51bWJlcltdIHtcblx0XHRpZihpbnZkaXIgPj0gMCkge1xuXHRcdFx0cmV0dXJuIFsobWluVmFsIC0gcmF5T3JpZ2luQ29vcmQpICogaW52ZGlyLCAobWF4VmFsIC0gcmF5T3JpZ2luQ29vcmQpICogaW52ZGlyXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIFsobWF4VmFsIC0gcmF5T3JpZ2luQ29vcmQpICogaW52ZGlyLCAobWluVmFsIC0gcmF5T3JpZ2luQ29vcmQpICogaW52ZGlyXTtcblx0XHR9XG5cdH1cblxuXHRzdGF0aWMgaW50ZXJzZWN0Tm9kZUJveChyYXlPcmlnaW46IEJWSFZlY3RvcjMsIGludlJheURpcmVjdGlvbjogQlZIVmVjdG9yMywgbm9kZTogQlZITm9kZSk6Ym9vbGVhbiB7XG5cdFx0bGV0IFt0bWluLCB0bWF4XTpudW1iZXJbXSA9IEJWSC5jYWxjVFZhbHVlcyhub2RlLmV4dGVudHNNaW5bMF0sIG5vZGUuZXh0ZW50c01heFswXSwgcmF5T3JpZ2luLngsIGludlJheURpcmVjdGlvbi54KTtcblx0XHRsZXQgW3R5bWluLCB0eW1heF06bnVtYmVyW10gPSBCVkguY2FsY1RWYWx1ZXMobm9kZS5leHRlbnRzTWluWzFdLCBub2RlLmV4dGVudHNNYXhbMV0sIHJheU9yaWdpbi55LCBpbnZSYXlEaXJlY3Rpb24ueSk7XG5cblx0XHRpZih0bWluID4gdHltYXggfHwgdHltaW4gPiB0bWF4KSByZXR1cm4gZmFsc2U7XG5cblx0XHQvLyBUaGVzZSBsaW5lcyBhbHNvIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSB0bWluIG9yIHRtYXggaXMgTmFOXG5cdFx0Ly8gKHJlc3VsdCBvZiAwICogSW5maW5pdHkpLiB4ICE9PSB4IHJldHVybnMgdHJ1ZSBpZiB4IGlzIE5hTlxuXHRcdGlmKHR5bWluID4gdG1pbiB8fCB0bWluICE9PSB0bWluKSB7XG5cdFx0XHR0bWluID0gdHltaW47XG5cdFx0fVxuXG5cdFx0aWYodHltYXggPCB0bWF4IHx8IHRtYXggIT09IHRtYXgpIHtcblx0XHRcdHRtYXggPSB0eW1heDtcblx0XHR9XG5cblx0XHRsZXQgW3R6bWluLCB0em1heF06bnVtYmVyW10gPSBCVkguY2FsY1RWYWx1ZXMobm9kZS5leHRlbnRzTWluWzJdLCBub2RlLmV4dGVudHNNYXhbMl0sIHJheU9yaWdpbi56LCBpbnZSYXlEaXJlY3Rpb24ueik7XG5cblx0XHRpZih0bWluID4gdHptYXggfHwgdHptaW4gPiB0bWF4KSByZXR1cm4gZmFsc2U7XG5cblx0XHRpZih0em1heCA8IHRtYXggfHwgdG1heCAhPT0gdG1heCkge1xuXHRcdFx0dG1heCA9IHR6bWF4O1xuXHRcdH1cblxuXHRcdC8vcmV0dXJuIHBvaW50IGNsb3Nlc3QgdG8gdGhlIHJheSAocG9zaXRpdmUgc2lkZSlcblx0XHRpZih0bWF4IDwgMCkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRzdGF0aWMgaW50ZXJzZWN0UmF5VHJpYW5nbGUoYTpCVkhWZWN0b3IzLCBiOkJWSFZlY3RvcjMsIGM6QlZIVmVjdG9yMywgcmF5T3JpZ2luOkJWSFZlY3RvcjMsIHJheURpcmVjdGlvbjpCVkhWZWN0b3IzLCBiYWNrZmFjZUN1bGxpbmc6Ym9vbGVhbik6QlZIVmVjdG9yMyB8IG51bGwge1xuXHRcdGxldCBkaWZmOkJWSFZlY3RvcjMgPSBuZXcgQlZIVmVjdG9yMygpO1xuXHRcdGxldCBlZGdlMTpCVkhWZWN0b3IzID0gbmV3IEJWSFZlY3RvcjMoKTtcblx0XHRsZXQgZWRnZTI6QlZIVmVjdG9yMyA9IG5ldyBCVkhWZWN0b3IzKCk7XG5cdFx0bGV0IG5vcm1hbDpCVkhWZWN0b3IzID0gbmV3IEJWSFZlY3RvcjMoKTtcblxuXHRcdC8vIGZyb20gaHR0cDovL3d3dy5nZW9tZXRyaWN0b29scy5jb20vTGliTWF0aGVtYXRpY3MvSW50ZXJzZWN0aW9uL1dtNUludHJSYXkzVHJpYW5nbGUzLmNwcFxuXHRcdGVkZ2UxLnN1YlZlY3RvcnMoYiwgYSk7XG5cdFx0ZWRnZTIuc3ViVmVjdG9ycyhjLCBhKTtcblx0XHRub3JtYWwuY3Jvc3NWZWN0b3JzKGVkZ2UxLCBlZGdlMik7XG5cblx0XHQvLyBTb2x2ZSBRICsgdCpEID0gYjEqRTEgKyBiTCpFMiAoUSA9IGtEaWZmLCBEID0gcmF5IGRpcmVjdGlvbixcblx0XHQvLyBFMSA9IGtFZGdlMSwgRTIgPSBrRWRnZTIsIE4gPSBDcm9zcyhFMSxFMikpIGJ5XG5cdFx0Ly8gICB8RG90KEQsTil8KmIxID0gc2lnbihEb3QoRCxOKSkqRG90KEQsQ3Jvc3MoUSxFMikpXG5cdFx0Ly8gICB8RG90KEQsTil8KmIyID0gc2lnbihEb3QoRCxOKSkqRG90KEQsQ3Jvc3MoRTEsUSkpXG5cdFx0Ly8gICB8RG90KEQsTil8KnQgPSAtc2lnbihEb3QoRCxOKSkqRG90KFEsTilcblx0XHRsZXQgRGROOm51bWJlciA9IHJheURpcmVjdGlvbi5kb3Qobm9ybWFsKTtcblx0XHRpZihEZE4gPT09IDApIHJldHVybiBudWxsO1xuXHRcdGlmKERkTiA+IDAgJiYgYmFja2ZhY2VDdWxsaW5nKSByZXR1cm4gbnVsbDtcblx0XHRsZXQgc2lnbjpudW1iZXIgPSBNYXRoLnNpZ24oRGROKTtcblx0XHREZE4gKj0gc2lnbjtcblxuXHRcdGRpZmYuc3ViVmVjdG9ycyhyYXlPcmlnaW4sIGEpO1xuXHRcdGNvbnN0IERkUXhFMiA9IHNpZ24gKiByYXlEaXJlY3Rpb24uZG90KGVkZ2UyLmNyb3NzVmVjdG9ycyhkaWZmLCBlZGdlMikpO1xuXG5cdFx0Ly8gYjEgPCAwLCBubyBpbnRlcnNlY3Rpb25cblx0XHRpZihEZFF4RTIgPCAwKSByZXR1cm4gbnVsbDtcblxuXHRcdGNvbnN0IERkRTF4USA9IHNpZ24gKiByYXlEaXJlY3Rpb24uZG90KGVkZ2UxLmNyb3NzKGRpZmYpKTtcblxuXHRcdC8vIGIyIDwgMCwgbm8gaW50ZXJzZWN0aW9uXG5cdFx0aWYoRGRFMXhRIDwgMCkgcmV0dXJuIG51bGw7XG5cblx0XHQvLyBiMStiMiA+IDEsIG5vIGludGVyc2VjdGlvblxuXHRcdGlmKERkUXhFMiArIERkRTF4USA+IERkTikgcmV0dXJuIG51bGw7XG5cblx0XHQvLyBMaW5lIGludGVyc2VjdHMgdHJpYW5nbGUsIGNoZWNrIGlmIHJheSBkb2VzLlxuXHRcdGNvbnN0IFFkTjpudW1iZXIgPSAtc2lnbiAqIGRpZmYuZG90KG5vcm1hbCk7XG5cblx0XHQvLyB0IDwgMCwgbm8gaW50ZXJzZWN0aW9uXG5cdFx0aWYoUWROIDwgMCkgcmV0dXJuIG51bGw7XG5cblx0XHQvLyBSYXkgaW50ZXJzZWN0cyB0cmlhbmdsZS5cblx0XHRyZXR1cm4gcmF5RGlyZWN0aW9uLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoUWROIC8gRGROKS5hZGQocmF5T3JpZ2luKTtcblx0fVxufVxuIiwiaW1wb3J0IHsgVmVjdG9yLCBYWVosIFdvcmtQcm9ncmVzcywgQlZIUHJvZ3Jlc3MsIEFzeW5jaWZ5UGFyYW1zIH0gZnJvbSBcIi4vXCI7XG5cbmNvbnN0IEVQU0lMT04gPSAxZS02O1xuXG5pbXBvcnQgeyBCVkhOb2RlIH0gZnJvbSBcIi4vQlZITm9kZVwiO1xuaW1wb3J0IHsgQlZIIH0gZnJvbSBcIi4vQlZIXCI7XG5pbXBvcnQgeyBhc3luY1dvcmsgfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgZnVuY3Rpb24gQlZIQnVpbGRlcih0cmlhbmdsZXM6dW5rbm93biB8IFZlY3RvcltdW10gfCBudW1iZXJbXSB8IEZsb2F0MzJBcnJheSwgbWF4VHJpYW5nbGVzUGVyTm9kZTpudW1iZXIgPSAxMCkge1xuXHR2YWxpZGF0ZU1heFRyaWFuZ2xlc1Blck5vZGUobWF4VHJpYW5nbGVzUGVyTm9kZSk7XG5cdGxldCB0cmlhbmdsZXNBcnJheTpGbG9hdDMyQXJyYXkgPSB2YWxpZGF0ZVRyaWFuZ2xlcyh0cmlhbmdsZXMpO1xuXHRsZXQgYmJveEFycmF5OkZsb2F0MzJBcnJheSA9IGNhbGNCb3VuZGluZ0JveGVzKHRyaWFuZ2xlc0FycmF5KTtcblx0Ly8gY2xvbmUgYSBoZWxwZXIgYXJyYXlcblx0bGV0IGJib3hIZWxwZXI6RmxvYXQzMkFycmF5ID0gbmV3IEZsb2F0MzJBcnJheShiYm94QXJyYXkubGVuZ3RoKTtcblx0YmJveEhlbHBlci5zZXQoYmJveEFycmF5KTtcblxuXHQvLyBjcmVhdGUgdGhlIHJvb3Qgbm9kZSwgYWRkIGFsbCB0aGUgdHJpYW5nbGVzIHRvIGl0XG5cdGNvbnN0IHRyaWFuZ2xlQ291bnQ6bnVtYmVyID0gdHJpYW5nbGVzQXJyYXkubGVuZ3RoIC8gOTtcblx0Y29uc3QgZXh0ZW50czpYWVpbXSA9IGNhbGNFeHRlbnRzKGJib3hBcnJheSwgMCwgdHJpYW5nbGVDb3VudCwgRVBTSUxPTik7XG5cdGxldCByb290Tm9kZTpCVkhOb2RlID0gbmV3IEJWSE5vZGUoZXh0ZW50c1swXSwgZXh0ZW50c1sxXSwgMCwgdHJpYW5nbGVDb3VudCwgMCk7XG5cdGxldCBub2Rlc1RvU3BsaXQ6QlZITm9kZVtdID0gW3Jvb3ROb2RlXTtcblx0bGV0IG5vZGU6QlZITm9kZSB8IHVuZGVmaW5lZDtcblxuXHR3aGlsZShub2RlID0gbm9kZXNUb1NwbGl0LnBvcCgpKSB7XG5cdFx0bGV0IG5vZGVzID0gc3BsaXROb2RlKG5vZGUsIG1heFRyaWFuZ2xlc1Blck5vZGUsIGJib3hBcnJheSwgYmJveEhlbHBlcik7XG5cdFx0bm9kZXNUb1NwbGl0LnB1c2goLi4ubm9kZXMpO1xuXHR9XG5cdFxuXHRyZXR1cm4gbmV3IEJWSChyb290Tm9kZSwgYmJveEFycmF5LCB0cmlhbmdsZXNBcnJheSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBCVkhCdWlsZGVyQXN5bmModHJpYW5nbGVzOnVua25vd24gfCBWZWN0b3JbXVtdIHwgbnVtYmVyW10gfCBGbG9hdDMyQXJyYXksIG1heFRyaWFuZ2xlc1Blck5vZGU6bnVtYmVyID0gMTAsIGFzeW5jUGFyYW1zOkFzeW5jaWZ5UGFyYW1zID0ge30sIHByb2dyZXNzQ2FsbGJhY2s/OihvYmo6QlZIUHJvZ3Jlc3MpID0+IHZvaWQpOlByb21pc2U8QlZIPiB7XG5cdHZhbGlkYXRlTWF4VHJpYW5nbGVzUGVyTm9kZShtYXhUcmlhbmdsZXNQZXJOb2RlKTtcblx0bGV0IHRyaWFuZ2xlc0FycmF5OkZsb2F0MzJBcnJheSA9IHZhbGlkYXRlVHJpYW5nbGVzKHRyaWFuZ2xlcyk7XG5cdGxldCBiYm94QXJyYXk6RmxvYXQzMkFycmF5ID0gY2FsY0JvdW5kaW5nQm94ZXModHJpYW5nbGVzQXJyYXkpO1xuXHQvLyBjbG9uZSBhIGhlbHBlciBhcnJheVxuXHRsZXQgYmJveEhlbHBlcjpGbG9hdDMyQXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KGJib3hBcnJheS5sZW5ndGgpO1xuXHRiYm94SGVscGVyLnNldChiYm94QXJyYXkpO1xuXG5cdC8vIGNyZWF0ZSB0aGUgcm9vdCBub2RlLCBhZGQgYWxsIHRoZSB0cmlhbmdsZXMgdG8gaXRcblx0Y29uc3QgdHJpYW5nbGVDb3VudDpudW1iZXIgPSB0cmlhbmdsZXNBcnJheS5sZW5ndGggLyA5O1xuXHRjb25zdCBleHRlbnRzOlhZWltdID0gY2FsY0V4dGVudHMoYmJveEFycmF5LCAwLCB0cmlhbmdsZUNvdW50LCBFUFNJTE9OKTtcblx0bGV0IHJvb3ROb2RlOkJWSE5vZGUgPSBuZXcgQlZITm9kZShleHRlbnRzWzBdLCBleHRlbnRzWzFdLCAwLCB0cmlhbmdsZUNvdW50LCAwKTtcblx0bGV0IG5vZGVzVG9TcGxpdDpCVkhOb2RlW10gPSBbcm9vdE5vZGVdO1xuXHRsZXQgbm9kZTpCVkhOb2RlIHwgdW5kZWZpbmVkO1xuXG5cdGxldCB0YWxseSA9IDA7XG5cdGF3YWl0IGFzeW5jV29yaygoKSA9PiB7XG5cdFx0bm9kZSA9IG5vZGVzVG9TcGxpdC5wb3AoKTtcblx0XHRyZXR1cm4gdGFsbHkgKiA5IC8gdHJpYW5nbGVzQXJyYXkubGVuZ3RoO1xuXHR9LCAoKSA9PiB7XG5cdFx0aWYoIW5vZGUpIHJldHVybjtcblx0XHRsZXQgbm9kZXMgPSBzcGxpdE5vZGUobm9kZSwgbWF4VHJpYW5nbGVzUGVyTm9kZSwgYmJveEFycmF5LCBiYm94SGVscGVyKTtcblx0XHRpZighbm9kZXMubGVuZ3RoKSB0YWxseSArPSBub2RlLmVsZW1lbnRDb3VudCgpO1xuXHRcdG5vZGVzVG9TcGxpdC5wdXNoKC4uLm5vZGVzKTtcblx0fSwgYXN5bmNQYXJhbXMsIHByb2dyZXNzQ2FsbGJhY2sgP1xuXHRcdChub2Rlc1NwbGl0OldvcmtQcm9ncmVzcykgPT4gcHJvZ3Jlc3NDYWxsYmFjayhPYmplY3QuYXNzaWduKHt0cmlhbmdsZXNMZWFmZWQ6IHRhbGx5fSwgbm9kZXNTcGxpdCkpXG5cdFx0OiB1bmRlZmluZWRcblx0KTtcblx0cmV0dXJuIG5ldyBCVkgocm9vdE5vZGUsIGJib3hBcnJheSwgdHJpYW5nbGVzQXJyYXkpO1xufVxuXG5mdW5jdGlvbiBzcGxpdE5vZGUobm9kZTogQlZITm9kZSwgbWF4VHJpYW5nbGVzOm51bWJlciwgYmJveEFycmF5OkZsb2F0MzJBcnJheSwgYmJveEhlbHBlcjpGbG9hdDMyQXJyYXkpOkJWSE5vZGVbXSB7XG5cdGNvbnN0IG5vZGVDb3VudDpudW1iZXIgPSBub2RlLmVsZW1lbnRDb3VudCgpXG5cdGlmIChub2RlQ291bnQgPD0gbWF4VHJpYW5nbGVzIHx8IG5vZGVDb3VudCA9PT0gMCkgcmV0dXJuIFtdO1xuXG5cdGxldCBzdGFydEluZGV4Om51bWJlciA9IG5vZGUuc3RhcnRJbmRleDtcblx0bGV0IGVuZEluZGV4Om51bWJlciA9IG5vZGUuZW5kSW5kZXg7XG5cblx0bGV0IGxlZnROb2RlOm51bWJlcltdW10gPSBbIFtdLFtdLFtdIF07XG5cdGxldCByaWdodE5vZGU6bnVtYmVyW11bXSA9IFsgW10sW10sW10gXTtcblx0bGV0IGV4dGVudENlbnRlcnM6bnVtYmVyW10gPSBbbm9kZS5jZW50ZXJYKCksIG5vZGUuY2VudGVyWSgpLCBub2RlLmNlbnRlclooKV07XG5cblx0Zm9yIChsZXQgaSA9IHN0YXJ0SW5kZXg7IGkgPCBlbmRJbmRleDsgaSsrKSB7XG5cdFx0bGV0IGlkeCA9IGkgKiA3ICsgMTtcblx0XHRmb3IgKGxldCBqID0gMDsgaiA8IDM7IGorKykge1xuXHRcdFx0aWYgKGJib3hBcnJheVtpZHhdICsgYmJveEFycmF5W2lkeCsrICsgM10gPCBleHRlbnRDZW50ZXJzW2pdKSB7XG5cdFx0XHRcdGxlZnROb2RlW2pdLnB1c2goaSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyaWdodE5vZGVbal0ucHVzaChpKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBjaGVjayBpZiB3ZSBjb3VsZG4ndCBzcGxpdCB0aGUgbm9kZSBieSBhbnkgb2YgdGhlIGF4ZXMgKHgsIHkgb3IgeikuIGhhbHQgaGVyZSwgZG9udCB0cnkgdG8gc3BsaXQgYW55IG1vcmUgKGNhdXNlIGl0IHdpbGwgYWx3YXlzIGZhaWwsIGFuZCB3ZSdsbCBlbnRlciBhbiBpbmZpbml0ZSBsb29wXG5cdGxldCBzcGxpdEZhaWxlZDpib29sZWFuW10gPSBbXTtcblx0c3BsaXRGYWlsZWQubGVuZ3RoID0gMztcblxuXHRzcGxpdEZhaWxlZFswXSA9IChsZWZ0Tm9kZVswXS5sZW5ndGggPT09IDApIHx8IChyaWdodE5vZGVbMF0ubGVuZ3RoID09PSAwKTtcblx0c3BsaXRGYWlsZWRbMV0gPSAobGVmdE5vZGVbMV0ubGVuZ3RoID09PSAwKSB8fCAocmlnaHROb2RlWzFdLmxlbmd0aCA9PT0gMCk7XG5cdHNwbGl0RmFpbGVkWzJdID0gKGxlZnROb2RlWzJdLmxlbmd0aCA9PT0gMCkgfHwgKHJpZ2h0Tm9kZVsyXS5sZW5ndGggPT09IDApO1xuXG5cdGlmIChzcGxpdEZhaWxlZFswXSAmJiBzcGxpdEZhaWxlZFsxXSAmJiBzcGxpdEZhaWxlZFsyXSkgcmV0dXJuIFtdO1xuXG5cdC8vIGNob29zZSB0aGUgbG9uZ2VzdCBzcGxpdCBheGlzLiBpZiB3ZSBjYW4ndCBzcGxpdCBieSBpdCwgY2hvb3NlIG5leHQgYmVzdCBvbmUuXG5cdGxldCBzcGxpdE9yZGVyID0gWzAsIDEsIDJdO1xuXG5cdGNvbnN0IGV4dGVudHNMZW5ndGggPSBbXG5cdFx0bm9kZS5leHRlbnRzTWF4WzBdIC0gbm9kZS5leHRlbnRzTWluWzBdLFxuXHRcdG5vZGUuZXh0ZW50c01heFsxXSAtIG5vZGUuZXh0ZW50c01pblsxXSxcblx0XHRub2RlLmV4dGVudHNNYXhbMl0gLSBub2RlLmV4dGVudHNNaW5bMl0sXG5cdF07XG5cblx0c3BsaXRPcmRlci5zb3J0KChheGlzMCwgYXhpczEpID0+IGV4dGVudHNMZW5ndGhbYXhpczFdIC0gZXh0ZW50c0xlbmd0aFtheGlzMF0pO1xuXG5cdGxldCBsZWZ0RWxlbWVudHM6bnVtYmVyW10gfCB1bmRlZmluZWQgPSBbXTtcblx0bGV0IHJpZ2h0RWxlbWVudHM6bnVtYmVyW10gfCB1bmRlZmluZWQgPSBbXTtcblxuXHRmb3IgKGxldCBqID0gMDsgaiA8IDM7IGorKykge1xuXHRcdGNvbnN0IGNhbmRpZGF0ZUluZGV4ID0gc3BsaXRPcmRlcltqXTtcblx0XHRpZiAoIXNwbGl0RmFpbGVkW2NhbmRpZGF0ZUluZGV4XSkge1xuXHRcdFx0bGVmdEVsZW1lbnRzID0gbGVmdE5vZGVbY2FuZGlkYXRlSW5kZXhdO1xuXHRcdFx0cmlnaHRFbGVtZW50cyA9IHJpZ2h0Tm9kZVtjYW5kaWRhdGVJbmRleF07XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblxuXG5cdC8vIHNvcnQgdGhlIGVsZW1lbnRzIGluIHJhbmdlIChzdGFydEluZGV4LCBlbmRJbmRleCkgYWNjb3JkaW5nIHRvIHdoaWNoIG5vZGUgdGhleSBzaG91bGQgYmUgYXRcblx0Y29uc3Qgbm9kZTBFbmQgPSBzdGFydEluZGV4ICsgbGVmdEVsZW1lbnRzLmxlbmd0aDtcblx0XG5cdGNvcHlCb3hlcyhsZWZ0RWxlbWVudHMsIHJpZ2h0RWxlbWVudHMsIG5vZGUuc3RhcnRJbmRleCwgYmJveEFycmF5LCBiYm94SGVscGVyKTtcblxuXHQvLyBjb3B5IHJlc3VsdHMgYmFjayB0byBtYWluIGFycmF5XG5cdGNvbnN0IHN1YkFyciA9IGJib3hIZWxwZXIuc3ViYXJyYXkobm9kZS5zdGFydEluZGV4ICogNywgbm9kZS5lbmRJbmRleCAqIDcpO1xuXHRiYm94QXJyYXkuc2V0KHN1YkFyciwgbm9kZS5zdGFydEluZGV4ICogNyk7XG5cblx0Ly8gY3JlYXRlIDIgbmV3IG5vZGVzIGZvciB0aGUgbm9kZSB3ZSBqdXN0IHNwbGl0LCBhbmQgYWRkIGxpbmtzIHRvIHRoZW0gZnJvbSB0aGUgcGFyZW50IG5vZGVcblx0Y29uc3Qgbm9kZTBFeHRlbnRzID0gY2FsY0V4dGVudHMoYmJveEFycmF5LCBzdGFydEluZGV4LCBub2RlMEVuZCwgRVBTSUxPTik7XG5cdGNvbnN0IG5vZGUxRXh0ZW50cyA9IGNhbGNFeHRlbnRzKGJib3hBcnJheSwgbm9kZTBFbmQsIGVuZEluZGV4LCBFUFNJTE9OKTtcblxuXHRjb25zdCBub2RlMCA9IG5ldyBCVkhOb2RlKG5vZGUwRXh0ZW50c1swXSwgbm9kZTBFeHRlbnRzWzFdLCBzdGFydEluZGV4LCBub2RlMEVuZCwgbm9kZS5sZXZlbCArIDEpO1xuXHRjb25zdCBub2RlMSA9IG5ldyBCVkhOb2RlKG5vZGUxRXh0ZW50c1swXSwgbm9kZTFFeHRlbnRzWzFdLCBub2RlMEVuZCwgZW5kSW5kZXgsIG5vZGUubGV2ZWwgKyAxKTtcblxuXHRub2RlLm5vZGUwID0gbm9kZTA7XG5cdG5vZGUubm9kZTEgPSBub2RlMTtcblx0bm9kZS5jbGVhclNoYXBlcygpO1xuXG5cdC8vIGFkZCBuZXcgbm9kZXMgdG8gdGhlIHNwbGl0IHF1ZXVlXG5cdHJldHVybiBbbm9kZTAsIG5vZGUxXTtcbn1cblxuZnVuY3Rpb24gY29weUJveGVzKGxlZnRFbGVtZW50czpudW1iZXJbXSwgcmlnaHRFbGVtZW50czpudW1iZXJbXSwgc3RhcnRJbmRleDpudW1iZXIsIGJib3hBcnJheTpGbG9hdDMyQXJyYXksIGJib3hIZWxwZXI6RmxvYXQzMkFycmF5KSB7XG5cdGNvbnN0IGNvbmNhdGVuYXRlZEVsZW1lbnRzID0gbGVmdEVsZW1lbnRzLmNvbmNhdChyaWdodEVsZW1lbnRzKTtcblx0bGV0IGhlbHBlclBvcyA9IHN0YXJ0SW5kZXg7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgY29uY2F0ZW5hdGVkRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgY3VyckVsZW1lbnQgPSBjb25jYXRlbmF0ZWRFbGVtZW50c1tpXTtcblx0XHRjb3B5Qm94KGJib3hBcnJheSwgY3VyckVsZW1lbnQsIGJib3hIZWxwZXIsIGhlbHBlclBvcyk7XG5cdFx0aGVscGVyUG9zKys7XG5cdH1cbn1cblxuZnVuY3Rpb24gY2FsY0V4dGVudHMoYmJveEFycmF5OkZsb2F0MzJBcnJheSwgc3RhcnRJbmRleDpudW1iZXIsIGVuZEluZGV4Om51bWJlciwgZXhwYW5kQnk6IG51bWJlciA9IDAuMCk6WFlaW10ge1xuXHRpZiAoc3RhcnRJbmRleCA+PSBlbmRJbmRleCkgcmV0dXJuIFtbMCwgMCwgMF0sIFswLCAwLCAwXV07XG5cdGxldCBtaW5YID0gSW5maW5pdHk7XG5cdGxldCBtaW5ZID0gSW5maW5pdHk7XG5cdGxldCBtaW5aID0gSW5maW5pdHk7XG5cdGxldCBtYXhYID0gLUluZmluaXR5O1xuXHRsZXQgbWF4WSA9IC1JbmZpbml0eTtcblx0bGV0IG1heFogPSAtSW5maW5pdHk7XG5cdGZvciAobGV0IGkgPSBzdGFydEluZGV4OyBpIDwgZW5kSW5kZXg7IGkrKykge1xuXHRcdGxldCBpZHggPSBpICogNyArIDE7XG5cdFx0bWluWCA9IE1hdGgubWluKGJib3hBcnJheVtpZHgrK10sIG1pblgpO1xuXHRcdG1pblkgPSBNYXRoLm1pbihiYm94QXJyYXlbaWR4KytdLCBtaW5ZKTtcblx0XHRtaW5aID0gTWF0aC5taW4oYmJveEFycmF5W2lkeCsrXSwgbWluWik7XG5cdFx0bWF4WCA9IE1hdGgubWF4KGJib3hBcnJheVtpZHgrK10sIG1heFgpO1xuXHRcdG1heFkgPSBNYXRoLm1heChiYm94QXJyYXlbaWR4KytdLCBtYXhZKTtcblx0XHRtYXhaID0gTWF0aC5tYXgoYmJveEFycmF5W2lkeF0sIG1heFopO1xuXHR9XG5cdHJldHVybiBbXG5cdFx0W21pblggLSBleHBhbmRCeSwgbWluWSAtIGV4cGFuZEJ5LCBtaW5aIC0gZXhwYW5kQnldLFxuXHRcdFttYXhYICsgZXhwYW5kQnksIG1heFkgKyBleHBhbmRCeSwgbWF4WiArIGV4cGFuZEJ5XSxcblx0XTtcbn1cblxuZnVuY3Rpb24gY2FsY0JvdW5kaW5nQm94ZXModHJpYW5nbGVzQXJyYXk6IEZsb2F0MzJBcnJheSk6RmxvYXQzMkFycmF5IHtcblx0Y29uc3QgdHJpYW5nbGVDb3VudDpudW1iZXIgPSB0cmlhbmdsZXNBcnJheS5sZW5ndGggLyA5O1xuXHRjb25zdCBiYm94QXJyYXk6RmxvYXQzMkFycmF5ID0gbmV3IEZsb2F0MzJBcnJheSh0cmlhbmdsZUNvdW50ICogNyk7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0cmlhbmdsZUNvdW50OyBpKyspIHtcblx0XHRsZXQgaWR4ID0gaSAqIDk7XG5cdFx0Y29uc3QgcDB4ID0gdHJpYW5nbGVzQXJyYXlbaWR4KytdO1xuXHRcdGNvbnN0IHAweSA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcblx0XHRjb25zdCBwMHogPSB0cmlhbmdsZXNBcnJheVtpZHgrK107XG5cdFx0Y29uc3QgcDF4ID0gdHJpYW5nbGVzQXJyYXlbaWR4KytdO1xuXHRcdGNvbnN0IHAxeSA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcblx0XHRjb25zdCBwMXogPSB0cmlhbmdsZXNBcnJheVtpZHgrK107XG5cdFx0Y29uc3QgcDJ4ID0gdHJpYW5nbGVzQXJyYXlbaWR4KytdO1xuXHRcdGNvbnN0IHAyeSA9IHRyaWFuZ2xlc0FycmF5W2lkeCsrXTtcblx0XHRjb25zdCBwMnogPSB0cmlhbmdsZXNBcnJheVtpZHhdO1xuXG5cdFx0Y29uc3QgbWluWCA9IE1hdGgubWluKHAweCwgcDF4LCBwMngpO1xuXHRcdGNvbnN0IG1pblkgPSBNYXRoLm1pbihwMHksIHAxeSwgcDJ5KTtcblx0XHRjb25zdCBtaW5aID0gTWF0aC5taW4ocDB6LCBwMXosIHAyeik7XG5cdFx0Y29uc3QgbWF4WCA9IE1hdGgubWF4KHAweCwgcDF4LCBwMngpO1xuXHRcdGNvbnN0IG1heFkgPSBNYXRoLm1heChwMHksIHAxeSwgcDJ5KTtcblx0XHRjb25zdCBtYXhaID0gTWF0aC5tYXgocDB6LCBwMXosIHAyeik7XG5cdFx0c2V0Qm94KGJib3hBcnJheSwgaSwgaSwgbWluWCwgbWluWSwgbWluWiwgbWF4WCwgbWF4WSwgbWF4Wik7XG5cdH1cblxuXHRyZXR1cm4gYmJveEFycmF5O1xufVxuXG5mdW5jdGlvbiBidWlsZFRyaWFuZ2xlQXJyYXkodHJpYW5nbGVzOlZlY3RvcltdW10pOkZsb2F0MzJBcnJheSB7XG5cdGNvbnN0IHRyaWFuZ2xlc0FycmF5ID0gbmV3IEZsb2F0MzJBcnJheSh0cmlhbmdsZXMubGVuZ3RoICogOSk7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0cmlhbmdsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBwMCA9IHRyaWFuZ2xlc1tpXVswXTtcblx0XHRjb25zdCBwMSA9IHRyaWFuZ2xlc1tpXVsxXTtcblx0XHRjb25zdCBwMiA9IHRyaWFuZ2xlc1tpXVsyXTtcblx0XHRsZXQgaWR4ID0gaSAqIDk7XG5cdFx0dHJpYW5nbGVzQXJyYXlbaWR4KytdID0gcDAueDtcblx0XHR0cmlhbmdsZXNBcnJheVtpZHgrK10gPSBwMC55O1xuXHRcdHRyaWFuZ2xlc0FycmF5W2lkeCsrXSA9IHAwLno7XG5cblx0XHR0cmlhbmdsZXNBcnJheVtpZHgrK10gPSBwMS54O1xuXHRcdHRyaWFuZ2xlc0FycmF5W2lkeCsrXSA9IHAxLnk7XG5cdFx0dHJpYW5nbGVzQXJyYXlbaWR4KytdID0gcDEuejtcblxuXHRcdHRyaWFuZ2xlc0FycmF5W2lkeCsrXSA9IHAyLng7XG5cdFx0dHJpYW5nbGVzQXJyYXlbaWR4KytdID0gcDIueTtcblx0XHR0cmlhbmdsZXNBcnJheVtpZHhdID0gcDIuejtcblx0fVxuXG5cdHJldHVybiB0cmlhbmdsZXNBcnJheTtcbn1cblxuZnVuY3Rpb24gc2V0Qm94KGJib3hBcnJheTpGbG9hdDMyQXJyYXksIHBvczpudW1iZXIsIHRyaWFuZ2xlSWQ6bnVtYmVyLCBtaW5YOm51bWJlciwgbWluWTpudW1iZXIsIG1pblo6bnVtYmVyLCBtYXhYOm51bWJlciwgbWF4WTpudW1iZXIsIG1heFo6bnVtYmVyKTp2b2lkIHtcblx0bGV0IGlkeCA9IHBvcyAqIDc7XG5cdGJib3hBcnJheVtpZHgrK10gPSB0cmlhbmdsZUlkO1xuXHRiYm94QXJyYXlbaWR4KytdID0gbWluWDtcblx0YmJveEFycmF5W2lkeCsrXSA9IG1pblk7XG5cdGJib3hBcnJheVtpZHgrK10gPSBtaW5aO1xuXHRiYm94QXJyYXlbaWR4KytdID0gbWF4WDtcblx0YmJveEFycmF5W2lkeCsrXSA9IG1heFk7XG5cdGJib3hBcnJheVtpZHhdID0gbWF4Wjtcbn1cblxuZnVuY3Rpb24gY29weUJveChzb3VyY2VBcnJheTpGbG9hdDMyQXJyYXksIHNvdXJjZVBvczpudW1iZXIsIGRlc3RBcnJheTpGbG9hdDMyQXJyYXksIGRlc3RQb3M6bnVtYmVyKTp2b2lkIHtcblx0bGV0IGlkeCA9IGRlc3RQb3MgKiA3O1xuXHRsZXQgamR4ID0gc291cmNlUG9zICogNztcblx0ZGVzdEFycmF5W2lkeCsrXSA9IHNvdXJjZUFycmF5W2pkeCsrXTtcblx0ZGVzdEFycmF5W2lkeCsrXSA9IHNvdXJjZUFycmF5W2pkeCsrXTtcblx0ZGVzdEFycmF5W2lkeCsrXSA9IHNvdXJjZUFycmF5W2pkeCsrXTtcblx0ZGVzdEFycmF5W2lkeCsrXSA9IHNvdXJjZUFycmF5W2pkeCsrXTtcblx0ZGVzdEFycmF5W2lkeCsrXSA9IHNvdXJjZUFycmF5W2pkeCsrXTtcblx0ZGVzdEFycmF5W2lkeCsrXSA9IHNvdXJjZUFycmF5W2pkeCsrXTtcblx0ZGVzdEFycmF5W2lkeF0gPSBzb3VyY2VBcnJheVtqZHhdO1xufVxuXG5mdW5jdGlvbiBpc0ZhY2VBcnJheSh0ZXN0QXJyYXk6IHVua25vd24pOiB0ZXN0QXJyYXkgaXMgVmVjdG9yW11bXSB7XG5cdGlmKCFBcnJheS5pc0FycmF5KHRlc3RBcnJheSkpIHJldHVybiBmYWxzZTtcblx0Zm9yKGxldCBpID0gMDsgaSA8IHRlc3RBcnJheS5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IGZhY2UgPSB0ZXN0QXJyYXlbaV07XG5cdFx0aWYoIUFycmF5LmlzQXJyYXkoZmFjZSkpIHJldHVybiBmYWxzZTtcblx0XHRpZihmYWNlLmxlbmd0aCAhPT0gMykgcmV0dXJuIGZhbHNlO1xuXHRcdGZvcihsZXQgaiA9IDA7IGogPCAzOyBqKyspIHtcblx0XHRcdGNvbnN0IHZlcnRleDpWZWN0b3IgPSA8VmVjdG9yPmZhY2Vbal07XG5cdFx0XHRpZih0eXBlb2YgdmVydGV4LnggIT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIHZlcnRleC55ICE9PSBcIm51bWJlclwiIHx8IHR5cGVvZiB2ZXJ0ZXgueiAhPT0gXCJudW1iZXJcIikgcmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXJBcnJheSh0ZXN0QXJyYXk6IHVua25vd24pOiB0ZXN0QXJyYXkgaXMgbnVtYmVyW10ge1xuXHRpZighQXJyYXkuaXNBcnJheSh0ZXN0QXJyYXkpKSByZXR1cm4gZmFsc2U7XG5cdGZvcihsZXQgaSA9IDA7IGkgPCB0ZXN0QXJyYXkubGVuZ3RoOyBpKyspIHtcblx0XHRpZih0eXBlb2YgdGVzdEFycmF5W2ldICE9PSBcIm51bWJlclwiKSByZXR1cm4gZmFsc2U7XG5cdH1cblx0cmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlTWF4VHJpYW5nbGVzUGVyTm9kZShtYXhUcmlhbmdsZXNQZXJOb2RlOm51bWJlcik6dm9pZCB7XG5cdGlmKHR5cGVvZiBtYXhUcmlhbmdsZXNQZXJOb2RlICE9PSAnbnVtYmVyJykgdGhyb3cgbmV3IEVycm9yKGBtYXhUcmlhbmdsZXNQZXJOb2RlIG11c3QgYmUgb2YgdHlwZSBudW1iZXIsIGdvdDogJHt0eXBlb2YgbWF4VHJpYW5nbGVzUGVyTm9kZX1gKTtcblx0aWYobWF4VHJpYW5nbGVzUGVyTm9kZSA8IDEpIHRocm93IG5ldyBFcnJvcihgbWF4VHJpYW5nbGVzUGVyTm9kZSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAxLCBnb3Q6ICR7bWF4VHJpYW5nbGVzUGVyTm9kZX1gKTtcblx0aWYoTnVtYmVyLmlzTmFOKG1heFRyaWFuZ2xlc1Blck5vZGUpKSB0aHJvdyBuZXcgRXJyb3IoYG1heFRyaWFuZ2xlc1Blck5vZGUgaXMgTmFOYCk7XG5cdGlmKCFOdW1iZXIuaXNJbnRlZ2VyKG1heFRyaWFuZ2xlc1Blck5vZGUpKSBjb25zb2xlLndhcm4oYG1heFRyaWFuZ2xlc1Blck5vZGUgaXMgZXhwZWN0ZWQgdG8gYmUgYW4gaW50ZWdlciwgZ290OiAke21heFRyaWFuZ2xlc1Blck5vZGV9YCk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlVHJpYW5nbGVzKHRyaWFuZ2xlczp1bmtub3duIHwgVmVjdG9yW11bXSB8IG51bWJlcltdIHwgRmxvYXQzMkFycmF5KTogRmxvYXQzMkFycmF5IHtcblx0bGV0IHRyaWFuZ2xlc0FycmF5OkZsb2F0MzJBcnJheTtcblx0Ly9WZWN0b3JbXVtdIHwgbnVtYmVyW10gfCBGbG9hdDMyQXJyYXlcblx0aWYoQXJyYXkuaXNBcnJheSh0cmlhbmdsZXMpICYmIHRyaWFuZ2xlcy5sZW5ndGggPT09IDApIHtcblx0XHRjb25zb2xlLndhcm4oYHRyaWFuZ2xlcyBhcHBlYXJzIHRvIGJlIGFuIGFycmF5IHdpdGggMCBlbGVtZW50cy5gKTtcblx0fVxuXHRpZihpc0ZhY2VBcnJheSh0cmlhbmdsZXMpKSB7XG5cdFx0dHJpYW5nbGVzQXJyYXkgPSBidWlsZFRyaWFuZ2xlQXJyYXkodHJpYW5nbGVzKTtcblx0fSBlbHNlIGlmICh0cmlhbmdsZXMgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkpIHtcblx0XHR0cmlhbmdsZXNBcnJheSA9IHRyaWFuZ2xlcztcblx0fSBlbHNlIGlmIChpc051bWJlckFycmF5KHRyaWFuZ2xlcykpIHtcblx0XHR0cmlhbmdsZXNBcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkodHJpYW5nbGVzKVxuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihgdHJpYW5nbGVzIG11c3QgYmUgb2YgdHlwZSBWZWN0b3JbXVtdIHwgbnVtYmVyW10gfCBGbG9hdDMyQXJyYXksIGdvdDogJHt0eXBlb2YgdHJpYW5nbGVzfWApO1xuXHR9XG5cdHJldHVybiB0cmlhbmdsZXNBcnJheVxufVxuIiwiaW1wb3J0IHsgWFlaIH0gZnJvbSBcIi4vXCI7XG5cbmV4cG9ydCBjbGFzcyBCVkhOb2RlIHtcblx0ZXh0ZW50c01pbjogWFlaO1xuXHRleHRlbnRzTWF4OiBYWVo7XG5cdHN0YXJ0SW5kZXg6IG51bWJlcjtcblx0ZW5kSW5kZXg6IG51bWJlcjtcblx0bGV2ZWw6IG51bWJlcjtcblx0bm9kZTA6IEJWSE5vZGUgfCBudWxsO1xuXHRub2RlMTogQlZITm9kZSB8IG51bGw7XG5cdGNvbnN0cnVjdG9yKGV4dGVudHNNaW46IFhZWiwgZXh0ZW50c01heDogWFlaLCBzdGFydEluZGV4OiBudW1iZXIsIGVuZEluZGV4OiBudW1iZXIsIGxldmVsOiBudW1iZXIpIHtcblx0XHR0aGlzLmV4dGVudHNNaW4gPSBleHRlbnRzTWluO1xuXHRcdHRoaXMuZXh0ZW50c01heCA9IGV4dGVudHNNYXg7XG5cdFx0dGhpcy5zdGFydEluZGV4ID0gc3RhcnRJbmRleDtcblx0XHR0aGlzLmVuZEluZGV4ID0gZW5kSW5kZXg7XG5cdFx0dGhpcy5sZXZlbCA9IGxldmVsO1xuXHRcdHRoaXMubm9kZTAgPSBudWxsO1xuXHRcdHRoaXMubm9kZTEgPSBudWxsO1xuXHR9XG5cdHN0YXRpYyBmcm9tT2JqKHtleHRlbnRzTWluLCBleHRlbnRzTWF4LCBzdGFydEluZGV4LCBlbmRJbmRleCwgbGV2ZWwsIG5vZGUwLCBub2RlMX06YW55KSB7XG5cdFx0Y29uc3QgdGVtcE5vZGUgPSBuZXcgQlZITm9kZShleHRlbnRzTWluLCBleHRlbnRzTWF4LCBzdGFydEluZGV4LCBlbmRJbmRleCwgbGV2ZWwpO1xuXHRcdGlmKG5vZGUwKSB0ZW1wTm9kZS5ub2RlMCA9IEJWSE5vZGUuZnJvbU9iaihub2RlMCk7XG5cdFx0aWYobm9kZTEpIHRlbXBOb2RlLm5vZGUxID0gQlZITm9kZS5mcm9tT2JqKG5vZGUxKTtcblx0XHRyZXR1cm4gdGVtcE5vZGU7XG5cdH1cblx0ZWxlbWVudENvdW50KCkge1xuXHRcdHJldHVybiB0aGlzLmVuZEluZGV4IC0gdGhpcy5zdGFydEluZGV4O1xuXHR9XG5cblx0Y2VudGVyWCgpIHtcblx0XHRyZXR1cm4gKHRoaXMuZXh0ZW50c01pblswXSArIHRoaXMuZXh0ZW50c01heFswXSk7XG5cdH1cblxuXHRjZW50ZXJZKCkge1xuXHRcdHJldHVybiAodGhpcy5leHRlbnRzTWluWzFdICsgdGhpcy5leHRlbnRzTWF4WzFdKTtcblx0fVxuXG5cdGNlbnRlclooKSB7XG5cdFx0cmV0dXJuICh0aGlzLmV4dGVudHNNaW5bMl0gKyB0aGlzLmV4dGVudHNNYXhbMl0pO1xuXHR9XG5cblx0Y2xlYXJTaGFwZXMoKSB7XG5cdFx0dGhpcy5zdGFydEluZGV4ID0gLTE7XG5cdFx0dGhpcy5lbmRJbmRleCA9IC0xO1xuXHR9XG59XG4iLCJleHBvcnQgY2xhc3MgQlZIVmVjdG9yMyAge1xuXHR4OiBudW1iZXIgPSAwO1xuXHR5OiBudW1iZXIgPSAwO1xuXHR6OiBudW1iZXIgPSAwO1xuXHRjb25zdHJ1Y3Rvcih4Om51bWJlciA9IDAsIHk6bnVtYmVyID0gMCwgejpudW1iZXIgPSAwKSB7XG5cdFx0dGhpcy54ID0geDtcblx0XHR0aGlzLnkgPSB5O1xuXHRcdHRoaXMueiA9IHo7XG5cdH1cblx0Y29weSh2OkJWSFZlY3RvcjMpIHtcblx0XHR0aGlzLnggPSB2Lng7XG5cdFx0dGhpcy55ID0gdi55O1xuXHRcdHRoaXMueiA9IHYuejtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRzZXRGcm9tQXJyYXkoYXJyYXk6RmxvYXQzMkFycmF5LCBmaXJzdEVsZW1lbnRQb3M6bnVtYmVyKSB7XG5cdFx0dGhpcy54ID0gYXJyYXlbZmlyc3RFbGVtZW50UG9zXTtcblx0XHR0aGlzLnkgPSBhcnJheVtmaXJzdEVsZW1lbnRQb3MrMV07XG5cdFx0dGhpcy56ID0gYXJyYXlbZmlyc3RFbGVtZW50UG9zKzJdO1xuXHR9XG5cdHNldEZyb21BcnJheU5vT2Zmc2V0KGFycmF5Om51bWJlcltdKSB7XG5cdFx0dGhpcy54ID0gYXJyYXlbMF07XG5cdFx0dGhpcy55ID0gYXJyYXlbMV07XG5cdFx0dGhpcy56ID0gYXJyYXlbMl07XG5cdH1cblxuXHRzZXRGcm9tQXJncyhhOm51bWJlciwgYjpudW1iZXIsIGM6bnVtYmVyKSB7XG5cdFx0dGhpcy54ID0gYTtcblx0XHR0aGlzLnkgPSBiO1xuXHRcdHRoaXMueiA9IGM7XG5cdH1cblx0YWRkKHY6QlZIVmVjdG9yMykge1xuXHRcdHRoaXMueCArPSB2Lng7XG5cdFx0dGhpcy55ICs9IHYueTtcblx0XHR0aGlzLnogKz0gdi56O1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdG11bHRpcGx5U2NhbGFyKHNjYWxhcjpudW1iZXIpIHtcblx0XHR0aGlzLnggKj0gc2NhbGFyO1xuXHRcdHRoaXMueSAqPSBzY2FsYXI7XG5cdFx0dGhpcy56ICo9IHNjYWxhcjtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRzdWJWZWN0b3JzKGE6QlZIVmVjdG9yMywgYjpCVkhWZWN0b3IzKSB7XG5cdFx0dGhpcy54ID0gYS54IC0gYi54O1xuXHRcdHRoaXMueSA9IGEueSAtIGIueTtcblx0XHR0aGlzLnogPSBhLnogLSBiLno7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0ZG90KHY6QlZIVmVjdG9yMykge1xuXHRcdHJldHVybiB0aGlzLnggKiB2LnggKyB0aGlzLnkgKiB2LnkgKyB0aGlzLnogKiB2Lno7XG5cdH1cblx0Y3Jvc3ModjpCVkhWZWN0b3IzKSB7XG5cdFx0Y29uc3QgeCA9IHRoaXMueCwgeSA9IHRoaXMueSwgeiA9IHRoaXMuejtcblx0XHR0aGlzLnggPSB5ICogdi56IC0geiAqIHYueTtcblx0XHR0aGlzLnkgPSB6ICogdi54IC0geCAqIHYuejtcblx0XHR0aGlzLnogPSB4ICogdi55IC0geSAqIHYueDtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRjcm9zc1ZlY3RvcnMoYTpCVkhWZWN0b3IzLCBiOkJWSFZlY3RvcjMpIHtcblx0XHRjb25zdCBheCA9IGEueCwgYXkgPSBhLnksIGF6ID0gYS56O1xuXHRcdGNvbnN0IGJ4ID0gYi54LCBieSA9IGIueSwgYnogPSBiLno7XG5cdFx0dGhpcy54ID0gYXkgKiBieiAtIGF6ICogYnk7XG5cdFx0dGhpcy55ID0gYXogKiBieCAtIGF4ICogYno7XG5cdFx0dGhpcy56ID0gYXggKiBieSAtIGF5ICogYng7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0Y2xvbmUoKSB7XG5cdFx0cmV0dXJuIG5ldyBCVkhWZWN0b3IzKHRoaXMueCwgdGhpcy55LCB0aGlzLnopO1xuXHR9XG5cdHN0YXRpYyBmcm9tQW55KHBvdGVudGlhbFZlY3RvcjphbnkpOkJWSFZlY3RvcjMge1xuXHRcdGlmKHBvdGVudGlhbFZlY3RvciBpbnN0YW5jZW9mIEJWSFZlY3RvcjMpIHtcblx0XHRcdHJldHVybiBwb3RlbnRpYWxWZWN0b3I7XG5cdFx0fSBlbHNlIGlmIChwb3RlbnRpYWxWZWN0b3IueCAhPT0gdW5kZWZpbmVkICYmIHBvdGVudGlhbFZlY3Rvci54ICE9PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gbmV3IEJWSFZlY3RvcjMocG90ZW50aWFsVmVjdG9yLngsIHBvdGVudGlhbFZlY3Rvci55LCBwb3RlbnRpYWxWZWN0b3Iueik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJDb3VsZG4ndCBjb252ZXJ0IHRvIEJWSFZlY3RvcjMuXCIpO1xuXHRcdH1cblx0fVxufVxuIiwiZXhwb3J0ICogZnJvbSAnLi9CVkgnO1xuZXhwb3J0ICogZnJvbSAnLi9CVkhCdWlsZGVyJztcbmV4cG9ydCAqIGZyb20gJy4vQlZITm9kZSc7XG5leHBvcnQgKiBmcm9tICcuL0JWSFZlY3RvcjMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFhZWiB7XG5cdDA6IG51bWJlcjtcblx0MTogbnVtYmVyO1xuXHQyOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmVjdG9yIHtcblx0eDogbnVtYmVyO1xuXHR5OiBudW1iZXI7XG5cdHo6IG51bWJlcjtcbn1cblxuZXhwb3J0IHR5cGUgRXZhbHVhdG9yID0gKCkgPT4gbnVtYmVyO1xuZXhwb3J0IHR5cGUgV29yayA9ICgpID0+IHZvaWQ7XG5leHBvcnQgdHlwZSBXb3JrUHJvZ3Jlc3MgPSB7bm9kZXNTcGxpdDogbnVtYmVyfTtcbmV4cG9ydCB0eXBlIFdvcmtQcm9ncmVzc0NhbGxiYWNrID0gKHByb2dyZXNzT2JqOldvcmtQcm9ncmVzcykgPT4gdm9pZDtcbmV4cG9ydCB0eXBlIEJWSFByb2dyZXNzID0ge25vZGVzU3BsaXQ6IG51bWJlciwgdHJpYW5nbGVzTGVhZmVkOiBudW1iZXJ9O1xuZXhwb3J0IHR5cGUgQXN5bmNpZnlQYXJhbXMgPSB7bXM/OiBudW1iZXIsIHN0ZXBzPzogbnVtYmVyfTtcbiIsImltcG9ydCB7IEV2YWx1YXRvciwgV29yaywgQXN5bmNpZnlQYXJhbXMsIFdvcmtQcm9ncmVzc0NhbGxiYWNrIH0gZnJvbSAnLi8nO1xuaW1wb3J0IHsgQlZITm9kZSB9IGZyb20gJy4vQlZITm9kZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3VudE5vZGVzKG5vZGU6QlZITm9kZSwgY291bnQ6bnVtYmVyID0gMCk6bnVtYmVyIHtcblx0Y291bnQgKz0gMTtcblx0aWYobm9kZS5ub2RlMCkge1xuXHRcdGNvdW50ICs9IGNvdW50Tm9kZXMobm9kZS5ub2RlMCk7XG5cdH1cblx0aWYobm9kZS5ub2RlMSkge1xuXHRcdGNvdW50ICs9IGNvdW50Tm9kZXMobm9kZS5ub2RlMSk7XG5cdH1cblx0aWYoKG5vZGUgYXMgYW55KS5fbm9kZTApIHtcblx0XHRjb3VudCArPSBjb3VudE5vZGVzKChub2RlIGFzIGFueSkuX25vZGUwKTtcblx0fVxuXHRpZigobm9kZSBhcyBhbnkpLl9ub2RlMSkge1xuXHRcdGNvdW50ICs9IGNvdW50Tm9kZXMoKG5vZGUgYXMgYW55KS5fbm9kZTEpO1xuXHR9XG5cdHJldHVybiBjb3VudDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFzeW5jV29yayh3b3JrQ2hlY2s6RXZhbHVhdG9yLCB3b3JrOldvcmssIG9wdGlvbnM6QXN5bmNpZnlQYXJhbXMsIHByb2dyZXNzQ2FsbGJhY2s/OldvcmtQcm9ncmVzc0NhbGxiYWNrKTpQcm9taXNlPHZvaWQ+IHtcblx0aWYob3B0aW9ucy5tcyAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuc3RlcHMgIT09IHVuZGVmaW5lZCkge1xuXHRcdGNvbnNvbGUud2FybihcIkFzeW5jaWZ5IGdvdCBib3RoIHN0ZXBzIGFuZCBtcywgZGVmYXVsdGluZyB0byBzdGVwcy5cIik7XG5cdH1cblx0Y29uc3Qgd29ya2VyOkdlbmVyYXRvciA9IChvcHRpb25zLnN0ZXBzICE9PSB1bmRlZmluZWQgPyBwZXJjZW50YWdlQXN5bmNpZnkgOiB0aW1lQXN5bmNpZnkpKHdvcmtDaGVjaywgd29yaywgb3B0aW9ucyk7XG5cdGxldCBkb25lOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXHRsZXQgbm9kZXNTcGxpdDogbnVtYmVyO1xuXHR3aGlsZSghKHt2YWx1ZTogbm9kZXNTcGxpdCwgZG9uZX0gPSB3b3JrZXIubmV4dCgpLCBkb25lKSkge1xuXHRcdGlmKHR5cGVvZiBwcm9ncmVzc0NhbGxiYWNrICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0cHJvZ3Jlc3NDYWxsYmFjayh7bm9kZXNTcGxpdH0pO1xuXHRcdH1cblx0XHRhd2FpdCB0aWNraWZ5KCk7XG5cdH1cbn1cblxuZnVuY3Rpb24qIHRpbWVBc3luY2lmeSh3b3JrQ2hlY2s6RXZhbHVhdG9yLCB3b3JrOldvcmssIHttcz0xMDAwIC8gMzB9OkFzeW5jaWZ5UGFyYW1zKSB7XG5cdGxldCBzVGltZTpudW1iZXIgPSBEYXRlLm5vdygpO1xuXHRsZXQgbjpudW1iZXIgPSAwO1xuXHRsZXQgdGhyZXM6bnVtYmVyID0gMDtcblx0bGV0IGNvdW50Om51bWJlciA9IDA7XG5cdHdoaWxlKHdvcmtDaGVjaygpIDwgMSkge1xuXHRcdHdvcmsoKTtcblx0XHRjb3VudCsrO1xuXHRcdGlmKCsrbiA+PSB0aHJlcykge1xuXHRcdFx0Y29uc3QgY1RpbWUgPSBEYXRlLm5vdygpO1xuXHRcdFx0Y29uc3QgdERpZmYgPSBjVGltZSAtIHNUaW1lO1xuXHRcdFx0aWYodERpZmYgPiBtcykge1xuXHRcdFx0XHR5aWVsZCBjb3VudDtcblx0XHRcdFx0dGhyZXMgPSBuICogKG1zIC8gdERpZmYpO1xuXHRcdFx0XHRzVGltZSA9IGNUaW1lO1xuXHRcdFx0XHRuID0gMDtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24qIHBlcmNlbnRhZ2VBc3luY2lmeSh3b3JrQ2hlY2s6RXZhbHVhdG9yLCB3b3JrOldvcmssIHtzdGVwcz0xMH06QXN5bmNpZnlQYXJhbXMpIHtcblx0aWYoc3RlcHMgPD0gMCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkFzeW5jaWZ5IHN0ZXBzIHdhcyBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gemVyb1wiKTtcblx0fVxuXHRsZXQgY291bnQ6bnVtYmVyID0gMDtcblx0bGV0IHRvdGFsTnVtYmVyOiBudW1iZXIgPSAwO1xuXHRsZXQgbGFzdEluYzpudW1iZXIgPSAwO1xuXHRsZXQgd29ya1BlcmNlbnRhZ2U6bnVtYmVyO1xuXHRsZXQgcGVyY2VudGFnZTpudW1iZXIgPSAxIC8gc3RlcHM7XG5cdHdoaWxlKCh3b3JrUGVyY2VudGFnZSA9IHdvcmtDaGVjaygpLCB3b3JrUGVyY2VudGFnZSA8IDEpKSB7XG5cdFx0d29yaygpO1xuXHRcdGNvdW50Kys7XG5cdFx0aWYod29ya1BlcmNlbnRhZ2UgPiBsYXN0SW5jKSB7XG5cdFx0XHR0b3RhbE51bWJlciArPSAxO1xuXHRcdFx0eWllbGQgY291bnQ7XG5cdFx0XHRsYXN0SW5jID0gd29ya1BlcmNlbnRhZ2UgKyBwZXJjZW50YWdlO1xuXHRcdH1cblx0fVxuXHRjb25zb2xlLmxvZyhcIlRvdGFsXCIsIHRvdGFsTnVtYmVyKTtcbn1cblxuXG5cbmNvbnN0IHRpY2tpZnkgPSAoKTpQcm9taXNlPHZvaWQ+ID0+IG5ldyBQcm9taXNlKChyZXM6V29yaykgPT4gc2V0VGltZW91dChyZXMpKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=