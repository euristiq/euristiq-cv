import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useUserStore } from "~/stores/users";

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticatedUser } = useUserStore();

  if (!isAuthenticatedUser && to.path !== "/") {
    return navigateTo("/");
  }
});
