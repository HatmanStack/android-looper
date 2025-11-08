# Phase 9: Build Configuration & Deployment

## Phase Goal

Configure production builds for all platforms (web, Android, iOS), set up deployment pipelines, create app store assets, and deploy the application. Prepare for production release with proper configuration, optimization, and documentation.

**Success Criteria:**
- Production web build deployed
- Android APK/AAB built and ready for Play Store
- iOS IPA built and ready for App Store
- All app store assets prepared
- CI/CD pipeline configured
- Documentation complete

**Estimated tokens:** ~85,000

---

## Prerequisites

- Phase 8 completed (all testing done, app is stable)
- Expo account with EAS Build access
- Apple Developer account (for iOS)
- Google Play Developer account (for Android)

---

## Tasks

### Task 1: Configure Production Environment

**Goal:** Set up environment configuration for production builds.

**Files to Create:**
- `.env.production` - Production environment variables
- `app.config.ts` - Dynamic app configuration
- `eas.json` - EAS Build configuration

**Implementation Steps:**

1. Create environment configurations:
   - Development (`.env.development`)
   - Staging (`.env.staging`)
   - Production (`.env.production`)

2. Configure app.config.ts:
   - Load environment-specific values
   - Set API endpoints (if any)
   - Configure analytics (if using)
   - Set app version and build number

3. Create eas.json:
   ```json
   {
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal"
       },
       "preview": {
         "distribution": "internal"
       },
       "production": {
         "autoIncrement": true
       }
     }
   }
   ```

4. Configure native module plugins:
   - FFmpeg configuration
   - expo-av configuration
   - Any other native dependencies

5. Set version numbers:
   - app.json version: "1.0.0"
   - iOS build number
   - Android versionCode

**Verification Checklist:**
- [ ] Environment configs created
- [ ] app.config.ts dynamic configuration works
- [ ] eas.json configured correctly
- [ ] Version numbers set

**Commit Message Template:**
```
chore(config): configure production environment

- Create environment configuration files
- Set up dynamic app configuration
- Configure EAS Build profiles
- Set version numbers for release
```

**Estimated tokens:** ~10,000

---

### Task 2: Optimize Web Build

**Goal:** Create optimized production build for web.

**Files to Create:**
- `webpack.config.js` - Custom webpack config (if needed)
- Build optimization scripts

**Implementation Steps:**

1. Configure Expo web build:
   - Run `expo build:web`
   - Optimize bundle size
   - Enable code splitting

2. Optimize assets:
   - Compress images
   - Optimize fonts
   - Lazy load FFmpeg WASM

3. Configure PWA (optional):
   - Service worker
   - Offline support
   - App manifest
   - Icons

4. Set up CDN (if using):
   - Configure asset hosting
   - Set cache headers
   - Enable compression (gzip/brotli)

5. Test production build locally:
   - Serve build directory
   - Verify all features work
   - Check performance

6. Analyze bundle:
   - Use webpack bundle analyzer
   - Identify large dependencies
   - Optimize imports

**Verification Checklist:**
- [ ] Production build completes
- [ ] Bundle size optimized
- [ ] All features work in prod build
- [ ] Performance acceptable
- [ ] PWA configured (if applicable)

**Commit Message Template:**
```
build(web): optimize production web build

- Configure production webpack settings
- Optimize bundle size and code splitting
- Set up PWA configuration
- Compress and optimize assets
- Analyze and reduce bundle size
```

**Estimated tokens:** ~12,000

---

### Task 3: Build Android APK/AAB with EAS

**Goal:** Create production Android builds using EAS Build.

**Files to Modify:**
- `app.json` - Android-specific configuration
- `eas.json` - Android build profile

**Implementation Steps:**

1. Configure Android settings in app.json:
   - Package name: "com.looper.app"
   - Version code (auto-increment)
   - Permissions
   - Icon and splash screen
   - Adaptive icon

2. Set up signing credentials:
   - Generate keystore (EAS can do this)
   - Or provide existing keystore
   - Store credentials securely in EAS

3. Configure FFmpeg for Android:
   - Choose appropriate FFmpeg package
   - Optimize binary size
   - Test on devices

