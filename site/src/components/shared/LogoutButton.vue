<template>
  <Button
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

// Nuxt auto-imports these for you:
const { signOut, signIn } = useAuth();

async function handleLogout() {
  // 1) clear the NextAuth session but don't redirect
  await signOut({ redirect: false });

  // 2) immediately kick off a fresh Google OAuth flow
  await signIn("google", { callbackUrl: "/dashboard" });
}
</script>
