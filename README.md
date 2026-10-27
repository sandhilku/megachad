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

Enter weight and reps; valid sets tick automatically. Click ✓ to untick or re-tick a set. Each input and tick change saves immediately on this device, and reopening the app restores the unfinished session. Use Save Workout to finish and add it to History. For unweighted exercises use **0** for the weight. Home bodyweight templates prefill zero. Only completed, valid sets are recorded; unfinished inputs remain drafts until the workout is saved. Drafts survive day changes and reloads.

Progress defaults to **cumulative completed sets**, which naturally rises as you train. Other views include cumulative workouts, session volume, cumulative lifted volume, body weight, and exercise-specific weight/reps/estimated 1RM. Dates and values come from your logs; no sample improvement is fabricated. Data tables accompany the charts. A graph begins after your first logged workout.

Backups include the plan, plan name, history, body weight, units, selected day and drafts. Imports are validated before replacing data. History edits and deletions recalculate personal records.

## Body weight tracker

Use the **Body Weight** tab to add today's weight or a backdated measurement, edit or delete entries, and see starting/current weight and net change. Switch between kg and lbs without changing the underlying kg records. The graph shows actual measurements with all-time, 30-day, 90-day, and one-year ranges, plus a data table. Its labeled vertical axis fits the measurements to reveal smaller changes. No workout logs are required. Existing Settings weight entries appear here automatically; the most recent remaining measurement supplies bodyweight ratios. Weight logs are included in JSON backups and saved locally in this browser, so export a backup before clearing browser data.

## Day streak with rest-day protection

The Calendar and Stats show a **calendar-day streak including rest days**. Meet a five-workout goal for two complete Monday–Sunday weeks and the streak is 14 days, not 10. Future dates do not count; a current week only contributes the days that have elapsed. Before any workout is logged the streak is zero. No rest-day entries are needed.

**First partial week gets grace.** Starting on Tuesday protects Tuesday–Sunday even if the full weekly target is not reached. A Saturday start protects Saturday–Sunday. The counter begins from the recorded tracking start, and the normal target starts the following Monday. Monday starts use the normal full-week goal. The recorded start is included in backups and does not move forward just because an old workout is deleted.

Keep the streak by reaching your plan's required training-day count in each **Monday–Sunday** week after the first partial week. A missed Friday can be completed on Saturday or Sunday. Multiple saved workouts on the same date count as one training day. An unfinished current week preserves and provisionally extends the streak; it resets at the next Monday only if the previous week's goal was missed. A new active week then starts its own streak. Best secured includes goal-met weeks and the protected first partial week, capped at elapsed days for the current week. Goal-met weeks are highlighted in month/year calendars, with weekly results and current progress above the calendar.

Targets follow required plan days with exercises, excluding rest/optional/empty days and capped at seven distinct dates per week. Plan changes affect the current week onward; recorded targets for earlier weeks are retained and exported in backups. On first upgrade, older logs use the current plan's goal because earlier versions did not record goals. Streaks use this device's local dates. Saving an unfinished draft alone does not log a training day; use Save Workout.

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
