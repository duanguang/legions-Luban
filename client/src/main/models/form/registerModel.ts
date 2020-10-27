import { createFormRule, FormRuleProperty } from 'hoolinks/form-rule'
import {
	BaseFormFields,
	IBaseFormFields,
} from 'hoolinks-legion-design/lib/models/BaseFormFields'
import { RegExChk, validatorType } from 'hoolinks/regex'

let password = ''
export class RegisterFormData extends BaseFormFields {
	@FormRuleProperty({
		required: true,
		name: 'name',
		type: 'string',
		error: '',
		desc: '用户名',
	})
	name: IBaseFormFields<string> = { value: '' }

	@FormRuleProperty({
		required: true,
		name: 'password',
		type: 'string',
		error: '',
		desc: '密码',
		validator: (text: string, error, callback) => {
			password = text;
			callback();
		},
	})
	password: IBaseFormFields<string> = { value: '' }

	@FormRuleProperty({
		required: true,
		name: 'confirmPwd',
		type: 'string',
		error: '',
		desc: '确认密码',
		validator: (value, error, callback) => {
			if (value === password) {
				callback()
			} else {
				callback('输入的两次密码不一致')
			}
		},
	})
	confirmPwd: IBaseFormFields<string> = { value: '' }

	@FormRuleProperty({
		required: false,
		name: 'email',
		type: 'string',
		error: '',
		desc: '邮箱',
		validator: (value: string,error,callback) => {
			// @ts-ignore
			if (RegExChk(validatorType.email, value)) {
				callback()
			} else {
				callback('请输入正确的邮箱')
			}
		},
	})
	email: IBaseFormFields<string> = { value: '' }

	@FormRuleProperty({
		required: false,
		name: 'phone',
		type: 'string',
		error: '',
		desc: '手机',
		validator: (value: string,error,callback) => {
			// @ts-ignore
			if (RegExChk(validatorType.mobile, value)) {
				callback()
			} else {
				callback('请输入正确的手机号')
			}
		},
	})
	phone: IBaseFormFields<string> = { value: '' }

	constructor(form?: RegisterFormData) {
		super()
		RegisterFormData.initMapPropsToFields.call(this, form)
	}
}

export class RegisterFormRule extends RegisterFormData {
	constructor() {
		super()
		createFormRule(RegisterFormData, this)
	}
}
