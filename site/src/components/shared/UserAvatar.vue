<!-- src/components/UserAvatar.vue -->
<template>
  <span
    v-if="status === 'authenticated'"
    class="inline-flex items-center mr-2 align-middle"
  >
    <img
      v-if="session?.user?.image"
      :src="session.user.image"
      :alt="session.user.name || 'User avatar'"
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

// auto-imported composable
const { data: session, status } = useAuth();

// derive initials from `session.user.name`
const initials = computed(() => {
  const name = session?.user?.name || "";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join("");
});
</script>
