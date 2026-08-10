# archetype-marquee-ui

The **Marquee** archetype is for any business or organization whose website is organized around
**upcoming events** — a single source of truth for "what's on" and "how do I get in."

Good fits include:

- music venues, listening rooms, jazz clubs
- local bands and touring acts with their own calendar
- art galleries with rotating exhibitions and openings
- community theaters and performance spaces
- festivals and recurring annual events (one event, many sessions)
- comedy clubs, makerspaces, dance studios

The template is **content-flexible**: the sample config is a mixed-use arts hall, but every list
(events, performers, series) can be empty or filled to taste, and the venue-detail fields are
optional so a touring band or pop-up festival can ship without an address.


Apotome archetype for **venues, attractions & events** — independent theaters, regional art galleries, community
performance spaces, music venues, and touring acts whose digital story is built around a calendar.

Unlike storefront templates, Marquee is **date-first**: the next show is the hero, the events list is the spine,
and tickets / RSVP links are one click from any page.

## Variants

| Variant | Tier | Pages | Photo count |
| --- | --- | --- | --- |
| `essentials` | Standard | Home, Events, Visit, Tickets | 6–8 |
| `portfolio`  | Extended | Home, Events (with month calendar), Visit, Tickets, Gallery, Lineup | 12–16 |

The variant is set in `src/config/site.config.ts` (`variant: 'essentials' | 'portfolio'`). Switching it toggles
the calendar view, gallery page, and resident-lineup page automatically — no code edits.

## Local dev

```sh
npm install            # at the monorepo root
npm run dev -w archetype-marquee-ui
```

## Configuring a real venue

Edit `src/config/site.config.ts`:
- `events` — upcoming shows; the soonest future-dated event drives the home hero countdown.
- `series` — recurring programs (Open Mic Mondays, First-Friday Gallery Walk).
- `performers` — resident company, ensemble, or featured artists (extended variant page).
- `venue` — capacity, parking, accessibility, food/drink, private-rental link.
- `ticketingUrl` — primary box-office link used by the masthead CTA.

## What's bespoke vs shared

- **Bespoke (this folder):** `EventCardSection`, `EventsListSection`, `EventCalendarSection`, `LineupSection`,
  `VenueInfoSection`, `NextShowHero`, plus the marquee-specific site config and views.
- **Shared (`@apotome/archetype-shared`):** Hero/About/Contact/Gallery/Testimonials sections, theme tokens,
  layout chrome (header/footer), admin platform.
