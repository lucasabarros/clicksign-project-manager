import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  ssr: false,

  modules: ['@pinia/nuxt', '@nuxt/eslint'],

  components: [{ path: '~/components', pathPrefix: false }],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  css: ['~/assets/styles/main.scss'],

  vite: {
    plugins: [svgLoader({ svgo: false })],
  },

  app: {
    head: {
      title: 'Gerenciador de Projetos',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Encode+Sans+Semi+Expanded:wght@400;500;600;700&family=Encode+Sans+Expanded:wght@400&display=swap',
        },
      ],
    },
  },
})
