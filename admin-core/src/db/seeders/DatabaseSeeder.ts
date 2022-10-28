import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { AdminUser } from "src/models/entity/admin/admin-user.entity";
import { Role } from "src/models/entity/admin/role.entity";
import SysMenu, { MenuType } from "src/models/entity/admin/sys-menu.entity";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const role = em.create(Role, {
      roleName: "root"
    });
    em.create(AdminUser, {
      nickName: "超管",
      userName: "admin",
      password: "admin123",
      role
    });

    const sysDire = em.create(SysMenu, {
      menuName: "系统",
      menuType: MenuType.DIRECTORY,
      router: "/sys",
      icon: ""
    });
    const permssionDire = em.create(SysMenu, {
      parentMenu: sysDire,
      menuName: "权限管理",
      menuType: MenuType.DIRECTORY,
      router: "/permssion",
      icon: ""
    });

    const permPrefix = "admin:";

    //#region 管理员列表

    const userMenu = em.create(SysMenu, {
      parentMenu: permssionDire,
      menuName: "管理员列表",
      menuType: MenuType.MENU,
      router: "/adminUser",
      viewPath: "views/system/permission/user",
      icon: ""
    });
    const viewUserPerm = em.create(SysMenu, {
      parentMenu: userMenu,
      menuName: "查询",
      menuType: MenuType.PERMISSION,
      permissions: `${permPrefix}user:list,${permPrefix}user:info`
    });
    const addUserPerm = em.create(SysMenu, {
      parentMenu: userMenu,
      menuName: "新增",
      menuType: MenuType.PERMISSION,
      permissions: permPrefix + "user:add"
    });
    const updateUserPerm = em.create(SysMenu, {
      parentMenu: userMenu,
      menuName: "修改",
      menuType: MenuType.PERMISSION,
      permissions: permPrefix + "user:update"
    });
    const deleteUserPerm = em.create(SysMenu, {
      parentMenu: userMenu,
      menuName: "删除",
      menuType: MenuType.PERMISSION,
      permissions: permPrefix + "user:delete"
    });

    //#endregion

    //#region 菜单列表

    const menuMenu = em.create(SysMenu, {
      parentMenu: permssionDire,
      menuName: "菜单列表",
      menuType: MenuType.MENU,
      router: "/menu",
      viewPath: "views/system/permission/menu",
      icon: ""
    });
    const viewMenuPerm = em.create(SysMenu, {
      parentMenu: menuMenu,
      menuName: "查询",
      menuType: MenuType.PERMISSION,
      permissions: `${permPrefix}menu:list,${permPrefix}menu:info`
    });
    const addMenuPerm = em.create(SysMenu, {
      parentMenu: menuMenu,
      menuName: "新增",
      menuType: MenuType.PERMISSION,
      permissions: permPrefix + "menu:add"
    });
    const updateMenuPerm = em.create(SysMenu, {
      parentMenu: menuMenu,
      menuName: "修改",
      menuType: MenuType.PERMISSION,
      permissions: permPrefix + "menu:update"
    });
    const deleteMenuPerm = em.create(SysMenu, {
      parentMenu: menuMenu,
      menuName: "删除",
      menuType: MenuType.PERMISSION,
      permissions: permPrefix + "menu:delete"
    });

    //#endregion

    //#region 角色列表

    const roleMenu = em.create(SysMenu, {
      parentMenu: permssionDire,
      menuName: "角色列表",
      menuType: MenuType.MENU,
      router: "/role",
      viewPath: "views/system/permission/role",
      icon: ""
    });
    const viewRolePerm = em.create(SysMenu, {
      parentMenu: roleMenu,
      menuName: "查询",
      menuType: MenuType.PERMISSION,
      permissions: `${permPrefix}role:list,${permPrefix}role:info`
    });
    const addRolePerm = em.create(SysMenu, {
      parentMenu: roleMenu,
      menuName: "新增",
      menuType: MenuType.PERMISSION,
      permissions: permPrefix + "role:add"
    });
    const updateRolePerm = em.create(SysMenu, {
      parentMenu: roleMenu,
      menuName: "修改",
      menuType: MenuType.PERMISSION,
      permissions: permPrefix + "role:update"
    });
    const deleteRolePerm = em.create(SysMenu, {
      parentMenu: roleMenu,
      menuName: "删除",
      menuType: MenuType.PERMISSION,
      permissions: permPrefix + "role:delete"
    });

    //#endregion

    role.menus.add(
      sysDire,
      permssionDire,
      userMenu,
      viewUserPerm,
      addUserPerm,
      updateUserPerm,
      deleteUserPerm,
      menuMenu,
      viewMenuPerm,
      addMenuPerm,
      updateMenuPerm,
      deleteMenuPerm,
      roleMenu,
      viewRolePerm,
      addRolePerm,
      updateRolePerm,
      deleteRolePerm
    );

    await em.flush();
  }
}
