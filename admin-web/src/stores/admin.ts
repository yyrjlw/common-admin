import { sessionStorageKey } from "@/constants/storage";
import router from "@/router";
import { getStorage, setStorage } from "@/utils/storage";
import { defineStore } from "pinia";
import { v4 as uuidV4 } from "uuid";
import md5 from "md5";
import { login } from "@/api/auth";
import type { LoginParams } from "@/interfaces/auth";
import dayjs from "dayjs";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    accessToken: getStorage(sessionStorageKey.accessToken, "session"),
    expiresIn: getStorage(sessionStorageKey.expiresIn, "session"),
    tokenVersion: uuidV4(),
    profile: {
      avatar: "https://www.ykt9.com/static/img/profile.8bc564d2.jpg",
      uuid: getStorage(sessionStorageKey.uuid, "session"),
    },
  }),
  actions: {
    setToken(data: any) {
      this.accessToken = data.accessToken;
      this.expiresIn = data.expiresIn;
      this.tokenVersion = uuidV4();
      setStorage(sessionStorageKey.accessToken, this.accessToken, "session");
      setStorage(sessionStorageKey.expiresIn, this.expiresIn, "session");
    },
    setProfile(data: any) {
      this.profile.uuid = data.uuid;
      setStorage(sessionStorageKey.uuid, data.uuid, "session");
    },
    clearUserInfo() {
      this.accessToken = null;
      this.expiresIn = null;
      this.profile.uuid = null;
      window.sessionStorage.clear();
    },
    async login(loginParams: LoginParams) {
      loginParams.timestamp = dayjs().unix();
      loginParams.password = md5(
        md5(loginParams.password) + loginParams.timestamp
      );
      const result = await login(loginParams);

      this.setToken(result.data);
      this.setProfile(result.data);

      router.push("/");
    },
    logout() {
      this.clearUserInfo();
      router.push("/login");
    },
  },
});
