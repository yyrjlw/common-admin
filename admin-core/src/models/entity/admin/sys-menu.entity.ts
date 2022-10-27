import {
  Collection,
  Entity,
  Enum,
  IdentifiedReference,
  ManyToMany,
  ManyToOne,
  Property,
} from "@mikro-orm/core";
import { BaseEntity } from "../base.entity";
import { Role } from "./role.entity";

@Entity()
export default class SysMenu extends BaseEntity {
  @ManyToOne()
  parentMenu?: IdentifiedReference<SysMenu>;

  @Property({ length: 100 })
  menuName: string;

  @Enum({ items: () => MenuType, comment: "菜单类型:0目录 1菜单 2权限" })
  menuType: MenuType;

  @Property({ length: 200, comment: "客户端路由" })
  router?: string;

  @Property({ length: 200, comment: "权限字符串" })
  permissions?: string;

  @Property({ length: 200, comment: "客户端视图路径" })
  viewPath?: string;

  @Property({ length: 100 })
  icon?: string;

  @Property()
  orderNum: number = 0;

  @Property({ comment: "视图是否缓存" })
  keepalive: boolean = true;

  @Property({ comment: "是否显示" })
  isShow: boolean = true;

  @ManyToMany(() => Role, (role) => role.menus)
  roles = new Collection<Role>(this);
}

export enum MenuType {
  DIRECTORY,
  MENU,
  PERMISSION,
}
