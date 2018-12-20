import { BVHBuilder, BVHBuilderAsync } from '@src/BVHBuilder'
import { BVH as BVH_old } from '@src/bvhtree_old'
import { countNodes } from '@src/utils';

const oneTriangle = new Float32Array([
	0, 0, 0, // Normal triangle
	0, 0, 1,
	1, 0, 0,
]);

const stackedTriangles = new Float32Array([
	0, 0, 0, // Normal triangle
	0, 0, 1,
	1, 0, 0,
	
	0, 0, 0, // Normal triangle
	0, 0, 1,
	1, 0, 0,
	
	0, 0, 0, // Normal triangle
	0, 0, 1,
	1, 0, 0,
	
	0, 0, 0, // Normal triangle
	0, 0, 1,
	1, 0, 0,
]);
beforeEach(() => {
	console.warn = jest.fn(() => false);
});
describe('BVHBuilder', () => {
	describe('Accepted parameters', () => {
		describe('triangles', () => {
			test('number', () => {
				//expect(() => BVHBuilder(0)).toThrow('Specific message');
			});
			test('string', () => {
				//expect(() => BVHBuilder("")).toThrow('Specific message');
			});
			test('object', () => {
				//expect(() => BVHBuilder({})).toThrow('Specific message');
			});
			test('Empty array', () => {
				//BVHBuilder([]);
				//expect(console.warn).toBeCalled();
				//expect(console.warn.mock.calls[0][0]).toBe(`Specific message`);
			});
			test('Array of face objects', () => {
				expect(() => BVHBuilder([[{x:0, y:0, z:0}, {x:0, y:0, z:1}, {x:1, y:0, z:0}]])).not.toThrow();
			});
		});
		describe('maxTrianglesPerNode', () => {
			test('0', () => {
				expect(() => BVHBuilder(oneTriangle, 0)).toThrow('maxTrianglesPerNode must be greater than or equal to 1, got: 0');
			});
			test('-1', () => {
				expect(() => BVHBuilder(oneTriangle, -1)).toThrow('maxTrianglesPerNode must be greater than or equal to 1, got: -1');
			});
			test('0.5', () => {
				expect(() => BVHBuilder(oneTriangle, 0.5)).toThrow('maxTrianglesPerNode must be greater than or equal to 1, got: 0.5');
			});
			test('1.5', () => {
				BVHBuilder(oneTriangle, 1.5);
				expect(console.warn).toBeCalled();
				expect(console.warn.mock.calls[0][0]).toBe(`maxTrianglesPerNode is expected to be an integer, got: 1.5`);
			});
			test('String', () => {
				expect(() => BVHBuilder(oneTriangle, "")).toThrow('maxTrianglesPerNode must be of type number, got: string');
			});
			test('Object', () => {
				expect(() => BVHBuilder(oneTriangle, {})).toThrow('maxTrianglesPerNode must be of type number, got: object');
			});
			test('Array', () => {
				expect(() => BVHBuilder(oneTriangle, [])).toThrow('maxTrianglesPerNode must be of type number, got: object');
			});
			test('Boolean', () => {
				expect(() => BVHBuilder(oneTriangle, true)).toThrow('maxTrianglesPerNode must be of type number, got: boolean');
			});
			test('null', () => {
				expect(() => BVHBuilder(oneTriangle, null)).toThrow('maxTrianglesPerNode must be of type number, got: object');
			});
			test('Function', () => {
				expect(() => BVHBuilder(oneTriangle, () => false)).toThrow('maxTrianglesPerNode must be of type number, got: function');
			});
			test('Symbol', () => {
				expect(() => BVHBuilder(oneTriangle, Symbol())).toThrow('maxTrianglesPerNode must be of type number, got: symbol');
			});
			test('NaN', () => {
				expect(() => BVHBuilder(oneTriangle, NaN)).toThrow('maxTrianglesPerNode is NaN');
			});
			test('undefined', () => {
				expect(() => BVHBuilder(oneTriangle, undefined)).not.toThrow();
			});
			test('Infinity', () => {
				expect(() => BVHBuilder(oneTriangle, Infinity)).not.toThrow();
			});
		});
	});
	describe('Unusual cases', () => {
		test('Stacked faces', () => {
			let BVH = BVHBuilder(stackedTriangles, 1);
			expect(countNodes(BVH.rootNode)).toEqual(1);
		});
	})
});

/*
// Integration tests, heavy. ~1.5s ea.
import { readFileSync } from 'fs'
const vertArraybuffer = readFileSync('./docs/public/resources/models/bun_zipper.f32verts').buffer;
const masterArray = new Float32Array(vertArraybuffer);
describe('BVHBuilders', () => {
	let anArray;
	let objArray;
	beforeAll(async () => {
		anArray = new Float32Array(vertArraybuffer);
		objArray = [];
		for(var i = 0; i < anArray.length; i += 9) {
			objArray.push([
				{x:anArray[i + 0], y:anArray[i + 1], z:anArray[i + 2]},
				{x:anArray[i + 3], y:anArray[i + 4], z:anArray[i + 5]},
				{x:anArray[i + 6], y:anArray[i + 7], z:anArray[i + 8]}
			]);
		}
	});

	test('BVHBuilder with XYZ objects', () => {
		let BVH = BVHBuilder(objArray, 10);
		expect(countNodes(BVH.rootNode)).toEqual(19755);
	});

	test('BVHBuilder with VertexFaces array', () => {
		let BVH = BVHBuilder(anArray, 10);
		expect(countNodes(BVH.rootNode)).toEqual(19755);
	});

	test('BVHBuilderAsync with XYZ objects', async () => {
		let BVH = await BVHBuilderAsync(objArray, 10);
		expect(countNodes(BVH.rootNode)).toEqual(19755);
	});

	test('BVHBuilderAsync with VertexFaces array', async () => {
		let BVH = await BVHBuilderAsync(anArray, 10, () => {

		});
		expect(countNodes(BVH.rootNode)).toEqual(19755);
	});
	
	test('BVHBuilderOld with XYZ objects', () => {
		let BVH = new BVH_old(objArray, 10);
		expect(countNodes(BVH._rootNode)).toEqual(19755);
	});
});
*/