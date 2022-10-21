import {
  Injectable,
  LoggerService as NestLoggerService,
  LogLevel,
} from "@nestjs/common";
import { ConfigService } from "src/config/config.service";

@Injectable()
export class LoggerService implements NestLoggerService {
  constructor(private readonly configService: ConfigService) {}

  //TODO 日志适配器
  _log: Logger;

  log(message: any, ...optionalParams: any[]) {
    this._log.info(message, optionalParams);
  }
  error(message: any, ...optionalParams: any[]) {
    this._log.error(message, optionalParams);
  }
  warn(message: any, ...optionalParams: any[]) {
    this._log.warn(message, optionalParams);
  }
  debug?(message: any, ...optionalParams: any[]) {
    this._log.debug(message, optionalParams);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    this._log.trace(message, optionalParams);
  }
  setLogLevels?(levels: LogLevel[]) {
    this._log.level = levels[0];
  }
}
