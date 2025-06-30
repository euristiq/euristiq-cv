<template>
  <span v-if="isLoggedIn" class="inline-flex items-center mr-2 align-middle">
    <img
      v-if="user?.picture"
      :src="user.picture"
      :alt="user.name || 'User avatar'"
      class="h-10 w-10 rounded-full object-cover"
    />
    <div
      v-else
      class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700"
    >
      {{ initials }}
    </div>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuth } from "~/composables/useAuth";

const { user, isLoggedIn } = useAuth();

console.log(isLoggedIn);
console.log(user);

const initials = computed(() => {
  const name = user?.name || "";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join("");
});
</script>
