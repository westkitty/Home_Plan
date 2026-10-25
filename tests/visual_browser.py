"""Home Plan model-first visual regression using actual Chromium Canvas + viewport DOM.

No simulated click on hidden editor controls is treated as a user flow.
Browser uses set_content because local file/HTTP navigation may be restricted.
"""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
PROOF=ROOT.parent/'home-plan-focus-proof'
PROOF.mkdir(exist_ok=True)
HTML=(ROOT/'index.html').read_text()

async def check_width(browser,width,height):
 page=await browser.new_page(viewport={'width':width,'height':height},is_mobile=width<=500,has_touch=width<=500,accept_downloads=True)
 errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
 await page.set_content(HTML,wait_until='domcontentloaded')
 assert await page.locator('#stage canvas').count()==1
 assert not await page.locator('#modal').is_visible(),'Onboarding must not cover the model by default'
 values=await page.evaluate('''()=>({viewport:innerWidth,stage:document.getElementById('stage').getBoundingClientRect().width,canvas:document.querySelector('#stage canvas').getBoundingClientRect().width,focus:!!window.HomePlanFocus,renderer:document.querySelector('#stage canvas').tagName})''')
 assert values['focus'] and values['renderer']=='CANVAS'
 assert abs(values['stage']-width)<2 and abs(values['canvas']-width)<2,values
 for selector in ['#projectPanel','#toolsPanel','#viewControls','#catalogShelf','#inspector','.map-card','.viewport-hud','.floating-actions']:
  assert not await page.locator(selector).is_visible(),f'{selector} must be out of sight in idle mode'
 # Help remains available from the on-demand Tools palette; the modal traps focus.
 await page.locator('#focusTools').click()
 await page.locator('#helpBtn').click()
 assert await page.locator('.shell').evaluate('(e)=>e.inert')
 await page.keyboard.press('Tab')
 assert await page.evaluate('document.activeElement?.id')=='modalClose'
 await page.keyboard.press('Shift+Tab')
 assert await page.evaluate('document.activeElement?.id')=='modalClose'
 await page.locator('#modalClose').click()
 assert not await page.locator('.shell').evaluate('(e)=>e.inert')
 assert await page.evaluate('document.activeElement?.id')=='focusTools','Modal returned focus to a hidden button'
 if width<=760:
  # Project actions remain accessible without a permanently visible header.
  await page.locator('#focusProject').click()
  await page.locator('#saveBtn').click()
  saved=await page.locator('#toast').inner_text()
  assert 'Saved' in saved or 'Local save blocked' in saved,saved
  assert await page.evaluate('document.activeElement?.id')=='focusProject'
  await page.locator('#focusProject').click()
  await page.locator('#openExport').click()
  assert await page.locator('#inspector').evaluate('(e)=>e.classList.contains("mobile-open")')
  await page.locator('#inspector').wait_for(state='visible')
  assert 'Project controls' in await page.locator('#panelHeading').inner_text()
  await page.locator('#closeInspector').click()
  await page.locator('#focusTools').click()
  await page.locator('[data-tool="opening"]').click()
  assert 'openings' in (await page.locator('#sceneModeLabel').text_content()).lower()
  await page.locator('#inspector').wait_for(state='visible')
  await page.locator('#closeInspector').click()
  await page.locator('#focusMove').click()
 await page.locator('#focusViews').click()
 await page.locator('[data-view="orbit"]').click()
 assert await page.evaluate('window.homePlanStudioBridge.getPlan().view.style')=='orbit'
 await page.locator('#focusViews').click()
 await page.locator('[data-view="dollhouse"]').click()
 assert await page.evaluate('window.homePlanStudioBridge.getPlan().view.style')=='dollhouse'
 # Lighting and selection must actually change rendered canvas pixels.
 day=await page.evaluate('document.querySelector("#stage canvas").toDataURL("image/png")')
 await page.evaluate("window.homePlanStudioBridge.transaction(p=>{p.studio.light='night';})")
 night=await page.evaluate('document.querySelector("#stage canvas").toDataURL("image/png")')
 assert day!=night,'Night lighting must change actual model pixels'
 await page.evaluate("window.homePlanStudioBridge.transaction(p=>{p.studio.light='day';})")
 await page.screenshot(path=str(PROOF/f'editor-{width}.png'))
 if width==1440:
  await page.locator('#focusTools').click()
  await page.locator('#railStudio').click()
  await page.locator('[data-studio-tab="views"]').click()
  field=page.locator('[data-studio-setting="labels"]')
  await field.focus();await field.uncheck()
  assert await field.evaluate('(e)=>document.activeElement===e'),'Setting lost keyboard focus'
  await page.locator('#studioClose').click()
  before=await page.evaluate('document.querySelector("#stage canvas").toDataURL("image/png")')
  await page.evaluate("window.homePlanStudioBridge.select('item','i1')")
  after=await page.evaluate('document.querySelector("#stage canvas").toDataURL("image/png")')
  assert before!=after,'Selecting furniture must highlight the model'
  await page.locator('#focusTools').click()
  await page.locator('#railSurvey').click()
  assert await page.locator('#surveyLayer').is_visible()
  await page.locator('#surveyClose').click()
 if width==390:
  await page.locator('#focusTools').click()
  await page.locator('#railSurvey').click()
  assert await page.locator('#surveyLayer').is_visible()
  await page.locator('#surveyQuickBtn').click()
  orders=await page.evaluate('''()=>({display:getComputedStyle(document.querySelector('.survey-main')).display,tools:+getComputedStyle(document.getElementById('surveyStepTools')).order,diagram:+getComputedStyle(document.querySelector('.survey-visual')).order})''')
  assert orders['display']=='flex' and orders['tools']<orders['diagram'],orders
  await page.locator('#surveyClose').click()
 assert not errors,errors
 print('PASS model-first visual viewport',width, 'full-bleed canvas, user pathways, no JS errors')
 await page.close()

async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  for w,h in [(1440,900),(768,900),(390,844),(320,640)]:await check_width(browser,w,h)
  await browser.close()
 print('PASS visual: model-first desktop/mobile, real canvas light + selection, all essential panels recoverable')
if __name__=='__main__':asyncio.run(main())
