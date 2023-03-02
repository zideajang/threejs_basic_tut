import * as THREE from 'three';
function createPlane(scene){
    const planeGeometry = new THREE.PlaneGeometry(10,10,20,20);
    const planeBasicMaterial = new THREE.MeshBasicMaterial({
        color:0xababab,
        side:THREE.DoubleSide
    });
    const planeMaterial = new THREE.MeshPhongMaterial({
        color:0x121212,
        polygonOffset:true,
        polygonOffsetFactor:1,
        polygonOffsetUnits:1,
        side:THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry,planeMaterial);

    const edge = new THREE.WireframeGeometry(planeGeometry);
    const wireframe = new THREE.LineSegments(edge)
    scene.add(plane)
    scene.add(wireframe)
    plane.rotation.x = Math.PI/2;
    wireframe.rotation.x = Math.PI/2;
    return plane
}

function createSunLight(scene){
    const sunLight = new THREE.DirectionalLight(0x121212,10);
    sunLight.position.set(0,100,0);
    sunLight.position.multiplyScalar(5.0);

    sunLight.castShadow = true;
    sunLight.lookAt(new THREE.Vector3(0,0,0));

    scene.add(sunLight);

    return sunLight;
}

function createBox(scene){
    const boxGeometry = new THREE.BoxGeometry(2,2,2);
    const boxMaterial = new THREE.MeshStandardMaterial({color:0x00FF00});
    const box = new THREE.Mesh(boxGeometry,boxMaterial);
    
    scene.add(box);

    return box;
}

function createArrow(scene,axisName,pos){
    let axisEnd = null;
    let axisColor = null;
    
    if(axisName === "xaxis"){
        axisEnd = new THREE.Vector3(pos.x + 2,pos.y,pos.z);
        axisColor = 0xff0000;
        
    }
    if(axisName === "yaxis"){
        axisEnd = new THREE.Vector3(pos.x,pos.y + 2,pos.z);
        axisColor = 0x00ff00;
    }
    if(axisName === "zaxis"){
        axisEnd = new THREE.Vector3(pos.x,pos.y,pos.z + 2);
        axisColor = 0x0000ff;
    }
    const lineMaterial = new THREE.LineBasicMaterial({
        color:axisColor
    });

    const axisArrow = new THREE.Mesh(
        new THREE.ConeGeometry(
            0.15,0.25
        ),
        new THREE.MeshBasicMaterial({
            color:axisColor
        })
    );
    if(axisName === "xaxis"){
        axisArrow.rotation.z = -Math.PI * 0.5
        axisArrow.position.x = 2;

        axisArrow.name = "axis_x";
    }
    if(axisName === "yaxis"){
        axisArrow.rotation.y = -Math.PI * 0.5
        axisArrow.position.y = 2;
        axisArrow.name = "axis_y"
        
    }
    if(axisName === "zaxis"){
        axisArrow.rotation.z = -Math.PI * 0.5
        axisArrow.rotation.y = -Math.PI * 0.5
        axisArrow.position.z = 2;

        axisArrow.name = "axis_z";

    }
    scene.add(axisArrow);
  
    const axisHelper = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([pos,axisEnd]),
        lineMaterial
    );
    scene.add(axisHelper);

    return {
        axisArrow:axisArrow,
        axisHelper:axisHelper
    }

}

function createGeometry(type,normalMaterial){
    let geometry = null
    if(type === "sphere"){
        geometry = new THREE.Mesh(
            new THREE.SphereGeometry(0.5),
            normalMaterial)
        geometry.userData.name = "SPHERE";
        geometry.name = "sphere";
    }

    if(type === "plane"){
        geometry = new THREE.Mesh(
            new THREE.PlaneGeometry(1,1),
            normalMaterial
        )

        geometry.name = "plane";
        geometry.userData.name = "PLANE";
        return geometry
    }

    if(type === "spline"){
        
    }
    geometry.castShadow = true;
    geometry.receiveShadow = true;
    geometry.userData.draggable = true;
    
    return geometry
}

export {createGeometry,createPlane, createSunLight,createBox,createArrow}