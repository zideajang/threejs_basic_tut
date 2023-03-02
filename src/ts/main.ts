import {
    Mesh
} from 'three';
import App from './app';
import Generator from './generator';

enum MODE {
    move,
    edit,
    normal,
}

let mode = MODE.normal;

const app = new App();
app.animate();
// app.addSunLight();
// app.addGround();
const gen =  new Generator();

const btns = document.querySelectorAll(".menu");

btns[0].addEventListener("click",(e:any)=>{
    
    let geometryType:any = null;
    if(e.target.tagName === "IMG"){
        geometryType = e.target.parentElement.className;
    }
    if (e.target.tagName === "BUTTON"){
        geometryType = e.target.className;
    }

    if(geometryType === "clearSpline"){
        console.log("clearSpline");
        app.clearLine();
    }

    if(geometryType == "spline"){
        app.mode = 1;
    }else{

        const geometry:Mesh|null = gen.run(geometryType);
        
        if(geometry !=null){
            app.addScene(geometry);
            app.controls.attach(geometry);
            app.scene.add(app.controls);
        }
    
    
        if(mode == MODE.normal){
            app.orbit.enabled = false;
            mode = MODE.move
        }
    }


    // const geometry = createGeometry(geometryType,normalMaterial);
    // scene.add(geometry);
    // pickableObjects.push(geometry);
})