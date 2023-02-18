import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import {objIns} from './objectInstantiation'
import { Vector3 } from 'three';

const mouse = new THREE.Vector2();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(-4, 10, 20); // set camera position

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

var snapRadius = new THREE.Mesh(new THREE.SphereGeometry(5,32,32), material);
scene.add(snapRadius)

var selectedObject = null
var cubes = []
var grid = []
let isDragging = false;
var tempCubes = []

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
  
  // loop through the intersected objects
  if (intersects.length > 0) {
  for (let i = 0; i < intersects.length; i++) {
    
    const object = intersects[i].object;
    selectedObject = object;
  }}
  //adds all but the currently selected cube to intersect list
  for(var i =0; i < cubes.length; i++){    
    if(cubes[i] !== selectedObject){
      tempCubes.push(cubes[i])
    }
  }
  
}
function onMouseUp(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  var raycaster = new THREE.Raycaster();
 

  // cast a ray from the camera through the mouse position
  raycaster.setFromCamera(mouse, camera);

  const objectsToIntersect = [...cubes, ...grid];
  // get the intersected objects
  var intersects = raycaster.intersectObjects(objectsToIntersect, true);

  selectedObject = null
  controls.enabled = true
  
}


const dragControls = new DragControls(cubes, camera, renderer.domElement)

  dragControls.addEventListener('dragstart', function (event) {
  isDragging = true;
  event.object.material.opacity = 0.33;
 })
  dragControls.addEventListener('dragend', function (event) {
    isDragging = false;
   event.object.material.opacity = 1;
   //clear tempCubes to reinstantiate next intersect list
   tempCubes = []
})
export function addObj(objType) {
  var vThree = new Vector3(camera.position.x,camera.position.y,camera.position.z)
  //move the object infront of the camera by a factor of 2
  vThree.addScaledVector(camera.getWorldDirection(new THREE.Vector3()),20)
  const obj = objIns(vThree,objType)
  scene.add(obj);
  cubes.push(obj)
}
grid.push(gridHelper)
// Render the scene
function animate() {
  requestAnimationFrame(animate);
  if(isDragging){
    snapRadius.position.set(selectedObject.position.x,selectedObject.position.y,selectedObject.position.z)
    for(let i =0; i < tempCubes.length; i++){
        const bounds = new THREE.Box3().setFromObject(tempCubes[i]);
        const intersects = bounds.intersectsBox(new THREE.Box3().setFromObject(snapRadius));
        if (intersects) {
          //console.log('Objects are intersecting!');
        } else {
          //console.log('Objects are not intersecting.');
        }
    }
    snapRadius.visible= true
    controls.enabled = false
  }
  
  if(!isDragging){
    snapRadius.visible= false
  }
  renderer.render(scene, camera);
}
export default animate;




//document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);