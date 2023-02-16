import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const mouse = new THREE.Vector2();
// Create a scene
const scene = new THREE.Scene();


// Create a camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

// Create a cube geometry
const geometry = new THREE.BoxGeometry( 1, 1, 1 );

// Create a material
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

// Create a mesh


// Add the cube to the scene

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 10);
scene.add(light);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableKeys = true; // enable keyboard controls

cubes = new THREE.Object3D();
var projector = new THREE.Projector();
document.addEventListener('click', onClick);

var cubes = new THREE.Object3D();
scene.add( cubes )
const positions = [
    [0, 0, 0],
    [10, 0, 0],
    [0, 10, 0],
    [0, 0, 10],
    [10, 10, 0],
    [10, 0, 10],
    [0, 10, 10],
    [10, 10, 10],
];
for (let i = 0; i < positions.length; i++) {
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cube = new THREE.Mesh(cubeGeometry, material);
    cube.position.set(positions[i][0], positions[i][1], positions[i][2]);
    cubes.add(cube)
  }
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const c = new THREE.Mesh(cubeGeometry, material);
c.position.set(20,20,20);

scene.add(c);
camera.position.set(0, 0, 10);


function onClick(event) {

  // calculate the mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  var raycaster = projector.pickingRay( mouse.clone(), camera ),
    intersects = raycaster.intersectObjects( cubes.children );

  // cast a ray from the camera through the mouse position
  raycaster.setFromCamera(mouse, camera);

  // get the intersected objectsa
  

  // loop through the intersected objects
  for (let i = 0; i < intersects.length; i++) {
    const object = intersects[i].object;

    // check if the intersected object is a cube
    if (object instanceof THREE.Mesh && object.geometry instanceof THREE.BoxGeometry) {
      // change the color of the material
      object.material.color.set(0xff0000); // set the color to red
    }
  }
}
// Render the scene
function animate() {
    requestAnimationFrame( animate );
    
    const cubeToMove = scene.getObjectById(6);
    
  

    renderer.render( scene, camera );
}
export default animate;