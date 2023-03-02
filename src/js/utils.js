import * as THREE from 'three';

function calCenter(arr){

    if(arr ===  undefined){
        return null;
    }
    // 判断是 Mesh 

    let xposArr = [];
    let zposArr = [];

    arr.forEach(element => {
        xposArr.push(element.position.x)
        zposArr.push(element.position.z)
    });

    const xposMin =  Math.min(...xposArr);
    const xposMax =  Math.max(...xposArr);

    const zposMin =  Math.min(...zposArr);
    const zposMax =  Math.max(...zposArr);

    avearage_x = (xposMax - xposMin)/2
    avearage_z = (zposMax - zposMin)/2

    return new THREE.Vector3(avearage_x,0,avearage_z)
}


export {calCenter};