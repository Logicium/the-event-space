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

const { variant: liveVariant, themeName } = useSiteTheme()
/* Editorial themes list events as index rows; the rest keep photo cards. */
const eventsLayout = computed(() => (themeName.value === 'studio' || themeName.value === 'atlas' ? 'index' : 'card'))
const locale = computed(() => siteConfig.contact.address.split(',').slice(1, 3).map(s => s.trim()).join(', '))
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
    :images="isPortfolio ? [siteConfig.photos.hero, ...siteConfig.photos.gallery.slice(0, 2)] : []"
    :locale="locale"
    :next-show-label="siteConfig.sections.hero.nextShowLabel"
    :cta-primary="siteConfig.sections.hero.ctaPrimary"
    :cta-secondary="siteConfig.sections.hero.ctaSecondary"
    :empty-cta-primary="siteConfig.sections.hero.emptyCtaPrimary"
    :empty-cta-secondary="siteConfig.sections.hero.emptyCtaSecondary"
  />
  <EventsListSection
    :eyebrow="siteConfig.sections.events.eyebrow"
    :title="siteConfig.sections.events.title"
    :events="siteConfig.events"
    :limit="isPortfolio ? 6 : 4"
    :venue-label="siteConfig.contact.address"
    :layout="eventsLayout"
  />
  <AboutSection
    :eyebrow="siteConfig.sections.story.eyebrow"
    :title="siteConfig.story.title"
    :paragraphs="siteConfig.story.paragraphs"
    :facts="siteConfig.story.facts"
    :image="siteConfig.photos.about.src"
    :image-alt="siteConfig.photos.about.alt"
  />
  <SeriesSection
    :eyebrow="siteConfig.sections.series.eyebrow"
    :title="siteConfig.sections.series.title"
    :series="siteConfig.series"
  />
  <GallerySection
    :eyebrow="siteConfig.sections.gallery.eyebrow"
    :photos="siteConfig.photos.gallery"
    :limit="galleryLimit"
    :layout="isPortfolio ? 'masonry' : 'grid'"
  />
  <TestimonialsSection
    :eyebrow="siteConfig.sections.reviews.eyebrow"
    :title="siteConfig.sections.reviews.title"
    :items="reviewItems"
  />
</template>
