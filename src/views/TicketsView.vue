<script setup lang="ts">
import { computed } from 'vue'
import { siteConfig } from '../config/site.config'
import HeroSection from '@apotome/archetype-shared/components/sections/HeroSection.vue'
import EventsListSection from '../components/sections/EventsListSection.vue'
import ContactSection from '@apotome/archetype-shared/components/sections/ContactSection.vue'
import TicketingSection from '@apotome/archetype-shared/components/sections/TicketingSection.vue'
import { useSiteContentStore } from '@apotome/archetype-shared/platform/siteContentStore'
import { isPast } from '../utils/eventDate'

const store = useSiteContentStore()
const showTicketing = computed(() => store.hasAddOn('ticketing'))
const upcoming = computed(() => siteConfig.events.filter(e => !isPast(e.date)))
</script>

<template>
  <HeroSection
    subpage
    :eyebrow="siteConfig.sections.ticketsPage.eyebrow"
    :title="siteConfig.sections.ticketsPage.title"
    :subtitle="siteConfig.sections.ticketsPage.subtitle"
    :image="siteConfig.photos.hero.src"
    :image-alt="siteConfig.photos.hero.alt"
  />
  <TicketingSection v-if="showTicketing" />
  <template v-else>
    <div class="ap-container ap-tickets__cta">
      <a v-if="siteConfig.ticketingUrl" :href="siteConfig.ticketingUrl" target="_blank" rel="noopener" class="ap-btn">
        {{ siteConfig.sections.ticketsPage.ctaLabel }}
      </a>
      <p>{{ siteConfig.sections.ticketsPage.doorNote }}</p>
    </div>
    <EventsListSection
      :eyebrow="siteConfig.sections.ticketsPage.listEyebrow"
      :title="siteConfig.sections.ticketsPage.listTitle"
      :events="upcoming"
      :venue-label="siteConfig.contact.address"
    />
  </template>
  <ContactSection
    :eyebrow="siteConfig.sections.contact.eyebrow"
    :title="siteConfig.sections.contact.title"
    :intro="siteConfig.sections.contact.intro"
    :address="siteConfig.contact.address"
    :phone="siteConfig.contact.phone"
    :email="siteConfig.contact.email"
  />
</template>

<style scoped>
.ap-tickets__cta {
  padding: clamp(1.5rem, 3vw, 2.5rem) 0 0;
  text-align: center; display: grid; gap: 0.85rem; justify-items: center;
}
.ap-tickets__cta p { margin: 0; color: var(--ap-ink-muted); font-size: 0.95rem; }
</style>
