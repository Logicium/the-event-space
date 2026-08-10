<script setup lang="ts">
import { computed } from 'vue'
import { siteConfig } from '../config/site.config'
import HeroSection from '@apotome/archetype-shared/components/sections/HeroSection.vue'
import EventsListSection from '../components/sections/EventsListSection.vue'
import EventCalendarSection from '../components/sections/EventCalendarSection.vue'
import SeriesSection from '../components/sections/SeriesSection.vue'
import { variantAtLeast } from '@apotome/archetype-shared/themes/tokens'
import { useSiteTheme } from '@apotome/archetype-shared/composables/useSiteTheme'

const { variant: liveVariant } = useSiteTheme()
const isPortfolio = computed(() => variantAtLeast(liveVariant.value, 'portfolio'))
</script>

<template>
  <HeroSection
    subpage
    eyebrow="Events"
    title="Every show on the calendar"
    subtitle="Tickets open the moment a show is announced. Sign up for our newsletter to hear about new dates first."
    :image="siteConfig.photos.hero.src"
    :image-alt="siteConfig.photos.hero.alt"
  />
  <EventCalendarSection
    v-if="isPortfolio"
    eyebrow="Month view"
    :events="siteConfig.events"
  />
  <EventsListSection
    title="All upcoming events"
    :events="siteConfig.events"
    :venue-label="siteConfig.contact.address"
    filterable
    show-archive
  />
  <SeriesSection
    eyebrow="Recurring"
    title="Programs that come back around"
    :series="siteConfig.series"
  />
</template>
