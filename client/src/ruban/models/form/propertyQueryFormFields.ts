
import { IBaseFormFields,BaseFormFields} from 'hoolinks-legion-design/lib/models/BaseFormFields'
import { createFormRule, FormRuleProperty } from 'hoolinks/form-rule'
import { HlLabeledValue } from 'hoolinks-legion-design/lib/models/HlLabeledValue';
import TextProperty from '../../components/property/textProperty';
import get from 'lodash/get'
import set from 'lodash/set'
import has from 'lodash/has'
import camelCase from 'lodash/camelCase';
/** 搜索条件表单Model */
export class PropertyQueryFormFields extends BaseFormFields {
	@FormRuleProperty({
		required: true,
		name: 'labelName',
		error: 'Label名称',
		desc: 'Label名称',
		type: 'string',
	})
	labelName: IBaseFormFields<string> = {
		value: '',
		requestParamKey: 'label',
		submitBeforeTransform: (value) => {
			return value
		},
	}
	
	@FormRuleProperty({
		required: true,
		name: 'componentName',
		error: '组件属性名称只能为英文字符',
		desc: '组件属性名称',
		type: 'string',
        validator: (value: string,error,callback,props: { that: TextProperty; }) => {
            const ViewCanvasApp = props.that.props.store.context.listPagePropertyApp.context.QueryPropertyApp;
            console.log(props)
            let reg = /^[A-Z a-z]+$/
            if (!reg.test(value)) {
                callback(error)
            }
            const index = ViewCanvasApp.viewModel.query.findIndex((item) => item.container.component.JsonProperty.name === value)
			if (index > -1) {
                const uuid = ViewCanvasApp.viewModel.query[index].container.component.JsonProperty.uuid;
                const TablePropertyApp = props.that.props.store.context.listPagePropertyApp.context.TablePropertyApp;
                const curruuid = get(TablePropertyApp.viewModel.currComponentView,'container.component.JsonProperty.uuid');
                if (uuid !== curruuid) {
                    callback('组件属性名称存在相同数据，请重新输入')
				} 
				else if (camelCase(value) !== value) {
					callback('组件属性名称只能为驼峰形式，请重新输入')
				}
				else {
                    callback()
                }
			}
			else if (camelCase(value) !== value) {
				callback('组件属性名称只能为驼峰形式，请重新输入')
			}
            else {
                callback()
            }
        }
	})
	componentName: IBaseFormFields<string> = {
        value: '',
        requestParamKey: 'name',
	}
	@FormRuleProperty({
		required: true,
		name: 'containerWidth',
		error: '总宽度',
		desc: '总宽度',
		type: 'string',
	})
	containerWidth: IBaseFormFields<string> = {
		value: void 0,
	}
	@FormRuleProperty({
		required: false,
		name: 'placeholderContent',
		error: '占位字符',
		desc: '占位字符',
		type: 'string',
	})
	placeholderContent: IBaseFormFields<string> = {
        value: void 0,
        requestParamKey: 'placeholder',
	}

	/**
	 * 
	 *
	 * @type {IBaseFormFields<string>}
	 * @memberof ProjectFormFields
	 */
	@FormRuleProperty({
		required: true,
		name: 'width',
		error: '宽度',
		desc: '宽度',
		type: 'string',
    })
    width: IBaseFormFields<string> = {
        value: '',
        requestParamKey: 'width',
		submitBeforeTransform: (value) => {
			return `${value}px`
		},
	}
    @FormRuleProperty({
		required: true,
		name: 'labelWidth',
		error: 'label宽度',
		desc: 'label宽度',
		type: 'string',
	})
	labelWidth: IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value
		},
	}
	@FormRuleProperty({
		required: true,
		name: 'queryPrams',
		error: '接口字段名称只能为英文字符',
		desc: '接口字段名称',
        type: 'string',
        validator: (value: string,error,callback,props: { that: TextProperty; }) => {
            const ViewCanvasApp = props.that.props.store.context.listPagePropertyApp.context.QueryPropertyApp;
            console.log(props)
            let reg = /^[A-Z a-z]+$/
            if (!reg.test(value)) {
                callback(error)
            }
            const index = ViewCanvasApp.viewModel.query.findIndex((item) => item.container.component.JsonProperty.queryPrams === value)
            if (index > -1) {
                const uuid = ViewCanvasApp.viewModel.query[index].container.component.JsonProperty.uuid;
                const TablePropertyApp = props.that.props.store.context.listPagePropertyApp.context.TablePropertyApp;
                const curruuid = get(TablePropertyApp.viewModel.currComponentView,'container.component.JsonProperty.uuid');
                if (uuid !== curruuid) {
                    callback('接口字段名称存在相同数据，请重新输入')
                } else {
                    callback()
                }
                
            }
            else {
                callback()
            }
        }
	})
	queryPrams: IBaseFormFields<string> = {
		value: void 0,
		requestParamKey:'queryPrams',
		submitBeforeTransform: (value) => {
			return value
		},
	}
	@FormRuleProperty({
		required: false,
		name: 'maxlength',
		error: '字符长度',
		desc: '字符长度',
		type: 'string',
	})
	maxlength: IBaseFormFields<string> = {
		value: void 0,
		submitBeforeTransform: (value) => {
			return value 
		},
	}
    @FormRuleProperty({
        required: false,
        name: 'selectOptionsValue',
        error: '数据项',
        desc: '数据项',
        type: 'object',
    })
    selectOptionsValue: IBaseFormFields<{ key: string; label: string;title: string }> = {
        value: undefined,
        requestParamKey: 'selectOptionsValue',
        submitBeforeTransform: (value) => {
            return value?value.key:''
        },
    }
	constructor(form?: PropertyQueryFormFields) {
		super()
		PropertyQueryFormFields.initMapPropsToFields.call(this, form)
	}
}

export class PropertyQueryFormFieldsRule<
	P = {}
> extends PropertyQueryFormFields {
	constructor(props: P) {
		super()
		createFormRule(PropertyQueryFormFields, this, { props })
	}
}






