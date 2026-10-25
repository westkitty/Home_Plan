"""Browser-owned DOM/input integration checks. Navigation is blocked in this runtime; set_content runs actual Chromium JS/Canvas."""
import asyncio
from pathlib import Path
from io import BytesIO
from zipfile import ZipFile
from PIL import Image, ImageDraw
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
async def open_survey(page):
 await page.locator('#focusProject').click()
 await page.locator('#launchSurvey').click()
SHOT=ROOT/'tests'/'sample_capture.png'
image=Image.new('RGB',(320,180),'#325b4f')
d=ImageDraw.Draw(image);d.line([(8,8),(312,8),(312,172),(8,172),(8,8)],width=8,fill='#d8c496');d.text((28,72),'WALL + DOOR + FLOOR',fill='white')
image.save(SHOT)
VIDEO=ROOT/'tests'/'sample_capture.mp4';VIDEO.write_bytes(b'\x00\x00\x00\x1cftypmp42\x00\x00\x00\x00mp42isom')
async def run():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  errors=[]
  desktop=await browser.new_page(viewport={'width':1360,'height':860},accept_downloads=True)
  desktop.on('pageerror',lambda err:errors.append(str(err)))
  desktop.on('dialog',lambda d:asyncio.create_task(d.accept()))
  await desktop.set_content((ROOT/'index.html').read_text(),wait_until='domcontentloaded')
  assert not await desktop.locator('#modal').is_visible()
  assert await desktop.locator('#stage canvas').count()==1
  await open_survey(desktop)
  assert await desktop.locator('#surveyLayer').is_visible()
  assert await desktop.locator('#surveyStepTitle').inner_text()=='Find the entrance'
  assert await desktop.locator('.survey-room-button').first.get_attribute('data-room')=='hall'
  assert '66' in await desktop.locator('#surveyOverallLabel').inner_text()
  await desktop.locator('#surveyQuickBtn').click()
  assert '26 quick-pass' in await desktop.locator('#surveyOverallLabel').inner_text()
  await desktop.locator('#surveyFullBtn').click()
  assert '66 full-survey' in await desktop.locator('#surveyOverallLabel').inner_text()
  await desktop.locator('#surveyNote').fill('Door is next to the fountain. Avoid apartment number in photo.')
  await desktop.locator('#surveyNext').click()
  await desktop.locator('#surveyPrevious').click()
  assert 'next to the fountain' in await desktop.locator('#surveyNote').input_value()
  await desktop.locator('#surveyUploadInput').set_input_files(str(SHOT))
  await desktop.locator('.survey-file-card').wait_for()
  assert await desktop.locator('.survey-file-card').count()==1
  assert await desktop.locator('.survey-file-card img').count()==1
  assert '1 of 66' in await desktop.locator('#surveyOverallLabel').inner_text()
  await desktop.locator('[data-preview]').first.click()
  assert await desktop.locator('#surveyPreview').is_visible()
  assert await desktop.locator('#surveyPreviewMedia img').count()==1
  await desktop.locator('#surveyPreviewRetake').click()
  assert not await desktop.locator('#surveyPreview').is_visible()
  assert '0 of 66' in await desktop.locator('#surveyOverallLabel').inner_text()
  assert 'RETAKE' in await desktop.locator('.survey-file-size').inner_text()
  await desktop.locator('[data-preview]').first.click()
  await desktop.locator('#surveyPreviewAccept').click()
  assert '1 of 66' in await desktop.locator('#surveyOverallLabel').inner_text()
  assert 'APPROVED' in await desktop.locator('.survey-file-size').inner_text()
  # Video step: matching MIME/format accepted, and a playable preview is available.
  await desktop.locator('[data-step="2"]').click()
  await desktop.locator('#surveyUploadInput').set_input_files(str(VIDEO))
  await desktop.locator('.survey-file-card').wait_for()
  assert '2 of 66' in await desktop.locator('#surveyOverallLabel').inner_text()
  await desktop.locator('[data-preview]').click()
  assert await desktop.locator('#surveyPreviewMedia video').count()==1
  await desktop.locator('#surveyPreviewClose').click()
  # Optional no-window case requires a written reason and does not fabricate an opening.
  await desktop.locator('[data-step="9"]').click()
  assert 'Windows' in await desktop.locator('#surveyStepTitle').inner_text()
  await desktop.locator('#surveySkip').click()
  await desktop.locator('#surveySkipText').fill('No windows visible in this hall.')
  await desktop.locator('#surveyConfirmSkip').click()
  assert '3 of 66' in await desktop.locator('#surveyOverallLabel').inner_text()
  # Capture precise measurements; provenance is tape, not inferred from pixels.
  await desktop.locator('[data-step="12"]').click()
  assert 'Measure the room' in await desktop.locator('#surveyStepTitle').inner_text()
  assert await desktop.locator('#surveyWallSketch svg').count()==1
  await desktop.locator('#survey-width').fill('10')
  await desktop.locator('#survey-depth').fill('7.5')
  await desktop.locator('#surveyMeasureMethod').select_option('tape')
  await desktop.locator('#surveySaveMeasure').click()
  measurement=await desktop.evaluate("window.homePlanSurveyBridge.getPlan().survey.measurements.hall")
  assert abs(measurement['width']['meters']-3.048)<0.0002,measurement
  assert abs(measurement['depth']['meters']-2.286)<0.0002,measurement
  original=await desktop.evaluate("window.homePlanSurveyBridge.getPlan().rooms.find(r=>r.id==='hall').w")
  assert original==3.1
  await desktop.locator('#surveyApplyRoom').click()
  updated=await desktop.evaluate("window.homePlanSurveyBridge.getPlan().rooms.find(r=>r.id==='hall').w")
  assert abs(updated-3.048)<0.002,updated
  # User-measured wall length travels through actual editor transaction.
  await desktop.locator('#surveyWallSelect').select_option('w10')
  assert 'Selected w10' in await desktop.locator('#surveyWallSketch svg').get_attribute('aria-label')
  await desktop.locator('#surveyWallValue').fill('11')
  await desktop.locator('#surveySaveWall').click()
  await desktop.locator('#surveyApplyWall').click()
  wall=await desktop.evaluate("window.homePlanSurveyBridge.getPlan().walls.find(w=>w.id==='w10')")
  assert abs(((wall['b'][0]-wall['a'][0])**2+(wall['b'][1]-wall['a'][1])**2)**.5-3.3528)<0.005,wall
  # Explicit local-only ZIP export; verify accepted by standard Python ZIP reader, CRC and byte identity.
  async with desktop.expect_download(timeout=30000) as d:
   await desktop.locator('#surveyExportPack').click()
  downloaded=await d.value
  output=ROOT/'tests'/'roundtrip_capture.zip'
  await downloaded.save_as(output)
  with ZipFile(output) as z:
   assert z.testzip() is None
   names=z.namelist()
   assert 'home-plan.json' in names and 'capture-manifest.json' in names
   assert len([x for x in names if x.startswith('captures/')])==2,names
   assert any(z.read(x)==SHOT.read_bytes() for x in names if x.endswith('.png'))
   print('Browser ZIP package:',names)
  # Import the private ZIP in a fresh browser document. Files + schema + dimensions restore together.
  restored=await browser.new_page(viewport={'width':1024,'height':768})
  restored.on('pageerror',lambda err:errors.append(str(err)))
  restored.on('dialog',lambda d:asyncio.create_task(d.accept()))
  await restored.set_content((ROOT/'index.html').read_text(),wait_until='domcontentloaded')
  assert not await restored.locator('#modal').is_visible()
  await open_survey(restored)
  await restored.locator('#surveyPackageImport').set_input_files(str(output))
  await restored.wait_for_function("window.homePlanSurveyBridge.getPlan().survey.steps.hall?.anchor?.assets?.length === 1")
  await restored.locator('[data-room="hall"]').click()
  assert '4 of 66' in await restored.locator('#surveyOverallLabel').inner_text(),await restored.locator('#surveyOverallLabel').inner_text()
  assert await restored.locator('.survey-file-card img').count()==1
  restored_width=await restored.evaluate("window.homePlanSurveyBridge.getPlan().rooms.find(r=>r.id==='hall').w")
  assert abs(restored_width-3.048)<.002,restored_width
  assert await restored.locator('.survey-file-card').count()==1
  await restored.close()
  # An altered ZIP must be rejected before any geometry or capture mutation.
  broken=bytearray(output.read_bytes());broken[80]^=0x10
  bad=ROOT/'tests'/'corrupted_capture.zip';bad.write_bytes(broken)
  with open(bad,'rb') as f: assert f.read(4)==b'PK\x03\x04'
  await desktop.locator('#surveyPackageImport').set_input_files(str(bad))
  await desktop.wait_for_function("document.querySelector('#surveyStepState').textContent.includes('Archive was not restored')",timeout=30000)
  await desktop.screenshot(path=str(ROOT/'tests'/'survey_desktop_ready.png'))
  await desktop.locator('#surveyClose').click()
  assert not await desktop.locator('#surveyLayer').is_visible()
  await desktop.locator('#focusMove').click()
  assert await desktop.locator('#stage canvas').count()==1
  await desktop.close()
  # Independently verify the capture workspace on a tablet-sized viewport.
  tablet=await browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
  tablet.on('pageerror',lambda err:errors.append(str(err)))
  await tablet.set_content((ROOT/'index.html').read_text(),wait_until='domcontentloaded')
  assert not await tablet.locator('#modal').is_visible()
  # Compact Project menu retains the private survey route on phones.
  await open_survey(tablet)
  assert await tablet.locator('#surveyFullBtn').is_visible()
  await tablet.locator('#surveyQuickBtn').click()
  assert await tablet.locator('#surveyNext').is_visible()
  assert await tablet.locator('.survey-room-button').first.get_attribute('data-room')=='hall'
  await tablet.screenshot(path=str(ROOT/'tests'/'survey_mobile_ready.png'))
  await tablet.close()
  await browser.close()
  assert not errors,errors
  print('PASS browser: offline boot, fountain route, two depth modes, note persistence, photo/video attachment, preview/retake/review, optional skip, tape dimensions, wall geometry, CRC verified ZIP export/import, corrupted ZIP rejection, tablet layout')
asyncio.run(run())
