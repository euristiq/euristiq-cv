// plugins/vue3-google-login.client.ts
import vue3GoogleLogin from "vue3-google-login";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vue3GoogleLogin, {
    clientId: useRuntimeConfig().public.googleClientId
  });
});
