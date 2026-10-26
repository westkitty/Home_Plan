import os
import sys
from playwright.sync_api import sync_playwright

BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
HTML_PATH = os.path.abspath("index.html")
SCREENSHOT_DIR = "/Users/andrew/.gemini/antigravity/brain/92a160bb-112f-4275-976c-937720ac40f7"

def ensure_views_open(page):
    ctrls = page.locator("#viewControls")
    if not ctrls.is_visible():
        page.click("#focusViews")
        page.wait_for_timeout(200)

def test_experimental_gate():
    print(f"Testing Experimental Gate in {HTML_PATH} with Brave Browser...")
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=BRAVE_PATH,
            headless=True
        )
        context = browser.new_context(viewport={"width": 1280, "height": 850})
        page = context.new_page()
        page.on("pageerror", lambda err: errors.append(f"PageError: {err}"))
        page.on("console", lambda msg: print(f"Console [{msg.type}]: {msg.text}") if msg.type in ["error"] else None)

        page.goto(f"file://{HTML_PATH}")
        page.wait_for_timeout(1000)

        # 1. Verify placement of #btnExperimental directly underneath #viewRealWorld
        print("Checking placement of #btnExperimental...")
        ensure_views_open(page)
        exp_btn = page.locator("#btnExperimental")
        assert exp_btn.count() == 1, "#btnExperimental must exist"
        
        # Verify DOM sibling relation: btnExperimental is right after viewRealWorld
        pos_check = page.evaluate("""() => {
            const rw = document.getElementById('viewRealWorld');
            const exp = document.getElementById('btnExperimental');
            return rw && exp && rw.nextElementSibling === exp;
        }""")
        assert pos_check, "#btnExperimental must be located directly underneath #viewRealWorld in view controls"
        print("✓ #btnExperimental is correctly placed directly underneath #viewRealWorld")

        # 2. Verify gated state by default: controls are hidden
        print("Verifying default gated state...")
        gated_status = page.evaluate("""() => {
            return {
                truckHidden: document.getElementById('viewTruck').hidden,
                heatmapHidden: document.getElementById('focusHeatmap').hidden,
                acousticHidden: document.getElementById('focusAcoustic').hidden,
                blueprintHidden: document.getElementById('focusBlueprint').hidden,
                timelineHidden: document.getElementById('timeTimeline').hidden,
                expActive: document.getElementById('btnExperimental').classList.contains('active')
            };
        }""")
        assert gated_status["truckHidden"], "#viewTruck must be hidden when gate is off"
        assert gated_status["heatmapHidden"], "#focusHeatmap must be hidden when gate is off"
        assert gated_status["acousticHidden"], "#focusAcoustic must be hidden when gate is off"
        assert gated_status["blueprintHidden"], "#focusBlueprint must be hidden when gate is off"
        assert gated_status["timelineHidden"], "#timeTimeline must be hidden when gate is off"
        assert not gated_status["expActive"], "#btnExperimental must not be active when gate is off"
        print("✓ All experimental controls are hidden by default")

        # 3. Test clicking #viewRealWorld when gated off
        print("Testing click on Real World while gated...")
        page.click("#viewRealWorld")
        page.wait_for_timeout(300)
        # Should show modal or toast alerting user
        modal = page.locator("#modal")
        assert modal.is_visible(), "Experimental Gate modal should open when clicking gated Real World view"
        modal_title = page.locator("#modalTitle").inner_text()
        assert "Experimental" in modal_title, f"Modal title should mention Experimental, got: {modal_title}"
        print(f"✓ Real World click intercepted by Experimental Gate modal: '{modal_title}'")

        # 4. Inspect modal contents: verify all 15 features are present
        print("Verifying all 15 features in Experimental Gate modal...")
        cards = page.locator(".exp-card")
        assert cards.count() == 15, f"Expected 15 experimental feature cards, got {cards.count()}"

        keys_present = page.evaluate("""() => {
            return Array.from(document.querySelectorAll('.exp-card')).map(c => c.dataset.key);
        }""")
        expected_keys = [
            'realWorld', 'pagoda', 'solar', 'transitPath', 'acoustics',
            'truck', 'procurement', 'cartons', 'heatmap', 'wallElevation',
            'blueprint', 'doorSwings', 'triangulation', 'videoTracking', 'webxr'
        ]
        for ek in expected_keys:
            assert ek in keys_present, f"Feature key '{ek}' missing from Experimental modal!"
        print("✓ All 15 features present in modal:", keys_present)

        # Capture screenshot of the Experimental Gate modal
        page.screenshot(path=f"{SCREENSHOT_DIR}/experimental_gate_modal.png")
        print(f"✓ Saved modal screenshot to {SCREENSHOT_DIR}/experimental_gate_modal.png")

        # 5. Test "Enable All 15" quick button
        print("Testing 'Enable All 15' button...")
        page.click("#expEnableAll")
        page.wait_for_timeout(300)

        # Check that master toggle and all 15 checkboxes are now checked
        all_checked = page.evaluate("""() => {
            const master = document.getElementById('expMasterToggle').checked;
            const flags = Array.from(document.querySelectorAll('.exp-flag')).every(c => c.checked);
            return master && flags;
        }""")
        assert all_checked, "Master toggle and all 15 flags should be checked after clicking Enable All"

        # Click Done & Apply
        page.click("#expApply")
        page.wait_for_timeout(300)
        assert not page.locator("#modal").is_visible(), "Modal should close on apply"
        print("✓ Enabled all 15 features and closed modal")

        # 6. Verify un-gated interface: controls are now visible and active
        print("Verifying un-gated interface controls...")
        ensure_views_open(page)
        un_gated_status = page.evaluate("""() => {
            return {
                truckHidden: document.getElementById('viewTruck').hidden,
                heatmapHidden: document.getElementById('focusHeatmap').hidden,
                acousticHidden: document.getElementById('focusAcoustic').hidden,
                blueprintHidden: document.getElementById('focusBlueprint').hidden,
                timelineHidden: document.getElementById('timeTimeline').hidden,
                expActive: document.getElementById('btnExperimental').classList.contains('active')
            };
        }""")
        assert not un_gated_status["truckHidden"], "#viewTruck must be visible when enabled"
        assert not un_gated_status["heatmapHidden"], "#focusHeatmap must be visible when enabled"
        assert not un_gated_status["acousticHidden"], "#focusAcoustic must be visible when enabled"
        assert not un_gated_status["blueprintHidden"], "#focusBlueprint must be visible when enabled"
        assert not un_gated_status["timelineHidden"], "#timeTimeline must be visible when enabled"
        assert un_gated_status["expActive"], "#btnExperimental must have active class"
        print("✓ All experimental controls are now active and visible in the interface")

        # 7. Test Real World 3D Mode activation
        print("Testing Real World 3D Mode now that gate is active...")
        page.click("#viewRealWorld")
        page.wait_for_timeout(400)
        scene_mode = page.evaluate("() => document.getElementById('sceneModeLabel')?.textContent || ''")
        current_style = page.evaluate("() => window.homePlanStudioBridge.getPlan().view.style")
        assert current_style == "realworld", f"Expected view style 'realworld', got {current_style}"
        assert "REAL WORLD" in scene_mode, f"Expected Real World mode label, got {scene_mode}"
        print(f"✓ Real World 3D Mode activated: {scene_mode}")

        # 8. Test Pack the Moving Truck
        print("Testing Pack the Moving Truck...")
        ensure_views_open(page)
        page.click("#viewTruck")
        page.wait_for_timeout(400)
        truck_title = page.evaluate("() => document.getElementById('sceneTitle')?.textContent || ''")
        current_style = page.evaluate("() => window.homePlanStudioBridge.getPlan().view.style")
        assert current_style == "truck", f"Expected view style 'truck', got {current_style}"
        assert "Cargo" in truck_title or "Move-In" in truck_title, f"Unexpected truck title: {truck_title}"
        print(f"✓ Pack the Moving Truck activated: {truck_title}")

        # 9. Test Verification Heatmap toggle
        print("Testing Verification Heatmap toggle...")
        ensure_views_open(page)
        page.click("#focusHeatmap")
        page.wait_for_timeout(200)
        toast = page.locator("#toast").inner_text()
        assert "heatmap" in toast.lower(), f"Unexpected toast: {toast}"
        print("✓ Verification Heatmap toggled successfully")

        # 10. Test Acoustic map toggle
        print("Testing Acoustic Map toggle...")
        ensure_views_open(page)
        page.click("#focusAcoustic")
        page.wait_for_timeout(200)
        toast = page.locator("#toast").inner_text()
        assert "acoustic" in toast.lower(), f"Unexpected toast: {toast}"
        print("✓ Acoustic Map toggled successfully")

        # 11. Test Inspector tools (Procurement, Transit Clearance, Carton Mode, Elevation)
        print("Testing Inspector tools with experimental flags enabled...")
        ensure_views_open(page)
        page.click('[data-view="top"]')
        page.wait_for_timeout(200)

        # Select furniture item
        page.evaluate("""() => {
            const bridge = window.homePlanStudioBridge;
            bridge.getApp().tab = 'edit';
            bridge.select('item', bridge.getPlan().items[0].id);
            document.getElementById('inspector').classList.add('mobile-open');
        }""")
        page.wait_for_timeout(200)

        # Check procurement row
        procure_btns = page.locator(".procure-btn")
        assert procure_btns.count() >= 3, "Procurement buttons (Owned, Needed, Ordered) should exist"

        # Check carton toggle button
        carton_btn = page.locator('[data-act="toggleCarton"]')
        assert carton_btn.is_visible(), "Carton toggle button should be visible in inspector"

        # Select wall w1
        page.evaluate("""() => {
            const bridge = window.homePlanStudioBridge;
            bridge.getApp().tab = 'edit';
            bridge.select('wall', 'w1');
            document.getElementById('inspector').classList.add('mobile-open');
        }""")
        page.wait_for_timeout(200)

        # Check wall elevation button
        elevation_btn = page.locator('[data-act="wallElevation"]')
        assert elevation_btn.is_visible(), "Wall elevation button should be visible in inspector"

        # Check acoustic profile chip in wall inspector
        assert page.locator(".meter-chip").count() > 0, "Acoustic STC meter chip should be visible"
        page.evaluate("() => document.getElementById('inspector').classList.remove('mobile-open')")
        print("✓ All inspector experimental sections verified (Procurement, Cartons, Elevation, Acoustics)")

        # 12. Test Launch button directly from Experimental Modal
        print("Testing direct 'Launch ↗' button from modal...")
        ensure_views_open(page)
        page.click("#btnExperimental")
        page.wait_for_timeout(300)
        assert page.locator("#modal").is_visible(), "Modal should open"
        
        # Click launch for 'wallElevation'
        page.click('.exp-card[data-key="wallElevation"] .exp-launch-btn')
        page.wait_for_timeout(300)
        # Wall elevation modal should have opened
        assert page.locator("#elevationCanvas").is_visible(), "Elevation canvas should be visible after launch"
        page.click("#elevationClose")
        page.wait_for_timeout(200)
        print("✓ Direct launch of Wall Elevation from modal succeeded")

        # 13. Test "Disable All" quick button
        print("Testing 'Disable All' button...")
        ensure_views_open(page)
        page.click("#btnExperimental")
        page.wait_for_timeout(300)
        page.click("#expDisableAll")
        page.wait_for_timeout(300)
        page.click("#expApply")
        page.wait_for_timeout(300)

        # Verify controls are hidden again
        disabled_status = page.evaluate("""() => {
            return {
                truckHidden: document.getElementById('viewTruck').hidden,
                heatmapHidden: document.getElementById('focusHeatmap').hidden,
                acousticHidden: document.getElementById('focusAcoustic').hidden,
                timelineHidden: document.getElementById('timeTimeline').hidden,
                expActive: document.getElementById('btnExperimental').classList.contains('active')
            };
        }""")
        assert disabled_status["truckHidden"], "#viewTruck should be hidden again"
        assert disabled_status["heatmapHidden"], "#focusHeatmap should be hidden again"
        assert disabled_status["acousticHidden"], "#focusAcoustic should be hidden again"
        assert disabled_status["timelineHidden"], "#timeTimeline should be hidden again"
        assert not disabled_status["expActive"], "#btnExperimental should not be active"
        print("✓ 'Disable All' successfully re-locked the experimental suite")

        # Capture final screenshot
        page.screenshot(path=f"{SCREENSHOT_DIR}/experimental_gate_verified.png")
        print(f"✓ Saved final screenshot to {SCREENSHOT_DIR}/experimental_gate_verified.png")

        browser.close()

    assert not errors, f"Browser test encountered errors: {errors}"
    print("\n🎉 ALL EXPERIMENTAL GATE TESTS PASSED IN BRAVE BROWSER! 🎉\n")

if __name__ == "__main__":
    test_experimental_gate()
