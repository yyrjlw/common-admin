import { EntityRepository } from "@mikro-orm/mysql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import SysMenu, { MenuType } from "src/models/entity/admin/sys-menu.entity";

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(SysMenu)
    private readonly sysmenuRepostory: EntityRepository<SysMenu>
  ) {}

  async getPerms(roleID: number) {
    const result: string[] = [];
    const perms = await this.sysmenuRepostory.find({
      roles: roleID,
      menuType: MenuType.PERMISSION
    });
    perms.forEach((i) => result.push(...i.permissions.split(",")));
    return result;
  }

  async getMenus(roleID: number) {
    return await this.sysmenuRepostory.find({
      roles: roleID,
      menuType: { $ne: MenuType.PERMISSION }
    });
  }
}
