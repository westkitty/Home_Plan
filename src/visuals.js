'use strict';
/* Home Plan's offline diorama painter. Presentation only: geometry and editing stay authoritative in app.js. */
window.HomePlanVisuals = (() => {
  const TAU = Math.PI * 2;
  const palette = {
    day: { sky: '#C9E9FF', low: '#E9F6FF', desk: '#e5dfd1', ink: '#233c38', sunlight: '#fff0b6', shade: '#193c37' },
    evening: { sky: '#e3c8af', low: '#899d9d', desk: '#c4b5a3', ink: '#283c38', sunlight: '#ffcb8e', shade: '#293344' },
    night: { sky: '#4b6271', low: '#243b48', desk: '#677a7b', ink: '#21353b', sunlight: '#e1c69f', shade: '#0e2632' }
  };
  function rgb(hex) {
    const h = typeof hex === 'string' ? hex.replace('#', '') : '';
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return [164, 180, 167];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function tone(hex, f = 1, lift = 0) {
    return `rgb(${rgb(hex).map(n => Math.min(255, Math.max(0, Math.round(n * f + lift)))).join(',')})`;
  }
  function rgba(hex, opacity) { const c = rgb(hex); return `rgba(${c[0]},${c[1]},${c[2]},${opacity})`; }
  function blend(a, b, amount) { const first = rgb(a), second = rgb(b); return `rgb(${first.map((v, i) => Math.round(v * (1 - amount) + second[i] * amount)).join(',')})`; }
  function trace(ctx, points) {
    ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.closePath();
  }
  function line(ctx, a, b, color, width = 1, dash = null) {
    if (!a || !b) return;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = color; ctx.lineWidth = width;
    if (dash) ctx.setLineDash(dash);
    ctx.stroke(); if (dash) ctx.setLineDash([]);
  }
  function poly(engine, pts) { const points = pts.map(p => engine.project(...p)); return points.every(Boolean) ? points : null; }
  function area(points) {
    let a = 0; for (let i = 0; i < points.length; i++) { const p = points[i], q = points[(i + 1) % points.length]; a += p.x * q.y - q.x * p.y; }
    return Math.abs(a) * .5;
  }
  function lightFactor(light) { return light === 'night' ? .71 : light === 'evening' ? .94 : 1; }
  function roomBounds(plan) {
    const r = plan.rooms;
    if (!r.length) { const points=[...plan.walls.flatMap(w=>[w.a,w.b]),...plan.items.map(it=>[it.x,it.z])];return points.length?{minX:Math.min(...points.map(p=>p[0]))-2,maxX:Math.max(...points.map(p=>p[0]))+2,minZ:Math.min(...points.map(p=>p[1]))-2,maxZ:Math.max(...points.map(p=>p[1]))+2}:{minX:-6,maxX:6,minZ:-6,maxZ:6}; }
    return {
      minX: Math.min(...r.map(x => x.x)) - .5,
      maxX: Math.max(...r.map(x => x.x + x.w)) + .5,
      minZ: Math.min(...r.map(x => x.z)) - .5,
      maxZ: Math.max(...r.map(x => x.z + x.d)) + .5
    };
  }
  function background(ctx, w, h, light, colors, studio={}) {
    // The color behind the model is a personal workspace setting, not a plan material.
    const chosen = window.HomePlanAppearance?.getColor?.() || '#C9E9FF';
    const tint = light === 'night' ? '#1B2C45' : light === 'evening' ? '#FFF0DE' : '#FFFFFF';
    const strength = light === 'night' ? .20 : light === 'evening' ? .12 : .17;
    const dayColor=light==='night'?blend(chosen,'#0a1427',(studio.outdoorDim??85)/100*.97):light==='evening'?blend(chosen,'#c48c82',.30):chosen;
    const backdrop = ctx.createLinearGradient(0, 0, w * .8, h);
    backdrop.addColorStop(0, dayColor);
    backdrop.addColorStop(.68, blend(dayColor, tint, strength));
    backdrop.addColorStop(1, blend(dayColor, tint, strength * 1.35));
    ctx.fillStyle = backdrop; ctx.fillRect(0, 0, w, h);
    const glow = ctx.createRadialGradient(w * .74, h * .13, 5, w * .74, h * .13, Math.max(w, h) * .75);
    glow.addColorStop(0, light === 'night' ? 'rgba(186,200,211,.12)' : 'rgba(255,255,255,.22)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = light === 'night' ? '#a6c1ca1e' : '#315a8010'; ctx.lineWidth = 1;
    const spacing = 35;
    for (let i = 0; i < Math.ceil(w / spacing) + 1; i++) {
      const x = i * spacing + .5; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let i = 0; i < Math.ceil(h / spacing) + 1; i++) {
      const y = i * spacing + .5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
  }
  function stageSlab(ctx, engine, bounds, colors, light, quality) {
    const b = bounds, r = .1;
    const deck = poly(engine, [[b.minX, -.21, b.minZ], [b.maxX, -.21, b.minZ], [b.maxX, -.21, b.maxZ], [b.minX, -.21, b.maxZ]]);
    if (!deck) return;
    ctx.save(); ctx.shadowColor = light === 'night' ? 'rgba(3,18,27,.62)' : 'rgba(30,57,49,.33)';
    ctx.shadowBlur = quality === 'eco' ? 8 : quality === 'high' ? 37 : 21; ctx.shadowOffsetY = 14; trace(ctx, deck); ctx.fillStyle = colors.desk; ctx.fill();
    ctx.restore();
    const rim = poly(engine, [[b.minX, -.32, b.maxZ], [b.maxX, -.32, b.maxZ], [b.maxX, -.21, b.maxZ], [b.minX, -.21, b.maxZ]]);
    if (rim) { trace(ctx, rim); ctx.fillStyle = tone(colors.desk, .63); ctx.fill(); }
    const top = ctx.createLinearGradient(deck[0].x, deck[0].y, deck[2].x, deck[2].y);
    top.addColorStop(0, tone(colors.desk, 1, 13)); top.addColorStop(1, tone(colors.desk, .91));
    trace(ctx, deck); ctx.fillStyle = top; ctx.fill(); ctx.lineWidth = 1.5;
    ctx.strokeStyle = light === 'night' ? '#e8e3c455' : '#fbfbf0aa'; ctx.stroke();
    if (!engine._disableGrid && engine._showGrid) {
      ctx.save(); trace(ctx, deck); ctx.clip();
      ctx.lineWidth = .8; ctx.strokeStyle = light === 'night' ? '#bed6da27' : '#38655b27';
      const minX = Math.floor(b.minX), maxX = Math.ceil(b.maxX), minZ = Math.floor(b.minZ), maxZ = Math.ceil(b.maxZ);
      for (let x = minX; x <= maxX; x++) line(ctx, engine.project(x, -.202, minZ), engine.project(x, -.202, maxZ), ctx.strokeStyle, .7);
      for (let z = minZ; z <= maxZ; z++) line(ctx, engine.project(minX, -.202, z), engine.project(maxX, -.202, z), ctx.strokeStyle, .7);
      ctx.restore();
    }
    // The slab is a presentation boundary, not an extra surveyed architectural wall.
    const pin = engine.project(b.minX + r, -.195, b.maxZ - r);
    if (pin && pin.x > 0 && pin.x < engine.w && pin.y > 0 && pin.y < engine.h) {
      ctx.font = '700 9px system-ui'; ctx.fillStyle = light === 'night' ? '#d2ddddaa' : '#35534d99';
      ctx.fillText('CONCEPT MODEL  /  NOT YET SURVEYED', pin.x + 6, pin.y - 5);
    }
  }
  function backfaceVisible(box, faceIndex, cameraPos) {
    if (faceIndex === 0) return false;
    if (faceIndex === 1) return cameraPos.y >= box.y;
    const co = Math.cos(box.rot), si = Math.sin(box.rot);
    let nx = 0, nz = 0;
    if (faceIndex === 2) { nx = si; nz = -co; }
    else if (faceIndex === 3) { nx = -si; nz = co; }
    else if (faceIndex === 4) { nx = -co; nz = -si; }
    else { nx = co; nz = si; }
    return nx * (cameraPos.x - box.x) + nz * (cameraPos.z - box.z) > -.025;
  }
  function faceGradient(ctx, f, quality, light) {
    const b = f.box, p = f.poly, k = f.face;
    const studio=window.homePlanStudioBridge?.getPlan?.()?.studio||{};
    const nightAmount=(studio.outdoorDim??85)/100,glow=(studio.indoorGlow??75)/100;
    const lighting=light==='night'?(b.indoor===false?.42*(1-nightAmount*.65):.59+glow*.59):light==='evening'?(b.indoor===false?.78:.93):1;
    const mult = [0.56, 1.10, .78, .85, .75, .94][k] * lighting;
    if (quality === 'eco' || f.pixelArea < (quality === 'high' ? 480 : 1850) || (b.kind === 'item' && f.pixelArea < 4500) || b.kind === 'selection') return tone(b.color, mult, k === 1 ? 9 : 0);
    const top = Math.min(...p.map(a => a.y)), bottom = Math.max(...p.map(a => a.y));
    const g = ctx.createLinearGradient(p[0].x, top, p[2].x + .01, Math.max(top + 1, bottom));
    g.addColorStop(0, tone(b.color, mult * 1.10, 12));
    g.addColorStop(.57, tone(b.color, mult, k === 1 ? 9 : 1));
    g.addColorStop(1, tone(b.color, mult * .88));
    return g;
  }
  function faceOutline(ctx, f, light) {
    if (f.box.kind === 'room') {
      ctx.lineWidth = f.face === 1 ? 1.3 : .7;
      ctx.strokeStyle = f.face === 1 ? (light === 'night' ? '#e6ebe39b' : '#fffdf4ba') : '#45594b66';
    } else if (f.box.kind === 'wall') {
      ctx.lineWidth = f.face === 1 ? 1 : .48;
      ctx.strokeStyle = light === 'night' ? '#aec5c65c' : '#526f6260';
    } else if (f.box.kind === 'selection') {
      ctx.lineWidth = 1.9; ctx.strokeStyle = '#13c9b1';
    } else {
      ctx.lineWidth = f.face === 1 ? .95 : .65;
      ctx.strokeStyle = light === 'night' ? 'rgba(13,34,38,.38)' : 'rgba(44,51,42,.32)';
    }
    ctx.stroke();
  }
  function drawFloorPattern(ctx, engine, f, plan, quality, light) {
    const room = plan.rooms.find(r => r.id === f.box.id); if (!room) return;
    if (f.pixelArea < 700 || quality === 'eco') return;
    if(f.box.customFloor)return;
    const kind = FLOOR_MATERIALS[room.flooring]?.pattern || (/bath|kitchen|lavatory/i.test(room.id + ' ' + room.name) ? 'tile' : /hall|entrance|workshop/i.test(room.id + ' ' + room.name) ? 'stone' : 'wood');
    const y = -.0185, bright = light === 'night' ? .56 : 1;
    ctx.save(); trace(ctx, f.poly); ctx.clip();
    ctx.lineWidth = kind === 'wood' ? .76 : .95;
    const ink = light === 'night' ? 'rgba(28,49,49,.30)' : 'rgba(68,77,60,.27)';
    if(kind==='carpet'){
      // Soft short woven flecks, screen-space consistent and not image-backed.
      const density=quality==='high'?.20:.36;
      for(let z=room.z+density;z<room.z+room.d;z+=density)for(let x=room.x+density;x<room.x+room.w;x+=density){
       const p=engine.project(x,y,z);if(!p)continue;ctx.fillStyle='rgba(255,255,255,.14)';ctx.fillRect(p.x,p.y,1.1,1.1);
      }
    }else if (kind === 'wood'||kind==='deck') {
      const step = kind==='deck'?.48:quality === 'high' ? .22 : .33;
      ctx.strokeStyle = ink;
      let row = 0;
      for (let z = room.z + step; z < room.z + room.d - .01; z += step, row++) {
        line(ctx, engine.project(room.x, y, z), engine.project(room.x + room.w, y, z), ink, .75);
        const seam = row % 3 * .48;
        for (let x = room.x + seam + 1.1; x < room.x + room.w - .01; x += 1.4) {
          line(ctx, engine.project(x, y, z), engine.project(x, y, Math.min(z + step, room.z + room.d)), ink, .68);
        }
      }
      if (quality === 'high' && kind==='wood') {
        const grain = 'rgba(255,255,240,.11)';
        for (let z = room.z + .09; z < room.z + room.d; z += .65)
          line(ctx, engine.project(room.x + .15, y, z), engine.project(room.x + room.w - .2, y, z + .015), grain, .58);
      }
    } else {
      const step = kind === 'tile' ? .52 : .72;
      for (let x = room.x + step; x < room.x + room.w; x += step)
        line(ctx, engine.project(x, y, room.z), engine.project(x, y, room.z + room.d), ink, .9);
      for (let z = room.z + step; z < room.z + room.d; z += step)
        line(ctx, engine.project(room.x, y, z), engine.project(room.x + room.w, y, z), ink, .9);
    }
    ctx.restore();
    // Thin architectural perimeter to visually separate the room edge from the ground model.
    const corners = poly(engine, [[room.x, -.004, room.z], [room.x + room.w, -.004, room.z], [room.x + room.w, -.004, room.z + room.d], [room.x, -.004, room.z + room.d]]);
    if (corners) { trace(ctx, corners); ctx.lineWidth = 1.05; ctx.strokeStyle = `rgba(255,255,243,${.25 * bright})`; ctx.stroke(); }
  }
  function drawFurnitureDetail(ctx, engine, f, itemById, quality) {
    if (f.box.kind !== 'item' || f.face !== 1 || f.pixelArea < 170 || quality === 'eco') return;
    const item = itemById.get(f.box.id); if (!item) return;
    const type = item.type;
    const wood = ['table','coffee','side','shelf','dresser','counter','storage'].includes(type);
    const fabric = ['sofa','loveseat','armchair','bed','chair','rug'].includes(type);
    if (!wood && !fabric && type !== 'tv' && type !== 'fountain') return;
    ctx.save(); trace(ctx, f.poly); ctx.clip();
    if (wood) {
      ctx.strokeStyle = 'rgba(69,52,38,.16)'; ctx.lineWidth = .75;
      for (let k = 1; k <= 3; k++) {
        const t = k / 4, a = {x: f.poly[0].x + (f.poly[1].x - f.poly[0].x) * t, y: f.poly[0].y + (f.poly[1].y - f.poly[0].y) * t};
        const b = {x: f.poly[3].x + (f.poly[2].x - f.poly[3].x) * t, y: f.poly[3].y + (f.poly[2].y - f.poly[3].y) * t};
        line(ctx, a, b, ctx.strokeStyle, .6);
      }
    } else if (fabric) {
      ctx.strokeStyle = type === 'rug' ? 'rgba(244,229,195,.62)' : 'rgba(252,251,240,.48)';
      ctx.lineWidth = type === 'rug' ? 1.5 : .9;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const p = f.poly[i], q = f.poly[(i + 1) % 4];
        const inset = {x: p.x + (f.poly[(i + 2) % 4].x - p.x) * .055, y: p.y + (f.poly[(i + 2) % 4].y - p.y) * .055};
        if (i === 0) ctx.moveTo(inset.x, inset.y); else ctx.lineTo(inset.x, inset.y);
      }
      ctx.closePath(); ctx.stroke();
      if (type === 'rug' && f.pixelArea > 1100) {
        const m = f.poly.map((p, i) => ({x: (p.x + f.poly[(i + 2) % 4].x) * .5, y: (p.y + f.poly[(i + 2) % 4].y) * .5}));
        ctx.strokeStyle = 'rgba(235,238,210,.45)'; ctx.lineWidth = 1;
        line(ctx, f.poly[0], f.poly[2], ctx.strokeStyle); line(ctx, f.poly[1], f.poly[3], ctx.strokeStyle);
      }
    } else if (type === 'tv') {
      line(ctx, f.poly[0], f.poly[2], 'rgba(191,243,252,.20)', 1.3);
    }
    ctx.restore();
  }
  function selectedHighlight(ctx, engine, app, quality) {
    const s = app.selected, p = app.plan;
    if (!s) return;
    let pts = null, center = null;
    if (s.kind === 'item') {
      const it = p.items.find(x => x.id === s.id); if (!it) return;
      const sp = FURNITURE[it.type]; if (!sp) return;
      const w = it.w || sp.w, d = it.d || sp.d, a = it.r * Math.PI / 180, c = Math.cos(a), si = Math.sin(a);
      pts = [[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]].map(([x,z]) => [it.x + x*c-z*si,.018,it.z+x*si+z*c]);
      center = engine.project(it.x, (it.h || sp.h) + .14, it.z);
    } else if (s.kind === 'wall') {
      const w = p.walls.find(x => x.id === s.id); if (!w) return;
      const a = engine.project(w.a[0], .14, w.a[1]), b = engine.project(w.b[0], .14, w.b[1]);
      if (a && b) { line(ctx,a,b,'#12d7bc',3); for(const k of [a,b]) {ctx.beginPath();ctx.arc(k.x,k.y,6,0,TAU);ctx.fillStyle='#e8c28b';ctx.fill();ctx.strokeStyle='#0f665e';ctx.lineWidth=2;ctx.stroke();} }
      return;
    }
    if (!pts) return;
    const projected = poly(engine, pts); if (!projected) return;
    ctx.save(); ctx.globalAlpha = 1;
    ctx.shadowBlur = quality === 'eco' ? 0 : 12 + 8*(app.visualPulse||0);
    ctx.shadowColor = 'rgba(29,205,173,.47)';
    trace(ctx, projected); ctx.strokeStyle = '#08bda6'; ctx.lineWidth = 2.5 + (app.visualPulse||0)*1.8; ctx.setLineDash([6,4]); ctx.stroke(); ctx.setLineDash([]); ctx.shadowBlur = 0;
    for (const pt of projected) {
      ctx.fillStyle = '#fff9e7'; ctx.strokeStyle = '#0b9f91'; ctx.lineWidth = 1.7;
      ctx.fillRect(pt.x-3.5,pt.y-3.5,7,7);ctx.strokeRect(pt.x-3.5,pt.y-3.5,7,7);
    }
    if (center && center.y > 10 && center.y < engine.h - 20) {
      ctx.font = '800 10px system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle';
      const it = p.items.find(x => x.id === s.id); const label = (it?.label || FURNITURE[it?.type]?.label || 'Selected').slice(0, 28);
      const width = Math.max(66, ctx.measureText(label.toUpperCase()).width + 24);
      ctx.fillStyle = '#123f37'; ctx.strokeStyle = '#7bcaaf'; ctx.lineWidth = 1;
      ctx.beginPath();ctx.roundRect(center.x-width/2, center.y-21,width,23,8);ctx.fill();ctx.stroke();
      ctx.fillStyle = '#f8f4e5'; ctx.fillText(label.toUpperCase(),center.x,center.y-9);
    }
    ctx.restore();
  }
  function roomLabels(ctx, engine, plan, light) {
    if (plan.studio?.labels === false) return;
    const dark = light === 'night';
    ctx.save(); ctx.textBaseline='middle'; ctx.textAlign='center';
    for (const room of plan.rooms) {
      if (room.id === plan.studio?.hideRoom) continue;
      const p = engine.project(room.x+room.w*.52, .027, room.z+room.d*.5);
      if (!p || p.x < 0 || p.x > engine.w || p.y < 0 || p.y > engine.h) continue;
      const size = engine.w < 550 ? 9 : 10;
      const title = room.name.toUpperCase();
      ctx.font = `800 ${size}px system-ui`;
      const ww = Math.max(70,ctx.measureText(title).width+21);
      ctx.fillStyle = dark && room.zone==='outdoor' ? 'rgba(12,28,40,.92)' : dark ? 'rgba(46,36,29,.90)' : 'rgba(255,252,239,.79)';
      ctx.strokeStyle = dark ? 'rgba(192,223,209,.28)' : 'rgba(59,91,76,.21)';
      ctx.lineWidth=.85;ctx.beginPath();ctx.roundRect(p.x-ww/2,p.y-12,ww,24,7);ctx.fill();ctx.stroke();
      ctx.fillStyle= dark ? '#f8e7ca' : '#315c4d';ctx.fillText(title,p.x,p.y+1);
    }
    ctx.restore();
  }
  function entranceLabel(ctx,engine,plan,light){
    const entrances=plan.fixtures.filter(f=>f.type==='entry');
    ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
    for(const f of entrances){const wall=plan.walls.find(w=>w.id===f.wall);if(!wall)continue;const pt=wallPoint(wall,f.at),p=engine.project(pt[0],.42,pt[1]);if(!p)continue;
      ctx.fillStyle=light==='night'?'#f5bc75':'#c36f29';ctx.font='900 11px system-ui';ctx.fillText('⇥ ENTRY',p.x,p.y-20);
    }ctx.restore();
  }
  function fixtures(ctx, engine, plan, light, quality) {
    if (plan.studio?.fixtureMarkers === false || !plan.view.walls) return;
    ctx.save();
    for(const f of plan.fixtures){
      const wall=plan.walls.find(w=>w.id===f.wall); if(!wall)continue;
      const dx=wall.b[0]-wall.a[0], dz=wall.b[1]-wall.a[1], len=Math.hypot(dx,dz)||1;
      const dir=[dx/len,dz/len], pt=[wall.a[0]+dx*f.at,wall.a[1]+dz*f.at], half=Math.min(f.width*.5,len*.35);
      const endpoints=[ [pt[0]-dir[0]*half,pt[1]-dir[1]*half], [pt[0]+dir[0]*half,pt[1]+dir[1]*half] ];
      const a=engine.project(endpoints[0][0],.045,endpoints[0][1]),b=engine.project(endpoints[1][0],.045,endpoints[1][1]);
      if(!a||!b)continue;
      if (f.type === 'window') {
        const bl=engine.project(endpoints[0][0],.88,endpoints[0][1]),br=engine.project(endpoints[1][0],.88,endpoints[1][1]);
        const tl=engine.project(endpoints[0][0],2.03,endpoints[0][1]),tr=engine.project(endpoints[1][0],2.03,endpoints[1][1]);
        if(bl&&br&&tl&&tr){
          ctx.beginPath();for(const [i,p] of [bl,br,tr,tl].entries())i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);ctx.closePath();
          const sky=ctx.createLinearGradient(bl.x,tl.y,br.x,br.y);sky.addColorStop(0,light==='night'?'rgba(35,99,121,.64)':'rgba(157,224,225,.49)');sky.addColorStop(1,'rgba(246,251,230,.15)');
          ctx.fillStyle=sky;ctx.fill();ctx.strokeStyle='#e4eee4';ctx.lineWidth=3;ctx.stroke();
          line(ctx,engine.project(pt[0],.88,pt[1]),engine.project(pt[0],2.03,pt[1]),'rgba(240,250,240,.88)',1.8);
          line(ctx,engine.project(endpoints[0][0],1.48,endpoints[0][1]),engine.project(endpoints[1][0],1.48,endpoints[1][1]),'rgba(240,250,240,.56)',1);
          line(ctx,bl,tr,'rgba(255,255,255,.40)',1.1);
        }
      }else if (f.type === 'door' || f.type === 'entry' || f.type === 'opening'){
        line(ctx,a,b,light==='night'?'rgba(235,197,140,.95)':'rgba(157,121,75,.88)',3.2);
        if (quality !== 'eco' && plan.studio?.doorArcs && f.type !== 'opening') {
          const v=engine.project(pt[0]+(f.swing==='right'?-dir[1]:dir[1])*half, .03,pt[1]+(f.swing==='right'?dir[0]:-dir[0])*half);
          if(v){ctx.strokeStyle='rgba(218,170,106,.48)';ctx.lineWidth=1.1;ctx.setLineDash([3,3]);line(ctx,a,v,ctx.strokeStyle,1.1,[3,3]);}
        }
      }else if(f.type==='outlet'){
        const q=engine.project(pt[0],.37,pt[1]);if(q){ctx.fillStyle='#ffefcb';ctx.strokeStyle='#a4844f';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(q.x-4,q.y-5,8,10,2);ctx.fill();ctx.stroke();}
      }
    }
    ctx.restore();
  }
  function wallTrim(ctx, engine, plan, light) {
    if (!plan.view.walls) return;
    ctx.save();ctx.lineCap='round';
    for(const wall of plan.walls){
      const h=Math.min(wall.height,plan.studio?.cutHeight??3);
      if(h < .22) continue;
      const a=engine.project(wall.a[0],.105,wall.a[1]),b=engine.project(wall.b[0],.105,wall.b[1]);
      line(ctx,a,b,light==='night'?'rgba(202,213,202,.54)':'rgba(249,246,227,.64)',2.1);
      const aa=engine.project(wall.a[0],h-.045,wall.a[1]),bb=engine.project(wall.b[0],h-.045,wall.b[1]);
      if(aa&&bb)line(ctx,aa,bb,light==='night'?'rgba(200,226,230,.18)':'rgba(255,255,241,.42)',1.0);
    }
    ctx.restore();
  }
  function fountainMarker(ctx,engine,app,light){
  const f=app.plan.items.find(item=>item.type==='fountain'&&!item.hidden);
  if(!f||app.plan.studio?.furnishings===false)return;
  const center=engine.project(f.x,.44,f.z);if(!center)return;
  ctx.save();ctx.strokeStyle=light==='night'?'rgba(159,224,235,.62)':'rgba(51,156,168,.46)';
  const breath=app.visualPulse||0;
  for(let i=0;i<2;i++){
    const r=4.5+i*4+breath*5,rx=r,ry=r*.51;
    ctx.globalAlpha=(.57-i*.18)*(1-breath*.28);
    ctx.lineWidth=i===0?1.5:1;
    ctx.beginPath();ctx.ellipse(center.x,center.y,rx,ry,0,0,Math.PI*2);ctx.stroke();
  }
  ctx.globalAlpha=.9;ctx.fillStyle='#d5f6e8';ctx.beginPath();ctx.arc(center.x-2,center.y-4,1.3,0,Math.PI*2);ctx.fill();ctx.restore();
}
function annotations(ctx, engine, app) {
    const items=app.plan.studio?.annotations||[];
    if(!items.length)return;
    ctx.save(); ctx.textAlign='center'; ctx.textBaseline='middle';ctx.font='700 10px system-ui';
    for(const note of items.slice(0,90)){
      const p=engine.project(note.x,.1,note.z);if(!p)continue;
      ctx.fillStyle='#f3c77c';ctx.strokeStyle='#314840';ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(p.x,p.y,4.5,0,TAU);ctx.fill();ctx.stroke();
    }
    ctx.restore();
  }
  function vignette(ctx,w,h,light) {
    const g=ctx.createRadialGradient(w*.51,h*.46,Math.min(w,h)*.19,w*.51,h*.49,Math.max(w,h)*.81);
    g.addColorStop(0,'rgba(16,27,31,0)');g.addColorStop(1,light==='night'?'rgba(5,13,22,.27)':'rgba(27,37,31,.11)');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  }
  function render(engine, app, boxes) {
    if(!engine || !engine.w || !engine.h || engine.disposed) return true;
    const ctx=engine.ctx,plan=app.plan,light=plan.studio?.light||'day',c=palette[light]||palette.day;
    // Dense designs use lightweight, flat-shaded faces; editing still remains exact.
    // This adaptive presentation budget is transient and never changes saved user preferences.
    const denseScene = plan.items.length > 80;
    const quality = (denseScene || plan.view?.quality==='eco' || app.quality<=1) ? 'eco' : app.quality>=1.7 ? 'high' : 'balanced';
    const w=engine.w,h=engine.h;
    ctx.save(); engine.C=engine.camera(); engine._showGrid=plan.view.grid;
    try{
      background(ctx,w,h,light,c,plan.studio);
      stageSlab(ctx,engine,roomBounds(plan),c,light,quality);
      const faceIndices=[[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]];
      const faces=[],itemById=new Map(plan.items.map(it=>[it.id,it]));
      for(const box of boxes){
        const vertices=engine.vertices(box), projected=vertices.map(v=>engine.project(...v));
        if(projected.some(p=>!p))continue;
        for(let i=1;i<6;i++){
          if(!backfaceVisible(box,i,engine.C.pos))continue;
          const points=faceIndices[i].map(j=>projected[j]);
          if(Math.max(...points.map(p=>p.x)) < -10 || Math.min(...points.map(p=>p.x)) > w+10 || Math.max(...points.map(p=>p.y)) < -10 || Math.min(...points.map(p=>p.y)) > h+10)continue;
          const pixelArea=area(points);
          if(pixelArea<.38)continue;
          faces.push({box,face:i,poly:points,depth:points.reduce((sum,p)=>sum+p.depth,0)/4,pixelArea});
        }
      }
      // Grounded contact shadows are projected polygons; no blur kernels or large temporary textures.
      if(quality!=='eco') for(const it of plan.items){
        if(it.hidden||plan.studio?.furnishings===false||it.type==='rug'||it.type==='fountain')continue;
        const sp=FURNITURE[it.type];if(!sp)continue;
        const a=it.r*Math.PI/180,cs=Math.cos(a),sn=Math.sin(a),ww=(it.w||sp.w)/2+.09,dd=(it.d||sp.d)/2+.07;
        const points=poly(engine,[[-ww,-dd],[ww,-dd],[ww,dd],[-ww,dd]].map(([x,z])=>[it.x+x*cs-z*sn+.09,-.008,it.z+x*sn+z*cs+.09]));
        if(!points)continue;
        faces.push({box:{kind:'shadow',id:it.id},face:1,poly:points,depth:points.reduce((sum,p)=>sum+p.depth,0)/4,pixelArea:area(points)});
      }
      faces.sort((a,b)=>b.depth-a.depth);
      for(const face of faces){
        const box=face.box;
        if(box.kind==='shadow'){
          ctx.save();ctx.globalAlpha=light==='night'?.31:.17;trace(ctx,face.poly);ctx.fillStyle='#142a24';ctx.fill();ctx.restore();continue;
        }
        // In the adaptive dense-scene mode, avoid per-face Canvas save/restore,
        // gradient allocations and subpixel outlines. The edit/hit model is unchanged.
        if (quality === 'eco') {
          if (face.pixelArea < (denseScene ? 18 : .38)) continue;
          ctx.globalAlpha=box.kind==='wall'&&plan.view.style==='dollhouse'?.33:box.kind==='selection'?.44:1;
          trace(ctx,face.poly);
          ctx.fillStyle=faceGradient(ctx,face,quality,light);ctx.fill();
          if(!box.customFloor&&(face.pixelArea>70 || box.kind==='selection'))faceOutline(ctx,face,light);
          ctx.globalAlpha=1;
        } else {
          ctx.save();
          ctx.globalAlpha=box.kind==='wall'&&plan.view.style==='dollhouse'?.33:box.kind==='selection'?.44:1;
          trace(ctx,face.poly);
          ctx.fillStyle=faceGradient(ctx,face,quality,light);ctx.fill();
          if(!box.customFloor)faceOutline(ctx,face,light);
          if(box.kind==='room'&&face.face===1)drawFloorPattern(ctx,engine,face,plan,quality,light);
          else if(box.kind==='item'&&face.face===1)drawFurnitureDetail(ctx,engine,face,itemById,quality);
          ctx.restore();
        }
      }
      wallTrim(ctx,engine,plan,light);
      fixtures(ctx,engine,plan,light,quality);
      fountainMarker(ctx,engine,app,light);
      roomLabels(ctx,engine,plan,light);
      entranceLabel(ctx,engine,plan,light);
      annotations(ctx,engine,app);
      selectedHighlight(ctx,engine,app,quality);
      if(app.tool==='build'){
        for(const wall of plan.walls)for(let k=0;k<2;k++){
          const point=wall[k?'b':'a'],p=engine.project(point[0],.08,point[1]);if(!p)continue;
          ctx.beginPath();ctx.arc(p.x,p.y,app.selected?.id===wall.id?6.7:4.3,0,TAU);
          ctx.fillStyle='#efbd73';ctx.fill();ctx.strokeStyle='#29534b';ctx.lineWidth=1.5;ctx.stroke();
        }
      }
      if(window.homePlanStudioDrawPerspective) window.homePlanStudioDrawPerspective(ctx,engine);
      vignette(ctx,w,h,light);
      window.homePlanDrawShapePreview?.(engine,app);
      return true;
    }finally{engine.C=null;ctx.restore();}
  }
  return {render,version:'1.0'};
})();
