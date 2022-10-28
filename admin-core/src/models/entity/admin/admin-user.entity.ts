import {
  Entity,
  Property,
  BeforeCreate,
  ManyToOne,
  IdentifiedReference
} from "@mikro-orm/core";
import { md5 } from "src/common/utils/encrypt.util";
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

  @Property({ length: 200, nullable: true })
  remark?: string;

  @ManyToOne(() => Role)
  role: IdentifiedReference<Role>;

  /** 给密码加点盐 */
  @BeforeCreate()
  saltingForPwd() {
    this.password = md5(this.password);
  }
}
