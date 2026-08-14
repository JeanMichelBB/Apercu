# Fictional Timeline Rotation — Design

**Date:** 2026-08-14
**Status:** Approved for planning

## Problem

Seed data for events and blog posts uses fixed, hardcoded dates (e.g. `datetime(2026, 6, 15, 9, 0)`). As real time passes, the whole seeded dataset drifts stale — events that were "future" become past all at once, and there's no signal that a past event actually happened (it just still reads as upcoming). The site needs to look actively maintained "right now," regardless of when it's viewed, without manual date edits.

## Scope

- 20 fictional **events**, 20 fictional **blog posts** — independent pools, no shared items.
- Only affects seeded/fictional content. Real events and posts created by organizers/admins through the app are untouched.

## Data model changes

Two additions in `fastapi-backend/database/models.py`:

- `Event.day_offset` (Integer, nullable) — signed day offset from "today" (e.g. `-14`, `+30`). Set only on the 20 fictional seed events. Real events created by organizers leave this `NULL` and keep their own literal `date` untouched by rotation.
- `BlogPost.published_date` (DateTime, nullable) — the date shown to readers, separate from `created_at` (which remains the DB-insert timestamp, irrelevant to display).
- `BlogPost.day_offset` (Integer, nullable) — same rotation mechanism as events, applied to `published_date`.

No new tables. Existing `status` (events: draft/pending/published/rejected) and `published` (posts) fields are unchanged — this design only affects *when* something appears to have happened, not its moderation state.

## Rotation mechanism

New function in `fastapi-backend/seed.py`:

```python
def refresh_seeded_dates(db):
    today = datetime.now()
    for e in db.query(Event).filter(Event.day_offset.isnot(None)):
        e.date = today + timedelta(days=e.day_offset)
    for p in db.query(BlogPost).filter(BlogPost.day_offset.isnot(None)):
        p.published_date = today + timedelta(days=p.day_offset)
    db.commit()
```

Called from `main.py`'s startup lifespan on **every** boot (not just when the DB is empty, unlike the existing `seed_if_empty`). Cheap (≤20 row updates per table). Guarantees that whenever the backend restarts, event dates and post published dates are recalculated relative to the actual current date. Dates don't move between restarts — acceptable for a fictional demo site; a restart (deploy, or a manual restart before a demo) is what keeps it fresh, not a background clock or scheduler.

Wrapped in the same try/commit pattern as `seed_if_empty` — if it fails, log and continue rather than crashing the app over stale demo dates.

The `.filter(day_offset.isnot(None))` guard is the safety boundary that keeps real, organizer-created content untouched.

## Status display

- **Events**: no new stored field. A computed check (`event.date < now()`) drives a **"Completed"** badge shown next to the existing status on `EventsPage.jsx` and `EventDetailPage.jsx`. Purely additive — doesn't touch the draft/pending/published/rejected moderation flow.
- **Blog posts**: no "past/future" or completed concept — posts don't "finish." `BlogDetailPage.jsx` and post-listing components display `published_date` when present, falling back to `created_at` for real posts that never got a `day_offset`.

## Seed content plan

Replace `_build_events()` and `_build_posts()` in `seed.py`.

**Events — 20 total:**
- 15 active, `status="published"`:
  - 5 past: offsets `-60, -40, -25, -14, -5`
  - 10 future: offsets `+3, +7, +14, +21, +30, +45, +60, +75, +90, +120`
- 5 reserve, `status="draft"` (invisible to public listings/AdminEvents by virtue of existing draft filtering): written now with placeholder `day_offset` values, dormant — not activated in this phase. Reserved for a future rotation phase that swaps them into the active pool.

**Blog posts — 20 total**, all `published=True`, offsets spread roughly biweekly-to-monthly into the past (e.g. `-3, -7, -14, -21, -28, -35, -45, -55, -65, -75, -90, -105, -120, -135, -150, -165, -180, -200, -220, -240`) so the blog reads as continuously active over the last ~8 months. No future posts — out of scope per decision below.

Exact copy (titles/descriptions) follows the existing tone in the current seed file (tech/conference/Montreal scene) — drafted during implementation, not fixed in this spec.

## Explicitly out of scope

- Blog posts with future `published_date` / "Scheduled" status — decided against; all posts are past-dated only.
- Activating/rotating the 5 reserve events — deferred to a future phase.
- Any scheduled/cron-based date refresh — restart-triggered refresh only.
- Automated tests for seed data — none exist today; verification is manual via the running app.

## Testing

- Manual: `python seed.py --force` to wipe and reseed, then restart the backend (or temporarily edit `day_offset` values to simulate elapsed time) to confirm the 5-past/10-future split and "Completed" badge behave correctly.
- Consistent with how existing seed data is currently validated in this project (no automated seed tests).
