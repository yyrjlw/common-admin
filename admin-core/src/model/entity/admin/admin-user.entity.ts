import { Entity, Property, BeforeCreate, ManyToOne } from "@mikro-orm/core";
import { md5 } from "src/common/utils/encrypt.util";
import { randomString } from "src/common/utils/string.util";
import { BaseEntity } from "../base.entity";
import { Role } from "./role.entity";

@Entity({ comment: "后台管理员账户表" })
export class AdminUser extends BaseEntity {
  @Property({ length: 100 })
  userName: string;

  @Property({ length: 100 })
  nickName: string;

  @Property({ length: 150 })
  password: string;

  @Property({ length: 10 })
  salt: string = randomString(10);

  @Property({ length: 200 })
  remark?: string;

  @ManyToOne()
  role: Role;

  /** 给密码加点盐 */
  @BeforeCreate()
  saltingForPwd() {
    this.password = md5(this.password, this.salt);
  }
}
