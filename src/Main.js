import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { objIns } from './objectInstantiation'
import { Vector3 } from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';


// add the PointerLockControls to the scene


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(-4, 10, 20); // set camera position

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

var selectedObject = null
var cubes = []
var grid = []
let isDragging = false;


var objs = []
var isIntersect = false
var objToSnap = null

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

  if (isIntersect) {
    objToSnap.slotOne = 'occupied'

    selectedObject = null
    isIntersect = false
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
//move this
export function addObj(objType) {
  var vThree = new Vector3(camera.position.x, camera.position.y, camera.position.z)
  //move the object infront of the camera by a factor of 2
  vThree.addScaledVector(camera.getWorldDirection(new THREE.Vector3()), 20)
  const obj = objIns(vThree, objType)
  if (objType === "floor") {
    const t = {
      obj: obj,
      objType: objType,
      slotOne: 'unoccupied',
      slotTwo: 'unoccupied',
      slotThree: 'unoccupied',
      slotFour: 'unoccupied',
    }
    objs.push(t)
  }
  else {
    const t = {
      obj: obj,
      objType: objType,
      slotOne: 'unoccupied',
    }
    objs.push(t)
  }
  selectedObject = obj
  scene.add(obj);
}
var wIsDown = false
var sIsDown = false
var aIsDown = false
var dIsDown = false
var spaceIsDown = false
var lControl = false
function onKeyDown(event) {
  event.preventDefault();

  
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
  if (event.key === " ") {
    spaceIsDown = true
  }
  if (event.key === "Shift") {
    lControl = true
  }
  if (event.key === 'e') {
    selectedObject = null
  }

}
function onKeyUp(event) {
  event.preventDefault();
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
  if (event.key === " ") {
    spaceIsDown = false
  }
  if (event.key === "Shift") {
    lControl = false
  }


}
function onMouseMove(event) {
  if (selectedObject && lockControls.isLocked) {
    const deltaY = event.movementX * 0.002
    selectedObject.rotation.y -= deltaY;
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
    for (let i = 0; i < objs.length; i++) {
      if (objs[i].obj === selectedObject) {
        continue; // skip the selected object
      }
      objToSnap = objs[i]

      const bounds = new THREE.Box3().setFromObject(objs[i].obj);
      const intersects = bounds.intersectsBox(new THREE.Box3().setFromObject(snapRadius));
      if (!intersects) {
        isIntersect = false
      }
      else {
        if (objs[i].objType === 'wall') {
          if (objs[i].slotOne === 'unoccupied') {
            isIntersect = true
            const offset = 10
            selectedObject.position.copy(objs[i].obj.position)
            selectedObject.position.y += offset
            selectedObject.rotation.set(objs[i].obj.rotation.x, objs[i].obj.rotation.y, objs[i].obj.rotation.z)
          }
        }
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
  if (spaceIsDown) {
    camera.translateY(.01 * deltaTime)
  }
  if (lControl) {
    camera.translateY(-.01 * deltaTime)
  }
  renderer.render(scene, camera);
}
export default animate;
document.addEventListener('keydown', onKeyDown)
document.addEventListener('keyup', onKeyUp)
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);
document.addEventListener('mousemove', onMouseMove)
