# Home Plan public publication

## Public source and private captures

The Git history and Pages artifact are **source-only**. They must not contain the original walkthroughs, extracted frames, uploaded survey photos/videos, real measurements tied to a street address, private survey ZIPs, or exported user floor-plan data. CI deploys only a generated `index.html` and `.nojekyll` to Pages.

`git status --short` and `git ls-files` must be inspected before push. `.gitignore` is a secondary safeguard, **not** a substitute for an explicit staged allowlist.

## Repository identity and publishing

The exact repository is **`westkitty/Home_Plan`** (underscore, not hyphen), default branch `main`. The GitHub connector confirmed the repository exists and the account has administrative/push rights on 2026-10-25. Verify the remote head again before publication. Never force-push unrelated history or assume a GitHub connector write is identical to a native `git push`.

If a Git CLI session has working credentials, use `git remote add origin https://github.com/westkitty/Home_Plan.git` only when `origin` does not already exist, then `git push -u origin main`. A source-only connector publication may use a different Git commit ID from the local commit; reconcile histories before later native pushes.

## Pages deploy

After the verified push, GitHub repository Settings → Pages → Build and deployment → Source = **GitHub Actions**. The `actions/configure-pages@v5` step does **not** enable an absent Pages site with the default `GITHUB_TOKEN`; Pages must first be enabled through an authorized account/API operation. The included `.github/workflows/pages.yml` builds, verifies and deploys a minimal site archive. The expected URL, only **after** the successful published workflow is verified, is `https://westkitty.github.io/Home_Plan/`.

Always check the workflow run conclusion and verify that the URL responds with the current build. A successful local Git commit is not evidence that Pages is live.

## Required local commands

`npm run check` then `npm run test:browser` (requires Playwright/Chromium) then `python3 build.py`.

The offline HTML startup contains no remote dependencies; the user-triggered optional legacy WebGL mode still fetches Three.js from a CDN and is not offline-certified.
