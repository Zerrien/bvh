import { BVHVector3, BVHBuilder } from '@src/index'
import * as THREE from 'three';

const masterArray = new Float32Array([
	0, 0, 0, // Normal triangle
	0, 0, 1,
	1, 0, 0,

	0, -1, 0, // Reverse wound
	1, -1, 0,
	0, -1, 1,

	0, 3, 0, // Normal behind
	1, 3, 0,
	0, 3, 1,

	0, 2, 0, // Reverse behind
	0, 2, 1,
	1, 2, 0,

	0, 0, 0, // Parallel with ray
	0, -1, 0,
	1, -1, 0,

	10, 0, 10, // Away
	11, 0, 10,
	10, 0, 11,

	10, 0, 10, // Reverse Away
	10, 0, 11,
	11, 0, 10,
]);

describe('Intersect ray works as expected', () => {
	test('Without Backface Culling', () => {
		const BVH = BVHBuilder(masterArray, 1);
		const intersections = BVH.intersectRay(new BVHVector3(0.25, 1, 0.25), new BVHVector3(0, -1, 0));
		expect(intersections.length).toEqual(1);
	});

	test('With Backface Culling', () => {
		const BVH = BVHBuilder(masterArray, 1);
		const intersections = BVH.intersectRay(new BVHVector3(0.25, 1, 0.25), new BVHVector3(0, -1, 0), false);
		expect(intersections.length).toEqual(2);
	});
});

describe('Intersect ray works with different vector interfaces', () => {
	test('BVHVector3', () => {
		const BVH = BVHBuilder(masterArray, 1);
		const intersections = BVH.intersectRay(new BVHVector3(0.25, 1, 0.25), new BVHVector3(0, -1, 0));
		expect(intersections.length).toEqual(1);
	});
	test('THREE.Vector3', () => {
		const BVH = BVHBuilder(masterArray, 1);
		const intersections = BVH.intersectRay(new THREE.Vector3(0.25, 1, 0.25), new THREE.Vector3(0, -1, 0));
		expect(intersections.length).toEqual(1);
	});
	test('{x, y, z}', () => {
		const BVH = BVHBuilder(masterArray, 1);
		const intersections = BVH.intersectRay({x: 0.25, y: 1, z: 0.25}, {x: 0, y: -1, z: 0});
		expect(intersections.length).toEqual(1);
	});
	test('Strings should fail', () => {
		const BVH = BVHBuilder(masterArray, 1);
		expect(() => {
			BVH.intersectRay("hello", "world")
		}).toThrow("Origin or Direction");
	});
});
