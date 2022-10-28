import { Controller, Get } from "@nestjs/common";
import { Authentication } from "src/common/decorators/authentication.decorator";

@Authentication()
@Controller("admin/menu")
export class MenuController {
  constructor() {}

  @Get("list")
  list() {
    return 666;
  }
}
