import { SetMetadata } from "@nestjs/common";
import { ANONYMOUS } from "../constants/decorator-metedata.constant";

/**
 * 跳过权限认证
 */
export const anonymous = SetMetadata(ANONYMOUS, true);
