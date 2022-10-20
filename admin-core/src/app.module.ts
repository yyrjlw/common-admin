import { Module } from "@nestjs/common";
import { TestController } from "./controllers/test.controller";

@Module({
  controllers: [TestController],
})
export class AppModule {}
