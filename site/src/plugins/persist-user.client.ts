import { useUserStore } from "~/stores/users";
import { watch } from "vue";

export default defineNuxtPlugin(() => {
  const store = useUserStore();

  // on app start, load any saved state
  const saved = localStorage.getItem("user-store");
  if (saved) {
    try {
      store.$patch(JSON.parse(saved));
    } catch {
      localStorage.removeItem("user-store");
    }
  }

  // whenever the store changes, sync to localStorage
  watch(
    () => store.$state,
    (state) => {
      localStorage.setItem("user-store", JSON.stringify(state));
    },
    { deep: true }
  );
});
