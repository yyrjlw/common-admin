import { http, getResponseData } from "@/plugins/request";
import type { Captcha, PermMenu } from "./model/LoginModel";

export const refreshToken = (accessToken: string) =>
  getResponseData(http.post("/auth/refreshToken", { accessToken }));

export const login = (params: any) =>
  getResponseData<{
    accessToken: string;
    expiresIn: number;
  }>(http.post("/auth/login", params));

export const getCaptchaImg = (params?: any) =>
  getResponseData<Captcha>(http.get("/auth/captchaImg", { params }));

export const getPermmenu = () =>
  getResponseData<PermMenu>(http.get("/auth/permmenu"));
