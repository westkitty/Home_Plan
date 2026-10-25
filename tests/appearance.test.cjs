const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const listeners=new Map();
const elements=new Map();
for(const id of ['sceneBackgroundColor','sceneBackgroundValue','sceneBackgroundReset']){
 elements.set(id,{id,value:'#c9e9ff',textContent:'',disabled:false,handlers:{},addEventListener(type,fn){this.handlers[type]=fn;}});
}
const saved=new Map();
const rootStyle=new Map();
let renders=0;
const context={
 document:{getElementById:id=>elements.get(id),documentElement:{style:{setProperty:(key,value)=>rootStyle.set(key,value)}}},
 localStorage:{getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,value),removeItem:key=>saved.delete(key)},
 requestAnimationFrame:fn=>{fn();return 1;},
 addEventListener:(type,fn)=>listeners.set(type,fn)
};
context.window=context;
vm.runInNewContext(fs.readFileSync(__dirname+'/../src/appearance.js','utf8'),context);
const api=context.HomePlanAppearance;
context.homePlanStudioBridge={draw:()=>renders++};
assert.equal(api.getColor(),'#C9E9FF');
assert.equal(rootStyle.get('--scene-background'),'#C9E9FF');
assert.equal(elements.get('sceneBackgroundReset').disabled,true);
assert.equal(api.setColor('#e032f0'),true);
assert.equal(api.getColor(),'#E032F0');
assert.equal(saved.get(api.STORAGE_KEY),'#E032F0');
assert.equal(elements.get('sceneBackgroundValue').textContent,'#E032F0');
assert.equal(elements.get('sceneBackgroundReset').disabled,false);
assert.equal(renders,1);
assert.equal(api.setColor('red'),false);
assert.equal(api.setColor('#abc'),false);
assert.equal(api.getColor(),'#E032F0');
elements.get('sceneBackgroundColor').value='#00ff00';
elements.get('sceneBackgroundColor').handlers.input({target:elements.get('sceneBackgroundColor')});
assert.equal(api.getColor(),'#00FF00');
assert.equal(renders,2);
listeners.get('storage')({key:api.STORAGE_KEY,newValue:'#000000'});
assert.equal(api.getColor(),'#000000');
assert.equal(saved.get(api.STORAGE_KEY),'#00FF00');
elements.get('sceneBackgroundReset').handlers.click();
assert.equal(api.getColor(),api.DEFAULT);
assert.equal(saved.has(api.STORAGE_KEY),false);
assert.equal(elements.get('sceneBackgroundReset').disabled,true);
console.log('PASS appearance: default baby blue, spectrum, validation, picker, storage, reset, redraw');
