import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    GridHelper,
    Vector2,
    Raycaster,
    Plane,
    DirectionalLight,
    Vector3,
    PlaneGeometry,
    DoubleSide,
    MeshBasicMaterial,
    WireframeGeometry,
    LineSegments,
    BufferGeometry,
    Line,
    SphereGeometry,
    Mesh,
    Material,
    ShapeUtils,
    Color,
    Object3D,
    Group,
} from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls'

import SplineCreateor from './SplineCreateor';
import { generateRandomString } from './utils';
import Spline from './Spline';

interface Observable{

}


export default class App{
    w:number;
    h:number;
    aspect:number;
    scene:Scene;
    camera:PerspectiveCamera;
    gl:any;
    renderer:WebGLRenderer;
    orbit:OrbitControls;
    controls:TransformControls;
    grid:GridHelper;
    rayCaster:Raycaster;
    rayCasterPlane:Raycaster;
    mousePos:Vector2;
    pickableObjects:Mesh[];
    ground:Plane|null;
    sunLight:DirectionalLight;
    currentLine:Line|null;
    currentLineName:string;
    mode:number;
    intersectObject:Object3D|null;
    splineCreateor:SplineCreateor;
    currentSpline:Spline|null;
    currentSplineName:string;
    
    intersectsPnt:Vector3;

    constructor(){
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.aspect = this.w/this.h

        // 创建场景
        this.scene = new Scene();
        //创建摄像机
        this.camera = new PerspectiveCamera(
            45,
            this.aspect,
            0.1,
            1000
        );
        this.camera.position.x = 0;
        this.camera.position.y = 1;
        this.camera.position.z = 5;
        // 获取 canvas 元素
        this.gl = document.getElementsByClassName("webgl")[0];
        // 定义 webgl 渲染器
        this.renderer = new WebGLRenderer({
            antialias:true,
            canvas:this.gl
        });

        this.currentLine = null;
        this.currentLineName = '';

        this.renderer.setSize(this.w,this.h);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;

        this.orbit = new OrbitControls(this.camera,this.renderer.domElement);
        this.orbit.enableDamping = true;

        this.controls = new TransformControls(this.camera,this.renderer.domElement);
        this.controls.addEventListener('dragging-changed',(e)=>{
            this.orbit.enabled = false;
            if(this.mode === 0){

                this.scene.children
                .filter(ele=>{
                    return ele.type === "Mesh"
                })
                .filter(ele=>{
                    return ele.name.includes(this.currentSplineName)
                })


            }else{

                const idx = this.intersectObject.name.split("_")[1]
                this.splineCreateor.updatePnt(
                    this.currentSplineName,
                    idx,
                    this.intersectObject?.position)
            }

            // if(this.currentLine != null){

            //     this.scene.remove(this.currentLine);
            //     const selectedObj = this.scene.getObjectByName("spline_line_" + this.currentLineName)
            //     if(selectedObj){
            //         console.log("remove...")
            //         this.scene.remove(selectedObj);
            //     }
                
            //     const newPnts = this.scene.children.filter(ele=>{
            //             return ele.type === "Mesh"
            //         }).filter(ele=>{
            //             return (ele.name.includes(this.currentLineName))
            //         }).map(ele=>{
            //             return (ele.position)
            //         })
            //     console.log(newPnts.length);
            //     console.log(newPnts);
            //     const geometry = new  BufferGeometry().setFromPoints( newPnts );
            //     const newLine = new Line( geometry, new MeshBasicMaterial({
            //         color:0xff00ff
            //     }) );
            //     newLine.name = "spline_line_" + this.currentLineName;
            //     this.scene.add(newLine);
            //     this.currentLine = newLine;
                
            // }
        })
        // 创建网格
        this.grid = new GridHelper(10,10);
        this.grid.receiveShadow = true;
        this.scene.add(this.grid);
        // 添加点击事件
        this.gl.addEventListener("click",this.onClickHandler,false);
        // 添加右键点击事件
        this.gl.addEventListener("contextmenu",this.onRightClickHandler,false);
        //双击事件
        this.gl.addEventListener("dblclick",this.onDoubleClickHander,false);
        document.addEventListener("keydown",(e:KeyboardEvent)=>{
            // console.log(e.key);
            if(this.mode === 2){
                if(e.key === 'Delete'){
                    console.log("移除该点...");
                    if(this.intersectObject){

                        const idx = this.intersectObject.name.split("_")[1]
                        this.splineCreateor.removePnt(this.currentSplineName,idx);
                        this.controls.detach(this.intersectObject);
                        this.intersectObject = null;
                    }
                }
            }
            if(this.mode === 1){

                if(e.key === "Backspace"){
                    console.log("goback")
                    this.splineCreateor.goback(this.currentSplineName);
                }
            }
        },false);
        // 创建 ray
        this.rayCaster = new Raycaster();
        this.rayCasterPlane = new Raycaster();
        this.mousePos = new Vector2();

        this.pickableObjects = [];

        this.ground = null;

        this.sunLight = new DirectionalLight(0x121212,10);

        this.mode = 0;

        this.intersectObject = null;

        this.splineCreateor = new SplineCreateor(this.scene);
        this.currentSpline = null;
        this.currentSplineName = "";
        this.selecte

        this.intersectsPnt = new Vector3();

    }
    addSunLight(){
        
        this.sunLight.position.set(0,100,0);
        this.sunLight.position.multiplyScalar(5.0);
    
        this.sunLight.castShadow = true;
        this.sunLight.lookAt(new Vector3(0,0,0));
    
        this.scene.add(this.sunLight);
    
    }
    onRightClickHandler = (e:MouseEvent)=>{
        console.log("right click");
        if(this.mode === 0){
            if(this.currentSplineName){

                this.currentSplineName = ""
            }
        }

        // 更新
        if (this.mode == 1){
            this.mode = 0;
            let isClosed = confirm("是否闭合");
            if(isClosed){
                this.splineCreateor.setIsClosed(this.currentSplineName,isClosed);
            }

            this.currentSplineName = ''
            this.currentSpline = null;
            
        }
        if (this.mode == 2){
            this.pickableObjects.filter((ele)=>{
                return !ele.name.includes(this.currentLineName)
            })

            this.orbit.enabled = true;

            if(this.intersectObject != null){
                this.intersectObject.material.color.set(0xff0000);
                this.controls.detach(this.intersectObject);
                this.intersectObject = null;
            }

            this.scene.children.forEach((ele) => {
                console.log(ele);
            });

            this.currentLine = null;
            this.currentLineName = "";
            this.mode = 0;
        }
    }

