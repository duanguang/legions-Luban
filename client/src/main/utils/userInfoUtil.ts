import { IWindow } from '../../common/typings/global'
import { UserInfoEntity } from '../models/userInfoEntity'


/** 获取ReactStore，包含用户信息和tab页签相关操作 */
export const getScmReactStore = (): IWindow<UserInfoEntity> => {
    if (window.parent && window.parent.ReactStore && Object.keys(window.parent.ReactStore).length > 0) {
        return window.parent.ReactStore as IWindow<UserInfoEntity>
    }
}
