# Marquee — Photo Guide

Marquee is the **Events & Attractions** archetype in the Apotome website program — built for any
business or organization whose site is organized around upcoming events. That includes music
venues and listening rooms, local bands and touring acts, art galleries, community theaters,
festivals and recurring annual events, comedy clubs, dance studios, and makerspaces.

Drop final, web-optimized JPGs into `public/photos/` using the **exact filenames** below.

## Variants

| Variant      | Total photos | Gallery shots | Event photos |
| ------------ | ------------ | ------------- | ------------ |
| `essentials` | 8            | 6             | 1 per event  |
| `portfolio`  | 16           | 12            | 1 per event  |

## Filenames the template expects

### Brand & space (both variants)

| Filename | Purpose | Recommended size |
| -------- | ------- | ---------------- |
| `hero-marquee.jpg` | The home hero — a signature exterior, signage, or stage shot. Anything that says "this is the place." | 2000×2500 (portrait works best) |
| `about-space.jpg`  | The "about" photo — the room set for an event, a wide interior, or your team at work. | 2000×1500 |

### Event photos

For each event in `src/config/site.config.ts`, add one photo to `public/photos/` matching the
event's `image` field. Use a descriptive slug, e.g. `event-rosalind.jpg`, `event-festival.jpg`.

Recommended: 1600×1200 (4:3). For artist-led events, a press photo of the act usually beats a
stock event photo.

### Gallery

Drop sequential files for the gallery wall — past events, candid audience shots, installation
photos, festival crowd shots:

- `show-01.jpg` through `show-06.jpg` (essentials)
- `show-01.jpg` through `show-12.jpg` (portfolio)

### Performers / featured artists (portfolio only)

For each entry in `performers[]`, add a `performer-<slug>.jpg` portrait (1200×1500, 4:5). For
visual artists or filmmakers, a portrait of the artist works better than a piece of their work.

### Recurring series & festivals

For each entry in `series[]`, add a `series-<slug>.jpg` (1600×1000, 16:10) — a strong, recurring
image for the program (e.g. festival logo plate, gallery walk crowd, comedy mic).

## Tips

- Event photography is hard in low light. Crank ISO before flash — silhouettes against lighting
  read better than washed-out fill flash.
- For touring acts you don't have rights to shoot, use the press kit photo the artist provides.
- For films and licensed screenings: use the official poster or a still from the trailer.
- For festivals: lead with a crowd shot if you have one. Energy sells the next year's tickets.
- For galleries: pair an artist portrait with a photo of the work, not just the work alone.
