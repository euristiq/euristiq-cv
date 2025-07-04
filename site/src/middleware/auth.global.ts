import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useUserStore } from "~/stores/users";

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();

  if (to.path === "/") {
    return;
  }

  if (!userStore.isAuthenticated) {
    // 3. If no user, redirect back to home
    return navigateTo("/");
  }
});
