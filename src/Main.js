import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const mouse = new THREE.Vector2();

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(-4,10,20); // set camera position

// Create a material
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Create a mesh
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(cubeGeometry, material);
cube.position.set(-10,10,0)
scene.add(cube);

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 10);
scene.add(light);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x7393B3);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableKeys = true; // enable keyboard controls

const size = 100;
const divisions = 100;
const colorCenterLine = 0x444444;
const colorGrid = 0x888788;
const gridHelper = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);
scene.add(gridHelper);

function onClick(event) {
  // calculate the mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  var raycaster = new THREE.Raycaster();

  // cast a ray from the camera through the mouse position
  raycaster.setFromCamera(mouse, camera);

  // get the intersected objects
  var intersects = raycaster.intersectObjects(scene.children, true);

  // loop through the intersected objects
  for (let i = 0; i < intersects.length; i++) {
    const object = intersects[i].object;
    // change the color of the clicked object
    object.material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
  }
}
var x = 10
var y = 10
var z = 10

export function addCube(){
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cube = new THREE.Mesh(cubeGeometry, material);
  cube.position.set(x,y,z)
  x++
  y++
  z++
  scene.add(cube);
}

// Render the scene
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
export default animate;

document.addEventListener('click', onClick);
