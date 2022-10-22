import { Entity, Property, BeforeCreate } from "@mikro-orm/core";
import { randomString } from "src/common/utils/string.util";
import { BaseEntity } from "../base.entity";
import md5 from "md5";

@Entity({ comment: "后台管理员账户表" })
export class AdminAccount extends BaseEntity {
  @Property({ length: 50 })
  userName: string;

  @Property({ length: 100 })
  password: string;

  @Property({ length: 10 })
  salt: string = randomString(10);

  /** 给密码加点盐 */
  @BeforeCreate()
  saltingForPwd() {
    this.password = md5(md5(this.password) + this.salt);
  }
}
