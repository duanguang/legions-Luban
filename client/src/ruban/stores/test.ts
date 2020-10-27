import { action,computed,autorun,runInAction,observable } from 'mobx';
import StoreBase from 'hoolinks-legion-design/lib/stores/StoreBase';

// tslint:disable-next-line: no-duplicate-imports
import { IStoreBaseMeta } from 'hoolinks-legion-design/lib/stores/StoreBase';

import { observablePromise } from 'legions/store-utils';
import { ContainerEntity } from '../models/common/baseEntity';
import { get,post } from 'legions/fetch';
import { HttpConfig,setHeaders } from '../constants/httpConfig';
// tslint:disable-next-line: no-empty-interface
interface IContainerEntity { }

export default class DemoPageListStore extends StoreBase {
    static meta: IStoreBaseMeta = {
        ...StoreBase.meta,
        className: 'DemoPageListStore',
        contextTypes: {},
    };

    @observable
    exportResponse = observablePromise<ContainerEntity<IContainerEntity>>();

    @observable
    customColumnsResponse = observablePromise<ContainerEntity<IContainerEntity>>();

    @observable
    customBtn2Response = observablePromise<ContainerEntity<IContainerEntity>>();

    apiServerice(apiurl: string,method: string,params: Object) {
        let url = '';
        let options = setHeaders(`${url}${apiurl}`);
        if (method === 'post') {
            return post(`${HttpConfig.gateWay}`,params,options).then((res) => {
                return new ContainerEntity(res);
            })
        }
        if (method === 'get') {
            return get(`${HttpConfig.gateWay}`,params,options).then((res) => {
                return new ContainerEntity(res);
            })
        }
    }

    @action editAdd(apiurl: string,method: string,params: Object) {
        this.customBtn2Response = observablePromise(this.apiServerice(apiurl,method,params));
    }
}