import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

//Texture Loader
const htmlLoadContainer = document.querySelector(".loading"); //Black Loading Screen
const loadingManager = new THREE.LoadingManager(
	// Loading Done
	() => {
		//To Not immediatly end loading when done.
		setTimeout(() => {
			htmlLoadContainer.classList.add("ending");
		}, 100);
		// Wait 1 sec to hide it (Fade out Animation duration)
		setTimeout(() => {
			htmlLoadContainer.style.display = "none";
		}, 1000);
	},
	// Loading in progress
	(itemsURL, itemsLoaded, itemsTotal) => {
		htmlLoadContainer.children[1].textContent = Math.round(
			(itemsLoaded / itemsTotal) * 100
		);
		htmlLoadContainer.children[0].children[0].style.clipPath = `polygon(0 0, 100% 0, 100% ${
			(itemsLoaded / itemsTotal) * 100
		}%, 0 ${(itemsLoaded / itemsTotal) * 100}%)`;
	}
);
const textureLoader = new THREE.TextureLoader(loadingManager);
const loader = new GLTFLoader(loadingManager);
const dracoLoader = new DRACOLoader(loadingManager);

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

//Particles
const particleAlpha = textureLoader.load("./starAlpha.jpg");
const particlesGeometry = new THREE.BufferGeometry();
const particlesMaterial = new THREE.PointsMaterial({
	size: 0.1,
	map: particleAlpha,
	transparent: true,
	blending: THREE.AdditiveBlending,
});
const particlesCount = 3000; //Number of Particles
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
	posArray[i] = (Math.random() - 0.5) * 50;
}
particlesGeometry.setAttribute(
	"position",
	new THREE.BufferAttribute(posArray, 3)
);
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

//Sphere Mesh (Background)
const geometry = new THREE.SphereGeometry(15, 32, 16);
const sphereMap = textureLoader.load("./gradient.jpg");
const sphere = new THREE.Mesh(
	geometry,
	new THREE.MeshBasicMaterial({
		map: sphereMap,
		wireframe: true,
	})
);
sphere.scale.set(10, 10, 10);
sphere.position.set(0, 0, -50);
scene.add(sphere);

//GLTF LOADER AND MODEL
dracoLoader.setDecoderPath("./draco/"); //Web Assembly Code.
loader.setDRACOLoader(dracoLoader); //Draco loader to GLTF loader

let model = null,
	mixer = null,
	action = null;

loader.load("./model.glb", function (gltf) {
	//Animation from GLTF model
	mixer = new THREE.AnimationMixer(gltf.scene);
	action = mixer.clipAction(gltf.animations[0]);
	action.play();

	model = gltf.scene.children[0];
	model.children[1].children[0].material = new THREE.MeshNormalMaterial({});

	gltf.scene.scale.set(14, 14, 14);
	gltf.scene.position.set(0, 2, 0);
	scene.add(gltf.scene);
});

//THREE.JS Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x08070c)); //Canvas Background Colour
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

//Canvas Element
document.getElementById("webglWrapper").appendChild(renderer.domElement);

// Mouse-Move Event
// let mouseX = 0;
let cameraXvalue = 0; //Mouse to Three.js Camera position
let mouseY = 0;

//Track Mouse Movement
var mouseMoveEvent = (event) => {
	cameraXvalue = (event.clientX - 960) * (20 / 960);
	// mouseX = event.clientX;
	mouseY = event.clientY;
};

// Track Orientation Movement
function handleOrientation(event) {
	cameraXvalue = event.gamma * (20 / 90); // In degree in the range [-90,90)
}

document.addEventListener("mousemove", mouseMoveEvent);
window.addEventListener("deviceorientation", handleOrientation);

//Tick Function
var clock = new THREE.Clock();

function renderScene() {
	//Update Model Animation
	if (mixer) mixer.update(clock.getDelta());

	//Set Camera position and lookat model
	camera.position.set(-1 * cameraXvalue, 0, 30);
	if (model) camera.lookAt(model.position);

	//Rotate particles based on mouse Y
	particles.rotation.y = mouseY * clock.getElapsedTime() * 0.00003; // Slow down animation

	renderer.render(scene, camera);
	requestAnimationFrame(renderScene);
}

renderScene();

// Resize Event
window.addEventListener("resize", onResize, false);
function onResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

// Play and Pause model animation according to video play state.
function animateModel(onOffNumber) {
	if (onOffNumber === 0) action.paused = true;
	else if (onOffNumber === 1) action.paused = false;
}

export { animateModel };
