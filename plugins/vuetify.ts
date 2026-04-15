import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi },
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#3b82f6',
            secondary: '#64748b',
            accent: '#8b5cf6',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6',
            success: '#10b981',
            surface: '#ffffff',
            background: '#f3f4f6',
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: '#60a5fa',
            secondary: '#94a3b8',
            accent: '#a78bfa',
            error: '#f87171',
            warning: '#fbbf24',
            info: '#60a5fa',
            success: '#34d399',
            surface: '#1e293b',
            background: '#0f172a',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
