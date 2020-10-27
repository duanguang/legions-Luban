import { resource } from 'legions/store';
import { observablePromise } from 'legions/store-utils';
import { action, computed, observable } from 'mobx';
import StoreBase, { IStoreBaseMeta } from '../../common/stores/StoreBase';
import { UserInfoContainerEntity, UserInfoEntity, EUserRole } from '../models/userInfoEntity';
import { getUserInfoService } from '../services/userService';
import { EditSafePwdFormFields, EditSafeEmailFormFields } from '../models/form/editSafePwdModel';
import { getScmReactStore } from '../utils/userInfoUtil';
export const User = resource('PMS/User');

export default class UserInfoStore extends StoreBase{
    static meta:IStoreBaseMeta={
        ...StoreBase.meta,
        className:'UserInfoStore',
    }

    /**
     * 用户信息 response
     * @memberof UserInfoStore
     */
    @observable obUserInfoResponse = observablePromise<UserInfoContainerEntity>();
    @observable obUserSafePwdFormFields = new EditSafePwdFormFields()
    @observable obUserSafeEmailFormFields = new EditSafeEmailFormFields()
    @observable test = observable.map<string,{a:1}>()

    /**
     * 用户信息
     * @readonly
     * @memberof UserInfoStore
     */
    @computed get obUserInfo() {
        if (this.obUserInfoResponse.isResolved && this.obUserInfoResponse.value && this.obUserInfoResponse.value.success) {
            return this.obUserInfoResponse.value.result
        }
        return new UserInfoEntity()
    }

   get userInfo() {
        if (window.parent.ReactStore && window.parent.ReactStore.userInfo) {
            return window.parent.ReactStore.userInfo
        }
        return new UserInfoEntity()
    }

    /**
     *
     * 获取用户信息
     * @memberof UserInfoStore
     */
    @action getUserInfo(){
       this.obUserInfoResponse = observablePromise(getUserInfoService())
    }

    /** 更新用户安全密码 */
    @action
    // tslint:disable-next-line: typedef
    updateUserSafePwdForm(formFields?) {
        this.obUserSafePwdFormFields = new EditSafePwdFormFields({ ...this.obUserSafePwdFormFields, ...formFields });
    }

    /** 重置用户安全密码 */
    @action
    resetUserSafePwdForm() {
        this.obUserSafePwdFormFields = new EditSafePwdFormFields();
    }

    /** 更新用户安全邮箱 */
    @action
    // tslint:disable-next-line: typedef
    updateUserSafeEmailForm(formFields?) {
        this.obUserSafeEmailFormFields = new EditSafeEmailFormFields({ ...this.obUserSafeEmailFormFields, ...formFields });
    }

    /** 重置用户安全邮箱 */
    @action
    resetUserSafeEmailForm() {
        this.obUserSafeEmailFormFields = new EditSafeEmailFormFields();
    }

    /** 检查用户是否有权限访问页面 */
    @action
    checkAccessRight(accessRoleNo: EUserRole, cb?: () => void) {
        const roleNo = getScmReactStore().userInfo.rowData.roleNo;
        if (roleNo < accessRoleNo ) {
            cb && cb()
        } else {
            // @ts-ignore
            this.history.replace('/403')
        }
    }
}
