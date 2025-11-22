# GitHub Pages Deployment - Manual Setup Required

## Critical: Workflow File Needs Manual Update

The GitHub Actions workflow at `.github/workflows/deploy.yml` needs to be updated manually to set the `VITE_BASE_PATH` environment variable. This is required for GitHub Pages deployment to work correctly.

## Required Change

Update the **Build** step in `.github/workflows/deploy.yml` (around lines 34-37):

### Current (Broken):
```yaml
      - name: Build
        run: npm run build
```

### Required (Working):
```yaml
      - name: Build
        run: npm run build
        env:
          VITE_BASE_PATH: /agroforrest-patch-planner/
```

## Why This Is Critical

Without `VITE_BASE_PATH` set during the build:
- ❌ Assets are referenced as `/assets/...` instead of `/agroforrest-patch-planner/assets/...`
- ❌ Router uses `basename="/"` instead of `basename="/agroforrest-patch-planner/"`
- ❌ Result: GitHub Pages deployment shows a **blank page** with 404 errors for all assets

With the environment variable:
- ✅ Assets correctly reference `/agroforrest-patch-planner/assets/...`
- ✅ Router correctly uses `basename="/agroforrest-patch-planner/"`
- ✅ App loads successfully on GitHub Pages

## How to Apply

1. Edit `.github/workflows/deploy.yml` directly in GitHub or locally
2. Add the `env:` section with `VITE_BASE_PATH: /agroforrest-patch-planner/` to the Build step
3. Commit and push to main
4. The next deployment will work correctly

## Testing Locally

To test the GitHub Pages build locally:

```bash
# Build with GitHub Pages base path
VITE_BASE_PATH=/agroforrest-patch-planner/ npm run build

# Preview the build
npm run preview
```

Then visit: `http://localhost:4173/agroforrest-patch-planner/`

## Related Files

- **vite.config.ts**: Reads `process.env.VITE_BASE_PATH` to set the base path
- **src/App.tsx**: Uses `basename={import.meta.env.BASE_URL}` for routing
- **public/404.html**: Handles deep link redirects for GitHub Pages
- **index.html**: Restores deep links before React Router initializes
- **README.md**: Documents the deployment process (lines 100-140)

---

**Note:** This file can be deleted after the workflow is updated.
