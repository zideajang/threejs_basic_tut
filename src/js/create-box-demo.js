// TODO 对目标进行分组，然后同一操作
// 点击创建 box 或者

// 移动 camera setNormalAndCoplanarPoint(unitVector,originPoint)
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import {createPlane,createSunLight} from './common.js'

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

const boxes = new THREE.Group();

const rayCaster = new THREE.Raycaster();
let mousePos = new THREE.Vector2();
document.addEventListener("click",(e)=>{
    mousePos.x = (e.clientX/window.innerWidth) * 2 -1;
    mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
    rayCaster.setFromCamera(
        mousePos,camera
    )
    intersects = rayCaster.intersectObjects(scene.children,true);
    console.log(intersects.length)
},false);

// 创建自然光
const sunLight = createSunLight(scene);



function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera)

    orbit.update();

    // boxes.position.x += 0.01;
    // boxes.rotation.y += Math.PI/45;
}

animate();