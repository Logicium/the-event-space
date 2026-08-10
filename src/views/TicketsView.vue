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
    eyebrow="Tickets"
    title="Get in"
    subtitle="Most events ticket through our partner platform. For group requests, accessibility, or holds — reach out directly."
    :image="siteConfig.photos.hero.src"
    :image-alt="siteConfig.photos.hero.alt"
  />
  <TicketingSection v-if="showTicketing" />
  <template v-else>
    <div class="ap-container ap-tickets__cta">
      <a v-if="siteConfig.ticketingUrl" :href="siteConfig.ticketingUrl" target="_blank" rel="noopener" class="ap-btn">
        Get tickets
      </a>
      <p>Tickets are also available at the door when capacity allows.</p>
    </div>
    <EventsListSection
      eyebrow="On sale now"
      title="Pick your night"
      :events="upcoming"
      :venue-label="siteConfig.contact.address"
    />
  </template>
  <ContactSection
    eyebrow="Get in touch"
    title="Group sales, holds, or access requests"
    intro="Tell us the event and how many spots; we'll get back within one business day."
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
