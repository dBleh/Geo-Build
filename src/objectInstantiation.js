import * as THREE from 'three';

// pass THREE.Vector3()
export function objIns(vThree, objType) {
  if (!(vThree instanceof THREE.Vector3)) {
    throw new Error('vThree must be an instance of THREE.Vector3');
  }

  const objGeometry = objType === "floor" ? new THREE.BoxGeometry(10, 5, 10) : new THREE.BoxGeometry(10, 10, .2);
  const material = objType === "floor" ? new THREE.MeshBasicMaterial({ color: 0x00ff00 }) : new THREE.MeshBasicMaterial({ color: 0x0000 });
  
  const obj = new THREE.Mesh(objGeometry, material);
  obj.position.set(vThree.x, vThree.y, vThree.z);
  return obj;
}
