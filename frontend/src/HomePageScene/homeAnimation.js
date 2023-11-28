import * as THREE from 'three';

export function onCollision(objs){
    var objectOne = objs[0]
    var objectTwo = objs[1]
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(1, 1, 1), objectOne.objectDirection);
    objectOne.obj.quaternion.copy(q);
    objectOne.objectDirection.multiplyScalar(-1); // reverse the direction


    const v = new THREE.Quaternion();
    v.setFromUnitVectors(new THREE.Vector3(1, 1, 1), objectTwo.objectDirection);
    objectTwo.obj.quaternion.copy(v);
    objectTwo.objectDirection.multiplyScalar(-1); // reverse the direction

    
    const list = [objectOne,objectTwo]
    return list
}
export function checkCollision(objList){

    for(var i =0; i < objList.length;i++){
        const bounds = new THREE.Box3().setFromObject(objList[i].obj);
        for(var j=0;j<objList.length;j++){
            if(j!==i){
                const intersects = bounds.intersectsBox(new THREE.Box3().setFromObject(objList[j].obj));
                if(intersects){
                    const list = [objList[i],objList[j]]
                    return list
                }   
            }
        }  
    }            
}