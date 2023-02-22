
import * as THREE from 'three';

const TRIANGLEHEIGHT = 0
//returns the object snapRadius is intersecting with, otherwise returns false.
export function getIntersectObj(object, snapRadius) {
    const bounds = new THREE.Box3().setFromObject(object.obj);
    const intersects = bounds.intersectsBox(new THREE.Box3().setFromObject(snapRadius));
    if (intersects) {
        return object
    }
    return false
}
export function setRotation(objToSnap,selectedObject){
    selectedObject.obj.rotation.set(objToSnap.obj.rotation.x, objToSnap.obj.rotation.y, objToSnap.obj.rotation.z)
    return selectedObject.obj.rotation
}
       
export function setPosition(objToSnap, selectedObject){
  var offset = 0
  if(selectedObject.objType === 'floorT'){
    offset = TRIANGLEHEIGHT
  }
  else{
    offset = selectedObject.obj.geometry.parameters.height / 2
  }
    
    selectedObject.obj.position.copy(objToSnap.obj.position)
    selectedObject.obj.position.y += offset
    if(selectedObject.objType === "floor"){
        if(objToSnap.objType === "floorRight"){
            selectedObject.obj.position.y = selectedObject.obj.position.y - 4.5
            selectedObject.obj.position.x = selectedObject.obj.position.x + 5
          }
          if(objToSnap.objType === "floorLeft" ){
            selectedObject.obj.position.y = selectedObject.obj.position.y - 4.5
            selectedObject.obj.position.x = selectedObject.obj.position.x - 5
          }
          if(objToSnap.objType === "floorFront"){
            selectedObject.obj.position.y = selectedObject.obj.position.y - 4.5
            selectedObject.obj.position.z = selectedObject.obj.position.z - 4.9
          }
          if(objToSnap.objType === "floorBack"){
            selectedObject.obj.position.y = selectedObject.obj.position.y - 4.5
            selectedObject.obj.position.z = selectedObject.obj.position.z + 4.9
          }
    }
    if(selectedObject.objType === "floorT"){
      if(objToSnap.objType === "floorRight"){
          selectedObject.obj.position.y = selectedObject.obj.position.y - 4.5
          selectedObject.obj.position.x = selectedObject.obj.position.x + 5
        }
        if(objToSnap.objType === "floorLeft" ){
          selectedObject.obj.position.y = selectedObject.obj.position.y - 4.5
          selectedObject.obj.position.x = selectedObject.obj.position.x - 5
        }
        if(objToSnap.objType === "floorFront"){
          selectedObject.obj.rotation.y = Math.PI
          selectedObject.obj.position.y = selectedObject.obj.position.y - 4.5
          selectedObject.obj.position.z = selectedObject.obj.position.z - 4.9
        }
        if(objToSnap.objType === "floorBack"){
          selectedObject.obj.position.y = selectedObject.obj.position.y - 4.5
          selectedObject.obj.position.z = selectedObject.obj.position.z + 4.9
        }
  }
    return selectedObject.obj.position

}


