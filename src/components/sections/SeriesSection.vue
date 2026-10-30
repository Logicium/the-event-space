<script setup lang="ts">
import OptimizedImage from '@apotome/archetype-shared/components/OptimizedImage.vue'
import type { EventSeries } from '../../config/site.config'

withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  series: EventSeries[]
}>(), { title: 'Recurring programs' })
</script>

<template>
  <section class="ap-section ap-series" data-index>
    <div class="ap-container">
      <header class="ap-section-head">
        <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
        <h2 v-lines>{{ title }}</h2>
      </header>
      <ul class="ap-series__grid" v-cascade="110">
        <li v-for="s in series" :key="s.name" class="ap-series__card">
          <div v-if="s.image" class="ap-series__media">
            <OptimizedImage :src="s.image" :alt="s.name" />
          </div>
          <div class="ap-series__body">
            <span v-if="s.cadence" class="ap-eyebrow">{{ s.cadence }}</span>
            <h3>{{ s.name }}</h3>
            <p>{{ s.blurb }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.ap-series__grid {
  list-style: none; padding: 0; margin: clamp(1.5rem, 3vw, 2.5rem) 0 0;
  display: grid; gap: clamp(1.25rem, 2.5vw, 2rem);
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}
.ap-series__card {
  background: var(--ap-surface);
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius-lg);
  overflow: hidden;
  display: flex; flex-direction: column;
}
.ap-series__media img {
  width: 100%; aspect-ratio: 16 / 10; object-fit: cover;
}
.ap-series__body {
  padding: clamp(1rem, 2vw, 1.5rem);
  display: grid; gap: 0.5rem;
}
.ap-series__body h3 {
  margin: 0; font-family: var(--ap-font-heading);
  font-size: 1.2rem; letter-spacing: var(--ap-tracking-heading);
  text-transform: var(--ap-heading-transform);
}
.ap-series__body p { margin: 0; color: var(--ap-ink-muted); font-size: 0.95rem; line-height: 1.5; }
</style>
