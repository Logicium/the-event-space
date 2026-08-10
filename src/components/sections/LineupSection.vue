<script setup lang="ts">
import OptimizedImage from '@apotome/archetype-shared/components/OptimizedImage.vue'
import type { Performer } from '../../config/site.config'

defineProps<{
  eyebrow?: string
  title?: string
  intro?: string
  performers: Performer[]
}>()
</script>

<template>
  <section class="ap-section ap-lineup">
    <div class="ap-container">
      <header class="ap-section-head">
        <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
        <h2>{{ title || 'Lineup' }}</h2>
        <p v-if="intro" class="ap-lineup__intro">{{ intro }}</p>
      </header>

      <ul class="ap-lineup__grid">
        <li v-for="p in performers" :key="p.name" class="ap-lineup__card">
          <div v-if="p.image" class="ap-lineup__media">
            <OptimizedImage :src="p.image" :alt="p.imageAlt || p.name" />
          </div>
          <div class="ap-lineup__body">
            <span v-if="p.role" class="ap-eyebrow">{{ p.role }}</span>
            <h3>{{ p.name }}</h3>
            <p v-if="p.bio">{{ p.bio }}</p>
            <ul v-if="p.links && p.links.length" class="ap-lineup__links">
              <li v-for="l in p.links" :key="l.href">
                <a :href="l.href" target="_blank" rel="noopener">{{ l.label }} ↗</a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.ap-lineup__intro { color: var(--ap-ink-muted); max-width: 60ch; margin: 0; }
.ap-lineup__grid {
  list-style: none; padding: 0; margin: clamp(1.5rem, 3vw, 2.5rem) 0 0;
  display: grid; gap: clamp(1.5rem, 3vw, 2.5rem);
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}
.ap-lineup__card {
  display: grid; gap: 1rem;
}
.ap-lineup__media img {
  width: 100%; aspect-ratio: 4 / 5; object-fit: cover;
  border-radius: var(--ap-radius);
}
.ap-lineup__body h3 {
  margin: 0.25rem 0 0.4rem; font-family: var(--ap-font-heading);
  font-size: 1.3rem; letter-spacing: var(--ap-tracking-heading);
  text-transform: var(--ap-heading-transform);
}
.ap-lineup__body p { margin: 0; color: var(--ap-ink-muted); font-size: 0.95rem; line-height: 1.55; }
.ap-lineup__links {
  list-style: none; padding: 0; margin: 0.75rem 0 0;
  display: flex; flex-wrap: wrap; gap: 0.6rem;
}
.ap-lineup__links a {
  font-size: 0.82rem; letter-spacing: 0.06em;
  text-transform: var(--ap-heading-transform);
  color: var(--ap-primary); border-bottom: none;
}
</style>
