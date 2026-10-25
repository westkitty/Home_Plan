'use strict';
// Local, source-owned interior design primitives. Room zones remain provisional until measured.
const STUDIO_PALETTES={
 sage:{label:'Sage & linen',floor:'#dce5e2',wall:'#a1aaa1',accent:'#788995'},
 sandstone:{label:'Sandstone',floor:'#e6dcc6',wall:'#c5b49d',accent:'#b48a64'},
 midnight:{label:'Midnight studio',floor:'#b6bdc3',wall:'#77858d',accent:'#4d6679'},
 warm:{label:'Warm oak',floor:'#e5d1b4',wall:'#d0b79d',accent:'#b47c53'},
 monochrome:{label:'Monochrome',floor:'#d8d8d7',wall:'#afb4b3',accent:'#6d7578'}
};
const STUDIO_DEFAULTS={
 units:'m',north:0,cutHeight:3,wallLengths:false,labels:true,doorArcs:false,
 furnishings:true,openings:true,rooms:true,fixtureMarkers:true,grid:true,
 favorites:[],bookmarks:[],annotations:[],measurements:[],budget:0,
 light:'day',notes:'',palette:'sage',lastReport:'',hideRoom:'',clearance:.75
};
const HP_COLOR=s=>typeof s==='string'&&/^#[\da-fA-F]{6}$/.test(s);
const HP_TEXT=(s,n=120)=>String(s??'').slice(0,n);
const HP_NUM=(v,lo,hi,fallback)=>Number.isFinite(v)&&v>=lo&&v<=hi?v:fallback;
function normalizeStudio(raw){
 const x=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const fav=Array.isArray(x.favorites)?x.favorites.filter(t=>typeof t==='string'&&FURNITURE[t]).slice(0,100):[];
 const marks=Array.isArray(x.bookmarks)?x.bookmarks.slice(0,20).filter(b=>b&&Number.isFinite(b.yaw)&&Number.isFinite(b.pitch)&&Number.isFinite(b.dist)&&Array.isArray(b.target)&&b.target.length===3&&b.target.every(Number.isFinite)).map(b=>({id:safeId(b.id,'cam'),name:HP_TEXT(b.name,50),yaw:HP_NUM(b.yaw,-200,200,.78),pitch:HP_NUM(b.pitch,.1,1.57,.9),dist:HP_NUM(b.dist,3,45,14),target:b.target.map(n=>HP_NUM(n,-100,100,0))})):[];
 const pins=Array.isArray(x.annotations)?x.annotations.slice(0,100).filter(a=>a&&HP_NUM(a.x,-100,100,null)!==null&&HP_NUM(a.z,-100,100,null)!==null).map(a=>({id:safeId(a.id,'note'),x:a.x,z:a.z,text:HP_TEXT(a.text,250),room:safeId(a.room||'','room')})):[];
 const tapes=Array.isArray(x.measurements)?x.measurements.slice(0,100).filter(a=>a&&Array.isArray(a.a)&&Array.isArray(a.b)&&a.a.length===2&&a.b.length===2&&[...a.a,...a.b].every(Number.isFinite)).map(a=>({id:safeId(a.id,'tape'),a:a.a.map(n=>HP_NUM(n,-100,100,0)),b:a.b.map(n=>HP_NUM(n,-100,100,0)),label:HP_TEXT(a.label,60)})):[];
 const keys=['wallLengths','labels','doorArcs','furnishings','openings','rooms','fixtureMarkers','grid'];
 const result={...STUDIO_DEFAULTS,units:x.units==='ft'?'ft':'m',north:HP_NUM(x.north,0,359.999,0),cutHeight:HP_NUM(x.cutHeight,.25,5,3),favorites:[...new Set(fav)],bookmarks:marks,annotations:pins,measurements:tapes,budget:HP_NUM(x.budget,0,1000000,0),clearance:HP_NUM(x.clearance,.35,1.5,.75),light:['day','evening','night'].includes(x.light)?x.light:'day',notes:HP_TEXT(x.notes,600),palette:STUDIO_PALETTES[x.palette]?x.palette:'sage',hideRoom:HP_TEXT(x.hideRoom,60)};
 keys.forEach(k=>result[k]=x[k]===undefined?STUDIO_DEFAULTS[k]:x[k]!==false);
 return result;
}
function roomSquareMeters(room){return round(room.w*room.d,2);}
function totalZoneArea(plan){return round(plan.rooms.reduce((v,r)=>v+roomSquareMeters(r),0),2);}
function measuredToUnits(m,units='m',precision=2){return units==='ft'?round(m*3.280839895,precision):round(m,precision);}
function areaToUnits(m2,units='m'){return units==='ft'?round(m2*10.7639104167,1):round(m2,1);}
function studioDistance(a,b){return round(Math.hypot(a[0]-b[0],a[1]-b[1]),3);}
function segmentProximity(a,b,p){const dx=b[0]-a[0],dz=b[1]-a[1],l2=dx*dx+dz*dz;const t=l2?clamp(((p[0]-a[0])*dx+(p[1]-a[1])*dz)/l2,0,1):0;return studioDistance(p,[a[0]+dx*t,a[1]+dz*t]);}
function wallDistance(w,it){const pts=corners(it);const distances=pts.map(p=>segmentProximity(w.a,w.b,p));return Math.min(segmentProximity(w.a,w.b,[it.x,it.z]),...distances);}
function nearestFurnitureWall(plan,it){return plan.walls.map(w=>({wall:w,d:wallDistance(w,it)})).sort((a,b)=>a.d-b.d)[0]||null;}
function alignedToWall(it,wall,gap=.12){const spec=FURNITURE[it.type];if(!spec)throw Error('Unknown furniture');const dx=wall.b[0]-wall.a[0],dz=wall.b[1]-wall.a[1],theta=Math.atan2(dz,dx),len=Math.hypot(dx,dz);if(len<.2)throw Error('Wall too short');const t=clamp(((it.x-wall.a[0])*dx+(it.z-wall.a[1])*dz)/(len*len),.05,.95),point=wallPoint(wall,t);const nx=-dz/len,nz=dx/len;const dot=(it.x-point[0])*nx+(it.z-point[1])*nz,sign=dot>=0?1:-1;const depth=(it.d||spec.d)/2;
 return {...it,x:round(point[0]+nx*sign*(depth+gap),3),z:round(point[1]+nz*sign*(depth+gap),3),r:round(theta*180/Math.PI,2)};
}
function itemsForRoom(plan,roomId){return plan.items.filter(i=>i.room===roomId || (!plan.rooms.some(r=>r.id===i.room)&&plan.rooms.some(r=>r.id===roomId&&i.x>=r.x&&i.x<=r.x+r.w&&i.z>=r.z&&i.z<=r.z+r.d)));}
function shoppingList(plan){const out=[];for(const it of plan.items){const spec=FURNITURE[it.type];if(!spec||it.type==='fountain')continue;out.push({id:it.id,name:it.label||spec.label,type:it.type,room:plan.rooms.find(r=>r.id===it.room)?.name||'Unassigned',w:it.w||spec.w,d:it.d||spec.d,price:Number.isFinite(it.price)?it.price:null});}const total=round(out.reduce((s,it)=>s+(it.price||0),0),2);return{items:out,total,priced:out.filter(i=>i.price!==null).length,unpriced:out.filter(i=>i.price===null).length};}
function doorSwingWarnings(plan){const out=[];for(const f of plan.fixtures){if(!['door','entry'].includes(f.type))continue;const w=plan.walls.find(w=>w.id===f.wall);if(!w)continue;const [x,z]=wallPoint(w,f.at),r=f.width,affected=[];for(const it of plan.items){if(it.type==='rug'||it.type==='fountain')continue;const spec=FURNITURE[it.type];const rad=Math.hypot((it.w||spec.w)/2,(it.d||spec.d)/2);if(Math.hypot(it.x-x,it.z-z)<r+rad+.08)affected.push(it.id);}if(affected.length)out.push({fixture:f.id,items:affected,width:r,kind:'approximate swing-radius'});}return out;}
function furnitureClearances(plan,min=.75){const risks=[];const bad=collisions(plan);for(const it of plan.items){if(['rug','fountain'].includes(it.type))continue;const closest=nearestFurnitureWall(plan,it);if(closest&&closest.d<min&&closest.d>0)risks.push({item:it.id,wall:closest.wall.id,gap:round(closest.d,2),kind:'wall-proximity'});if(bad.has(it.id))risks.push({item:it.id,kind:'furniture-overlap'});}return risks;}
function proposeSmartArrangement(plan,roomId){const room=plan.rooms.find(r=>r.id===roomId);if(!room)throw Error('Choose a room first');const its=itemsForRoom(plan,roomId).filter(it=>!it.locked&&it.type!=='rug'&&it.type!=='fountain');const mid=[room.x+room.w/2,room.z+room.d/2],positions=[];const padding=.24;
 const candidates=[[.23,.23],[.77,.23],[.23,.77],[.77,.77],[.5,.24],[.5,.76],[.24,.5],[.76,.5],[.5,.5]];
 const fixed=plan.items.filter(x=>!its.some(y=>y.id===x.id)&&FURNITURE[x.type]&&!['rug','fountain'].includes(x.type));for(let idx=0;idx<its.length;idx++){const it=its[idx],sp=FURNITURE[it.type],w=it.w||sp.w,d=it.d||sp.d;let found=null;for(const [u,v] of candidates){const x=round(room.x+padding+(room.w-2*padding)*u,3),z=round(room.z+padding+(room.d-2*padding)*v,3);const tryIt={...it,x,z,r:it.r||0};const bounds=aabbBounds(tryIt);if(x-bounds.hw<room.x+padding||x+bounds.hw>room.x+room.w-padding||z-bounds.hd<room.z+padding||z+bounds.hd>room.z+room.d-padding)continue;if([...fixed,...positions].some(o=>satCollision(o,tryIt)))continue;found=tryIt;break;}if(found){positions.push(found);}else positions.push({...it});}
 return positions.map(it=>({id:it.id,x:it.x,z:it.z,r:it.r}));
}
function roomByPoint(plan,x,z){return plan.rooms.find(r=>x>=r.x&&x<=r.x+r.w&&z>=r.z&&z<=r.z+r.d)||null;}
function studioSafeCSV(value){let s=String(value??'');if(/^\s*[=+@\-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
function shoppingCSV(plan){const rows=[['Name','Room','Width (m)','Depth (m)','Price (USD)','Notes'],...shoppingList(plan).items.map(it=>[it.name,it.room,it.w,it.d,it.price??'',plan.items.find(x=>x.id===it.id)?.note||''])];return rows.map(row=>row.map(studioSafeCSV).join(',')).join('\r\n')+'\r\n';}
/** Advisory grid route through the sketch, not a building-code egress test. */
function walkingRoute(plan,start,end,clearance=.75){
 const step=.23,points=plan.rooms.flatMap(r=>[[r.x,r.z],[r.x+r.w,r.z+r.d]]),xs=points.map(p=>p[0]),zs=points.map(p=>p[1]);
 if(!xs.length)return {ok:false,reason:'No rooms'};const minX=Math.min(...xs)-.1,maxX=Math.max(...xs)+.1,minZ=Math.min(...zs)-.1,maxZ=Math.max(...zs)+.1;
 const W=Math.ceil((maxX-minX)/step),H=Math.ceil((maxZ-minZ)/step);if(W*H>18000)return {ok:false,reason:'Plan too large for route grid'};
 const index=(x,z)=>z*W+x,coord=(x,z)=>[minX+(x+.5)*step,minZ+(z+.5)*step];
 const grid=new Uint8Array(W*H);let count=0;
 const blocked=(x,z)=>{
  const zone=roomByPoint(plan,x,z);if(!zone)return true;
  for(const it of plan.items){if(['rug','fountain'].includes(it.type))continue;const sp=FURNITURE[it.type];if(!sp)continue;const angle=-it.r*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle),dx=x-it.x,dz=z-it.z,lx=dx*c-dz*s,lz=dx*s+dz*c;const pad=clearance/2;if(Math.abs(lx)<(it.w||sp.w)/2+pad&&Math.abs(lz)<(it.d||sp.d)/2+pad)return true;}
  for(const w of plan.walls){const distance=segmentProximity(w.a,w.b,[x,z]);if(distance>clearance*.48+(w.thick||.12)/2)continue;const open=plan.fixtures.some(f=>f.wall===w.id&&['door','entry','opening'].includes(f.type)&&studioDistance(wallPoint(w,f.at),[x,z])<Math.max(0,f.width-clearance)/2+.06);if(!open)return true;}
  return false;
 };
 for(let iz=0;iz<H;iz++)for(let ix=0;ix<W;ix++){const [x,z]=coord(ix,iz);grid[index(ix,iz)]=blocked(x,z)?1:0;if(!grid[index(ix,iz)])count++;}
 const nearest=p=>{let k=-1,best=Infinity;for(let j=0;j<H;j++)for(let i=0;i<W;i++){const id=index(i,j);if(grid[id])continue;const [x,z]=coord(i,j),d=Math.hypot(x-p[0],z-p[1]);if(d<best){best=d;k=id;}}return k;};
 if(count===0)return{ok:false,reason:'No navigable floor at this clearance'};
 const src=nearest(start),dst=nearest(end);if(src<0||dst<0)return{ok:false,reason:'Endpoints blocked'};
 const prev=new Int32Array(W*H).fill(-1),dist=new Int32Array(W*H).fill(-1),queue=new Int32Array(W*H);let head=0,tail=0;queue[tail++]=src;dist[src]=0;
 while(head<tail){const cur=queue[head++];if(cur===dst)break;const x=cur%W,z=Math.floor(cur/W);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,nz=z+dz;if(nx<0||nx>=W||nz<0||nz>=H)continue;const ni=index(nx,nz);if(grid[ni]||dist[ni]>=0)continue;dist[ni]=dist[cur]+1;prev[ni]=cur;queue[tail++]=ni;}}
 if(dist[dst]===-1)return{ok:false,reason:'No connected path in estimated geometry',visited:tail};const path=[];let k=dst;while(k>=0){path.push(coord(k%W,Math.floor(k/W)));if(k===src)break;k=prev[k];}path.reverse();return{ok:true,length:round(dist[dst]*step,2),path,visited:tail,clearance};
}
const studioEsc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function studioInlineItem(it){return `<section class="ins-section"><p class="section-title">IDENTITY · FINISH · COST</p><div class="field"><label for="hp-name">Furniture label</label><input id="hp-name" data-hp-field="label" maxlength="70" value="${studioEsc(it.label||'')}"></div><div class="fields-two"><div class="field"><label for="hp-color">Finish color</label><input type="color" id="hp-color" data-hp-field="color" value="${HP_COLOR(it.color)?it.color:FURNITURE[it.type].color}"></div><div class="field"><label for="hp-price">Estimated price (USD)</label><input type="number" min="0" max="100000" step="0.01" id="hp-price" data-hp-field="price" value="${it.price??''}" placeholder="Not priced"></div></div><div class="field"><label for="hp-note">Object note</label><textarea id="hp-note" data-hp-field="note" maxlength="250" rows="2">${studioEsc(it.note||'')}</textarea></div><div class="toggle-row"><label for="hp-lock">Lock against dragging</label><input id="hp-lock" type="checkbox" data-hp-field="locked" ${it.locked?'checked':''}></div><div class="toggle-row"><label for="hp-hide">Hide this furniture</label><input id="hp-hide" type="checkbox" data-hp-field="hidden" ${it.hidden?'checked':''}></div><div class="field"><label for="hp-group">Move group (same name moves together)</label><input id="hp-group" data-hp-field="group" maxlength="60" value="${studioEsc(it.group||'')}" placeholder="e.g. sofa-set"></div><div class="button-row"><button class="btn" data-hp-act="alignWall">Align against nearest wall</button><button class="btn" data-hp-act="openStudio">Open Design Lab</button></div></section>`;}
function studioInlineRoom(r){return `<section class="ins-section"><p class="section-title">ROOM IDENTITY · FINISH</p><div class="field"><label for="hp-name">Room name</label><input id="hp-name" data-hp-field="name" maxlength="60" value="${studioEsc(r.name)}"></div><div class="field"><label for="hp-color">Floor finish</label><input id="hp-color" type="color" data-hp-field="color" value="${HP_COLOR(r.color)?r.color:'#dce5e2'}"></div><div class="field"><label for="hp-note">Room note</label><textarea id="hp-note" data-hp-field="note" maxlength="250">${studioEsc(r.note||'')}</textarea></div><div class="statusline">Estimated area: ${roomSquareMeters(r)} m² · not a surveyed footprint</div></section>`;}
function studioInlineWall(w){return `<section class="ins-section"><p class="section-title">WALL FINISH</p><div class="field"><label for="hp-color">Paint color</label><input id="hp-color" type="color" data-hp-field="color" value="${HP_COLOR(w.color)?w.color:'#a1aaa1'}"></div><p class="note">Finish color is a visual planning aid; wall geometry remains editable above.</p></section>`;}
function studioInlineFixture(f){return ['door','entry'].includes(f.type)?`<section class="ins-section"><p class="section-title">DOOR SWING · APPROXIMATE</p><div class="field"><label for="hp-swing">Opening side</label><select id="hp-swing" data-hp-field="swing"><option value="left" ${f.swing!=='right'?'selected':''}>Left hinge</option><option value="right" ${f.swing==='right'?'selected':''}>Right hinge</option></select></div><p class="note">The arc is illustrative. Verify actual hinge, swing direction and clearance on site.</p></section>`:'';}
