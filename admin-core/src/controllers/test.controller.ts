import { Controller, Get } from "@nestjs/common";

@Controller()
export class TestController {
  @Get("hello")
  getHello() {
    return "hello";
  }
}
