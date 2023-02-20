import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { objIns } from './objectInstantiation'
import { Vector3 } from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';


// add the PointerLockControls to the scene

const mouse = new THREE.Vector2();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(-4, 10, 20); // set camera position

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

var selectedObject = null
var cubes = []
var grid = []
let isDragging = false;
var tempCubes = []
var floorObjs = [[], []]
var isIntersect = false

const lockControls = new PointerLockControls(camera, document.body);
scene.add(lockControls.getObject())

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 10);
scene.add(light);

const gridHelper = new THREE.GridHelper(100, 100, 0x444444, 0x888788);
scene.add(gridHelper);
grid.push(gridHelper)

var snapRadius = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), material);
scene.add(snapRadius)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x7393B3);

function onMouseDown(event) {
  // calculate the mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  var raycaster = new THREE.Raycaster();
  // cast a ray from the camera through the mouse position
  raycaster.setFromCamera(mouse, camera);
  const objectsToIntersect = [...cubes];
  // get the intersected objects
  var intersects = raycaster.intersectObjects(objectsToIntersect, true);

  // Find the closest intersected object to the camera
  let closestDistance = Infinity;
  let closestObject = null;
  for (let i = 0; i < intersects.length; i++) {
    const distance = camera.position.distanceTo(intersects[i].object.position);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestObject = intersects[i].object;
    }
  }
  if(closestObject !== null){
    selectedObject = closestObject;

  }
  if(isIntersect){
    selectedObject = null
    isIntersect = false
  }

  // Set the selected object to the closest one

  //adds all but the currently selected cube to intersect list
  for (var i = 0; i < cubes.length; i++) {
    if (cubes[i] !== selectedObject) {
      tempCubes.push(cubes[i])
    }
  }
}

function onMouseUp() {

}

const dragControls = new DragControls(cubes, camera, renderer.domElement)
dragControls.addEventListener('dragstart', function (event) {
  isDragging = true;
  event.object.material.opacity = 0.33;
})
dragControls.addEventListener('dragend', function (event) {
  isDragging = false;
  event.object.material.opacity = 1;
 
})

export function addObj(objType) {
  var vThree = new Vector3(camera.position.x, camera.position.y, camera.position.z)
  //move the object infront of the camera by a factor of 2
  vThree.addScaledVector(camera.getWorldDirection(new THREE.Vector3()), 20)
  const obj = objIns(vThree, objType)
  objType === "floor" ? floorObjs.push(obj) : cubes.push(obj)
  scene.add(obj);
}
var wIsDown = false
var sIsDown = false
var aIsDown = false
var dIsDown = false

function onKeyDown(event) {
  if (event.key === 'l') {
    lockControls.lock();
    console.log("pointer locked to screen")
  }
  
  if (event.key === "w") {
    wIsDown = true
  }
  if (event.key === "s") {
    sIsDown = true
  }
  if (event.key === "a") {
    aIsDown = true
  }
  if (event.key === "d") {
    dIsDown = true
  }
  if (event.key === 'e') {
    selectedObject = null
  }
  
}
function onKeyUp(event) {
  if (event.key === 'w') {
    wIsDown = false
  }
  if (event.key === "s") {
    sIsDown = false
  }
  if (event.key === "a") {
    aIsDown = false
  }
  if (event.key === "d") {
    dIsDown = false
  }

  
}
function onMouseMove(event) {
  if (selectedObject && lockControls.isLocked) {
    // calculate the change in mouse position
    const deltaY = event.movementX * 0.002
    // rotate the selected object around the x-axis by the mouse movement
    selectedObject.rotation.y -= deltaY;
    // restrict the rotation to the x-axis only
    selectedObject.rotation.z = 0;
  }
}

let time = new Date()
let lastTime = time
// Render the scene
function animate() {
  requestAnimationFrame(animate);
  time = new Date()
  var deltaTime = time - lastTime
  lastTime = time
 
 

  if (selectedObject) {
    var v = camera.getWorldPosition(new THREE.Vector3())
    v.addScaledVector(camera.getWorldDirection(new THREE.Vector3()), 13)
    snapRadius.position.set(v.x, v.y, v.z)
    for (let i = 0; i < cubes.length; i++) {
      if (cubes[i] === selectedObject) {
        continue; // skip the selected object
      }
      
        
        const bounds = new THREE.Box3().setFromObject(cubes[i]);
        const intersects = bounds.intersectsBox(new THREE.Box3().setFromObject(snapRadius));
        if(!intersects) {
          isIntersect = false
        }
        else {
          isIntersect = true
          const offset = 10
          selectedObject.position.copy(cubes[i].position)
          selectedObject.position.y +=offset 
          selectedObject.rotation.set(cubes[i].rotation.x,cubes[i].rotation.y,cubes[i].rotation.z) 
          break
        } 

    }

    snapRadius.visible = true

  }
  if (selectedObject && !isIntersect) {
    
    
    v = camera.getWorldPosition(new THREE.Vector3())
    v.addScaledVector(camera.getWorldDirection(new THREE.Vector3()), 13)
    selectedObject.position.set(v.x, v.y, v.z)

  }
  if(!selectedObject){
    tempCubes = []
  }
  if (!isDragging) {
    //snapRadius.visible = false
  }
  if (wIsDown) {
    camera.position.addScaledVector(camera.getWorldDirection(new THREE.Vector3()), .01 * deltaTime)
  }
  if (sIsDown) {
    camera.position.addScaledVector(camera.getWorldDirection(new THREE.Vector3()), -.01 * deltaTime)
  }
  if (aIsDown) {
    camera.translateX(-.01 * deltaTime)
  }
  if (dIsDown) {
    camera.translateX(.01 * deltaTime)
  }


  renderer.render(scene, camera);
}
export default animate;
document.addEventListener('keydown', onKeyDown)
document.addEventListener('keyup', onKeyUp)
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);
document.addEventListener('mousemove', onMouseMove)
