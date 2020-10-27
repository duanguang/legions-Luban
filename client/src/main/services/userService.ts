import { get, post,LegionRequestConfig } from 'legions/fetch'
import {
	UserInfoContainerEntity,
	LoginServiceParams,
	RegisterServiceParams,
	IAddUserServiceParams,
	IDelUserServiceParams,
	UserInfoEntity,
	IUpdateUserBaseInfoParams,
	IUpdateUserSafePwdParams,
	IUpdateUserSafeEmailParams,
} from '../models/userInfoEntity'
import { HttpConfig, setHeaders, authFunction } from '../constants/httpConfig'
import { IQueryUserTableParams } from './../models/userInfoEntity'
import { IQueryPageParams } from '../models/common/pageEntity';
import { UserManagerTableContainerEntity } from '../models/table/userManagerModel';
import { BFFContainerEntity } from '../models/common/baseEntity';
import { getAuthToken } from './../constants/httpConfig';

const url = HttpConfig.domainLegoinServer

export function getUserInfoService() {
	let options = setHeaders()
	return get(`${url}/user/getUserInfo`, {}, options).then((result) => {
		return new UserInfoContainerEntity(result)
	})
}

/** 登陆 */
export function loginService(params: LoginServiceParams) {
	let options = setHeaders(`${url}/login`)
	return post(HttpConfig.gateWay, params, options).then((result) => {
		return new UserInfoContainerEntity(result)
	})
}

/** 注册 */
export function registerService(params: RegisterServiceParams) {
	let options = setHeaders(`${url}/register`)
	return post(HttpConfig.gateWay, params, options).then((result) => {
		return new UserInfoContainerEntity(result)
	})
}
function getOptions() {
	return {
			headers: {
			Authorization: getAuthToken(),
		},
	}
}
interface IHeaders{
	Authorization:string
}
/** 查询用户列表数据 */
export function queryUserTableDataService(params: Partial<IQueryUserTableParams> & IQueryPageParams) {
	return get<IHeaders>(`${url}/system/userList/query`, params, getOptions()).then((result) => {
		return new UserManagerTableContainerEntity(result)
	}).catch(error => {
		authFunction(error)
		return new UserManagerTableContainerEntity()
	})
}

/** 查询用户数据 */
export function queryUserDataService(params: { uuid: string}) {
	return get<IHeaders>(`${url}/user/query`, params, getOptions()).then((result) => {
		return new UserInfoContainerEntity(result)
	}).catch(error => {
		authFunction(error)
		return new UserInfoContainerEntity()
	})
}

/** 添加用户 */
export function addUserService(params: IAddUserServiceParams) {
	return post(`${url}/user/add`, params, getOptions()).then((result) => {
		return new UserInfoContainerEntity(result)
	}).catch(error => {
		authFunction(error)
		return new UserInfoContainerEntity()
	})
}

/** 编辑用户 */
export function editUserService(params: Partial<UserInfoEntity> & { uuid: string}) {
	return post(`${url}/user/edit`, params, getOptions()).then((result) => {
		return new UserInfoContainerEntity(result)
	}).catch(error => {
		authFunction(error)
		return new UserInfoContainerEntity()
	})
}

/** 删除用户 */
export function delUserService(params: IDelUserServiceParams) {
	return post(`${url}/user/delete`, params, getOptions()).then((result) => {
		return new BFFContainerEntity(result)
	}).catch(error => {
		authFunction(error, false)
		return new BFFContainerEntity();
	})
}

/** 重置用户密码为默认密码 */
export function resetUserDefaultPwdService(params: { uuid: string }) {
	return post(`${url}/user/password/resetDefault`, params, getOptions()).then((result) => {
		return new BFFContainerEntity(result)
	}).catch(error => {
		authFunction(error, false)
		return new BFFContainerEntity();
	})
}

/** 获取当前用户的基础信息 */
export function queryUserBaseInfoService() {
	return get(`${url}/user/baseInfo/query`, {}, getOptions()).then((result) => {
		return new BFFContainerEntity(result)
	}).catch(error => {
		authFunction(error, false)
		return new BFFContainerEntity();
	})
}

/** 更新当前用户的基础信息 */
export function updateUserBaseInfoService(params: Partial<IUpdateUserBaseInfoParams>) {
	return post(`${url}/user/baseInfo/update`, params, getOptions()).then((result) => {
		return new BFFContainerEntity(result)
	}).catch(error => {
		authFunction(error, false)
		return new BFFContainerEntity();
	})
}

/** 获取当前用户的安全信息 */
export function queryUserSafeInfoService() {
	return get(`${url}/user/safeInfo/query`, {}, getOptions()).then((result) => {
		return new BFFContainerEntity(result)
	}).catch(error => {
		authFunction(error, false)
		return new BFFContainerEntity();
	})
}

/** 更新当前用户的安全密码 */
export function updateUserSafePwdService(params: IUpdateUserSafePwdParams) {
	return post(`${url}/user/password/update`, params, getOptions()).then((result) => {
		return new BFFContainerEntity<{ errField: string[] }>(result)
	}).catch(error => {
		authFunction(error, false)
		return new BFFContainerEntity<null>();
	})
}

/** 更新当前用户的安全邮箱 */
export function updateUserSafeEmailService(params: IUpdateUserSafeEmailParams) {
	return post(`${url}/user/email/update`, params, getOptions()).then((result) => {
		return new BFFContainerEntity<{ errField: string[] }>(result)
	}).catch(error => {
		authFunction(error, false)
		return new BFFContainerEntity<null>();
	})
}