import "@babel/polyfill"; // IE11
import 'whatwg-fetch'; // IE11



const emojiRange = [128513, 128591];

const spinnerElement = <HTMLElement>document.querySelector("#spinner");
const emoji = Math.floor((emojiRange[1] - emojiRange[0]) * Math.random()) + emojiRange[0];
spinnerElement.innerHTML = "&#" + emoji + ";";
let spinner_rot = 0;
const spinnerInterval = setInterval(function() {
	spinnerElement.style.transform = `translateX(-50%) translateY(-50%) rotate(${spinner_rot++}deg)`
}, 1);
const progressElement = <HTMLElement>document.querySelector("#prog-inter");
const progressText = <HTMLElement>document.querySelector("#prog-text");
const progressDesc = <HTMLElement>document.querySelector("#prog-status");
const container = <HTMLElement>document.querySelector("#three-container");
const logContainer = <HTMLElement>document.querySelector("#log-container");

const myWorker = new Worker('./worker.js');
[
	{
		name: "webworker",
		func: function() {
			lastBVH = "";
			return new Promise(async (res, rej) => {
				if(renderer) {
					container.removeChild(renderer.domElement);
					spinnerElement.style.display = "block";
					const emoji = Math.floor((emojiRange[1] - emojiRange[0]) * Math.random()) + emojiRange[0];
					spinnerElement.innerHTML = "&#" + emoji + ";";
				}
				vertexPoints = await downloadModel();
				setProgress("Downloading model...", 0, 0.5, 1, 1);
				initThree();
				const sTime = Date.now();
				myWorker.onmessage = (e:MessageEvent) => {
					if(e.data.message === "progress") {
						setProgress("Generating BVH...", 0.5, 1, e.data.data.value.trianglesLeafed, vertexPoints.length / 9);
					} else if (e.data.message === "done") {
						lastBVH = "worker";
						setProgress("Done!", 0.5, 1, 1, 1);
						spinnerElement.style.display = "none";
						console.log(Date.now() - sTime);
						res();
					}
				}
				myWorker.postMessage({message: "bvh_info", data:{facesArray: vertexPoints}});
			})
		},
	},
	{
		name: "async10",
		func: function() {
			lastBVH = "";
			return new Promise(async (res, rej) => {
				if(renderer) {
					container.removeChild(renderer.domElement);
					spinnerElement.style.display = "block";
					const emoji = Math.floor((emojiRange[1] - emojiRange[0]) * Math.random()) + emojiRange[0];
					spinnerElement.innerHTML = "&#" + emoji + ";";
				}
				vertexPoints = await downloadModel();
				setProgress("Downloading model...", 0, 0.5, 1, 1);
				initThree();
				const sTime = Date.now();
				bvh = await BVHBuilderAsync(vertexPoints, undefined, {steps: 10}, ({trianglesLeafed}) => {
					setProgress("Generating BVH...", 0.5, 1, trianglesLeafed, vertexPoints.length / 9);
				});
				lastBVH = "main";
				setProgress("Done!", 0.5, 1, 1, 1);
				spinnerElement.style.display = "none";
				console.log(Date.now() - sTime);
				res();
			});
		},
	},
].forEach(({name, func}) => {
	const buttonElement = <HTMLElement>document.querySelector(`#button_${name}`);
	buttonElement.addEventListener("click", () => {
		if(buttonElement.classList.contains('disabled')) return;
		document.querySelectorAll(".button").forEach(e => {
			e.classList.add("disabled");
		});
		func().then(() => {
			document.querySelectorAll(".button").forEach(e => {
				e.classList.remove("disabled");
			});
		});
	});
});

let vertexPoints: Float32Array;

async function downloadModel() {
	setProgress("Downloading model...", 0, 1, 0, 1);
	const verts:Promise<Response> = fetch('./resources/models/dragon_vrip.f32verts');
	const arrayBuffer:Promise<ArrayBuffer> = verts.then((response:Response):Promise<ArrayBuffer> => {
		if(!response.body) return response.arrayBuffer(); // IE11
		const bodyReader = response.body.getReader();
		const contentLength = response.headers.get('content-length');
		const fileSize = contentLength ? parseInt(contentLength, 10) : null;
		return new Promise((res, rej) => {
			let running:Uint8Array[] = [];
			let runningResult = 0;
			bodyReader.read().then(function read(result:{value:Uint8Array, done:boolean}) {
				if(result.done) return res(concatTypedArray(Uint8Array, ...running).buffer);
				runningResult += result.value.length;
				running.push(result.value);
				if(fileSize) {
					setProgress("Downloading model...", 0, 0.5, runningResult / fileSize, 1);
				}
				bodyReader.read().then(read);
			});
		});
	});
	return new Float32Array(await arrayBuffer);
}

