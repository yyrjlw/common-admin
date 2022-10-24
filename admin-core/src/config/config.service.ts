import { Inject } from "@nestjs/common";
import { CONFIG_MODEL } from "./config.constants";
import { ConfigModel } from "./config.model";

export class ConfigService {
  constructor(@Inject(CONFIG_MODEL) private configModel: ConfigModel) {}

  static isDevelopment = process.env.NODE_ENV !== "production";

  get<T = any>(key: keyof ConfigModel): T {
    return this.configModel[key] as T;
  }
}
