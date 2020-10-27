
import { IBaseFormFields,BaseFormFields} from 'hoolinks-legion-design/lib/models/BaseFormFields'
import { createFormRule, FormRuleProperty } from 'hoolinks/form-rule'
import {
    AutoQueryVModelCode,
} from '../../constants/code/tableConfigCode';
import AddSelectValue from '../../components/addSelectValue';
import { HlLabeledValue } from 'hoolinks-legion-design/lib/models/HlLabeledValue';
export class PropertyColumnsConfigFormFields extends BaseFormFields {
	@FormRuleProperty({
		required: true,
		name: 'columnsName',
		error: '表格列名称',
		desc: '表格列名称',
		type: 'string',
	})
	columnsName: IBaseFormFields<string> = {
		value: '',
		requestParamKey: 'title',
		submitBeforeTransform: (value) => {
			return value
		},
	}
	/**
	 * 项目名称
	 *
	 *
	 * @memberof GroupManageAddFrom
	 * @groupName 事业部名称
	 */
	@FormRuleProperty({
		required: true,
		name: 'dataIndex',
		error: '属性名称必须为英文',
		desc: '数据属性名称',
		type: 'string',
		regex: /^[A-Z a-z]+$/, // 自定义验证规则
	})
	dataIndex: IBaseFormFields<string> = {
		value: '',
	}

	/**
	 * git 账户名
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
		submitBeforeTransform: (value) => {
			return `${value}px`
		},
	}
	@FormRuleProperty({
		required: false,
		name: 'customColumnsRender',
		error: '自定义渲染',
		desc: '自定义渲染',
		type: 'string',
	})
	customColumnsRender: IBaseFormFields<string> = {
		value: void 0,
		requestParamKey:'prorender',
		submitBeforeTransform: (value) => {
			return value
		},
	}
	@FormRuleProperty({
		required: false,
		name: 'sorter',
		error: '排序',
		desc: '是否开启排序',
		type: 'boolean',
	})
	sorter: IBaseFormFields<boolean> = {
		value: false,
		submitBeforeTransform: (value) => {
			return value ? value : false
		},
	}

	constructor(form?: PropertyColumnsConfigFormFields) {
		super()
		PropertyColumnsConfigFormFields.initMapPropsToFields.call(this, form)
	}
}

export class PropertyColumnsConfigFormFieldsRule<
	P = {}
> extends PropertyColumnsConfigFormFields {
	constructor(props: P) {
		super()
		createFormRule(PropertyColumnsConfigFormFields, this, { props })
	}
}


/**
 * 表格数据源表单信息
 *
 * @export
 * @class PropertyTableDataSourceFormFields
 * @extends {BaseFormFields}
 */
export class PropertyTableDataSourceFormFields extends BaseFormFields {
	@FormRuleProperty({
		required: true,
		name: 'apiUrl',
		error: '请求接口',
		desc: '请求接口',
		type: 'string',
	})
	apiUrl: IBaseFormFields<string> = {
		value: '',
		requestParamKey: 'apiUrl',
		submitBeforeTransform: (value) => {
			return value
		},
	}
	@FormRuleProperty({
		required: true,
		name: 'method',
		error: '请求方式',
		desc: '请求方式',
		type: 'object',
	})
	method: IBaseFormFields<{ key: string; label: string;title: string }> = {
		value: undefined,
		requestParamKey: 'method',
		submitBeforeTransform: (value) => {
			return value?value.label:''
		},
	}
	@FormRuleProperty({
		required: true,
		name: 'token',
		error: '令牌',
		desc: '令牌',
		type:'string',
	})
	token: IBaseFormFields<string> = { value: '' }

	@FormRuleProperty({
		required: true,
		name: 'parames',
		error: '搜索条件',
		desc: '搜索条件',
		type:'string',
	})
	parames: IBaseFormFields<string> = { value: '' }

	@FormRuleProperty({
		required: true,
		name: 'onSearch',
		error: '搜索',
		desc: '搜索',
		type:'string',
	})
	onSearch: IBaseFormFields<string> = { value: '' }

	@FormRuleProperty({
		required: true,
		name: 'onReset',
		error: '重置',
		desc: '重置',
		type:'string',
	})
	onReset: IBaseFormFields<string> = { value: '' }

