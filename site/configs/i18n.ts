import type { NuxtI18nOptions } from "@nuxtjs/i18n";

export const i18n: NuxtI18nOptions = {
  defaultLocale: "en",
  strategy: "prefix_and_default",
  locales: [
    {
      code: "en",
      name: "English",
      icon: "i-icon-park-outline:english",
      file: "en.yaml"
    },
    {
      code: "sp",
      name: "Spanish",
      icon: "i-material-symbols:language-spanish",
      file: "sp.yaml"
    }
  ],
  langDir: "i18n",
  compilation: {
    strictMessage: false
  }
};
