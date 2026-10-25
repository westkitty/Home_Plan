"""High-priority architecture and actual touchscreen interactions."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'index.html').read_text()

async def check(browser,w,h):
    touch=w<=500
    page=await browser.new_page(viewport={'width':w,'height':h},has_touch=touch,is_mobile=touch)
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    await page.set_content(HTML,wait_until='domcontentloaded')
    async def press(selector):
        el=page.locator(selector)
        if touch:await el.tap(timeout=6000)
        else:await el.click(timeout=6000)
    async def plan():return await page.evaluate('JSON.parse(JSON.stringify(window.homePlanStudioBridge.getPlan()))')
    # Tap commands, then the contextual modal and its close action on real touch mode.
    await press('#focusBuild')
    await page.locator('#architecturePalette').wait_for(state='visible',timeout=6000)
    await press('#architecturePalette [data-help="architecture"]')
    assert await page.locator('#hpContextHelp').is_visible(), 'help modal unavailable on touch'
    await press('#hpContextDone')
    assert not await page.locator('#hpContextHelp').is_visible()
    await press('#focusProject')
    await press('#openExport')
    await page.locator('#inspector').wait_for(state='visible',timeout=6000)
    await press('#inspector [data-tab="project"]')
    await press('#inspector [data-act="newBlank"]')
    assert await page.locator('#modal').is_visible(), 'blank confirmation unavailable'
    await press('#decisionYes')
    before=await plan()
    for key in ['rooms','walls','items','fixtures']:assert len(before[key])==0,(w,key)
    # Shape palette to rectangle. Desktop uses drag, touchscreen supports two taps.
    await press('#focusBuild')
    await press('#architecturePalette [data-build-action="rectangle"]')
    stage=page.locator('#stage')
    rect=await stage.bounding_box();assert rect
    p1=(rect['x']+rect['width']*.37,rect['y']+rect['height']*.37)
    p2=(rect['x']+rect['width']*.63,rect['y']+rect['height']*.66)
    if touch:
        await page.touchscreen.tap(*p1)
        await page.touchscreen.tap(*p2)
    else:
        await page.mouse.move(*p1);await page.mouse.down();await page.mouse.move(*p2,steps=8);await page.mouse.up()
    after=await plan();assert len(after['rooms'])==1 and len(after['walls'])==4,('shape',w,len(after['rooms']),len(after['walls']),errors)
    assert any(f['type']=='entry' for f in after['fixtures']), 'missing marked entry'
    await page.locator('#roomNameEdit').fill('Den and studio')
    await page.locator('#roomNameEdit').dispatch_event('change')
    await page.locator('#roomZoneEdit').select_option('outdoor')
    await page.locator('#roomFloorEdit').select_option('tile-slate')
    after=await plan();assert after['rooms'][0]['name']=='Den and studio' and after['rooms'][0]['zone']=='outdoor' and after['rooms'][0]['flooring']=='tile-slate',after['rooms'][0]
    await press('#inspector [data-act="removeRoom"]')
    assert await page.locator('#modal').is_visible()
    await press('#decisionYes')
    after=await plan();assert not after['rooms'] and len(after['walls'])==4,'removing label should preserve walls'
    # Porch and balcony, categories/appliances, lighting/night.
    await press('#focusBuild')
    await press('#architecturePalette [data-build-action="porch"]')
    after=await plan();assert after['rooms'][-1]['zone']=='outdoor' and after['rooms'][-1]['name']=='Porch'
    await press('#focusBuild')
    await press('#architecturePalette [data-build-action="balcony"]')
    after=await plan();assert after['rooms'][-1]['name']=='Balcony'
    await press('#focusAdd')
    await press('#categories [data-category="Laundry"]')
    await press('[data-add="washer_dryer"]')
    after=await plan();assert after['items'][-1]['type']=='washer_dryer'
    await press('#focusProject');await press('#openExport')
    await press('#inspector [data-tab="project"]')
    await page.locator('#lightPreset').select_option('night')
    await page.locator('#indoorGlow').fill('90')
    await page.locator('#indoorGlow').dispatch_event('change')
    await page.locator('#outdoorDim').fill('100')
    await page.locator('#outdoorDim').dispatch_event('change')
    after=await plan();assert after['studio']['light']=='night' and after['studio']['indoorGlow']==90 and after['studio']['outdoorDim']==100
    # Studio: no crashes with no rooms; fixture categories not lost.
    await press('#closeInspector')
    await press('#focusProject');await press('#launchStudio')
    await press('[data-studio-tab="finishes"]')
    assert await page.locator('#studioFloorMaterial').is_visible()
    await press('#studioLayer [data-help="studio"]')
    assert await page.locator('#hpContextHelp').is_visible()
    await press('#hpContextClose')
    await press('#studioClose')
    assert not errors,errors
    # Blank-scene Design Lab and second shape geometry, no preexisting room assumptions.
    await press('#focusProject');await press('#openExport');await press('#inspector [data-tab="project"]');await press('#inspector [data-act="newBlank"]');await press('#decisionYes')
    await press('#focusProject');await press('#launchStudio')
    for tab in ['insights','layout','finishes','views','budget']:
        await press(f'[data-studio-tab="{tab}"]')
        assert await page.locator('#studioBody').is_visible(),tab
    await press('#studioClose')
    await press('#focusBuild');await press('#architecturePalette [data-build-action="circle"]')
    rect=await stage.bounding_box()
    p1=(rect['x']+rect['width']*.41,rect['y']+rect['height']*.43)
    p2=(rect['x']+rect['width']*.61,rect['y']+rect['height']*.67)
    if touch:
        await page.touchscreen.tap(*p1);await page.touchscreen.tap(*p2)
    else:
        await page.mouse.move(*p1);await page.mouse.down();await page.mouse.move(*p2,steps=5);await page.mouse.up()
    after=await plan();assert after['rooms'][0]['shape']=='circle' and len(after['walls'])==32
    await page.locator('#roomNameEdit').wait_for(state='visible',timeout=6000)
    if w==390:
        await page.screenshot(path=str(ROOT.parent/'home-plan-v090-circle-mobile.png'))
    assert not errors,errors
    print(f'PASS architecture / touch / dialogs / nightly / fixtures {w}px')
    await page.close()

async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
        for w,h in [(1440,900),(390,844),(320,640)]:await check(b,w,h)
        await b.close()
if __name__=='__main__':asyncio.run(main())
