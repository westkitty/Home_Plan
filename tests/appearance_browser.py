"""Background appearance integration: default, settings, full-spectrum changes, persistence, help and canvas pixels."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'index.html').read_text()
PROOF=ROOT.parent/'home-plan-background-proof'
PROOF.mkdir(exist_ok=True)
async def sample(page):
 return await page.evaluate('''() => { const c=document.querySelector('#stage canvas'),p=c.getContext('2d').getImageData(12,18,1,1).data;return [...p].slice(0,3); }''')
async def test(browser,width,height):
 page=await browser.new_page(viewport={'width':width,'height':height},is_mobile=width<=500,has_touch=width<=500)
 errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
 await page.evaluate('''() => {const values=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)}});}''')
 await page.set_content(HTML,wait_until='domcontentloaded')
 assert await page.evaluate('HomePlanAppearance.getColor()')=='#103B4A'
 assert await page.locator('#sceneBackgroundReset').is_disabled()
 assert not await page.locator('#appearanceSettings').evaluate('(el)=>el.open')
 plan=await page.evaluate('JSON.stringify(homePlanStudioBridge.getPlan())')
 original=await sample(page)
 if width in (1440,390):await page.screenshot(path=str(PROOF/f'baby-blue-{width}.png'))
 await page.locator('#focusProject').click()
 await page.locator('#appearanceToggle').click()
 assert await page.locator('#sceneBackgroundColor').is_visible()
 assert await page.locator('#appearanceSettings [data-help="appearance"]').is_visible()
 await page.locator('#appearanceSettings [data-help="appearance"]').click()
 assert await page.locator('#hpContextTitle').inner_text()=='Appearance settings'
 await page.locator('#hpContextDone').click()
 assert not await page.locator('#hpContextHelp').is_visible()
 assert await page.locator('#appearanceSettings').evaluate('(el)=>el.open')
 picker=page.locator('#sceneBackgroundColor')
 await picker.fill('#e030f0')
 await page.wait_for_timeout(70)
 assert await page.evaluate('HomePlanAppearance.getColor()')=='#E030F0'
 assert await page.evaluate('localStorage.getItem(HomePlanAppearance.STORAGE_KEY)')=='#E030F0'
 assert await page.locator('#sceneBackgroundValue').inner_text()=='#E030F0'
 updated=await sample(page)
 assert sum(abs(a-b) for a,b in zip(original,updated))>75,(original,updated)
 assert updated[0]>original[0]-30 and updated[2]>updated[1],(original,updated)
 assert await page.evaluate('JSON.stringify(homePlanStudioBridge.getPlan())')==plan
 if width in (1440,390):await page.screenshot(path=str(PROOF/f'picker-{width}.png'))
 for candidate in ['#000000','#ffffff','#23c970']:
  await picker.fill(candidate)
  await page.wait_for_timeout(35)
  assert await page.evaluate('HomePlanAppearance.getColor()')==candidate.upper()
 assert await page.evaluate('JSON.stringify(homePlanStudioBridge.getPlan())')==plan
 await page.locator('#sceneBackgroundReset').click()
 await page.wait_for_timeout(40)
 assert await page.evaluate('HomePlanAppearance.getColor()')=='#103B4A'
 assert await page.evaluate('localStorage.getItem(HomePlanAppearance.STORAGE_KEY)') is None
 assert await page.locator('#sceneBackgroundReset').is_disabled()
 await picker.fill('#3355cc')
 await page.wait_for_timeout(30)
 await page.locator('#focusProject').click()
 await page.locator('#projectPanel').wait_for(state='hidden')
 stored=await page.evaluate('localStorage.getItem(HomePlanAppearance.STORAGE_KEY)')
 await page.close()
 page=await browser.new_page(viewport={'width':width,'height':height},is_mobile=width<=500,has_touch=width<=500)
 page.on('pageerror',lambda error:errors.append(str(error)))
 await page.evaluate('''(seed) => {const values=new Map([['homeplan-scene-background-v1',seed]]);Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)}});}''',stored)
 await page.set_content(HTML,wait_until='domcontentloaded')
 assert await page.evaluate('HomePlanAppearance.getColor()')=='#3355CC'
 assert await page.locator('#sceneBackgroundColor').input_value()=='#3355cc'
 assert await page.evaluate('getComputedStyle(document.querySelector(".stage")).backgroundColor')=='rgb(51, 85, 204)'
 await page.close()
 page=await browser.new_page(viewport={'width':width,'height':height},is_mobile=width<=500,has_touch=width<=500)
 page.on('pageerror',lambda error:errors.append(str(error)))
 await page.evaluate('''() => {const values=new Map([['homeplan-scene-background-v1','javascript:alert(1)']]);Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)}});}''')
 await page.set_content(HTML,wait_until='domcontentloaded')
 assert await page.evaluate('HomePlanAppearance.getColor()')=='#103B4A'
 assert not errors,errors
 print('PASS appearance browser',width,original,updated)
 await page.close()
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  for w,h in [(1440,900),(390,844),(320,640)]:await test(browser,w,h)
  await browser.close()
if __name__=='__main__':asyncio.run(main())
