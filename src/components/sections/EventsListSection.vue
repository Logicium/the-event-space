<script setup lang="ts">
import { computed, ref } from 'vue'
import EventCard from './EventCard.vue'
import type { EventItem } from '../../config/site.config'
import { isPast } from '../../utils/eventDate'

const props = withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  intro?: string
  events: EventItem[]
  /** Show category filter chips. */
  filterable?: boolean
  /** When true, also surfaces past shows under a "From the archive" group. */
  showArchive?: boolean
  /** Max number of upcoming events to render (0 = unlimited). */
  limit?: number
  venueLabel?: string
  /** Filter chip for 'no category selected'. Owner-editable. */
  allFilterLabel?: string
  /** Shown when a category has no upcoming events. Owner-editable. */
  emptyText?: string
  /** 'card' rows with photos, or 'index' editorial rows with a hover preview. */
  layout?: 'card' | 'index'
}>(), { layout: 'card', title: 'Upcoming events', allFilterLabel: 'All', emptyText: 'No upcoming events in this category — check back soon.' })

const upcoming = computed(() => props.events.filter(e => !isPast(e.date)).sort((a, b) => a.date.localeCompare(b.date)))
const past = computed(() => props.events.filter(e => isPast(e.date)).sort((a, b) => b.date.localeCompare(a.date)))

const categories = computed<string[]>(() => {
  const set = new Set<string>()
  for (const e of upcoming.value) if (e.category) set.add(e.category)
  return Array.from(set)
})
const activeCategory = ref<string | null>(null)

const visible = computed(() => {
  let list = upcoming.value
  if (activeCategory.value) list = list.filter(e => e.category === activeCategory.value)
  if (props.limit && props.limit > 0) list = list.slice(0, props.limit)
  return list
})
</script>

<template>
  <section class="ap-section ap-events" data-index>
    <div class="ap-container">
      <header class="ap-section-head">
        <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
        <h2 v-lines>{{ title }}</h2>
        <p v-if="intro" class="ap-events__intro">{{ intro }}</p>
      </header>

      <div v-if="filterable && categories.length > 1" class="ap-events__filters" role="tablist">
        <button
          type="button"
          class="ap-events__chip"
          :class="{ 'is-active': activeCategory === null }"
          @click="activeCategory = null"
        >{{ allFilterLabel }}</button>
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          class="ap-events__chip"
          :class="{ 'is-active': activeCategory === cat }"
          @click="activeCategory = cat"
        >{{ cat }}</button>
      </div>

      <p v-if="!visible.length" class="ap-events__empty">{{ emptyText }}</p>
      <div class="ap-events__list" :class="`is-${layout}`" v-cascade="90">
        <EventCard
          v-for="(event, i) in visible"
          :key="event.id"
          :event="event"
          :venue-label="venueLabel"
          :layout="layout"
          :index="i"
        />
      </div>

      <details v-if="showArchive && past.length" class="ap-events__archive">
        <summary>From the archive · {{ past.length }} past events</summary>
        <div class="ap-events__list">
          <EventCard
            v-for="event in past.slice(0, 6)"
            :key="event.id"
            :event="event"
            :venue-label="venueLabel"
          />
        </div>
      </details>
    </div>
  </section>
</template>

<style scoped>
.ap-events__intro {
  color: var(--ap-ink-muted); max-width: 60ch; margin: 0;
}
.ap-events__filters {
  display: flex; flex-wrap: wrap; gap: 0.5rem;
  margin: clamp(1rem, 2vw, 1.5rem) 0;
}
.ap-events__chip {
  background: transparent; border: 1px solid var(--ap-line);
  padding: 0.4rem 0.95rem; border-radius: 999px;
  font-family: var(--ap-font-heading);
  font-size: 0.85rem; letter-spacing: 0.06em;
  text-transform: var(--ap-heading-transform);
  color: var(--ap-ink); cursor: pointer;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
}
.ap-events__chip:hover { border-color: var(--ap-primary); color: var(--ap-primary); }
.ap-events__chip.is-active {
  background: var(--ap-primary); color: var(--ap-on-primary, #fff);
  border-color: var(--ap-primary);
}
.ap-events__empty {
  padding: 2rem 0; color: var(--ap-ink-muted); font-style: italic;
}
.ap-events__list { display: grid; gap: 0; }
.ap-events__archive {
  margin-top: clamp(2rem, 4vw, 3rem);
  border-top: 1px solid var(--ap-line); padding-top: 1.5rem;
}
.ap-events__archive summary {
  cursor: pointer; font-family: var(--ap-font-heading);
  font-size: 0.95rem; letter-spacing: var(--ap-tracking-heading);
  text-transform: var(--ap-heading-transform);
}
</style>
