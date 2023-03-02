import {
    SphereGeometry,
    Mesh,
    PlaneGeometry,
    BufferGeometry,
    MeshBasicMaterial,
    Material,
} from 'three';

export default class Generator{

    pickableObjects:Mesh[];
    material:MeshBasicMaterial;
    constructor(){
        this.pickableObjects = [];
        this.material = new MeshBasicMaterial({
            color:0x0000ff
        });
    }

    run(type:string):Mesh|null{

        let geometry:Mesh | null = null
        if(type === "sphere"){
            geometry = new Mesh(
                new SphereGeometry(0.5),
                this.material)
            geometry.userData.name = "SPHERE";
            geometry.name = "sphere";
        }
    
        if(type === "plane"){
            geometry = new Mesh(
                new PlaneGeometry(1,1),
                this.material
            )
    
            geometry.name = "plane";
            geometry.userData.name = "PLANE";
            return geometry
        }
    
        if(type === "spline"){
            
        }
        if(geometry != null){
            geometry.castShadow = true;
            geometry.receiveShadow = true;
            geometry.userData.draggable = true;
            this.pickableObjects.push(geometry);
            
        }
        return geometry
    }
}