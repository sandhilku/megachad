# Workout Tracker — customizable plans

Open `index.html` to use the app. No build step or package installation is required. Keep `app.js`, `custom.css`, `manifest.json`, `sw.js` and the icon files beside it. For PWA installation and service-worker offline caching, serve the folder on HTTPS or localhost; direct file opening supports the main tracking features.

## Customize your training

- **Plan → Plan name** renames the whole plan. The pencil beside a day edits its name, focus and category, including names such as “Day 2 — Push”.
- Edit an exercise's set count directly, or use **− set / ＋ set** on Today. Supported range: 1–100 sets per exercise. Exercise names and rep targets are editable too.
- Use the up/down buttons to reorder exercises or days. Add, duplicate and remove workout days; cycles can have 1–31 days. Draft sets follow exercise IDs, so reordering does not move your entered weights onto a different exercise.
- **Quick select** includes full body, upper/lower, push/pull/legs, 5 × 5 basics, home bodyweight, gentle home basics, and home dumbbell templates. Templates replace the current plan only after confirmation; workout history remains. All template content is editable.

## Log and review

Enter weight and reps; valid sets tick automatically. Click ✓ to untick or re-tick a set. Each input and tick change saves immediately on this device, and reopening the app restores the unfinished session. Use Save Workout to finish and add it to History. For unweighted exercises use **0** for the weight. Home bodyweight templates prefill zero. Only completed, valid sets are recorded; unfinished inputs remain drafts until the workout is saved. Drafts survive day changes and reloads.

Progress defaults to **cumulative completed sets**, which naturally rises as you train. Other views include cumulative workouts, session volume, cumulative lifted volume, body weight, and exercise-specific weight/reps/estimated 1RM. Dates and values come from your logs; no sample improvement is fabricated. Data tables accompany the charts. A graph begins after your first logged workout.

Backups include the plan, plan name, history, body weight, units, selected day and drafts. Imports are validated before replacing data. History edits and deletions recalculate personal records.

## Body weight tracker

Use the **Body Weight** tab to add today's weight or a backdated measurement, edit or delete entries, and see starting/current weight and net change. Switch between kg and lbs without changing the underlying kg records. The graph shows actual measurements with all-time, 30-day, 90-day, and one-year ranges, plus a data table. Its labeled vertical axis fits the measurements to reveal smaller changes. No workout logs are required. Existing Settings weight entries appear here automatically; the most recent remaining measurement supplies bodyweight ratios. Weight logs are included in JSON backups and saved locally in this browser, so export a backup before clearing browser data.

## Fixes and validation

Fixed set-button targeting, bodyweight zero-set logging, stale personal records, missing custom exercises in PRs, draft loss/mismatches during reordering, inconsistent unit displays, implicit global-event navigation, unsafe user-text interpolation, incomplete backup restoration/validation, timer completion controls, offline chart dependencies, overly broad service-worker cache cleanup, and oversized calendar empty cells on mobile.

Validated with 21 automated browser workflows in an isolated Edge session, including a 390px mobile viewport, offline reload, and direct-file use. Physical iOS/Android devices were not tested. Browser notifications can be delayed while a phone suspends the app; the timer catches up on resume.

Training templates are editable starting points, not a popularity ranking or a personalized prescription. References: [ACSM](https://acsm.org/resistance-training-guidelines-update-2026/) and [NHS home strength exercises](https://www.nhs.uk/live-well/exercise/strength-exercises/).
