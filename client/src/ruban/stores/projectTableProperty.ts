import StoreBase, { IStoreBaseMeta } from '../../common/stores/StoreBase';
import {observable,autorun,action, computed} from 'mobx';
import { observablePromise,ObservableTempState,observableViewModel } from 'legions/store-utils';
/* import UserInfoStore, { User } from './UserInfoStore'; */
import { ProjectFormFields } from '../models/form/projectFormFields';
import UiStoreBase from '../../common/stores/ui/UiStoreBase';
import { ComponentViewResource, IResourceEvent, ITriggerEventPrams } from './even/resourceEvent';
import { InstanceModal,IQuery,InstanceHlTable, InstanceForm } from 'hoolinks-legion-design/lib/typings/components';
import { TableColumnConfig } from 'hoolinks-legion-design/lib/typings/antd';
// tslint:disable-next-line: no-empty-interface
interface IContext{}
interface ITableBaseConfigCode{
    isExportCurrData: string;
    isOpenCustomColumns: string;
    isOpenRowChange:string,
    tableModulesName: string;
    uniqueKey: string;
}
const ALL_SUITS = ['export', 'import', 'enabled', 'disable','delete','openCustomColumns','customBtn'] as const;
export type SuitTuple = typeof ALL_SUITS;
type TypeOperationConfigCode = {
    [index in SuitTuple[number]]: {
        onClick: () => void;
        name: string;
    };
};
export interface IOperationConfigCode{
    onClick?: () => void;
    type: SuitTuple[number];
    btnType: string;
    btnIcon: string;
    name: string;
    nameEn: string;
    apiUrl: string;
    id: string;
    onClickCode?: string;
    params?: { key: string; label: string; title: string }
    paramsList?: { key: string; value: string }[]
    method?:'get'|'post'
}
class ViewModel {
    @observable currComponentView: IQuery = null

    /**
     * 当前活动组件key
     *
     * @type {string}
     * @memberof ViewModel
     */
    @observable currComponentKey: string = ''

    /**
     *
     * 活动组件类型
     * @type {('text'|'select'|'textArea'|'date'|'daterange'|'checkBox'|'radioButton')}
     * @memberof ViewModel
     */
    @observable componentActiveType: 'text' | 'select' | 'textArea' | 'date' | 'daterange' | 'checkBox' | 'radioButton' = 'text'
    /**
     * 列表区域拖拽组件数量(泛指table数量)
     *
     * @memberof ViewModel
     */
    @observable contentDraggerList: string[] = []



    /**
     * table表格属性是否编辑状态
     *
     * @type {boolean}
     * @memberof ViewModel
     */
    @observable isEditByTable: boolean = false;
    
    /**
     * 动态添加进来table 列数据，该数据用于生成代码
     *
     * @type {TableColumnConfig<{}>[]}
     * @memberof ViewModel
     */
    @observable tableColumns: TableColumnConfig<{}>[] = [];
    
    /**
     * table 表格列事件操作类型
     *
     * @type {('addColumns'|'deleteColumns'|'')}
     * @memberof ViewModel
     */
    @observable isEditTableColumnsType: 'add' | 'delete'|'edit' = 'add'
    


    /**
     *
     * 表格数据源配置信息
     * @type {({
     *         apiUrl: string;
     *         method: 'get' | 'post';
     *         options: Object;
     *         transform: string;
     *         model: string;
     *     })}
     * @memberof ViewModel
     */
    @observable tableDataSourceCode: {
        apiUrl: string;
        method: 'get' | 'post';
        options: string;
        transform: string;
        model: string;
        onSearch: string;
        onReset: string;
        token: string;
        parames: string;
    } = null
    
    /**
     * 表格基础配置信息生成代码
     * 
     * @type {ITableBaseConfigCode}
     * @memberof ViewModel
     */
    @observable tableBaseConfigCode: ITableBaseConfigCode = {
        isExportCurrData: 'false',
        isOpenCustomColumns: 'true',
        isOpenRowChange:'true',
        tableModulesName: '',
        uniqueKey: '',
        /* token:'', */
    }
    /**
     * 穿梭框显示table 列信息
     *
     * @type {TableColumnConfig<{}>[]}
     * @memberof ViewModel
     */
    @observable transferShowColumns :TableColumnConfig<{}>[] = [];
    /**
     *
     * 已经删除的table 列数据
     * @type {TableColumnConfig<{}>[]}
     * @memberof ViewModel
     */
    @observable deletedTableColumns: TableColumnConfig<{}>[] = [];
    
    /**
     * 操作区域组件属性设置结果
     *
     * @type {IOperationConfigCode}
     * @memberof ViewModel
     */
    @observable operationConfigCode: IOperationConfigCode[] = [];


    /**
     *
     * 当前正在编辑的操作按钮id 信息
     * @type {string}
     * @memberof ViewModel
     */
    @observable openOperationConfigId:string=''
    /** 搜索条件可执行表达式 */
    @observable paramesExeccodeast = null;
    @observable tranformExeccodeast = null;
    @computed get computedLabelWidth() {
        /* if (this.labelWidth > 0) {
            return this.labelWidth
        } */
        if (this.currComponentView) {
            return this.currComponentView.container.width-this.currComponentView.container.component.props.width
        }
    }
}
export default class ProjectTablePropertyStore extends UiStoreBase<IContext>{
    static meta :IStoreBaseMeta={
        ...StoreBase.meta,
        className:'ProjectTablePropertyStore',
        eventScopes: [ComponentViewResource],
        contextTypes:{
            
        },
    }
    viewModel = observableViewModel<ViewModel>(new ViewModel());
    tableRef: InstanceHlTable = null

    /**
     * 操作按钮区属性设置Modal
     *
     * @type {InstanceModal}
     * @memberof ProjectTablePropertyStore
     */
    operationModalRef: InstanceModal = null;
    /** 添加表格列属性模态框实例 */
    addTableColumnsModalRef: InstanceModal = null;

    /** 设置搜索条件组件属性表单实例 */
    updateQueryConditionsFormProperyRef: InstanceForm = null;
    constructor(context:IContext) {
        super(context)
    }
    triggerUpdateComponentViewEven(currComponentView: IQuery,keys: string) {
        this.context.dispatch(ComponentViewResource.updated,{currComponentView,componenyKeys:keys})
    }
    @action onEvent(event: IResourceEvent<ITriggerEventPrams>) {
        if (ComponentViewResource.created.name === event.name) {
            this.viewModel.currComponentView = null;
            this.viewModel.currComponentView = event.payload.currComponentView
            this.viewModel.submit();
        }
        /* if (ComponentViewResource.updated.name === event.name) {
            this.viewModel.currComponentView = {...this.viewModel.currComponentView,...event.payload.currComponentView}
        } */
    }
}
