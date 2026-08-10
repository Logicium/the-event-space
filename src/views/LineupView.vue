<script setup lang="ts">
import { siteConfig } from '../config/site.config'
import HeroSection from '@apotome/archetype-shared/components/sections/HeroSection.vue'
import LineupSection from '../components/sections/LineupSection.vue'
</script>

<template>
  <HeroSection
    subpage
    eyebrow="Lineup"
    title="Artists & company"
    subtitle="The people who make this place go — residents, regulars, and the company behind the curtain."
    :image="siteConfig.photos.about.src"
    :image-alt="siteConfig.photos.about.alt"
  />
  <LineupSection
    :performers="siteConfig.performers"
  />
</template>
