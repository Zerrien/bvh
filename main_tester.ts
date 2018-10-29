import { BVHBuilder, BVHBuilderAsync } from './src/BVHBuilder';
import * as OldBVH from './src/bvhtree_old.js';

let w = (<any>window);

w.ole = function():number {
	return 42;
}

w.getFloat32 = async function():Promise<Float32Array> {
	let x = new Float32Array(await (await fetch('./resources/models/dragon_vrip.f32verts')).arrayBuffer());
	return x;
}

w.getObj = function(x:Float32Array):any {
	let n = [];
	for(var i = 0; i < x.length; i += 9) {
		n.push([
			{x:x[i + 0], y:x[i + 1], z:x[i + 2]},
			{x:x[i + 3], y:x[i + 4], z:x[i + 5]},
			{x:x[i + 6], y:x[i + 7], z:x[i + 8]}
		]);
	}
	return n;
}

w.runBVHBuilder = function(n:any) {
	let sTime = Date.now();
	let z = BVHBuilder(n);
	console.log(Date.now() - sTime);
}

w.runBVHBuilderAsync = async function(n:any) {
	let sTime = Date.now();
	let t = await BVHBuilderAsync(n, 7, ({nodesSplit}) => {
		//console.log(nodesSplit);
	});
	console.log(Date.now() - sTime);
}

w.runBVHBuilderOld = function(n:any) {
	let sTime = Date.now();
	let v = new OldBVH.BVH(n);
	console.log(Date.now() - sTime);
}
