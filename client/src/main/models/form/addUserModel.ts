import { createFormRule, FormRuleProperty } from 'hoolinks/form-rule'
import { RegisterFormData } from './registerModel';
import {
	BaseFormFields,
	IBaseFormFields,
} from 'hoolinks-legion-design/lib/models/BaseFormFields'

export class AddUserFormData extends RegisterFormData {
  @FormRuleProperty({
		required: true,
		name: 'role',
		type: 'string',
		error: '',
		desc: '用户角色',
	})
  role: IBaseFormFields<string> = { value: 'common' }

  jToken: IBaseFormFields<string> = { value: '' }

  constructor(form?: AddUserFormData) {
    super()
		AddUserFormData.initMapPropsToFields.call(this, form)
  }
}

export class AddUserFormRule extends AddUserFormData {
	constructor() {
		super()
		createFormRule(AddUserFormData, this)
	}
}
