// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    async (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', async (config) => {
        const vuetify = await import('vite-plugin-vuetify')
        const plugins = (config.plugins ?? []) as unknown[]
        plugins.push(
          vuetify.default({
            autoImport: true,
            styles: { configFile: 'assets/settings.scss' },
          })
        )
      })
    },
  ],

  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css', '~/assets/main.css'],

  build: {
    transpile: ['vuetify'],
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  tailwindcss: {
    cssPath: '~/assets/tailwind.css',
    configPath: 'tailwind.config.js',
  },
})
