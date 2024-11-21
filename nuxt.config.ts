// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: [
    // "@/assets/sneat/vendor/css/core.css",
    // "@/assets/sneat/vendor/css/theme-default.css",
    // "@/assets/sneat/css/demo.css",
    // "@/assets/sneat/vendor/fonts/boxicons.css",
    // "vue-toastification/dist/index.css",
    // "@/assets/index.scss",
  ],
  app: {
    head: {
      htmlAttrs: {
        class: "light-style layout-menu-fixed layout-compact",
      },
    },
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "page", mode: "out-in" },
  },
  imports: {
    autoImport: true,
  },
  routeRules: {
    "/": {
      redirect: "/auth/login",
    },
  },
  devServer: {
    host: "0.0.0.0",
  },
  runtimeConfig: {
    cookieName: "token",
    cookieSecret: "effc35767c31fd462d5df5f83332aa79",
    cookieExpires: (60 * 60 * 24 * 1000).toString(),
    public: {
      siteUrl: process.env.SITE_URL,
    },
  },
  modules: ["@pinia/nuxt", "@nuxtjs/i18n"],
  build: {
    transpile: ["vue-toastification"],
  },
  i18n: {
    langDir: "locales/",
    strategy: "no_prefix",
    defaultLocale: "tr",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
    locales: [
      { code: "en", file: "en.json" },
      { code: "tr", file: "tr.json" },
    ],
    compilation: {
      strictMessage: false,
    },
  },
});
