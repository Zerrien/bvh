#! /usr/bin/env node

// Note: This isn't perfectly usable, gotta tweak values until it works with your specific model...

const fs = require('fs');
const path = require('path');

const modelPath = process.argv[2];
const {name: modelName} = path.parse(modelPath);

const writeStream = fs.createWriteStream(path.join(process.cwd(), `${modelName}.f32verts`), 'binary')
const file = fs.readFileSync(path.join(process.cwd(), modelPath), 'utf8');

;(async function main() {
	let lines = file.trim().split("\n");
	let [, , , vertLine, , , , , , faceLine] = lines;
	const vertCount = parseInt(vertLine.trim().split(" ")[2], 10);
	const faceCount = parseInt(faceLine.trim().split(" ")[2], 10);
	console.log(vertCount, faceCount);
	lines = lines.slice(12);
	let verts = lines.slice(0, vertCount).map(e => e.trim().split(" ").map(e2 => Number(e2)));
	let faces = lines.slice(vertCount).map(e => e.trim().split(" ").map(e2 => parseInt(e2, 10)).filter((_, i) => i & 3));
	let n = new Float32Array(faceCount * 9);
	console.log(faceCount);
	console.log(verts[0]);
	for(var i = 0; i < faces.length; i++) {
		let face1 = verts[faces[i][0]];
		let face2 = verts[faces[i][1]];
		let face3 = verts[faces[i][2]];
		n[i * 9 + 0] = face1[0];
		n[i * 9 + 1] = face1[1];
		n[i * 9 + 2] = face1[2];
		n[i * 9 + 3] = face2[0];
		n[i * 9 + 4] = face2[1];
		n[i * 9 + 5] = face2[2];
		n[i * 9 + 6] = face3[0];
		n[i * 9 + 7] = face3[1];
		n[i * 9 + 8] = face3[2];
	}
	writeStream.write(Buffer.from(new Uint8Array(n.buffer)));
})();

async function readStreamOnce(readStream) {
	return new Promise(res => {
		readStream.once('readable', () => {
			res(readStream.read());
		});
	});
}
