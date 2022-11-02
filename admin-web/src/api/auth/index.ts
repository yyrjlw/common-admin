import { http, getResponseData } from "@/plugins/request";

export const refreshToken = (accessToken: string) =>
  getResponseData(http.post("/auth/refreshToken", { accessToken }));

export const login = (params: any) =>
  getResponseData(http.post("/auth/login", params));

export const getCaptchaImg = (params?: any) =>
  getResponseData<API.Captcha>(http.get("/auth/captchaImg", { params }));
