
import * as THREE from 'three';


//returns the object snapRadius is intersecting with, otherwise returns false.
export function getIntersectObj(object, snapRadius) {
  const bounds = new THREE.Box3().setFromObject(object.obj);
  const intersects = bounds.intersectsBox(new THREE.Box3().setFromObject(snapRadius));
  if (intersects) {
    return object
  }
  return false
}

export function setPosition(objToSnap, selectedObject,snapRadius) {
  var offset = 0;
  if (selectedObject.objType === 'wall') {
    offset = selectedObject.obj.geometry.parameters.height / 2;
  }
  if (selectedObject.objType === 'floor') {
    offset = -2;
  }
  if (selectedObject.objType === 'floorT') {
    offset = -4.5
  }
  if (selectedObject.objType === 'roof') {
    offset = selectedObject.obj.geometry.parameters.height / 2; 
  }
  // Get the direction of the snapped object
  const snappedDirection = new THREE.Vector3(0, 0, -1);
  snappedDirection.applyQuaternion(objToSnap.obj.quaternion);
  // Set the position of the selected object to the position of the snapped object
  selectedObject.obj.position.copy(objToSnap.obj.position);
  selectedObject.obj.position.y += offset;
  if (selectedObject.objType === "floorT") {
    if (objToSnap.objType === "floorBack") {
      // Apply the snapped direction to the selected object's quaternion
      const q = new THREE.Quaternion();
      q.setFromUnitVectors(new THREE.Vector3(0, 0, -1), snappedDirection);
      selectedObject.obj.quaternion.copy(q);
      // Move the selected object slightly away from the snapped object in the opposite direction of the snapped direction
      const direction = snappedDirection.clone().multiplyScalar(0);
      selectedObject.obj.rotation.y -= Math.PI / 2
      selectedObject.obj.rotation.y -= Math.PI
      selectedObject.obj.position.add(direction);
    }
    if (objToSnap.objType === "floorBackT") {
      // Apply the snapped direction to the selected object's quaternion
      const q = new THREE.Quaternion();
      q.setFromUnitVectors(new THREE.Vector3(0, 0, -1), snappedDirection);
      selectedObject.obj.quaternion.copy(q);
      // Move the selected object slightly away from the snapped object in the opposite direction of the snapped direction
      const direction = snappedDirection.clone().multiplyScalar(0);
      selectedObject.obj.rotation.y -= Math.PI / 2
      selectedObject.obj.rotation.y -= Math.PI
      selectedObject.obj.position.add(direction);
    }
    else {
      // Apply the snapped direction to the selected object's quaternion
      const q = new THREE.Quaternion();
      q.setFromUnitVectors(new THREE.Vector3(0, 0, -1), snappedDirection);
      selectedObject.obj.quaternion.copy(q);
      // Move the selected object slightly away from the snapped object in the opposite direction of the snapped direction
      const direction = snappedDirection.clone().multiplyScalar(0);
      selectedObject.obj.rotateY(-Math.PI / 2)
      selectedObject.obj.position.add(direction);
    }
  }
  if (selectedObject.objType === "floor") {
    
      const q = new THREE.Quaternion();
      q.setFromUnitVectors(new THREE.Vector3(0, 0, -1), snappedDirection);
      selectedObject.obj.quaternion.copy(q);
      //Move the selected object slightly away from the snapped object in the opposite direction of the snapped direction
      const direction = snappedDirection.clone().multiplyScalar(5);
      selectedObject.obj.position.add(direction);
    
  }
  if (selectedObject.objType === "wall") {
    // Apply the snapped direction to the selected object's quaternion
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, -1), snappedDirection);
    selectedObject.obj.quaternion.copy(q);
    // Move the selected object slightly away from the snapped object in the opposite direction of the snapped direction
    const direction = snappedDirection.clone().multiplyScalar(-.1);
    selectedObject.obj.position.add(direction);
  }
  if(selectedObject.objType === 'roof'){
    const object1Position = objToSnap.obj.position.clone();
    const object1Orientation = new THREE.Vector3(0, 0, 1); 

    const object2WorldPosition = new THREE.Vector3();
    snapRadius.getWorldPosition(object2WorldPosition);

    const vectorToObject2 = object2WorldPosition.clone().sub(object1Position);

  // Calculate the dot product of the orientation and vector to object2
    const dotProduct = object1Orientation.dot(vectorToObject2);
    // Apply the snapped direction to the selected object's quaternion
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, -1), snappedDirection);
    selectedObject.obj.quaternion.copy(q);
    // Move the selected object slightly away from the snapped object in the opposite direction of the snapped direction
    var direction = 0
  

    if (dotProduct < 0) {
       direction = snappedDirection.clone().multiplyScalar(4.9);
    } else{
       direction = snappedDirection.clone().multiplyScalar(-4.9);
    } 
   
    selectedObject.obj.position.add(direction);
  }
 
  return selectedObject.obj.position;
}



