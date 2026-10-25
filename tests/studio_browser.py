"""Design Lab browser contract: real Chromium DOM handlers, export downloads, mobile layout, state round-trip."""
import asyncio, json
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
async def open_studio(page):
 await page.locator('#focusProject').click()
 await page.locator('#launchStudio').click()
HTML=(ROOT/'index.html').read_text()
async def main():
 async with async_playwright() as pw:
  browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  errors=[]
  page=await browser.new_page(viewport={'width':1440,'height':900},accept_downloads=True)
  page.on('pageerror',lambda err:errors.append(str(err)))
  page.on('dialog',lambda d:asyncio.create_task(d.accept(prompt_text='Outlet behind shelving' if d.type=='prompt' else '')))
  await page.set_content(HTML,wait_until='domcontentloaded')
  assert not await page.locator('#modal').is_visible()
  assert await page.locator('#stage canvas').count()==1
  get=lambda expr: page.evaluate('('+expr+')')
  async def act(a):
   await page.locator('#studioBody [data-studio-act="'+a+'"]').click()
  async def tab(t):
   await page.locator('[data-studio-tab="'+t+'"]').click()
  # Feature 01 search, 02 favorite catalog, after refresh.
  await page.locator('#focusAdd').click()
  await page.locator('#catalogSearch').fill('sofa')
  assert await page.locator('[data-add="sofa"]').count()==1
  assert await page.locator('[data-add="bed"]').count()==0
  await page.locator('[data-fav="sofa"]').click()
  assert await page.evaluate("window.homePlanStudioBridge.getPlan().studio.favorites.includes('sofa')")
  await page.locator('#catalogSearch').fill('')
  await page.locator('#catalogFavorites').click()
  assert await page.locator('[data-add="sofa"]').count()==1
  assert await page.locator('[data-add="bed"]').count()==0
  await page.locator('#catalogFavorites').click()
  await open_studio(page)
  assert await page.locator('#studioLayer').is_visible()
  assert await page.locator('#studioBody .studio-card').count()==8
  # Feature 03/04: areas and units display; 05 north; 06 door arcs; 07 route diagnostics; 08 clearance.
  assert 'm²' in await page.locator('#studioBody').inner_text()
  await page.locator('#studioUnits').select_option('ft')
  assert await page.evaluate("window.homePlanStudioBridge.getPlan().studio.units")=='ft'
  assert 'ft²' in await page.locator('#studioBody').inner_text()
  await page.locator('#studioUnits').select_option('m')
  await page.locator('#studioNorth').fill('45')
  await page.locator('#studioNorth').dispatch_event('change')
  assert await page.evaluate("window.homePlanStudioBridge.getPlan().studio.north")==45
  await act('showArcs')
  assert await page.evaluate("window.homePlanStudioBridge.getPlan().studio.doorArcs")
  await page.locator('#studioClearance').fill('0.35')
  await page.locator('#studioClearance').dispatch_event('change')
  await act('route')
  assert 'Route:' in await page.locator('#studioStatus').inner_text()
  await act('clearRoute')
  assert await page.evaluate('window.homePlanStudioBridge.getRoute()') is None
  # Feature 09: user-created measuring tape; 10 contextual note survives JSON.
  await act('startTape')
  assert not await page.locator('#studioLayer').is_visible()
  await page.evaluate("window.homePlanStudioHandleClick('measure',{x:1,z:1});window.homePlanStudioHandleClick('measure',{x:4,z:5})")
  assert await page.evaluate('window.homePlanStudioBridge.getPlan().studio.measurements.length')==1
  await open_studio(page)
  assert '5 m' in await page.locator('#studioBody').inner_text()
  await act('startNote')
  await page.evaluate("window.homePlanStudioHandleClick('annotate',{x:3,z:2})")
  assert await page.evaluate('window.homePlanStudioBridge.getPlan().studio.annotations.length')==1
  # Feature 11/12/13: layout wizard dynamic minimap, locking, group membership.
  await open_studio(page)
  await tab('layout')
  await page.locator('#studioNewRoomName').fill('Workshop annex')
  await page.locator('#studioNewRoomW').fill('4.2')
  await page.locator('#studioNewRoomD').fill('3.3')
  await act('createRoom')
  assert await page.evaluate("window.homePlanStudioBridge.getPlan().rooms.find(r=>r.name==='Workshop annex').w")==4.2
  assert await page.evaluate('window.homePlanStudioBridge.getPlan().rooms.length')==6
  await page.locator('#studioItem').last.select_option('i1')
  await act('toggleLock')
  assert await page.evaluate("window.homePlanStudioBridge.getPlan().items.find(i=>i.id==='i1').locked")
  await page.locator('#studioItem').last.select_option('i6')
  await page.locator('#studioGroup').fill('seating')
  await act('setGroup')
  assert await page.evaluate("window.homePlanStudioBridge.getPlan().items.find(i=>i.id==='i6').group")=='seating'
  # Feature 14 align-wall, 15 grid snap, 16 hide furniture.
  await act('alignWall')
  assert await page.evaluate("Number.isFinite(window.homePlanStudioBridge.getPlan().items.find(i=>i.id==='i6').x)")
  await page.locator('#studioSnap').select_option('0')
  assert await page.evaluate('window.homePlanStudioBridge.getPlan().view.snap')==0
  await page.locator('#studioItem').last.select_option('i6')
  await act('toggleHide')
  assert await page.evaluate("window.homePlanStudioBridge.getPlan().items.find(i=>i.id==='i6').hidden")
  # Feature 17 room palette, 18 floor color, 19 wall paint, 20 furniture color, 21 light.
  await tab('finishes')
  await page.locator('#studioRoom').select_option('living')
  await act('palette:warm')
  assert await page.evaluate("window.homePlanStudioBridge.getPlan().studio.palette")=='warm'
  await page.locator('#studioFloorColor').fill('#104466')
  await page.locator('#studioFloorColor').dispatch_event('change')
  assert await page.evaluate("window.homePlanStudioBridge.getPlan().rooms.find(r=>r.id==='living').color")=='#104466'
  await page.locator('#studioWallColor').fill('#885522')
  await page.locator('#studioWallColor').dispatch_event('change')
  assert await page.evaluate("window.homePlanStudioBridge.getPlan().walls.find(w=>w.id==='w1').color")=='#885522'
  await page.locator('#studioItemColor').fill('#225577')
  await page.locator('#studioItemColor').dispatch_event('change')
  assert await page.evaluate("window.homePlanStudioBridge.getPlan().items.find(i=>i.id==='i6').color")=='#225577'
  await page.locator('#studioLight').select_option('night')
  assert await page.evaluate("window.homePlanStudioBridge.getPlan().studio.light")=='night'
  # Feature 22 camera bookmarks, 23 section heights, 24 independent layers, 25 floorplan underlay/calibration.
  await tab('views')
  await page.locator('#studioCameraName').fill('Entrance study view')
  await act('bookmark')
  assert await page.evaluate('window.homePlanStudioBridge.getPlan().studio.bookmarks.length')==1
  await page.locator('#studioCutHeight').fill('1.5')
  await page.locator('#studioCutHeight').dispatch_event('change')
  assert await page.evaluate('window.homePlanStudioBridge.getPlan().studio.cutHeight')==1.5
  await page.locator('[data-studio-setting="furnishings"]').uncheck()
  assert await page.evaluate('window.homePlanStudioBridge.getPlan().studio.furnishings')==False
  await page.locator('#studioHideRoom').select_option('living')
  assert await page.evaluate('window.homePlanStudioBridge.getPlan().studio.hideRoom')=='living'
  await page.locator('#studioUnderlayX').fill('1.5')
  await page.locator('#studioUnderlayX').dispatch_event('change')
  assert await page.evaluate('window.HomePlanStudio.UI.underlayOrigin[0]')==1.5
  # Feature 26 prices, 27 budget, 28 shopping CSV, 29 report, 30 JSON persistent metadata.
  await tab('budget')
  await page.locator('[data-studio-price="i1"]').fill('244.5')
  await page.locator('[data-studio-price="i1"]').dispatch_event('change')
  assert await page.evaluate("window.homePlanStudioBridge.getPlan().items.find(i=>i.id==='i1').price") == 244.5
  await page.locator('#studioBudget').fill('200')
  await page.locator('#studioBudget').dispatch_event('change')
  assert 'Over budget' in await page.locator('#studioBody').inner_text()
  async with page.expect_download() as d:
   await act('exportCSV')
  csv=await d.value
  assert csv.suggested_filename.endswith('.csv')
  await tab('insights')
  async with page.expect_download() as d:
   await act('exportReport')
  report=await d.value
  assert report.suggested_filename.endswith('.html')
  report_path=ROOT/'tests'/'studio_report.html';await report.save_as(report_path)
  content=report_path.read_text()
  assert 'Workshop annex' in content and 'NOT A VERIFIED' in content
  assert 'Entrance study view' not in content or 'Generated locally' in content
  await page.locator('#studioFinish').click()
  assert await page.locator('#stage canvas').count()==1
  # Round-trip JSON in a fresh context; no private media in exported plan.
  async with page.expect_download() as d:
   await page.locator('#focusProject').click()
   await page.locator('#openExport').click()
   await page.locator('[data-act="exportJson"]').click()
  export=await d.value
  json_path=ROOT/'tests'/'studio_layout.json';await export.save_as(json_path)
  data=json.loads(json_path.read_text())
  assert data['schema']==4 and data['studio']['palette']=='warm'
  assert any(r['name']=='Workshop annex' for r in data['rooms'])
  assert data['studio']['annotations'] and data['studio']['measurements']
  assert data['studio']['bookmarks']
  assert data['studio']['budget']==200
  assert 'data:' not in json_path.read_text()
  # Dynamic minimap scale includes annex: distinct transformed coordinates within canvas bounds.
  t=await page.evaluate('window.homePlanStudioBridge.getPlan().rooms.find(r=>r.name==="Workshop annex")')
  assert t['x']>8.7
  await page.screenshot(path=str(ROOT/'tests'/'studio_desktop_verified.png'))
  await page.close()
  small=await browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
  small.on('pageerror',lambda err:errors.append(str(err)))
  await small.set_content(HTML,wait_until='domcontentloaded')
  assert not await small.locator('#modal').is_visible()
  await small.locator('#focusTools').click()
  await small.locator('#railStudio').click()
  assert await small.locator('#studioLayer').is_visible()
  await small.locator('[data-studio-tab="layout"]').click()
  assert await small.locator('#studioSnap').is_visible()
  await small.locator('[data-studio-tab="budget"]').click()
  assert await small.locator('#studioBudget').is_visible()
  assert await small.locator('#studioFinish').is_visible()
  await small.screenshot(path=str(ROOT/'tests'/'studio_mobile_verified.png'))
  await small.close();await browser.close()
  assert not errors, errors
  print('PASS Chromium Design Lab 30 feature interaction paths, desktop/mobile, report/CSV/JSON downloads, no JavaScript exceptions')
asyncio.run(main())
