# Static project workflow demos

Every published repository gets a static page at `/<repo>/`. The portfolio and
its case studies link to that page. The demo is an explicitly labelled,
representative workflow simulation; it is not the repository's original frontend
or a deployed copy of its backend. Original source links remain available.

## What visitors can try

- Commerce: search a sample catalog, add/remove cart items, place a simulated
  order and inspect the order history. No payment or personal information.
- Inventory: receive stock, record sales, add products and inspect local activity.
- HR: browse fictional employees, request leave and approve/decline requests.
- Chat: change rooms and post messages locally. No network or real participants.
- Work management: create tasks and move them through a progress board.
- Reading: switch sample passages, adjust reading size and save bookmarks.
- Tracking: generate local sample events and filter the event stream.
- Motion: change an arrangement, adjust duration and pause/play the animation.
- Portfolio: browse sample entries and open their detail views.

`src/lib/demo-catalog.ts` selects the scenario and its fixture data.
`src/components/StaticDemo.tsx` implements interactions and project-scoped browser
storage. `src/app/demos.css` provides the responsive demo interface.

The disclosure at the top of every demo explains the sample-data boundary.
`Reset demo` restores fixtures for that project. Where browser storage is
unavailable, visitors can still interact for the current visit. No backend calls
are made by the demo component. The source-code link is the only external link.

## Deployment

Build and deploy the portfolio's existing Docker Compose service. The new demos
are part of the static Next.js export served by Nginx. No additional containers,
credentials, databases or `DEMO_UPSTREAMS` setting are needed. The legacy upstream
script is no longer included or executed by the Docker image.

At the main domain, Akhyan is at `/ecom-akhyanbd/`, HR at `/HRM_IlhaanSq/`, and chat
at `/chat_application_multi_room_with_django/`. All other published repository
names get the same path convention. Next.js also prefixes these routes correctly
when the portfolio is built for a GitHub Pages subdirectory.

These samples explain product workflows. They do not verify the corresponding
production implementation, authentication, persistence or real-time backend.
