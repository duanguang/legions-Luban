

export const AutoQueryVModelCode =
`
import {JsonProperty} from 'json-mapper-object';
import {BaseEntity} from './common/baseEntity';
/** 类名称无特殊要求,请勿改变*/
class ResponseVModelNameDataEntity{
    @JsonProperty('id')
    id = void 0

    /** 可填写接口其他返回值属性*/

}
/** 类名称无特殊要求,请勿改变*/
class ResponseEntity{

    @JsonProperty({clazz:ResponseVModelNameDataEntity, name:'data.result'})
    data = []

    @JsonProperty('size')
    size = 0

    @JsonProperty('current')
    current = 0

    @JsonProperty('total')
    total = 0
}

interface IBaseEntity<T> {
    msg: string,
    ok: boolean,
    status: string,
    data: T,
}
/** 类名称请勿修改,系统会直接根据页面模块名称进行创建*/
export class PageListNameContainerEntity extends BaseEntity<ResponseEntity>{
    constructor(fromJson:IBaseEntity<ResponseEntity>){
       // @ts-ignore
        super(fromJson);
        this.message=fromJson.msg||'查询成功';
        this.success=fromJson.ok ? true : false;
        this.code = fromJson.status || '';
        let data = fromJson;
        if(data){
            this.result=super.transformRow(fromJson,ResponseEntity);
        }
        else{
            this.result = new ResponseEntity();
        }
    }
}
`


export const CUSTOM_COLUMNS_RENDER_CODE =
`
/** 自定义列渲染函数，可自行填入渲染内容*/
function render(text, record, index){
    return <div></div>
}
`
/** 表格搜索函数 */
export const TABLE_SEARCH_CODE =
`
/**请勿修改函数结构,直接在函数内部输入代码
*/
function handleSearch(value){
    let val = value;
    this.queryPrams = { ...this.queryPrams, ...val };
    this.hlTableRef.methods.onSearch()
}
`
/** 表格重置数据函数  */
export const TABLE_RESET_CODE =
`
/**请勿修改函数结构,直接在函数内部输入代码
*/
function handleReset(value){
    this.handleSearch(value);
}
`
export const TABLE_SEARCH_PARAMS_CODE =
`
/**请勿修改函数结构,直接在函数内部输入代码
*/
function params(pageIndex,pageSize){                          
    return { size: pageSize, current: pageIndex, ...this.parames }
}
`
export const TABLE_TRANFORM_CODE =
`
/**请勿修改函数结构,直接在函数内部输入代码
*/
function transform(value:observablePromise.PramsResult<null>){
    if (value && !value.isPending) {
        const { data, current, size } = value.value.result;
        return {
            data:data.map((item, index) => {
                item['key'] = (index + 1) + (current - 1) * size;
                item.state = item.stateDesc[item.state];
                return item;
            }),
            total:value.value.result.total,
        };
    }
    return {
        total: 0,
        data:[],
    };
}
`
export const TABLE_TOKEN_CODE =
`
/**请勿修改函数结构,直接在函数内部输入代码
 * 示例:
 function token(){
    return process.env.environment==='dev'?'SESSION=3aaa0e0f-e799-4ec6-8612-da5593f7414d':DevToken
}
*/
function token(){
    // return string 返回字符串
    return process.env.environment==='dev'?'SESSION=3aaa0e0f-e799-4ec6-8612-da5593f7414d':DevToken
}
`
/**
 * 列表模板组件代码
 */
export const PageListComponentCode =
`
    import React,{ Component } from 'react'
    import { observer, bind } from 'legions/store-react';
    import { Button,Steps,Row,Col,Spin,Icon,Card,message,Modal } from 'antd'
    import { HLTable,QueryConditions,ListPageLayout } from 'hoolinks-legion-design'
    import { InstanceHlTable,IViewModelHLTable,IHLTableProps} from 'hoolinks-legion-design/lib/typings/components'
    import { submittingAutoMessage,loadProgress } from 'hoolinks-legion-design/lib/utils/store-utils';
    import download from 'hoolinks/download';
    import { observablePromise,observableViewModel } from 'legions/store-utils'
    import { DevToken } from '../../constants/httpConfig';
    import { observable,action,computed } from 'mobx';
    import { ContainerEntity } from '../../models/common/baseEntity';
    interface IProps{
        store?: StoreClassCode,
    }
    class ViewModel {
    }
    @bind({ store: StoreClassCode})
    @observer
    export default class PageListComponentCode extends PageListConfigCode<IProps>{
        hlTableRef:InstanceHlTable = null;
        viewModel = observableViewModel<ViewModel>(new ViewModel());
        /** 搜索条件 */
        queryPrams:Object = {};
        constructor(props: IProps) {
            super(props)
            this.registeredInstanceStatement(this);
        }
        render(){
            return null
        }
    }
`;
export const LIST_PAGE_LAYOUT_COMPONENT_CODE =
`
<ListPageLayout query={(
    <QueryConditions query={this.createQueryConfig()} onDidMount={(value) => {
        this.hlTableRef.viewModel.bodyExternalContainer.set(value.uid, { height: value.height })
    }}></QueryConditions>
)}
content={(
    <Row>
        <HLTable
        onReady={(value) => {
            this.hlTableRef = value;
            this.hlTableRef.viewModel.isAdaptiveHeight = true;
            this.hlTableRef.viewModel.bodyExternalContainer.set('ButtonAction', { height: 48 })
            this.hlTableRef.viewModel.bodyExternalContainer.set('other', { height: 70 })
        }}
        selectedRowKeys={this.hlTableRef && this.hlTableRef.selectedRows.map((item) => item.id)}
        scroll={{ x: this.hlTableRef && this.hlTableRef.viewModel.tableXAutoWidth, y: 300 }}
        pagination={true}
        columns={this.createTableColumnsConfig()}
    ></HLTable>
    </Row>
)}></ListPageLayout>
`
/**
 * store数据管理
 */
export const StoreClassCode =
`
import { action, computed, autorun, runInAction, observable } from 'mobx';
import StoreBase from 'hoolinks-legion-design/lib/stores/StoreBase';
// tslint:disable-next-line: no-duplicate-imports
import { IStoreBaseMeta } from 'hoolinks-legion-design/lib/stores/StoreBase';
import { observablePromise } from 'legions/store-utils';
import { ContainerEntity } from '../models/common/baseEntity';
import { get, post } from 'legions/fetch';
import { HttpConfig, setHeaders } from '../constants/httpConfig';
// tslint:disable-next-line: no-empty-interface
interface IContainerEntity {}
export default class $StoreClassCode$ extends StoreBase {
    static meta: IStoreBaseMeta = {
        ...StoreBase.meta,
        className: '$StoreClassCode$',
        contextTypes: {},
    }
}
`;
/**
 * 列表页配置文件抽象类代码
 */
export const PageListConfigCode =
`
    import React from 'react';
    import { IQueryConditionsInstance,IQuery} from 'hoolinks-legion-design/lib/typings/components'
    import { TableColumnConfig } from 'hoolinks-legion-design/lib/typings/antd';
    import PageListComponentCode from './'
    export default abstract class PageListConfigCode<P,S = {}> extends React.Component<P,S>{
        instanceStatement:PageListComponentCode = null
        constructor(props: P) {
            super(props)
        }
        registeredInstanceStatement(instance:PageListComponentCode){
            this.instanceStatement = instance
        }
        protected createQueryConfig() {
            const that:PageListComponentCode = this.instanceStatement
            queryConfigCode
            return queryConfig;
        }
        protected createTableColumnsConfig(){
            tableColumnsConfig
            return columnsConfig;
        }
    }
`;
