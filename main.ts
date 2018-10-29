import * as THREE from 'three';
import { BVHBuilder, BVHBuilderAsync } from './src/BVHBuilder';
let {BVH} = require("./src/bvhtree_old.js");
import * as OldBVH from './src/bvhtree_old.js';

var camera : THREE.PerspectiveCamera;
var scene: THREE.Scene;
var renderer: THREE.WebGLRenderer;
var mesh: THREE.Mesh;
;(async function() {
	let x = new Float32Array(await (await fetch('./resources/models/bun_zipper.f32verts')).arrayBuffer());
	initThree(x);
	await new Promise(res => setTimeout(res, 1000));
	let n = [];
	for(var i = 0; i < x.length; i += 9) {
		n.push([
			{x:x[i + 0], y:x[i + 1], z:x[i + 2]},
			{x:x[i + 3], y:x[i + 4], z:x[i + 5]},
			{x:x[i + 6], y:x[i + 7], z:x[i + 8]}
		]);
	}
	let sTime = Date.now();
	const splitSize = 10;
	let z = BVHBuilder(n, splitSize);
	console.log("!!!", Date.now() - sTime); sTime = Date.now();
	let t = await BVHBuilderAsync(x, splitSize, ({nodesSplit}) => {
		//console.log(nodesSplit);
	});
	console.log("!!!", Date.now() - sTime); sTime = Date.now();
	let v = new OldBVH.BVH(n, splitSize);
	console.log("!!!", Date.now() - sTime); sTime = Date.now();
	function navigateDown(node:any, count:number):any {
		count += 1;
		if(node.node0) {
			let m = navigateDown(node.node0, count);
			let n = navigateDown(node.node1, count);
			return m + n + count;
		}
		if(node._node0) {
			let m = navigateDown(node._node0, count);
			let n = navigateDown(node._node1, count);
			return m + n + count;
		}
		return count;
	}
	console.log(navigateDown(z.rootNode, 0));
	console.log(navigateDown(t.rootNode, 0));
	console.log(navigateDown(v._rootNode, 0));
	console.log(z.rootNode);
	console.log(t.rootNode);
	console.log(v._rootNode);
})();

function initThree(x: Float32Array) {
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set(0, 25, 25);
	camera.lookAt(0, 12.5, 0);
	scene = new THREE.Scene();
	scene.add( new THREE.AmbientLight( 0x444444 ) );
	createLightAndAdd([1, 1, 1], [0xffffff, 0.5], scene);
	createLightAndAdd([0, -1, 0], [0xffffff, 1.5], scene);
	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute( 'position', new THREE.Float32BufferAttribute(x, 3));
	geometry.computeVertexNormals();
	var material = new THREE.MeshStandardMaterial( { color: 0x00ff55, flatShading: true } );
	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
	mesh.scale.set(100, 100, 100);
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	let container = document.getElementById("three-container");
	if(container) {
		container.appendChild( renderer.domElement );
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
	//mesh.rotation.x += 0.005;
	mesh.rotation.y += 0.01;
	renderer.render( scene, camera );
}
