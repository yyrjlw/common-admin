import { PrimaryKey, Property } from "@mikro-orm/core";

export abstract class BaseEntity {
  @PrimaryKey()
  id: number;

  @Property({ unsigned: true })
  createTime: number = Math.round(new Date().getTime());

  @Property({ nullable: true })
  createBy?: number;

  @Property({
    unsigned: true,
    nullable: true,
    onUpdate: () => Math.round(new Date().getTime()),
  })
  updateTime: number;

  @Property({ nullable: true })
  updateBy?: number;

  @Property({ unsigned: true, nullable: true })
  deleteTime: number;

  @Property()
  isDelete: boolean = false;
}
