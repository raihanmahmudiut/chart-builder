/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Important: Prefix Tailwind classes to avoid conflicts with Vuetify
  // prefix: 'tw-',
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to avoid conflicts with Vuetify
  }
}

