import * as THREE from 'three';
import React, { Component } from 'react';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

class Scene extends Component {
  constructor(props) {
    super(props);

    this.selectedObject = null;
    this.cubes = [];
    this.grid = [];
    this.isDragging = false;
    this.snapObjs = [];
    this.objs = [];
    this.objToSnap = null;
    this.isVisible = true;
    this.objHighlighted = null;
    this.origMat = null;
    this.isStarted = false;

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
    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.gridHelper = new THREE.GridHelper(100, 100, 0x444444, 0x888788);
    this.snapRadius = new THREE.Mesh(new THREE.SphereGeometry(1, 1, 3), this.material);
    this.scene.add(this.lockControls.getObject());
    this.snapRadius.position.set(0,0,0);
    this.scene.add(this.snapRadius);

    this.dragControls = new DragControls(this.cubes, this.camera, this.renderer.domElement);
    this.dragControls.addEventListener('dragstart', (event) => {
      this.isDragging = true;
      event.object.material.opacity = 0.33;
    });
    this.dragControls.addEventListener('dragend', (event) => {
      this.isDragging = false;
      event.object.material.opacity = 1;
    });

    this.camera.position.z = 5;
    this.scene.add(this.cube);
    this.scene.add(this.light);
    this.scene.add(this.gridHelper);
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    this.renderer.setClearColor('#000000');
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.mount.appendChild(this.renderer.domElement);

    this.animate();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId);
    this.mount.removeChild(this.renderer.domElement);
  }

  animate() {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div
        ref={(mount) => {
          this.mount = mount;
        }}
      />
    );
  }
}

export default Scene;
