<script setup lang="ts">
import { Users, Accessibility, Car, Utensils, Sparkles } from 'lucide-vue-next'
import type { VenueDetail } from '../../config/site.config'

withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  intro?: string
  venue: VenueDetail
}>(), { title: 'About the venue' })
</script>

<template>
  <section class="ap-section ap-section--alt ap-venue">
    <div class="ap-container">
      <header class="ap-section-head">
        <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
        <h2>{{ title }}</h2>
        <p v-if="intro" class="ap-venue__intro">{{ intro }}</p>
      </header>

      <dl class="ap-venue__grid">
        <div v-if="venue.capacity" class="ap-venue__row">
          <dt><Users :size="18" /> Capacity</dt>
          <dd>{{ venue.capacity }}</dd>
        </div>
        <div v-if="venue.ageRestrictions" class="ap-venue__row">
          <dt><Sparkles :size="18" /> Ages</dt>
          <dd>{{ venue.ageRestrictions }}</dd>
        </div>
        <div v-if="venue.parking" class="ap-venue__row">
          <dt><Car :size="18" /> Parking</dt>
          <dd>{{ venue.parking }}</dd>
        </div>
        <div v-if="venue.accessibility" class="ap-venue__row">
          <dt><Accessibility :size="18" /> Accessibility</dt>
          <dd>{{ venue.accessibility }}</dd>
        </div>
        <div v-if="venue.foodAndDrink" class="ap-venue__row">
          <dt><Utensils :size="18" /> Food &amp; drink</dt>
          <dd>{{ venue.foodAndDrink }}</dd>
        </div>
      </dl>

      <aside v-if="venue.rentalUrl || venue.rentalBlurb" class="ap-venue__rentals">
        <h3>Rent the room</h3>
        <p v-if="venue.rentalBlurb">{{ venue.rentalBlurb }}</p>
        <a v-if="venue.rentalUrl" :href="venue.rentalUrl" class="ap-btn">Enquire about rentals</a>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.ap-venue__intro { color: var(--ap-ink-muted); max-width: 60ch; margin: 0; }
.ap-venue__grid {
  display: grid; gap: 0;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin: clamp(1.5rem, 3vw, 2.5rem) 0 0;
  border-top: 1px solid var(--ap-line);
}
.ap-venue__row {
  display: grid;
  grid-template-columns: 1fr;
  padding: 1rem 0;
  border-bottom: 1px solid var(--ap-line);
  border-right: 1px solid var(--ap-line);
  padding-right: 1.5rem; padding-left: 1.25rem;
}
.ap-venue__row:nth-child(odd) { padding-left: 0; }
.ap-venue__row dt {
  display: inline-flex; align-items: center; gap: 0.45rem;
  font-family: var(--ap-font-heading);
  font-size: 0.95rem; letter-spacing: var(--ap-tracking-heading);
  text-transform: var(--ap-heading-transform);
  color: var(--ap-primary);
  margin-bottom: 0.3rem;
}
.ap-venue__row dd { margin: 0; color: var(--ap-ink); font-size: 0.96rem; line-height: 1.5; }
.ap-venue__rentals {
  margin-top: clamp(2rem, 4vw, 3rem);
  padding: clamp(1.5rem, 3vw, 2.5rem);
  background: var(--ap-surface);
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius-lg);
  display: grid; gap: 0.85rem; justify-items: start;
}
.ap-venue__rentals h3 {
  margin: 0; font-family: var(--ap-font-heading);
  font-size: 1.4rem; letter-spacing: var(--ap-tracking-heading);
  text-transform: var(--ap-heading-transform);
}
.ap-venue__rentals p { margin: 0; color: var(--ap-ink-muted); max-width: 56ch; }
@media (max-width: 640px) {
  .ap-venue__row,
  .ap-venue__row:nth-child(odd) { border-right: none; padding-left: 0; padding-right: 0; }
}
</style>
