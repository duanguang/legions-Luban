import { JsonProperty } from 'json-mapper-object'
import { IBFFBaseEntity, BFFContainerEntity } from './common/baseEntity'

export enum EUserRole {
	/** 超级管理员 */
  super_admin = 0,
  /** 管理员 */
  admin = 5,
  /** 运维人员 */
  dev_ops = 10,
  /** 运营人员 */
  operation = 15,
  /** 普通用户 */
  common = 20,
}

export class UserInfoEntity {
	@JsonProperty('_id')
	_id = ''

	@JsonProperty('uuid')
	uuid = ''

	@JsonProperty('name')
	name = ''

	@JsonProperty('nickName')
	nickName = ''

	@JsonProperty('sex')
	sex = ''

	@JsonProperty('email')
	email = ''

	@JsonProperty('pwdEmail')
	pwdEmail = ''

	@JsonProperty('phone')
	phone = ''

	@JsonProperty('role')
	role = ''

	@JsonProperty('roleNo')
	roleNo:number = void 0

	@JsonProperty('createTime')
	createTime = ''

	@JsonProperty('updateTime')
	updateTime = ''

	@JsonProperty('lastLoginTime')
	lastLoginTime = ''

	@JsonProperty('token')
	token = ''

	@JsonProperty('expiresTime')
    expiresTime = 0

	@JsonProperty('jToken')
		jToken = ''

	@JsonProperty('pwdStrength')
	pwdStrength = ''

	@JsonProperty('belongCenter')
	belongCenter = ''

	@JsonProperty('belongDepartment')
	belongDepartment = ''
}

export class UserInfoContainerEntity extends BFFContainerEntity<UserInfoEntity> {
	constructor(fromJson?: IBFFBaseEntity<UserInfoEntity>) {
		// @ts-ignore
		super(fromJson)
		let data = fromJson.data
		if (fromJson && data) {
			this.result = super.transformRow(data, UserInfoEntity)
		} else {
			this.result = new UserInfoEntity()
		}
	}
}

export interface LoginServiceParams {
	name?: string
	email?: string
	password: string
}

export interface RegisterServiceParams {
	name: string
	password: string
	email?: string
	phone?: string
}

export interface IQueryUserTableParams {
	uuid: string
	searchTxt: string
}

export interface IAddUserServiceParams extends RegisterServiceParams {
	role: string
    jToken: string
}

export interface IDelUserServiceParams {
	uuid: string
}

export interface IUpdateUserBaseInfoParams {
	name: string
	nickName: string
	email: string
	phone: string
	sex: string
	belongCenter: string
	belongDepartment: string
}

export interface IUpdateUserSafePwdParams {
	oldPwd: string;
	newPwd: string;
}

export interface IUpdateUserSafeEmailParams {
	oldEmail: string;
	newEmail: string;
}