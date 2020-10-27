import { transformPropertyToSingle } from 'legions-utils-ast/transform.property.to.single';
export { prettyPrint } from 'legions-utils-ast/transform.format.code';
export { transformFuncToExeccodeast } from 'legions-utils-ast';
/**
 * 对代码对象属性进行转换，去除对象属性双引号或者单引号
 *
 * @export
 * @param {string} code
 * @param {string} [parser='recast/parsers/typescript']
 * @returns
 */
export function transformProperty(code: string) {
  return transformPropertyToSingle(code, 'typescript');
}

// tslint:disable-next-line: typedef
export function getExecutableScript(scriptText, proxy) {
  window['proxy'] = proxy;
  // @ts-ignore
  let isIE = window.ActiveXObject || 'ActiveXObject' in window;
  if (isIE) {
    // tslint:disable-next-line: restrict-plus-operands
    return (
      ';(function(window, self){;' +
      scriptText +
      '\n}).bind(window.proxy)(window.proxy, window.proxy);'
    );
  }
  // tslint:disable-next-line: restrict-plus-operands
  return (
    ';(function(window, self){;' +
    scriptText +
    '\n}).bind(window.proxy)(window.proxy, window.proxy);'
  );
}
