import { Vector3 } from "three";

interface Subject {
    attach(observer:Observer):void;
    detach(observer:Observer):void;

    notify():void;
}

interface Observer{
    update(subject:Subject):void;
}

class SplineActionSubject implements Subject{

    public pnts:Vector3[] = [];
    private observers:Observer[] = [];

    attach(observer: Observer): void {
        throw new Error("Method not implemented.");
        const isExist = this.observers.includes(observer);
        if(isExist){
            return console.log("observer has been attached already")
        }
        this.observers.push(observer);

    }
    detach(observer: Observer): void {
        throw new Error("Method not implemented.");
    }
    notify(): void {
        throw new Error("Method not implemented.");
    }

    addPnt():void{

    }
    
}

class MsgObserver implements Observer{
    update(subject: Subject): void {
        throw new Error("Method not implemented.");
    }

}