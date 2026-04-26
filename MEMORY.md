# Memory

_Last updated: 2026-04-26_

## Memory
<!-- Things Mohamed has asked to remember. Persistent - only remove or change if asked. -->

- 2026-04-26: Folder reorganization done on branch `feat/folder-reorganization`. Project now follows the workspace 9-folder standard (00-08). Key implications:
  - All Next.js commands must run from `04-Development/` (npm install, npm run dev, etc.)
  - Vercel "Root Directory" setting must be updated in the dashboard to `04-Development` before next deploy
  - `.gitignore` and `.gitattributes` stayed at project root and still apply to the whole tree
  - `.kiro/` stayed at root because it's IDE-level config
  - Docs moved: `IMPLEMENTATION_PLAN.md` + `PROJECT_STATISTICS.txt` -> `01-Solution-Architecture/`. `test-scripts/` + `CODE_REVIEW_*.md` -> `05-Testing/`. `SETUP_COMPLETE.md` -> `04-Development/`
