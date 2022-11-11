export interface BaseResult<T = any> {
  code: number;
  message: string;
  data: T;
}
