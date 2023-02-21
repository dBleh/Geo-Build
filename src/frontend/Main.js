import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { objIns } from './objectInstantiation'
import { Vector3 } from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { getIntersectObj } from './inAnimation';

// add the PointerLockControls to the scene


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(-4, 10, 20); // set camera position

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

var selectedObject = null
var cubes = []
var grid = []
let isDragging = false;

var snapObjs = []
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

  if (isIntersect && objToSnap.position) {
    if (selectedObject.objType === "wall") {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const objGeometry = new THREE.BoxGeometry(1, 1, 1);
      const obj = new THREE.Mesh(objGeometry, mat);
      obj.position.set(selectedObject.obj.position.x, selectedObject.obj.position.y + 4.5, selectedObject.obj.position.z)
      const top = {
        obj: obj,
        objType: "wall",
      }
      scene.add(obj)
      snapObjs.push(top)
    }
    else {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const objGeometry = new THREE.BoxGeometry(1, 1, 1);
      const objRight = new THREE.Mesh(objGeometry, mat);
      objRight.position.set(selectedObject.obj.position.x + 4.5, selectedObject.obj.position.y + 2, selectedObject.obj.position.z)
      const right = {
        obj: objRight,
        objType: "floor",
      }
      const objFront = new THREE.Mesh(objGeometry, mat);
      objFront.position.set(selectedObject.obj.position.x - 4.5, selectedObject.obj.position.y + 2, selectedObject.obj.position.z)
      const front = {
        obj: objFront,
        objType: "floor",
      }
      const objLeft = new THREE.Mesh(objGeometry, mat);
      objLeft.position.set(selectedObject.obj.position.x, selectedObject.obj.position.y + 2, selectedObject.obj.position.z + 4.5)
      const left = {
        obj: objLeft,
        objType: "floor",
      }
      const objBack = new THREE.Mesh(objGeometry, mat);
      objBack.position.set(selectedObject.obj.position.x, selectedObject.obj.position.y + 2, selectedObject.obj.position.z - 4.5)
      const back = {
        obj: objBack,
        objType: "floor",
      }
      scene.add(objRight)
      scene.add(objFront)
      scene.add(objLeft)
      scene.add(objBack)

      snapObjs.push(right)
      snapObjs.push(left)
      snapObjs.push(front)
      snapObjs.push(back)
    }
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
    }

    objs.push(t)
  }
  else {
    const t = {
      obj: obj,
      objType: objType,
    }
    if (snapObjs.length === 0) {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const objGeometry = new THREE.BoxGeometry(1, 1, 1);
      const objBack = new THREE.Mesh(objGeometry, mat);
      objBack.position.set(obj.position.x, obj.position.y + 10, obj.position.z)
      const back = {
        obj: objBack,
        objType: "floor",
      }
      scene.add(back.obj)
      snapObjs.push(back)
    }
    objs.push(t)
  }
  if(selectedObject){
    scene.remove(selectedObject.obj)
  }
  selectedObject = {
    obj: obj,
    objType: objType,
  }
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
    selectedObject.obj.rotation.y -= deltaY;
    selectedObject.obj.rotation.z = 0;
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
    if (snapObjs.length === 0) {
      isIntersect = false
      v = camera.getWorldPosition(new THREE.Vector3())
      v.addScaledVector(camera.getWorldDirection(new THREE.Vector3()), 13)
      selectedObject.obj.position.set(v.x, v.y, v.z)
    }
    else {
      for (let i = 0; i < snapObjs.length; i++) {
        objToSnap = snapObjs[i].obj
        const intersectedObj = getIntersectObj(snapObjs[i], snapRadius)

        if (!intersectedObj) {
          isIntersect = false
          v = camera.getWorldPosition(new THREE.Vector3())
          v.addScaledVector(camera.getWorldDirection(new THREE.Vector3()), 13)
          selectedObject.obj.position.set(v.x, v.y, v.z)

        }
        else {
          const offset = selectedObject.obj.geometry.parameters.height / 2
          isIntersect = true
          selectedObject.obj.rotation.set(intersectedObj.obj.rotation.x, intersectedObj.obj.rotation.y, intersectedObj.obj.rotation.z)
          selectedObject.obj.position.copy(intersectedObj.obj.position)
          selectedObject.obj.position.y += offset
          
          break

        }
      }
    }
    snapRadius.visible = true
  }
  if (!isDragging) {
    snapRadius.visible = false
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
