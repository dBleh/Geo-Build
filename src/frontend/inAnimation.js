
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


