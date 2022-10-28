import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property
} from "@mikro-orm/core";
import { BaseEntity } from "../base.entity";
import { AdminUser } from "./admin-user.entity";
import SysMenu from "./sys-menu.entity";

@Entity()
export class Role extends BaseEntity {
  @Property({ length: 100 })
  roleName: string;

  @Property({ length: 200, nullable: true })
  remark?: string;

  @OneToMany(() => AdminUser, (user) => user.role)
  users = new Collection<AdminUser>(this);

  @ManyToMany(() => SysMenu)
  menus = new Collection<SysMenu>(this);
}