4. Create production build profile:
   ```json
   "production": {
     "android": {
       "buildType": "apk",  // or "app-bundle"
       "gradleCommand": ":app:assembleRelease"
     }
   }
   ```

5. Build with EAS:
   - `eas build --platform android --profile production`
   - Wait for build to complete
   - Download APK/AAB

6. Test APK:
   - Install on physical device
   - Test all features
   - Verify signing
   - Check performance

**Verification Checklist:**
- [ ] Build completes successfully
- [ ] APK/AAB signed correctly
- [ ] All features work on device
- [ ] FFmpeg works in production
- [ ] Performance acceptable

**Commit Message Template:**
```
build(android): configure and create production Android build

- Set up Android configuration in app.json
- Configure EAS Build for Android
- Set up signing credentials
- Create production APK/AAB
- Test on physical devices
```

**Estimated tokens:** ~14,000

---

### Task 4: Build iOS IPA with EAS

**Goal:** Create production iOS build using EAS Build.

**Files to Modify:**
- `app.json` - iOS-specific configuration
- `eas.json` - iOS build profile

**Implementation Steps:**

1. Configure iOS settings in app.json:
   - Bundle identifier: "com.looper.app"
   - Version and build number
   - Permissions (microphone, storage)
   - Icon and splash screen

2. Set up Apple credentials:
   - Apple ID
   - App-specific password
   - Provisioning profile
   - Distribution certificate

3. Configure FFmpeg for iOS:
   - FFmpeg package for iOS
   - Optimize binary size
   - Test on devices

4. Create production build profile:
   ```json
   "production": {
     "ios": {
       "buildConfiguration": "Release"
     }
   }
   ```

5. Build with EAS:
   - `eas build --platform ios --profile production`
   - Wait for build to complete
   - Download IPA

6. Test IPA:
   - Install via TestFlight
   - Test all features
   - Verify signing
   - Check performance

**Verification Checklist:**
- [ ] Build completes successfully
- [ ] IPA signed correctly
- [ ] All features work on device
- [ ] FFmpeg works in production
- [ ] Performance acceptable

**Commit Message Template:**
```
build(ios): configure and create production iOS build

- Set up iOS configuration in app.json
- Configure EAS Build for iOS
- Set up Apple credentials and certificates
- Create production IPA
- Test on physical devices via TestFlight
```

**Estimated tokens:** ~14,000

---

### Task 5: Create App Store Assets

**Goal:** Prepare all assets needed for app store submissions.

**Files to Create:**
- `assets/store/` - App store assets directory
- App icons, splash screens, screenshots

**Implementation Steps:**

1. Create app icons:
   - iOS: 1024x1024 PNG
   - Android: Adaptive icon (foreground + background)
   - Web: Various PWA icon sizes

2. Create splash screens:
   - iOS: Various sizes for different devices
   - Android: Various densities
   - Web: PWA splash

3. Take screenshots:
   - iPhone: Various sizes (6.5", 5.5")
   - iPad: Various sizes
   - Android: Phone and tablet
   - Web: Desktop and mobile

4. Create promotional graphics:
   - Feature graphic (Android)
   - Promo video (optional)
   - Banner images

5. Write store listings:
   - App name: "Looper"
   - Short description
   - Full description highlighting mixing feature
   - Keywords for search
   - Category: Music
   - Content rating

6. Prepare privacy policy and terms:
   - Privacy policy URL
   - Terms of service URL
   - Data collection disclosure

**Verification Checklist:**
- [ ] All icon sizes created
- [ ] Splash screens for all platforms
- [ ] Screenshots taken for all devices
- [ ] Store listings written
- [ ] Privacy policy prepared

**Commit Message Template:**
```
chore(assets): create app store assets and listings

- Generate app icons for all platforms
- Create splash screens
- Take screenshots for app stores
- Write store descriptions and listings
- Prepare privacy policy
```

**Estimated tokens:** ~12,000

---

### Task 6: Set Up Web Hosting and Deployment

**Goal:** Deploy web build to hosting platform.

**Files to Create:**
- Deployment configuration files

**Implementation Steps:**

1. Choose hosting platform:
   - Vercel (recommended for Expo)
   - Netlify
   - AWS S3 + CloudFront
   - Firebase Hosting

2. Configure deployment:
   - Connect git repository
   - Set build command: `expo build:web`
   - Set output directory: `web-build`

