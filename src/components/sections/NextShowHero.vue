<script setup lang="ts">
/**
 * NextShowHero — the Marquee home hero. Surfaces the next future event
 * with a live countdown; falls back to a quiet brand hero when nothing is
 * scheduled.
 *
 * It uses the shared `.ap-hero` structure and class names, so every
 * theme's signature hero layout (Atlas plate, Studio gallery wall, ...)
 * applies to it unchanged. The one Marquee-specific piece is the "next
 * show" plate that hangs over the photo.
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'
import OptimizedImage from '@apotome/archetype-shared/components/OptimizedImage.vue'
import ThemeFx from '@apotome/archetype-shared/components/sections/ThemeFx.vue'
import IndexCounter from '@apotome/archetype-shared/components/motion/IndexCounter.vue'
import type { EventItem } from '../../config/site.config'
import { formatEventDate, isPast } from '../../utils/eventDate'

const props = withDefaults(defineProps<{
  brand: string
  tagline?: string
  blurb?: string
  events: EventItem[]
  heroImage: string
  heroImageAlt?: string
  /** Extra hero frames (portfolio). */
  images?: Array<{ src: string; alt?: string }>
  nextShowLabel?: string
  ctaPrimary?: string
  ctaSecondary?: string
  emptyCtaPrimary?: string
  emptyCtaSecondary?: string
  /** Locale line for the ledger, e.g. "Trinidad, CO". */
  locale?: string
}>(), {
  nextShowLabel: 'Next on the marquee',
  ctaPrimary: 'Get tickets',
  ctaSecondary: 'All events',
  emptyCtaPrimary: 'See upcoming events',
  emptyCtaSecondary: 'Visit',
})

const nextEvent = computed<EventItem | null>(() => {
  const upcoming = props.events.filter(e => !isPast(e.date)).sort((a, b) => a.date.localeCompare(b.date))
  return upcoming[0] ?? null
})

const eventInstant = computed<number | null>(() => {
  const ev = nextEvent.value
  if (!ev) return null
  const [y, m, d] = ev.date.split('-').map(Number)
  if (!y || !m || !d) return null
  let hh = 19, mm = 0
  if (ev.startTime) {
    const parts = ev.startTime.split(':').map(Number)
    if (typeof parts[0] === 'number' && !Number.isNaN(parts[0])) hh = parts[0]
    if (typeof parts[1] === 'number' && !Number.isNaN(parts[1])) mm = parts[1]
  }
  return new Date(y, m - 1, d, hh, mm).getTime()
})

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => { timer = setInterval(() => { now.value = Date.now() }, 60_000) })
onUnmounted(() => { if (timer) clearInterval(timer) })

const countdown = computed(() => {
  const t = eventInstant.value
  if (!t) return null
  const diff = t - now.value
  if (diff <= 0) return { label: 'Tonight', mono: 'NOW' }
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  if (days > 0) return { label: `${days} day${days === 1 ? '' : 's'} away`, mono: `T-${days}D ${String(hours).padStart(2, '0')}H` }
  const mins = Math.floor((diff % 3_600_000) / 60_000)
  return { label: 'Today', mono: `T-${String(hours).padStart(2, '0')}H ${String(mins).padStart(2, '0')}M` }
})
const nextDate = computed(() => (nextEvent.value ? formatEventDate(nextEvent.value.date) : null))

const frames = computed(() => {
  const extra = (props.images ?? []).filter(f => !!f.src)
  return extra.length > 1 ? extra : [{ src: props.heroImage, alt: props.heroImageAlt }]
})
</script>

