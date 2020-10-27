import * as K from "ast-types/gen/kinds";
export { K };
export interface IModalConfirmOptions{
    /**
    * 详细内容
    *
    * @type {string}
    */
   content: string;
   
   /**
    * 标题
    *
    * @type {string}
    * @memberof ModalConfirmOptions
    */
   title: string;
   okText:string;
   cancelText: string;

   // @ts-ignore
   /**
    * 确认按钮函数括号里面代码
    *
    * @type {any[]}
    * @memberof ModalConfirmOptions
    */
   onOkBodyCode?: K.StatementKind[];
}

export interface ITableOnSearchCodeOptions{
    tableRef:string;
    pageIndex?:number;
    type: 'this' | 'that';
}

export interface IStoreActionMethodsOptions{
    params: (K.ExpressionKind | K.SpreadElementKind)[];
    apiUrl: string;
    
    /**
     * 请求类型
     *
     * @type {string}
     * @memberof IStoreActionMethodsOptions
     */
    method: string;

    /**
     * 方法名称
     *
     * @type {string}
     * @memberof IStoreActionMethodsOptions
     */
    actionMethod: string;
}
export interface IArrowFunctionExpressionOptions{
    params: K.PatternKind[];
    body: K.StatementKind[];
}
export interface ITemplateLiteralOptions{
    quasis: K.TemplateElementKind[];
    expressions: K.ExpressionKind[];
}

export interface IDecoratorOptions{
    callee: K.ExpressionKind;
    arguments: (K.ExpressionKind | K.SpreadElementKind)[];
}

export interface ISubmittingAutoMessageOptions{
    body: K.StatementKind[];
    state: string;
    componentName: string;
}
export interface IIfStatementOptions{
    test: K.ExpressionKind;
    consequentBody: K.StatementKind[];
    alternateBody?: K.StatementKind[];
}
export interface ICreateValidatorOptions{
    reg: any;
    body?: K.StatementKind[];
}

export interface IcreatePropertyOptions{
    name: string;
    value: K.ExpressionKind | K.PatternKind;
}