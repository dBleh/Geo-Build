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
    mesh.position.set(vThree.x, vThree.y, vThree.z);
    mesh.add(wireframe);
    pObj.add(mesh)

    return pObj;
  }
}

export function addSnaps(selectedObject, isVisible) {
  var snapObjs = []
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
    selectedObject.obj.parent.add(snapObjLeft);
    snapObjLeft.visible = isVisible
    snapObjs.push({
      obj: snapObjLeft,
      objType: 'floor',
      side: 'left'
    });
    const snapObjRight = new THREE.Mesh(objGeometry, mat);
    snapObjRight.position.copy(selectedObject.obj.position).add(snapPositions.right);
    snapObjRight.quaternion.copy(selectedObject.obj.quaternion);
    snapObjRight.rotateY(-Math.PI / 2)
    selectedObject.obj.parent.add(snapObjRight);
    snapObjRight.visible = isVisible
    snapObjs.push({
      obj: snapObjRight,
      objType: 'floor',
      side: 'right'
    });
    const snapObjBack = new THREE.Mesh(objGeometry, matT);
    snapObjBack.position.copy(selectedObject.obj.position).add(snapPositions.back);
    snapObjBack.quaternion.copy(selectedObject.obj.quaternion);
    snapObjBack.rotateY(Math.PI)
    selectedObject.obj.parent.add(snapObjBack);
    snapObjBack.visible = isVisible
    snapObjs.push({
      obj: snapObjBack,
      objType: 'floor',
      side: 'back'
    });
    const snapObjFront = new THREE.Mesh(objGeometry, matT);
    snapObjFront.position.copy(selectedObject.obj.position).add(snapPositions.front);
    snapObjFront.quaternion.copy(selectedObject.obj.quaternion);
    selectedObject.obj.parent.add(snapObjFront);
    snapObjFront.visible = isVisible
    snapObjs.push({
      obj: snapObjFront,
      objType: 'floor',
      side: 'front'
    });
    return snapObjs
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
    selectedObject.obj.parent.add(snapObjLeft);
    snapObjLeft.visible = isVisible
    snapObjs.push({
      obj: snapObjLeft,
      objType: 'roof',
      side: 'left'
    });
    const snapObjRight = new THREE.Mesh(objGeometry, mat);
    snapObjRight.position.copy(selectedObject.obj.position).add(snapPositions.right);
    snapObjRight.quaternion.copy(selectedObject.obj.quaternion);
    snapObjRight.rotateY(-Math.PI / 2)
    selectedObject.obj.parent.add(snapObjRight);
    snapObjRight.visible = isVisible
    snapObjs.push({
      obj: snapObjRight,
      objType: 'roof',
      side: 'right'
    });
    const snapObjBack = new THREE.Mesh(objGeometry, matT);
    snapObjBack.position.copy(selectedObject.obj.position).add(snapPositions.back);
    snapObjBack.quaternion.copy(selectedObject.obj.quaternion);
    snapObjBack.rotateY(Math.PI)
    selectedObject.obj.parent.add(snapObjBack);
    snapObjBack.visible = isVisible
    snapObjs.push({
      obj: snapObjBack,
      objType: 'roof',
      side: 'back'
    });
    const snapObjFront = new THREE.Mesh(objGeometry, matT);
    snapObjFront.position.copy(selectedObject.obj.position).add(snapPositions.front);
    snapObjFront.quaternion.copy(selectedObject.obj.quaternion);
    selectedObject.obj.parent.add(snapObjFront);
    snapObjFront.visible = isVisible
    snapObjs.push({
      obj: snapObjFront,
      objType: 'roof',
      side: 'front'
    });
    return snapObjs
  }
  if (selectedObject.objType === 'wall') {
    // Add snap point to wall object
    const snapPos = new THREE.Vector3(0, 5, -.1);
    const snapObj = new THREE.Mesh(objGeometry, mat);
    snapPos.applyQuaternion(selectedObject.obj.quaternion);
    snapObj.position.copy(selectedObject.obj.position).add(snapPos);
    snapObj.quaternion.copy(selectedObject.obj.quaternion);
    selectedObject.obj.parent.add(snapObj);
    snapObj.visible = isVisible
    snapObjs.push({
      obj: snapObj,
      objType: 'wall',
    });
    return snapObjs
  }
  if (selectedObject.objType === 'door') {
    // Add snap point to wall object
    const snapPos = new THREE.Vector3(0, 5, 0);
    const snapObj = new THREE.Mesh(objGeometry, mat);
    snapPos.applyQuaternion(selectedObject.obj.quaternion);
    snapObj.position.copy(selectedObject.obj.position).add(snapPos);
    snapObj.quaternion.copy(selectedObject.obj.quaternion);
    selectedObject.obj.parent.add(snapObj);
    snapObj.visible = isVisible
    snapObjs.push({
      obj: snapObj,
      objType: 'door',
    });
    return snapObjs
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
    selectedObject.obj.parent.add(snapObjLeft);
    snapObjLeft.visible = isVisible
    snapObjs.push({
      obj: snapObjLeft,
      objType: 'floorT',
      side: 'left'
    });
    const snapObjRight = new THREE.Mesh(objGeometry, mat);
    snapObjRight.position.copy(selectedObject.obj.position).add(snapPositions.right);
    snapObjRight.quaternion.copy(selectedObject.obj.quaternion);
    snapObjRight.rotateY(-1.0472 + Math.PI / 2);
    // Get the inverse of the snap object's world matrix
    const snapWorldInverse = new THREE.Matrix4();
    snapWorldInverse.copy(snapObjRight.matrixWorld).invert();
    // Transform the position of the new object by the inverse of the snap object's world matrix
    selectedObject.obj.parent.add(snapObjRight);
    snapObjRight.visible = isVisible
    snapObjs.push({
      obj: snapObjRight,
      objType: 'floorT',
      side: 'right'
    });
    const snapObjBack = new THREE.Mesh(squareGeometry, mat);
    snapObjBack.position.copy(selectedObject.obj.position).add(snapPositions.back);
    snapObjBack.quaternion.copy(selectedObject.obj.quaternion);
    snapObjBack.rotateY(-Math.PI / 2)
    selectedObject.obj.parent.add(snapObjBack);
    snapObjBack.visible = isVisible
    snapObjs.push({
      obj: snapObjBack,
      objType: 'floorT',
      side: 'back'
    });
    return snapObjs
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
    selectedObject.obj.parent.add(snapObjLeft);
    snapObjLeft.visible = isVisible
    snapObjs.push({
      obj: snapObjLeft,
      objType: 'roofT',
      side: 'left'
    });
    const snapObjRight = new THREE.Mesh(objGeometry, mat);
    snapObjRight.position.copy(selectedObject.obj.position).add(snapPositions.right);
    snapObjRight.quaternion.copy(selectedObject.obj.quaternion);
    snapObjRight.rotateY(-1.0472 + Math.PI / 2);
    // Get the inverse of the snap object's world matrix
    const snapWorldInverse = new THREE.Matrix4();
    snapWorldInverse.copy(snapObjRight.matrixWorld).invert();
    // Transform the position of the new object by the inverse of the snap object's world matrix
    selectedObject.obj.parent.add(snapObjRight);
    snapObjRight.visible = isVisible
    snapObjs.push({
      obj: snapObjRight,
      objType: 'roofT',
      side: 'right'
    });
    const snapObjBack = new THREE.Mesh(squareGeometry, mat);
    snapObjBack.position.copy(selectedObject.obj.position).add(snapPositions.back);
    snapObjBack.quaternion.copy(selectedObject.obj.quaternion);
    snapObjBack.rotateY(-Math.PI / 2)
    selectedObject.obj.parent.add(snapObjBack);
    snapObjBack.visible = isVisible
    snapObjs.push({
      obj: snapObjBack,
      objType: 'roofT',
      side: 'back'
    });
    return snapObjs
  }
}

