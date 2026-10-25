'use strict';
const MODEL_VERSION=5;
// Design materials are visual study options, not construction specifications.
const FLOOR_MATERIALS={
 'carpet-cream':{label:'Cream carpet',color:'#e4d9c7',pattern:'carpet'},
 'carpet-slate':{label:'Slate carpet',color:'#9eafb7',pattern:'carpet'},
 'carpet-sage':{label:'Sage carpet',color:'#aabb9e',pattern:'carpet'},
 'carpet-rose':{label:'Rose carpet',color:'#d8b9b2',pattern:'carpet'},
 'wood-oak':{label:'Natural oak',color:'#d6b48b',pattern:'wood'},
 'wood-walnut':{label:'Dark walnut',color:'#917154',pattern:'wood'},
 'wood-ash':{label:'Light ash',color:'#e2d4bd',pattern:'wood'},
 'tile-ivory':{label:'Ivory tile',color:'#e0ded5',pattern:'tile'},
 'tile-slate':{label:'Slate tile',color:'#acb9bd',pattern:'tile'},
 'tile-terracotta':{label:'Terracotta tile',color:'#d8a48d',pattern:'tile'},
 'deck-wood':{label:'Porch decking',color:'#b59c7c',pattern:'deck'},
 'stone-paver':{label:'Outdoor stone',color:'#afb4a8',pattern:'tile'}
};
const ROOM_ZONES=['indoor','outdoor'];
const SHAPE_KINDS=['rectangle','circle','ellipse','triangle','l-shape'];

