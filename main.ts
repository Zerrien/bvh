import * as THREE from 'three';
import { BVHBuilder, BVHBuilderAsync, BVH, BVHVector3 } from './src';
import { countNodes } from './src/utils';
import { BVH as OldBVH } from './src/bvhtree_old.js';

var camera : THREE.PerspectiveCamera;
var scene: THREE.Scene;
var renderer: THREE.WebGLRenderer;
var mesh: THREE.Mesh;
(window as any).z = null;
let container = document.getElementById("three-container");
let x:any;
;(async function() {
	//for(var i = 0; i < x.length; i++) {
	//	x[i] *= 100;
	//}
	x = new Float32Array(await (await fetch('./resources/models/bun_zipper.f32verts')).arrayBuffer());
	initThree(x);
	//animate();
})();

(window as any).load = (async function() {
	console.log("Loading");
	console.log("Loaded");
});

(window as any).start = function(num:number = 10) {
	console.log("Building");
	const splitSize = 10;
	(window as any).z = BVHBuilder(x, 1);
	console.log("Built");
}

let cs = 0;
let cc = 0;
function initThree(x: Float32Array) {
	camera = new THREE.PerspectiveCamera(0.1, window.innerWidth / window.innerHeight, 1, 100);
	camera.position.set(0, 10, 0);
	camera.lookAt(0, 0, 0);
	scene = new THREE.Scene();
	scene.add( new THREE.AmbientLight( 0x444444 ) );
	createLightAndAdd([1, 1, 1], [0xffffff, 0.5], scene);
	createLightAndAdd([0, -1, 0], [0xffffff, 1.5], scene);
	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute( 'position', new THREE.BufferAttribute(x, 3));
	const colorArray = new Float32Array((<any>x).length);
	for(var i = 0; i < colorArray.length; i++) {
		colorArray[i] = 1;
	}
	var colorBufferAttribute = new THREE.BufferAttribute(colorArray, 3);
	colorBufferAttribute.setDynamic(true);
	geometry.addAttribute('color', colorBufferAttribute);
	geometry.computeVertexNormals();
	var material = new THREE.MeshStandardMaterial( { vertexColors: THREE.VertexColors , flatShading: true } );
	mesh = new THREE.Mesh( geometry, material );
	scene.add(mesh);
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	if(container) {
		container.appendChild( renderer.domElement );
		container.addEventListener('mousemove', function(e) {
			let screenVector = new THREE.Vector3((e.clientX / window.innerWidth) * 2 - 1, -1 * (e.clientY / window.innerHeight) * 2 + 1, 0.5).unproject(camera);
			let direction = screenVector.clone().sub(camera.position).normalize();
			const sDate = performance.now();
			let intersections:any = (window as any).z.intersectRay(new BVHVector3(screenVector.x, screenVector.y, screenVector.z), new BVHVector3(direction.x, direction.y, direction.z), true);
			console.log(intersections.length);
			
			//for(var j = 0; j < intersections.length; j++) {
			//	let intersection = intersections[j];
			//	for(var i = intersection.triangleIndex * 9; i < intersection.triangleIndex * 9 + 9; i += 3) {
			//		colorArray[i] = 1;
			//		colorArray[i + 1] = 0;
			//		colorArray[i + 2] = 0;
			//	}
			//	(mesh.geometry as any).attributes.color.updateRange.offset = intersection.triangleIndex * 9;
			//	(mesh.geometry as any).attributes.color.needsUpdate = true;
			//}
			
		});
	}
	animate();
	function createLightAndAdd(pos:number[], args:number[], scene:THREE.Scene) {
		var light1 = new THREE.DirectionalLight( args[0], args[1] );
		light1.position.set( pos[0], pos[1], pos[2] );
		scene.add( light1 );
	}
}

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
