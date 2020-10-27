import { BaseFormFields, IBaseFormFields } from 'hoolinks-legion-design/lib/models/BaseFormFields';
import { FormRuleProperty, createFormRule } from 'hoolinks/form-rule';
import { validatorType, RegExChk } from 'hoolinks/regex';
import { AddUserFormData } from './addUserModel';


export class EditUserFormData extends BaseFormFields {
    @FormRuleProperty({
          required: true,
          name: 'role',
          type: 'string',
          error: '',
          desc: '用户角色',
      })
    role: IBaseFormFields<string> = { value: 'common' }

	@FormRuleProperty({
		required: true,
		name: 'name',
		type: 'string',
		error: '',
		desc: '用户名',
	})
  name: IBaseFormFields<string> = { value: '' }

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

    jToken: IBaseFormFields<string> = { value: '' }

	constructor(form?: EditUserFormData) {
		super()
		EditUserFormData.initMapPropsToFields.call(this, form)
	}
}

export class EditUserFormRule extends EditUserFormData {
	constructor() {
		super()
		createFormRule(EditUserFormData, this)
	}
}
