
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
export function setPosition(objToSnap, selectedObject,snapRadius,objs) {
  var newPos = true
  var offset = 0;
  if (selectedObject.objType === 'wall') {
    offset = selectedObject.obj.geometry.parameters.height / 2 + .5;
  }
  if (selectedObject.objType === 'floor') {
    offset = -2;
  }
  if (selectedObject.objType === 'floorT') {
    offset = -4.5
  }
  if (selectedObject.objType === 'roof') {
    offset = .1
  }
  if (selectedObject.objType === 'roofT') {
    offset = 0
  }if (selectedObject.objType === 'door') {
    offset = 5
  }
  // Get the direction of the snapped object
  const snappedDirection = new THREE.Vector3(0, 0, -1);
  snappedDirection.applyQuaternion(objToSnap.obj.quaternion);
  // Set the position of the selected object to the position of the snapped object
  selectedObject.obj.position.copy(objToSnap.obj.position);
  selectedObject.obj.position.y += offset;
  if (selectedObject.objType === "floorT") {
    if (objToSnap.side === "back") {
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
    if(objToSnap.objType === "roof" || objToSnap.objType === "roofT" ) {
      selectedObject.obj.position.y -= 1
    }
    if( objToSnap.objType === "wall" ){
      selectedObject.obj.position.y -= .5
    }
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
       direction = snappedDirection.clone().multiplyScalar(4.8);
    } else{
       direction = snappedDirection.clone().multiplyScalar(-5);
    } 
   
    if(objToSnap.objType === 'roof'){
      direction.multiplyScalar(1.0419)
      selectedObject.obj.position.add(direction);
      selectedObject.obj.position.y -= .1
    }
    else{
      selectedObject.obj.position.add(direction);
    }
  }
  if (selectedObject.objType === "roofT") {
    
      // Apply the snapped direction to the selected object's quaternion
      const q = new THREE.Quaternion();
      q.setFromUnitVectors(new THREE.Vector3(0, 0, -1), snappedDirection);
      selectedObject.obj.quaternion.copy(q);
      // Move the selected object slightly away from the snapped object in the opposite direction of the snapped direction
      const direction = snappedDirection.clone().multiplyScalar(-.1);
      selectedObject.obj.rotateY(-Math.PI / 2)
      selectedObject.obj.position.add(direction);
      const object1Position = objToSnap.obj.position.clone();
      const object1Orientation = new THREE.Vector3(1, 0, 0); 
  
      const object2WorldPosition = new THREE.Vector3();
      snapRadius.getWorldPosition(object2WorldPosition);
  
      const vectorToObject2 = object2WorldPosition.clone().sub(object1Position);
  
    // Calculate the dot product of the orientation and vector to object2
      const dotProduct = object1Orientation.dot(vectorToObject2);
      if (dotProduct < 0) {
        selectedObject.obj.rotateY(Math.PI)
     }  
  }
  if (selectedObject.objType === "door") {
    // Apply the snapped direction to the selected object's quaternion
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, -1), snappedDirection);
    selectedObject.obj.quaternion.copy(q);
    // Move the selected object slightly away from the snapped object in the opposite direction of the snapped direction
    const direction = snappedDirection.clone().multiplyScalar(0);
    selectedObject.obj.position.add(direction);
  }
  for(var i =0; i < objs.length - 1;i++){
    if(selectedObject.obj.position.x === objs[i].obj.position.x  && selectedObject.obj.position.y === objs[i].obj.position.y && selectedObject.obj.position.z=== objs[i].obj.position.z){
      newPos = false
    }
  }
  if(newPos === false){
    return false
  }
  else{
    return selectedObject.obj.position;
  }
}



