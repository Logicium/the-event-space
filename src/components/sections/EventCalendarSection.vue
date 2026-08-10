<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { EventItem } from '../../config/site.config'

const props = defineProps<{
  eyebrow?: string
  title?: string
  events: EventItem[]
}>()

const today = new Date()
const cursor = ref<{ year: number; month: number }>({ year: today.getFullYear(), month: today.getMonth() })

const monthLabel = computed(() =>
  new Date(cursor.value.year, cursor.value.month, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
)

interface DayCell { iso: string; day: number; inMonth: boolean; events: EventItem[] }

const grid = computed<DayCell[]>(() => {
  const { year, month } = cursor.value
  const firstOfMonth = new Date(year, month, 1)
  const startWeekday = firstOfMonth.getDay() // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: DayCell[] = []
  // Leading days from previous month.
  const prevMonthLast = new Date(year, month, 0).getDate()
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = prevMonthLast - i
    const date = new Date(year, month - 1, d)
    cells.push({ iso: isoOf(date), day: d, inMonth: false, events: eventsOn(isoOf(date)) })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    cells.push({ iso: isoOf(date), day: d, inMonth: true, events: eventsOn(isoOf(date)) })
  }
  // Trailing days to complete 6 weeks (42 cells).
  let trail = 1
  while (cells.length < 42) {
    const date = new Date(year, month + 1, trail)
    cells.push({ iso: isoOf(date), day: trail, inMonth: false, events: eventsOn(isoOf(date)) })
    trail++
  }
  return cells
})

function isoOf(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function eventsOn(iso: string): EventItem[] {
  return props.events.filter(e => e.date === iso)
}

function shift(delta: number) {
  const d = new Date(cursor.value.year, cursor.value.month + delta, 1)
  cursor.value = { year: d.getFullYear(), month: d.getMonth() }
}
function jumpToToday() {
  const now = new Date()
  cursor.value = { year: now.getFullYear(), month: now.getMonth() }
}

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const todayIso = isoOf(today)
</script>

<template>
  <section class="ap-section ap-section--alt ap-calendar">
    <div class="ap-container">
      <header class="ap-section-head">
        <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
        <h2>{{ title || 'On the calendar' }}</h2>
      </header>

      <div class="ap-calendar__bar">
        <button class="ap-calendar__nav" type="button" aria-label="Previous month" @click="shift(-1)">
          <ChevronLeft :size="20" />
        </button>
        <h3 class="ap-calendar__month">{{ monthLabel }}</h3>
        <button class="ap-calendar__nav" type="button" aria-label="Next month" @click="shift(1)">
          <ChevronRight :size="20" />
        </button>
        <button class="ap-calendar__today" type="button" @click="jumpToToday">Today</button>
      </div>

      <div class="ap-calendar__grid" role="grid" :aria-label="`${monthLabel} events`">
        <div v-for="w in weekdayLabels" :key="w" class="ap-calendar__head" role="columnheader">{{ w }}</div>
        <div
          v-for="cell in grid"
          :key="cell.iso"
          class="ap-calendar__cell"
          :class="{
            'is-out': !cell.inMonth,
            'is-today': cell.iso === todayIso,
            'has-events': cell.events.length > 0,
          }"
          role="gridcell"
        >
          <span class="ap-calendar__num">{{ cell.day }}</span>
          <ul v-if="cell.events.length" class="ap-calendar__events">
            <li v-for="ev in cell.events" :key="ev.id">
              <a
                v-if="ev.ticketUrl"
                :href="ev.ticketUrl"
                target="_blank" rel="noopener"
                :title="`${ev.title}${ev.startTime ? ' · ' + ev.startTime : ''}`"
              >{{ ev.title }}</a>
              <span v-else :title="ev.title">{{ ev.title }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ap-calendar__bar {
  display: flex; align-items: center; gap: 0.75rem;
  margin: clamp(1rem, 2vw, 1.5rem) 0;
}
.ap-calendar__month {
  font-family: var(--ap-font-heading);
  font-size: clamp(1.4rem, 2.5vw, 1.9rem);
  letter-spacing: var(--ap-tracking-heading);
  text-transform: var(--ap-heading-transform);
  margin: 0; flex: 1; text-align: center;
}
.ap-calendar__nav {
  background: transparent; border: 1px solid var(--ap-line);
  width: 38px; height: 38px; border-radius: 999px;
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--ap-ink); cursor: pointer;
}
.ap-calendar__nav:hover { border-color: var(--ap-primary); color: var(--ap-primary); }
.ap-calendar__today {
  background: transparent; border: 1px solid var(--ap-line);
  padding: 0.4rem 0.85rem; border-radius: 999px;
  font-family: var(--ap-font-heading); font-size: 0.8rem;
  letter-spacing: 0.08em; text-transform: var(--ap-heading-transform);
  color: var(--ap-ink); cursor: pointer;
}
.ap-calendar__grid {
  display: grid; grid-template-columns: repeat(7, 1fr);
  gap: 1px; background: var(--ap-line);
  border: 1px solid var(--ap-line); border-radius: var(--ap-radius);
  overflow: hidden;
}
.ap-calendar__head {
  background: var(--ap-surface-alt);
  font-family: var(--ap-font-mono, var(--ap-font-body));
  font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ap-ink-muted);
  padding: 0.55rem 0.6rem; text-align: center;
}
.ap-calendar__cell {
  background: var(--ap-surface);
  min-height: clamp(90px, 12vw, 130px);
  padding: 0.5rem; display: flex; flex-direction: column; gap: 0.4rem;
}
.ap-calendar__cell.is-out { background: var(--ap-surface-alt); }
.ap-calendar__cell.is-out .ap-calendar__num { color: var(--ap-ink-muted); }
.ap-calendar__cell.is-today .ap-calendar__num {
  background: var(--ap-primary); color: var(--ap-on-primary, #fff);
  border-radius: 999px; width: 26px; height: 26px;
  display: inline-flex; align-items: center; justify-content: center;
}
.ap-calendar__cell.has-events { background: color-mix(in srgb, var(--ap-primary) 6%, var(--ap-surface)); }
.ap-calendar__num {
  font-family: var(--ap-font-heading);
  font-size: 0.95rem; line-height: 1; align-self: flex-start;
}
.ap-calendar__events {
  list-style: none; padding: 0; margin: 0;
  display: grid; gap: 0.25rem;
}
.ap-calendar__events li a,
.ap-calendar__events li span {
  display: block;
  font-size: 0.78rem; line-height: 1.25;
  padding: 0.2rem 0.4rem; border-radius: 4px;
  background: var(--ap-primary); color: var(--ap-on-primary, #fff);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  border-bottom: none;
}
.ap-calendar__events li a:hover { background: color-mix(in srgb, var(--ap-primary) 80%, var(--ap-ink)); }
@media (max-width: 640px) {
  .ap-calendar__cell { min-height: 60px; padding: 0.35rem; }
  .ap-calendar__events li a,
  .ap-calendar__events li span { font-size: 0; padding: 0.15rem; }
  .ap-calendar__events li a::before,
  .ap-calendar__events li span::before {
    content: ''; display: block; width: 6px; height: 6px;
    background: currentColor; border-radius: 999px;
  }
}
</style>
