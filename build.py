#!/usr/bin/env python3
"""Assemble the editable sources into one self-contained offline HTML file."""
from pathlib import Path
root=Path(__file__).resolve().parent
src=root/'src'
shell=(src/'shell.html').read_text()
for key,path in [('__CSS__','style.css'),('__SURVEY_CSS__','survey.css'),('__STUDIO_CSS__','studio.css'),('__POLISH_CSS__','polish.css'),('__FOCUS_CSS__','focus.css'),('__ICON_UI_CSS__','icon_ui.css'),('__MODEL__','model.js'),('__STUDIO_MODEL__','studio_model.js'),('__APPEARANCE_JS__','appearance.js'),('__VISUALS__','visuals.js'),('__APP__','app.js'),('__STUDIO_APP__','studio.js'),('__SURVEY_APP__','survey.js'),('__CHROME_JS__','chrome.js'),('__FOCUS_JS__','focus.js'),('__ICON_UI_JS__','icon_ui.js')]:
    shell=shell.replace(key,(src/path).read_text())
assert all(x not in shell for x in ['__CSS__','__SURVEY_CSS__','__STUDIO_CSS__','__POLISH_CSS__','__MODEL__','__STUDIO_MODEL__','__APPEARANCE_JS__','__VISUALS__','__APP__','__STUDIO_APP__','__SURVEY_APP__','__CHROME_JS__','__FOCUS_CSS__','__FOCUS_JS__','__ICON_UI_CSS__','__ICON_UI_JS__'])
(root/'index.html').write_text(shell)
print(f'Built {root/"index.html"} ({len(shell):,} characters)')
