import { PrimaryKey, Property } from "@mikro-orm/core";
import dayjs from "dayjs";

export abstract class BaseEntity {
  @PrimaryKey()
  id: number;

  @Property({ unsigned: true })
  createTime: number = dayjs().unix();

  @Property()
  createBy?: number;

  @Property({
    unsigned: true,
    onUpdate: () => dayjs().unix(),
  })
  updateTime?: number;

  @Property()
  updateBy?: number;

  @Property({ unsigned: true })
  deleteTime?: number;

  @Property()
  isDelete: boolean = false;
}
