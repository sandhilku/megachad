# Workout Tracker — customizable plans

Open `index.html` to use the app. No build step or package installation is required. Keep `app.js`, `custom.css`, `manifest.json`, `sw.js` and the icon files beside it. For PWA installation and service-worker offline caching, serve the folder on HTTPS or localhost; direct file opening supports the main tracking features.

## Customize your training

- On phones, each workout day starts collapsed. Tap its header to show or hide its exercises and editing controls. The working day stays expanded through set edits, additions and reordering; desktop starts expanded.
- **Plan → Plan name** renames the whole plan. The pencil beside a day edits its name, focus and category, including names such as “Day 2 — Push”.
- Edit an exercise's set count on the **Plan** page. Set counts are read-only on Today. Supported range: 1–100 sets per exercise. Exercise names and rep targets are editable too.
- Use the up/down buttons to reorder exercises or days. Add, duplicate and remove workout days; cycles can have 1–31 days. Draft sets follow exercise IDs, so reordering does not move your entered weights onto a different exercise.
- **Quick select** includes full body, upper/lower, push/pull/legs, 5 × 5 basics, home bodyweight, gentle home basics, and home dumbbell templates. Templates replace the current plan only after confirmation; workout history remains. All template content is editable.

## Exercise quick select

In Plan, **Add Exercise** and **Edit Exercise** suggest names as you type. Exercises already in your plan appear first, followed by past workout names and 110 common gym/home exercise names. Partial words and aliases such as `RDL`, `lat pull down`, and `machine preach` work. Existing exercises in the target day are excluded to avoid duplicate entries, and duplicate catalogue names are merged.

Select with a tap or Arrow keys + Enter. Escape closes suggestions, and Tab moves to the next field. You can always type a custom name. Selecting an exercise from your plan fills empty set/rep fields for a new exercise; values you already entered and existing edit values are preserved. Suggestions work offline and are built from current plan/history data, so exercises added to Pull are immediately reusable on Upper. No additional account, online search or external exercise API is required.

