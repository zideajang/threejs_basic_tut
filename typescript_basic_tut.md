```typescript
type numArray = Array<number>

const last = (arr:Array<number|string>)=>{
    return arr[arr.length - 1];
}

const l = last([1,2,3]);
const l2 = last(['a','b','c'])
```

```typescript
type numArray = Array<number>

const last = <T>(arr:T[])=>{
    return arr[arr.length - 1];
}

const l = last([1,2,3]);
const l2 = last(['a','b','c'])
```

```typescript
type numArray = Array<number>

const last = <T>(arr:T[])=>{
    return arr[arr.length - 1];
}

const l = last<number>([1,2,3]);
const l2 = last<string>(['a','b','c'])

```

```typescript
type numArray = Array<number>

const last = <T>(arr:T[]):T=>{
    return arr[arr.length - 1];
}

const l = last<number>([1,2,3]);
const l2 = last<string>(['a','b','c'])

const makeArr = <T,E>(x:T,y:E):[T,E] =>{
    return [x,y];
}

const v = makeArr<number,number>(5,6);
const v2 = makeArr("hello","world");

```