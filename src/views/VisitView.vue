<script setup lang="ts">
import { siteConfig } from '../config/site.config'
import HeroSection from '@apotome/archetype-shared/components/sections/HeroSection.vue'
import HoursSection from '@apotome/archetype-shared/components/sections/HoursSection.vue'
import ContactSection from '@apotome/archetype-shared/components/sections/ContactSection.vue'
import VenueInfoSection from '../components/sections/VenueInfoSection.vue'
</script>

<template>
  <HeroSection
    subpage
    :eyebrow="siteConfig.sections.visitPage.eyebrow"
    :title="siteConfig.sections.visitPage.title"
    :subtitle="siteConfig.sections.visitPage.subtitle"
    :image="siteConfig.photos.about.src"
    :image-alt="siteConfig.photos.about.alt"
  />
  <VenueInfoSection
    :eyebrow="siteConfig.sections.visitPage.venueEyebrow"
    :title="siteConfig.sections.visitPage.venueTitle"
    :intro="siteConfig.blurb"
    :venue="siteConfig.venue"
  />
  <HoursSection
    :eyebrow="siteConfig.sections.visitPage.hoursEyebrow"
    :title="siteConfig.sections.visitPage.hoursTitle"
    :hours="siteConfig.hours"
  />
  <ContactSection
    :eyebrow="siteConfig.sections.visitPage.contactEyebrow"
    :title="siteConfig.sections.visitPage.contactTitle"
    :address="siteConfig.contact.address"
    :phone="siteConfig.contact.phone"
    :email="siteConfig.contact.email"
    :map-embed-url="siteConfig.contact.mapEmbedUrl"
  />
</template>
