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
    eyebrow="Visit"
    title="Plan your night out"
    subtitle="The basics for getting here, getting in, and getting comfortable."
    :image="siteConfig.photos.about.src"
    :image-alt="siteConfig.photos.about.alt"
  />
  <VenueInfoSection
    eyebrow="The venue"
    title="What to expect"
    :intro="siteConfig.blurb"
    :venue="siteConfig.venue"
  />
  <HoursSection
    eyebrow="Hours"
    title="When we're open"
    :hours="siteConfig.hours"
  />
  <ContactSection
    eyebrow="Find us"
    title="Get in touch"
    :address="siteConfig.contact.address"
    :phone="siteConfig.contact.phone"
    :email="siteConfig.contact.email"
    :map-embed-url="siteConfig.contact.mapEmbedUrl"
  />
</template>
