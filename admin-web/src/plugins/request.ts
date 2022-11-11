import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";
import { refreshToken } from "@/api/auth";
import type { BaseResult } from "@/api/model/BaseModel";
// import qs from 'qs'

export const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URI,
  //@ts-ignore
  //   paramsSerializer: (parm: any) => qs.stringify(parm, { skipNulls: true })
});

let isRefreshTokening = false;
let afterRefreshTokenTasks: Function[] = [];

const refreshTokenHendle = (config: AxiosRequestConfig) => {
  if (!isRefreshTokening) {
    isRefreshTokening = true;
    const authStore = useAuthStore();
    refreshToken(authStore.accessToken)
      .then((data) => {
        authStore.setToken(data.data);
        afterRefreshTokenTasks.forEach((i) => i());
      })
      .finally(() => {
        afterRefreshTokenTasks = [];
        isRefreshTokening = false;
      });
  }
  return new Promise((res) => {
    afterRefreshTokenTasks.push(() => res(http(config)));
  });
};

// request拦截器
http.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.accessToken) {
    config.headers!["Authorization"] = "Bearer " + authStore.accessToken;
    config.headers!["tokenVersion"] = authStore.tokenVersion;
  }
  return config;
});

http.interceptors.response.use(
  (res) => {
    if (res.data.code === 200) {
      res.data.message && ElMessage.success(res.data.message);
    } else {
      if (res.data.message) {
        ElNotification.error({
          message: res.data.message,
        });
      }
      return Promise.reject(res.data);
    }
    return res;
  },
  async (error: {
    config: AxiosRequestConfig;
    response: AxiosResponse;
    message: string;
  }) => {
    const responseData = error.response?.data;
    const errMsg = responseData?.message || error.message;

    if (error.response.status === 401) {
      const authStore = useAuthStore();
      //超时未操作，退出登录
      if (!authStore.expiresIn || new Date().getTime() > authStore.expiresIn) {
        if (router.currentRoute.value.path !== "/login") {
          authStore.logout();
          ElMessage.warning("您已长时间未操作,请重新登录");
        }
        return Promise.reject(responseData);
      } else {
        //同一时间，多次请求时。部分请求结果在token刷新完成后到达。导致token重复刷新
        if (error.config.headers!["tokenVersion"] === authStore.tokenVersion) {
          //刷新令牌
          return refreshTokenHendle(error.config);
        } else {
          return http(error.config);
        }
      }
    }
    if (errMsg) {
      ElNotification.error({
        message: errMsg,
      });
    }
    return Promise.reject(responseData);
  }
);

export const getResponseData = <T = any>(
  request: Promise<AxiosResponse>
): Promise<BaseResult<T>> => request.then((res) => res.data);
