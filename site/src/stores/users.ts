import { defineStore } from "pinia";

export interface UserInfo {
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  hd: string;
  iat: number;
  iss: string;
  jti: string;
  name: string;
  nbf: number;
  sub: string;
  picture: string;
}

interface UserState {
  user: UserInfo | null;
  idToken: string | null;
  awsUserId: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    user: null,
    idToken: null,
    awsUserId: null,
    isAuthenticated: false,
    isAdmin: false
  }),

  actions: {
    login(idToken: string, decoder: (string: string) => UserInfo) {
      const adminEmails = useRuntimeConfig().public.adminEmails;
      const userData = decoder(idToken);
      this.user = userData;
      this.idToken = idToken;
      this.isAuthenticated = true;
      this.isAdmin = adminEmails.includes(userData.email) || false;
    },

    startAwsSession(awsUserId: string) {
      this.awsUserId = awsUserId;
    },

    logout() {
      this.user = null;
      this.idToken = null;
      this.isAuthenticated = false;
      this.isAdmin = false;
    }
  },

  getters: {
    getUser(state): UserInfo | null {
      return state.user;
    },

    isAuthenticatedUser(state): boolean {
      return state.isAuthenticated;
    },

    isAdminUser(state): boolean {
      return state.isAdmin;
    }
  }
});
