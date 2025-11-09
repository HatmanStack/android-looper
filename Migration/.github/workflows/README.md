# GitHub Actions Workflows

This directory contains CI/CD workflows for the Looper application.

## Workflows

### CI (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Jobs:**
1. **Test**: Runs on Node 18.x and 20.x
   - Checkout code
   - Install dependencies
   - Run linter (`npm run lint`)
   - Type check (`npx tsc --noEmit`)
   - Run unit and integration tests with coverage
   - Upload coverage to Codecov

2. **Prettier**: Code formatting check
   - Run `npm run format:check`

3. **Build Web**: Build production web bundle
   - Runs after tests pass
   - Build with `npm run build:web`
   - Upload build artifact

**Status Badge:**
```markdown
![CI](https://github.com/USERNAME/android-looper/workflows/CI/badge.svg)
```

---

### Deploy Web (`deploy-web.yml`)

**Triggers:**
- Push to `main` branch
- New version tags (`v*`)
- Manual workflow dispatch

**Jobs:**
1. **Deploy**: Deploy to production
   - Run tests
   - Build web bundle
   - Deploy to Vercel (or Netlify)

2. **Notify**: Send deployment notification
   - Runs after successful deployment
   - Can integrate with Slack/Discord/Email

**Required Secrets:**
- `VERCEL_TOKEN`: Vercel authentication token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

**Alternative (Netlify):**
- `NETLIFY_SITE_ID`: Netlify site ID
- `NETLIFY_AUTH_TOKEN`: Netlify authentication token

**Status Badge:**
```markdown
![Deploy](https://github.com/USERNAME/android-looper/workflows/Deploy%20Web/badge.svg)
```

---

### Build Mobile Apps (`build-mobile.yml`)

**Triggers:**
- New version tags (`v*`)
- Manual workflow dispatch (with platform and profile options)

**Jobs:**
1. **Build**: Build mobile apps with EAS
   - Run tests
   - Build Android APK/AAB
   - Build iOS IPA
   - Post build links to PR (if applicable)

2. **Submit**: Auto-submit to app stores (for tags starting with `v`)
   - Submit to Google Play Store
   - Submit to Apple App Store
   - Create GitHub release

**Required Secrets:**
- `EXPO_TOKEN`: Expo authentication token

**Manual Trigger Inputs:**
- `platform`: `all`, `android`, or `ios`
- `profile`: `production`, `preview`, or `development`

**Obtaining EXPO_TOKEN:**
```bash
eas login
eas whoami
# Get token from: https://expo.dev/accounts/[account]/settings/access-tokens
```

**Status Badge:**
```markdown
![Build Mobile](https://github.com/USERNAME/android-looper/workflows/Build%20Mobile%20Apps/badge.svg)
```

---

### E2E Tests (`e2e.yml`)

**Triggers:**
- Push to `main` branch
- Pull requests to `main`
- Scheduled daily at 2 AM UTC
- Manual workflow dispatch

**Jobs:**
1. **Playwright Web**: Run Playwright E2E tests
   - Install Playwright browsers (Chromium, Firefox)
   - Build web bundle
   - Start local server
   - Run E2E tests
   - Upload test reports and results

2. **Detox Android**: Run Detox tests on Android (placeholder)
   - Setup Android SDK
   - Build APK
   - Run Detox tests

3. **Detox iOS**: Run Detox tests on iOS (placeholder)
   - Build IPA
   - Start iOS simulator
   - Run Detox tests

**Status Badge:**
```markdown
![E2E Tests](https://github.com/USERNAME/android-looper/workflows/E2E%20Tests/badge.svg)
```

---

## Setup Instructions

### 1. Configure Repository Secrets

Go to `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

**Required:**
- `EXPO_TOKEN`: For EAS builds and submissions

**For Web Deployment (choose one):**

**Vercel:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

**Netlify:**
- `NETLIFY_SITE_ID`
- `NETLIFY_AUTH_TOKEN`

**Optional:**
- `CODECOV_TOKEN`: For code coverage uploads

### 2. Enable Workflows

Workflows are enabled by default. To disable/enable:
- Go to `Actions` tab
- Select workflow
- Click `...` → `Disable/Enable workflow`

### 3. Protecting Main Branch

Recommended settings for `main` branch:
1. Go to `Settings` → `Branches` → `Add rule`
2. Branch name pattern: `main`
3. Enable:
   - Require pull request before merging
   - Require status checks to pass (CI workflow)
   - Require branches to be up to date
   - Include administrators

### 4. Auto-Deploy on Tag

To trigger a release:

```bash
# Update version in app.config.ts and package.json
# Commit changes
git add .
git commit -m "chore: bump version to 1.1.0"

# Create and push tag
git tag v1.1.0
git push origin v1.1.0

# This triggers:
# - deploy-web.yml (deploy web)
# - build-mobile.yml (build and submit mobile apps)
```

---

## Workflow Customization

### Change Node Version

Edit any workflow file:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20.x'  # Change to desired version
```

### Add Slack Notifications

Install Slack GitHub app, then add to workflows:

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1.24.0
  with:
    payload: |
      {
        "text": "Deployment successful!"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Add Discord Notifications

```yaml
- name: Notify Discord
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    title: "Deployment Complete"
    description: "Web app deployed successfully"
```

---

## Troubleshooting

### Workflow Fails on npm ci

**Issue**: Dependencies not installing
**Solution**: Delete `node_modules` and `package-lock.json`, run `npm install`, commit new lock file

### EAS Build Fails

**Issue**: `EXPO_TOKEN` invalid
**Solution**: Regenerate token at https://expo.dev/accounts/[account]/settings/access-tokens

### Playwright Tests Timeout

**Issue**: Web server not starting
**Solution**: Increase timeout in `wait-on` command or check build errors

### Permission Denied on Push

**Issue**: GitHub Actions can't push
**Solution**: Ensure `GITHUB_TOKEN` has write permissions in repo settings

---

## Best Practices

1. **Run tests before deploy**: All workflows run tests before deploying/building
2. **Use caching**: Workflows cache npm dependencies for faster runs
3. **Separate concerns**: Different workflows for CI, deployment, and releases
4. **Manual approvals**: Consider adding manual approval for production deployments
5. **Notifications**: Set up notifications for failed workflows
6. **Status badges**: Add to README.md to show build status

---

## Adding Status Badges to README

```markdown
# Looper

![CI](https://github.com/USERNAME/android-looper/workflows/CI/badge.svg)
![Deploy](https://github.com/USERNAME/android-looper/workflows/Deploy%20Web/badge.svg)
![E2E Tests](https://github.com/USERNAME/android-looper/workflows/E2E%20Tests/badge.svg)
```

Replace `USERNAME` with your GitHub username.

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Expo GitHub Actions](https://docs.expo.dev/build/building-on-ci/)
- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)
- [Netlify GitHub Integration](https://docs.netlify.com/configure-builds/get-started/)
