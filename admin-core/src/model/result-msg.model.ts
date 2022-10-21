export class ResultMsg {
  constructor(instanceData: Partial<ResultMsg>) {
    Object.assign(this, instanceData);
  }
  code: number;
  message: string;
  data: any;

  static ok(data?: any, message?: string) {
    return new ResultMsg({
      data,
      message,
      code: 200,
    });
  }
}
