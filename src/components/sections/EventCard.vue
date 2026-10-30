<script setup lang="ts">
import { computed, ref } from 'vue'
import { Calendar, Clock, MapPin, Ticket } from 'lucide-vue-next'
import OptimizedImage from '@apotome/archetype-shared/components/OptimizedImage.vue'
import type { EventItem } from '../../config/site.config'
import { formatEventDate, isPast } from '../../utils/eventDate'

const props = withDefaults(defineProps<{
  event: EventItem
  /** Venue address used by the secondary line. */
  venueLabel?: string
  /** Render with the home-page "next show" emphasis (bigger image, eyebrow + countdown). */
  featured?: boolean
  /**
   * 'card'  — image beside the copy (default)
   * 'index' — an editorial row: date, title, meta, action; the photo
   *           follows the pointer as a floating preview on hover
   */
  layout?: 'card' | 'index'
  /** Row number shown in index layout. */
  index?: number
}>(), { layout: 'card', index: 0 })

const dateParts = computed(() => formatEventDate(props.event.date))
const past = computed(() => isPast(props.event.date))

const ctaLabel = computed(() => {
  if (props.event.status === 'sold-out') return 'Sold out'
  if (props.event.status === 'cancelled') return 'Cancelled'
  if (props.event.status === 'postponed') return 'Postponed'
  if (props.event.status === 'free') return 'RSVP'
  return 'Get tickets'
})
const ctaDisabled = computed(() =>
  props.event.status === 'sold-out' || props.event.status === 'cancelled' || past.value,
)

/* Floating preview for the index row: tracks the pointer inside the row. */
const peek = ref({ x: 0, y: 0, on: false })
const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
function onMove(e: MouseEvent) {
  if (reduced) return
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  peek.value = { x: e.clientX - r.left, y: e.clientY - r.top, on: true }
}
function onLeave() { peek.value.on = false }
</script>

