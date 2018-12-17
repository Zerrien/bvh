import { BVHVector3 } from '@src/BVHVector3'

describe("Constructing BVHVector3s", () => {
	test("Default constructor should equal 0 xyz", () => {
		expect(new BVHVector3()).toEqual({x: 0, y: 0, z: 0});
	});

	test("Constructor to set xyz", () => {
		expect(new BVHVector3(1, 1, 1)).toEqual({x: 1, y: 1, z: 1});
	});
});

describe("Interacting with BVHVector3s", () => {
	let vectorA;
	let vectorB;
	beforeEach(() => {
		vectorA = new BVHVector3(10, 10, 10);
		vectorB = new BVHVector3(20, 20, 20);
	});

	test("Add", () => {
		expect(vectorA.add(vectorB)).toEqual({x:30, y:30, z:30});
	});
	
	test("Dot", () => {
		expect(vectorA.dot(vectorB)).toEqual(600);
	});
});
