import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { useAdminStore } from "@/stores/admin";
import router from "@/router";
import { refreshToken } from "@/api/auth";
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
    const adminStore = useAdminStore();
    refreshToken(adminStore.accessToken)
      .then((data) => {
        adminStore.setToken(data.data);
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
  const adminStore = useAdminStore();
  if (adminStore.accessToken) {
    config.headers!["Authorization"] = "Bearer " + adminStore.accessToken;
    config.headers!["tokenVersion"] = adminStore.tokenVersion;
  }
  return config;
});

http.interceptors.response.use(
  (res) => {
    if (res.data.code === 200 && res.data.message) {
      ElMessage.success(res.data.message);
    }
    return res;
  },
  async (error: {
    config: AxiosRequestConfig;
    response: AxiosResponse;
    message: string;
  }) => {
    const errMsg = error.response?.data?.message || error.message;
    const errCode = error.response?.data?.code;
    if (error.response.status === 401) {
      //TODO 登录验证失败逻辑重构
      const adminStore = useAdminStore();
      if (errCode === 40001) {
        adminStore.logout();
      } else {
        //超时未操作，退出登录
        if (
          !adminStore.expiresIn ||
          new Date().getTime() > adminStore.expiresIn
        ) {
          if (router.currentRoute.value.path !== "/login") {
            adminStore.logout();
            ElMessage.warning("您已长时间未操作,请重新登录");
          }
          return Promise.reject(errMsg);
        } else {
          //同一时间，多次请求时。部分请求结果在token刷新完成后到达。导致token重复刷新
          if (
            error.config.headers!["tokenVersion"] === adminStore.tokenVersion
          ) {
            //刷新令牌
            return refreshTokenHendle(error.config);
          } else {
            return http(error.config);
          }
        }
      }
    }

    ElNotification.error({
      message: errMsg,
    });
    return Promise.reject(errMsg);
  }
);

export const getResponseData = <T = any>(
  request: Promise<AxiosResponse>
): Promise<API.BaseResult<T>> => request.then((res) => res.data);
