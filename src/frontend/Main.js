import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { objIns } from './objectInstantiation'
import { Vector3 } from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { getIntersectObj, setPosition, setRotation } from './inAnimation';

// add the PointerLockControls to the scene


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(-4, 10, 20); // set camera position
camera.rotateX(-.3)

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
  if (selectedObject) {
    addSnaps(selectedObject)

    selectedObject = null
    isIntersect = false
    objToSnap = null


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
function addSnaps(selectedObject) {
  const objGeometry = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  if (selectedObject.objType === 'floor') {
    // Add snap points to floor object
    const snapPositions = [
      new THREE.Vector3(5 - 0.1, 2, 0),
      new THREE.Vector3(-5 + 0.1, 2, 0),
      new THREE.Vector3(0, 2, 5 - 0.1),
      new THREE.Vector3(0, 2, -5 - 0.1),
    ];

    for (const pos of snapPositions) {
      // Rotate snap position based on object orientation
      pos.applyQuaternion(selectedObject.obj.quaternion);

      const snapObj = new THREE.Mesh(objGeometry, mat);
      snapObj.position.copy(selectedObject.obj.position).add(pos);
      snapObj.rotation.y = selectedObject.obj.rotation.y
      scene.add(snapObj);


      snapObjs.push({
        obj: snapObj,
        objType: 'floor',
      });
    }
  }

  if (selectedObject.objType === 'wall') {
    // Add snap point to wall object
    const snapPos = new THREE.Vector3(0, 5, 0);
    snapPos.applyQuaternion(selectedObject.obj.quaternion);

    const snapObj = new THREE.Mesh(objGeometry, mat);
    snapObj.position.copy(selectedObject.obj.position).add(snapPos);
    snapObj.rotation.y = selectedObject.obj.rotation.y;
    scene.add(snapObj);


    snapObjs.push({
      obj: snapObj,
      objType: 'wall',
    });
  }

  if (selectedObject.objType === 'floorT') {
    // Add snap points to floorT object

    const snapPositions = {
      back: new THREE.Vector3(0, 4.5, -.2),
      right: new THREE.Vector3(-4.33013, 4.5, -2.5),
      left: new THREE.Vector3(-4.33013, 4.5, 2.5),
    };

    // Rotate snap positions based on object orientation
    snapPositions.right.applyQuaternion(selectedObject.obj.quaternion);
    snapPositions.left.applyQuaternion(selectedObject.obj.quaternion);

    const snapObjLeft = new THREE.Mesh(objGeometry, mat);
    snapObjLeft.position.copy(selectedObject.obj.position).add(snapPositions.left);
    snapObjLeft.quaternion.copy(selectedObject.obj.quaternion);
    snapObjLeft.rotateY(1.0472);
    scene.add(snapObjLeft);
    snapObjs.push({
      obj: snapObjLeft,
      objType: 'floorLeftT',
    });

    const snapObjRight = new THREE.Mesh(objGeometry, mat);
    snapObjRight.position.copy(selectedObject.obj.position).add(snapPositions.right);
    snapObjRight.quaternion.copy(selectedObject.obj.quaternion);
    snapObjRight.rotateY(-1.0472);
    scene.add(snapObjRight);
    snapObjs.push({
      obj: snapObjRight,
      objType: 'floorRightT',
    });

    const snapObjBack = new THREE.Mesh(objGeometry, mat);
    snapObjBack.position.copy(selectedObject.obj.position).add(snapPositions.back);
    scene.add(snapObjBack);
    snapObjs.push({
      obj: snapObjBack,
      objType: 'floorBackT',
    });
  }


}

//move this
export function addObj(objType) {
  var vThree = new Vector3(camera.position.x, camera.position.y, camera.position.z)
  //move the object infront of the camera by a factor of 2
  vThree.addScaledVector(camera.getWorldDirection(new THREE.Vector3()), 20)
  const obj = objIns(vThree, objType)
  const t = {
    obj: obj,
    objType: objType,
  }
  objs.push(t)
  if (selectedObject) {
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
    snapRadius.position.set(v.x, v.y - 10, v.z)
    if (snapObjs.length === 0) {
      isIntersect = false
      v = camera.getWorldPosition(new THREE.Vector3())
      v.addScaledVector(camera.getWorldDirection(new THREE.Vector3()), 13)
      selectedObject.obj.position.set(v.x, v.y - 10, v.z)
    }
    else {
      for (let i = 0; i < snapObjs.length; i++) {
        objToSnap = snapObjs[i]
        const intersectedObj = getIntersectObj(snapObjs[i], snapRadius)

        if (!intersectedObj) {
          objToSnap = null
          isIntersect = false
          v = camera.getWorldPosition(new THREE.Vector3())
          v.addScaledVector(camera.getWorldDirection(new THREE.Vector3()), 13)
          selectedObject.obj.position.set(v.x, v.y - 10, v.z)

        }
        else {
          if (selectedObject.objType === "floor" && objToSnap.objType === "wall") {
          }
          else {

            isIntersect = true
            selectedObject.obj.position.copy(setRotation(intersectedObj, selectedObject))
            selectedObject.obj.position.copy(setPosition(intersectedObj, selectedObject))

          }
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
