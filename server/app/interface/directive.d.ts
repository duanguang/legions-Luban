interface ITableBaseConfigCode{
  isExportCurrData: string;
  isOpenCustomColumns: string;
  isOpenRowChange:string,
  tableModulesName: string;
  token: string;
  uniqueKey: string;
}
const ALL_SUITS = ['export', 'import', 'enabled', 'disable','delete','customColumns'] as const;
export type SuitTuple = typeof ALL_SUITS;
interface IOperationConfigCode{
    onClick?: () => void;
    type: SuitTuple[number];
    btnType: string;
    btnIcon: string;
    name: string;
    API: string;
}
export declare namespace DirectiveModules {
  interface ISendData {
    /**
     *
     * 系统模块
     * @type {String}
     * @memberof ISendData
     */
    modulesSystem: string;
    gitSrc: string;
    projectSrc: string;
    branch: string;
  }
  interface IAst{

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
    tableBaseConfigAst?:ITableBaseConfigCode
    operationAst?: IOperationConfigCode[];
  }
  interface ISendAst{
    ast: IAst
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
    }
    formPageCode?: {
      modelCode: string;
      formComponentCode:string
  }
    /**
     *
     * 模板类型 表单或者列表
     * @type {'pageList'}
     * @memberof ISendAst
     */
    templateType: 'pageList'

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
  interface IDirective {
    initProject?: {
      sendData: ISendData;
      responseData?: string;
      state: 'complete' | 'pending';
    };
    generatedCode?: {
      sendData: ISendAst;
      responseData?: string;
      state: 'complete' | 'pending';
    };
  }
}
