import StoreBase, { IStoreBaseMeta } from '../../common/stores/StoreBase';
import {observable,autorun,action, computed} from 'mobx';
import { observablePromise,ObservableTempState } from 'legions/store-utils';
import { MockContainerEntity } from '../models/mockEntity';
import { getMockData } from '../services/message';
interface IContext{
/*  UserInfoApp:UserInfoStore, */
    s: string;
}
export interface ITriggerEventPrams{
    payload:{
        payloadModel:string;
        b:number;
    }
}
export default class TodoStore extends StoreBase<IContext>{
    static meta :IStoreBaseMeta={
        ...StoreBase.meta,
        className:'TodoStore',
        /* eventScopes: [User], */
        contextTypes:{
            /* UserInfoApp:UserInfoStore, */
        },
    }

    @observable obMockData=observablePromise<MockContainerEntity>();

    constructor(context:IContext){
        super(context);
        this.watch()
    }

    watch=()=>{
        autorun(()=> {
            console.log('数据状态',this.obMockData.state)
         });
    }

    @action getMockData(){
        this.obMockData=observablePromise(getMockData());
    }
    triggerEvent(payload:ITriggerEventPrams) {
        /* this.context.dispatch(User.created,payload); */
    }
}
