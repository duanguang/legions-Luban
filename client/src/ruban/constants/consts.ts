import { SELECTBLUREVENT, SELECTFOCUSEVENT, SELECTCHANGEEVENT,INPUTCHANGEEVENT,INPUTFOCUSEVENT, INPUTBLUREVENT, DATE_BLUREVENT, DATE_FOCUSEVENT, DATE_CHANGEEVENT, RANGE_PICKER_CHANGEEVENT, RANGE_PICKER_FOCUSEVENT, RANGE_PICKER_BLUREVENT, RADIO_BUTTON_CHCHANGEEVENT, SWITCHCHANGEEVENT, UPLOADCHANGEEVENT} from "./code/formConfigCode"

export const OPREATION_VIEW = { 'export': { name: '导出',icon: 'bars',type: 'primary' },import: { name: '导入',icon: 'export',type: 'primary' },enabled: { name: '启用',icon: 'unlock',type: 'primary' },disable: { name: '禁用',icon: 'lock',type: 'primary' },delete: { name: '删除',icon: 'delete',type: 'danger' },openCustomColumns: { name: '自定义列',icon: '',type: 'primary' } }
/** 写入表单配置数据信息 */
export const I_FORM_PROPS = [{ text: 'iFormInput' },
    { select: 'iFormWithSelect' },{ date: 'iFormDatePicker' },
    { month: 'iFormMonthPicker' },{ daterange: 'iFormRangePicker' },
{ radioButton: 'iFormWithRadioButton' },{ radio: 'iFormWithRadioButton' },{ switch: 'iFormWithSwitch' },{ upload: 'iFormWithUpload' }]

export const validationRuleReg = [{
    key: '1',
    value: '手机号',
    label: '手机号',
    keyValue: 
`
/** 填写正则表达式，示例手机号: /^\d{3}-\d{8}|\d{4}-\d{7,8}$/    */
/^\d{3}-\d{8}|\d{4}-\d{7,8}$/
`,
},{
    key: '2',
    value: '自定义正则表达式',
    label: '自定义正则表达式',
    keyValue: '',
},{
    key: '3',
    value: '自定义验证',
    label: '自定义验证',
    keyValue: '',
},
]
/** 表单类型属性名称 */
export const FORM_PROPS = I_FORM_PROPS.reduce((pre,curr) => {
    return {...pre,...curr}
},{})

export const SELECTOPTIONSVALUE = [
    { key: '1',value: '数组List',label: '数组List' },
    { key: '2',value: '表达式Expression',label: '表达式Expression',disabled:true},
    { key: '3',value: '配置接口',label: '配置接口' }]
export const EVENTDATA = {
    'text': [
        { key: '1',value: 'onChange',label: 'onChange',keyValue:INPUTCHANGEEVENT },
        { key: '2',value: 'onFocus',label: 'onFocus',keyValue:INPUTFOCUSEVENT },
        { key: '3',value: 'onBlur',label: 'onBlur',keyValue:INPUTBLUREVENT },
    ],
    'select': [
        { key: '1',value: 'onChange',label: 'onChange',keyValue:SELECTCHANGEEVENT  },
        { key: '2',value: 'onFocus',label: 'onFocus' ,keyValue:SELECTFOCUSEVENT},
        { key: '3',value: 'onBlur',label: 'onBlur',keyValue:SELECTBLUREVENT },
    ],
    'date': [
        { key: '1',value: 'onChange',label: 'onChange',keyValue:DATE_CHANGEEVENT  },
        { key: '2',value: 'onFocus',label: 'onFocus' ,keyValue:DATE_FOCUSEVENT},
        { key: '3',value: 'onBlur',label: 'onBlur',keyValue:DATE_BLUREVENT },
    ],
    'daterange': [
        { key: '1',value: 'onChange',label: 'onChange',keyValue:RANGE_PICKER_CHANGEEVENT  },
        { key: '2',value: 'onFocus',label: 'onFocus' ,keyValue:RANGE_PICKER_FOCUSEVENT},
        { key: '3',value: 'onBlur',label: 'onBlur',keyValue:RANGE_PICKER_BLUREVENT },
    ],
    'upload': [
        { key: '1',value: 'onChange',label: 'onChange',keyValue:UPLOADCHANGEEVENT  },
    ],
    'switch': [
        { key: '1',value: 'onChange',label: 'onChange',keyValue:SWITCHCHANGEEVENT  },
    ],
    'radioButton': [
        { key: '1',value: 'onChange',label: 'onChange',keyValue:RADIO_BUTTON_CHCHANGEEVENT  },
    ],
    'radio': [
        { key: '1',value: 'onChange',label: 'onChange',keyValue:RADIO_BUTTON_CHCHANGEEVENT  },
    ],
}
const COMMONSUBMITPROPERTY = ['name','labelName','labelSpan','elementSpan','containerSpan','subGroup',
'isDisabled','isRequired','visibleProperty','placeholderProperty']
const COMMONPROPERTY = ['onChange','onFocus','onBlur','validationRuleReg']
/** 表单组件元素 确认保存时需要同步数据属性以及在修改时需要回填的属性信息 */
export const FORMSUBMITPROPERTY = {
    text: [...COMMONSUBMITPROPERTY,'inputType','maxLength'],
    select: [...COMMONSUBMITPROPERTY,'selectOptionsValue','selectOptions','selectModelProperty'],
    switch:[...COMMONSUBMITPROPERTY],
    upload: [...COMMONSUBMITPROPERTY,'uploadParams','uploadDataTransform',
        'uploadshowFileListGroup','uploadmaxFileCount','uploadaccept',
        'uploadShowFileList','uploadMultiple','uploadIsDragger'],
    radioButton:[...COMMONSUBMITPROPERTY,'selectOptionsValue','selectOptions'],
    radio:[...COMMONSUBMITPROPERTY,'selectOptionsValue','selectOptions'],
    date: [...COMMONSUBMITPROPERTY,'format','disabledDate'],
    daterange:[...COMMONSUBMITPROPERTY,'format','disabledDate']
}
/** 组件在AST时需要的数据信息 */    
export const FORM_PROPERTY_AST = {
    text: [...FORMSUBMITPROPERTY.text,'inputAddonAfter'],
    select: [...FORMSUBMITPROPERTY.select],
    switch:[...FORMSUBMITPROPERTY.switch],
    upload: [...FORMSUBMITPROPERTY.upload],
    date: [...FORMSUBMITPROPERTY.date],
    radioButton: [...FORMSUBMITPROPERTY.radioButton],
    radio: [...FORMSUBMITPROPERTY.radio],
    daterange:[...FORMSUBMITPROPERTY.daterange]
}