import {
  PageListConfigCode,
  PageListComponentCode,
  StoreClassCode,
} from '../constants/code/tableConfigCode';
import { transformProperty, prettyPrint } from './codemod';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
interface ITableBaseConfigCode {
  isExportCurrData: string;
  isOpenCustomColumns: string;
  isOpenRowChange: string;
  tableModulesName: string;
  token: string;
  uniqueKey: string;
}
const ALL_SUITS = [
  'export',
  'import',
  'enabled',
  'disable',
  'delete',
  'customColumns',
] as const;
export type SuitTuple = typeof ALL_SUITS;
interface IOperationConfigCode {
  onClick?: () => void;
  type: SuitTuple[number];
  btnType: string;
  btnIcon: string;
  name: string;
  API: string;
}
interface IAst {
  /**
   * 搜索条件数据代码
   *
   * @type {(string | string[])}
   * @memberof IAst
   */
  queryAst?: string | string[];

  /**
   * 表格列配置信息代码
   *
   * @type {(string | string[])}
   * @memberof IAst
   */
  tableAst?: string | string[];

  /**
   * 表格数据源代码
   *
   * @type {({
   *       apiUrl: string;
   *       method: 'get' | 'post';
   *       options: string;
   *       transform: string;
   *       model: string;
   *     })}
   * @memberof IAst
   */
  tableDataSourceAst?: {
    apiUrl: string;
    method: 'get' | 'post';
    options: string;
    transform: string;
    model: string;
    token: string;
    onSearch: string;
    onReset: string;
    parames: string;
  };

  /**
   * 表格基础配置数据代码
   *
   * @type {ITableBaseConfigCode}
   * @memberof IAst
   */
  tableBaseConfigAst?: ITableBaseConfigCode;
  operationAst?: IOperationConfigCode[];
}
export interface ISendAst {
  ast: IAst;

  /**
   *
   * 模板类型 表单或者列表
   * @type {'pageList'}
   * @memberof ISendAst
   */
  templateType: 'pageList';

  /**
   * 文件存储路径
   *
   * @type {string}
   * @memberof ISendAst
   */
  projectSrc: string;

  /**
   *
   * 存放模块
   * @type {string}
   * @memberof ISendAst
   */
  modulesSystem: string;

  /**
   * 仓库地址
   *
   * @type {string}
   * @memberof ISendAst
   */
  gitSrc: string;
  branch: string;
  componentName: string;
  gitUserName: string;
}
const replaceStr = (regex: string, str: string, replaceString: string) => {
  const reg = new RegExp(regex, 'g');
  /* str.match(reg) */
  return str.replace(reg, replaceString);
};
const replacePageListComponentCode = (
  sendData: ISendAst,
  configCodeStr: string
) => {
  let ModelCode = '';
  const componentName = upperFirst(camelCase(sendData.componentName));
  if (sendData.ast.tableDataSourceAst && sendData.ast.tableBaseConfigAst) {
    let replacelabel = [
      {
        key: 'plexportModels',
        type: 'class',
        value: sendData.ast.tableDataSourceAst.model,
      },
    ];
    replacelabel.map(item => {
      if (item.type === 'class') {
        ModelCode = replaceStr(
          'PageListNameContainerEntity',
          item.value,
          `${componentName}ContainerEntity`
        );
      }
    });
  }
  return {
    code: configCodeStr,
    model: ModelCode,
  };
};
interface TablePageList {
  tableConfigCode: string;
  tablePageCode: string;
  tableModelCode: string;
  tableStore: string;
}
export const createTableListPage = (sendData: ISendAst): TablePageList => {
  const componentName = upperFirst(camelCase(sendData.componentName));
  const createTableConfig = () => {
    /** 创建列表页配置文件组件 ================================== */
    const plconfigfileName = `${componentName}Config`;
    const replaceplconfiglabel = [
      {
        key: 'tableColumnsConfig',
        type: 'string',
        value: transformProperty(sendData.ast.tableAst as string),
      },
      { key: 'PageListComponentCode', type: 'string', value: componentName },
      {
        key: 'queryConfigCode',
        type: 'string',
        value: transformProperty(sendData.ast.queryAst as string),
      },
    ];
    let configCodeStr = replaceStr(
      'PageListConfigCode',
      PageListConfigCode,
      plconfigfileName
    );
    replaceplconfiglabel.map(item => {
      if (item.type === 'string') {
        configCodeStr = replaceStr(item.key, configCodeStr, item.value);
      }
    });
    return configCodeStr;
  };
  const createTableComponent = () => {
    /** 创建列表页组件 ================================== */
    let str = replaceStr(
      'StoreClassCode',
      PageListComponentCode,
      `${componentName}Store`
    );
    const code = replacePageListComponentCode(sendData, str);
    str = code.code;
    return {
      code: str,
      model: code.model,
    };
    /* this.ctx.socket.emit('message',new InitProjectResponseModel(sendData,`正在生成列表页:${pagePath}/index.tsx...\n`,state)); */
  };
  const createStore = () => {
    const str = StoreClassCode.replace(
      '$StoreClassCode$',
      `${componentName}Store`
    ).replace(`'$StoreClassCode$${''}'`, `'${componentName}Store'`);
    return str;
  };
  const TableComponent = createTableComponent();
  return {
    tableConfigCode: createTableConfig(),
    tablePageCode: prettyPrint(TableComponent.code, 'babel'),
    tableModelCode: prettyPrint(TableComponent.model),
    /** store类字符串 */
    tableStore: createStore(),
    /* tableConfigCode: createTableConfig(),
        tablePageCode: TableComponent.code,
        tableModelCode: prettyPrint(TableComponent.model),
        tableStore:createStore(), */
  };
};
