import ResponseModel from './responseModel';

class ListModel<T> {
  list: T[];
  page: number = 1;
  pageSize: number = 10;
  total: number = 0;
}

export default class ResponseListModel<T> {
  message: string = '';
  success: boolean = false;
  data = new ListModel<T>();
  code?: string = '';
}
