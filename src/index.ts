export * from './BVH';
export * from './BVHBuilder';
export * from './BVHNode';
export * from './BVHVector3';

export interface XYZ {
	0: number;
	1: number;
	2: number;
}

export interface Vector {
	x: number;
	y: number;
	z: number;
}

export type Evaluator = () => number;
export type Work = () => void;
export type WorkProgress = {nodesSplit: number};
export type WorkProgressCallback = (progressObj:WorkProgress) => void;
export type BVHProgress = {nodesSplit: number, trianglesLeafed: number};
export type AsyncifyParams = {ms?: number, steps?: number};
