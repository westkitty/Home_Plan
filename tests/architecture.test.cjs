const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({Math,JSON,Number,Array,Object,String,Set,Map,Intl,Date,Uint8Array,Int32Array});
for(const f of ['model.js','studio_model.js'])vm.runInContext(fs.readFileSync(__dirname+'/../src/'+f,'utf8'),ctx);
const run=e=>vm.runInContext(e,ctx),get=e=>JSON.parse(JSON.stringify(run(e)));
const blank=get('blankPlan()');assert.equal(blank.schema,5);for(const k of ['rooms','walls','items','fixtures'])assert.equal(blank[k].length,0,k);
assert.ok(blank.view.target.every(x=>x===0));assert.equal(get('roomArea({w:4,d:4,shape:"circle"})'),12.57);
assert.equal(get('roomArea({w:4,d:4,shape:"triangle"})'),8);
for(const [kind,n] of [['rectangle',4],['circle',32],['ellipse',32],['triangle',3],['l-shape',6]]){
 const s=get(`makeShape('${kind}',[0,0],[5,4])`);assert.equal(s.points.length,n,kind);assert.ok(s.w>=4&&s.d>=4);const walls=get(`shapeWalls(makeShape('${kind}',[0,0],[5,4]),p=>p+'-test')`);assert.equal(walls.length,n);
}
assert.throws(()=>run('makeShape("hexagon",[0,0],[2,2])'));assert.throws(()=>run('makeShape("circle",[0,0],[.1,.1])'));
for(const category of ['Office','Bathroom','Kitchen','Appliances','Laundry','Outdoor','Plumbing'])assert.ok(run(`Object.values(FURNITURE).some(f=>f.category==='${category}')`),category);
for(const material of ['carpet-cream','carpet-rose','wood-oak','wood-walnut','tile-ivory','tile-slate','deck-wood'])assert.ok(run(`!!FLOOR_MATERIALS['${material}']`),material);
vm.runInContext(`var sample=blankPlan();sample.rooms.push({id:'out',name:'Balcony',x:-3,z:1,w:4,d:2,color:'#aabbcc',flooring:'deck-wood',zone:'outdoor',shape:'rectangle'});sample.items.push({id:'desk1',type:'desk',x:0,z:0,r:0,room:''});sample.studio.light='night';sample.studio.indoorGlow=90;sample.studio.outdoorDim=95;`,ctx);
const parsed=get('parsePlan(sample)');assert.equal(parsed.rooms[0].name,'Balcony');assert.equal(parsed.rooms[0].flooring,'deck-wood');assert.equal(parsed.rooms[0].zone,'outdoor');assert.equal(parsed.items[0].room,'');assert.equal(parsed.studio.indoorGlow,90);assert.equal(parsed.studio.outdoorDim,95);
vm.runInContext(`sample.rooms[0].flooring='invalid';sample.rooms[0].zone='rooftop';sample.rooms[0].shape='alien';sample.studio.outdoorDim=500;`,ctx);
const guarded=get('parsePlan(sample)');assert.equal(guarded.rooms[0].flooring,'');assert.equal(guarded.rooms[0].zone,'indoor');assert.equal(guarded.rooms[0].shape,'rectangle');assert.equal(guarded.studio.outdoorDim,85);
vm.runInContext('sample.schema=4;',ctx);assert.equal(get('parsePlan(sample)').schema,5);
console.log('PASS architecture: blank, shapes/wall segments, appliances, floors, outdoor zones, round trip, migrations and validation');
