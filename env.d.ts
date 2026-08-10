/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PLATFORM_ENABLED?: string
  readonly VITE_CONTENT_API?: string
  readonly VITE_SITE_SLUG?: string
  readonly VITE_SITE_ID?: string
  readonly VITE_GOOGLE_MAPS_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
