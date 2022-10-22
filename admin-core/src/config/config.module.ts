import { FactoryProvider, Module } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { readFileSync } from "node:fs";
import { ConfigModel } from "./config.model";
import { ConfigService } from "./config.service";
import YAML from "yaml";
import { validateOrReject } from "class-validator";
import { join } from "node:path";
import { CONFIG_MODEL } from "./config.constants";
import { cwd } from "node:process";

const configModel: FactoryProvider = {
  provide: CONFIG_MODEL,
  async useFactory() {
    const configFile = readFileSync(
      join(
        cwd(),
        `config${!ConfigService.isDevelopment ? ".production" : ""}.yml`
      ),
      { encoding: "utf-8" }
    );

    const configModel =
      plainToInstance(ConfigModel, YAML.parse(configFile)) ?? new ConfigModel();

    try {
      await validateOrReject(configModel);
    } catch (error) {
      console.error(error);
      throw new Error("配置文件验证失败!请检查配置文件。");
    }
    return configModel;
  },
};

@Module({
  providers: [configModel, ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
