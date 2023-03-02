import { 
    Line,
    Mesh,
    Scene,
    Vector3,
    MeshBasicMaterial,
    SphereGeometry,
    BufferGeometry,
    Object3D
} from "three";

import Spline from "./Spline";

type Splines = Map<string,Spline>


export default class SplineCreateor{

    pntToPntMinDistance:number;
    sphereMaterial:MeshBasicMaterial;
    splines:Splines;
    scene:Scene;
    
    constructor(scene:Scene){

        // 点到点最小距离，如果新增点小于这个距离就添加不上
        this.pntToPntMinDistance = 0.01;
        
        this.sphereMaterial = new MeshBasicMaterial({
            color:0xff0000
        });

        this.splines = new Map();
        this.scene = scene;


    }

    setIsClosed(currentSplineName: string, isClosed: boolean) {
        const spline = this.splines.get(currentSplineName)
        if(spline){
            spline.setIsClosed(isClosed);
        }
    }

    addSpline(name:string):void{
        // const geometryId = generateRandomString(5);
        const spline = new Spline(name,[],this._render);
        this.splines.set(name,spline);
    }

    addPnt(name:string,newPnt:Vector3):void{
        const spline = this.splines.get(name);
        if(spline){
            spline.addPnt(newPnt);
        }
    }
    removePnt(name:string,idx:number):void{
        const spline = this.splines.get(name);
        spline?.remove(idx)
    }

    updatePnt(name:string,idx:number,newPos:Vector3){
        console.log(name);
        const spline = this.splines.get(name);
        console.log(spline);
        spline?.update(idx,newPos);
    }

    goback(name:string){
        const spline = this.splines.get(name)
        spline?.goback();
    }
    
    _render = (name:string,pnts:Vector3[],isClosed:false,isUpdatedSphere:boolean=true):void=>{
        // 根据 spline id 取清除
        

        const removeObjName:string[] = [];
        this.scene.children.filter(ele=>{
            if(isUpdatedSphere){
                return true
            }else{
                return ele.type === "Line"
            }
        }).forEach(ele=>{
            if(ele.isObject3D){
                if(ele.name.includes(name)){
                    removeObjName.push(ele.name);
                }
            }
        });

        if(removeObjName.length !== 0){
            removeObjName.forEach(objName=>{
                const selectedObj = this.scene.getObjectByName(objName);
                if(selectedObj)
                    this.scene.remove(selectedObj)
            });
        }

        if(isUpdatedSphere){

            if(pnts !== undefined && pnts.length > 0){
                pnts.forEach((ele:Vector3,idx:number)=>{
                    const sphereGeometry = new SphereGeometry(0.1);
                    const newSphere = new Mesh(sphereGeometry, new MeshBasicMaterial({
                        color:0xff0000
                    }));
                    newSphere.position.set(
                        ele.x,
                        ele.y,
                        ele.z
                    )
                    newSphere.name = name + "_" + idx;
                    
                    this.scene.add(newSphere);
                });
            }
        }

        
        if(pnts != null){
            const tempPnts = pnts.slice();
            if(pnts.length > 1 ){
                // if(this.lastLine){
                //     this.scene.remove(this.lastLine);
                // }
                if(isClosed){
                    tempPnts.push(pnts[0])
                }
                const geometry = new  BufferGeometry().setFromPoints(tempPnts);
                const line = new Line( geometry, new MeshBasicMaterial({
                    color:0xff00ff
                }) );

                line.name = name;
                // this.lastLine = line;
                // const isExistedLine = this.scene.getObjectByName(name);
                // if(isExistedLine){
                //     console.log(isExistedLine)
                //     this.scene.remove(isExistedLine);
                // }
                this.scene.add(line);
            }
    
        }

    }
}