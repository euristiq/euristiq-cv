<template>
  <div id="landing-page">
    <SharedHeader />

    <div
      class="h-fit max-w-240 sm:(absolute inset-0 m-auto)"
      p="x-5 t-30 md:x-20 lt-sm:b-10"
    >
      <div text-center>
        <h1 text="3xl sm:4xl" v-html="$t('landing.hero')" />
        <div my-10 text="lg sm:xl">
          <SharedBrandName />
          {{ $t("landing.desc") }}
        </div>

        <ClientOnly>
          <GoogleLogin :callback="onGoogleSuccess" :error="onGoogleError" prompt />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { decodeCredential, GoogleLogin } from "vue3-google-login";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();

function onGoogleSuccess(response) {
  const decodedCredential = decodeCredential(response.credential);
  console.log("decodedCredential", decodedCredential);
  const userInfo = decodedCredential as UserInfo;
  userStore.login(userInfo);
  router.push("/dashboard");
}

function onGoogleError(error) {
  console.error("Google login error:", error);
}

onMounted(() => {
  if (userStore.isAuthenticatedUser) {
    router.push("/dashboard");
  }
});
</script>
