import { pwa } from "./configs/pwa";
import { i18n } from "./configs/i18n";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "src/",

  modules: [
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "@nuxtjs/color-mode",
    "@vite-pwa/nuxt",
    "@sidebase/nuxt-auth",
    "radix-vue/nuxt",
    "shadcn-nuxt"
  ],
  //
  // nitro: {
  //   // avoid the auth-redirect / 404 spam by only prerendering exactly these
  //   prerender: {
  //     crawlLinks: false,
  //     routes: ["/", "/dashboard"]
  //   },
  //   // ensure Unenv always sees an array here (never `undefined`)
  //   unenv: []
  // },

  auth: {
    baseURL: "http://localhost:3000/api/auth/",
    disableServerSideAuth: true,
    // Use the Auth.js provider, defaulting directly to Google
    provider: {
      type: "authjs",
      defaultProvider: "google",
      addDefaultCallbackUrl: true
    },
    // Protect every route by default
    globalAppMiddleware: true
  },

  routeRules: {
    "/api/**": { prerender: false }
  },

  css: [
    "@unocss/reset/tailwind.css",
    "katex/dist/katex.min.css",
    "~/assets/css/index.css"
  ],

  i18n,

  shadcn: {
    prefix: "Ui",
    componentDir: "./src/components/ui"
  },

  runtimeConfig: {
    public: {
      googleFontsKey: "",
      googleClientId: process.env.GOOGLE_CLIENT_ID || ""
    },
    authSecret: process.env.NUXT_AUTH_SECRET || "",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
  },

  colorMode: {
    classSuffix: ""
  },

  app: {
    head: {
      viewport: "width=device-width,initial-scale=1",
      link: [
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#222" }
      ],
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "application-name", content: "Euristiq CV!" },
        { name: "apple-mobile-web-app-title", content: "Euristiq CV!" },
        { name: "msapplication-TileColor", content: "#fff" },
        { property: "og:url", content: "https://ohmycv.app" },
        { property: "og:type", content: "website" }
      ]
    }
  },

  // site: {
  //   url: "https://cv.euristiq.dev"
  // },

  pwa,

  vite: {
    resolve: {
      alias: {
        "@ohmycv/case-police": "../packages/case-police/src/index.ts",
        "@ohmycv/dynamic-css": "../packages/dynamic-css/src/index.ts",
        "@ohmycv/front-matter": "../packages/front-matter/src/index.ts",
        "@ohmycv/google-fonts-loader": "../packages/google-fonts-loader/src/index.ts",
        "@ohmycv/markdown-it-cross-ref": "../packages/markdown-it-cross-ref/src/index.ts",
        "@ohmycv/markdown-it-katex": "../packages/markdown-it-katex/src/index.ts",
        "@ohmycv/markdown-it-latex-cmds":
          "../packages/markdown-it-latex-cmds/src/index.ts",
        "@renovamen/utils": "../packages/utils/src/index.ts",
        "@ohmycv/vue-shortcuts": "../packages/vue-shortcuts/src/index.ts",
        "@ohmycv/vue-smart-pages": "../packages/vue-smart-pages/src/index.ts",
        "@ohmycv/vue-zoom": "../packages/vue-zoom/src/index.ts"
      }
    }
  },

  compatibilityDate: "2025-06-18"
});
