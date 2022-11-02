import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Authentication } from "src/common/decorators/authentication.decorator";

@ApiTags("menu")
@ApiBearerAuth()
@Authentication()
@Controller("admin/menu")
export class MenuController {
  constructor() {}

  @Get("list")
  list() {
    return 666;
  }
}
