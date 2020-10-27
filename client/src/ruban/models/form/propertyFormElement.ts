
import { IBaseFormFields,BaseFormFields } from 'hoolinks-legion-design/lib/models/BaseFormFields'
import {HlLabeledValue} from 'hoolinks-legion-design/lib/models/HlLabeledValue'
import { createFormRule,FormRuleProperty } from 'hoolinks/form-rule'
import FormProerty from '../../components/property/formProperty'
import ProjectStore from '../../stores/projectStore'
import camelCase from 'lodash/camelCase';
export class PropertyFormGroupGlobalFormFields extends BaseFormFields{
    @FormRuleProperty({
		required: true,
		name: 'name',
		error: '分组名称',
		desc: '分组名称',
		type:'string',
	})
	name: IBaseFormFields<string> = {
		value:'',
	}
    @FormRuleProperty({
		required: true,
		name: 'groupId',
		error: '分组标识',
		desc: '分组标识',
        type: 'string',
	})
	groupId: IBaseFormFields<string> = {
        value: '',
        requestParamKey:'id',
        submitBeforeTransform: (value) => {
            return value ? parseFloat(value) : null;
        },
        beforeDataToFormFields: (value) => {
            return value.toString();
        }
	}
    @FormRuleProperty({
		required: false,
		name: 'isFolding',
		error: '',
		desc: '是否折叠',
		type: 'boolean',
	})
	isFolding: IBaseFormFields<boolean> = {
		value: true,
		submitBeforeTransform: (value) => {
			return value ? value : false
		},
	}
    @FormRuleProperty({
		required: false,
		name: 'isShowFormSizeIcon',
		error: '',
		desc: '是否手动控制表单尺寸',
		type: 'boolean',
	})
	isShowFormSizeIcon: IBaseFormFields<boolean> = {
		value: false,
		submitBeforeTransform: (value) => {
			return value ? value : false
		},
    }
    constructor(form?: PropertyFormGroupGlobalFormFields) {
        super()
        PropertyFormGroupGlobalFormFields.initMapPropsToFields.call(this, form)
    }
}
export class  PropertyFormGroupGlobalFormFieldsRule<
	P = {}
    > extends PropertyFormGroupGlobalFormFields {
    constructor(props: P) {
        super()
        createFormRule(PropertyFormGroupGlobalFormFields,this,{props})
    }
}
/**
 * 表单元素属性数据
 *
 * @export
 * @class PropertyTableOperationFormFields
 * @extends {BaseFormFields}
 */
export class PropertyFormElementFormFields extends BaseFormFields{
	@FormRuleProperty({
		required: false,
		name: 'layout',
		error: '表单布局',
		desc: '表单布局',
		type: 'string',
	})
	layout: IBaseFormFields<string> = {
		value:'1',
	}
	
