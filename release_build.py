#!/usr/bin/env python3
"""Create a privacy-audited source-only Home Plan ZIP. Never archive a whole worktree."""
import hashlib
import json
import zipfile
from pathlib import Path

ROOT=Path(__file__).resolve().parent
VERSION='0.9.0'
PUBLIC=[
 '.gitignore','.github/workflows/pages.yml','index.html','README.md','FEATURE_RECON.md',
 'PUBLISHING.md','ICON_UX_RESEARCH.md','QA_REPORT.md','OPERATIONAL_STATE.md','package.json','build.py','release_build.py',
 'src/app.js','src/model.js','src/studio.js','src/studio_model.js','src/studio.css','src/shell.html',
 'src/style.css','src/appearance.js','src/focus.css','src/focus.js','src/icon_ui.css','src/icon_ui.js','src/survey.css','src/survey.js','src/visuals.js','src/polish.css','src/chrome.js',
 'tests/architecture.test.cjs','tests/model.test.cjs','tests/survey_model.test.cjs','tests/studio_model.test.cjs',
 'tests/runtime.test.cjs','tests/appearance.test.cjs','tests/architecture_browser.py','tests/performance.cjs','tests/studio_browser.py','tests/survey_browser.py','tests/visual_browser.py','tests/focus_browser.py','tests/icon_ui_browser.py','tests/appearance_browser.py'
]
FORBIDDEN_SUFFIX={'.png','.jpg','.jpeg','.mp4','.mov','.webm','.zip','.gif','.heic','.pdf','.env','.sqlite','.db'}
manifest={'artifact':'Home Plan — Room, architecture and lighting source-only release','version':VERSION,'date':'2026-10-25','scope':'Public code only. No original apartment videos, photographs, captured survey assets or private user layouts.','files':[], 'limits':['No verified full offline Three.js WebGL; offline uses custom perspective Canvas','Architectural zones remain provisional pending tape/laser survey','Mobile browser emulation tested; physical device FPS/storage durability not proven','GitHub remote/Pages deployment requires separate provider verification']}
for rel in PUBLIC:
 p=ROOT/rel
 if not p.is_file() or p.is_symlink():raise RuntimeError(f'Missing or unsafe public path: {rel}')
 if p.suffix.lower() in FORBIDDEN_SUFFIX:raise RuntimeError(f'Unsafe extension: {rel}')
 data=p.read_bytes()
 # Keep the public release independent of absolute local filesystem paths.
 if rel!='release_build.py' and any(fragment in data for fragment in (b'/Users/andrew/',b'/mnt/data/',b'/home/oai/')):raise RuntimeError(f'Local path leakage in {rel}')
 manifest['files'].append({'path':rel,'size':len(data),'sha256':hashlib.sha256(data).hexdigest()})
man_path=ROOT/'RELEASE_MANIFEST.json'
man_path.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n')
out=ROOT.parent/f'Home-Plan-v{VERSION}-source.zip'
with zipfile.ZipFile(out,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=7) as z:
 for rel in PUBLIC+['RELEASE_MANIFEST.json']:
  z.write(ROOT/rel,rel)
with zipfile.ZipFile(out) as z:
 assert z.testzip() is None
 names=set(z.namelist())
 assert names==set(PUBLIC+['RELEASE_MANIFEST.json'])
 assert all(Path(n).suffix.lower() not in FORBIDDEN_SUFFIX for n in names)
 for entry in manifest['files']:
  assert hashlib.sha256(z.read(entry['path'])).hexdigest()==entry['sha256']
print(f'PUBLIC_RELEASE_OK {out} ({out.stat().st_size} bytes, {len(names)} known-safe entries)')
