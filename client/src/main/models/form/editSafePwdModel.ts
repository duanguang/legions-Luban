import {
	BaseFormFields,
	IBaseFormFields,
} from 'hoolinks-legion-design/lib/models/BaseFormFields'
import { FormRuleProperty, createFormRule } from 'hoolinks/form-rule'
import { commonRegex } from './../../../common/utils/regex'

let editSafePwdForm: EditSafePwdFormFields = null
let editSafeEmailForm: EditSafeEmailFormFields = null

export class EditSafePwdFormFields extends BaseFormFields {
	@FormRuleProperty({
		required: true,
		name: 'oldPwd',
		type: 'string',
		error: '',
		desc: '旧密码',
	})
	oldPwd: IBaseFormFields<string> = { value: '' }

	@FormRuleProperty({
		required: true,
		name: 'newPwd',
		type: 'string',
		error: '',
		desc: '新密码',
		validator: (value, error, cb) => {
			if (
				editSafePwdForm.oldPwd.value === editSafePwdForm.newPwd.value
			) {
				cb('新旧密码不能一样')
			} else {
				cb()
			}
		},
	})
	newPwd: IBaseFormFields<string> = { value: '' }

	@FormRuleProperty({
		required: false,
		name: 'safePwdVerifyCode',
		type: 'string',
		error: '',
		desc: '验证码',
	})
	safePwdVerifyCode: IBaseFormFields<string> = { value: '' }

	constructor(form?: EditSafePwdFormFields) {
		super()
		if (form) {
			editSafePwdForm = form
		}
		EditSafePwdFormFields.initMapPropsToFields.call(this, form)
	}
}

export class EditSafePwdFormRule extends EditSafePwdFormFields {
	constructor() {
		super()
		createFormRule(EditSafePwdFormFields, this)
	}
}

export class EditSafeEmailFormFields extends BaseFormFields {
	@FormRuleProperty({
		required: true,
		name: 'oldSafeEmail',
		type: 'string',
		error: '',
		desc: '旧邮箱',
		validator: (value: string, error, callBack) => {
			if (commonRegex.EMAIL.test(value)) {
				callBack()
			} else {
				callBack('注册邮箱格式不正确')
			}
		},
	})
	oldSafeEmail: IBaseFormFields<string> = { value: '' }

	@FormRuleProperty({
		required: true,
		name: 'newSafeEmail',
		type: 'string',
		error: '',
		desc: '新邮箱',
		validator: (value: string, error, callBack) => {
			if (commonRegex.EMAIL.test(value)) {
				if (
					editSafeEmailForm.oldSafeEmail.value ===
					editSafeEmailForm.newSafeEmail.value
				) {
					callBack('新旧邮箱不能一样')
				} else {
					callBack()
				}
			} else {
				callBack('注册邮箱格式不正确')
			}
		},
	})
	newSafeEmail: IBaseFormFields<string> = { value: '' }

	constructor(form?: EditSafeEmailFormFields) {
		super()
		if (form) {
			editSafeEmailForm = form
		}
		EditSafeEmailFormFields.initMapPropsToFields.call(this, form)
	}
}

export class EditSafeEmailFormRule extends EditSafeEmailFormFields {
	constructor() {
		super()
		createFormRule(EditSafeEmailFormFields, this)
	}
}
