import { createRouter, createWebHistory } from "vue-router";
import nprogress from "nprogress";
import { useAuthStore } from "@/stores/auth";
import { generatorDynamicRouter } from "@/utils/route";
import { getStorage } from "@/utils/storage";
import { localStorageKey } from "@/constants/storage";
import { MenuType } from "@/api/auth/model/LoginModel";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Layout",
      redirect: "/home",
      component: () => import("../views/Layout/index.vue"),
      children: [
        {
          path: "home",
          name: "Home",
          component: () => import("../views/Home/index.vue"),
          meta: {
            title: "首页",
            fullPath: "/home",
            menuType: MenuType.MENU,
            isShow: true,
          },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
      meta: {
        notRequireAuth: true,
      },
    },
  ],
});

router.beforeEach(async (to, from) => {
  nprogress.start();
  const authStore = useAuthStore();
  // 如果该路由不存在，可能是动态注册的路由，它还没准备好，需要再重定向一次到该路由
  if (!router.hasRoute(to.name!)) {
    const rawMenus = getStorage(localStorageKey.rawMenus, "local");
    if (rawMenus) {
      generatorDynamicRouter(rawMenus);
      return {
        ...to,
        replace: true,
      };
    } else {
      return {
        name: "login",
        query: { redirect: to.fullPath },
        replace: true,
      };
    }
  }
  if (authStore.accessToken) {
    /* if (to.name === "login") {
      return "/";
    } */
    return;
  } else {
    if (to.meta.notRequireAuth) {
      return;
    } else {
      return {
        name: "login",
        query: { redirect: to.fullPath },
        replace: true,
      };
    }
  }
});

router.afterEach((to, from) => {
  nprogress.done();
});

export default router;
