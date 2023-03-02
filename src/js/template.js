// TODO 对目标进行分组，然后同一操作


import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
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

// 定义渲染范围
renderer.setSize(window.innerWidth,window.innerHeight);
const orbit = new OrbitControls(camera,renderer.domElement);

// 显示坐标
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 调整摄像机位置
camera.position.x = 2;
camera.position.y = 2;
camera.position.z = 10;

function createSunLight(scene){
    const sunLight = new THREE.DirectionalLight(0x121212,10);
    sunLight.position.set(0,100,0);
    sunLight.position.multiplyScalar(5.0);

    sunLight.castShadow = true;
    sunLight.lookAt(new THREE.Vector3(0,0,0));

    scene.add(sunLight);

    return sunLight;
}

// 创建地面
function createPlane(scene){
    const planeGeometry = new THREE.PlaneGeometry(10,10,20,20);
    const planeBasicMaterial = new THREE.MeshBasicMaterial({
        color:0xababab,
        side:THREE.DoubleSide
    });

    const plane = new THREE.Mesh(planeGeometry,planeBasicMaterial);

    const edge = new THREE.WireframeGeometry(planeGeometry);
    const wireframe = new THREE.LineSegments(edge)
    scene.add(plane)
    scene.add(wireframe)

    return plane
}

// 创建自然光
const sunLight = createSunLight(scene);
const ground = createPlane(scene);

let grp = [];


function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera)
}

animate();