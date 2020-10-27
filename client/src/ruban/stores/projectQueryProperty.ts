import StoreBase, { IStoreBaseMeta } from '../../common/stores/StoreBase';
import {observable,autorun,action, computed} from 'mobx';
import { observablePromise,ObservableTempState,observableViewModel } from 'legions/store-utils';
import { ProjectFormFields } from '../models/form/projectFormFields';
import UiStoreBase from '../../common/stores/ui/UiStoreBase';
import { IQuery } from 'hoolinks-legion-design/lib/typings/components';
import { ComponentViewResource, IResourceEvent, ITriggerEventPrams } from './even/resourceEvent';
// tslint:disable-next-line: no-empty-interface
interface IContext{
}
class ViewModel {
    @observable.ref query: IQuery[] = []
    /* @observable currComponentView: IQuery = null */
    
    @action addQuery(query: IQuery) {
        this.query.push(query)
        this.query = this.query.slice()
    }
}
export default class ProjectQueryPropertyStore extends UiStoreBase<IContext>{
    static meta :IStoreBaseMeta={
        ...StoreBase.meta,
        className:'ProjectQueryPropertyStore',
        eventScopes: [ComponentViewResource],
        contextTypes:{
            
        },
    }
    viewModel = observableViewModel<ViewModel>(new ViewModel());
    constructor(context:IContext) {
        super(context)
    }
    
    /**
     * 
     *  查询指定组件数据
     * @memberof ViewCanvasUIStore
     */
    triggerGetQueryEven(key: string) {
        const currComponentView = this.viewModel.query.find((item) => item.container.component.JsonProperty.uuid === key)
        this.context.dispatch(ComponentViewResource.created,{currComponentView})
    }
    @action onEvent(event: IResourceEvent<ITriggerEventPrams>) {
        if (ComponentViewResource.updated.name === event.name) { // 设置组件属性值，同步更新画布区域配置值
            if (event.payload.currComponentView) {
               this.viewModel.query= this.viewModel.query.map((item) => {
                    if (item.container.component.JsonProperty.uuid === event.payload.componenyKeys) {
                        return {...event.payload.currComponentView}
                    }
                    return item;
               })
            }
        }
    }

}
