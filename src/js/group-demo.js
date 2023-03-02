// TODO 对目标进行分组，然后同一操作
// 点击创建
import * as THREE from 'three';
import { Vector2 } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import {createPlane,createSunLight} from './common.js'
import {calCenter} from './utils.js'

// 创建场景
const scene = new THREE.Scene();
// 创建摄像机
const camera = new THREE.PerspectiveCamera(
    45, 
    window.innerWidth/window.innerHeight,
    0.1,
    1000);
// 获取 canvas 元素
const gl = document.querySelector(".webgl");

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
    canvas:gl
});

renderer.shadowMap.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;

// 定义渲染范围
renderer.setSize(window.innerWidth,window.innerHeight);
const orbit = new OrbitControls(camera,renderer.domElement);
orbit.enableDamping = true;

// 显示坐标
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 调整摄像机位置
camera.position.x = 30;
camera.position.y = 30;
camera.position.z = 10;

let pickableArr = []
const boxes = new THREE.Group();

const grpMap = new Map();
// boxes.add(box)
// 选中任意 box 可以选择整个组
for (let index = 0; index < 5; index++) {
    console.log(index);
    
    const boxSize =  Math.random()
    const boxGeometry = new THREE.BoxGeometry(0.5,0.5,0.5);
    const boxMaterial = new THREE.MeshStandardMaterial({color:0x00FF00});
    const box = new THREE.Mesh(boxGeometry,boxMaterial);
    box.position.set(Math.random()*5,0,Math.random()*5);
    // 组名称_编号
    box.name = `grp_${index}`;
    box.type = "box"
    // boxes.add(box)
    scene.add(box);
    
    pickableArr.push(box)

    // scene.add(boxes);
}

grpMap.set("grp",pickableArr)

scene.add(boxes);

boxes.name = "boxes";
//选择一个组内 box 后进入移动模式，
//选择其他或者

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.25),
    new THREE.MeshBasicMaterial({
        color:0xff0000
    })
)

sphere.name = "sphere"
scene.add(sphere)

const rayCaster = new THREE.Raycaster();
let mousePos = new THREE.Vector2();
document.addEventListener("click",(e)=>{
    mousePos.x = (e.clientX/window.innerWidth) * 2 -1;
    mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
    rayCaster.setFromCamera(
        mousePos,camera
    )
    intersects = rayCaster.intersectObjects(scene.children,false)
    intersects.forEach(element => {
        // console.log(typeof element)
        // console.log(element.object)
        if(element.object instanceof THREE.Mesh){
            console.log(element.object.name)
            // 根据名称判断是否为组
            if(element.object.name.includes('_')){
                console.log("为组元素")
                //获取组名称
                group_name = element.object.name.split("_")[0]
                selected_arr = grpMap.get(group_name);
                const pos = calCenter(selected_arr);
                console.log(pos)

                const tempSphere = new THREE.Mesh(
                    new THREE.SphereGeometry(0.25),
                    new THREE.MeshBasicMaterial({
                        color:0x00ff00
                    })
                )
                
                tempSphere.name = "grp_center"

                scene.add(tempSphere)
                tempSphere.position.set(pos.x,pos.y,pos.z)
            }else{
                
                console.log("个体组元素")
            }
            
        }
    });
    // intersects = rayCaster.intersectObjects(boxes.children,false);
    // if (intersects.length === 1){
    //     console.log("you can start movie")
    //     const pos = new Vector2();
    //     let xposArr = [];
    //     let zposArr = [];
   

    //   pos.x = avearage_x
    //   pos.y = avearage_z

    //   const centerSphere = new THREE.Mesh(
    //     new THREE.SphereGeometry(0.1),
    //     new THREE.MeshBasicMaterial({
    //         color:0xff0000
    //     })
    //   )
    // console.log(x,z)
    //   scene.add(centerSphere);
    //   centerSphere.position.x = avearage_x;
    //   centerSphere.position.y = 0;
    //   centerSphere.position.z = avearage_z;
    // }
            
            
},false);

// 创建自然光
const sunLight = createSunLight(scene);
// const ground = createPlane(scene);
const grid = new THREE.GridHelper(10,10)
grid.receiveShadow = true;
scene.add(grid)

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera)

    orbit.update();

    // boxes.position.x += 0.01;
    // boxes.rotation.y += Math.PI/45;
}

animate();