'use strict';
// Opt-in synthetic CPU collision benchmark. This is not WebGL FPS or a device thermal result.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{performance}=require('node:perf_hooks');
const ctx=vm.createContext({Math,JSON,Number,Array,Object,String,Set,Map});
vm.runInContext(fs.readFileSync(__dirname+'/../src/model.js','utf8')+'\nthis.api={collisions,satCollision,FURNITURE};',ctx);
const {collisions,satCollision,FURNITURE}=ctx.api;
const types=Object.keys(FURNITURE).filter(x=>!['rug','fountain'].includes(x));
let seed=2049;const rand=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
const items=Array.from({length:260},(_,i)=>({id:'b'+i,type:types[Math.floor(rand()*types.length)],x:rand()*25,z:rand()*22,r:Math.floor(rand()*24)*15,w:.3+rand()*2.2,d:.3+rand()*1.6}));
function naive(){const hit=new Set();for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++)if(satCollision(items[i],items[j]))hit.add(items[i].id+'|'+items[j].id);return hit;}
function fast(){const m=collisions({items});const hit=new Set();for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++)if(m.get(items[i].id)?.includes(items[j].id))hit.add(items[i].id+'|'+items[j].id);return hit;}
assert.deepEqual([...fast()].sort(),[...naive()].sort());
const TIMES=20;const run=fn=>{const t0=performance.now();for(let j=0;j<TIMES;j++)fn();return performance.now()-t0;};
const a=run(fast),b=run(naive);assert(a>0&&b>0);
console.log(`CPU collision comparison, same run, ${items.length} synthetic objects × ${TIMES} passes: indexed ${a.toFixed(1)}ms (${(a/TIMES).toFixed(2)}ms/pass), brute SAT ${b.toFixed(1)}ms (${(b/TIMES).toFixed(2)}ms/pass), ratio ${(b/a).toFixed(1)}x. This is NOT whole-app FPS.`);
