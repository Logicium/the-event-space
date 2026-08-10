<script setup lang="ts">
import { computed } from 'vue'
import { Calendar, Clock, MapPin, Ticket } from 'lucide-vue-next'
import OptimizedImage from '@apotome/archetype-shared/components/OptimizedImage.vue'
import type { EventItem } from '../../config/site.config'
import { formatEventDate, isPast } from '../../utils/eventDate'

const props = defineProps<{
  event: EventItem
  /** Venue address used by the secondary line. */
  venueLabel?: string
  /** Render with the home-page "next show" emphasis (bigger image, eyebrow + countdown). */
  featured?: boolean
}>()

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
</script>

<template>
  <article class="ap-event-card" :class="{ 'ap-event-card--featured': featured, 'is-past': past }">
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
