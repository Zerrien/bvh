import { BVHBuilder, BVHBuilderAsync, BVH, BVHVector3 } from '@src';

let bvh:BVH;

onmessage = async function({data:{message, data}}) {
	if(message === "bvh_info") {
		buildBVH(data.facesArray);
	} else if (message === "ray_cast") {
		rayCast(data.origin, data.direction);
	}
}

async function buildBVH(array:any ) {
	bvh = await BVHBuilderAsync(array, undefined, undefined, function(value) {
		(self as any).postMessage({
			message: "progress",
			data: {
				value
			}
		});
	});
	(self as any).postMessage({
		message: "done"
	})
}

function rayCast(origin:any, direction:any) {
	let result = bvh.intersectRay(origin, direction, false);
	(self as any).postMessage( {
		message: "ray_traced",
		data: result
	});
}