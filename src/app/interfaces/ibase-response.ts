export interface IBaseResponse<T> {

  message: string;
  result: boolean;
  data: T;
  count: number;
  errorCode?: string;
  timestamp: Date;
}
