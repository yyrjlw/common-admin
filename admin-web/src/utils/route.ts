import type { RouteRecordRaw } from "vue-router";
import { isURL } from "class-validator";
import { MenuType } from "@/api/auth/model/LoginModel";
import type { Menu } from "@/api/auth/model/LoginModel";
import router from "@/router";
import NotFound from "@/views/NotFound.vue";

const modules = {};
const tempModules = import.meta.glob(["../views/**/*.vue", "!../views/Layout"]);
for (const key in tempModules) {
  let _key = key.slice(key.indexOf("views/") + "views/".length);
  if (_key.endsWith("/index.vue")) {
    _key = _key.slice(0, -"/index.vue".length);
  }
  const module = tempModules[key];
  modules[_key] = module;
}

const filterMenus = (
  menus: Menu[],
  parentMenu?: Menu,
  ancestorPath: string[] = ["/"]
) =>
  menus
    .filter((i) => i.parentMenu === parentMenu?.id)
    .map((item) => {
      const {
        menuName,
        menuType,
        router,
        viewPath,
        icon,
        orderNum,
        keepalive,
        isShow,
      } = item;
      //拼接路由全路径
      let fullPath = "";
      if (isURL(router)) {
        fullPath = router;
      } else {
        fullPath = ancestorPath.concat(router).join("/").replaceAll("//", "/");
      }

      //构建路由数据
      const route = {
        path: router,
        name: fullPath,
        meta: {
          title: menuName,
          fullPath,
          menuType,
          icon,
          orderNum,
          keepalive,
          isShow,
        },
      } as RouteRecordRaw;

      switch (item.menuType) {
        //如果是目录
        case MenuType.DIRECTORY:
          const children = filterMenus(
            menus,
            item,
            ancestorPath.concat(router)
          );
          route.children = children;
          break;
        //如果是菜单
        case MenuType.MENU:
          route.component = modules[viewPath] || NotFound;
          const perms = menus
            .filter((n) => n.parentMenu === item.id)
            .flatMap((n) => n.permissions?.split(","));
          if (route.meta && perms) {
            // 设置当前页面所拥有的权限
            route.meta.perms = perms;
          }
          break;
      }
      return route;
    });

export const generatorDynamicRouter = (asyncMenus: Menu[]) => {
  //生成动态路由
  const dynamicRouters = filterMenus(asyncMenus);
  //注入到vue-router
  const layoutRoute = router.getRoutes().find((i) => i.name === "Layout")!;
  layoutRoute.children.push(...dynamicRouters);
  router.addRoute(layoutRoute);

  return layoutRoute.children;
};
