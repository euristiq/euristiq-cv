<template>
  <Button
    v-if="route.path !== '/'"
    variant="ghost"
    class="gap-2 px-3 py-1 text-sm text-muted-foreground hover:bg-muted/20"
    @click="handleLogout"
  >
    <LogOutIcon class="h-4 w-4" />
    Logout
  </Button>
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { LogOut as LogOutIcon } from "lucide-vue-next";
import { googleLogout } from "vue3-google-login";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useUserStore } from "~/stores/users";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const handleLogout = () => {
  userStore.logout();
  googleLogout();
  router.push("/");
};
</script>
