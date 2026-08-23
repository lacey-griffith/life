# Life OS — The Hearth v0.1

This is the first runnable prototype.

## Included
- Welcome Home / Hearth screen
- Arrival states: Open, Heavy, Distant, Hopeful
- Seeded adaptive Question Engine
- Question feedback ("that helped", "more like this", "not right now")
- Remembrance-safe prompt
- "Just light the lantern" memorial action
- Save a reflection as a star
- Zoomable / draggable Night Sky
- Automatically emerging constellation lines by recurring theme
- Archive of saved moments
- Local-first storage using localStorage
- PWA manifest + offline service worker

## Run it
Because the service worker and local storage work best over HTTP, serve the folder locally.

Python:
    python3 -m http.server 8080

Then open:
    http://localhost:8080

On iPhone, once deployed to HTTPS you can use Safari → Share → Add to Home Screen.

## Product rule embedded in v0.1
Star brightness represents meaning, not happiness.

## Not built yet
- Real authentication/sync
- Photos/voice notes
- Calendar anniversary reminders
- Editable constellation names/connections
- True multi-touch pinch zoom
- On-device encryption
- AI reflection/pattern summaries
- Safety/clinical escalation rules