<template>
  <!-- ── Index row ─────────────────────────────────────────────────── -->
  <article
    v-if="layout === 'index'"
    class="ap-event-row"
    :class="{ 'is-past': past, 'is-peeking': peek.on }"
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <span class="ap-event-row__num" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
    <time class="ap-event-row__date" :datetime="event.date">
      <b>{{ dateParts.day }}</b>
      <i>{{ dateParts.month }}</i>
      <small>{{ dateParts.weekday }}</small>
    </time>
    <div class="ap-event-row__main">
      <h3 class="ap-event-row__title">{{ event.title }}</h3>
      <p class="ap-event-row__blurb">{{ event.blurb }}</p>
    </div>
    <div class="ap-event-row__meta">
      <span v-if="event.category">{{ event.category }}</span>
      <span v-if="event.startTime">{{ (event.doorsTime ? 'Doors ' + event.doorsTime + ' · ' : '') + event.startTime }}</span>
      <span v-if="event.priceLabel">{{ event.priceLabel }}</span>
      <span v-if="event.status" class="ap-event-status" :data-status="event.status">{{ event.status.replace('-', ' ') }}</span>
    </div>
    <div class="ap-event-row__action">
      <a v-if="event.ticketUrl && !ctaDisabled" :href="event.ticketUrl" target="_blank" rel="noopener" class="ap-btn ap-btn--ghost">{{ ctaLabel }}</a>
      <span v-else class="ap-event-row__closed">{{ ctaLabel }}</span>
    </div>
    <div
      class="ap-event-row__peek"
      aria-hidden="true"
      :style="{ transform: `translate(${peek.x}px, ${peek.y}px) translate(-50%, -50%)` }"
    >
      <img :src="event.image" alt="" loading="lazy" decoding="async" />
    </div>
  </article>

  <!-- ── Card (default) ────────────────────────────────────────────── -->
  <article v-else class="ap-event-card" :class="{ 'ap-event-card--featured': featured, 'is-past': past }">
    <div class="ap-event-card__media">
      <OptimizedImage :src="event.image" :alt="event.imageAlt || event.title" />
      <div class="ap-event-card__date" aria-hidden="true">
        <span class="ap-event-card__date-month">{{ dateParts.month }}</span>
        <span class="ap-event-card__date-day">{{ dateParts.day }}</span>
        <span class="ap-event-card__date-weekday">{{ dateParts.weekday }}</span>
      </div>
    </div>
    <div class="ap-event-card__body">
      <div class="ap-event-card__top">
        <span v-if="event.category" class="ap-eyebrow">{{ event.category }}</span>
        <span v-if="event.status" class="ap-event-status" :data-status="event.status">
          {{ event.status.replace('-', ' ') }}
        </span>
      </div>
      <h3 class="ap-event-card__title">{{ event.title }}</h3>
      <p class="ap-event-card__blurb">{{ event.blurb }}</p>

      <ul class="ap-event-card__meta">
        <li><Calendar :size="14" /> {{ dateParts.long }}</li>
        <li v-if="event.startTime">
          <Clock :size="14" />
          <span>
            <template v-if="event.doorsTime">Doors {{ event.doorsTime }} · </template>
            Show {{ event.startTime }}
          </span>
        </li>
        <li v-if="event.priceLabel"><Ticket :size="14" /> {{ event.priceLabel }}</li>
        <li v-if="venueLabel && featured"><MapPin :size="14" /> {{ venueLabel }}</li>
      </ul>

      <div v-if="event.lineup && event.lineup.length" class="ap-event-card__lineup">
        <span class="ap-eyebrow">Lineup</span>
        <ul>
          <li v-for="name in event.lineup" :key="name">{{ name }}</li>
        </ul>
      </div>

      <div class="ap-event-card__foot">
        <a
          v-if="event.ticketUrl && !ctaDisabled"
          :href="event.ticketUrl"
          target="_blank"
          rel="noopener"
          class="ap-btn"
        >
          {{ ctaLabel }}
        </a>
        <button v-else class="ap-btn ap-btn--ghost" disabled>{{ ctaLabel }}</button>
        <span v-if="event.runtimeMinutes" class="ap-event-card__runtime">
          {{ event.runtimeMinutes }} min
        </span>
        <span v-if="event.ageRestriction" class="ap-event-card__age">{{ event.ageRestriction }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* ── Index row ──────────────────────────────────────────────────────── */
.ap-event-row {
  position: relative;
  display: grid;
  grid-template-columns: 2.5rem 4.5rem minmax(0, 1fr) minmax(200px, 0.5fr) auto;
  gap: 0.5rem clamp(1rem, 2.5vw, 2.5rem);
  align-items: center;
  padding: clamp(1.1rem, 2.2vw, 1.75rem) 0;
  border-top: 1px solid var(--ap-line);
  transition: color 200ms ease;
}
.ap-event-row:last-child { border-bottom: 1px solid var(--ap-line); }
.ap-event-row.is-past { opacity: 0.5; }
.ap-event-row__num {
  font-family: var(--ap-font-mono); font-size: 0.66rem; letter-spacing: 0.2em; color: var(--ap-ink-muted);
}
.ap-event-row__date {
  display: grid; line-height: 1; gap: 0.2rem;
  font-variant-numeric: tabular-nums;
}
.ap-event-row__date b { font-family: var(--ap-font-heading); font-weight: 500; font-size: 1.6rem; letter-spacing: -0.03em; }
.ap-event-row__date i, .ap-event-row__date small {
  font-style: normal; font-family: var(--ap-font-mono); font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ap-ink-muted);
}
.ap-event-row__title {
  margin: 0; font-family: var(--ap-font-heading);
  font-size: clamp(1.4rem, 2.6vw, 2.2rem); line-height: 1.05;
  letter-spacing: var(--ap-tracking-heading); text-transform: var(--ap-heading-transform);
  font-weight: var(--ap-heading-weight, 500);
}
.ap-event-row__blurb { margin: 0.35rem 0 0; color: var(--ap-ink-muted); font-size: 0.92rem; max-width: 48ch; }
.ap-event-row__meta {
  display: flex; flex-wrap: wrap; gap: 0.35rem 0.9rem; align-items: center;
  font-family: var(--ap-font-mono); font-size: 0.66rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ap-ink-muted);
}
.ap-event-row__action { justify-self: end; }
.ap-event-row__closed { font-family: var(--ap-font-mono); font-size: 0.66rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ap-ink-muted); }
.ap-event-row__peek {
  position: absolute; left: 0; top: 0; z-index: 5;
  width: clamp(180px, 18vw, 280px); aspect-ratio: 4 / 3;
  pointer-events: none;
  opacity: 0;
  transition: opacity 260ms var(--ap-ease, ease);
  border-radius: var(--ap-radius);
  overflow: hidden;
  box-shadow: 0 30px 60px -30px color-mix(in srgb, var(--ap-ink) 60%, transparent);
  will-change: transform;
}
.ap-event-row__peek img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ap-event-row.is-peeking .ap-event-row__peek { opacity: 1; }
@media (hover: none), (prefers-reduced-motion: reduce) { .ap-event-row__peek { display: none; } }
@media (max-width: 820px) {
  .ap-event-row { grid-template-columns: 4rem minmax(0, 1fr); }
  .ap-event-row__num { display: none; }
  .ap-event-row__meta, .ap-event-row__action { grid-column: 2; justify-self: start; }
}

