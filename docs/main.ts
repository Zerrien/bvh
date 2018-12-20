import "@babel/polyfill"; // IE11
import 'whatwg-fetch'; // IE11

const progressElement = <HTMLElement>document.querySelector("#prog-inter");
const progressText = <HTMLElement>document.querySelector("#prog-text");
const progressDesc = <HTMLElement>document.querySelector("#prog-status");
const container = <HTMLElement>document.querySelector("#three-container");

import * as THREE from 'three';
import { BVHBuilderAsync, BVHBuilder, BVH } from 'BVH';

let camera : THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let mesh: THREE.Mesh;
let x: Float32Array;
let bvh:BVH;

function concatTypedArray(resultConstructor:any, ...arrays:any[]) {
	let totalLength = 0;
	for (let arr of arrays) {
		totalLength += arr.length;
	}
	let result = new resultConstructor(totalLength);
	let offset = 0;
	for (let arr of arrays) {
		result.set(arr, offset);
		offset += arr.length;
	}
	return result;
}

;(async function() {
	setProgress("Downloading model...", 0, 1, 0, 1);
	x = new Float32Array(await (await fetch('./resources/models/dragon_vrip.f32verts').then((response):Promise<ArrayBuffer> => {
		if(!response.body) return response.arrayBuffer(); // IE11
		const bodyReader = (response as any).body.getReader();
		const fileSize = (response as any).headers.get('content-length');
		return new Promise((res, rej) => {
			let running:any = [];
			let runningResult = 0;
			bodyReader.read().then(function read(result:any) {
				if(result.done) {
					return res(concatTypedArray(Uint8Array, ...running).buffer);
				} else {
					runningResult += result.value.length;
					running.push(result.value);
					setProgress("Downloading model...", 0, 0.5, runningResult / fileSize, 1);
					bodyReader.read().then(read);
				}
			})
		});
	})));
	bvh = await BVHBuilderAsync(x, undefined, ({trianglesLeafed}) => {
		setProgress("Generating BVH...", 0.5, 1, trianglesLeafed, x.length / 9);
	});
	setProgress("Done!", 0.5, 1, 1, 1);
	initThree();
})();

function setProgress(text: string, start:number, end:number, cur:number, max:number) {
	const percentage = `${(Math.floor((start + (end - start) * cur / max) * 10000) / 100).toFixed(2)}%`;
	progressElement.style.width = percentage;
	progressText.innerText = percentage;
	progressDesc.innerText = text;
}

function initThree() {
	camera = new THREE.PerspectiveCamera(0.75, window.innerWidth / window.innerHeight, 1, 100);
	camera.position.set(0, 10, 10);
	camera.lookAt(0, 0.1, 0);
	scene = new THREE.Scene();
	var light1 = new THREE.DirectionalLight( 0xFFFFFF, 0.5 );
	scene.add( light1 );
	scene.add( new THREE.AmbientLight( 0x444444 ) );
	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute('position', new THREE.BufferAttribute(x, 3));
	geometry.computeVertexNormals();
	var material = new THREE.MeshStandardMaterial( { color: 0x00ff55 } );
	mesh = new THREE.Mesh( geometry, material );
	scene.add(mesh);
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	if(container) {
		container.appendChild( renderer.domElement );
		animate();
	}
}

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
