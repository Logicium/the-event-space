<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { siteConfig } from './config/site.config'
import { useSiteTheme } from '@apotome/archetype-shared/composables/useSiteTheme'
import { useImagePreload } from '@apotome/archetype-shared/composables/useImagePreload'
import { useApScrollbar } from '@apotome/archetype-shared/composables/useApScrollbar'
import { usePreferences } from '@apotome/archetype-shared/composables/usePreferences'
import { variantAtLeast } from '@apotome/archetype-shared/themes/tokens'
import AppHeader from '@apotome/archetype-shared/components/layout/AppHeader.vue'
import AppFooter from '@apotome/archetype-shared/components/layout/AppFooter.vue'
import AppLoader from '@apotome/archetype-shared/components/AppLoader.vue'
import ThemeSwitcher from '@apotome/archetype-shared/components/ThemeSwitcher.vue'

const { initFromConfig } = useSiteTheme()
const { isReady, progress, loaded, total, label, preloadCritical } = useImagePreload()

onMounted(async () => {
  initFromConfig(siteConfig, 'venue')
  useApScrollbar()
  try {
    await preloadCritical([
      siteConfig.photos.hero.src,
      siteConfig.photos.about.src,
      ...siteConfig.events.slice(0, 3).map(e => e.image),
      ...siteConfig.photos.gallery.map(p => p.src),
    ])
  } catch {
    // Malformed hydrated content must never strand the splash screen.
    await preloadCritical([])
  }
})

const showSwitcher = usePreferences().themePickerVisible

const navLinks = computed(() => {
  const base = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
    { to: '/visit', label: 'Visit' },
    { to: '/tickets', label: 'Tickets' },
  ]
  if (variantAtLeast(siteConfig.variant, 'portfolio')) {
    // Insert Lineup before Tickets and Gallery before Tickets.
    base.splice(3, 0, { to: '/lineup', label: 'Lineup' })
    base.splice(4, 0, { to: '/gallery', label: 'Gallery' })
  }
  return base
})
</script>

<template>
  <AppLoader :brand="siteConfig.brand" :visible="!isReady" :progress="progress" :loaded="loaded" :total="total" :label="label" />
  <AppHeader
    :brand="siteConfig.brand"
    :tagline="siteConfig.tagline"
    :links="navLinks"
    cta-label="Tickets"
    cta-to="/tickets"
  />
  <main><RouterView /></main>
  <AppFooter
    :brand="siteConfig.brand"
    :blurb="siteConfig.blurb"
    :address="siteConfig.contact.address"
    :phone="siteConfig.contact.phone"
    :email="siteConfig.contact.email"
    :links="navLinks"
    :social="siteConfig.social"
  />
  <ThemeSwitcher v-if="showSwitcher" />
</template>