/* ── Card ───────────────────────────────────────────────────────────── */
.ap-event-card {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) 1.4fr;
  gap: clamp(1.25rem, 2.5vw, 2rem);
  align-items: stretch;
  border-top: 1px solid var(--ap-line);
  padding: clamp(1.25rem, 2.5vw, 2rem) 0;
}
.ap-event-card.is-past { opacity: 0.55; }
.ap-event-card--featured {
  grid-template-columns: 1.2fr 1fr;
  border-top: none;
  background: var(--ap-surface-alt);
  border-radius: var(--ap-radius-lg);
  padding: clamp(1.5rem, 3vw, 2.5rem);
}
.ap-event-card__media { position: relative; }
.ap-event-card__media img {
  width: 100%; aspect-ratio: 4 / 3; object-fit: cover;
  border-radius: var(--ap-radius);
}
.ap-event-card__date {
  position: absolute; top: 0.75rem; left: 0.75rem;
  display: flex; flex-direction: column; align-items: center;
  background: var(--ap-surface); color: var(--ap-ink);
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius);
  padding: 0.4rem 0.75rem; min-width: 56px;
  line-height: 1;
}
.ap-event-card__date-month {
  font-family: var(--ap-font-mono, var(--ap-font-body));
  font-size: 0.65rem; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ap-primary);
}
.ap-event-card__date-day {
  font-family: var(--ap-font-heading);
  font-size: 1.6rem; font-weight: 700; margin-top: 0.15rem;
}
.ap-event-card__date-weekday {
  font-size: 0.65rem; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ap-ink-muted); margin-top: 0.15rem;
}
.ap-event-card__body { display: flex; flex-direction: column; gap: 0.75rem; }
.ap-event-card__top {
  display: flex; align-items: center; justify-content: space-between;
  gap: 0.75rem; flex-wrap: wrap;
}
.ap-event-card__title {
  font-family: var(--ap-font-heading);
  font-size: clamp(1.4rem, 2.5vw, 1.9rem);
  letter-spacing: var(--ap-tracking-heading);
  text-transform: var(--ap-heading-transform);
  margin: 0;
}
.ap-event-card--featured .ap-event-card__title {
  font-size: clamp(1.8rem, 3.4vw, 2.6rem);
}
.ap-event-card__blurb {
  margin: 0; color: var(--ap-ink-muted); font-size: 0.98rem;
}
.ap-event-card__meta {
  list-style: none; padding: 0; margin: 0.25rem 0;
  display: grid; gap: 0.4rem;
}
.ap-event-card__meta li {
  display: flex; align-items: center; gap: 0.55rem;
  font-size: 0.92rem; color: var(--ap-ink);
}
.ap-event-card__lineup {
  border-top: 1px dashed var(--ap-line);
  padding-top: 0.6rem; margin-top: 0.25rem;
}
.ap-event-card__lineup ul {
  list-style: none; padding: 0; margin: 0.3rem 0 0;
  display: flex; flex-wrap: wrap; gap: 0.3rem 0.6rem;
  font-size: 0.92rem;
}
.ap-event-card__lineup li::after { content: '·'; margin-left: 0.6rem; color: var(--ap-ink-muted); }
.ap-event-card__lineup li:last-child::after { content: ''; }
.ap-event-card__foot {
  display: flex; align-items: center; gap: 0.9rem;
  margin-top: auto; padding-top: 0.4rem; flex-wrap: wrap;
}
.ap-event-card__runtime,
.ap-event-card__age {
  font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ap-ink-muted);
}
@media (max-width: 720px) {
  .ap-event-card,
  .ap-event-card--featured { grid-template-columns: 1fr; }
}
</style>