	@FormRuleProperty({
		required: true,
		name: 'headers',
		error: 'headers参数',
		desc: 'headers参数',
		type: 'string',
	})
	headers: IBaseFormFields<string> = {
		value: "{'HL-Access-Token':HeadersToken}",
		requestParamKey: 'options',
	}
	@FormRuleProperty({
		required: true,
		name: 'transform',
		error: '数据变换',
		desc: '数据变换',
		type: 'string',
	})
	transform: IBaseFormFields<string> = {
		value: '',
		requestParamKey: 'transform',
	}
	@FormRuleProperty({
		required: true,
		name: 'model',
		error: 'VModel',
		desc: 'VModel',
		type: 'string',
	})
	model: IBaseFormFields<string> = {
		value: AutoQueryVModelCode,
		requestParamKey: 'model',
	}
	constructor(form?: PropertyTableDataSourceFormFields) {
		super()
		PropertyTableDataSourceFormFields.initMapPropsToFields.call(this, form)
	}
}

/**
 * 表格数据源表单信息验证规则
 *
 * @export
 * @class PropertyTableDataSourceFormFieldsRule
 * @extends {PropertyTableDataSourceFormFields}
 * @template P
 */
export class PropertyTableDataSourceFormFieldsRule<
	P = {}
    > extends PropertyTableDataSourceFormFields {
    constructor(props: P) {
        super()
        createFormRule(PropertyTableDataSourceFormFields,this,{props})
    }
}

export class PropertyTableBaseConfigFormFields extends BaseFormFields{
	@FormRuleProperty({
		required: true,
		name: 'uniqueKey',
		error: '唯一字段',
		desc: '唯一字段',
		type:'string',
	})
	uniqueKey: IBaseFormFields<string> = {
		value:'id',
	}
	
	@FormRuleProperty({
		required: false,
		name: 'isOpenCustomColumns',
		error: '自定义列',
		desc: '',
		type: 'boolean',
	})
	isOpenCustomColumns: IBaseFormFields<Boolean> = {
		value: true,
			submitBeforeTransform: (value) => {
			return value.toString()
		},
	};

	@FormRuleProperty({
		required: false,
		name: 'isOpenRowChange',
		error: '行选中',
		desc: '',
		type: 'boolean',
	})
	isOpenRowChange: IBaseFormFields<Boolean> = {
		value: true,
		submitBeforeTransform: (value) => {
			return value.toString()
		},
	};

	@FormRuleProperty({
		required: false,
		name: 'isExportCurrData',
		error: '导出当页',
		desc: '',
		type: 'boolean',
	})
	isExportCurrData: IBaseFormFields<Boolean> = { value: false ,submitBeforeTransform: (value) => {
		return value.toString()
	}};

	@FormRuleProperty({
		required: false,
		name: 'tableModulesName',
		error: '表格模块名称',
		desc: '',
		type: 'string',
	})
	tableModulesName: IBaseFormFields<string> = { value: '' };
	constructor(form?: PropertyTableBaseConfigFormFields) {
		super()
		PropertyTableBaseConfigFormFields.initMapPropsToFields.call(this, form)
	}
}

export class PropertyTableBaseConfigFormFieldsRule<
	P = {}
    > extends PropertyTableBaseConfigFormFields {
    constructor(props: P) {
        super()
        createFormRule(PropertyTableBaseConfigFormFields,this,{props})
    }
}

/**
 * 操作按钮属性配置
 *
 * @export
 * @class PropertyTableOperationFormFields
 * @extends {BaseFormFields}
 */
export class PropertyTableOperationFormFields extends BaseFormFields{
	@FormRuleProperty({
		required: false,
		name: 'onClick',
		error: '单击事件',
		desc: '单击事件',
		type:'string',
	})
	onClick: IBaseFormFields<string> = {
		value:'id',
	}
	
	@FormRuleProperty({
		required: true,
		name: 'name',
		error: '按钮名称',
		desc: '',
		type: 'string',
	})
	name: IBaseFormFields<string> = {
		value: '',
			submitBeforeTransform: (value) => {
			return value.toString()
		},
	};
	@FormRuleProperty({
		required: true,
		name: 'nameEn',
		error: '只能为英文字符,且首字母大写',
		desc: '',
		regex:/^[A-Z][A-Z a-z]+$/, // 自定义验证规则
		type: 'string',
	})
	nameEn:IBaseFormFields<string> = {
		value: '',
			submitBeforeTransform: (value) => {
			return value.toString()
		},
	};

	@FormRuleProperty({
		required: true,
		name: 'apiUrl',
		error: 'API接口',
		desc: '',
		type: 'string',
	})
	apiUrl: IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value.toString()
		},
	};

	@FormRuleProperty({
		required: false,
		name: 'params',
		error: '请求参数',
		desc: '请求参数',
		type: 'object',
	})
	params: IBaseFormFields<{ key: string; label: string;title: string }> = {
		value: undefined,
		requestParamKey: 'params',
		submitBeforeTransform: (value) => {
			return value?value.key:''
		},
	}
	@FormRuleProperty({
		required: true,
		name: 'method',
		error: '请求方式',
		desc: '请求方式',
		type: 'string',
	})
	method: IBaseFormFields<string> = {
		value: undefined,
		requestParamKey: 'method',
		submitBeforeTransform: (value) => {
			return value?value:''
		},
	}
	@FormRuleProperty({
		required: false,
		name: 'isNeedApi',
		error: '排序',
		desc: '是否需要接口',
		type: 'boolean',
	})
	isNeedApi: IBaseFormFields<boolean> = {
		value: false,
		submitBeforeTransform: (value) => {
			return value ? value : false
		},
	}
	constructor(form?: PropertyTableOperationFormFields) {
		super()
		PropertyTableOperationFormFields.initMapPropsToFields.call(this, form)
	}
}

