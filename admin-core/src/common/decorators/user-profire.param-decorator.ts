import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { IJwtTokenPayload } from "src/models/jwt-token-payload";

export const REQUEST_KEY_USER_PROFILE = "user_profile";

/**
 * 获取挂载到request中的用户信息
 */
export const UserProfile = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userProfile = request[REQUEST_KEY_USER_PROFILE] as IJwtTokenPayload;
    return data ? userProfile?.[data] : userProfile;
  }
);
