import { localStorageKey, sessionStorageKey } from "@/constants/storage";
import router from "@/router";
import { getStorage, setStorage } from "@/utils/storage";
import { defineStore } from "pinia";
import { v4 as uuidV4 } from "uuid";
import md5 from "md5";
import { getPermmenu, login } from "@/api/auth";
import type { LoginParams } from "@/models/auth";
import dayjs from "dayjs";
import { generatorDynamicRouter } from "@/utils/route";
import type { RouteRecordRaw } from "vue-router";
import type { Menu } from "@/api/auth/model/LoginModel";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: getStorage(sessionStorageKey.accessToken, "session"),
    expiresIn: getStorage(sessionStorageKey.expiresIn, "session"),
    tokenVersion: uuidV4(),
    perms: getStorage(localStorageKey.perms, "local") as string[],
    menus: getStorage(localStorageKey.menus, "local") as RouteRecordRaw[],
    profile: {
      avatar: "https://www.ykt9.com/static/img/profile.8bc564d2.jpg",
      uuid: getStorage(sessionStorageKey.uuid, "session"),
    },
  }),
  actions: {
    setMenuOrPerms({
      menus,
      perms,
    }: {
      menus?: RouteRecordRaw[];
      perms?: string[];
    }) {
      if (!menus && !perms) {
        console.warn("menus和perms都为空");
        return;
      }
      if (menus) {
        this.menus = menus;
        setStorage(localStorageKey.menus, menus, "local");
      }
      if (perms) {
        this.perms = perms;
        setStorage(localStorageKey.perms, perms, "local");
      }
    },
    setToken(data: Pick<typeof this, "accessToken" | "expiresIn">) {
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

      //登录成功后获取权限和菜单
      const { data } = await getPermmenu();
      this.perms = data.perms;

      const dynamicRouters = generatorDynamicRouter(data.menus);
      this.setMenuOrPerms({
        menus: dynamicRouters.filter((i) => i.meta?.isShow),
      });
      setStorage(localStorageKey.rawMenus, data.menus, "local");
    },
    logout() {
      this.clearUserInfo();
      router.replace("/login");
    },
  },
});
