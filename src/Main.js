import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls'

const mouse = new THREE.Vector2();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(-4, 10, 20); // set camera position

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

var snapRadius = new THREE.Mesh(new THREE.SphereGeometry(5,32,32), material);
scene.add(snapRadius)

var selectedObject = null
var x = 10, y = 10, z = 10
var cubes = []
var grid = []
var itemsInSnapRadius = []
let isDragging = false;
const cube = new THREE.Mesh(cubeGeometry, material);
cube.position.set(-10, 10, 0)
cubes.push(cube)
scene.add(cube);
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

const objectsToIntersect = [...cubes, ...grid];
function onMouseDown(event) {
  // calculate the mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  
  var raycaster = new THREE.Raycaster();

  // cast a ray from the camera through the mouse position
  raycaster.setFromCamera(mouse, camera);
  const objectsToIntersect = [...cubes, ...grid];
  // get the intersected objects
  var intersects = raycaster.intersectObjects(objectsToIntersect, true);
  
  // loop through the intersected objects
  if (intersects.length > 0) {
  for (let i = 0; i < intersects.length; i++) {
    
    const object = intersects[i].object;
    if (selectedObject && selectedObject !== object) {
      // reset the material of the previously selected object
      selectedObject.material = material;
    }
    object.material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
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
  if (intersects.length > 0) {
    for (let i = 0; i < intersects.length; i++) {
      intersects[i].material = new THREE.MeshBasicMaterial({ color: 0x000000 })
    }
  }
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
export function addCube() {
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cube = new THREE.Mesh(cubeGeometry, material);
  cube.position.set(x, y, z)
  x++;
  y++;
  z++;

  scene.add(cube);
  cubes.push(cube)
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
          console.log('Objects are intersecting!');
        } else {
          console.log('Objects are not intersecting.');
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