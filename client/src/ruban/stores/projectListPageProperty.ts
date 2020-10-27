import StoreBase, { IStoreBaseMeta } from '../../common/stores/StoreBase';
import {observable,autorun,action, computed} from 'mobx';
import { observablePromise,ObservableTempState,observableViewModel } from 'legions/store-utils';
/* import UserInfoStore, { User } from './UserInfoStore'; */
import { ProjectFormFields } from '../models/form/projectFormFields';
import UiStoreBase from '../../common/stores/ui/UiStoreBase';
import { ComponentViewResource, IResourceEvent, ITriggerEventPrams } from './even/resourceEvent';
import { IQuery } from 'hoolinks-legion-design/lib/typings/components';
import { TableColumnConfig } from 'hoolinks-legion-design/lib/typings/antd';
// tslint:disable-next-line: no-empty-interface
import ProjectTablePropertyStore from './projectTableProperty';
import ProjectQueryPropertyStore from './projectQueryProperty';
interface IContext{
    /**
     * 搜索条件组件属性数据
     *
     * @type {ViewCanvasUIStore}
     * @memberof IContext
     */
    QueryPropertyApp: ProjectQueryPropertyStore,
    
    /**
     * Table组件属性数据
     *
     * @type {PropertyUIStore}
     * @memberof IContext
     */
    TablePropertyApp: ProjectTablePropertyStore,
}


export default class ProjectListPagePropertyStore extends UiStoreBase<IContext>{
    static meta :IStoreBaseMeta={
        ...StoreBase.meta,
        className:'ProjectListPagePropertyStore',
        eventScopes: [],
        contextTypes:{
            QueryPropertyApp: ProjectQueryPropertyStore,
            TablePropertyApp: ProjectTablePropertyStore,
        },
    }
    constructor(context:IContext) {
        super(context)
    }
}
