export async function asyncWork(workCheck:() => boolean, work:() => void, progressCallback?:(obj:{nodesSplit: number}) => void):Promise<void> {
	var a:Generator = asyncify(workCheck, work);
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
	var sTime:number = Date.now();
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

function tickify():Promise<void> {
	return new Promise(res => {
		setTimeout(res);
	});
}
