export class ResultMsg {
  constructor(instanceData: Partial<ResultMsg>) {
    Object.assign(this, instanceData);
  }
  code: ResultStatusCode;
  message: string;
  data: any;

  static ok(data?: any, message?: string) {
    return new ResultMsg({
      data,
      message,
      code: 200
    });
  }
}

export enum ResultStatusCode {
  成功 = 200,
  登录状态已过期 = 40001,
  用户名或密码错误 = 40002
}
