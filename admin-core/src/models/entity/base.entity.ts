import { PrimaryKey, Property } from "@mikro-orm/core";
import dayjs from "dayjs";

export abstract class BaseEntity {
  @PrimaryKey()
  id: number;

  @Property({ unsigned: true, onCreate: () => dayjs().unix() })
  createTime: number;

  @Property({ nullable: true })
  createBy?: number;

  @Property({
    unsigned: true,
    nullable: true,
    onUpdate: () => dayjs().unix()
  })
  updateTime?: number;

  @Property({ nullable: true })
  updateBy?: number;

  @Property({ unsigned: true, nullable: true })
  deleteTime?: number;

  @Property()
  isDelete: boolean = false;
}
