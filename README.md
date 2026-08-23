# Life OS — The Hearth

A calm, local-first reflection prototype built around one principle: notice without being defined.

## Current experience

- Hearth / Welcome Home
- Arrival states: Open, Heavy, Distant, Hopeful
- Comfort and Remembrance shortcuts
- Curated adaptive Question Engine
- Text and multiple-choice questions
- Save a reflection without making it a star
- Explicit “Save as star” choice
- Remembrance lanterns
- Zoomable / draggable Night Sky
- Archive of saved reflections
- Local data migration between prototype versions
- JSON backup export
- Installable PWA shell

## Product rules

- Calm comes from restraint, not explanatory UI copy.
- Not every question needs a follow-up.
- Not every saved reflection is a star.
- Stars are chosen by the user.
- Brightness represents meaning, not happiness.
- Patterns are invitations, not conclusions.

## Architecture

- `index.html` — app shell / PWA metadata
- `app.js` — screens and interaction orchestration
- `questions.js` — curated question library and arrival choices
- `storage.js` — versioned persistence, migrations, backups
- `styles.css` — core visual system
- `accessibility.css` — focus states and reduced-motion behavior
- `sw.js` — offline cache
- `manifest.webmanifest` — install metadata
- `docs/heartbook.md` — emotional/product constitution
- `docs/product-principles.md` — product rules and findings
- `docs/question-engine.md` — Question Engine specification
- `docs/review-2026-08-23.md` — current product/technical gap review

## Run locally

Serve the repository over HTTP:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Current storage model

Reflections are normalized as `entries`. Stars contain only spatial/importance metadata plus an `entryId` reference. Older prototype `moments` data is migrated forward automatically.

Current persistence is browser `localStorage`; it is not yet suitable as the sole home for irreplaceable personal history.

## Highest-priority gaps

See `docs/review-2026-08-23.md`. The immediate priorities are data durability/restore, privacy/security design, edit/delete/unstar controls, Question Engine safeguards, and true user-shaped constellations.
