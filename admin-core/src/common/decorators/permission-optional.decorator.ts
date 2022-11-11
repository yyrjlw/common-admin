import { SetMetadata } from "@nestjs/common";
import { PERMISSIONOPTIONAL } from "../constants/decorator-metedata.constant";

/**
 * 无需权限，但必须登录
 */
export const PermissionOptional = () => SetMetadata(PERMISSIONOPTIONAL, true);
