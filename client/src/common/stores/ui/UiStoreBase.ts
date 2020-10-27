import StoreBase,{IStoreBaseMeta} from "../StoreBase";
import {Lifecycle} from "legions/store";
export default class UiStoreBase<Context = {}> extends StoreBase<Context> {
    static meta :IStoreBaseMeta= {
        ...StoreBase.meta,
        namespace: `${StoreBase.meta.namespace}.ui`,
        lifecycle: Lifecycle.History
    }
}
