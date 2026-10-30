<script setup lang="ts">
import { siteConfig } from '../config/site.config'
import HeroSection from '@apotome/archetype-shared/components/sections/HeroSection.vue'
import LineupSection from '../components/sections/LineupSection.vue'
</script>

<template>
  <HeroSection
    subpage
    :eyebrow="siteConfig.sections.lineupPage.eyebrow"
    :title="siteConfig.sections.lineupPage.title"
    :subtitle="siteConfig.sections.lineupPage.subtitle"
    :image="siteConfig.photos.about.src"
    :image-alt="siteConfig.photos.about.alt"
  />
  <LineupSection
    :performers="siteConfig.performers"
  />
</template>
