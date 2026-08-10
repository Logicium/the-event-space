<script setup lang="ts">
/**
 * NextShowHero — a custom home-page hero that surfaces the next future event
 * with a live countdown. Falls back to a quiet brand hero when no upcoming
 * event exists.
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'
import OptimizedImage from '@apotome/archetype-shared/components/OptimizedImage.vue'
import { Clock, Ticket } from 'lucide-vue-next'
import type { EventItem } from '../../config/site.config'
import { formatEventDate, isPast } from '../../utils/eventDate'

const props = defineProps<{
  brand: string
  tagline?: string
  blurb?: string
  events: EventItem[]
  heroImage: string
  heroImageAlt?: string
}>()

const nextEvent = computed<EventItem | null>(() => {
  const upcoming = props.events.filter(e => !isPast(e.date)).sort((a, b) => a.date.localeCompare(b.date))
  return upcoming[0] ?? null
})

const eventInstant = computed<number | null>(() => {
  const ev = nextEvent.value
  if (!ev) return null
  // Local-time interpretation of YYYY-MM-DD + optional HH:MM.
  const [y, m, d] = ev.date.split('-').map(Number)
  if (!y || !m || !d) return null
  let hh = 19, mm = 0
  if (ev.startTime) {
    const parts = ev.startTime.split(':').map(Number)
    const h = parts[0]
    const min = parts[1]
    if (typeof h === 'number' && !Number.isNaN(h)) hh = h
    if (typeof min === 'number' && !Number.isNaN(min)) mm = min
  }
  return new Date(y, m - 1, d, hh, mm).getTime()
})

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  timer = setInterval(() => { now.value = Date.now() }, 60_000)
})
onUnmounted(() => { if (timer) clearInterval(timer) })

const countdown = computed(() => {
  const t = eventInstant.value
  if (!t) return null
  const diff = t - now.value
  if (diff <= 0) return { label: 'Tonight', mono: 'NOW' }
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  if (days > 0) {
    return { label: `${days} day${days === 1 ? '' : 's'} away`, mono: `T-${days}D ${String(hours).padStart(2, '0')}H` }
  }
  const mins = Math.floor((diff % 3_600_000) / 60_000)
  return { label: 'Today', mono: `T-${String(hours).padStart(2, '0')}H ${String(mins).padStart(2, '0')}M` }
})
const nextDate = computed(() => (nextEvent.value ? formatEventDate(nextEvent.value.date) : null))
</script>

<template>
  <section class="ap-section ap-marquee-hero" :class="{ 'has-next': !!nextEvent }">
    <div class="ap-container ap-marquee-hero__inner">
      <div class="ap-marquee-hero__content">
        <span v-if="tagline" class="ap-eyebrow">{{ tagline }}</span>
        <h1 class="ap-marquee-hero__title">{{ brand }}</h1>
        <p v-if="blurb" class="ap-marquee-hero__blurb">{{ blurb }}</p>
        <div v-if="nextEvent" class="ap-marquee-hero__nextshow">
          <span class="ap-marquee-hero__nextshow-eyebrow">Next on the marquee</span>
          <h2 class="ap-marquee-hero__nextshow-title">{{ nextEvent.title }}</h2>
          <ul class="ap-marquee-hero__meta">
            <li v-if="nextDate"><Clock :size="14" /> {{ nextDate.long }}<template v-if="nextEvent.startTime"> · {{ nextEvent.startTime }}</template></li>
            <li v-if="nextEvent.priceLabel"><Ticket :size="14" /> {{ nextEvent.priceLabel }}</li>
          </ul>
          <div class="ap-marquee-hero__actions">
            <a
              v-if="nextEvent.ticketUrl"
              :href="nextEvent.ticketUrl"
              target="_blank" rel="noopener"
              class="ap-btn"
            >Get tickets</a>
            <RouterLink to="/events" class="ap-btn ap-btn--ghost">All events</RouterLink>
          </div>
          <span v-if="countdown" class="ap-marquee-hero__countdown" :title="countdown.label">{{ countdown.mono }}</span>
        </div>
        <div v-else class="ap-marquee-hero__actions">
          <RouterLink to="/events" class="ap-btn">See upcoming events</RouterLink>
          <RouterLink to="/visit" class="ap-btn ap-btn--ghost">Visit</RouterLink>
        </div>
      </div>
      <div class="ap-marquee-hero__media">
        <OptimizedImage :src="heroImage" :alt="heroImageAlt || brand" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.ap-marquee-hero { padding-top: clamp(2rem, 4vw, 3.5rem); padding-bottom: clamp(2rem, 4vw, 3.5rem); }
.ap-marquee-hero__inner {
  display: grid;
  grid-template-columns: 6fr 5fr;
  gap: clamp(2rem, 4vw, 3.5rem);
  align-items: center;
}
.ap-marquee-hero__content { display: flex; flex-direction: column; gap: 0.85rem; }
.ap-marquee-hero__title {
  margin: 0; font-family: var(--ap-font-heading);
  font-size: clamp(2.6rem, 5.5vw, 4.5rem);
  letter-spacing: var(--ap-tracking-heading);
  text-transform: var(--ap-heading-transform);
  line-height: 1.02;
}
.ap-marquee-hero__blurb {
  font-size: clamp(1rem, 1.2vw, 1.12rem); color: var(--ap-ink-muted);
  max-width: 52ch; margin: 0;
}
.ap-marquee-hero__nextshow {
  margin-top: 1.25rem;
  padding: clamp(1.25rem, 2.5vw, 1.75rem);
  background: var(--ap-surface-alt);
  border-left: 3px solid var(--ap-primary);
  border-radius: var(--ap-radius);
  display: grid; gap: 0.6rem;
  position: relative;
}
.ap-marquee-hero__nextshow-eyebrow {
  font-family: var(--ap-font-mono, var(--ap-font-body));
  font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ap-primary);
}
.ap-marquee-hero__nextshow-title {
  margin: 0; font-family: var(--ap-font-heading);
  font-size: clamp(1.4rem, 2.4vw, 1.8rem);
  letter-spacing: var(--ap-tracking-heading);
  text-transform: var(--ap-heading-transform);
}
.ap-marquee-hero__meta {
  list-style: none; padding: 0; margin: 0;
  display: grid; gap: 0.35rem;
}
.ap-marquee-hero__meta li {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.92rem;
}
.ap-marquee-hero__actions {
  display: flex; flex-wrap: wrap; gap: 0.75rem;
  margin-top: 0.5rem;
}
.ap-marquee-hero__countdown {
  position: absolute; top: 0.85rem; right: 0.95rem;
  font-family: var(--ap-font-mono, var(--ap-font-body));
  font-size: 0.72rem; letter-spacing: 0.14em;
  color: var(--ap-ink-muted);
}
.ap-marquee-hero__media img {
  width: 100%; aspect-ratio: 4 / 5; object-fit: cover;
  border-radius: var(--ap-radius-lg);
}
@media (max-width: 880px) {
  .ap-marquee-hero__inner { grid-template-columns: 1fr; }
  .ap-marquee-hero__media img { aspect-ratio: 16 / 10; }
}
</style>