import * as THREE from 'three';
import { BVHBuilderAsync, BVHBuilder, BVH } from 'BVH';

let camera : THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let mesh: THREE.Mesh;
let bvh:BVH;
let lastBVH:string;

function concatTypedArray(resultConstructor: Uint8ArrayConstructor, ...arrays:Uint8Array[]) {
	const totalLength = arrays
		.map((elem:Uint8Array) => elem.length)
		.reduce((acc:number, elem:number) => acc + elem);
	const result:Uint8Array = new resultConstructor(totalLength);
	let offset:number = 0;
	for (const arr of arrays) {
		result.set(arr, offset);
		offset += arr.length;
	}
	return result;
}

function setProgress(text: string, start:number, end:number, cur:number, max:number) {
	const percentage = `${(Math.floor((start + (end - start) * cur / max) * 10000) / 100).toFixed(2)}%`;
	progressElement.style.width = percentage;
	progressText.innerText = percentage;
	progressDesc.innerText = text;
}

;(function() {
	progressDesc.innerText = "Click a button to begin...";
})();

function initThree() {
	camera = new THREE.PerspectiveCamera(2.5, window.innerWidth / window.innerHeight, 1, 100);
	camera.position.set(0, 1, 1);
	camera.lookAt(-0.05, 0.15, 0);
	scene = new THREE.Scene();
	var light1 = new THREE.DirectionalLight(0xFFFFFF, 0.5);
	scene.add(light1);
	scene.add(new THREE.AmbientLight(0x444444));
	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute('position', new THREE.BufferAttribute(vertexPoints, 3));
	let color = new Float32Array(vertexPoints.length);
	for(let i = 0; i < color.length; i += 3) {
		color[i] = 0/256;
		color[i + 1] = 256/256;
		color[i + 2] = 85/256;
	}
	const m = new THREE.BufferAttribute(color, 3);
	geometry.addAttribute('color', m);
	geometry.computeVertexNormals();
	var material = new THREE.MeshStandardMaterial({vertexColors: THREE.VertexColors});
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	const raycaster = new THREE.Raycaster();
	if(container) {
		container.appendChild(renderer.domElement);
		renderer.domElement.addEventListener("click", (e) => {
			raycaster.setFromCamera(new THREE.Vector2(
				(e.clientX / window.innerWidth) * 2 - 1,
				-(e.clientY / window.innerHeight) * 2 + 1)
			, camera);
			if(lastBVH === "main") {
				const sTime = Date.now();
				const intersections = bvh.intersectRay(raycaster.ray.origin, raycaster.ray.direction);
				const dTime = Date.now() - sTime;
				if(logContainer) {
					const div = document.createElement("div");
					div.innerText = `Raycast took ${dTime}ms`;
					div.className = "log-item";
					logContainer.prepend(div);
					if(logContainer.children.length >= 5) {
						logContainer.removeChild(logContainer.children[logContainer.children.length - 1]);
					}
				}
				if(intersections.length >= 1) {
					for(let i = 0; i < 9; i++) {
						(m.array[intersections[0].triangleIndex * 9 + i] as any) = 1;
					}
					(geometry.attributes.color as any).needsUpdate = true;
				}
			} else if (lastBVH === "worker") {
				/*
				myWorker.onmessage = (e:MessageEvent) => {
					if(e.data.message === "ray_traced") {
						console.log(":)");
					}
				}
				*/
				myWorker.postMessage({message: "ray_cast", data:{origin:raycaster.ray.origin, direction:raycaster.ray.direction}});
			}
		});
		animate();
	}
}

const Stats = require('stats.js');
var stats = new Stats();
stats.showPanel(2);
stats.dom.style.cssText = "";
stats.dom.style.position = 'absolute';
stats.dom.style.bottom = '0';
stats.dom.style.right = '0';
document.body.appendChild(stats.dom);


function renderMemoryUsage() {
	stats.begin();
	stats.end();
	requestAnimationFrame(renderMemoryUsage);
}
requestAnimationFrame(renderMemoryUsage);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