    onDoubleClickHander = (e:MouseEvent) =>{
        const doubleClickPos = new Vector2();
        doubleClickPos.x = (e.clientX/window.innerWidth) * 2 -1;
        doubleClickPos.y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        this.rayCaster.setFromCamera(
            doubleClickPos,this.camera
        )

        // let intersects:any[] = this.rayCaster.intersectObjects(this.scene.children.filter((e)=>{
        //     // return e?.type === "Mesh";
        // }),false);
        let intersects:any[] = this.rayCaster.intersectObjects(this.scene.children.filter((ele)=>{
            return ele.type === "Mesh";
        }),false);

        // let intersectLines:any[] = this.rayCaster.intersectObjects(this.scene.children.filter((ele)=>{
        //     return ele.type === "Line";
        // }),false);


        if(intersects.length > 0){

            if(this.mode === 2){
                if (this.intersectObject !== null){
                    this.intersectObject.material.color = new Color(1,0,0);
                }
                console.log(111)
                this.intersectObject =  intersects[0].object;
                this.intersectObject.material.color = new Color(0,0,1);
               
            }else{
                console.log("enter edit mode");
                if (intersects.length === 1){
    
                    this.intersectObject =  intersects[0].object;
                    this.intersectObject.material.color = new Color(0,0,1);
                    this.currentSplineName = this.intersectObject?.name.split("_")[0]
                    
                    // 进入编辑模式
                    this.mode = 2;
                }
            }
    
            this.controls.attach(this.intersectObject);
            this.scene.add(this.controls);
        }else{
            console.log(intersectLines);
            intersectLines[0].object.material.color = new Color(0,0,1);
            this.currentSplineName = intersectLines[0].object?.name
            
            const newPnt = new Vector3(
                this.intersectsPnt.x,
                this.intersectsPnt.y,
                this.intersectsPnt.z,
            );
            
            this.splineCreateor.addPnt(this.currentSplineName,newPnt);
            // intersectLines.forEach(ele=>{
            //     ele.object.material.color = new Color(0,0,1);
            // })
        }
        
        
    }
    addGround(){
        const planeGeometry = new PlaneGeometry(10,10,20,20);
        const planeBasicMaterial = new MeshBasicMaterial({
            color:0xababab,
            side:DoubleSide
        });
        
        const plane = new Mesh(planeGeometry,planeBasicMaterial);

        const edge = new WireframeGeometry(planeGeometry);
        const wireframe = new LineSegments(edge)
        this.scene.add(plane)
        this.scene.add(wireframe)

        plane.rotation.x = -0.5 * Math.PI;
        wireframe.rotation.x = -0.5 * Math.PI;
    }

    addScene(geometry:Mesh){
        this.pickableObjects.push(geometry);
        this.scene.add(geometry);
    }
    //创建模式，退出创建模式，右键单击
    //移动模式
    //编辑模式

    onClickHandler = (e:MouseEvent)=>{
        console.log(this.mode);
        // 鼠标
        this.mousePos.x = (e.clientX/window.innerWidth) * 2 -1;
        this.mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        this.rayCaster.setFromCamera(
            this.mousePos,this.camera
        );
        
        if(this.mode === 0){
            let intersects:any[] = this.rayCaster.intersectObjects(this.scene.children.filter((ele)=>{
                return ele.type === "Mesh";
            }),false);

            if(intersects.length > 0){

                this.currentSplineName = intersects[0].object.name.split("_")[0];
                console.log(this.currentLineName)
                const grp = new Group();
                this.scene.children
                .filter(ele=>{
                    return ele.type === "Mesh" || ele.type === "Line";
                })
                .filter(ele=>{
                    return ele.name.includes(this.currentLineName)
                }).forEach(ele=>{
                    console.log(ele);
                    grp.add(ele)
                })
                this.scene.add(grp);
                this.controls.attach(grp)
                this.scene.add(this.controls);
            }

        }

   
        if(this.mode === 1){
            const planeOne = new Plane(new Vector3(0,1,0),0)
            this.rayCaster.ray.intersectPlane(planeOne,this.intersectsPnt);
            
            const newPnt = new Vector3(
                this.intersectsPnt.x,
                this.intersectsPnt.y,
                this.intersectsPnt.z,
            );

            if(this.currentSplineName.length === 0){
                this.currentSplineName = generateRandomString(5);
                this.splineCreateor.addSpline(this.currentSplineName);
            }
            
            this.splineCreateor.addPnt(this.currentSplineName,newPnt);
            
        }
    }

    animate = ()=>{
        requestAnimationFrame(this.animate);
        this.orbit.update();
        this.renderer.render(this.scene,this.camera);
    }
    
}