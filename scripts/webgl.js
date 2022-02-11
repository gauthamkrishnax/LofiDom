import * as THREE from "three";
import Stats from "stats.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

//Stat Panel
var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

//THREE.JS Scene
const scene = new THREE.Scene();

//THREE.JS Camera
const camera = new THREE.PerspectiveCamera(
	40,
	window.innerWidth / window.innerHeight,
	1,
	500
);
camera.position.set(0, 0, 30);
scene.add(camera);

//Axis Helper
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

//Particles
// const particlesGeometry = new THREE.BufferGeometry;
// const particlesCount = 5000;

// const posArray = new Float32Array(particlesCount * 3)

// for(let i=0; i<particlesCount*3; i++)

//Sphere Mesh (Background)
const geometry = new THREE.SphereGeometry(15, 32, 16);
const material = new THREE.MeshBasicMaterial({
	color: 0x222222,
	wireframe: true,
});
const sphere = new THREE.Mesh(geometry, material);
sphere.scale.set(10, 10, 10);
sphere.position.set(0, 0, -50);
scene.add(sphere);

//GLTF LOADER AND MODEL
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");

let model = null;
let mixer = null;
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load(
	"./WhiteDracoCom.glb",
	function (gltf) {
		mixer = new THREE.AnimationMixer(gltf.scene);
		const action = mixer.clipAction(gltf.animations[0]);
		action.play();
		gltf.scene.scale.set(14, 14, 14);
		gltf.scene.position.set(0, 2, 0);
		scene.add(gltf.scene);
		model = gltf.scene.children[0];
	},
	(xhr) => {
		console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
	},
	(error) => {
		console.log(error);
	}
);

//THREE.JS Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x000000));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

document.getElementById("webglWrapper").appendChild(renderer.domElement);

// Mouse-Move Event
let cameraXvalue = 0;
document.addEventListener("mousemove", (event) => {
	cameraXvalue = (event.clientX - 960) * (20 / 960);
	camera.position.set(-1 * cameraXvalue, 0, 30);
	if (model) camera.lookAt(model.position);
});

//Tick Function
var clock = new THREE.Clock();

function renderScene() {
	if (mixer) mixer.update(clock.getDelta());
	stats.begin();
	renderer.render(scene, camera);
	stats.end();
	requestAnimationFrame(renderScene);
}

// Resize Event
window.addEventListener("resize", onResize, false);
function onResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

renderScene();
