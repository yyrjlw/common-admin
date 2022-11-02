declare namespace API {
  type BaseResult<T = any> = {
    code: number;
    message: string;
    data: T;
  };
}
