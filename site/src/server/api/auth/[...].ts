import GoogleProvider from "next-auth/providers/google";
import { NuxtAuthHandler } from "#auth";
import { useRuntimeConfig } from "#imports";

export default NuxtAuthHandler({
  // Encrypt cookies; must match NUXT_AUTH_SECRET
  secret: useRuntimeConfig().authSecret,
  providers: [
    // @ts-expect-error For SSR compatibility
    GoogleProvider.default({
      clientId: useRuntimeConfig().googleClientId,
      clientSecret: useRuntimeConfig().googleClientSecret,
      authorization: {
        params: {
          prompt: "select_account", // force account chooser
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    // After successful sign-in, always go to /dashboard
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    }
  }
});
