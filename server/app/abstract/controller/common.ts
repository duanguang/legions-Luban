import { Controller } from 'egg';
import ResponseModel from '../../model/responseModel';

export default class CommonController extends Controller {
  success<T = {}>(data: ResponseModel<T> | undefined) {
    this.ctx.body = data;
  }
}
