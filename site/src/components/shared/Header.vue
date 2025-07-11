<template xmlns:i-tabler="http://www.w3.org/1999/xhtml">
  <header class="hstack justify-between pl-4 pr-1">
    <nuxt-link
      class="hstack gap-x-2"
      :to="
        useUserStore().isAuthenticated
          ? $nuxt.$localePath('/dashboard')
          : $nuxt.$localePath('/')
      "
    >
      <SharedLogo text-base />
      <div text-lg><SharedBrandName /></div>
    </nuxt-link>

    <div class="hstack">
      <UiButton
        v-if="false"
        :as="NuxtLink"
        :to="$nuxt.$localePath('/dashboard')"
        variant="ghost-secondary"
        size="xs"
        class="h-8 gap-x-1"
        :aria-label="$t('dashboard.my_resumes')"
      >
        <span class="i-ep:menu text-lg" />
        <span class="hide-on-mobile text-base">
          {{ $t("dashboard.my_resumes") }}
        </span>
      </UiButton>

      <UiDropdownMenu>
        <UiDropdownMenuTrigger as-child>
          <UiButton
            v-if="false"
            variant="ghost-secondary"
            size="xs"
            class="h-8 gap-x-1"
            :aria-label="`Switch the language from: ${localeName}`"
          >
            <span class="i-ic:round-translate text-lg" />
            <span class="hide-on-mobile text-base">
              {{ localeName }}
            </span>
          </UiButton>
        </UiDropdownMenuTrigger>
        <UiDropdownMenuContent class="min-w-28" align="start" :side-offset="0">
          <UiDropdownMenuItem
            v-for="item in availableLocales"
            :key="item.code"
            :as="NuxtLink"
            :to="switchLocalePath(item.code)"
          >
            <span v-if="item.icon" :class="[item.icon, 'text-base mr-1.5']" />
            {{ item.name }}
          </UiDropdownMenuItem>
        </UiDropdownMenuContent>
      </UiDropdownMenu>

      <slot name="tail" />

      <SharedToggleDark />
      <LogoutButton />

      <UiButton
        v-if="false"
        as="a"
        variant="ghost-secondary"
        size="round"
        href="http://github.com/Renovamen/oh-my-cv"
        target="_blank"
        rel="nofollow noopener"
      >
        <span i-tabler:brand-github text-lg />
      </UiButton>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { NuxtLink } from "#components";
import LogoutButton from "~/components/shared/LogoutButton.vue";
import { useUserStore } from "~/stores/users";

const switchLocalePath = useSwitchLocalePath();
const { locale, locales } = useI18n();

const availableLocales = computed(() =>
  locales.value.filter((i) => i.code !== locale.value)
);

const localeName = computed(
  () => locales.value.find((i) => i.code === locale.value)?.name || ""
);
</script>
