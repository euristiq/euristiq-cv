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

        <UiButton
          :as="NuxtLink"
          :to="$nuxt.$localePath('/dashboard')"
          class="text-base h-11"
        >
          {{ $t("landing.start") }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
const router = useRouter();
const localePath = useLocalePath();

router.push(localePath(`/dashboard`));
</script>
