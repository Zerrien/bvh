export class BVHNode {
	extentsMin: XYZ;
	extentsMax: XYZ;
	startIndex: number;
	endIndex: number;
	level: number;
	node0: BVHNode | null;
	node1: BVHNode | null;
	constructor(extentsMin: XYZ, extentsMax: XYZ, startIndex: number, endIndex: number, level: number) {
		this.extentsMin = extentsMin;
		this.extentsMax = extentsMax;
		this.startIndex = startIndex;
		this.endIndex = endIndex;
		this.level = level;
		this.node0 = null;
		this.node1 = null;
	}
	elementCount() {
		return this.endIndex - this.startIndex;
	}

	centerX() {
		return (this.extentsMin[0] + this.extentsMax[0]) * 0.5;
	}

	centerY() {
		return (this.extentsMin[1] + this.extentsMax[1]) * 0.5;
	}

	centerZ() {
		return (this.extentsMin[2] + this.extentsMax[2]) * 0.5;
	}

	clearShapes() {
		this.startIndex = -1;
		this.endIndex = -1;
	}
	static fromSerialized(obj:any) {
		return new BVHNode(
			obj.extentsMin,
			obj.extentsMax,
			obj.startIndex,
			obj.endIndex,
			obj.level
		);
	}
}
