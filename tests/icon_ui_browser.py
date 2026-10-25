"""Architectural icon UI: compact navigation, hover/focus descriptions and contextual menu guides."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'index.html').read_text()
async def test(browser,width,height):
 page=await browser.new_page(viewport={'width':width,'height':height},has_touch=width<=500,is_mobile=width<=500)
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 await page.set_content(HTML,wait_until='domcontentloaded')
 # All visible primary controls are image-led, accessible, and remain fully keyboard reachable.
 for name in ['focusProject','focusViews','focusMove','focusAdd','focusBuild','focusTools']:
  button=page.locator('#'+name)
  assert await button.locator('svg.hp-icon').count()==1,name
  assert await button.get_attribute('aria-label'),name
  assert await button.get_attribute('data-tooltip'),name
 # Give pointer/focus an explanatory tooltip without forcing a menu open.
 await page.locator('#focusMove').focus()
 tooltip=page.locator('#hpTooltip')
 assert await tooltip.is_visible()
 assert 'Select an object' in await tooltip.inner_text()
 await page.locator('#stage').focus()
 assert not await tooltip.is_visible()
 # Menu help guides are reachable, dismissible, and return focus.
 for launcher,panel,key in [('focusProject','projectPanel','project'),('focusViews','viewControls','views'),('focusTools','toolsPanel','tools'),('focusAdd','catalogShelf','catalog')]:
  await page.locator('#'+launcher).click()
  await page.locator('#'+panel).wait_for(state='visible')
  help_btn=page.locator(f'#{panel} [data-help="{key}"]')
  assert await help_btn.is_visible(),(width,key)
  await help_btn.click()
  dialog=page.locator('#hpContextHelp')
  assert await dialog.is_visible()
  assert await dialog.locator('#hpContextTitle').inner_text()
  await page.keyboard.press('Escape')
  assert not await dialog.is_visible()
  assert await page.evaluate('document.activeElement.dataset.help')==key
  await page.keyboard.press('Escape')
  assert await page.locator('#'+launcher).get_attribute('aria-expanded')=='false'
 # Build reveals an icon-category palette, with actual architectural actions.
 await page.locator('#focusBuild').click()
 await page.locator('#architecturePalette').wait_for(state='visible')
 assert await page.locator('#focusBuild').get_attribute('aria-expanded')=='true'
 for action in ['walls','draw','door','window','outlet','opening','entry','finishes']:
  b=page.locator(f'#architecturePalette [data-build-action="{action}"]')
  assert await b.locator('svg.hp-icon').count()==1
  assert await b.get_attribute('data-tooltip')
 await page.locator('#architecturePalette [data-help="architecture"]').click()
 assert 'Build architecture' in await page.locator('#hpContextTitle').inner_text()
 await page.locator('#hpContextClose').click()
 await page.locator('#architecturePalette [data-build-action="window"]').click()
 assert 'Openings' in await page.locator('#sceneModeLabel').text_content()
 await page.locator('#focusEdit').count() # Inspector opens on demand, not automatically.
 await page.locator('#focusBuild').click()
 await page.locator('#architecturePalette [data-build-action="draw"]').click()
 assert 'Wall' in await page.locator('#sceneModeLabel').text_content()
 await page.locator('#focusBuild').click()
 await page.locator('#architecturePalette [data-build-action="finishes"]').click()
 assert await page.locator('#studioLayer').is_visible()
 assert await page.locator('[data-studio-tab="finishes"]').get_attribute('aria-selected')=='true'
 await page.locator('#studioClose').click()
 # Tool palette names move from visible labels to icon+tooltip, but modes remain working.
 await page.locator('#focusTools').click()
 for mode in ['furnish','build','navigate','measure','annotate','opening']:
  b=page.locator(f'#toolsPanel [data-tool="{mode}"]')
  assert await b.locator('svg.hp-icon').count()==1
  assert await b.get_attribute('aria-label')
 await page.locator('#toolsPanel [data-tool="measure"]').click()
 assert await page.locator('#focusToolsLabel').inner_text()=='Tape'
 # Catalog categories keep their live handlers after renderCatalog replaces innerHTML.
 await page.locator('#focusAdd').click()
 for cat in ['All','Favorites','Living','Storage','Bedroom','Kitchen','Bathroom','Markers']:
  b=page.locator(f'#categories [data-category="{cat}"]')
  assert await b.locator('svg.hp-icon').count()==1,cat
  assert await b.get_attribute('aria-label'),cat
 await page.locator('#categories [data-category="Bedroom"]').click()
 await page.wait_for_timeout(20)
 assert 'active' in (await page.locator('#categories [data-category="Bedroom"]').get_attribute('class'))
 assert await page.locator('#categories [data-category="Bedroom"] svg.hp-icon').count()==1
 await page.locator('#focusAdd').click()
 # Inspector's explanation is contextual and returns to selected inspector.
 await page.locator('#focusProject').click()
 await page.locator('#openExport').click()
 await page.locator('#inspector').wait_for(state='visible')
 await page.locator('#inspector [data-help="inspector"]').click()
 assert 'Object inspector' in await page.locator('#hpContextTitle').inner_text()
 await page.locator('#hpContextDone').click()
 assert not await page.locator('#hpContextHelp').is_visible()
 await page.locator('#closeInspector').click()
 # Design and survey guides must work inside their own overlay, without being stolen by legacy key handlers.
 await page.locator('#focusProject').click();await page.locator('#launchStudio').click()
 await page.locator('#studioLayer').wait_for(state='visible')
 await page.locator('#studioLayer [data-help="studio"]').click()
 assert await page.locator('#hpContextHelp').is_visible()
 await page.keyboard.press('Escape')
 assert await page.locator('#studioLayer').is_visible()
 await page.locator('#studioClose').click()
 await page.locator('#focusProject').click();await page.locator('#launchSurvey').click()
 await page.locator('#surveyLayer').wait_for(state='visible')
 await page.locator('#surveyLayer [data-help="survey"]').click()
 assert await page.locator('#hpContextHelp').is_visible()
 await page.keyboard.press('Escape')
 assert await page.locator('#surveyLayer').is_visible()
 await page.locator('#surveyClose').click()
 assert not errors,errors
 await page.screenshot(path=str(ROOT.parent/f'home-plan-icons-{width}.png'))
 await page.close()
 print('PASS icon UX',width)
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  for w,h in [(1440,900),(390,844),(320,640)]:await test(browser,w,h)
  await browser.close()
if __name__=='__main__':asyncio.run(main())
