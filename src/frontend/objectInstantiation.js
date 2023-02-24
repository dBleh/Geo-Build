import * as THREE from 'three';

// pass THREE.Vector3()
export function objIns(vThree, objType) {
  if (!(vThree instanceof THREE.Vector3)) {
    throw new Error('vThree must be an instance of THREE.Vector3');
  }
  const pObj = new THREE.Object3D();
  if (objType === "floorT") {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array([
      // Define the vertices of the base triangle
      0, 0, -5,
      0, 0, 5,
      -8.66025, 0, -0,
      // Define the vertices of the top triangle
      0, 5, -5,
      0, 5, 5,
      -8.66025, 5, -0,
    ]);
    const indices = new Uint16Array([
      0, 1, 2,  // bottom triangle
      3, 4, 5,  // top triangle
      0, 1, 4,  // side rectangle 1
      4, 3, 0,  // side rectangle 1
      1, 2, 5,  // side rectangle 2
      5, 4, 1,  // side rectangle 2
      2, 0, 3,  // side rectangle 3
      3, 5, 2   // side rectangle 3
    ]);
    // Set the positions and indices to the geometry
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    const m = new THREE.MeshBasicMaterial({
      color: 0xFCEDDA,
      side: THREE.DoubleSide
    });
    const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    const mesh = new THREE.Mesh(geometry, m);
    mesh.position.set(vThree.x, vThree.y, vThree.z);
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
    mesh.add(wireframeMesh);
    mesh.rotateY((3 * Math.PI / 2));
    pObj.add(mesh)
    return pObj;
  }
  if (objType === "roofT") {
    const pObj = new THREE.Object3D()
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array([
      // Define the vertices of the base triangle

      0, 0, -5,
      0, 0, 5,
      -8.66025, 0, -0,
      // Define the vertices of the top triangle

      0, .2, -5,
      0, .2, 5,
      -8.66025, .2, -0,
    ]);
    const indices = new Uint16Array([
      0, 1, 2,  // bottom triangle
      3, 4, 5,  // top triangle
      0, 1, 4,  // side rectangle 1
      4, 3, 0,  // side rectangle 1
      1, 2, 5,  // side rectangle 2
      5, 4, 1,  // side rectangle 2
      2, 0, 3,  // side rectangle 3
      3, 5, 2   // side rectangle 3
    ]);
    // Set the positions and indices to the geometry
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    const m = new THREE.MeshBasicMaterial({
      color: 0xFCEDDA,
      side: THREE.DoubleSide
    });
    const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    const mesh = new THREE.Mesh(geometry, m);
    mesh.position.set(vThree.x, vThree.y, vThree.z);
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
    mesh.add(wireframeMesh)
    mesh.rotateY((3 * Math.PI / 2))
    pObj.add(mesh)
    console.log(pObj)
    return pObj;
  }
  if (objType === 'floor') {
    const objGeometry = new THREE.BoxGeometry(10, 5, 10)
    const material = new THREE.MeshBasicMaterial({ color: 0xEEA47F })
    const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    const obj = new THREE.Mesh(objGeometry, material);
    const wireframeMesh = new THREE.Mesh(objGeometry, wireframeMaterial);
    obj.add(wireframeMesh)
    obj.position.set(vThree.x, vThree.y, vThree.z);
    pObj.add(obj)
    return pObj;
  }
  if (objType === 'wall') {
    const objGeometry = new THREE.BoxGeometry(10, 10, .2);
    const material = new THREE.MeshBasicMaterial({ color: 0x0539CFF });
    const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    const obj = new THREE.Mesh(objGeometry, material);
    const wireframeMesh = new THREE.Mesh(objGeometry, wireframeMaterial);
    obj.add(wireframeMesh)
    obj.position.set(vThree.x, vThree.y, vThree.z);
    pObj.add(obj)
    return pObj;
  }
  if (objType === "roof") {
    const objGeometry = new THREE.BoxGeometry(10, .2, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x317773 });
    const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    const obj = new THREE.Mesh(objGeometry, material);
    const wireframeMesh = new THREE.Mesh(objGeometry, wireframeMaterial);
    obj.add(wireframeMesh)
    obj.position.set(vThree.x, vThree.y, vThree.z);
    pObj.add(obj)
    return pObj;
  }
  if (objType === 'door') {
    const wall = new THREE.Shape();
    wall.moveTo(-5, -5);
    wall.lineTo(-5, 5);
    wall.lineTo(5, 5);
    wall.lineTo(5, -5);
    wall.lineTo(-5, -5);

    const door = new THREE.Shape();
    door.moveTo(-2.5, -5);
    door.lineTo(-2.5, 2);
    door.lineTo(2.5, 2);
    door.lineTo(2.5, -5);
    door.lineTo(-2.5, -5);
    // Merge the wall and door shapes into a single shape
    wall.holes.push(door);

    const extrudeSettings = { depth: 0.2, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(wall, extrudeSettings);
    const material = new THREE.MeshBasicMaterial({ color: 0xCC313D });
    const mesh = new THREE.Mesh(geometry, material);

    // create wireframe geometry and mesh
    const wireframeGeometry = new THREE.WireframeGeometry(geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);

    // add wireframe as child of door mesh
    mesh.add(wireframe);
    pObj.add(mesh)

    return pObj;
}

}
