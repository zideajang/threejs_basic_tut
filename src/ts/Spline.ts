import { 
    Vector3,
} from "three";



export default class Spline{

    pnts:Vector3[];
    cache:Vector3[][];
    render:Function;
    name:string;
    pntToPntMinDistance:number;
    isClosed:boolean;
    constructor(name:string,pnts:Vector3[]=[],render:Function){
        this.pnts = pnts;
        this.name = name;
        this.cache = [];
        this.render = render;    
        this.pntToPntMinDistance = 0.01;
        //默认闭合是
        this.isClosed = false;
    }

    setIsClosed(isClosed: boolean) {
        this.isClosed = isClosed;
        console.log(this.isClosed);
        this.render(this.name,this.pnts,this.isClosed);
    }

    addPnt(newPnt:Vector3):void{
        let isAppendable = true;
        if(this.pnts.length < 2){
            this.pnts?.push(newPnt);
            
        }else{
            this.pnts?.forEach((pnt:Vector3)=>{
                if (newPnt.distanceTo(pnt) < 0.05){
                    isAppendable = false;
                }
            });
            let pntPairList = [];
            for (let index = 0; index < this.pnts.length-1; index++) {
                pntPairList.push([this.pnts[index],this.pnts[index+1]]);
            }

            // 计算点到直线的距离
            pntPairList.forEach((pnts:Vector3[],index:number)=>{
                const pnt1ToNewPntDistance = newPnt.distanceTo(pnts[0]);
                const pnt2ToNewPntDistance = newPnt.distanceTo(pnts[1]);
                const pnt1ToPnt2 = pnts[0].distanceTo(pnts[1]);
                
                if(Math.abs(pnt1ToPnt2 - (pnt1ToNewPntDistance + pnt2ToNewPntDistance)) < this.pntToPntMinDistance){
                    isAppendable = false;
                    this.pnts?.splice(index+1,0,newPnt);
                }
            })
            if(isAppendable)
                this.pnts.push(newPnt)
        }

        this.render(this.name,this.pnts,this.isClosed);
    }

    goback():boolean{
        if(this.pnts.length === 0){
            return false
        }else{
            this.pnts.pop();
            this.render(this.name,this.pnts);
            
        }
        return true;
    }

    remove(idx:number):void{
        this.pnts.splice(idx,1);
        this.render(this.name,this.pnts,this.isClosed);
    }

    update(idx:number,newPos:Vector3):void{
        this.pnts[idx] = newPos;
        this.render(this.name,this.pnts,this.isClosed,false);
    }
}