3. Set up custom domain (optional):
   - Configure DNS
   - Set up SSL certificate
   - Configure CNAME/A records

4. Configure environment variables:
   - Production API keys (if any)
   - Analytics IDs
   - Feature flags

5. Set up continuous deployment:
   - Deploy on push to main branch
   - Preview deployments for PRs
   - Automatic rollback on errors

6. Test deployment:
   - Visit deployed URL
   - Test all features
   - Verify HTTPS
   - Check performance

**Verification Checklist:**
- [ ] Web app deployed successfully
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled
- [ ] All features work
- [ ] Continuous deployment configured

**Commit Message Template:**
```
deploy(web): set up web hosting and deployment

- Deploy to [hosting platform]
- Configure custom domain
- Set up continuous deployment
- Configure production environment variables
- Verify deployment and features
```

**Estimated tokens:** ~11,000

---

### Task 7: Submit to Google Play Store

**Goal:** Submit Android app to Google Play Store.

**Implementation Steps:**

1. Create Google Play Console account:
   - Sign up (one-time $25 fee)
   - Verify account

2. Create app in Play Console:
   - App name: "Looper"
   - Default language
   - Type: App
   - Category: Music & Audio

3. Complete app details:
   - Short description
   - Full description
   - Graphics (screenshots, icon, feature graphic)
   - Categorization
   - Contact details

4. Set up pricing and distribution:
   - Free or paid
   - Countries
   - Content rating (fill questionnaire)

5. Upload AAB:
   - Create production release
   - Upload AAB from EAS Build
   - Add release notes

6. Complete content rating:
   - ESRB, PEGI, etc.
   - Answer questionnaire honestly

7. Review and publish:
   - Review all sections
   - Submit for review
   - Wait for approval (can take days)

**Verification Checklist:**
- [ ] App created in Play Console
- [ ] All details filled
- [ ] Screenshots and graphics uploaded
- [ ] AAB uploaded
- [ ] Content rating completed
- [ ] Submitted for review

**Commit Message Template:**
```
chore(release): submit Android app to Google Play Store

- Create app in Google Play Console
- Upload production AAB
- Add store listing and assets
- Complete content rating
- Submit for review
```

**Estimated tokens:** ~10,000

---

### Task 8: Submit to Apple App Store

**Goal:** Submit iOS app to Apple App Store.

**Implementation Steps:**

1. Create App Store Connect account:
   - Enroll in Apple Developer Program ($99/year)
   - Agree to agreements

2. Create app in App Store Connect:
   - App name: "Looper"
   - Bundle ID: com.looper.app
   - SKU: unique identifier
   - Primary language

3. Complete app information:
   - Subtitle
   - Description highlighting mixing feature
   - Keywords
   - Category: Music
   - Content rights

4. Upload build:
   - Use Transporter app or Xcode
   - Upload IPA from EAS Build
   - Wait for processing

5. Add screenshots and previews:
   - iPhone screenshots (required sizes)
   - iPad screenshots
   - App preview videos (optional)

6. Set pricing and availability:
   - Price tier (free)
   - Countries
   - Release date

7. Complete age rating:
   - Fill out questionnaire
   - Get rating

8. Submit for review:
   - Review all info
   - Submit
   - Respond to review feedback if needed
   - Wait for approval (can take days/weeks)

**Verification Checklist:**
- [ ] App created in App Store Connect
- [ ] Build uploaded and processed
- [ ] All details filled
- [ ] Screenshots uploaded
- [ ] Age rating completed
- [ ] Submitted for review

**Commit Message Template:**
```
chore(release): submit iOS app to Apple App Store

- Create app in App Store Connect
- Upload production IPA
- Add store listing and assets
- Complete age rating
- Submit for review
```

**Estimated tokens:** ~12,000

---

### Task 9: Set Up CI/CD Pipeline

**Goal:** Automate builds and deployments with CI/CD.

**Files to Create:**
- `.github/workflows/` - GitHub Actions workflows
- Or equivalent for other CI platforms

**Implementation Steps:**

1. Set up GitHub Actions (or similar):
   - Workflow for running tests
   - Workflow for building web
   - Workflow for EAS builds

