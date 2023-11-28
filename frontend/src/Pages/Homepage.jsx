
import * as THREE from 'three';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { checkCollision, onCollision } from '../HomePageScene/homeAnimation';
class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );

    this.objList = []
    this.snappedDirection = new THREE.Vector3(1, 1, 1);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.light = new THREE.PointLight(0xffffff, 1, 10);
    this.light.position.set(0, 0, 10);

    this.objGeometry = new THREE.BoxGeometry(1, 1, 1)
    this.material = new THREE.MeshBasicMaterial({ color: 0x8AAAE5 })
    this.wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });

    this.objOne = new THREE.Mesh(this.objGeometry, this.material);
    this.wireframeMesh = new THREE.Mesh(this.objGeometry, this.wireframeMaterial);
    this.objOne.add(this.wireframeMesh)
    this.objOne.position.set(0, -2, 3);
    this.scene.add(this.objOne);
    this.objOneParams = {
      obj: this.objOne,
      weight: 2,
      speed: 1,
      objectDirection: new THREE.Vector3(-.01, .011, .011)
    }
    this.objList.push(this.objOneParams)

    this.objTwo = new THREE.Mesh(this.objGeometry, this.material);
    this.wireframeMesh = new THREE.Mesh(this.objGeometry, this.wireframeMaterial);
    this.objTwo.add(this.wireframeMesh)
    this.objTwo.position.set(-2, 5, 2);
    this.scene.add(this.objTwo);
    this.objTwoParams = {
      obj: this.objTwo,
      weight: 2,
      speed: 1,
      objectDirection: new THREE.Vector3(.01, -.011, .011)
    }

    this.objList.push(this.objTwoParams)

    this.objThree = new THREE.Mesh(this.objGeometry, this.material);
    this.wireframeMesh = new THREE.Mesh(this.objGeometry, this.wireframeMaterial);
    this.objThree.add(this.wireframeMesh)
    this.objThree.position.set(0, 0, 0);

    this.scene.add(this.objThree);
    this.objThreeParams = {
      obj: this.objThree,
      weight: 2,
      speed: 1,
      objectDirection: new THREE.Vector3(.01, .011, .011)
    }
    this.objList.push(this.objThreeParams)

    this.camera.position.y = 5;
    this.camera.position.z = 10;
    this.camera.rotation.x = -.5;
    this.scene.add(this.light);
    


    this.speedX = .1
    this.speedY = .02
    this.swap = false

  }

  componentDidMount() {
    this.renderer.setClearColor(0xFAF9F6);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.mount.appendChild(this.renderer.domElement);
   
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId);
    this.mount.removeChild(this.renderer.domElement);
  }

  
   

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }




  render() {
    const { user } = this.props;

    return (
      <>
        <div
          ref={(mount) => {
            this.mount = mount;
          }}
        />
        <div id='homePage'>
          <ul>
            <h2>Welcome to GeoBuild</h2>
            <li>
              <p>Geo build is a simple web building tool where users can create, place, move, and delete objects placed within a 3d environment</p>
              <p>You are able to save a scene after creating one!</p>
              {user ? <p> Click work space to get started! </p> : <p> Register an account to get started! </p>}
            </li>
          </ul>
        </div>

      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.auth.user,
  };
};


export default connect(mapStateToProps)(HomePage);