const FURNITURE={
 sofa:{label:'Three-seat sofa',w:2.1,d:.92,h:.86,color:'#788995',room:'living',category:'Living'},
 loveseat:{label:'Loveseat',w:1.5,d:.86,h:.82,color:'#b6a28e',room:'living',category:'Living'},
 armchair:{label:'Armchair',w:.82,d:.86,h:.82,color:'#c4a882',room:'living',category:'Living'},
 table:{label:'Work table',w:1.45,d:.78,h:.75,color:'#b58b65',room:'living',category:'Living'},
 coffee:{label:'Coffee table',w:1.1,d:.55,h:.43,color:'#b68d60',room:'living',category:'Living'},
 tv:{label:'TV and stand',w:1.4,d:.44,h:1.15,color:'#56616b',room:'living',category:'Living'},
 shelf:{label:'Open shelving',w:.9,d:.42,h:1.9,color:'#ad8258',room:'living',category:'Storage'},
 dresser:{label:'Dresser',w:1.1,d:.55,h:.85,color:'#9d7658',room:'bed',category:'Storage'},
 chair:{label:'Desk chair',w:.62,d:.62,h:.9,color:'#a9bbc0',room:'living',category:'Living'},
 lamp:{label:'Floor lamp',w:.37,d:.37,h:1.65,color:'#e2c788',room:'living',category:'Living'},
 bed:{label:'Bed',w:1.55,d:2.04,h:.7,color:'#a2a7c2',room:'bed',category:'Bedroom'},
 side:{label:'Bedside table',w:.55,d:.48,h:.55,color:'#bc9771',room:'bed',category:'Bedroom'},
 fridge:{label:'Refrigerator',w:.76,d:.72,h:1.8,color:'#aebbc3',room:'kitchen',category:'Kitchen'},
 counter:{label:'Kitchen counter',w:2.15,d:.65,h:.92,color:'#bba989',room:'kitchen',category:'Kitchen'},
 sink:{label:'Bathroom vanity',w:.82,d:.5,h:.86,color:'#c3c5b5',room:'bath',category:'Bathroom'},
 toilet:{label:'Toilet',w:.52,d:.72,h:.75,color:'#e1e7df',room:'bath',category:'Bathroom'},
 fountain:{label:'Entry fountain marker',w:.55,d:.55,h:.5,color:'#65b1b7',room:'hall',category:'Markers'},
 rug:{label:'Area rug',w:2.25,d:1.55,h:.03,color:'#b8a17e',room:'living',category:'Living'},
 storage:{label:'Storage bins',w:.85,d:.6,h:.72,color:'#8f9b88',room:'living',category:'Storage'},
 desk:{label:'Office desk',w:1.45,d:.72,h:.76,color:'#af8b67',room:'living',category:'Office'},
 officechair:{label:'Swivel office chair',w:.64,d:.64,h:1.05,color:'#7e98a5',room:'living',category:'Office'},
 workstation:{label:'Computer workstation',w:1.22,d:.68,h:1.34,color:'#65767b',room:'living',category:'Office'},
 bathtub:{label:'Bathtub',w:1.65,d:.75,h:.6,color:'#e6e8e4',room:'bath',category:'Bathroom'},
 shower:{label:'Shower enclosure',w:.98,d:.98,h:2.08,color:'#94bec3',room:'bath',category:'Bathroom'},
 bathroom_sink:{label:'Wall-mounted sink',w:.56,d:.49,h:.86,color:'#e0e5df',room:'bath',category:'Bathroom'},
 kitchen_sink:{label:'Kitchen sink',w:.82,d:.6,h:.92,color:'#b8b8b2',room:'kitchen',category:'Kitchen'},
 water_heater:{label:'Water heater',w:.62,d:.62,h:1.55,color:'#ced1cb',room:'kitchen',category:'Plumbing'},
 pipe:{label:'Plumbing point',w:.2,d:.2,h:.15,color:'#6594a2',room:'bath',category:'Plumbing'},
 vent:{label:'Air vent',w:.42,d:.21,h:.12,color:'#9aaab2',room:'kitchen',category:'Plumbing'},
 oven:{label:'Oven & range',w:.78,d:.67,h:.94,color:'#666e75',room:'kitchen',category:'Appliances'},
 stovetop:{label:'Cooktop',w:.7,d:.55,h:.15,color:'#444f55',room:'kitchen',category:'Appliances'},
 microwave:{label:'Microwave',w:.52,d:.44,h:.34,color:'#78848b',room:'kitchen',category:'Appliances'},
 dishwasher:{label:'Dishwasher',w:.62,d:.62,h:.87,color:'#c5cacb',room:'kitchen',category:'Appliances'},
 washer:{label:'Washing machine',w:.67,d:.66,h:.9,color:'#d1d8da',room:'bath',category:'Laundry'},
 dryer:{label:'Clothes dryer',w:.67,d:.68,h:.9,color:'#becbd0',room:'bath',category:'Laundry'},
 washer_dryer:{label:'Washer/dryer combo',w:.69,d:.68,h:.92,color:'#b6c8d1',room:'bath',category:'Laundry'},
 balcony_chair:{label:'Balcony chair',w:.67,d:.69,h:.8,color:'#7f9890',room:'living',category:'Outdoor'},
 patio_table:{label:'Patio table',w:.84,d:.84,h:.74,color:'#a4ad9d',room:'living',category:'Outdoor'}
};
function initialPlan(){return{
 schema:MODEL_VERSION,name:'Walkthrough study',units:'meters',measured:false,
 notes:'Illustrative reconstruction only. Room adjacency, dimensions and architectural markers are provisional. Entrance by fountain is user-identified.',
 studio:typeof normalizeStudio==='function'?normalizeStudio({}):{},
 rooms:[
  {id:'living',name:'Living room',x:0,z:0,w:5.6,d:4.5,color:'#dce5e2',confidence:'estimated'},
  {id:'kitchen',name:'Kitchen',x:5.6,z:0,w:3.1,d:3,color:'#e6dfcd',confidence:'estimated'},
  {id:'hall',name:'Hall / entrance',x:5.6,z:3,w:3.1,d:1.5,color:'#e5e1d8',confidence:'estimated'},
  {id:'bed',name:'Bedroom',x:0,z:4.5,w:4.4,d:3.8,color:'#e0dfeb',confidence:'estimated'},
  {id:'bath',name:'Bathroom',x:4.4,z:4.5,w:2.4,d:2.6,color:'#d4e3e8',confidence:'estimated'}],
 walls:[
  {id:'w1',a:[0,0],b:[8.7,0],height:2.55,thick:.13},
  {id:'w2',a:[8.7,0],b:[8.7,4.5],height:2.55,thick:.13},
  {id:'w3',a:[8.7,4.5],b:[6.8,4.5],height:2.55,thick:.13},
  {id:'w4',a:[6.8,4.5],b:[6.8,7.1],height:2.55,thick:.13},
  {id:'w5',a:[6.8,7.1],b:[4.4,7.1],height:2.55,thick:.13},
  {id:'w6',a:[4.4,7.1],b:[4.4,8.3],height:2.55,thick:.13},
  {id:'w7',a:[4.4,8.3],b:[0,8.3],height:2.55,thick:.13},
  {id:'w8',a:[0,8.3],b:[0,0],height:2.55,thick:.13},
  {id:'w9',a:[5.6,0],b:[5.6,4.5],height:2.55,thick:.12},
  {id:'w10',a:[5.6,3],b:[8.7,3],height:2.55,thick:.12},
  {id:'w11',a:[0,4.5],b:[6.8,4.5],height:2.55,thick:.12},
  {id:'w12',a:[4.4,4.5],b:[4.4,7.1],height:2.55,thick:.12}],
 fixtures:[
  {id:'p1',type:'window',wall:'w1',at:.36,width:1.25,confidence:'provisional'},
  {id:'p2',type:'door',wall:'w11',at:.34,width:.86,confidence:'provisional'},
  {id:'p3',type:'door',wall:'w12',at:.36,width:.84,confidence:'provisional'},
  {id:'p4',type:'door',wall:'w5',at:.45,width:.8,confidence:'provisional'},
  {id:'p5',type:'opening',wall:'w9',at:.71,width:1.3,confidence:'provisional'},
  {id:'p6',type:'opening',wall:'w10',at:.5,width:1.05,confidence:'provisional'},
  {id:'p7',type:'entry',wall:'w2',at:.83,width:.86,confidence:'verbal-anchor'}],
 items:[
  {id:'i1',type:'sofa',x:2.25,z:2.85,r:0,room:'living'},
  {id:'i2',type:'tv',x:4.6,z:.7,r:0,room:'living'},
  {id:'i3',type:'shelf',x:.56,z:.95,r:90,room:'living'},
  {id:'i4',type:'shelf',x:4.85,z:2.15,r:90,room:'living'},
  {id:'i5',type:'table',x:2.4,z:1.25,r:0,room:'living'},
  {id:'i6',type:'chair',x:1.65,z:1.45,r:0,room:'living'},
  {id:'i7',type:'bed',x:1.85,z:6.2,r:0,room:'bed'},
  {id:'i8',type:'dresser',x:.62,z:5.3,r:0,room:'bed'},
  {id:'i9',type:'counter',x:7.1,z:1.2,r:0,room:'kitchen'},
  {id:'i10',type:'fridge',x:8.05,z:2.45,r:0,room:'kitchen'},
  {id:'i11',type:'sink',x:5.62,z:5.15,r:0,room:'bath'},
  {id:'i12',type:'toilet',x:5.98,z:6.23,r:0,room:'bath'},
  {id:'i13',type:'fountain',x:8.08,z:3.87,r:0,room:'hall'}],
 survey:createEmptySurvey(),
 view:{yaw:.78,pitch:.89,dist:16,target:[4.3,0,4.0],style:'dollhouse',room:'all',snap:.1,walls:true,grid:true}
};}
/** Return a new, truly empty study: no inferred rooms, fixtures, walls, or furniture. */
function blankPlan(){const p=initialPlan();p.name='Untitled blank plan';p.notes='Blank conceptual plan. Every new measurement and architectural marker requires user verification.';p.rooms=[];p.walls=[];p.fixtures=[];p.items=[];p.survey=createEmptySurvey();p.view={...p.view,target:[0,0,0],dist:14,style:'top',yaw:0,pitch:1.565};return p;}
function polygonForShape(kind,x1,z1,x2,z2){
 const cx=(x1+x2)/2,cz=(z1+z2)/2,rx=(x2-x1)/2,rz=(z2-z1)/2;
 if(kind==='rectangle')return [[x1,z1],[x2,z1],[x2,z2],[x1,z2]];
 if(kind==='triangle')return [[cx,z1],[x2,z2],[x1,z2]];
 if(kind==='l-shape')return [[x1,z1],[x2,z1],[x2,z1+(z2-z1)*.45],[x1+(x2-x1)*.52,z1+(z2-z1)*.45],[x1+(x2-x1)*.52,z2],[x1,z2]];
 const count=kind==='circle'?32:32;
 return Array.from({length:count},(_,i)=>{const a=2*Math.PI*i/count;return [round(cx+Math.cos(a)*rx,3),round(cz+Math.sin(a)*rz,3)];});
}
function makeShape(kind,from,to){
 if(!SHAPE_KINDS.includes(kind))throw Error('Unknown wall outline');
 if(!Array.isArray(from)||!Array.isArray(to)||![...from,...to].every(Number.isFinite))throw Error('Invalid shape position');
 let x1=Math.min(from[0],to[0]),x2=Math.max(from[0],to[0]),z1=Math.min(from[1],to[1]),z2=Math.max(from[1],to[1]);
 if(kind==='circle'){const side=Math.max(x2-x1,z2-z1);x2=x1+side;z2=z1+side;}
 const w=round(x2-x1,3),d=round(z2-z1,3);
 if(w<.9||d<.9||w>35||d>35)throw Error('Drag a shape from 0.9 m to 35 m across');
 const points=polygonForShape(kind,x1,z1,x2,z2);
 if(points.some((p,i)=>Math.hypot(p[0]-points[(i+1)%points.length][0],p[1]-points[(i+1)%points.length][1])<.08))throw Error('Shape is too small for wall segments');
 return {kind,x:round(x1,3),z:round(z1,3),w,d,points};
}
function shapeWalls(shape,makeId){return shape.points.map((a,i)=>({id:makeId('w'),a,b:shape.points[(i+1)%shape.points.length],height:2.55,thick:.12,confidence:'estimated'}));}
function roomArea(room){const a=room.w*room.d;return round(room.shape==='circle'||room.shape==='ellipse'?a*Math.PI/4:room.shape==='triangle'?a/2:room.shape==='l-shape'?a*(.45+.55*.52):a,2);}
const deepClone=x=>JSON.parse(JSON.stringify(x));
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const round=(n,p=2)=>Math.round(n*10**p)/10**p;
const length=(a,b)=>Math.hypot(b[0]-a[0],b[1]-a[1]);
const wallPoint=(w,t)=>[w.a[0]+(w.b[0]-w.a[0])*t,w.a[1]+(w.b[1]-w.a[1])*t];
function nearestWall(x,z,walls){let best=null;for(const w of walls){const ax=w.a[0],az=w.a[1],dx=w.b[0]-ax,dz=w.b[1]-az,m=dx*dx+dz*dz;if(m<.01)continue;const t=clamp(((x-ax)*dx+(z-az)*dz)/m,0,1),p=wallPoint(w,t),d=Math.hypot(p[0]-x,p[1]-z);if(!best||d<best.distance)best={wall:w,t,point:p,distance:d};}return best;}
function aabbBounds(o){const base=FURNITURE[o.type],spec={w:o.w||base.w,d:o.d||base.d},t=o.r*Math.PI/180,c=Math.abs(Math.cos(t)),s=Math.abs(Math.sin(t));return{hw:(spec.w*c+spec.d*s)/2,hd:(spec.w*s+spec.d*c)/2};}
function corners(o){const base=FURNITURE[o.type],s={w:o.w||base.w,d:o.d||base.d},a=o.r*Math.PI/180,co=Math.cos(a),si=Math.sin(a);return[[-1,-1],[1,-1],[1,1],[-1,1]].map(([u,v])=>[o.x+(u*s.w/2)*co-(v*s.d/2)*si,o.z+(u*s.w/2)*si+(v*s.d/2)*co]);}
function satCollision(a,b){const ca=corners(a),cb=corners(b),axes=[];for(const c of [ca,cb])for(let i=0;i<2;i++){const p=c[i],q=c[(i+1)%4],dx=q[0]-p[0],dz=q[1]-p[1],m=Math.hypot(dx,dz)||1;axes.push([-dz/m,dx/m]);}return axes.every(axis=>{const aa=ca.map(p=>p[0]*axis[0]+p[1]*axis[1]),bb=cb.map(p=>p[0]*axis[0]+p[1]*axis[1]);return Math.min(...aa) <= Math.max(...bb) && Math.min(...bb) <= Math.max(...aa);});}
/** Conservative spatial-hash broad phase; oriented SAT is still the final collision oracle. */
function collisions(plan){
 const hits=new Map(),cells=new Map(),checked=new Set(),cellSize=1.8,items=plan.items;
 const eligible=o=>FURNITURE[o.type]&&o.type!=='rug'&&o.type!=='fountain';
 for(let i=0;i<items.length;i++){
  const a=items[i];if(!eligible(a))continue;
  const b=aabbBounds(a),minX=Math.floor((a.x-b.hw)/cellSize),maxX=Math.floor((a.x+b.hw)/cellSize),minZ=Math.floor((a.z-b.hd)/cellSize),maxZ=Math.floor((a.z+b.hd)/cellSize);
  for(let x=minX;x<=maxX;x++)for(let z=minZ;z<=maxZ;z++){
   const k=x+','+z;let bucket=cells.get(k);if(!bucket){bucket=[];cells.set(k,bucket);}
   for(const j of bucket){const pair=j+':'+i;if(checked.has(pair))continue;checked.add(pair);const other=items[j],ob=aabbBounds(other);
    if(Math.abs(a.x-other.x)>b.hw+ob.hw||Math.abs(a.z-other.z)>b.hd+ob.hd||!satCollision(a,other))continue;
    for(const [id,partner] of [[a.id,other.id],[other.id,a.id]]){if(!hits.has(id))hits.set(id,[]);hits.get(id).push(partner);}
   }
   bucket.push(i);
  }
 }
 return hits;
}
/** Instructions here are a capture protocol, not an automatic photogrammetry claim. */
const SURVEY_STEPS=[
 {key:'anchor',title:'Find the entrance',kind:'photo',required:true,entryOnly:true,time:'1 min',cue:'Stand outside the apartment door. Include the fountain and door in the SAME wide image.',why:'Fixes the orientation anchor so each later room can be placed relative to the entrance.',frame:'Fountain + full door frame + floor/ceiling boundary',tip:'Do not include mail, unit numbers, people or the street address.'},
 {key:'threshold',title:'Stand in the doorway',kind:'photo',required:true,time:'1 min',cue:'Stand at this room’s threshold and photograph straight into the room, keeping the door frame visible.',why:'Shows which wall belongs to which room and where the route enters.',frame:'Both sides of the threshold + far wall + floor',tip:'Keep the phone level and shoot landscape. Leave the door open if safe.'},
 {key:'sweep',title:'Slow clockwise sweep',kind:'video',required:true,time:'20–30 sec',cue:'Start at the room’s doorway. Film a slow clockwise turn, covering all walls without cuts.',why:'Preserves continuous spatial context between surfaces; separate photos alone can be confusing.',frame:'One continuous slow pan, floor-to-ceiling in frame',tip:'Avoid fast spinning, digital zoom and fisheye filters. Do not walk backward.'},
 {key:'corner-nw',title:'Corner 1 · first on your left',kind:'photo',required:true,time:'1 min',cue:'Move to the first reachable corner left of the entrance. Face diagonally toward the opposite side of the room.',why:'Reveals wall lengths, corners and hidden furniture depth.',frame:'Two joining walls + a slice of floor + far corner',tip:'Stay on the floor; never climb furniture for a higher angle.'},
 {key:'corner-ne',title:'Corner 2 · clockwise',kind:'photo',required:true,time:'1 min',cue:'Move clockwise to the next corner, if reachable, and take a diagonal wide shot across the room.',why:'Cross-checks the first view and reduces occlusion.',frame:'Both wall edges + far doorway/window',tip:'If blocked, photograph from the closest safe standing point and note it.'},
 {key:'corner-se',title:'Corner 3 · clockwise',kind:'photo',required:true,time:'1 min',cue:'Continue clockwise. Show both walls meeting at the third corner and the floor junction.',why:'Makes the shape of the far end of the room easier to reconstruct.',frame:'Full corner + floor line + ceiling line where possible',tip:'Do not move heavy furniture to reach a corner.'},
 {key:'corner-sw',title:'Corner 4 · final angle',kind:'photo',required:true,time:'1 min',cue:'Capture the final corner looking back toward the doorway. Overlap the previous photo’s view.',why:'Closes the visual loop so room orientation can be checked.',frame:'Doorway + adjacent wall edges + floor',tip:'If this is a non-rectangular room, photograph every additional bend and explain it in notes.'},
 {key:'wall-span',title:'Straight-on wall views',kind:'photo',required:true,time:'2 min',cue:'Stand facing the longest visible wall and photograph it as square-on as possible, including both ends. Add more images if needed.',why:'Helps locate doors, windows, cabinets and other features along the wall.',frame:'Whole wall, both corners, ceiling and floor',tip:'Take a second image if a sofa or cabinet blocks part of the wall.'},
 {key:'doors',title:'Doors and connections',kind:'photo',required:true,time:'2 min',cue:'Photograph every door from each side and show which room lies beyond. Record its width and swing direction in notes.',why:'Links rooms and avoids a floor plan with wrong door placement.',frame:'Full frame, hinge side, threshold, connected room',tip:'Photograph with door open and closed if convenient; never assume a door swing.'},
 {key:'windows',title:'Windows and sill height',kind:'photo',required:false,time:'2 min',cue:'Photograph each window straight on, with the wall corners or nearby door visible. Measure width, height and sill-to-floor if possible.',why:'Stops furniture from blocking an actual window and improves wall reconstruction.',frame:'Whole window + surrounding wall + floor reference',tip:'If there is no window, mark Not applicable rather than inventing one.'},
 {key:'outlets',title:'Outlets, switches and vents',kind:'photo',required:false,time:'2 min',cue:'Photograph each outlet first from far enough away to show which wall it is on, then one close view. Note height above floor.',why:'Critical for placing televisions and desks realistically; not visible enough in the first walkthrough.',frame:'Location context shot + optional close-up',tip:'Never open, touch wiring or remove outlet covers. Skip rooms without accessible outlets.'},
 {key:'furniture',title:'Furniture, scale and paths',kind:'photo',required:true,time:'2 min',cue:'Take a wide image showing the large furniture and the walking route. Note sizes of the sofa, bed, TV stand and cabinets.',why:'Preserves usable clearance and object scale when rearranging.',frame:'Full furniture objects with room reference',tip:'A tape measure against a furniture edge is more useful than an unscaled close-up.'},
 {key:'measure',title:'Measure the room',kind:'measure',required:true,time:'3–5 min',cue:'Measure the inside wall-to-wall WIDTH and DEPTH, then ceiling height if possible. Use a tape or laser measure.',why:'Turns perspective guesses into numerical constraints; pictures alone cannot provide reliable dimensions.',frame:'Length along one wall, depth perpendicular to it',tip:'Record measurements at floor level or between finished wall surfaces. Do not infer dimensions from wide-angle photos.'},
 {key:'connection',title:'Trace the route to the next room',kind:'video',required:true,time:'15–20 sec',cue:'From the doorway, slowly film toward the hallway/adjacent room and back. Keep the shared threshold in view.',why:'Confirms which two spaces actually connect so the floor plan is not assembled in the wrong order.',frame:'One uninterrupted view across the shared doorway',tip:'You may skip this if a safe uninterrupted walk is not possible; add a note about the connection.'}
];
function surveyStepsForRoom(roomId,mode='detailed'){const quick=new Set(['anchor','threshold','sweep','doors','measure','connection']);return SURVEY_STEPS.filter(s=>(!s.entryOnly||roomId==='hall')&&(mode!=='quick'||quick.has(s.key)));}
function createEmptySurvey(){return{version:1,activeRoom:'hall',activeStep:'anchor',steps:{},measurements:{},wallLengths:{},displayUnit:'ft',mode:'detailed'};}
function normalizeSurvey(raw, rooms, walls){
 const out=createEmptySurvey(), roomIds=new Set(rooms.map(r=>r.id)),wallIds=new Set(walls.map(w=>w.id));
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
 out.displayUnit=raw.displayUnit==='m'?'m':'ft';out.mode=raw.mode==='quick'?'quick':'detailed';
 out.activeRoom=roomIds.has(raw.activeRoom)?raw.activeRoom:(rooms[0]?.id||'hall');
 const choices=new Set(surveyStepsForRoom(out.activeRoom).map(s=>s.key));out.activeStep=choices.has(raw.activeStep)?raw.activeStep:'threshold';
 for(const room of rooms){const source=raw.steps?.[room.id];if(!source||typeof source!=='object')continue;const saved={};
  for(const spec of surveyStepsForRoom(room.id)){const r=source[spec.key];if(!r||typeof r!=='object')continue;
   const assets=Array.isArray(r.assets)?r.assets.slice(0,16).filter(a=>a&&typeof a==='object'&&typeof a.id==='string'&&/^[a-zA-Z0-9_-]{5,80}$/.test(a.id)&&typeof a.mime==='string'&&/^(image|video)\//.test(a.mime)&&Number.isFinite(a.size)&&a.size>0&&a.size<=500e6).map(a=>({id:a.id,name:String(a.name||'Capture').slice(0,110),mime:a.mime.slice(0,90),size:a.size,ts:String(a.ts||'').slice(0,40),quality:['usable','retake'].includes(a.quality)?a.quality:'unreviewed'})):[];
   saved[spec.key]={status:['captured','skipped','todo'].includes(r.status)?r.status:'todo',assets,note:String(r.note||'').slice(0,600),reason:String(r.reason||'').slice(0,240)};
   if(saved[spec.key].status==='captured'&&!assets.length&&spec.kind!=='measure')saved[spec.key].status='todo';
   if(saved[spec.key].status==='skipped'&&spec.required&&!saved[spec.key].reason)saved[spec.key].reason='Not captured';
  }
  out.steps[room.id]=saved;
 }
 for(const room of rooms){const m=raw.measurements?.[room.id];if(!m||typeof m!=='object')continue;const dims={};for(const key of ['width','depth','height']){const v=m[key];if(v&&Number.isFinite(v.meters)&&v.meters>.15&&v.meters<100){dims[key]={meters:round(v.meters,4),method:['tape','laser','estimated'].includes(v.method)?v.method:'estimated',note:String(v.note||'').slice(0,240)};}}if(Object.keys(dims).length)out.measurements[room.id]=dims;}
 for(const wall of walls){const v=raw.wallLengths?.[wall.id];if(v&&Number.isFinite(v.meters)&&v.meters>.1&&v.meters<100)out.wallLengths[wall.id]={meters:round(v.meters,4),method:['tape','laser','estimated'].includes(v.method)?v.method:'estimated',note:String(v.note||'').slice(0,240)};}
 return out;
}
function surveyCoverage(plan, roomId, availableIds, mode='detailed'){const room=plan.rooms.find(r=>r.id===roomId);if(!room)return{done:0,total:0,requiredMissing:[],available:0,ready:false};const specs=surveyStepsForRoom(roomId,mode),answers=plan.survey?.steps?.[roomId]||{},m=plan.survey?.measurements?.[roomId]||{};let done=0,available=0,requiredMissing=[];
 for(const spec of specs){const a=answers[spec.key]||{},count=(a.assets||[]).filter(asset=>asset.quality!=='retake'&&(!availableIds||availableIds.has(asset.id))).length,has=spec.kind==='measure'?Boolean(m.width&&m.depth&&m.width.method!=='estimated'&&m.depth.method!=='estimated'):count>0;
  if(has){done++;available++;}else if(a.status==='skipped'&&!spec.required){done++;}else if(spec.required){requiredMissing.push(spec.key);}
 }
 return{done,total:specs.length,requiredMissing,available,ready:requiredMissing.length===0};}
/** Resize one wall and carry endpoints of adjacent walls sharing its moved vertex. */
function resizeWallWithJunctions(plan, wallId, meters, tolerance=.035){const wall=plan.walls.find(w=>w.id===wallId);if(!wall||!Number.isFinite(meters)||meters<.1||meters>60)throw Error('Invalid measured wall length');const before=[...wall.b],oldLen=length(wall.a,wall.b);const k=meters/oldLen;const next=[round(wall.a[0]+(wall.b[0]-wall.a[0])*k,3),round(wall.a[1]+(wall.b[1]-wall.a[1])*k,3)];
 for(const other of plan.walls){if(other===wall)continue;for(const point of [other.a,other.b])if(Math.hypot(point[0]-before[0],point[1]-before[1])<=tolerance){point[0]=next[0];point[1]=next[1];}}
 wall.b=next;wall.confidence='measured';return{before,next};}

function migrateLegacy(v){
 const p=initialPlan();if(!v||v.schema!==1||!Array.isArray(v.furniture)||!Array.isArray(v.rooms))throw Error('Invalid legacy layout');
 p.name='Imported legacy arrangement';p.notes='Migrated from the original 2D Home Plan. Old placements and room zones preserved; architectural walls still provisional and require review.';
 p.rooms=v.rooms.filter(r=>r&&[r.x,r.y,r.w,r.h].every(Number.isFinite)).slice(0,100).map(r=>({id:String(r.id||'room').slice(0,50),name:String(r.name||'Room').slice(0,80),x:r.x,z:r.y,w:Math.max(.2,r.w),d:Math.max(.2,r.h),color:'#dce5e2',confidence:'legacy-estimate'}));
 p.items=v.furniture.filter(f=>f&&FURNITURE[f.type]&&[f.x,f.y,f.r].every(Number.isFinite)).slice(0,300).map((f,i)=>({id:'legacy-'+String(f.id??i),type:f.type,x:f.x,z:f.y,r:f.r,room:String(f.room||'living'),w:Number.isFinite(f.w)?Math.max(.12,f.w):undefined,d:Number.isFinite(f.h)?Math.max(.12,f.h):undefined}));
 if(Array.isArray(v.openings)){p.fixtures=[];v.openings.slice(0,300).forEach((o,i)=>{const room=p.rooms.find(r=>r.id===o.room);if(!room)return;let x=room.x,z=room.z;if(o.side==='top'){x+=o.offset;}
 else if(o.side==='bottom'){x+=o.offset;z+=room.d;}
 else if(o.side==='left'){z+=o.offset;}
 else if(o.side==='right'){x+=room.w;z+=o.offset;}
 const closest=nearestWall(x,z,p.walls);if(closest&&closest.distance<1.5)p.fixtures.push({id:'legacy-p'+i,type:['door','window','opening','entry'].includes(o.type)?o.type:'door',wall:closest.wall.id,at:closest.t,width:clamp(Number(o.width)||.8,.15,3),confidence:'legacy-estimate'});});}
 return p;
}
function safeId(x,prefix){return String(x??prefix).replace(/[^a-zA-Z0-9_-]/g,'').slice(0,60)||prefix;}
function finiteBound(n,min,max){return Number.isFinite(n)&&n>=min&&n<=max;}
function parsePlan(x){if(x?.schema===1)x=migrateLegacy(x);if(!x||typeof x!=='object'||!Array.isArray(x.walls)||!Array.isArray(x.items)||!Array.isArray(x.rooms)||!Array.isArray(x.fixtures))throw Error('Not a Home Plan layout');if(x.schema!==2&&x.schema!==3&&x.schema!==4&&x.schema!==5)throw Error('Unsupported layout version.');if(x.walls.length>250||x.items.length>300||x.rooms.length>100||x.fixtures.length>300)throw Error('Layout exceeds safety limits');for(const w of x.walls){if(!Array.isArray(w.a)||!Array.isArray(w.b)||!w.a.every(Number.isFinite)||!w.b.every(Number.isFinite)||length(w.a,w.b)<.05)throw Error('Invalid wall coordinates');if(!Number.isFinite(w.height)||w.height<.5||w.height>10)throw Error('Invalid wall height');}for(const f of x.items){if(!FURNITURE[f.type]||![f.x,f.z,f.r].every(n=>finiteBound(n,-100,1000)))throw Error('Invalid furniture type or coordinates');if(['w','d','h'].some(k=>f[k]!==undefined&&!finiteBound(f[k],.12,12)))throw Error('Invalid custom furniture size');}
const rooms=x.rooms.map((r,i)=>{if(!r||![r.x,r.z,r.w,r.d].every(Number.isFinite)||r.w<=0||r.d<=0||r.w>100||r.d>100)throw Error('Invalid room geometry');return{id:safeId(r.id,'room'+i),name:String(r.name||'Room').slice(0,60),x:r.x,z:r.z,w:r.w,d:r.d,color:/^#[0-9a-fA-F]{6}$/.test(r.color)?r.color:'#dce5e2',zone:ROOM_ZONES.includes(r.zone)?r.zone:'indoor',flooring:FLOOR_MATERIALS[r.flooring]?r.flooring:'',shape:SHAPE_KINDS.includes(r.shape)?r.shape:'rectangle',confidence:String(r.confidence||'unverified').slice(0,30),note:String(r.note||'').slice(0,250)};});
const walls=x.walls.map((w,i)=>({id:safeId(w.id,'wall'+i),a:w.a.map(n=>round(n,3)),b:w.b.map(n=>round(n,3)),height:clamp(w.height,.5,5),thick:clamp(Number(w.thick)||.12,.06,.8),confidence:w.confidence==='measured'?'measured':'estimated',color:typeof HP_COLOR==='function'&&HP_COLOR(w.color)?w.color:undefined}));const wallIds=new Set(walls.map(w=>w.id));
const fixtures=x.fixtures.map((f,i)=>{if(!wallIds.has(safeId(f.wall,''))||!['door','window','opening','outlet','entry'].includes(f.type)||!finiteBound(f.at,0,1)||!finiteBound(f.width,.05,5))throw Error('Invalid fixture reference');return{id:safeId(f.id,'fixture'+i),wall:safeId(f.wall,''),type:f.type,at:clamp(f.at,.03,.97),width:clamp(f.width,.08,5),confidence:String(f.confidence||'unverified').slice(0,30),swing:f.swing==='right'?'right':'left'};});
const items=x.items.map((f,i)=>({id:safeId(f.id,'item'+i),type:f.type,x:f.x,z:f.z,r:f.r,room:f.room?safeId(f.room,''):'',...(f.w?{w:f.w}:{}),...(f.d?{d:f.d}:{}),...(f.h?{h:f.h}:{}),label:String(f.label||'').slice(0,70),note:String(f.note||'').slice(0,250),price:Number.isFinite(f.price)&&f.price>=0&&f.price<=100000?f.price:undefined,color:typeof HP_COLOR==='function'&&HP_COLOR(f.color)?f.color:undefined,locked:f.locked===true,hidden:f.hidden===true,group:String(f.group||'').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,60)}));
const v=x.view||{},start=initialPlan().view;
return{schema:MODEL_VERSION,name:String(x.name||'Imported plan').slice(0,80),units:'meters',measured:false,notes:String(x.notes||'Imported and unverified').slice(0,500),rooms,walls,fixtures,items,survey:normalizeSurvey(x.survey,rooms,walls),studio:typeof normalizeStudio==='function'?normalizeStudio(x.studio):{},view:{...start,yaw:finiteBound(v.yaw,-100,100)?v.yaw:start.yaw,pitch:finiteBound(v.pitch,.1,1.6)?v.pitch:start.pitch,dist:finiteBound(v.dist,3,45)?v.dist:start.dist,target:Array.isArray(v.target)&&v.target.length===3&&v.target.every(Number.isFinite)?v.target:start.target,style:['top','dollhouse','orbit'].includes(v.style)?v.style:start.style,snap:[0,.05,.1,.25,.5].includes(v.snap)?v.snap:start.snap,walls:v.walls!==false,grid:v.grid!==false}};}