2. Configure test workflow:
   - Run on every PR
   - Run unit tests
   - Run integration tests
   - Check coverage
   - Lint and type-check

3. Configure web deployment:
   - Build on merge to main
   - Deploy to hosting platform
   - Run E2E tests on deployment

4. Configure mobile builds:
   - Trigger EAS builds on tags
   - Build for internal testing
   - Notify on build completion

5. Set up secrets:
   - Expo token
   - API keys
   - Signing credentials (if needed)

6. Add status badges:
   - Build status
   - Test coverage
   - Deployment status

**Verification Checklist:**
- [ ] CI/CD pipeline configured
- [ ] Tests run automatically
- [ ] Web deploys automatically
- [ ] Mobile builds triggered
- [ ] Secrets configured securely

**Commit Message Template:**
```
ci: set up CI/CD pipeline with GitHub Actions

- Add workflow for automated testing
- Configure automatic web deployment
- Set up EAS Build triggers
- Add status badges to README
- Configure secrets securely
```

**Estimated tokens:** ~11,000

---

### Task 10: Final Documentation and Launch

**Goal:** Complete all documentation and launch the app.

**Files to Create:**
- `Migration/README.md` - Main project README
- `docs/user-guide.md` - User guide
- `docs/developer-guide.md` - Developer documentation
- `CHANGELOG.md` - Version history

**Implementation Steps:**

1. Write comprehensive README:
   - Project overview
   - Features (highlight mixing)
   - Installation instructions
   - Development setup
   - Contributing guidelines
   - License

2. Create user guide:
   - How to record audio
   - How to import audio
   - How to control playback
   - How to mix tracks
   - How to export
   - Troubleshooting

3. Create developer documentation:
   - Architecture overview
   - Code structure
   - How to build
   - How to test
   - How to deploy

4. Create changelog:
   - Document all features
   - Note migration from Android
   - List known issues

5. Prepare launch announcement:
   - Blog post or announcement
   - Social media posts
   - Demo video
   - Migration guide for Android users

6. Monitor launch:
   - Watch for crashes (use crash reporting)
   - Monitor app store reviews
   - Respond to user feedback
   - Fix critical issues quickly

**Verification Checklist:**
- [ ] README complete
- [ ] User guide written
- [ ] Developer docs complete
- [ ] Changelog created
- [ ] Launch materials prepared
- [ ] Monitoring set up

**Commit Message Template:**
```
docs: complete final documentation and prepare for launch

- Write comprehensive README
- Create user and developer guides
- Add changelog and version history
- Prepare launch announcement materials
- Set up post-launch monitoring
```

**Estimated tokens:** ~9,000

---

## Phase Verification

### Final Checklist Before Launch

1. **Builds:**
   - [ ] Web deployed and accessible
   - [ ] Android APK/AAB working
   - [ ] iOS IPA working
   - [ ] All builds tested

2. **App Stores:**
   - [ ] Google Play listing complete
   - [ ] App Store listing complete
   - [ ] Both submitted for review
   - [ ] Assets uploaded

3. **Quality:**
   - [ ] All tests passing
   - [ ] No critical bugs
   - [ ] Performance acceptable
   - [ ] Accessibility verified

4. **Documentation:**
   - [ ] README complete
   - [ ] User guide available
   - [ ] Developer docs available
   - [ ] Changelog created

5. **Infrastructure:**
   - [ ] CI/CD working
   - [ ] Monitoring set up
   - [ ] Error tracking configured
   - [ ] Analytics configured (if using)

---

## Post-Launch Tasks

1. Monitor crash reports and fix critical issues
2. Respond to app store reviews
3. Gather user feedback
4. Plan future updates
5. Continue testing on new devices/OS versions

---

## Migration Complete

Congratulations! The Looper app has been successfully migrated from Android (Java) to React Native (Expo) with:

✅ **Feature Parity:** All Android features replicated
✅ **New Feature:** True audio mixing and export
✅ **Cross-Platform:** Web, Android, and iOS support
✅ **Production Ready:** Deployed and submitted to app stores

---

## Future Enhancements

Consider for future versions:
- Real-time mixing preview
- Additional audio effects (reverb, EQ)
- Cloud storage integration
- Collaboration features
- More export formats
- Waveform visualization
- MIDI support
