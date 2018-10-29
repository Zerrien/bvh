// TODO:
const ctx: Worker = self as any;
//import { BVHSplitter } from './src/BVHBuilder';
import { BVHNode } from './src/BVHNode';

ctx.onmessage = function(msg) {
	/*console.log(msg.data.BVHBuilderPieces);
	let a = BVHNode.fromSerialized(msg.data.BVHBuilderPieces[0]);
	let b = msg.data.BVHBuilderPieces[1];
	let c = msg.data.BVHBuilderPieces[2];
	let d = msg.data.BVHBuilderPieces[3];
	let x = BVHSplitter(a, c, d, b);
	ctx.postMessage({test: a});*/
}