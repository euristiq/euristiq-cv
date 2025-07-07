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
  isAuthenticated: boolean;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    user: null,
    isAuthenticated: false
  }),

  actions: {
    login(userData: UserInfo) {
      this.user = userData;
      this.isAuthenticated = true;
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;
    }
  },

  getters: {
    getUser(state): UserInfo | null {
      return state.user;
    },

    isAuthenticatedUser(state): boolean {
      return state.isAuthenticated;
    }
  }
});
