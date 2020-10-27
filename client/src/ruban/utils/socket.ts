import { WebSocketUtil } from 'legions/socket';
const SocketUrl = `${
  process.env.environment !== 'dev'
    ? 'https://cicd.hoolinks.com'
    : 'http://127.0.0.1:7012'
}/socket/directive`; // 初始化连接
/* const SocketUrl=`${process.env.environment === 'dev'?'http://127.0.0.1/legion':'http://127.0.0.1:7012'}/socket/directive`; */
/* WebSocketUtil.registerInstanceWebSocket(SocketUrl); */ import { ProjectModules } from '../interface/project';
import { templatePageEnum } from '../constants/enum-data';
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
   * 搜索条件配置数据
   *
   * @type {(string | string[])}
   * @memberof IAst
   */
  queryAst?: string | string[];

  /**
   *
   * 表格列配置数据信息
   * @type {(string | string[])}
   * @memberof IAst
   */
  tableAst?: string | string[];

  /**
   * 表格数据源配置代码
   *
   * @type {Object}
   * @memberof IAst
   */
  tableDataSourceAst?: Object;

  /**
   * 表格基础配置数据
   *
   * @type {Object}
   * @memberof IAst
   */
  tableBaseConfigAst?: Object;

  /**
   * table 操作区域
   *
   * @type {IOperationConfigCode[]}
   * @memberof IAst
   */
  operationAst?: IOperationConfigCode[];
}
export interface ISendAst {
  ast: IAst;
  tablePageListCode?: {
    /**
     * store 源码字符串
     *
     * @type {string}
     */
    storeCode?: string;

    /**
     * 配置组件代码
     *
     * @type {string}
     */
    tableConfigCode: string;

    /**
     * 列表主组件代码
     *
     * @type {string}
     */
    tableHomePageCode: string;
    tableModelCode: string;
  };
  formPageCode?: {
    modelCode: string;
    formComponentCode: string;
  };

  /**
   *
   * 模板类型 表单或者列表
   * @type {'pageList'}
   * @memberof ISendAst
   */
  templateType: keyof typeof templatePageEnum;

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
  gitUserName: string;
  componentName: string;
}
export interface IDirective {
  initProject?: {
    sendData: ProjectModules.ISendData;
    readonly responseData?: string;
    readonly state?: 'none' | 'pending' | 'complete';
  };
  generatedCode?: {
    sendData: ISendAst;
    readonly responseData?: string;
    readonly state?: 'none' | 'pending' | 'complete';
  };
}

/**
 * 指令执行结果接收
 *
 * @export
 * @param {*} success
 */
export function directiveReceive(
  success: (
    prams: IDirective['initProject'] | IDirective['generatedCode']
  ) => void
) {
  /* WebSocketUtil.receiveMessage(SocketUrl,(result:IDirective['initProject']|IDirective['generatedCode'])=>{
        success&&success(result);
    })  */
}
export function directiveSend(directive: IDirective) {
  /* WebSocketUtil.sendMessage(SocketUrl,directive); */
}
