const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function classes(){const set=new Set();return{add(...a){a.forEach(x=>set.add(x))},remove(...a){a.forEach(x=>set.delete(x))},toggle(x,bool){if(bool===undefined)bool=!set.has(x);bool?set.add(x):set.delete(x);return bool},contains(x){return set.has(x)}}}
class Element{constructor(id){this.id=id;this.classList=classes();this.listeners={};this.style={};this.dataset={};this.innerHTML='';this.textContent='';this.value='';this.hidden=false;this.clientWidth=id==='stage'?1200:300;this.clientHeight=id==='stage'?800:300;this.width=348;this.height=312;this.files=[];this.ctx=new Context();}addEventListener(name,fn){this.listeners[name]=fn}appendChild(child){this.child=child;}getBoundingClientRect(){return{left:0,top:0,width:this.clientWidth,height:this.clientHeight}}getContext(){return this.ctx}setPointerCapture(){}focus(){}remove(){}click(){this.listeners.click?.({target:this})}setAttribute(){}toDataURL(){return 'data:image/png;base64,AAAA'}querySelector(){return this;}querySelectorAll(){return [];}}
class Context{constructor(){this.globalAlpha=1;}fillRect(){}strokeRect(){}setTransform(){}clearRect(){}createLinearGradient(){return{addColorStop(){}}}beginPath(){}moveTo(){}lineTo(){}closePath(){}fill(){}stroke(){}arc(){}save(){}restore(){}translate(){}rotate(){}fillText(){}measureText(){return{width:20}}}
const elements=new Map();const $=id=>{if(!elements.has(id))elements.set(id,new Element(id));return elements.get(id)};
const store=new Map();const localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
const document={getElementById:$,querySelectorAll(){return[]},createElement:t=>new Element(t),addEventListener(){},head:$('head')};
const ctx=vm.createContext({document,window:null,innerWidth:1200,devicePixelRatio:1,ResizeObserver:class{observe(){}},localStorage,console,Math,JSON,Number,String,Array,Map,Set,Blob,URL:{createObjectURL:()=> 'blob:fake',revokeObjectURL(){}},prompt:()=> 'Bedroom option',setTimeout:()=>0,clearTimeout(){},performance});ctx.window=ctx;
vm.runInContext(fs.readFileSync(__dirname+'/../src/model.js','utf8'),ctx);
vm.runInContext(fs.readFileSync(__dirname+'/../src/studio_model.js','utf8'),ctx);
let appJs=fs.readFileSync(__dirname+'/../src/app.js','utf8');appJs=appJs.replace(/start\(\);\s*\}\)\(\);\s*$/,'globalThis.__hp={app,addFurniture,viewStyle,setTool,act,changeField,focusRoom,down,move,up,engineDraw,exportJSON,exportSVG,updateInspector,saveNamed,loadNamed,select};start();\n})();');assert.ok(appJs.includes('globalThis.__hp='));vm.runInContext(appJs,ctx);
const hp=ctx.__hp,app=hp.app;assert.equal(app.engineName,'offline');assert.equal(app.plan.items.length,13);assert.ok(app.engine.canvas);
let items=app.plan.items.length;hp.addFurniture('chair');assert.equal(app.plan.items.length,items+1);assert.equal(app.selected.kind,'item');assert.ok(app.history.length>0);hp.act('rotate90');assert.equal(app.plan.items.at(-1).r,90);hp.act('duplicate');assert.equal(app.plan.items.length,items+2);hp.act('delete');assert.equal(app.plan.items.length,items+1);const undoCount=app.history.length;hp.act('fitAll');hp.act('focusAll');assert.equal(app.focus,'all');
// Furniture geometry and camera should be invertible on the floor.
hp.viewStyle('orbit');const q=app.engine.project(2.5,0,2.5);assert.ok(q&&Number.isFinite(q.x)&&Number.isFinite(q.y));const back=app.engine.ground(q);assert.ok(Math.abs(back.x-2.5)<.001&&Math.abs(back.z-2.5)<.001,JSON.stringify(back));
// Experimental gating check: realworld is gated until enabled
hp.viewStyle('realworld');assert.equal(app.plan.view.style,'orbit');
app.plan.studio.experimental={enabled:true,realWorld:true,pagoda:true};
hp.viewStyle('realworld');assert.equal(app.plan.view.style,'realworld');
const rwBoxes=app.sceneCache||[];assert.ok(rwBoxes.some(b=>b.kind&&b.kind.startsWith('pagoda_')),'Realworld scene must include pagoda');assert.ok(rwBoxes.some(b=>b.kind&&b.kind.startsWith('building_')),'Realworld scene must include building structures');
hp.viewStyle('dollhouse');assert.equal(app.plan.view.style,'dollhouse');
// Direct property edits, including furniture footprint overrides.
hp.select('item',app.plan.items.at(-1).id);hp.changeField('w','2.4');assert.equal(app.plan.items.at(-1).w,2.4);
// Wall editor endpoint adjustments.
hp.setTool('build');hp.select('wall','w1');const w=app.plan.walls.find(x=>x.id==='w1');hp.changeField('bx','9.5');assert.equal(w.b[0],9.5);
// Click sequence places a wall from two points.
const before=app.plan.walls.length;hp.act('addWall');const g1=app.engine.project(1,0,1),g2=app.engine.project(1,0,2.5);const event=(p,id=11)=>({button:0,pointerId:id,clientX:p.x,clientY:p.y,preventDefault(){}});hp.down(event(g1));hp.up(event(g1));hp.down(event(g2));hp.up(event(g2));assert.equal(app.plan.walls.length,before+1);
// Quick save and layout exports remain local.
hp.saveNamed();assert.ok(localStorage.getItem('homeplan-variants-v2'));hp.exportJSON();hp.exportSVG();assert.ok(app.history.length>=undoCount);
console.log('PASS runtime boot, offline camera, ground picking, furniture, wall editing, wall insertion, named save, JSON + SVG');