The built-in names are a common starter list, not a statistical popularity ranking. General exercise-name references: [ACE exercise library](https://www.acefitness.org/resources/everyone/exercise-library/) and [NHS strength exercises](https://www.nhs.uk/live-well/exercise/strength-exercises/). The picker supplies names, not individualized training advice.

## Log and review

Enter weight and reps; valid sets tick automatically. Click ✓ to untick or re-tick a set. Each input and tick change saves immediately on this device, and reopening the app restores the unfinished session. Use Finish Workout to finish and add it to History. For unweighted exercises use **0** for the weight. Home bodyweight templates prefill zero. Only completed, valid sets are recorded; unfinished inputs remain drafts until the workout is saved. Drafts survive day changes and reloads.

Progress defaults to **cumulative completed sets**, which naturally rises as you train. Other views include cumulative workouts, session volume, cumulative lifted volume, body weight, and exercise-specific weight/reps/estimated 1RM. Dates and values come from your logs; no sample improvement is fabricated. Data tables accompany the charts. A graph begins after your first logged workout.

Backups include the plan, plan name, history, body weight, units, selected day and drafts. Imports are validated before replacing data. History edits and deletions recalculate personal records.

## Body weight tracker

Use the **Body Weight** tab to add today's weight or a backdated measurement, edit or delete entries, and see starting/current weight and net change. Switch between kg and lbs without changing the underlying kg records. The graph shows actual measurements with all-time, 30-day, 90-day, and one-year ranges, plus a data table. Its labeled vertical axis fits the measurements to reveal smaller changes. No workout logs are required. Existing Settings weight entries appear here automatically; the most recent remaining measurement supplies bodyweight ratios. Weight logs are included in JSON backups and saved locally in this browser, so export a backup before clearing browser data.

## Day streak with rest-day protection

The Calendar and Stats show a calendar-day streak **anchored to finished workouts**. Before any workout is finished it is zero. The first finished workout is day 1, regardless of when the app was first opened. Opening the app, auto-ticking valid sets, midnight, rest days and unfinished drafts do not increase the number. It advances only when Finish Workout records another distinct training date. Rest days between finished workouts are credited then. For example: finish Tuesday = 1; open Wednesday or enter draft sets = still 1; finish Wednesday = 2. A Thursday rest holds at 2, and finishing Friday makes it 4 by crediting Thursday too. Repeated finishes on one date do not add days.

First partial week gets grace from the first actual finished workout: Tuesday protects Tuesday–Sunday, Saturday protects Saturday–Sunday. The counter still holds through the most recent finish. The normal weekly target starts the following Monday; Monday starts use the full-week goal. The older trackingStartedOn field remains in backups and is used for catch-up suggestions, but cannot award streak days before a completed workout.

Keep the streak by reaching your plan's required training-day count in each Monday–Sunday week after the first partial week. A missed Friday can be made up on Saturday or Sunday. An unfinished current week preserves the existing streak through Sunday; a missed full weekly goal resets it on the following Monday. After a break, the first new finish starts at 1. Best secured uses goal-met/protected weeks and is also capped at actual finished dates. Goal-met weeks are highlighted in month/year calendars, with weekly results and progress above the calendar.

Targets follow required plan days with exercises, excluding rest/optional/empty days and capped at seven distinct dates per week. Plan changes affect the current week onward; recorded targets for earlier weeks are retained in backups. Older logs use the current plan's goal where earlier versions did not record one. Local calendar dates are counted using UTC-normalized date keys, avoiding daylight-saving hour differences. The corrected streak derives from existing completed history, so upgrades and backup restores need no re-logging or destructive migration.

Regression checks reproduce the reported Monday app start / Tuesday first Push / Wednesday open case as a 1-day streak. The six-month simulation records 130 workouts and 18 weekend make-ups: on its final Sunday, a Saturday last finish holds at 181 rather than automatically increasing to 182. Missing a full week still breaks the streak, and duplicate dates do not inflate it.

## Optional missed-day adjustments

On Today, select your next planned workout. If an earlier workout is unlogged, the app can offer an **Upper Body** session to combine missed Pull with Push (or vice versa), or a **Full Body** session to include a missed Legs day with an upper-body workout. Suggestions follow plan order starting Monday, for cycles of up to seven days. Days before tracking began, future workouts, logged days and rest/optional days do not trigger suggestions.

**Preview** shows exercises from both original workouts. Select the ones you want, then **Apply for this workout**. Set counts and rep targets come from your plan. The permanent plan stays unchanged; **Restore original** brings back its draft. Adjusted drafts persist on reload, are included in backups and expire at the end of the week. Plan edits invalidate an outdated adjustment. A combined session counts as one training date toward the weekly target. A missed source day is marked covered only if at least one exercise from it is actually logged. Keeping the original dismisses that suggestion for the week.

## Plan a known absence

Use **Plan an absence** on Today or Calendar. Choose the unavailable date/workout and the date/workout you can attend, within the same Monday–Sunday week. Dates can be today or in a future week. Defaults follow plan order from Monday; choose different workouts if needed.

Examples: Monday Pull + unavailable Tuesday Push becomes an optional **Upper Body** session on Monday. Thursday Upper + unavailable Friday Legs becomes an optional **Full Body** session on Thursday. Preview the exercises, then schedule the mix. The permanent plan and weekly training-day target stay unchanged; the combined session counts as one actual training date.

Scheduled mixes are listed on Today and Calendar and included in backups. They activate on their training date, keep unfinished drafts through that week, and expire the following Monday. Cancel a plan to restore the original workout and its draft. Replacing a mix requires confirmation. Already logged workouts, invalid pairs, past dates and cross-week dates are rejected.

## App updates and caching

HTML references versioned JavaScript and CSS so a newer page cannot reuse old unversioned files from the browser cache. The service worker preloads the exact versioned URLs using fresh requests and revalidates runtime responses. Worker updates bypass the browser HTTP cache. Updates preserve local workout data; clearing site storage is not required.

## Fixes and validation

Fixed set-button targeting, bodyweight zero-set logging, stale personal records, missing custom exercises in PRs, draft loss/mismatches during reordering, inconsistent unit displays, implicit global-event navigation, unsafe user-text interpolation, incomplete backup restoration/validation, timer completion controls, offline chart dependencies, overly broad service-worker cache cleanup, and oversized calendar empty cells on mobile.

Validated with 57 automated browser workflows in isolated Edge sessions, including mobile layout, offline reload, direct-file use, weekend make-ups, partial-week grace, missed-week resets, backups, year boundaries, daylight saving, catch-up preview/apply/restore, draft recovery and automatic expiry. A Pixel 5 touch emulation also reproduces cached old CSS/JavaScript alongside new HTML and verifies the upgrade without losing drafts. Physical iOS/Android devices were not tested. Browser notifications can be delayed while a phone suspends the app; the timer catches up on resume.

Training templates are editable starting points, not a popularity ranking or a personalized prescription. References: [ACSM](https://acsm.org/resistance-training-guidelines-update-2026/) and [NHS home strength exercises](https://www.nhs.uk/live-well/exercise/strength-exercises/).

## Full backups and plan sharing

Settings exports/restores all saved app data, including workout history (the source of stats and graphs), records, streak goals and tracking start, body weight, the active plan, unfinished sets, scheduled adjustments, units and saved preferences. Older backups remain supported. Browser notification permissions are controlled by the device.

Plan has compact Export Plan / Import Plan buttons. A plan-only JSON contains its name, days, exercise order, sets and rep targets; no personal history or measurements. Import asks before replacing the plan, clearing unfinished sets and scheduled adjustments. History and measurements stay saved. Use Settings to restore a full backup. Invalid files are rejected before any changes; storage-write failures roll back previous values.

## Saved plans in Quick select

Save Plan adds the named active plan to Your saved plans. Exercise and day edits update its saved entry. Imports also join the list automatically; importing or selecting another plan retains the previous plan in Quick select, while clearing unfinished sets and scheduled adjustments after confirmation. Saved history and measurements stay unchanged. Same-name different plans receive a numbered suffix; identical imports are reused. Existing installations automatically retain their active plan when upgrading. Full backups (version 7) include all saved plans and the active selection; older backups restore their active plan into the list.

## Owner analytics (Umami Cloud)

Usage analytics is configured for the owner's Umami website ID `13928003-0448-4537-979d-b70a50422747`. This is a public tracking ID, not a login credential. The private dashboard is available by signing in at https://cloud.umami.is/. Do not enable a public Share URL unless you want to publish analytics.

Collection runs only at `https://sandhilku.github.io/megachad/` and its `index.html` URL. Local files, development servers, other paths, offline actions, browser Do Not Track / Global Privacy Control and the Settings opt-out are excluded. Existing local workout history is never uploaded or replayed. Collection begins after this build is approved and published; browser blockers and offline use can make counts lower than actual usage.

One manual pageview is sent per page load. The following fixed custom events measure usage:

- `Workout Saved`: a successful completed-workout save.
- `First Workout Saved`: the first save with no previous history, guarded by a browser-local marker. This measures first-use activation, not registered-user signups or reliable cross-device identity.
- `Plan Saved`, `Plan Imported`, `Plan Applied`: successful explicit actions, not routine plan autosaves or cancelled imports.
- `View Today`, `View History`, `View Calendar`, `View PRs`, `View Stats`, `View Progress`, `View Body Weight`, `View Plan`, `View Settings`: actual tab changes; rerendering the same tab does not count again.

Use the Umami website Overview for daily/weekly visitors, visits, pageviews and event totals. Use Events or Goals for Workout Saved / First Workout Saved conversions, and compare date ranges to follow growth. No dashboard credentials or private analytics API key are included in the static app.

Tracker auto-collection is disabled. A before-send allowlist limits outgoing events to the public website ID, fixed host/path/title, referrer origin (without its path/query), browser language, screen dimensions and the fixed event name. No plan names, exercise names, body weights, workout sets/reps, file contents, query parameters, URL fragments, user IDs, session replays or error traces are sent. Umami receives normal network/browser metadata when requests reach its service; this is usage analytics, not a fitness-data upload. The tracker is loaded without a referrer header.

Settings → Usage Analytics lets each browser disable sharing. This preference and the first-workout marker are intentionally device-local and excluded from workout backups so a restore cannot turn sharing back on. The app does not queue offline events. A blocked or failed tracker never blocks logging, editing, import/export or offline app installation. The worker does not cache or prefetch Umami's remote tracker.

References: [Umami tracker configuration](https://docs.umami.is/docs/tracker-configuration), [manual tracker functions](https://docs.umami.is/docs/tracker-functions), [Umami Cloud free Hobby plan](https://docs.umami.is/docs/cloud/faq).

Verified with the real public Umami tracker in isolated Edge/Pixel browser tests; all analytics requests were intercepted locally and no test traffic was sent to the owner's dashboard.

## Analytics delivery diagnostics and installed-app recovery

Settings distinguishes sharing permission from delivery. It reports tracker-load failures, offline/local previews, Do Not Track / Global Privacy Control exclusions, Umami's filtered response, HTTP rejection and accepted delivery. "Connected" is shown only after a collection response contains Umami's cache/session confirmation; a checked box or loaded script is not treated as proof of recording.

Check connection sends one allowlisted `Connection Check` event through the same Umami tracker, respecting all privacy exclusions. It creates no workout and no additional pageview. A narrow fetch observer reads a clone of the Umami gateway response without changing requests/responses, logging tokens or inspecting other endpoints. Failed attempts do not mark a pageview as accepted. Pending requests time out in the diagnostic UI after ten seconds.

Installed apps retry a failed/not-yet-delivered visit after reconnecting and retry on subsequent app resumes with a one-minute backoff. Offline workout actions are still not replayed. Saving and editing remain independent of analytics. The phone's actual cause cannot be identified until its delivery check is run; a recent controlled mobile diagnostic to the live site was accepted by Umami.

## Exercise discovery and illustrated guides

Exercises is a new standalone tab, also reachable through Plan → Browse exercises or the Add Exercise editor. An interactive front/back SVG muscle selector and search, equipment and experience filters browse 618 strength/powerlifting exercises with available instructions. Filters match primary and secondary muscles. Results are paginated, and free-text custom exercises still work.

Open a guide for position illustrations, primary/supporting muscles, experience level and step-by-step instructions. Choose any plan day, press Add to this day, edit sets/rep targets, then confirm Add. The intended day is preserved when browsing from its editor, as are already typed set/rep targets. Repeated exercises are blocked within a day but allowed on another day. Adding to a rest day turns it into a custom training day, as with the normal editor. Saved Quick Select entries update through the existing plan-save path.

A validated optional `libraryId` links added exercises to their guide in Plan and Today. It survives plan export/import, full backups, reordering and app reloads; renaming an exercise to a different movement removes the mismatched reference. The full exercise catalogue also expands name suggestions after the user's own plan/history and the existing common exercise names.

The catalogue, search and written instructions are bundled and precached for offline use. Exercise position images load on demand from the source repository at the pinned revision, without a referrer; missing/offline images have a readable fallback. No entire image collection is downloaded or required to install the app. The workflow was inspired by https://github.com/Snouzy/workout-cool; no code or video assets from that project were copied.

Data and image source: https://github.com/yuhonas/free-exercise-db at commit `f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5`, distributed under the Unlicense/public-domain dedication (included as EXERCISE-DATA-LICENSE.txt). The source's entries without instructions and non-strength categories are excluded. This is an exercise reference, not individualized workout programming.

Deployment now requires **exercise-library-data.js** and **EXERCISE-DATA-LICENSE.txt** alongside the previous nine runtime files. The builder versions the data bundle and adds it to the worker's offline cache. Exercise names, muscle selection and instruction views are not sent to analytics; the existing fixed `View Exercises` tab event measures general feature usage only.

Validation includes touch/keyboard muscle selection, combined filters, empty results, illustrated guide layout, selecting the destination day, editable sets/reps, duplicate prevention, editor handoff, guide links, saved plans/backups, offline guides and mobile/desktop layout.

## Detailed anatomy and refined muscle targets

The original block-shaped map has been replaced with curved anatomical SVG paths adapted from Hicham ELABBASSI's MIT-licensed react-native-body-highlighter at revision `8ed39ac2ae9cb46fb79d77eedec7e5b029a75174`. Required copyright/license text is shipped as BODY-MAP-LICENSE.txt and linked in the exercise library. Front and back appear together by default; Front and Back buttons enlarge a single model. The model includes neutral head/hands/feet details and interactive muscles with keyboard/touch support, accessible names, selected states and focus retained after filtering. The deltoid heads are approximate surface selection zones, not an anatomical diagnostic tool.

Front delts (anterior), side delts (lateral), rear delts (posterior) and obliques have distinct exercise filters. Other labels include biceps/triceps brachii, pectorals, latissimus dorsi, rhomboids/middle traps, spinal erectors, gluteus maximus, quadriceps, hip adductors and hip abductors. Lats and rhomboid/middle-trap regions are separate on the back. A Search muscle combobox beneath the map replaces the three deltoid shortcut buttons. It supports common/anatomical aliases, touch and keyboard selection, no-match feedback, clearing and synchronization with map selection and the existing muscle filter. On phones its suggestions open above the field to remain accessible near the keyboard.

The source exercise dataset groups deltoids broadly. An explicit, inspectable ID-to-target table refines supported raises, presses, reverse flyes, rear-delt rows and rotational-core movements; unknown movements remain in the broad original group rather than being assigned a guessed head. Anterior/side/rear filter results differ, primary targets are ordered before secondary involvement, and cards/guides/search use the refined names. References for shoulder-head distinctions: https://www.acefitness.org/resources/pros/expert-articles/9074/smart-shoulder-solutions-an-evidence-based-approach-to-training-the-deltoids/ and https://pmc.ncbi.nlm.nih.gov/articles/PMC7706677/ . No prescriptions or muscle-activation percentages are generated.

The raw geometry snapshot is kept in anatomy-map.json for the local builder, which embeds it into the already versioned exercise-library-data.js bundle. No React or external anatomy service is needed at runtime, and the complete body map works offline. Deployment/ZIP now contains twelve runtime files: the previous eleven plus BODY-MAP-LICENSE.txt. Test coverage includes both views, every refinement ID, distinct delt matches, proper guide labels, keyboard focus retention, actual clipped-region touch targets, saved plan integration and offline installation.
