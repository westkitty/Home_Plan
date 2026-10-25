import asyncio
import sys
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path("/Users/andrew/Home_Plan")
HTML_PATH = ROOT / "index.html"
HTML = HTML_PATH.read_text(encoding="utf-8")

async def test_realworld_view():
    async with async_playwright() as p:
        # Use Brave if available or fallback to bundled chromium
        brave_path = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
        browser_type = p.chromium
        launch_kwargs = {"headless": True}
        if Path(brave_path).exists():
            launch_kwargs["executable_path"] = brave_path

        browser = await browser_type.launch(**launch_kwargs)
        page = await browser.new_page(viewport={"width": 1280, "height": 800})
        
        errors = []
        page.on("pageerror", lambda err: errors.append(f"PageError: {err}"))
        page.on("console", lambda msg: errors.append(f"ConsoleError: {msg.text}") if msg.type == "error" else None)

        await page.set_content(HTML, wait_until="domcontentloaded")
        await asyncio.sleep(0.5)

        # 1. Verify default view is dollhouse
        default_style = await page.evaluate("() => window.homePlanStudioBridge?.getPlan()?.view?.style")
        print(f"Default view style: {default_style}")
        assert default_style == "dollhouse", f"Expected dollhouse, got {default_style}"

        # 2. Open views dropdown and click Real World view button
        await page.locator("#focusViews").click()
        await asyncio.sleep(0.2)
        realworld_btn = page.locator("#viewRealWorld")
        assert await realworld_btn.count() == 1, "Real world button #viewRealWorld not found"
        await realworld_btn.click()
        await asyncio.sleep(0.5)

        # 3. Check view style and HUD
        active_style = await page.evaluate("() => window.homePlanStudioBridge?.getPlan()?.view?.style")
        print(f"Active view style after click: {active_style}")
        assert active_style == "realworld", f"Expected realworld, got {active_style}"

        view_name = await page.locator("#focusViewName").text_content()
        print(f"Focus view name: {view_name}")
        assert view_name == "Real world", f"Expected 'Real world', got {view_name}"

        mode_label = await page.locator("#sceneModeLabel").text_content()
        title = await page.locator("#sceneTitle").text_content()
        subtitle = await page.locator("#sceneSubtitle").text_content()
        print(f"HUD: [{mode_label}] | {title} | {subtitle}")
        assert "REAL WORLD" in mode_label, f"Expected REAL WORLD in modeLabel, got {mode_label}"
        assert "Parkview & Apt E (2nd Floor)" in title, f"Expected Parkview in title, got {title}"

        # 4. Check scene boxes
        scene_info = await page.evaluate("""() => {
            const boxes = window.homePlanStudioBridge?.getBoxes() || [];
            const kinds = [...new Set(boxes.map(b => b.kind).filter(Boolean))];
            const pagodaBoxes = boxes.filter(b => b.kind && b.kind.startsWith('pagoda_'));
            const buildingBoxes = boxes.filter(b => b.kind && b.kind.startsWith('building_'));
            const roomBoxes = boxes.filter(b => b.kind === 'room');
            return {
                totalBoxes: boxes.length,
                kinds,
                pagodaCount: pagodaBoxes.length,
                buildingCount: buildingBoxes.length,
                roomFloorY: roomBoxes[0]?.y
            };
        }""")
        print(f"Scene info: {scene_info}")
        assert scene_info["pagodaCount"] > 0, "No pagoda boxes found in scene!"
        assert scene_info["buildingCount"] > 0, "No building structural boxes found in scene!"
        assert scene_info["roomFloorY"] > 2.0, f"Expected room boxes elevated to 2nd floor (> 2.0m), got {scene_info['roomFloorY']}"

        # 5. Check canvas rendered cleanly
        canvas_valid = await page.evaluate("""() => {
            const canvas = document.querySelector('#stage canvas');
            return canvas && canvas.width > 0 && canvas.height > 0;
        }""")
        assert canvas_valid, "Stage canvas invalid!"

        # 6. Test toggling back to Dollhouse
        await page.locator("#focusViews").click()
        await asyncio.sleep(0.2)
        dollhouse_btn = page.locator('button[data-view="dollhouse"]')
        await dollhouse_btn.click()
        await asyncio.sleep(0.3)
        restored_style = await page.evaluate("() => window.homePlanStudioBridge?.getPlan()?.view?.style")
        print(f"Restored style: {restored_style}")
        assert restored_style == "dollhouse", f"Expected dollhouse, got {restored_style}"

        # 7. Test Top plan view
        await page.locator("#focusViews").click()
        await asyncio.sleep(0.2)
        top_btn = page.locator('button[data-view="top"]')
        await top_btn.click()
        await asyncio.sleep(0.3)
        top_style = await page.evaluate("() => window.homePlanStudioBridge?.getPlan()?.view?.style")
        print(f"Top style: {top_style}")
        assert top_style == "top", f"Expected top, got {top_style}"

        # 8. Re-toggle realworld view
        await page.locator("#focusViews").click()
        await asyncio.sleep(0.2)
        await page.locator("#viewRealWorld").click()
        await asyncio.sleep(0.3)
        re_real = await page.evaluate("() => window.homePlanStudioBridge?.getPlan()?.view?.style")
        assert re_real == "realworld", "Re-toggle to realworld failed"

        # Check errors
        print(f"Console/Page errors ({len(errors)}): {errors}")
        assert len(errors) == 0, f"Encountered runtime errors: {errors}"

        # Take screenshot of real-world view for visual verification
        screenshot_path = ROOT / "realworld_preview.png"
        await page.screenshot(path=str(screenshot_path))
        print(f"Captured screenshot at {screenshot_path}")

        await browser.close()
        print("ALL REAL-WORLD CHECKS PASSED EMPIRICALLY WITH 0 ERRORS!")

if __name__ == "__main__":
    asyncio.run(test_realworld_view())