<template>
  <section class="ap-hero ap-hero--split ap-marquee-hero" :class="{ 'has-next': !!nextEvent }" data-index>
    <div class="ap-hero__deco" aria-hidden="true"></div>
    <ThemeFx where="hero" />
    <div class="ap-container ap-hero__inner">
      <div class="ap-hero__content">
        <div class="ap-hero__ledger" v-reveal:fade>
          <span class="ap-hero__ledger-idx">01</span>
          <span v-if="tagline" class="ap-hero__ledger-item"><span class="ap-hero__ledger-v">{{ tagline }}</span></span>
          <span v-if="locale" class="ap-hero__ledger-item"><span class="ap-hero__ledger-v">{{ locale }}</span></span>
          <span v-if="countdown" class="ap-hero__ledger-item" :title="countdown.label">
            <span class="ap-hero__ledger-k">Next</span><span class="ap-hero__ledger-v">{{ countdown.mono }}</span>
          </span>
        </div>
        <p v-if="tagline" class="ap-eyebrow ap-hero__eyebrow" v-reveal:fade>{{ tagline }}</p>
        <h1 class="ap-hero__title" v-lines>{{ brand }}</h1>
        <p v-if="blurb" class="ap-hero__subtitle" v-reveal="0.25">{{ blurb }}</p>
        <div class="ap-hero__ctas" v-reveal="0.35">
          <template v-if="nextEvent">
            <a v-if="nextEvent.ticketUrl" :href="nextEvent.ticketUrl" target="_blank" rel="noopener" class="ap-btn">{{ ctaPrimary }}</a>
            <RouterLink v-else to="/tickets" class="ap-btn">{{ ctaPrimary }}</RouterLink>
            <RouterLink to="/events" class="ap-btn ap-btn--ghost">{{ ctaSecondary }}</RouterLink>
          </template>
          <template v-else>
            <RouterLink to="/events" class="ap-btn">{{ emptyCtaPrimary }}</RouterLink>
            <RouterLink to="/visit" class="ap-btn ap-btn--ghost">{{ emptyCtaSecondary }}</RouterLink>
          </template>
        </div>
      </div>
      <div class="ap-hero__media" :class="{ 'is-carousel': frames.length > 1 }" v-plx="{ speed: 0.05 }">
        <OptimizedImage
          v-for="(f, i) in frames"
          :key="f.src + i"
          :src="f.src"
          :alt="f.alt || heroImageAlt || brand"
          :loading="i === 0 ? 'eager' : 'lazy'"
          class="ap-hero__frame"
          :class="{ 'is-active': i === 0 }"
        />
        <figcaption v-if="heroImageAlt" class="ap-hero__caption">
          <span class="ap-hero__caption-fig">Fig. 01</span>
          <span class="ap-hero__caption-text">{{ heroImageAlt }}</span>
        </figcaption>
        <div v-if="nextEvent" class="ap-marquee-hero__plate" v-reveal="0.45">
          <span class="ap-marquee-hero__plate-k">{{ nextShowLabel }}</span>
          <h2 class="ap-marquee-hero__plate-title">{{ nextEvent.title }}</h2>
          <p class="ap-marquee-hero__plate-meta">
            <span v-if="nextDate">{{ nextDate.long }}</span>
            <span v-if="nextEvent.startTime">{{ nextEvent.startTime }}</span>
            <span v-if="nextEvent.priceLabel">{{ nextEvent.priceLabel }}</span>
          </p>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <IndexCounter class="ap-index-rail" />
    </Teleport>
  </section>
</template>

<style scoped>
/* Shared hero geometry lives in the theme partials (elevate/_<theme>.scss)
   via the .ap-hero class names. Only the plate is Marquee's own. */
.ap-hero { position: relative; }
.ap-hero__inner { display: grid; gap: clamp(2rem, 4vw, 4rem); align-items: center; }
.ap-hero__content { display: flex; flex-direction: column; gap: 1rem; }
.ap-hero__subtitle { font-size: clamp(1.05rem, 1.4vw, 1.25rem); color: var(--ap-ink-muted); max-width: 52ch; }
.ap-hero__ctas { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.75rem; }
.ap-hero__ledger {
  display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.5rem 1.4rem;
  font-family: var(--ap-font-mono); font-size: 0.7rem; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--ap-ink-muted);
  padding-bottom: 0.7rem; border-bottom: 1px solid var(--ap-line);
}
.ap-hero__ledger-idx { color: var(--ap-ink); font-weight: 600; }
.ap-hero__ledger-item { display: inline-flex; gap: 0.5em; }
.ap-hero__ledger-v { color: var(--ap-ink); }
.ap-hero__caption { display: none; }
.ap-hero__media { position: relative; }
.ap-hero__media img { display: block; width: 100%; height: auto; object-fit: cover; aspect-ratio: 4 / 3; }
.ap-hero__media.is-carousel :deep(.ap-hero__frame:not(:first-of-type)) { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; }
@media (max-width: 820px) {
  .ap-hero__inner { grid-template-columns: 1fr !important; }
  .ap-hero__media { order: -1; }
}

/* The next-show plate: hairline card over the photo's lower-left corner. */
.ap-marquee-hero__plate {
  position: absolute;
  left: clamp(0.75rem, 2vw, 1.5rem);
  bottom: clamp(0.75rem, 2vw, 1.5rem);
  z-index: 4;
  max-width: min(78%, 360px);
  padding: clamp(0.9rem, 1.8vw, 1.3rem) clamp(1rem, 2vw, 1.4rem);
  background: var(--ap-surface);
  color: var(--ap-ink);
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius);
  display: grid;
  gap: 0.4rem;
}
.ap-marquee-hero__plate-k {
  font-family: var(--ap-font-mono); font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--ap-primary);
}
.ap-marquee-hero__plate-title {
  margin: 0; font-family: var(--ap-font-heading);
  font-size: clamp(1.15rem, 1.8vw, 1.5rem); line-height: 1.1;
  letter-spacing: var(--ap-tracking-heading); text-transform: var(--ap-heading-transform);
}
.ap-marquee-hero__plate-meta {
  margin: 0; display: flex; flex-wrap: wrap; gap: 0.3rem 0.8rem;
  font-family: var(--ap-font-mono); font-size: 0.66rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ap-ink-muted);
}
.ap-marquee-hero__plate-meta span + span::before { content: '\00B7'; margin-right: 0.8rem; }
</style>
