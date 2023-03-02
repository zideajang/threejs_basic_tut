import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {createGeometry,createArrow} from './common.js'
// 人工智能，
const scene = new THREE.Scene();

const modeMap = new Map();
modeMap.set(0,"普通模式");
modeMap.set(1,"移动模式");
modeMap.set(2,"编辑模式");

let mode = 0; // 0 select mode 1 move mode 2 edit mode

//获取dom元素
const msg = document.querySelector(".message span");

// 定义高亮显示材质
const highlightMaterial = new THREE.MeshBasicMaterial({
    color:0xffff00
});
const normalMaterial = new THREE.MeshBasicMaterial({
    color:0x0000ff
});

// 可选择几何体,对 threejs 对象进行封装添加 pickable
const pickableObjects = [];

const camera = new THREE.PerspectiveCamera(
    45, 
    window.innerWidth/window.innerHeight,
    0.1,
    1000);
camera.position.x = 5;
camera.position.y = 3;
camera.position.z = 5;
const gl = document.querySelector(".webgl");

const renderer = new THREE.WebGLRenderer({
    antialias:true,
    canvas:gl
});

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
const orbit = new OrbitControls(camera,renderer.domElement);
orbit.enableDamping = true;

renderer.shadowMap.enabled = true;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const grid = new THREE.GridHelper(10,10)
grid.receiveShadow = true;
scene.add(grid)

const btns = document.querySelectorAll(".menu");

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}

window.addEventListener("resize",onWindowResize);

// TODO reduce state push 
// create_geometry event -> function 

// 响应式，双向绑定


// 单击几何体对其进行移动
// 双击几何体对其进行编辑
const rayCaster = new THREE.Raycaster();
// 
const mousePos = new THREE.Vector2();
// 
const movePos = new THREE.Vector2();

let intersectObject = null;
const arrawObjects = [];
const draggableObjects = [];

class LocationHelper{
    constructor(rotation,translate){
        
    }
}

function updateLocationHelper(center,visible){
    if(arrawObjects){
        arrawObjects.forEach((ele)=>{
            ele.axisArrow.visible = visible;
            ele.axisHelper.visible = visible;
        })
    }
}


function initLocationHelper(){
    const center = new THREE.Vector3(0,0,0)
    
    const axisXHelperObj= createArrow(scene,"xaxis",center)
    const axisYHelperObj= createArrow(scene,"yaxis",center)
    const axisZHelperObj = createArrow(scene,"zaxis",center)

    arrawObjects.push(axisXHelperObj);
    arrawObjects.push(axisYHelperObj);
    arrawObjects.push(axisZHelperObj);

    axisXHelperObj.axisArrow.visible = false;
    axisYHelperObj.axisArrow.visible = false;
    axisZHelperObj.axisArrow.visible = false;

    axisXHelperObj.axisHelper.visible = false;
    axisYHelperObj.axisHelper.visible = false;
    axisZHelperObj.axisHelper.visible = false;

    draggableObjects.push(axisXHelperObj.axisArrow);
    draggableObjects.push(axisYHelperObj.axisArrow);
    draggableObjects.push(axisZHelperObj.axisArrow);
}
/**
 * mousedown draggable = intersection object
 * mousemove (mousedown/mouseup)
 * mouseup draggable = null 
 */

let startMovePos = null;
let endMovePos = null;

gl.addEventListener("mousedown",(e)=>{
    console.log("mousedown")

    console.log(`mode = ${mode}`)
    mousePos.x = (e.clientX/window.innerWidth) * 2 -1;
    mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
    rayCaster.setFromCamera(
        mousePos,camera
    )

    

    if(mode === 0){//选择模式
        intersects = rayCaster.intersectObjects(pickableObjects,false);
        if (intersects.length > 0){
            if(intersectObject === null){
                intersectObject = intersects[0].object;
                intersectObject.material = highlightMaterial
                updateLocationHelper(intersectObject,true);
            }
        }
        // else{
        //     if(intersectObject !== null){
        //         intersectObject.material = normalMaterial;
        //     }
        //     intersectObject = null;
        //     if (boxHelper !== null){
        //         scene.remove(boxHelper);
        //         boxHelper = null;
        //     }
        // }
    }else{
        intersects = rayCaster.intersectObjects(draggableObjects,false);
        if(intersects.length === 0){
            if(intersectObject){
                intersectObject.material = normalMaterial;
                updateLocationHelper(null,false);
                intersectObject = null
            }
        }else{
            if (intersects[0].object.name.split('_')[1] === 'x'){
                startMovePos = mousePos.x
            }
            
            if (intersects[0].object.name.split('_')[1] === 'y'){
                
                startMovePos = mousePos.x
            }
            
            if (intersects[0].object.name.split('_')[1] === 'z'){
                startMovePos = mousePos.x
                
            }
        }
        console.log(intersects)
        console.log(intersects.length)
    }
    


    // if(drag){
    //     orbit.enabled = false;
    // }
    
    
    // if(intersectObject){
    //     if(intersectObject.name == intersects[0].object.name){
            
    //         boxHelper = new THREE.BoxHelper(intersectObject);
    //         createLocationHelper(intersectObject);
    //         scene.add(boxHelper);
    //         if(intersectObject.userData.draggable){
    //             draggable = intersectObject
    //             console.log(`found draggable ${draggable.userData.name}`)
    //         }
    //     }
    // }

},false);

function onModeChange(mode){
    if(mode === 0){
        if(orbit.enabled === true ){
            orbit.enabled = false;
        }
     
    }
    if(mode === 1){
        if(orbit.enabled === false ){
            orbit.enabled = true;
        }
    }

    console.log(msg)
    msg.innerHTML = modeMap.get(mode);

}

initLocationHelper();

gl.addEventListener("mouseup",(e)=>{

    console.log("mouseup");
    if(mode === 0){
        if(intersectObject){
            onModeChange(mode);
            mode = 1;
    
        }
    }else{
        if(intersectObject === null){
            onModeChange(mode);
            mode = 0;
        }
    }
    
    
    drag = false;
},false)

gl.addEventListener("mousemove",(e)=>{

    if(mode === 1){
        movePos.x = (e.clientX/window.innerWidth) * 2 -1;
        movePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
        rayCaster.setFromCamera(
            movePos,camera
        )


    }
})

// gl.addEventListener("mousemove",(e)=>{
//     // console.log("mousemove");
//     if(intersectObject){
        
//     }else{
//         orbit.enabled = true;
//     }
//     mousePos.x = (e.clientX/window.innerWidth) * 2 -1;
//     mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;


//     if(drag && intersectObject){
//         intersectObject.position.x = mousePos.x;
//         intersectObject.position.z = mousePos.y;
//         console.log(intersectObject.position)
//     }else{

//         intersects = rayCaster.intersectObjects(pickableObjects,false);
        
//     }
// },false)

btns[0].addEventListener("click",(e)=>{
    let geometryType = null;
    if(e.target.tagName === "IMG"){
        geometryType = e.target.parentElement.className;
    }
    if (e.target.tagName === "BUTTON"){
        geometryType = e.target.className;
    }

    const geometry = createGeometry(geometryType,normalMaterial);
    scene.add(geometry);
    pickableObjects.push(geometry);
})

function animate(){
    orbit.update();
    renderer.render(scene,camera);
}

renderer.setAnimationLoop(animate)