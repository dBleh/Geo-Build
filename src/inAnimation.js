
import * as THREE from 'three';

export function getIntersectObj(object,snapRadius) {
    const bounds = new THREE.Box3().setFromObject(object.obj);
    const intersects = bounds.intersectsBox(new THREE.Box3().setFromObject(snapRadius));
    if (!intersects) {
        return false
    }
    else {
        if (object.objType === 'wall' && object.slotOne === 'unoccupied') {
            
            return object
        }
    }
}