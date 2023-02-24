import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { objIns } from './objectInstantiation'
import { Vector3 } from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { getIntersectObj, setPosition} from './inAnimation';

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
const isVisible = true
var objHighlighted = null
var origMat = null


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
  if (!eIsdown) {
    if (selectedObject) {

      if ((selectedObject.objType === 'floor' || selectedObject.objType === 'floorT') && objToSnap === null) {

        if (selectedObject.obj.position.y < -5 || selectedObject.obj.position.y > 5) {
          scene.remove(selectedObject.obj)
          selectedObject = null
          isIntersect = false
          objToSnap = null
        }
      }
      if ((selectedObject.objType === 'wall' && objToSnap === null) || (selectedObject.objType === 'roof' && objToSnap === null)) {
        scene.remove(selectedObject.obj)
        selectedObject = null
        isIntersect = false
        objToSnap = null

      }
      else {
        addSnaps(selectedObject)
      }

      selectedObject = null
      isIntersect = false
      objToSnap = null


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
function addSnaps(selectedObject) {
  const objGeometry = new THREE.BoxGeometry(1, 1, 1);
  const matT = new THREE.MeshBasicMaterial({ color: 0xf00fff });
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  if (selectedObject.objType === 'floor') {
    // Add snap points to floor object
    const snapPositions = {
      right: new THREE.Vector3(5, 2, 0),
      back: new THREE.Vector3(0, 2, 5),
      front: new THREE.Vector3(0, 2, - 5),
      left: new THREE.Vector3(-5, 2, 0),
    };

    const q = new THREE.Quaternion();
    q.copy(selectedObject.obj.quaternion);

    snapPositions.right.applyQuaternion(q);
    snapPositions.left.applyQuaternion(q);
    snapPositions.front.applyQuaternion(q);
    snapPositions.back.applyQuaternion(q);

    const mat = new THREE.MeshBasicMaterial({ color: 0x0000ff });

    const objGeometry = new THREE.BoxGeometry(1, 1, 1);

    const snapObjLeft = new THREE.Mesh(objGeometry, mat);
    snapObjLeft.position.copy(selectedObject.obj.position).add(snapPositions.left);
    snapObjLeft.quaternion.copy(selectedObject.obj.quaternion);
    snapObjLeft.rotateY(Math.PI / 2)
    scene.add(snapObjLeft);
    snapObjLeft.visible = isVisible
    snapObjs.push({
      obj: snapObjLeft,
      objType: 'floorLeft',
    });
    const snapObjRight = new THREE.Mesh(objGeometry, mat);
    snapObjRight.position.copy(selectedObject.obj.position).add(snapPositions.right);
    snapObjRight.quaternion.copy(selectedObject.obj.quaternion);
    snapObjRight.rotateY(-Math.PI / 2)
    scene.add(snapObjRight);
    snapObjRight.visible = isVisible
    snapObjs.push({
      obj: snapObjRight,
      objType: 'floorRight',
    });
    const snapObjBack = new THREE.Mesh(objGeometry, matT);
    snapObjBack.position.copy(selectedObject.obj.position).add(snapPositions.back);
    snapObjBack.quaternion.copy(selectedObject.obj.quaternion);
    snapObjBack.rotateY(Math.PI)
    scene.add(snapObjBack);
    snapObjBack.visible = isVisible
    snapObjs.push({
      obj: snapObjBack,
      objType: 'floorBack',
    });
    const snapObjFront = new THREE.Mesh(objGeometry, matT);
    snapObjFront.position.copy(selectedObject.obj.position).add(snapPositions.front);
    snapObjFront.quaternion.copy(selectedObject.obj.quaternion);
    scene.add(snapObjFront);
    snapObjFront.visible = isVisible
    snapObjs.push({
      obj: snapObjFront,
      objType: 'floorFront',
    });
  }
  if (selectedObject.objType === 'roof') {
    // Add snap points to floor object
    const snapPositions = {
      right: new THREE.Vector3(5, 0, 0),
      back: new THREE.Vector3(0, 0, 5),
      front: new THREE.Vector3(0, 0, - 5),
      left: new THREE.Vector3(-5, 0, 0),
    };

    const q = new THREE.Quaternion();
    q.copy(selectedObject.obj.quaternion);

    snapPositions.right.applyQuaternion(q);
    snapPositions.left.applyQuaternion(q);
    snapPositions.front.applyQuaternion(q);
    snapPositions.back.applyQuaternion(q);

    const mat = new THREE.MeshBasicMaterial({ color: 0x0000ff });

    const objGeometry = new THREE.BoxGeometry(1, 1, 1);

    const snapObjLeft = new THREE.Mesh(objGeometry, mat);
    snapObjLeft.position.copy(selectedObject.obj.position).add(snapPositions.left);
    snapObjLeft.quaternion.copy(selectedObject.obj.quaternion);
    snapObjLeft.rotateY(Math.PI / 2)
    scene.add(snapObjLeft);
    snapObjLeft.visible = isVisible
    snapObjs.push({
      obj: snapObjLeft,
      objType: 'roofLeft',
    });
    const snapObjRight = new THREE.Mesh(objGeometry, mat);
    snapObjRight.position.copy(selectedObject.obj.position).add(snapPositions.right);
    snapObjRight.quaternion.copy(selectedObject.obj.quaternion);
    snapObjRight.rotateY(-Math.PI / 2)
    scene.add(snapObjRight);
    snapObjRight.visible = isVisible
    snapObjs.push({
      obj: snapObjRight,
      objType: 'roofRight',
    });
    const snapObjBack = new THREE.Mesh(objGeometry, matT);
    snapObjBack.position.copy(selectedObject.obj.position).add(snapPositions.back);
    snapObjBack.quaternion.copy(selectedObject.obj.quaternion);
    snapObjBack.rotateY(Math.PI)
    scene.add(snapObjBack);
    snapObjBack.visible = isVisible
    snapObjs.push({
      obj: snapObjBack,
      objType: 'roofBack',
    });
    const snapObjFront = new THREE.Mesh(objGeometry, matT);
    snapObjFront.position.copy(selectedObject.obj.position).add(snapPositions.front);
    snapObjFront.quaternion.copy(selectedObject.obj.quaternion);
    scene.add(snapObjFront);
    snapObjFront.visible = isVisible
    snapObjs.push({
      obj: snapObjFront,
      objType: 'roofFront',
    });
  }
  if (selectedObject.objType === 'wall') {
    // Add snap point to wall object
    const snapPos = new THREE.Vector3(0, 5, 0);
    const snapObj = new THREE.Mesh(objGeometry, mat);
    snapPos.applyQuaternion(selectedObject.obj.quaternion);
    snapObj.position.copy(selectedObject.obj.position).add(snapPos);
    snapObj.quaternion.copy(selectedObject.obj.quaternion);
    scene.add(snapObj);
    snapObj.visible = isVisible
    snapObjs.push({
      obj: snapObj,
      objType: 'wall',
    });
  }
  if (selectedObject.objType === 'door') {
    // Add snap point to wall object
    const snapPos = new THREE.Vector3(0, 5, 0);
    const snapObj = new THREE.Mesh(objGeometry, mat);
    snapPos.applyQuaternion(selectedObject.obj.quaternion);
    snapObj.position.copy(selectedObject.obj.position).add(snapPos);
    snapObj.quaternion.copy(selectedObject.obj.quaternion);
    scene.add(snapObj);
    snapObj.visible = isVisible
    snapObjs.push({
      obj: snapObj,
      objType: 'door',
    });
  }
  if (selectedObject.objType === 'floorT') {
    // Add snap points to floorT object
    const snapPositions = {
      back: new THREE.Vector3(0, 4.5, 0),
      right: new THREE.Vector3(-4.33013, 4.5, -2.5),
      left: new THREE.Vector3(-4.33013, 4.5, 2.5),
    };
    // Rotate snap positions based on object orientation
    snapPositions.right.applyQuaternion(selectedObject.obj.quaternion);
    snapPositions.left.applyQuaternion(selectedObject.obj.quaternion);
    snapPositions.back.applyQuaternion(selectedObject.obj.quaternion);
    // Define the dimensions of the squares
    // Define the geometry for the squares
    const squareGeometry = new THREE.BoxGeometry(1, 1, 1);
    // Create the square meshes and add them to the scene
    const snapObjLeft = new THREE.Mesh(squareGeometry, mat);
    snapObjLeft.position.copy(selectedObject.obj.position).add(snapPositions.left);
    snapObjLeft.quaternion.copy(selectedObject.obj.quaternion);
    snapObjLeft.rotateY(1.0472 + Math.PI / 2);
    scene.add(snapObjLeft);
    snapObjLeft.visible = isVisible
    snapObjs.push({
      obj: snapObjLeft,
      objType: 'floorLeftT',
    });
    const snapObjRight = new THREE.Mesh(objGeometry, mat);
    snapObjRight.position.copy(selectedObject.obj.position).add(snapPositions.right);
    snapObjRight.quaternion.copy(selectedObject.obj.quaternion);
    snapObjRight.rotateY(-1.0472 + Math.PI / 2);
    // Get the inverse of the snap object's world matrix
    const snapWorldInverse = new THREE.Matrix4();
    snapWorldInverse.copy(snapObjRight.matrixWorld).invert();
    // Transform the position of the new object by the inverse of the snap object's world matrix
    scene.add(snapObjRight);
    snapObjRight.visible = isVisible
    snapObjs.push({
      obj: snapObjRight,
      objType: 'floorRightT',
    });
    const snapObjBack = new THREE.Mesh(squareGeometry, mat);
    snapObjBack.position.copy(selectedObject.obj.position).add(snapPositions.back);
    snapObjBack.quaternion.copy(selectedObject.obj.quaternion);
    snapObjBack.rotateY(-Math.PI / 2)
    scene.add(snapObjBack);
    snapObjBack.visible = isVisible
    snapObjs.push({
      obj: snapObjBack,
      objType: 'floorBackT',
    });
  }
  if (selectedObject.objType === 'roofT') {
    // Add snap points to floorT object
    const snapPositions = {
      back: new THREE.Vector3(0, .1, 0),
      right: new THREE.Vector3(-4.33013, .1, -2.5),
      left: new THREE.Vector3(-4.33013, .1, 2.5),
    };
    // Rotate snap positions based on object orientation
    snapPositions.right.applyQuaternion(selectedObject.obj.quaternion);
    snapPositions.left.applyQuaternion(selectedObject.obj.quaternion);
    snapPositions.back.applyQuaternion(selectedObject.obj.quaternion);
    // Define the dimensions of the squares
    // Define the geometry for the squares
    const squareGeometry = new THREE.BoxGeometry(1, 1, 1);
    // Create the square meshes and add them to the scene
    const snapObjLeft = new THREE.Mesh(squareGeometry, mat);
    snapObjLeft.position.copy(selectedObject.obj.position).add(snapPositions.left);
    snapObjLeft.quaternion.copy(selectedObject.obj.quaternion);
    snapObjLeft.rotateY(1.0472 + Math.PI / 2);
    scene.add(snapObjLeft);
    snapObjLeft.visible = isVisible
    snapObjs.push({
      obj: snapObjLeft,
      objType: 'roofLeftT',
    });
    const snapObjRight = new THREE.Mesh(objGeometry, mat);
    snapObjRight.position.copy(selectedObject.obj.position).add(snapPositions.right);
    snapObjRight.quaternion.copy(selectedObject.obj.quaternion);
    snapObjRight.rotateY(-1.0472 + Math.PI / 2);
    // Get the inverse of the snap object's world matrix
    const snapWorldInverse = new THREE.Matrix4();
    snapWorldInverse.copy(snapObjRight.matrixWorld).invert();
    // Transform the position of the new object by the inverse of the snap object's world matrix
    scene.add(snapObjRight);
    snapObjRight.visible = isVisible
    snapObjs.push({
      obj: snapObjRight,
      objType: 'roofRightT',
    });
    const snapObjBack = new THREE.Mesh(squareGeometry, mat);
    snapObjBack.position.copy(selectedObject.obj.position).add(snapPositions.back);
    snapObjBack.quaternion.copy(selectedObject.obj.quaternion);
    snapObjBack.rotateY(-Math.PI / 2)
    scene.add(snapObjBack);
    snapObjBack.visible = isVisible
    snapObjs.push({
      obj: snapObjBack,
      objType: 'roofBackT',
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
var eIsdown = false
var sIsDown = false
var aIsDown = false
var dIsDown = false
var spaceIsDown = false
var lControl = false



// Add the box to the document

function onKeyDown(event) {
  event.preventDefault();
  if (event.key === 'e') {
    eIsdown = true
    lockControls.unlock();
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
  if (event.key === "x") {
    lControl = true
  }


}
function onKeyUp(event) {
  event.preventDefault();
  if (event.key === 'e') {
    eIsdown = false
    lockControls.lock();

  }
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
  if (event.key === "x") {
    lControl = false
  }


}
function onMouseMove(event) {
  if (selectedObject && lockControls.isLocked) {
    const deltaY = event.movementX * 0.002
    selectedObject.obj.rotation.y -= deltaY;
    selectedObject.obj.rotation.z = 0;
  }  if(objs.length > 0){
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const canvas = document.querySelector('canvas'); // Replace with your canvas element
  
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;
  
    // Set the origin and direction of the raycaster based on the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    var objInScene = []
  
    // Find all objects that intersect with the 
    for(var i = 0; i < objs.length ;i++){
      objInScene.push(objs[i].obj)

    }
    const intersects = raycaster.intersectObjects(objInScene);
  const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff , wireframe: true });
  // Return the closest intersected object, or null if there are none
  if (intersects.length > 0) {
    // If the intersected object is not already highlighted, highlight it
    if (intersects[0].object.material !== basicMaterial) {
      // If another object was previously highlighted, reset its material to the original material
      if (objHighlighted !== null) {
        objHighlighted.object.material = origMat;
      }
      // Set the material of the intersected object to the basic material
      objHighlighted = intersects[0];
      origMat = intersects[0].object.material;
      intersects[0].object.material = basicMaterial;
    }
  } else {
    // If there are no intersections, reset the material of the previously highlighted object (if any)
    if (objHighlighted !== null) {
      objHighlighted.object.material = origMat;
      objHighlighted = null;
      origMat = null;
    }
  }}
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
          if (selectedObject.objType === "floorT" && objToSnap.objType === "wall") {
          }if (selectedObject.objType === "roof" && (
            objToSnap.objType === "floorLeft" ||
            objToSnap.objType === "floorRight" ||
            objToSnap.objType === "floorBack" ||
            objToSnap.objType === "floorFront" ||
            objToSnap.objType === "floorRightT" ||
            objToSnap.objType === "floorBackT" ||
            objToSnap.objType === "floorLeftT"
          )) {
            objToSnap = null
          }
          else {
            isIntersect = true
            selectedObject.obj.position.copy(setPosition(intersectedObj, selectedObject, snapRadius))
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
