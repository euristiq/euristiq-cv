import { computed } from "vue";

// this key ('authUser') is what Nuxt uses under the hood to persist state
export const useAuth = () => {
  const user = useState<Record<string, any> | null>("authUser", () => null);
  const isLoggedIn = computed(() => !!user.value);
  return { user, isLoggedIn };
};
