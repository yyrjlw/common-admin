export interface Captcha {
  img: string;
  id: string;
}

export enum MenuType {
  DIRECTORY,
  MENU,
  PERMISSION,
}

export interface Menu {
  id: number;
  parentMenu: number;
  menuName: string;
  menuType: MenuType;
  router: string;
  permissions: string;
  viewPath: string;
  icon: string;
  orderNum: number;
  keepalive: boolean;
  isShow: boolean;
}

export interface PermMenu {
  perms: string[];
  menus: Menu[];
}
