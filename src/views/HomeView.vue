<script setup lang="ts">
import { computed } from 'vue'
import { siteConfig } from '../config/site.config'
import { VARIANT_PHOTO_COUNT, resolveVariant, variantAtLeast } from '@apotome/archetype-shared/themes/tokens'
import { useSiteContentStore } from '@apotome/archetype-shared/platform/siteContentStore'
import { useSiteTheme } from '@apotome/archetype-shared/composables/useSiteTheme'
import AboutSection from '@apotome/archetype-shared/components/sections/AboutSection.vue'
import GallerySection from '@apotome/archetype-shared/components/sections/GallerySection.vue'
import TestimonialsSection from '@apotome/archetype-shared/components/sections/TestimonialsSection.vue'
import NextShowHero from '../components/sections/NextShowHero.vue'
import EventsListSection from '../components/sections/EventsListSection.vue'
import SeriesSection from '../components/sections/SeriesSection.vue'

const { variant: liveVariant } = useSiteTheme()
const galleryLimit = computed(() => VARIANT_PHOTO_COUNT[resolveVariant(liveVariant.value)].gallery)
const isPortfolio = computed(() => variantAtLeast(liveVariant.value, 'portfolio'))
const content = useSiteContentStore()
const reviewItems = computed(() =>
  content.reviewsSource === 'google' && content.googleReviews.length
    ? content.googleReviews
    : siteConfig.testimonials,
)
</script>

<template>
  <NextShowHero
    :brand="siteConfig.brand"
    :tagline="siteConfig.tagline"
    :blurb="siteConfig.blurb"
    :events="siteConfig.events"
    :hero-image="siteConfig.photos.hero.src"
    :hero-image-alt="siteConfig.photos.hero.alt"
  />
  <EventsListSection
    eyebrow="What's on"
    title="Coming up"
    :events="siteConfig.events"
    :limit="isPortfolio ? 6 : 4"
    :venue-label="siteConfig.contact.address"
  />
  <AboutSection
    eyebrow="About"
    :title="siteConfig.story.title"
    :paragraphs="siteConfig.story.paragraphs"
    :facts="siteConfig.story.facts"
    :image="siteConfig.photos.about.src"
    :image-alt="siteConfig.photos.about.alt"
  />
  <SeriesSection
    eyebrow="Every month"
    title="Programs you can count on"
    :series="siteConfig.series"
  />
  <GallerySection
    eyebrow="On stage"
    :photos="siteConfig.photos.gallery"
    :limit="galleryLimit"
    :layout="isPortfolio ? 'masonry' : 'grid'"
  />
  <TestimonialsSection
    eyebrow="What people say"
    :items="reviewItems"
  />
</template>
