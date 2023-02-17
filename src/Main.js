import * as THREE from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const mouse = new THREE.Vector2();
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(-4, 10, 20); // set camera position

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

var selectedObject = null
var x = 10, y = 10, z = 10

const cube = new THREE.Mesh(cubeGeometry, material);
cube.position.set(-10, 10, 0)
scene.add(cube);

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 10);
scene.add(light);

const gridHelper = new THREE.GridHelper(100, 100, 0x444444, 0x888788);
scene.add(gridHelper);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x7393B3);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableKeys = true;

var mouseInitalx = 0
var mouseInitaly = 0
function onMouseDown(event) {
  // calculate the mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  mouseInitalx = mouse.x
  mouseInitaly = mouse.y

  var raycaster = new THREE.Raycaster();

  // cast a ray from the camera through the mouse position
  raycaster.setFromCamera(mouse, camera);

  // get the intersected objects
  var intersects = raycaster.intersectObjects(scene.children, true);

  // loop through the intersected objects
  for (let i = 0; i < intersects.length; i++) {
    const object = intersects[i].object;
    if (selectedObject && selectedObject !== object) {
      // reset the material of the previously selected object
      selectedObject.material = material;
    }
    object.material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    selectedObject = object;
  }
  if (selectedObject) {
    controls.enabled = false
  }
  
}
function onMouseUp(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  var raycaster = new THREE.Raycaster();

  // cast a ray from the camera through the mouse position
  raycaster.setFromCamera(mouse, camera);

  // get the intersected objects
  var intersects = raycaster.intersectObjects(scene.children, true);

  selectedObject = null
  controls.enabled = true
  for (let i = 0; i < intersects.length; i++) {

    intersects[i].material = new THREE.MeshBasicMaterial({ color: 0x000000 })}
}
var lastPositionX = 0
var curX = 0
var deltaX = 0
var lastPositionY = 0
var curY = 0
var deltaY = 0
var lastPositionZ = 0
var curZ = 0
var deltaZ = 0
function onMouseMove(event) {
  curX = event.clientX
  deltaX = curX - lastPositionX
  lastPositionX = curX
  curY = event.clientY
  deltaY = curY - lastPositionY
  lastPositionY = curY
  curZ = event.clientZ // There is no clientZ property in the MouseEvent object
  deltaZ = curZ - lastPositionZ // Similarly, this line will cause an error
  lastPositionZ = curZ // And so will this
  console.log(Math.sin(camera.quaternion.y))
  var delta = new THREE.Vector3((Math.cos(camera.quaternion.y)* deltaX * 0.03), -deltaY * 0.03, -(Math.sin(camera.quaternion.y) * deltaX * 0.03)); // Z component is 0, assuming you only want to move in the x-y plane

  if (selectedObject) {
    
    selectedObject.position.add(delta); // Add delta to the current position of the object
  }
}
export function addCube() {
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cube = new THREE.Mesh(cubeGeometry, material);
  cube.position.set(x, y, z)
  x++;
  y++;
  z++;

  scene.add(cube);
}

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  

  renderer.render(scene, camera);
}
export default animate;




document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);