import * as recast from 'recast';
import {
  IModalConfirmOptions,
  ITableOnSearchCodeOptions,
  IStoreActionMethodsOptions,
  IArrowFunctionExpressionOptions,
  ITemplateLiteralOptions,
  IDecoratorOptions,
  ISubmittingAutoMessageOptions,
  IIfStatementOptions,
  ICreateValidatorOptions,
  IcreatePropertyOptions,
} from '../interface/recastUtils';
import { callExpression, decorator } from 'legions-utils-ast/types.builders';

import {
  createModalConfirmCode,
  createTableOnSearchCode,
  createDecoratorSubmittingAutoMessage,
  createValidator,
  createSelectOptions,
  createSelectAutoQuery,
} from 'legions-utils-ast/transform.antd.design';
import { createMemberExpression } from 'legions-utils-ast';
import { createStoreActionMethods } from 'legions-utils-ast/transform.brain.store';
import {
  createTemplateLiteral,
  createArrowFunctionExpression,
  createIfStatement,
  tranformArrowFunction,
  tranformArrowFunctionExpression,
  createProperty,
  tranformObjectExpression,
} from 'legions-utils-ast';

const createDecoratorCallExpression = (options: IDecoratorOptions) => {
  const decoratorcallExpression = callExpression.from({
    callee: options.callee,
    arguments: options.arguments,
  });
  return decorator(decoratorcallExpression);
};

interface IRecastUtils {
  /**
   * 生成取消及确认弹窗代码
   *
   * @type {(options:IModalConfirmOptions)}
   */
  createModalConfirmCode: (
    options: IModalConfirmOptions
  ) => recast.types.namedTypes.ExpressionStatement;

  /**
   *
   * 列表页搜索函数代码
   * @memberof IRecastUtils
   */
  createTableOnSearchCode: (
    options: ITableOnSearchCodeOptions
  ) => recast.types.namedTypes.ExpressionStatement;

  /**
   *
   * 创建对象成员表达式
   * @memberof IRecastUtils
   */
  createMemberExpression: (
    expression: string
  ) => recast.types.namedTypes.MemberExpression;

  /**
   *
   * create Store serverice methods
   * @memberof IRecastUtils
   */
  createStoreActionMethods: (
    options: IStoreActionMethodsOptions
  ) => recast.types.namedTypes.ExpressionStatement;

  /**
   * 创建箭头函数代码块
   *
   * @memberof IRecastUtils
   */
  createArrowFunctionExpression: (
    options: IArrowFunctionExpressionOptions
  ) => recast.types.namedTypes.ArrowFunctionExpression;

  /**
   * 创建模板字符代码块
   *
   * @memberof IRecastUtils
   */
  createTemplateLiteral: (
    options: ITemplateLiteralOptions
  ) => recast.types.namedTypes.TemplateLiteral;
  createDecoratorSubmittingAutoMessage: (
    options: ISubmittingAutoMessageOptions
  ) => recast.types.namedTypes.Decorator;

  /**
   * 创建if else 语句块
   *
   * @memberof IRecastUtils
   */
  createIfStatement: (
    options: IIfStatementOptions
  ) => recast.types.namedTypes.IfStatement;
  /** 创建验证规则代码 */
  createValidator: (
    options: ICreateValidatorOptions
  ) => recast.types.namedTypes.Property;

  /** 普通函数转换成箭头函数 */
  tranformArrowFunction: (
    code: string,
    eventFuncionName: string,
    parser?: 'typescript' | 'babel'
  ) => recast.types.namedTypes.Property;

  createSelectOptions: (options: []) => recast.types.namedTypes.Property;

  createSelectAutoQuery: (options: any) => any[];

  createProperty: (
    options: IcreatePropertyOptions
  ) => recast.types.namedTypes.Property;

  tranformObjectExpression: (
    code: string
  ) => recast.types.namedTypes.ObjectExpression;

  tranformArrowFunctionExpression: (
    code: string
  ) => recast.types.namedTypes.ArrowFunctionExpression;
}
export const RecastUtils: IRecastUtils = {
  createModalConfirmCode,
  createTableOnSearchCode,
  createMemberExpression,
  createStoreActionMethods,
  createArrowFunctionExpression,
  createTemplateLiteral,
  createDecoratorSubmittingAutoMessage,
  createIfStatement,
  createValidator,
  tranformArrowFunction,
  createSelectOptions,
  createSelectAutoQuery,
  createProperty,
  tranformObjectExpression,
  tranformArrowFunctionExpression,
};
