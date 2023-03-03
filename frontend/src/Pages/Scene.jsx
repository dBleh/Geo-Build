import * as THREE from 'three';
import React, { Component } from 'react';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { Vector3 } from 'three';
import { getIntersectObj, setPosition } from '../SceneHelpers/inAnimation';
import { objIns, addSnaps } from '../SceneHelpers/objectInstantiation';
import SaveBuild from './saveScene';
import { connect } from 'react-redux';
class Scene extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseX: null,
      mouseY: null,
    };
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    this.selectedObject = null;
    this.cubes = [];
    this.grid = [];
    this.isDragging = false;
    this.snapObjs = [];
    this.objs = [];
    this.objToSnap = null;
    this.isVisible = false;
    this.objHighlighted = null;
    this.origMat = null;
    this.isStarted = false;
    this.wIsDown = false
    this.eIsdown = false
    this.sIsDown = false
    this.aIsDown = false
    this.dIsDown = false
    this.spaceIsDown = false
    this.lControl = false
    this.inBound = false
    this.boundMat = null;
    this.loadedScene = null;
    this.allObjs = []


    this.time = new Date()
    this.lastTime = this.time

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.lockControls = new PointerLockControls(this.camera, document.body);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.light = new THREE.PointLight(0xffffff, 1, 100);
    this.light.position.set(0, 0, 10);
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0x8AAAE5 });
    this.gridHelper = new THREE.GridHelper(100, 100, 0x444444, 0x888788);
    this.snapRadius = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), this.material);
    this.scene.add(this.lockControls.getObject());
    this.snapRadius.position.set(0, 0, 0);
    this.scene.add(this.snapRadius);

    this.dragControls = new DragControls(this.cubes, this.camera, this.renderer.domElement);


    this.camera.position.y = 20;
    this.camera.position.z = 10;
    this.camera.rotation.x = -.5;
    this.scene.add(this.light);
    this.scene.add(this.gridHelper);
    this.animate = this.animate.bind(this);

  }

  componentDidMount() {

    this.renderer.setClearColor(0xFAF9F6);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.mount.appendChild(this.renderer.domElement);

    this.dragControls.addEventListener('dragstart', (event) => {
      this.isDragging = true;
      event.object.material.opacity = 0.33;
    });
    this.dragControls.addEventListener('dragend', (event) => {
      this.isDragging = false;
      event.object.material.opacity = 1;
    });
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('mousedown', this.handleMouseDown);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('keyup', this.handleKeyUp);


    this.animate();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId);
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('keyup', this.handleKeyUp);
    this.mount.removeChild(this.renderer.domElement);
  }


  handleMouseMove(event) {

    if (this.selectedObject) {
      const deltaY = event.movementX * 0.002
      this.selectedObject.obj.rotation.y -= deltaY;
      this.selectedObject.obj.rotation.z = 0;

    }
    if (this.objs) {
      if (this.objs.length > 0 && !this.selectedObject) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        // Replace with your canvas element

        // Calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Set the origin and direction of the raycaster based on the camera and mouse position
        raycaster.setFromCamera(mouse, this.camera);
        var objInScene = []

        // Find all objects that intersect with the 
        for (var i = 0; i < this.objs.length; i++) {
          objInScene.push(this.objs[i].obj)
        }
        const intersects = raycaster.intersectObjects(objInScene);

        const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
        // Return the closest intersected object, or null if there are none
        if (intersects.length > 0) {
          // If the intersected object is not already highlighted, highlight it

          // If another object was previously highlighted, reset its material to the original material
          if (this.objHighlighted !== null) {
            this.objHighlighted.object.material = this.origMat;
          }
          // Set the material of the intersected object to the basic material
          this.objHighlighted = intersects[0];
          this.origMat = intersects[0].object.material;
          intersects[0].object.material = basicMaterial;

        } else {
          // If there are no intersections, reset the material of the previously highlighted object (if any)
          if (this.objHighlighted !== null) {
            this.objHighlighted.object.material = this.origMat;
            this.objHighlighted = null;
            this.origMat = null;
          }
        }
      }
    }
  }

  handleMouseDown() {
    if (!this.eIsdown) {
      if (!this.inBound) {
        if (this.selectedObject) {
          this.scene.remove(this.selectedObject.obj)
          for (var i = 0; i < this.objs.length; i++) {
            if (this.objs[i].obj.parent === this.selectedObject.obj.parent) {
              this.scene.remove(this.selectedObject.obj.parent)
              this.objs.splice(i, 1);
              i = i - 1
            }
          }
          for (var j = 0; j < this.snapObjs.length; j++) {
            if (this.snapObjs[j].obj.parent === this.selectedObject.obj.parent) {
              this.scene.remove(this.snapObjs[j])
              this.snapObjs.splice(j, 1);
              j = j - 1
            }
          }
          this.selectedObject = null
          this.objToSnap = null
        }
      }
      else {
        if (this.selectedObject) {
          var newSnaps = addSnaps(this.selectedObject, this.isVisible)
          newSnaps.forEach((obj) => {
            this.snapObjs.push(obj);
          })
        }
      }
      this.selectedObject = null
      this.objToSnap = null
    }
    if (this.eIsdown) {
      if (this.selectedObject) {
        for (var a = 0; a < this.objs.length; a++) {
          if (this.selectedObject) {
            if (this.objs[a].obj.parent === this.selectedObject.obj.parent) {
              this.scene.remove(this.selectedObject.obj.parent)
              this.objs.splice(a, 1);
              a = a - 1
            }
          }
          for (var b = 0; b < this.snapObjs.length; b++) {
            if (this.snapObjs[b].obj.parent === this.selectedObject.obj.parent) {
              this.scene.remove(this.snapObjs[b])
              this.snapObjs.splice(b, 1);
              b = b - 1
            }
          }
          this.selectedObject = null
          this.objToSnap = null
        }
      }
    }
  }

  handleKeyDown = (event) => {

    if (event.keyCode === 69) {

      this.eIsdown = true
      document.getElementById("popup").style.display = "block";
      this.lockControls.unlock();
    }

    if (event.keyCode === 87) {
      this.wIsDown = true
    }
    if (event.keyCode === 82) {
      if (this.objHighlighted) {
        for (var i = 0; i < this.objs.length; i++) {
          if (this.objs[i].obj.parent === this.objHighlighted.object.parent) {
            this.scene.remove(this.objHighlighted.object.parent)
            this.objs.splice(i, 1);
            i = i - 1
          }
        }
        for (var j = 0; j < this.snapObjs.length; j++) {
          if (this.snapObjs[j].obj.parent === this.objHighlighted.object.parent) {
            this.scene.remove(this.snapObjs[j])
            this.snapObjs.splice(j, 1);
            j = j - 1
          }
        }
        this.objHighlighted = null
        this.origMat = null
      }
    }
    if (event.keyCode === 83) {
      this.sIsDown = true
    }
    if (event.keyCode === 65) {
      this.aIsDown = true
    }
    if (event.keyCode === 68) {


      this.dIsDown = true
    }
    if (event.key === " ") {
      this.spaceIsDown = true
    }
    if (event.keyCode === 88) {
      this.lControl = true
    }
  }
  handleKeyUp = (event) => {
    if (event.keyCode === 69) {
      document.getElementById("popup").style.display = "none";
      this.eIsdown = false
      this.lockControls.lock();
    }
    if (event.keyCode === 87) {
      this.wIsDown = false
    }
    if (event.keyCode === 83) {
      this.sIsDown = false
    }
    if (event.keyCode === 65) {
      this.aIsDown = false
    }
    if (event.keyCode === 68) {
      this.dIsDown = false
    }
    if (event.keyCode === 32) {
      this.spaceIsDown = false
    }
    if (event.keyCode === 88) {
      this.lControl = false
    }
  }
  loadScene() {
    for (var i = 0; i < this.loadedScene.objs[0].length; i++) {
      var pos = new THREE.Vector3(
        this.loadedScene.objs[0][i].position.x,
        this.loadedScene.objs[0][i].position.y,
        this.loadedScene.objs[0][i].position.z
      );

      var newObj = objIns(pos, this.loadedScene.objs[0][i].objType);
      const t = {
        obj: newObj.children[0],
        objType: this.loadedScene.objs[0][i].objType,
      };

      t.obj.rotation.copy(this.loadedScene.objs[0][i].rotation);

      this.objs.push(t);

      var newSnaps = addSnaps(t, this.isVisible);
      if (newSnaps) {
        newSnaps.forEach((obj) => {
          this.snapObjs.push(obj);
        });
      }

      this.scene.add(newObj);
    }

  }
  animate() {
  
    if (this.loadedScene && this.loadedScene.objs) {
      this.loadScene()
      this.loadedScene = null;
    }
    this.time = new Date()
    var deltaTime = this.time - this.lastTime
    this.lastTime = this.time
    if (this.selectedObject) {
      
      

      
      
      var v = this.camera.getWorldPosition(new THREE.Vector3())
      v = this.camera.getWorldPosition(new THREE.Vector3())
      v.addScaledVector(this.camera.getWorldDirection(new THREE.Vector3()), 13)
      this.snapRadius.position.set(v.x, v.y - 10, v.z)
      if (this.snapObjs.length === 0) {
        v = this.camera.getWorldPosition(new THREE.Vector3())
        v.addScaledVector(this.camera.getWorldDirection(new THREE.Vector3()), 13)
        this.selectedObject.obj.position.set(v.x, v.y - 10, v.z)
      }
      else {
        for (let i = 0; i < this.snapObjs.length; i++) {
          this.objToSnap = this.snapObjs[i]
          const intersectedObj = getIntersectObj(this.snapObjs[i], this.snapRadius)
          if (!intersectedObj) {
            this.objToSnap = null
            v = this.camera.getWorldPosition(new THREE.Vector3())
            v.addScaledVector(this.camera.getWorldDirection(new THREE.Vector3()), 13)
            this.selectedObject.obj.position.set(v.x, v.y - 10, v.z)
          }
          else {
            if (this.selectedObject.objType === "floor" && this.objToSnap.objType === "wall") {
            }
            if (this.selectedObject.objType === "floorT" && this.objToSnap.objType === "wall") {
            } if (this.selectedObject.objType === "roof" && (
              this.objToSnap.objType === "floorLeft" ||
              this.objToSnap.objType === "floorRight" ||
              this.objToSnap.objType === "floorBack" ||
              this.objToSnap.objType === "floorFront" ||
              this.objToSnap.objType === "floorRightT" ||
              this.objToSnap.objType === "floorBackT" ||
              this.objToSnap.objType === "floorLeftT"
            )) {
              this.objToSnap = null
            }
            else {
              const newPos = setPosition(intersectedObj, this.selectedObject, this.snapRadius, this.objs)
              if (!newPos) {
                this.selectedObject.obj.position.set(v.x, v.y - 10, v.z)
              }
              else {
                this.selectedObject.obj.position.copy(setPosition(intersectedObj, this.selectedObject, this.snapRadius, this.objs))
              }
            }

            break
          }
        }
      }
      this.snapRadius.visible = true

    }
    if (this.selectedObject) {
      // Check the object type and set the original material if necessary
      if (this.selectedObject.objType === 'floor' || this.selectedObject.objType === 'floorT' ||
        this.selectedObject.objType === 'wall' || this.selectedObject.objType === 'door') {
        if (this.boundMat === null) {
          this.boundMat = this.selectedObject.obj.material;
        }
      }
      // Check the bounds and set the color
      if (this.selectedObject.objType === 'floor' || this.selectedObject.objType === 'floorT') {
        if (this.selectedObject.obj.position.y < -5 || this.selectedObject.obj.position.y > 5) {
          this.selectedObject.obj.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
          this.inBound = false;
        } else {
          this.inBound = true;
          this.selectedObject.obj.material = this.boundMat;
          this.boundMat = null;
        }
      } else if (this.selectedObject.objType === 'wall' || this.selectedObject.objType === 'door') {
        if (this.objToSnap !== null) {
          this.inBound = true;
          this.selectedObject.obj.material = this.boundMat;
          this.boundMat = null;
        } else {
          this.selectedObject.obj.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
          this.inBound = false;
        }
      }
    }

    if (!this.isDragging) {
      this.snapRadius.visible = false
    }

    if (this.wIsDown) {
      this.camera.position.addScaledVector(this.camera.getWorldDirection(new THREE.Vector3()), .01 * deltaTime)
    }
    if (this.sIsDown) {
      this.camera.position.addScaledVector(this.camera.getWorldDirection(new THREE.Vector3()), -.01 * deltaTime)
    }
    if (this.aIsDown) {
      this.camera.translateX(-.01 * deltaTime)
    }
    if (this.dIsDown) {
      this.camera.translateX(.01 * deltaTime)
    }
    if (this.spaceIsDown) {
      this.camera.translateY(.01 * deltaTime)

    }
    if (this.lControl) {
      this.camera.translateY(-.01 * deltaTime)
    }
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }
  onClick = (objType) => {
    this.addObj(objType)
    this.scene.traverse((object) => {
      if (object instanceof THREE.Object3D) {
        this.allObjs.push(object);
      }
    });
    
  }
  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }


  addObj(objType) {
    var vThree = new Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z)
    //move the object infront of the camera by a factor of 2
    vThree.addScaledVector(this.camera.getWorldDirection(new THREE.Vector3()), 20)
    const obj = objIns(vThree, objType)
    const t = {
      obj: obj.children[0],
      objType: objType,
    }
    this.objs.push(t)
    if (this.selectedObject) {
      this.scene.remove(this.selectedObject.obj)
      this.objs.pop(this.selectedObject)
    }
    this.selectedObject = {
      obj: obj.children[0],
      objType: objType,
    }
    this.scene.add(obj);
    if (this.selectedObject) {
      const objGeometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshBasicMaterial({ color: 0x000000})
      
      var edgesGeometry = new THREE.EdgesGeometry(this.selectedObject.obj.geometry);
  
      // Get an array of vertices from the edges geometry
      var vertices = edgesGeometry.attributes.position.array;
  
      // Loop through the vertices array two at a time
      for (var i = 0; i < vertices.length; i += 6) {
        // Get the positions of the two vertices that make up the edge
        var vertex1 = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
        var vertex2 = new THREE.Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);
  
        // Compute the midpoint of the two vertices
        var midpoint = new THREE.Vector3().addVectors(vertex1, vertex2).multiplyScalar(0.5);
        const obj = new THREE.Mesh(objGeometry, material);
        obj.position.set(midpoint.x,midpoint.y+5,midpoint.z);
        this.scene.add(obj)
        
        // Print the position of the midpoint
      }
    }
  }

  render() {
    const { sceneObjs } = this.props;
    this.loadedScene = sceneObjs;
    const dropDown = (e) => {
      document.getElementById(e).style.display === "block" ? document.getElementById(e).style.display = "none" : document.getElementById(e).style.display = "block";
    }
    const checkBoxes = (e) => {
      this.isVisible = !this.isVisible
      if(e === 'snapBoxes'){
       
        this.snapObjs.forEach((obj) => {
          obj.obj.visible = this.isVisible
        })
        
      }
    }
    return (
      <>
        <div
          ref={(mount) => {
            this.mount = mount;
          }}
        />
        <div  id="dropdown">
          <div id="checkBox" onClick={() => dropDown('saveScene')} >Save Scene ↓</div>
          <div id='saveScene'>
            <SaveBuild myProp={this.objs} />
          </div>
          <br></br>
          <br></br>
          
          <div id="checkBox" onClick={() => dropDown('instructions')} >Instructions ↓</div>
          <br></br>
          <br></br>
          <div id="checkBox">
            <div onClick={() => checkBoxes('snapBoxes')}>Show snap points</div>
          </div>
        </div>
        <div id='instructions'>
            <li>Movement</li>
            <li>- To move use WASD</li>
            <li>- Hold spacebar to move up</li>
            <li>- Hold x to move down</li>
            <br></br>
            <li>Getting Started</li>
            <li>- Hold E to show complete object list</li>
            <li>- Click on object name to add it to scene</li>
            <li>- After selecting object to add to the scene the object will move around the scene in front of you until placed</li>
            <li>- Foundation objects can be placed without another object in the scene</li>
            <li>- All objects other than foundations must snap to another object</li>
            <li>- Ceilings can not snap to foundations</li>
            <li>- To remove an object from the scene look towards desired object until it becomes transparent then press 'r'</li> 
          </div>
        <div id="popup">
          <li onClick={() => this.onClick("wall")}>Wall</li>
          <li onClick={() => this.onClick("floorT")}>Triangle Foundation</li>
          <li onClick={() => this.onClick("floor")}>Square Foundation</li>
          <li onClick={() => this.onClick("roof")}>Square Roof</li>
          <li onClick={() => this.onClick("roofT")}>Triangle Roof</li>
          <li onClick={() => this.onClick("door")}>Door</li>
        </div>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    sceneObjs: state.auth.sceneObjs,
  };
};


export default connect(mapStateToProps)(Scene);
