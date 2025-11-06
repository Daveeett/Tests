export interface IBaseResponse<T> {
  count: number;
  message: string;
  result: boolean;
  data: T;
  timestamp: Date;
  errorCode?: string;
}
