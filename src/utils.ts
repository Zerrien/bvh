import { BVHNode } from './BVHNode';

export function countNodes(node:BVHNode, count:number = 0):number {
	count += 1;
	if(node.node0) {
		count += countNodes(node.node0);
	}
	if(node.node1) {
		count += countNodes(node.node1);
	}
	if((node as any)._node0) {
		count += countNodes((node as any)._node0);
	}
	if((node as any)._node1) {
		count += countNodes((node as any)._node1);
	}
	return count;
}

export async function asyncWork(workCheck:() => boolean, work:() => void, progressCallback?:(obj:{nodesSplit: number}) => void):Promise<void> {
	const a:Generator = asyncify(workCheck, work);
	let done: boolean;
	let nodesSplit: number;
	while(!({value: nodesSplit, done} = a.next(), done)) {
		if(typeof progressCallback !== 'undefined') {
			progressCallback({nodesSplit});
		}
		await tickify();
	}
}

function* asyncify(workCheck:() => boolean, work:() => void) {
	let sTime:number = Date.now();
	let n:number = 0;
	let thres:number = 0;
	let count:number = 0;
	while(workCheck()) {
		work();
		count++;
		if(++n >= thres) {
			if(Date.now() - sTime > 10) {
				yield count;
				sTime = Date.now();
				thres = n;
				n = 0;
			}
		}
	}
}

const tickify = ():Promise<void> => new Promise((res:() => void) => setTimeout(res));
