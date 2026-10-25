'use strict';
/* Home Plan: model-first control surfaces. All editing actions delegate to their existing owners. */
(()=>{
 const byId=id=>document.getElementById(id);
 const shell=document.querySelector('.shell');
 const bridge=window.homePlanStudioBridge;
 if(!shell||!bridge)return;
 const panels={project:{name:'project-open',trigger:'focusProject',surface:'projectPanel',first:'projectName'},tools:{name:'tools-open',trigger:'focusTools',surface:'toolsPanel',first:null},views:{name:'views-open',trigger:'focusViews',surface:'viewControls',first:null},architecture:{name:'architecture-open',trigger:'focusBuild',surface:'architecturePalette',first:null},catalog:{name:'catalog-open',trigger:'focusAdd',surface:'catalogShelf',first:'catalogSearch'}};
 const panelKeys=Object.keys(panels);
 let opened=null;
 function isVisible(el){return !!el&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden';}
 function updateExpanded(){for(const [key,p] of Object.entries(panels)){const open=shell.classList.contains(p.name);byId(p.trigger)?.setAttribute('aria-expanded',String(open));}}
 function closeFloating(restore=false){const was=opened,active=document.activeElement;for(const p of Object.values(panels))shell.classList.remove(p.name);opened=null;updateExpanded();if(restore&&was){const p=panels[was];const surface=byId(p.surface);if(surface?.contains(active)||!isVisible(active))byId(p.trigger)?.focus({preventScroll:true});}}
 function toggle(key){const same=shell.classList.contains(panels[key].name);closeFloating();if(same){byId(panels[key].trigger)?.focus({preventScroll:true});return;}const p=panels[key];shell.classList.add(p.name);opened=key;updateExpanded();const first=p.first?byId(p.first):byId(p.surface)?.querySelector('button.active, button');if(isVisible(first))first.focus({preventScroll:true});}
 function closeInspector(){if(byId('inspector').classList.contains('mobile-open'))byId('closeInspector')?.click();}
 function openInspector(){closeFloating();byId('mobileInspectorBtn')?.click();const close=byId('closeInspector');if(isVisible(close))close.focus({preventScroll:true});sync();}
 function visibleMode(){return document.querySelector('#toolsPanel [data-tool].active')?.dataset.tool||'furnish';}
 function sync(){
  const tool=visibleMode();const advanced={navigate:'Explore',opening:'Openings',measure:'Tape',annotate:'Notes'};byId('focusToolsLabel').textContent=advanced[tool]||'Tools';byId('focusTools').classList.toggle('is-active',!!advanced[tool]);for(const id of ['focusMove','focusBuild']){const active=tool===(id==='focusMove'?'furnish':'build');byId(id)?.classList.toggle('is-active',active);byId(id)?.setAttribute('aria-pressed',String(active));}
  const style=bridge.getPlan()?.view?.style||'dollhouse';const viewLabel={dollhouse:'Dollhouse',orbit:'3D orbit',top:'Top plan',realworld:'Real world',walk:'Walkthrough'}[style]||'Views';if(byId('focusViewName'))byId('focusViewName').textContent=viewLabel;
  const selected=bridge.getSelection();const chip=byId('focusSelection');chip.hidden=!selected;
  if(selected){const label=(byId('selectionLabel').textContent||'Selected item').replace(/ · drag or edit measurements$/,'');byId('focusSelectionName').textContent=label||'Selected object';}
  const open=byId('inspector').classList.contains('mobile-open');byId('focusEdit')?.setAttribute('aria-expanded',String(open));
  for(const [id,cls,open,closed] of [['focusMap','map-open','▦ Hide floor map','▦ Show floor map'],['focusZoom','zoom-open','− Hide zoom controls','＋ Show zoom controls'],['focusInfo','info-open','ⓘ Hide model guide','ⓘ About this model']]){const el=byId(id),on=shell.classList.contains(cls);el.setAttribute('aria-pressed',String(on));const label=el.querySelector('.hp-view-label');if(label)label.textContent=on?open:closed;else el.textContent=on?open:closed;}
 }
 function mode(tool){closeFloating();closeInspector();bridge.setTool(tool);sync();}
 byId('focusProject').addEventListener('click',()=>toggle('project'));
 byId('focusViews').addEventListener('click',()=>toggle('views'));
 byId('focusTools').addEventListener('click',()=>toggle('tools'));
 byId('focusAdd').addEventListener('click',()=>{if(shell.classList.contains('catalog-open')){closeFloating(true);return;}closeInspector();bridge.setTool('furnish');toggle('catalog');sync();});
 byId('focusMove').addEventListener('click',()=>mode('furnish'));
 byId('focusBuild').addEventListener('click',()=>{mode('build');toggle('architecture');});
 byId('focusEdit').addEventListener('click',openInspector);
 byId('focusDeselect').addEventListener('click',()=>{bridge.clearSelect?.();closeInspector();sync();byId('focusMove').focus({preventScroll:true});});
 byId('focusFit').addEventListener('click',()=>{byId('fitBtn').click();closeFloating(true);});
 for(const [id,cls] of [['focusMap','map-open'],['focusZoom','zoom-open'],['focusInfo','info-open']])byId(id).addEventListener('click',()=>{shell.classList.toggle(cls);sync();closeFloating(true);});
 byId('focusDetails').addEventListener('click',openInspector);
 byId('toolsPanel').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.tool){const tool=b.dataset.tool;closeFloating();if(tool==='opening')openInspector();sync();byId('focusTools').focus({preventScroll:true});return;}
  if(b.id==='helpBtn'||b.id==='railStudio'||b.id==='railSurvey'){closeFloating();sync();}
 });
 byId('viewControls').addEventListener('click',e=>{if(e.target.closest('[data-view]')){closeFloating();sync();byId('focusViews').focus({preventScroll:true});}});
 byId('catalogShelf').addEventListener('click',e=>{if(e.target.closest('[data-add]')){closeFloating();sync();byId('focusAdd').focus({preventScroll:true});}});
 // Legacy commands remain direct owners of save/export, studio and survey behavior.
 byId('projectPanel').addEventListener('click',e=>{
  const command=e.target.closest('button');if(!command)return;
  if(['launchSurvey','launchStudio','openExport','saveBtn','undoBtn','redoBtn'].includes(command.id)){
   closeFloating();sync();
   if(!['launchStudio','launchSurvey','openExport'].includes(command.id))byId('focusProject').focus({preventScroll:true});
  }
 });
 document.addEventListener('pointerdown',e=>{
  if(!opened||anyModal())return;const p=panels[opened];
  if(!byId(p.surface)?.contains(e.target)&&!byId(p.trigger)?.contains(e.target)){closeFloating();}
 },true);
 function anyModal(){return !!byId('hpContextHelp')?.open||!byId('modal').hidden||!byId('studioLayer').hidden||!byId('surveyLayer').hidden||!byId('surveyPreview').hidden;}
 document.addEventListener('keydown',e=>{
  if(anyModal())return;
  if(e.key==='Escape'){
   if(opened){e.preventDefault();e.stopImmediatePropagation();closeFloating(true);return;}
   if(byId('inspector').classList.contains('mobile-open')){e.preventDefault();e.stopImmediatePropagation();closeInspector();byId('focusTools').focus({preventScroll:true});return;}
   if(shell.classList.contains('map-open')||shell.classList.contains('zoom-open')||shell.classList.contains('info-open')){e.preventDefault();for(const c of ['map-open','zoom-open','info-open'])shell.classList.remove(c);sync();return;}
   return;
  }
  if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest('input,textarea,select,button,[contenteditable]'))return;
  const key=e.key.toLowerCase();if(key==='v'||key==='b'||key==='a'){
   e.preventDefault();if(key==='v')mode('furnish');if(key==='b')mode('build');if(key==='a'){if(!shell.classList.contains('catalog-open')){bridge.setTool('furnish');toggle('catalog');sync();}}}
 },true);
 // Prevent stale focus pointing to a hidden dismissable drawer.
 byId('closeInspector').addEventListener('click',()=>{if(document.activeElement===byId('closeInspector'))byId('focusTools').focus({preventScroll:true});sync();});
 window.HomePlanFocus={sync,closeFloating};
 sync();
})();
