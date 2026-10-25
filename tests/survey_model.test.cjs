'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync(__dirname+'/../src/model.js','utf8');const ctx=vm.createContext({Math,JSON,Number,Array,Object,String,Set,Map});vm.runInContext(src+'\nthis.surveyTest={initialPlan,parsePlan,surveyStepsForRoom,surveyCoverage,resizeWallWithJunctions,collisions,satCollision,FURNITURE};',ctx);
const {initialPlan,parsePlan,surveyStepsForRoom,surveyCoverage,resizeWallWithJunctions,collisions,satCollision,FURNITURE}=ctx.surveyTest;
const p=initialPlan();assert.equal(p.schema,4);assert.equal(p.survey.activeRoom,'hall');assert.equal(surveyStepsForRoom('hall').length,14);assert.equal(surveyStepsForRoom('living').length,13);assert.equal(surveyStepsForRoom('hall','quick').length,6);assert.equal(surveyStepsForRoom('living','quick').length,5);
const roundtrip=parsePlan(JSON.parse(JSON.stringify(p)));assert.equal(roundtrip.survey.mode,'detailed');assert.equal(roundtrip.rooms.length,p.rooms.length);
const old=JSON.parse(JSON.stringify(p));old.schema=2;delete old.survey;const migrated=parsePlan(old);assert.equal(migrated.schema,4);assert.ok(migrated.survey);
assert.equal(surveyCoverage(p,'hall').ready,false);
p.survey.steps.hall={anchor:{status:'captured',assets:[{id:'shot-demo-1234',mime:'image/png',name:'shot.png',size:20,ts:'2026-10-25'}],note:'Angle looks good',reason:''}};
let available=new Set(['shot-demo-1234']);assert.equal(surveyCoverage(p,'hall',available).done,1);assert.equal(surveyCoverage(p,'hall',new Set()).done,0);
p.survey.measurements.hall={width:{meters:2,method:'estimated'},depth:{meters:3,method:'tape'}};assert.equal(surveyCoverage(p,'hall',available).done,1,'An estimated width must not count as measured');p.survey.measurements.hall.width.method='laser';assert.equal(surveyCoverage(p,'hall',available).done,2);
p.survey.steps.hall.anchor.assets[0].quality='retake';assert.equal(surveyCoverage(p,'hall',available).done,1,'Retake evidence must not count; measured step still counts');
p.survey.steps.hall.anchor.assets[0].quality='usable';assert.equal(surveyCoverage(p,'hall',available).done,2,'Approved media may count as documented');
const sanitized=parsePlan(JSON.parse(JSON.stringify(p)));assert.equal(sanitized.survey.steps.hall.anchor.assets.length,1);assert.equal(sanitized.survey.steps.hall.anchor.assets[0].quality,'usable');assert.equal(sanitized.survey.measurements.hall.width.method,'laser');
const invalid=JSON.parse(JSON.stringify(p));invalid.survey.steps.hall.anchor.assets.push({id:'<script>',mime:'text/html',size:1,name:'evil'});assert.equal(parsePlan(invalid).survey.steps.hall.anchor.assets.length,1);
const q=initialPlan();const oldJunction=q.walls.find(w=>w.id==='w2').a.slice();resizeWallWithJunctions(q,'w1',9.7);assert.ok(Math.abs(q.walls.find(w=>w.id==='w1').b[0]-9.7)<.005);assert.equal(q.walls.find(w=>w.id==='w2').a[0],9.7,'shared endpoint follows');assert.notEqual(q.walls.find(w=>w.id==='w2').a[0],oldJunction[0]);assert.equal(q.rooms[0].w,5.6,'floor zone does not silently move');assert.throws(()=>resizeWallWithJunctions(q,'w1',-2));
// Spatial hash must match the brute-force SAT result, including rotated furniture.
let seed=913785;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/0x100000000;};const types=Object.keys(FURNITURE).filter(t=>!['rug','fountain'].includes(t));
for(let trial=0;trial<12;trial++){
 const items=Array.from({length:75},(_,i)=>({id:'i'+i,type:types[Math.floor(random()*types.length)],x:random()*14-3,z:random()*12-3,r:Math.floor(random()*24)*15,w:.2+random()*1.9,d:.2+random()*1.6}));
 const fast=collisions({items});const brute=new Set();for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++)if(satCollision(items[i],items[j]))brute.add(items[i].id+'|'+items[j].id);
 const found=new Set();for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++)if(fast.get(items[i].id)?.includes(items[j].id))found.add(items[i].id+'|'+items[j].id);
 assert.deepEqual([...found].sort(),[...brute].sort(),'Spatial hash broadphase must exactly match SAT oracle');
}
console.log('PASS survey spec, legacy v2 migration, confidence gates, storage references, junction resize, spatial hash vs brute SAT');
