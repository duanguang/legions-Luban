export interface IQueryListCommonParams<T> {
  page: T;
  pageSize: T;
}

export enum ESysErrorCode {
  CRASH = '500',
  SUCCESS = '200',
  ERROR = '999',
  WARNING = '99',
  INFO = '9',
}
