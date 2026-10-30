import { createRouter, createWebHistory } from 'vue-router'
import { siteConfig } from '../config/site.config'
import { PLATFORM_ENABLED } from '@apotome/archetype-shared/platform/config'
import { adminRoutes } from '@apotome/archetype-shared/admin/routes'
import { requireVariant } from '@apotome/archetype-shared/platform/variantGuard'
import { installAnalytics } from '@apotome/archetype-shared/platform/track'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/events', name: 'events', component: () => import('../views/EventsView.vue') },
    { path: '/visit', name: 'visit', component: () => import('../views/VisitView.vue') },
    { path: '/tickets', name: 'tickets', component: () => import('../views/TicketsView.vue') },
    // Always registered; the guard keeps them paid-only. Omitting the routes
    // here would strand upgraded sites, whose variant only arrives after
    // this module has already been evaluated.
    {
      path: '/lineup',
      name: 'lineup',
      component: () => import('../views/LineupView.vue'),
      beforeEnter: requireVariant('portfolio', () => siteConfig.variant),
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: () => import('../views/GalleryView.vue'),
      beforeEnter: requireVariant('portfolio', () => siteConfig.variant),
    },
    ...(PLATFORM_ENABLED ? adminRoutes : []),
  ],
  scrollBehavior: () => ({ top: 0 }),
})

installAnalytics(router)

export default router
