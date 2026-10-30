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
    :eyebrow="siteConfig.sections.eventsPage.eyebrow"
    :title="siteConfig.sections.eventsPage.title"
    :subtitle="siteConfig.sections.eventsPage.subtitle"
    :image="siteConfig.photos.hero.src"
    :image-alt="siteConfig.photos.hero.alt"
  />
  <EventCalendarSection
    v-if="isPortfolio"
    :eyebrow="siteConfig.sections.eventsPage.calendarEyebrow"
    :events="siteConfig.events"
  />
  <EventsListSection
    :title="siteConfig.sections.eventsPage.listTitle"
    :events="siteConfig.events"
    :venue-label="siteConfig.contact.address"
    filterable
    show-archive
  />
  <SeriesSection
    :eyebrow="siteConfig.sections.eventsPage.seriesEyebrow"
    :title="siteConfig.sections.eventsPage.seriesTitle"
    :series="siteConfig.series"
  />
</template>
