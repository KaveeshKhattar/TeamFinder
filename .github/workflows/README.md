# CI/CD Workflows

No deployment webhooks (e.g. Pro-only) are used. These workflows **validate and build** only; you deploy manually using the artifacts.

## What runs

| Workflow       | On                | Steps                                      | Artifact                          |
|----------------|-------------------|--------------------------------------------|-----------------------------------|
| **Backend CI** | push/PR to main, develop | Checkout → Java 17 → Maven cache → `mvn verify` | JAR (`backend-jar-<branch>-<sha>`) |
| **Frontend CI**| push/PR to main, develop | Checkout → Node 20 → npm ci → lint → build | `dist/` (`frontend-dist-<branch>-<sha>`) |

## Using the artifacts

1. Open the run: **Actions** → select workflow run → **Summary**.
2. Download the artifact (e.g. `backend-jar-main-abc123` or `frontend-dist-main-abc123`).
3. **Backend**: Run the JAR with `java -jar TeamFinder-0.0.1-SNAPSHOT.jar` (or upload to your server).
4. **Frontend**: The `dist` folder is a static bundle. For Vercel: connect the repo in Vercel—they build from source on push. The artifact is for manual deploy or to verify the build in CI.

## Retention

Artifacts are kept for **14 days**. Download what you need before they expire.
