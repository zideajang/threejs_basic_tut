// 引入 threejs
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

// 创建场景(实例化场景)
const scene = new THREE.Scene();
// 定义摄像机
const camera = new THREE.PerspectiveCamera(
    45, 
    window.innerWidth/window.innerHeight,
    0.1,
    1000);
// 获取 canvas
const gl = document.querySelector(".webgl");

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
    canvas:gl
});

// 创建 rayCaster
const rayCaster = new THREE.Raycaster();
let mousePos = new THREE.Vector2();


// 定义渲染范围
renderer.setSize(window.innerWidth,window.innerHeight);
// 将 canvas 添加到 dom
// document.body.appendChild(renderer.domElement);
const orbit = new OrbitControls(camera,renderer.domElement);

// 显示坐标
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 调整摄像机位置
camera.position.x = 2;
camera.position.y = 2;
camera.position.z = 10;

// 绘制线
const lineMaterial = new THREE.LineBasicMaterial({
    color:0x0000ff
})

const points = [];
points.push(new THREE.Vector3(-10,0,0))
points.push(new THREE.Vector3(0,10,0))
points.push(new THREE.Vector3(10,0,0))

const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

const line = new THREE.Line(lineGeometry,lineMaterial);
scene.add(line);

// console.log(camera)
function createSunLight(scene){
    const sunLight = new THREE.DirectionalLight(0x121212,10);
    sunLight.position.set(0,100,0);
    sunLight.position.multiplyScalar(5.0);

    sunLight.castShadow = true;
    sunLight.lookAt(new THREE.Vector3(0,0,0));

    scene.add(sunLight);

    return sunLight;
}

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
    const plane = new THREE.Mesh(planeGeometry,planeBasicMaterial);

    // const edge = new THREE.EdgesGeometry(plane.geometry);
    // const edgeMaterial = new THREE.LineBasicMaterial({color:0xffff00})
    const edge = new THREE.WireframeGeometry(planeGeometry);
    const wireframe = new THREE.LineSegments(edge)
    scene.add(plane)
    scene.add(wireframe)
    // plane.rotation.x = 90;
    // wireframe.rotation.x = 90;

    // wrieframw

    return plane
}
// 创建自然光
const sunLight = createSunLight(scene);
const ground = createPlane(scene);

let pnts = [];
const material = new THREE.LineBasicMaterial( { 
    color: 0x0000ff,
    linewidth: 5,
} );
// console.log(material.resolution)
// material.resolution.set(window.innerWidth, window.innerHeight)
window.addEventListener("click",function(e){
    console.log("click")

    const planeOne = new THREE.Plane(new THREE.Vector3(0,0,1),0)
    mousePos.x = (e.clientX/window.innerWidth) * 2 -1;
    mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
    console.log(mousePos)
    rayCaster.setFromCamera(mousePos,camera);
    let intersects = new THREE.Vector3();
    rayCaster.ray.intersectPlane(planeOne,intersects);
    console.log(intersects)
    console.log(rayCaster.ray);
    pnts.push(new THREE.Vector3(
        intersects.x,
        intersects.y,
        intersects.z,
    ))
    const sphereGeometry = new THREE.SphereGeometry(0.1);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color:0xff0000
    })

    
    const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
    sphere.position.set(
        intersects.x,
        intersects.y,
        intersects.z)
    
    if(pnts.length > 1){
        const geometry = new  THREE.BufferGeometry().setFromPoints( pnts );
        const line = new THREE.Line( geometry, material );
        
        scene.add(line)
    }

    scene.add(sphere);
})

window.addEventListener("rightclick",function(e){
    console.log("right click")
})


const sunLightHelper = new THREE.DirectionalLightHelper(sunLight,5);
scene.add(sunLightHelper);


console.log(ground)

function createDefaultBox(scene){
    const boxGeometry = new THREE.BoxGeometry(1,1,1);
    const boxMaterial = new THREE.MeshBasicMaterial({color:0x0ff00});
    const box = new THREE.Mesh(boxGeometry,boxMaterial);
    scene.add(box);
    return box
}
// 创建 box

box = createDefaultBox(scene);

// 更新界面
function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera)
}

animate();
