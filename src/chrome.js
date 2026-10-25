'use strict';
/* Responsive task toolbar and modal keyboard safety. Existing commands remain the only action owners. */
(()=>{
 const toggle=document.getElementById('mobileActionsToggle');
 const menu=document.getElementById('mobileActions');
 if(!toggle||!menu)return;
 function close(){menu.hidden=true;toggle.setAttribute('aria-expanded','false');}
 toggle.addEventListener('click',()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden));if(!menu.hidden)menu.querySelector('button')?.focus({preventScroll:true});});
 menu.addEventListener('click',event=>{
  const btn=event.target.closest('[data-mobile-command]');if(!btn)return;
  const target=document.getElementById(btn.dataset.mobileCommand);
  close();target?.click();
  // A hidden menu item must never retain focus after activation. Keep focus at
  // the destination when one opens, otherwise return it to the Actions trigger.
  const modalOpen=!document.getElementById('modal').hidden;
  const studioOpen=!document.getElementById('studioLayer').hidden;
  const surveyOpen=!document.getElementById('surveyLayer').hidden;
  if(!modalOpen&&!studioOpen&&!surveyOpen){
   const inspector=document.getElementById('inspector');
   const destination=inspector.classList.contains('mobile-open')?document.getElementById('closeInspector'):toggle;
   destination.focus({preventScroll:true});
  }
 });
 document.addEventListener('pointerdown',e=>{if(!menu.hidden&&!menu.contains(e.target)&&!toggle.contains(e.target))close();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){e.preventDefault();close();toggle.focus();}});
})();
