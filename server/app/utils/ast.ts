#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'fs';
import * as recast from 'recast';
const {
  identifier: id,
  memberExpression,
  property,
  objectExpression,
  literal,
  assignmentExpression,
  arrowFunctionExpression,
  variableDeclaration,
  variableDeclarator,
  functionExpression,
} = recast.types.builders;
export function transform() {
  const file = path.join(process.cwd(), '/app/test/test.js');
  const code = [
    'function add(a, b) {',
    '  return a +',
    '    // Weird formatting, huh?',
    '    b;',
    '}'
  ].join('\n');
  const code1 = [
    'var s= {"str":"string","num":0,"obj":{"foo":"foo"},"arr":[1,2,3],"bool":true,"nil":null,"undef":undefined,"date":new Date("2016-04-28T22:02:17.000Z"),"map":new Map([["hello","world"]]),"set":new Set([123,456]),"fn":function echo(arg) { return arg; },"re":/([^s]+)/g}'
  ].join('\n');
  /* const code1 = [
    'var s= {"str":"string","num":0,"obj":{"foo":"foo"}}'
  ].join('\n'); */
  const ast = recast.parse(code1);
  /* const output = recast.print(ast).code; */
  const add = ast.program.body[0];
  const TNT = recast.types.namedTypes;
  let count = 0;
  /* recast.visit(ast, {
    // tslint:disable-next-line: object-literal-shorthand
    visitProperty: function(path) {
      let node = path.value;
      if (TNT.Literal.check(node.key)) {
        node = property('set',id(node.key.value),node.value)
        console.log('这是一个ExpressionStatement',node);
      }
      // this.traverse(path);
      return false;
    },
  }); */
  const output = recast.prettyPrint(ast, {
    tabWidth: 2,
    quote: 'single',
    trailingComma: true,
  }).code;
  fs.writeFileSync(file, output);
}

/**
 * 对代码对象属性进行转换，去除对象属性双引号或者单引号
 *
 * @export
 * @param {string} code
 * @param {string} [parser='recast/parsers/typescript']
 * @returns
 */
export function transformProperty(code: string, parser = 'recast/parsers/typescript') {
    const ast = recast.parse(code, {
      parser: require(`${parser}`),
    });
    const TNT = recast.types.namedTypes;
    recast.visit(ast, {
      visitObjectExpression(path) {
        let node = path.value;
        const newNode = [];
        node.properties.map((item: recast.types.namedTypes.Property) => {
          if (TNT.Literal.check(item.key)) {
            // @ts-ignore
            item = property('init', id(item.key.value), item.value);
            // @ts-ignore
            newNode.push(item);
          }
        });
        node = objectExpression(newNode);
        path.replace(node);
        this.traverse(path);
      },
      /* visitProperty(path) {
        let node = path.value;
        if (TNT.Literal.check(node.key)) {
          node = property('init', id(node.key.value), node.value);
        }
        path.replace(node);
        // this.traverse(path)
        return false;
      }, */
    });
    const output = recast.prettyPrint(ast, {
      tabWidth: 2,
      quote: 'single',
      trailingComma: true,
    }).code;
    return output;
}
/**
 * 美化代码
 *
 * @export
 * @param {string} code
 */
export function prettyPrint(
  code: string,
  parser = 'recast/parsers/typescript',
) {
  const ast = recast.parse(code, {
    parser: require(`${parser}`),
  });
  const output = recast.prettyPrint(ast, {
    tabWidth: 2,
    quote: 'single',
    trailingComma: true,
  }).code;
  return output;
}
