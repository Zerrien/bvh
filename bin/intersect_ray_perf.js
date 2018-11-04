#! /usr/bin/env node

// You need `npm run build` before running this.

const { BVHBuilder, BVHVector3 } = require("../dist");
const { countNodes } = require("../dist/utils")
const { readFileSync } = require('fs');

const vertArraybuffer = readFileSync('../public/resources/models/bun_zipper.f32verts').buffer;
const masterArray = new Float32Array(vertArraybuffer);

const masterArray2 = new Float32Array([
	0.0, 0.0, 0.0, // Normal triangle
	0.0, 0.0, 1.0,
	1.0, 0.0, 0.0,

	0.0, -1.0, 0.0, // Reverse wound
	1.0, -1.0, 0.0,
	0.0, -1.0, 1.0,
]);

console.log("\n");
for(var j = 0; j < 10; j++) {
	let x = [];
/*
	{
		const BVH = BVHBuilder(masterArray2, 1);
		const sTime = Date.now();
		for(var i = 0; i < 1000000; i++) {
			const intersections = BVH.intersectRay({x:0.25, y:1, z:0.25}, {x:0, y:-1, z:0}, false);
		}
		x.push(Date.now() - sTime);
	};
	{
		const BVH = BVHBuilder(masterArray, 1);
		const sTime = Date.now();
		for(var i = 0; i < 125000; i++) {
			const intersections = BVH.intersectRay({x:0, y:10, z:0}, {x:0, y:-1, z:0}, false);
		}
		x.push(Date.now() - sTime);
	};
	{
		const BVH = BVHBuilder(masterArray2, 1);
		const sTime = Date.now();
		for(var i = 0; i < 1000000; i++) {
			const intersections = BVH.intersectRay(new BVHVector3(0.25, 1, 0.25), new BVHVector3(0, -1, 0), false);
		}
		x.push(Date.now() - sTime);
	};

	*/
	{
		const BVH = BVHBuilder(masterArray, 1);
		const BVH2 = BVHBuilder(masterArray2, 1); // Why is this intersectRay so much more computationally expensive?
		console.log("1", countNodes(BVH.rootNode));
		console.log("2", countNodes(BVH2.rootNode));
		const sTime = Date.now();
		let a = new BVHVector3(0.25, 1, 0.25);
		let b = new BVHVector3(0, -1, 0);
		for(var i = 0; i < 1250000; i++) {
			a.setFromArgs(0.25, 1, 0.25);
			b.setFromArgs(0, -1, 0);
			const intersections = BVH.intersectRay(a, b, false);
		}
		x.push(Date.now() - sTime);
	};
	console.log(x.join(","));
}