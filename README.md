# Open GuessUp

**Version 1.1.0 · by Gleetch**

**You can't see it. They can't stop laughing.** An offline party game for Android and web, played with a single phone. Built with Expo SDK 58, React Native and TypeScript. An independent Gleetch project with the Confetti palette: pastel red, green, blue and yellow on a cool white background, Outfit typography, and original branding and artwork. [Design notes](docs/DESIGN.md).

[**Download the Android APK 1.1.0**](https://github.com/PaoloConteDev/OpenGuessUp/releases/download/v1.1.0/OpenGuessUp-1.1.0-arm64.apk) · [Release and source code](https://github.com/PaoloConteDev/OpenGuessUp/releases/tag/v1.1.0)

- Quick play or 2–4 teams, with custom names and turn duration.
- 12 categories, 3,600 entries per language and editable custom decks.
- Italian, English, Spanish, French and German.
- Tilt controls on Android; buttons and keyboard controls on the web.
- No account, ads, purchases, tracking or backend required.

<p align="center">
  <img src="docs/screenshots/home-portrait-it.png" width="200" alt="Home screen in portrait orientation" />
  <img src="docs/screenshots/game-portrait-it.png" width="200" alt="Portrait presentation of an actual landscape gameplay screen" />
</p>

The home screen and actual gameplay, presented in portrait format. Turns are played in landscape, as shown in the second preview. The screenshots show the Italian interface.

## Install and update

Download the APK on an **ARM64 phone running Android 7 or later**, open it and allow installation from your chosen source. Expo Go is not required. Content, fonts, artwork and sounds are bundled so you can play offline from the first launch.

If you already installed version 1.0.0 from this repository, install the new APK over it to keep your settings, decks and saved game. Version 1.1.0 uses the same package and signing certificate, so uninstalling is unnecessary. This is a standalone debug-signed build intended for testing and direct installation. SHA-256 checksums are available in the release attachment `SHA256SUMS.txt`.

## What's included in 1.1.0

- The four-color pastel Confetti identity and original 3D home artwork.
- An Android icon matching the home symbol, language flags and the “by Gleetch” signature.
- A consistent version number throughout the interface, read from the app configuration.
- Documentation covering downloads, rules, setup and build instructions.

## Getting started

Requires Node 22.13+ (verified with 22.14) and npm. Native development also requires an Expo SDK 58-compatible client or an APK.

```powershell
git clone https://github.com/PaoloConteDev/OpenGuessUp.git
cd OpenGuessUp
npm.cmd ci
npm.cmd start
```

`npm run web` starts the development web preview. To export and serve a production build:

```powershell
npm.cmd run export:web
npm.cmd run preview
```

Open [127.0.0.1:4174](http://127.0.0.1:4174), or use the [phone preview](http://127.0.0.1:4174/__mobile).

The commands in this README use Windows PowerShell. On macOS or Linux, use `npm` and `npx` without the `.cmd` suffix and adjust the Android SDK and Java paths.

## How to play

1. Select and mix built-in categories and custom decks, or start with the default Animals category.
2. Choose quick play for a single turn, or a match with 2–4 teams. Each team takes one turn per round.
3. Hold the phone **horizontally against your forehead**, with the screen facing your friends. Tap Calibrate: you have 3 seconds to position the phone, then hold still for about a second. Start the countdown; no word appears before the turn begins.
4. Friends follow the category's clue style: describe without saying the answer, act without speaking, sing or hum without naming the artist or title, or impersonate without naming the person. For scenes, guess the whole situation rather than just the character.
5. Tilt **down** for a correct answer (+1) or **up** to pass. Return to the upright neutral position after each gesture. Manual buttons are also available.
6. Review and correct the outcomes before confirming the turn. An unanswered word scores zero. The highest score wins; tied teams share the victory.

In the browser: **↓ correct**, **↑ pass**, **Space pause/resume**. Holding a key does not submit repeated answers. Controls also work with a one-word pool.

| Option | Values |
| --- | --- |
| Turn duration | 30, 45, 60, 90 or 120 seconds |
| Teams | 2, 3 or 4, with editable names |
| Rounds | 1, 3, 5 or 7 per team |
| Correct answer | +1 |
| Pass | 0 by default, optionally −1 |
| Pass limit | Unlimited by default, or 0, 3, 5 or 10 |
| Feedback | Sound and vibration can be disabled separately |

The timer uses an actual deadline rather than counting interval callbacks. Moving the app to the background or losing focus on the web pauses the turn and hides the word. Resuming requires an explicit action and a new countdown. Pauses stop the timer; brief answer feedback still counts toward turn time. Words do not repeat until the pool is exhausted. When reshuffling a pool with more than one entry, the first new word also differs from the previous cycle's last word.

## Categories and languages

**12 categories × 300 entries × 5 languages = 18,000 localized versions of 3,600 entries.** In-app counts come directly from the data.

| Category | Clue style | Entries per language |
| --- | --- | ---: |
| Animals | Acting | 300 |
| Food | Description | 300 |
| Everyday objects | Description | 300 |
| Places | Description | 300 |
| Nature & science | Description | 300 |
| Sports in action | Acting | 300 |
| Music & artists | Singing / imitating instruments | 300 |
| Act it out | Acting | 300 |
| Jobs & mishaps | Impersonation | 300 |
| Fairytales upside down | Impersonation | 300 |
| Feelings on stage | Impersonation | 300 |
| Travel adventures | Free clues | 300 |

Italian, English, Spanish, German and French include the interface, rules, category metadata and entries. The initial language follows the device, with English as the fallback. The flag selector saves your preference. Changing language does not translate an ongoing game: its word snapshot stays in the language it was created in.

Decks include individual words, expressions and complete scenes. Animals, food and some other categories share original vocabulary with Gleetch's Open Taboo project, alongside additional species, dishes, artists and scenes created for Open GuessUp. Scene decks combine characters, actions and constraints: for example, “A vampire visits the dentist” is a whole situation to act out. There are no forbidden-word lists or databases extracted from GuessUp. Automated checks cover localization integrity and duplicates; native-speaker editorial review is still recommended for specialist vocabulary and the phrasing of some scenes.

`src/data/content.json` is self-contained and versioned. IDs are stable hashes of the Italian entry within its category; preserve the ID when correcting a translation. No game content is downloaded during play.

## Custom decks and saved games

Create, edit, recolor and delete decks from Categories. Enter one word or expression per line. Inputs receive Unicode and whitespace normalization and case-insensitive deduplication. Each entry allows up to 100 characters; each deck allows up to 3,000 entries. A name is required. Empty decks can be saved but cannot be selected for play.

Each deck belongs to the language in which it was created. Saved games retain a **complete snapshot** of their words, so renaming or deleting a deck does not affect a resumable game. AsyncStorage uses `@open-guess/state-v1` and `@open-guess/language-v1`. Missing or corrupt saves fall back to safe defaults; write errors are reported without interrupting play. Active turns save a checkpoint every two seconds, so force-closing the app may lose up to two seconds of progress.

## Android sensors and orientation

`expo-sensors` reads the accelerometer at 20 Hz. Tilt is calculated using `atan2(z, hypot(x,y))`, independent of left or right landscape orientation. Calibration gives you 3 seconds to place the phone against your forehead, then measures about one second of stillness. It accepts a stable neutral position within ±35°. After calibration, you can try the gestures before the turn without scoring points.

The filter uses elapsed time with a 90 ms time constant, a ±26° activation threshold, return within ±12° held for 160 ms, and a confirmed tilt held for 80 ms. Each gesture submits one answer. No answers are accepted during preparation, countdown, pause or feedback. The neutral position can be detected during countdown so the first gesture is recognized. Choosing manual controls removes the sensor subscription.

Availability requires real samples. If no data arrives for 2.5 seconds, a sensor-controlled turn pauses. When samples return, availability recovers, but recalibration is required. You can recalibrate, retry or switch to buttons. Subscriptions and timers are cleaned up on exit. Returning from the background reconnects the sensor and requires explicit resumption. The browser provides buttons and keyboard controls only.

`expo-screen-orientation` locks preparation and gameplay to landscape and restores portrait for menus and summaries. Keep-awake keeps the display on during countdown and active play.

**Sensor tests use simulated streams and do not replace testing on a physical phone.** Recording has been removed; camera, microphone and gallery permissions are not requested.

Technical references: [Android sensor coordinates](https://developer.android.com/develop/sensors-and-location/sensors/sensors_overview#sensors-coords) and the [Expo Accelerometer API](https://docs.expo.dev/versions/latest/sdk/accelerometer/). The measurement sign has also been checked against the native module in the installed Expo version.

## Android APK

The ARM64 APK in [release v1.1.0](https://github.com/PaoloConteDev/OpenGuessUp/releases/tag/v1.1.0) is about 30 MB. The local build is `artifacts/OpenGuessUp-1.1.0-arm64.apk`; the complete source archive is attached as `OpenGuessUp-1.1.0-source.zip`. Its signature and metadata have been verified, but this build has not been installed on a physical device during development verification.

App identity: **Open GuessUp**, slug `open-guess`, scheme `openguess`, package `it.gleetch.openguess`, version 1.1.0. No EAS project ID, owner or secrets from Open Taboo are reused. Minimum Android API: 24. Original icons and sounds are bundled.

Public version **1.1.0** corresponds to Android `versionCode` **18**. The home and settings version labels read `app.json` through `src/version.ts`. The internal `versionCode` increases separately to support Android updates.

The [GitHub repository](https://github.com/PaoloConteDev/OpenGuessUp) is also linked from the app settings. Source code, content, fonts and sounds are included in the project; APKs and delivery archives are published as release attachments.

### Cloud build

Requires an Expo account and association with a **new** project:

```powershell
npx.cmd eas-cli login
npx.cmd eas-cli build:configure
npx.cmd eas-cli build --platform android --profile preview
```

The `preview` profile in `eas.json` produces an APK; `production` produces an AAB. Do not reuse another project's publishing credentials.

### Local build

Requires the Android SDK/NDK, CMake and Java 21:

```powershell
npx.cmd expo prebuild --platform android --no-install
$env:JAVA_HOME='C:\Program Files\Android\Android Studio\jbr'
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
cd android
.\gradlew.bat assembleRelease -PreactNativeArchitectures=arm64-v8a --no-daemon --max-workers=2
```

Output: `android/app/build/outputs/apk/release/app-release.apk`. The locally generated Expo project uses the template's debug key, suitable for testing and sideloading. Replace it with a dedicated release key before production distribution. No Open Taboo signing key was read or copied. EAS can manage a new signing key.

On Windows, use a short checkout path such as `C:\og-build` if Ninja reports paths longer than 260 characters. The `scripts/withShortPaths.cjs` config plugin also shortens CMake object paths, but a deeply nested checkout may still require relocation. This ARM64 build targets ARM64 phones; omit `reactNativeArchitectures` to build for other architectures.

**`npm run export:android` creates JavaScript/Hermes bundles and assets, not an APK.** The installed APK is standalone and works offline from the first launch. Expo Go requires Metro during development. The web version does not include a service worker for offline cold starts.

## Verification

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run export:web
npm.cmd run export:android
npm.cmd run preview
# In a second terminal; requires Edge at the standard Windows path
node scripts/smoke.mjs
```

Engine tests cover scoring, penalties, equal turns for 2–4 teams and 1/3/5/7 rounds, ties, expiry, pause/resume, shuffling and minimal pools, simultaneous inputs, outcome corrections, recovery, decks and localized data. Browser checks also cover save/reload, all five languages, bulk entry, keyboard controls and actual timer expiry. Screenshots are in `docs/`; results and limitations are documented in `docs/VALIDATION.md`.

The README gallery is in `docs/screenshots/`: two portrait images at 780 × 1688 px. The home is captured directly from the web preview. The gameplay image contains a real landscape turn inside a vertical presentation with a caption. With the preview server running, regenerate them using `node scripts/screenshots.mjs`. Landscape captures in `docs/` remain available for gameplay verification.

## Project structure

- `App.tsx`: navigation, lifecycle, deadlines and persistence.
- `src/version.ts`: public version from the Expo configuration.
- `src/game/engine.ts`: pure game engine without UI, storage or sensor dependencies.
- `src/game/tilt.ts`: pure filtering and hysteresis.
- `src/hooks/useTilt.ts`: Expo sensor acquisition and calibration.
- `src/game/tiltSession.ts`: sensor lifecycle, calibration and sample recovery.
- `src/screens/`: menus, deck editor, settings and gameplay.
- `src/data/`: local content and custom-deck validation.
- `src/i18n/`: localized strings.
- `scripts/assets.mjs`: regenerates the icon and original synthesized sounds.

## Credits and license

Outfit and Lucide retain their respective licenses; see `THIRD_PARTY_NOTICES.md`. Open GuessUp is not affiliated with Cosmicode or GuessUp. Gameplay references: the [official website](https://cosmicode.games/en/guess-up) and [Google Play listing](https://play.google.com/store/apps/details?id=pt.cosmicode.guessup&hl=it). No GuessUp images, logos, audio tracks or databases are included.

Code is distributed under the [MIT license](LICENSE). [Artwork asset and generation prompt](docs/HERO_ART.md).