export class PropertyTableOperationFormFieldsRule<
	P = {}
    > extends PropertyTableOperationFormFields {
    constructor(props: P) {
        super()
        createFormRule(PropertyTableOperationFormFields,this,{props})
    }
}
export class PropertyKeyValueFormFields extends BaseFormFields{
	@FormRuleProperty({
		required: true,
		name: 'keysId',
		error: 'keysId',
		desc: '',
		type: 'string',
		regex:/^[A-Z a-z]+$/,
	})
	keysId: IBaseFormFields<string> = {
			value: '',
		requestParamKey:'key',
	}
	
	@FormRuleProperty({
		required: true,
		name: 'value',
		error: 'value',
		desc: '',
		type: 'string',
	})
	value: IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value.toString()
		},
	};
	

	@FormRuleProperty({
		required: true,
		name: '选项值',
		error: '选项值只能为英文,数字，或组合',
		desc: '选项值',
		type: 'string',
		/* regex: /^([A-Z a-z])|(\d)|([A-Z a-z 0-9])+$/, */
		validator: (value:string,error,calback,props:AddSelectValue) => {
			const reg = /^([A-Z a-z])|(\d)|([A-Z a-z 0-9])+$/
			if (!reg.test(value)) {
				calback(error)
			}
			calback();
		}
	})
	labelKey: IBaseFormFields<string> = {
			value: '',
		requestParamKey:'key',
	}
	
	@FormRuleProperty({
		required: true,
		name: 'labelValue',
		error: 'labelValue',
		desc: '选项标签名',
		type: 'string',
	})
	labelValue: IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value.toString()
		},
	};

	@FormRuleProperty({
		required: true,
		name: 'apiUrl',
		error: '请求接口',
		desc: '请求接口',
		type: 'string',
	})
	apiUrl: IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value.toString()
		},
	};
	@FormRuleProperty({
		required: true,
		name: 'method',
		error: '请求方式',
		desc: '请求方式',
		type: 'string',
	})
	method: IBaseFormFields<string> = {
		value: undefined,
		requestParamKey: 'method',
		submitBeforeTransform: (value) => {
			return value?value:''
		},
    }
    @FormRuleProperty({
        required: true,
        name: 'params',
        error: '请求参数',
        desc: '请求参数',
        type: 'string',
    })
    params: IBaseFormFields<string> = {
        value: undefined,
        requestParamKey: 'params',
        submitBeforeTransform: (value) => {
            return value?value:''
        },
    }
    @FormRuleProperty({
        required: true,
        name: 'headers',
        error: 'headers参数',
        desc: 'headers参数',
        type: 'string',
    })
    headers: IBaseFormFields<string> = {
        value: "{'HL-Access-Token':HeadersToken}",
        requestParamKey: 'options',
    }
    @FormRuleProperty({
        required: true,
        name: 'transform',
        error: '数据变换',
        desc: '数据变换',
        type: 'string',
    })
    transform: IBaseFormFields<string> = {
        value: '',
        requestParamKey: 'transform',
    }
    @FormRuleProperty({
        required: false,
        name: 'model',
        error: 'model',
        desc: 'model',
        type: 'string',
    })
    model: IBaseFormFields<string> = {
        value: '',
        requestParamKey: 'model',
	}
	@FormRuleProperty({
		required: true,
		name: 'token',
		error: 'token',
		desc: 'token',
		type: 'string',
	})
	token: IBaseFormFields<string> = {
		value: '',
		requestParamKey: 'token',
	}
	@FormRuleProperty({
		required: false,
		name: 'isRemote',
		error: '远程搜索',
		desc: '是否开启远程搜索',
		type: 'boolean',
	})
	isRemote: IBaseFormFields<boolean> = {
		value: false,
		submitBeforeTransform: (value) => {
			return value ? value : false
		},
	}
	@FormRuleProperty({
		required: false,
		name: 'isPageing',
		error: '分页',
		desc: '是否开启分页',
		type: 'boolean',
	})
	isPageing: IBaseFormFields<boolean> = {
		value: true,
		submitBeforeTransform: (value) => {
			return value ? value : false
		},
	}
	constructor(form?: PropertyKeyValueFormFields) {
		super()
		PropertyKeyValueFormFields.initMapPropsToFields.call(this, form)
	}
}
export class PropertyKeyValueFormFieldsRule<
	P = {}
    > extends PropertyKeyValueFormFields {
    constructor(props: P) {
        super()
        createFormRule(PropertyKeyValueFormFields,this,{props})
    }
}