	@FormRuleProperty({
		required: true,
		name: 'sizes',
		error: '表单尺寸',
		desc: '',
		type: 'string',
	})
	sizes: IBaseFormFields<'default' | 'small'|'table'> = {
		value: 'default',
		submitBeforeTransform: (value) => {
			return value.toString()
		},
	};
	@FormRuleProperty({
		required: false,
		name: 'groupList',
		error: '表单分组',
		desc: '表单分组',
		type: 'object',
	})
	groupList: IBaseFormFields<HlLabeledValue> = {
		value: undefined,
		requestParamKey: 'groupList',
		submitBeforeTransform: (value) => {
			return value?value.key:''
		},
	}
	@FormRuleProperty({
		required: true,
		name: 'name',
		error: '只能为英文字符',
		desc: '',
		/* regex:/^[A-Z a-z]+$/, */ // 自定义验证规则
        type: 'string',
        validator:(value: string,error,callback,props: { that: FormProerty; store: ProjectStore })=>{
            const formPropertyApp = props.store.context.formPropertyApp;
            let reg = /^[A-Z a-z]+$/
            if (!reg.test(value)) {
                callback(error)
            }
            else if (formPropertyApp.hasIAntdName(value)) {
                callback('存在相同组件名称')
			}
			else if (camelCase(value) !== value) {
				callback('组件属性名称只能为驼峰形式，请重新输入')
			}
            else {
                callback()
            }
        }
	})
	name:IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value.toString()
		},
    };
    @FormRuleProperty({
		required: true,
		name: 'labelName',
		error: '只能为英文字符',
		desc: '',
		type: 'string',
	})
	labelName:IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value.toString()
		},
	};

    @FormRuleProperty({
		required: true,
		name: 'labelSpan',
		error: '',
		desc: '',
		type: 'string',
	})
	labelSpan:IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value.toString()
		},
    };
    @FormRuleProperty({
		required: true,
		name: 'elementSpan',
		error: '',
		desc: '元素组件宽度',
		type: 'string',
	})
	elementSpan:IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value.toString()
		},
	};
    @FormRuleProperty({
		required: false,
		name: 'containerSpan',
		error: '',
		desc: '容器宽度',
		type: 'string',
	})
	containerSpan:IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value.toString()
		},
	};
    @FormRuleProperty({
		required: false,
		name: 'subGroup',
		error: '分组信息',
		desc: '分组信息',
		type: 'string',
	})
	subGroup:IBaseFormFields<string> = {
		value: undefined,
		requestParamKey:'subGroup',
		submitBeforeTransform: (value) => {
			return value?value:''
		},
	};
    @FormRuleProperty({
		required: false,
		name: 'inputType',
		error: '',
		desc: '文本框组件类型',
		type: 'string',
	})
	inputType:IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value.toString()
		},
    };
    @FormRuleProperty({
		required: false,
		name: 'maxLength',
		error: '',
		desc: '输入最大长度',
		type: 'string',
	})
	maxLength:IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value.toString()
		},
	};
	@FormRuleProperty({
		required: false,
		name: 'inputAddonAfter',
		error: '文本框后缀',
		desc: '文本框后缀',
		type: 'object',
	})
	inputAddonAfter: IBaseFormFields<HlLabeledValue> = {
		value: void 0,
		submitBeforeTransform: (value) => {
			return value?value.key:''
		},
	}
    @FormRuleProperty({
		required: false,
		name: 'isDisabled',
		error: '禁用',
		desc: '是否禁用',
		type: 'boolean',
	})
	isDisabled: IBaseFormFields<boolean> = {
		value: false,
		submitBeforeTransform: (value) => {
			return value ? value : false
		},
    }
    @FormRuleProperty({
        required: false,
        name: 'selectOptionsValue',
        error: '下拉选项',
        desc: '下拉选项',
        type: 'object',
    })
    selectOptionsValue: IBaseFormFields<{ key: string; label: string;title: string }> = {
        value: undefined,
        requestParamKey: 'selectOptionsValue',
        submitBeforeTransform: (value) => {
            return value?value.key:''
        },
    }
	/** 必填 */
	@FormRuleProperty({
		required: false,
		name: 'isRequired',
		error: '必填',
		desc: '必填',
		type: 'boolean',
	})
	isRequired: IBaseFormFields<boolean> = {
		value: false,
		submitBeforeTransform: (value) => {
			return value ? value : false
		},
	}
	@FormRuleProperty({
		required: false,
		name: 'validationRuleReg',
		error: '验证规则',
		desc: '验证规则',
		type: 'object',
	})
	validationRuleReg: IBaseFormFields<HlLabeledValue> = {
		value: void 0,
		submitBeforeTransform: (value) => {
			return value?value.key:''
		},
	}
	@FormRuleProperty({
		required: false,
		name: 'eventList',
		error: '添加事件',
		desc: '添加事件',
		type: 'object',
	})
	eventList: IBaseFormFields<HlLabeledValue> = {
		value: void 0,
		submitBeforeTransform: (value) => {
			return value ? value.key:''
		},
	}
	@FormRuleProperty({
		required: false,
		name: 'visibleProperty',
		error: '可见',
		desc: '默认可见',
		type: 'boolean',
	})
	visibleProperty: IBaseFormFields<boolean> = {
		value: true,
		submitBeforeTransform: (value) => {
			return value ? value : false
		},
	}
	@FormRuleProperty({
		required:false,
		name:'format',
		error:'日期显示格式',
		desc:'日期显示格式',
		type:'string',
	})
	format:IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value.toString()
		},
	}
	@FormRuleProperty({
		required:false,
		name:'showTime',
		error:'选择时间功能',
		desc:'选择时间功能',
		type:'boolean',
	})
	showTime:IBaseFormFields<boolean> = {
		value: false,
		submitBeforeTransform: (value) => {
			return value ? value : false
		},
	}
	@FormRuleProperty({
		required: false,
		name: 'placeholderProperty',
		error: '占位提示',
		desc: '占位提示',
		type: 'string',
	})
	placeholderProperty: IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value ? value : ''
		},
	}
	@FormRuleProperty({
		required: false,
		name: 'selectModelProperty',
		error: '选择模式',
		desc: '选择模式',
		type: 'string',
	})
	selectModelProperty:IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value.toString()
		},
    };
	@FormRuleProperty({
		required: false,
		name: 'uploadIsDragger',
		error: '拖拽上传',
		desc: '拖拽上传',
		type: 'boolean',
	})
	uploadIsDragger:IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value ? value : false
		},
    };
	@FormRuleProperty({
		required: false,
		name: 'uploadMultiple',
		error: '多选文件',
		desc: '多选文件',
		type: 'boolean',
	})
	uploadMultiple:IBaseFormFields<boolean> = {
		value: false,
		submitBeforeTransform: (value) => {
			return value ? value : false
		},
    };
	@FormRuleProperty({
		required: false,
		name: 'uploadShowFileList',
		error: '展示文件',
		desc: '展示文件',
		type: 'boolean',
	})
	uploadShowFileList:IBaseFormFields<boolean> = {
		value: false,
		submitBeforeTransform: (value) => {
			return value ? value : false
		},
    };
	@FormRuleProperty({
		required: false,
		name: 'uploadmaxFileCount',
		error: '展示文件',
		desc: '展示文件',
		type: 'string',
	})
	uploadmaxFileCount:IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value ? value : ''
		},
    };
	@FormRuleProperty({
		required: false,
		name: 'uploadshowFileListGroup',
		error: '每行文件数',
		desc: '每行文件数',
		type: 'string',
	})
	uploadshowFileListGroup:IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value ? value : ''
		},
    };
	@FormRuleProperty({
		required: true,
		name: 'uploadParams',
		error: '上传文件参数',
		desc: '上传文件参数',
		type: 'string',
	})
	uploadParams:IBaseFormFields<string> = {
		value: '',
		submitBeforeTransform: (value) => {
			return value ? value : ''
		},
    };
	@FormRuleProperty({
		required: true,
		name: 'uploadDataTransform',
		error: '数据转换',
		desc: '数据转换',
		type: 'string',
	})
	uploadDataTransform:IBaseFormFields<string> = {
		value: void 0,
		submitBeforeTransform: (value) => {
			return value ? value : ''
		},
	};
	@FormRuleProperty({
		required: false,
		name: 'uploadaccept',
		error: '允许文件类型',
		desc: '允许文件类型',
		type: 'array',
	})
	uploadaccept: IBaseFormFields<string[]> = {
		value: void 0,
		submitBeforeTransform: (value) => {
			return value
		},
	}
	
	@FormRuleProperty({
		required: false,
		name: 'disabledDate',
		error: '不可选择日期',
		desc: '不可选择日期',
		type: 'string',
	})
	disabledDate:IBaseFormFields<string> = {
		value: void 0,
		submitBeforeTransform: (value) => {
			return value ? value : ''
		},
	};
	@FormRuleProperty({
        required: false,
        name: 'radioOptionsValue',
        error: '单选组合项',
        desc: '单选组合项',
        type: 'object',
    })
    radioOptionsValue: IBaseFormFields<HlLabeledValue> = {
        value: void 0,
        requestParamKey: 'radioOptionsValue',
        submitBeforeTransform: (value) => {
            return value?value.key:''
        },
    }
	/** 下拉选项值结果  表单扩展数据，不参与双向绑定 */
	selectValue: IBaseFormFields<HlLabeledValue[]> = {
		value: void 0,
	}
	constructor(form?: PropertyFormElementFormFields) {
		super()
		PropertyFormElementFormFields.initMapPropsToFields.call(this, form)
	}
}
export class  PropertyFormElementFormFieldsRule<
    P = { that: FormProerty;store:ProjectStore} 
    > extends PropertyFormElementFormFields {
    constructor(props: P) {
        super()
        createFormRule(PropertyFormElementFormFields,this,{props})
    }
}