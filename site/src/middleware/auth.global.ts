import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth();

  if (to.path === "/") {
    return;
  }

  if (!user.value) {
    // 3. If no user, redirect back to home
    return navigateTo("/");
  }
});
