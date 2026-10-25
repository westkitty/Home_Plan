'use strict';
/* Contextual, dependency-free icon affordances for the Home Plan editor. */
(()=>{
 const d=document, $=id=>d.getElementById(id);
 const shapes={
  select:'<path d="m5 3 13 9-7 1-2 7-4-17Z"/>',
  add:'<path d="M12 5v14M5 12h14"/>',
  window:'<path d="M4 4h16v16H4zM12 4v16M4 12h16"/>',
  outlet:'<rect x="5" y="3" width="14" height="18" rx="3"/><path d="M9 8v4m6-4v4m-6 4h6"/>',
  passage:'<path d="M4 21V3h16v18M8 21V9h8v12"/>',
  paint:'<path d="m4 3 10 10M2 5l5-3 9 9-5 5-9-9V5ZM14 15l6 6M4 21h7"/>',
  draw:'<path d="M4 4h16v4H4zM4 8v12h4V8m12 0v12h-4V8"/>',
  wall:'<path d="M3 19V5h18v14M3 11h18M9 5v6m6 0v8M3 16h12"/>',
  tools:'<path d="m4 20 8-8M14 5a5 5 0 0 0 6 6l-7 7-7-7 7-7Z"/>',
  house:'<path d="m3 11 9-8 9 8v10H3V11Zm6 10v-7h6v7"/>',
  view:'<path d="m2 12 10-7 10 7-10 7-10-7ZM2 12v5l10 6 10-6v-5"/>',
  plan:'<path d="M4 4h16v16H4zM4 12h9M13 4v12M13 16h7"/>',
  orbit:'<circle cx="12" cy="12" r="4"/><path d="M3 11C5 3 19 2 22 9M21 13c-2 8-15 9-19 1M18 5l4 4-5 1M6 19l-4-5 5-1"/>',
  ruler:'<rect x="3" y="8" width="18" height="8" rx="1"/><path d="M7 8v4M11 8v3M15 8v4M19 8v3"/>',
  note:'<path d="M5 3h14v18H5zM8 8h8M8 12h8M8 16h5"/>',
  door:'<path d="M5 21V3h14v18M9 21V7h6v14M13 13h.01"/>',
  bulb:'<path d="M9 18h6m-5 3h4M8 14a7 7 0 1 1 8 0l-1 3H9l-1-3Z"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  star:'<path d="m12 2 3.1 6.5 7.2 1-5.2 5.1 1.2 7.2L12 18.4 5.7 21.8l1.2-7.2L1.7 9.5l7.2-1L12 2Z"/>',
  sofa:'<path d="M4 11V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3M4 12h16v7H4zM2 11h2m16 0h2M6 19v2m12-2v2"/>',
  bed:'<path d="M3 19V9m18 10V9M3 14h18v5H3zM6 14V8h5v6m2 0V8h5v6"/>',
  kitchen:'<path d="M4 4h16v16H4zM4 10h16M9 15h.01M15 15h.01M8 7h8"/>',
  bath:'<path d="M3 12h18v4a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-4ZM6 12V6a3 3 0 0 1 6 0M5 3h5"/>',
  storage:'<path d="M4 3h16v18H4zM4 12h16M10 7h4m-4 9h4"/>',
  marker:'<path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0ZM12 10h.01"/>',
  folder:'<path d="M3 6h7l2 3h9v12H3V6Z"/>',
  save:'<path d="M4 3h14l3 3v15H4V3Zm3 0v7h10V3M7 21v-8h10v8"/>',
  export:'<path d="M14 3h7v7M21 3l-9 9M20 13v8H3V4h8"/>',
  undo:'<path d="M9 6 3 12l6 6M3 12h11a7 7 0 0 1 7 7"/>',
  redo:'<path d="m15 6 6 6-6 6M21 12H10a7 7 0 0 0-7 7"/>',
  scan:'<path d="M4 9V4h5m6 0h5v5M4 15v5h5m6 0h5v-5M8 12h8m-4-4v8"/>',
  sliders:'<path d="M4 7h16M4 17h16M9 3v8m6 2v8"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 5 2.2c-1.3 1-2 1.6-2 3M12 18h.01"/>',
  fit:'<path d="M4 9V4h5m6 0h5v5M4 15v5h5m6 0h5v-5"/>',
  map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15M15 6v15"/>',
  zoom:'<circle cx="10" cy="10" r="6"/><path d="M10 7v6m-3-3h6m2 5 6 6"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 10v7M12 7h.01"/>',
  hand:'<path d="M6 12V8a2 2 0 0 1 4 0V5a2 2 0 0 1 4 0v2a2 2 0 0 1 4 0v7a4 4 0 0 1-4 7h-3a6 6 0 0 1-5-3l-3-4a2 2 0 0 1 3-2Z"/>',
  grid:'<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>'
 };
 const svg=name=>`<svg class="hp-icon" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[name]||shapes.info}</svg>`;
 const definitions={
  focusProject:['house','Project','Save, export, undo, survey or open Design Lab.'],
  focusViews:['view','Camera views','Switch between dollhouse, orbit and floor plan; adjust the visible guides.'],
  focusMove:['select','Move · V','Select an object in the model and drag to reposition it.'],
  focusAdd:['add','Add · A','Browse furniture by category and place it in the apartment.'],
  focusBuild:['wall','Build · B','Select a wall, adjust its endpoints, or draw new walls.'],
  focusTools:['tools','More tools','Measure, annotate, add openings, navigate and access advanced workspaces.'],
  focusEdit:['sliders','Edit selected object','Open the inspector for measurements, placement and properties.'],
  focusDeselect:['select','Deselect','Clear the active selection.'],
  focusFit:['fit','Fit apartment','Center and fit the whole model inside the viewport.'],
  focusMap:['map','Floor map','Show or hide the overhead room mini-map.'],
  focusZoom:['zoom','Zoom controls','Show or hide zoom buttons.'],
  focusInfo:['info','Model information','Show provisional geometry and model context.'],
  undoBtn:['undo','Undo · Ctrl+Z','Undo your most recent edit.'],
  redoBtn:['redo','Redo · Ctrl+Shift+Z','Redo an undone edit.'],
  saveBtn:['save','Save locally','Save this arrangement in your browser.'],
  openExport:['export','Project and export','Manage layouts and export or import files.'],
  launchStudio:['sliders','Design Lab','Inspect room dimensions, finishes, diagnostics and budget.'],
  launchSurvey:['scan','Survey apartment','Gather guided measurements, photos and video evidence privately.'],
  railStudio:['sliders','Design Lab','Open advanced design and measurement tools.'],
  railSurvey:['scan','Survey Studio','Capture a guided apartment survey.'],
  helpBtn:['help','Controls help','Open the full control reference.'],
  focusDetails:['sliders','Inspector','Inspect the currently selected object.'],
  catalogFavorites:['star','Favorites','Show or hide saved favorite furniture types.'],
  zoomIn:['zoom','Zoom in','Move the camera closer to the model.'],
  fitBtn:['fit','Fit model','Fit the apartment to the available viewport.'],
  mobileInspectorBtn:['sliders','Inspector','Open editing controls.'],
  sceneBackgroundReset:['undo','Reset background','Restore the default baby-blue scene color.']
 };
 const toolDefs={furnish:['sofa','Furniture','Select, move and arrange furniture.'],build:['wall','Walls','Edit or draw walls; change their endpoints.'],navigate:['orbit','Explore','Drag empty space to orbit; pan and zoom.'],measure:['ruler','Measure','Tap two model positions to measure their distance.'],annotate:['note','Notes','Tap the floor to leave a note.'],opening:['door','Openings','Choose a door, window, outlet or passage, then tap a wall.']};
 const categoryDefs={All:['grid','All furniture'],Favorites:['star','Favorite furniture'],Living:['sofa','Living room'],Storage:['storage','Storage'],Bedroom:['bed','Bedroom'],Kitchen:['kitchen','Kitchen'],Bathroom:['bath','Bathroom'],Markers:['marker','Markers and fixtures']};
 const viewDefs={dollhouse:['house','Dollhouse view'],orbit:['orbit','3D orbit view'],top:['plan','Top floor plan']};
 function decorate(el,entry,kind){if(!el||!entry)return;const [ico,label,detail]=entry;el.setAttribute('aria-label',label);el.dataset.tooltip=detail?`${label} — ${detail}`:label;el.removeAttribute('title');el.dataset.iconName=ico;const existing=el.querySelector('.focus-icon,.symbol');if(existing){existing.innerHTML=svg(ico);}else if(kind==='compact'){
   if(!el.dataset.originalLabel)el.dataset.originalLabel=el.textContent.trim();
   const symbol=d.createElement('span');symbol.className='hp-command-icon';symbol.innerHTML=svg(ico);el.prepend(symbol);el.classList.add('hp-iconified');
 }else if(kind==='prepend'&&!el.querySelector(':scope > .hp-command-icon')){const symbol=d.createElement('span');symbol.className='hp-command-icon';symbol.innerHTML=svg(ico);el.prepend(symbol);}
 }
 function decorateStatic(){
  for(const [id,entry] of Object.entries(definitions)){
   const el=$(id);if(!el)continue;
   const kind=['focusProject','focusViews','focusMove','focusAdd','focusBuild','focusTools','focusEdit','focusDeselect','undoBtn','redoBtn','saveBtn','openExport','launchStudio','launchSurvey','catalogFavorites'].includes(id)?'compact':id==='focusFit'||id==='focusMap'||id==='focusZoom'||id==='focusInfo'?'prepend':null;
   decorate(el,entry,kind);
  }
  decorate($('appearanceToggle'),['sliders','Appearance settings','Choose the color behind the apartment model.'],'prepend');
  decorate($('sceneBackgroundReset'),definitions.sceneBackgroundReset,'prepend');
  d.querySelectorAll('#toolsPanel [data-tool]').forEach(el=>decorate(el,toolDefs[el.dataset.tool],'prepend'));
  d.querySelectorAll('#viewControls [data-view]').forEach(el=>decorate(el,viewDefs[el.dataset.view],'prepend'));
  const ins={edit:['sliders','Edit selected'],space:['plan','Space and rooms'],project:['folder','Project exports']};
  d.querySelectorAll('.ins-tabs [data-tab]').forEach(el=>decorate(el,ins[el.dataset.tab],'prepend'));
  const studio={insights:['info','Insights'],layout:['plan','Layout'],finishes:['grid','Finishes'],views:['view','Views'],budget:['ruler','Budget']};
  d.querySelectorAll('.studio-tabs [data-studio-tab]').forEach(el=>decorate(el,studio[el.dataset.studioTab],'prepend'));
 }
 const observer=new MutationObserver(records=>{
  if(records.some(r=>r.target?.closest?.('#categories'))){d.querySelectorAll('#categories [data-category]').forEach(el=>decorate(el,categoryDefs[el.dataset.category],'compact'));}
 });
 const categories=$('categories');if(categories){observer.observe(categories,{childList:true,subtree:false});d.querySelectorAll('#categories [data-category]').forEach(el=>decorate(el,categoryDefs[el.dataset.category],'compact'));}
 decorateStatic();
 // Sims-style two-level architecture palette; the model remains visible underneath.
 const architecture=[['walls','wall','Walls','Select a wall and drag its endpoints or body.'],['draw','draw','Draw wall','Tap two floor points to create a wall.'],['door','door','Door','Place a provisional door on a wall.'],['window','window','Window','Place a provisional window on a wall.'],['outlet','outlet','Outlet','Mark a provisional electrical outlet.'],['opening','passage','Open passage','Make an open passage through a wall.'],['entry','house','Entry door','Mark the entrance doorway.'],['finishes','paint','Finishes','Open finishes and materials in Design Lab.']];
 const arch=$('architecturePalette');
 if(arch){for(const [id,ico,label,detail] of architecture){const b=d.createElement('button');b.type='button';b.dataset.buildAction=id;b.className='hp-architecture-tool';b.setAttribute('aria-label',label);b.dataset.tooltip=label+' — '+detail;b.innerHTML=svg(ico);arch.append(b);}
 arch.addEventListener('click',e=>{const b=e.target.closest('[data-build-action]');if(!b)return;const action=b.dataset.buildAction,bridge=window.homePlanStudioBridge;
  window.HomePlanFocus?.closeFloating?.(true);
  if(action==='walls')bridge.setTool('build');else if(action==='draw')bridge.startWall?.();else if(action==='finishes'){$('launchStudio')?.click();d.querySelector('[data-studio-tab=finishes]')?.click();}
  else bridge.setFixtureKind?.(action);
  window.HomePlanFocus?.sync?.();
 });}
 // Feature descriptions are available without mouse hover, and do not interrupt work automatically.
 const help={
  project:['Project & files','Save keeps this layout on this device. Export creates files you can keep elsewhere. Undo and Redo step through editing changes. Settings lets you choose the background color behind the model. Design Lab contains measurements and finishes; Survey Studio guides evidence capture.','Your project is local-first. Export a JSON backup before changing devices; evidence photos and videos are not included in a public project export.'],
  appearance:['Appearance settings','Choose any scene background color with the color picker. The change appears immediately and is remembered on this device. Reset returns to the default baby blue.','This changes only the space behind the model, not furniture, floors, wall finishes, measurements, or exported project geometry.'],
  architecture:['Build architecture','Walls lets you edit and move existing wall segments. Draw Wall adds a new segment using two floor taps. Door, Window, Outlet, Passage, and Entry prepare the matching opening tool; tap a wall to place it. Finishes opens Design Lab materials.','Geometry is provisional. Doors, windows and outlets are not considered physically confirmed until measured or surveyed.'],
  tools:['Editing tools','Move furniture to rearrange rooms. Build edits structural wall lines. Explore rotates the camera. Tape measures two points. Notes adds floor annotations. Openings places wall-attached doors, windows, outlets or passages.','Select the icon for a tool, then interact directly with the model. Keyboard: V moves, B builds, A opens the catalog. Esc dismisses a menu.'],
  views:['View the apartment','Dollhouse shows the interior in perspective. Orbit is for exploring from other angles. Top Plan is best for alignment and positioning. Fit centers the apartment; Map and Zoom are optional overlays.','Switching views does not change furniture positions or wall geometry.'],
  catalog:['Furniture catalog','Choose a room category by icon, then select an object card to add that item. The star saves a favorite. The magnifying-glass search narrows results.','Objects are added to the editable plan. Select the new object to adjust position, rotation, dimensions or room assignment.'],
  inspector:['Object inspector','Edit adjusts a selected object or wall. Space contains room-level information. Project provides layout operations and exports.','Measurements are provisional. Check the real apartment before purchasing items or making physical changes.'],
  studio:['Design Lab','Insights reviews the plan. Layout handles geometry and placement analysis. Finishes explores materials. Views controls presentation. Budget estimates costs.','Changes to the editable model remain distinct from your original survey evidence. Finish returns you to the apartment.'],
  survey:['Survey Studio','Follow the room route, collect useful photos or videos, and record real measurements with a source. The capture and review tools help distinguish confirmed facts from provisional geometry.','Survey media remains private on the device unless you explicitly export or share a ZIP. A photograph alone does not certify dimensions.']
 };
 const mounts=[['project','projectPanel','.header .header-end'],['appearance','appearanceSettings','.hp-appearance-head'],['tools','toolsPanel',null],['architecture','architecturePalette',null],['views','viewControls',null],['catalog','catalogShelf','.shelf-top'],['inspector','inspector','.ins-head'],['studio','studioLayer','.studio-head'],['survey','surveyLayer','.survey-header-actions']];
 for(const [key,id,target] of mounts){const host=target?d.querySelector(target):$(id);if(!host)continue;const b=d.createElement('button');b.type='button';b.className='hp-help-trigger';b.dataset.help=key;b.setAttribute('aria-label',`Help with ${help[key][0]}`);b.dataset.tooltip=`Help with ${help[key][0]}`;b.innerHTML=svg('help');host.append(b);}
 const dlg=d.createElement('dialog');dlg.id='hpContextHelp';dlg.className='hp-context-dialog';dlg.setAttribute('aria-labelledby','hpContextTitle');dlg.innerHTML=`<div class="hp-help-head"><span class="hp-help-kicker">HOME PLAN / GUIDE</span><button type="button" id="hpContextClose" aria-label="Close guide" title="Close guide">×</button></div><h2 id="hpContextTitle"></h2><p id="hpContextBody"></p><p class="hp-help-note" id="hpContextNote"></p><div class="hp-help-actions"><button type="button" id="hpContextDone">Back to apartment</button></div>`;d.body.append(dlg);
 let returnFocus=null;
 d.addEventListener('click',e=>{const trigger=e.target.closest('[data-help]');if(!trigger)return;e.preventDefault();const item=help[trigger.dataset.help];if(!item)return;returnFocus=trigger;$('hpContextTitle').textContent=item[0];$('hpContextBody').textContent=item[1];$('hpContextNote').textContent=item[2];dlg.showModal();$('hpContextClose').focus();});
 const close=()=>dlg.close();$('hpContextClose').addEventListener('click',close);$('hpContextDone').addEventListener('click',close);dlg.addEventListener('click',e=>{if(e.target===dlg)close()});dlg.addEventListener('close',()=>{const target=returnFocus;returnFocus=null;if(target?.isConnected&&target.getClientRects().length)target.focus({preventScroll:true});});
 const tooltip=d.createElement('div');tooltip.id='hpTooltip';tooltip.className='hp-tooltip';tooltip.role='tooltip';tooltip.hidden=true;d.body.append(tooltip);
 let hovered=null,reason='',pointerSuppressFocus=false;
 function getTarget(node){return node?.closest?.('button,[role="button"],input,select,textarea,[data-tooltip]')||null;}
 function labelFor(target){if(!target)return'';return target.dataset.tooltip||target.dataset.nativeTitle||target.title||target.getAttribute('aria-label')||target.getAttribute('placeholder')||(target.tagName==='BUTTON'?target.textContent.trim().replace(/\s+/g,' ').slice(0,90):'');}
 function hideTip(){if(hovered?.dataset.hpTooltipDescribed==='yes'){hovered.removeAttribute('aria-describedby');delete hovered.dataset.hpTooltipDescribed;}tooltip.hidden=true;hovered=null;}
 function display(target,origin){if(dlg.open||!target||target.disabled||target.closest('[hidden], [inert]')){hideTip();return;}const label=labelFor(target);if(target.title&&!target.dataset.nativeTitle){target.dataset.nativeTitle=target.title;target.removeAttribute('title');}if(!label){hideTip();return;}if(hovered&&hovered!==target&&hovered.dataset.hpTooltipDescribed==='yes'){hovered.removeAttribute('aria-describedby');delete hovered.dataset.hpTooltipDescribed;}hovered=target;reason=origin;if(!target.hasAttribute('aria-describedby')){target.setAttribute('aria-describedby','hpTooltip');target.dataset.hpTooltipDescribed='yes';}tooltip.textContent=label;tooltip.hidden=false;const box=target.getBoundingClientRect(),tw=tooltip.offsetWidth,th=tooltip.offsetHeight;let top=box.bottom+9;if(top+th>innerHeight-8)top=box.top-th-9;const left=Math.max(8,Math.min(innerWidth-tw-8,box.left+box.width/2-tw/2));tooltip.style.left=left+'px';tooltip.style.top=Math.max(8,top)+'px';}
 d.addEventListener('pointerover',e=>{if(e.pointerType==='touch')return;pointerSuppressFocus=false;const target=getTarget(e.target);if(target&&target!==hovered)display(target,'pointer');});
 d.addEventListener('pointerout',e=>{if(reason==='pointer'&&hovered&&hovered.contains(e.target)&&!hovered.contains(e.relatedTarget))hideTip();});
 d.addEventListener('focusin',e=>{if(pointerSuppressFocus)return;const target=getTarget(e.target);if(target)display(target,'focus');else hideTip();});
 d.addEventListener('focusout',e=>{if(reason==='focus'&&hovered?.contains(e.target))hideTip();});
 d.addEventListener('pointerdown',()=>{pointerSuppressFocus=true;hideTip();},true);d.addEventListener('scroll',hideTip,true);d.addEventListener('keydown',e=>{pointerSuppressFocus=false;if(e.key==='Escape')hideTip();},true);
 addEventListener('resize',hideTip,{passive:true});
 window.HomePlanIconUI={decorateStatic,showHelp:key=>{const b=d.querySelector(`[data-help="${key}"]`);b?.click()},helpCategories:Object.keys(help)};
})();
