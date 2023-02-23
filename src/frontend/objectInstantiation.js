import * as THREE from 'three';

// pass THREE.Vector3()
export function objIns(vThree, objType) {
  if (!(vThree instanceof THREE.Vector3)) {
    throw new Error('vThree must be an instance of THREE.Vector3');
  }
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
    mesh.add(wireframeMesh)
    mesh.rotateY((3 * Math.PI / 2))
    return mesh
  }
  if (objType === 'floor') {
    const objGeometry = new THREE.BoxGeometry(10, 5, 10)
    const material = new THREE.MeshBasicMaterial({ color: 0xEEA47F })
    const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    const obj = new THREE.Mesh(objGeometry, material);
    const wireframeMesh = new THREE.Mesh(objGeometry, wireframeMaterial);
    obj.add(wireframeMesh)
    obj.position.set(vThree.x, vThree.y, vThree.z);
    return obj;
  }
  if (objType === 'wall') {
    const objGeometry = new THREE.BoxGeometry(10, 10, .2);
    const material = new THREE.MeshBasicMaterial({ color: 0x0539CFF });
    const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    const obj = new THREE.Mesh(objGeometry, material);
    const wireframeMesh = new THREE.Mesh(objGeometry, wireframeMaterial);
    obj.add(wireframeMesh)
    obj.position.set(vThree.x, vThree.y, vThree.z);
    return obj;
  }
  if(objType === "roof"){
    const objGeometry = new THREE.BoxGeometry(10, .2, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x317773 });
    const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    const obj = new THREE.Mesh(objGeometry, material);
    const wireframeMesh = new THREE.Mesh(objGeometry, wireframeMaterial);
    obj.add(wireframeMesh)
    obj.position.set(vThree.x, vThree.y, vThree.z);
    return obj;
  }

}
