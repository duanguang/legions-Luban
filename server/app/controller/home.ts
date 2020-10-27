import { Controller } from 'egg';
import { HttpClientResponse } from 'urllib';
import * as path from 'path';
import * as fs from 'fs';
import {
  createImportDefaultSpecifierAst,
  addArrayItemAst,
} from 'legions-utils-ast';
/**
 * @controller home
 */
import { transform } from '../utils/ast';
import * as recast from 'recast';
export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    /* transform(); */
    /* this.transformTsAst1(); */
    ctx.body = await ctx.service.test.sayHi('egg');
  }
  /**
   * @summary 读取模板
   * @description 读取模板读取模板
   * @router get /readHtmlString
   * @request query string target desc
   * @request query string target1 desc
   * @response 200 getUserResponse desc
   */
  public async readHtmlString() {
    const { ctx } = this;
    /** 参数校验 */
    /* ctx.validate({
      target: { type: 'string' }
    }); */
    const { target } = this.ctx.query;
    /* const header = this.ctx.headers;
    const proxy = header['api-target']; */
    const result = await this.ctx.curl<HttpClientResponse<string>>(target, {
      dataType: 'text',
    });
    ctx.body = result.data.toString();
    ctx.response.body = result.data.toString();
    /*  ctx.res.write(result.data); */
  }
}
