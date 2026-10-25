"""Zero-loss progressive-disclosure UI contract for the real Home Plan HTML in Chromium.
Verifies the model owns the viewport, all major features remain accessible, and panels
restore keyboard focus. No private user media is included in test evidence.
"""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'index.html').read_text()
PROOF=ROOT.parent/'home-plan-focus-proof'
PROOF.mkdir(exist_ok=True)
async def test_viewport(browser,w,h):
 p=await browser.new_page(viewport={'width':w,'height':h},is_mobile=w<=500,has_touch=w<=500,accept_downloads=True)
 errors=[];p.on('pageerror',lambda x:errors.append(str(x)))
 await p.set_content(HTML,wait_until='domcontentloaded')
 snap=await p.evaluate('''()=>{let s=document.querySelector('.stage').getBoundingClientRect(),nodes=['focusProject','focusViews','focusMove','focusAdd','focusBuild','focusTools'].map(id=>document.getElementById(id).getBoundingClientRect()),area=nodes.reduce((a,r)=>a+r.width*r.height,0);return{viewport:[innerWidth,innerHeight],stage:[s.width,s.height],controlsFraction:area/(innerWidth*innerHeight),project:document.getElementById('projectPanel').getAttribute('aria-label'),buttons:document.querySelectorAll('[data-tool]').length}}''')
 assert abs(snap['stage'][0]-w)<2 and abs(snap['stage'][1]-h)<2,snap
 assert snap['controlsFraction']<.12,snap
 assert snap['buttons']>=6,snap
 assert not await p.locator('#modal').is_visible()
 # Each panel opens on demand and closes with Escape, focus returned to its trigger.
 for button,panel in [('focusProject','projectPanel'),('focusTools','toolsPanel'),('focusViews','viewControls'),('focusAdd','catalogShelf')]:
  await p.locator('#'+button).click()
  assert await p.locator('#'+button).get_attribute('aria-expanded')=='true'
  await p.locator('#'+panel).wait_for(state='visible')
  await p.keyboard.press('Escape')
  assert await p.locator('#'+button).get_attribute('aria-expanded')=='false'
  assert await p.evaluate('document.activeElement.id')==button,(button,await p.evaluate('document.activeElement.id'))
  await p.locator('#'+panel).wait_for(state='hidden')
 # Camera views and optional visual helpers live in one popover.
 await p.locator('#focusViews').click()
 await p.locator('[data-view="top"]').click()
 assert await p.evaluate('window.homePlanStudioBridge.getPlan().view.style')=='top'
 assert 'Top plan' in await p.locator('#focusViewName').inner_text()
 await p.locator('#focusViews').click()
 await p.locator('#focusMap').click()
 await p.locator('.map-card').wait_for(state='visible')
 assert await p.locator('#focusMap').get_attribute('aria-pressed')=='true'
 await p.locator('#focusViews').click();await p.locator('#focusMap').click()
 await p.locator('.map-card').wait_for(state='hidden')
 await p.locator('#focusViews').click();await p.locator('#focusZoom').click()
 await p.locator('.floating-actions').wait_for(state='visible')
 await p.keyboard.press('Escape');await p.locator('.floating-actions').wait_for(state='hidden')
 await p.locator('#focusViews').click();await p.locator('#focusInfo').click()
 await p.locator('.viewport-hud').wait_for(state='visible')
 await p.keyboard.press('Escape');await p.locator('.viewport-hud').wait_for(state='hidden')
 # All original modes remain reachable by the Tools drawer.
 await p.locator('#focusTools').click()
 assert await p.locator('#toolsPanel [data-tool]').count()==6
 await p.locator('[data-tool="measure"]').click()
 assert 'Tape' in await p.locator('#focusToolsLabel').inner_text()
 await p.locator('#focusBuild').click()
 assert await p.locator('#focusBuild').get_attribute('aria-pressed')=='true'
 await p.locator('#focusTools').click();await p.locator('[data-tool="opening"]').click()
 assert await p.locator('#inspector').evaluate('(e)=>e.classList.contains("mobile-open")')
 await p.locator('#closeInspector').click()
 await p.locator('#focusMove').click()
 # Catalog is real: create object, show tiny contextual chip, edit the real selected data.
 n=await p.evaluate('window.homePlanStudioBridge.getPlan().items.length')
 await p.locator('#focusAdd').click()
 await p.locator('#catalogSearch').wait_for(state='visible')
 await p.locator('#catalogSearch').fill('sofa')
 assert await p.locator('[data-add="sofa"]').count()==1
 await p.locator('[data-add="sofa"]').click()
 assert await p.evaluate('window.homePlanStudioBridge.getPlan().items.length')==n+1
 await p.locator('#catalogShelf').wait_for(state='hidden')
 assert await p.locator('#focusSelection').is_visible()
 await p.locator('#focusEdit').click()
 await p.locator('#inspector').wait_for(state='visible')
 pos=p.locator('#field-x');before=await pos.input_value()
 await pos.fill('3.3');await pos.dispatch_event('change')
 assert abs(float(await p.evaluate('window.homePlanStudioBridge.getPlan().items.at(-1).x'))-3.3)<.001
 await p.locator('#closeInspector').click()
 assert await p.locator('#focusSelection').is_visible()
 await p.locator('#focusDeselect').click()
 assert not await p.locator('#focusSelection').is_visible()
 # Keyboard access to main tools stays compact; no legacy rail needed.
 await p.locator('#stage').focus();await p.keyboard.press('b')
 assert await p.locator('#focusBuild').get_attribute('aria-pressed')=='true'
 await p.locator('#stage').focus();await p.keyboard.press('v')
 assert await p.locator('#focusMove').get_attribute('aria-pressed')=='true'
 await p.locator('#stage').focus();await p.keyboard.press('a')
 await p.locator('#catalogShelf').wait_for(state='visible')
 await p.keyboard.press('Escape');await p.locator('#catalogShelf').wait_for(state='hidden')
 # Project entry points for saving, exporting, advanced design and private survey.
 await p.locator('#focusProject').click()
 await p.locator('#saveBtn').wait_for(state='visible')
 await p.locator('#openExport').wait_for(state='visible')
 await p.locator('#launchStudio').wait_for(state='visible')
 await p.locator('#launchSurvey').wait_for(state='visible')
 await p.locator('#launchStudio').click()
 assert await p.locator('#studioLayer').is_visible()
 await p.locator('#studioClose').click()
 assert await p.evaluate('document.activeElement.id')=='focusProject'
 await p.locator('#focusProject').click();await p.locator('#launchSurvey').click()
 assert await p.locator('#surveyLayer').is_visible()
 await p.locator('#surveyClose').click()
 assert await p.evaluate('document.activeElement.id')=='focusProject'
 await p.locator('#focusProject').click();await p.locator('#openExport').click()
 await p.locator('#inspector').wait_for(state='visible')
 assert 'Project controls' in await p.locator('#panelHeading').inner_text()
 await p.locator('#closeInspector').click()
 await p.locator('#inspector').wait_for(state='hidden')
 # Everything collapses to the full-bleed model, not the old dashboard.
 for selector in ['#projectPanel','#toolsPanel','#catalogShelf','#viewControls','#inspector','.map-card','.floating-actions','.viewport-hud']:
  await p.locator(selector).wait_for(state='hidden')
 assert not errors,errors
 if w in [1440,390]:await p.screenshot(path=str(PROOF/f'compact-{w}.png'))
 print('PASS model-first feature discovery',w,'controls footprint:',round(snap['controlsFraction']*100,2),'%')
 await p.close()
async def main():
 async with async_playwright() as pw:
  b=await pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  for w,h in [(1440,900),(768,900),(390,844),(320,640)]:await test_viewport(b,w,h)
  await b.close()
 print('PASS model-first UX: default visibility, controls, selection, precise edits, full feature discovery, focus and mobile')
if __name__=='__main__':asyncio.run(main())
