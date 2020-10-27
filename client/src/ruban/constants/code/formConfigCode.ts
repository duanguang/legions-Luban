/**  */
export const DATE_DISABLED_DATE_FUNC_CODE = 
`
/** 不可选择的日期 
 * 示例：
 const nowD = 86400000
 const nextDate = Date.now()- nowD
 return current && current.valueOf() > nextDate;
 * 日期组件*/
function disabledDate(currentDate){
    //@param {*} currentDate:moment
    // 返回布尔类型 
    return true;
}
`
/** 上传组件数据转换函数代码 */
export const UPLOAD_TRANFORM_FUNC_CODE = 
`
/** 上传组件数据转换函数,原则上无需修改*/
function dataTransform(info){
    return {
        file: info.file,
        fileList: info.fileList.map((item) => {
            const url = item.response && item.response.success
            && item.response.data[0].url || item.url
            return {
                ...item,
                url,
            }
        }),
    }
}
`
/** 上传组件上传接口条件参数 */
export const UPLOAD_PARAMS_EXPRESSION = 
`
/** 上传接口条件信息,请勿修改对象结构    */
//@project {'4pl'|'scm'|'jabil'|'lcm'|'scp'} 系统简称，必须是以下选项，4pl, scm, jabil, lcm, scp等，该属性决定文件将保存到哪个模块下
//@module {*} 随意填写,自行定义
return {project: '4pl', module: 'test'}
`
/** input 组件后缀元素 */
export const INPUT_ADDON_AFTER_BUTTON = 
`
(<Button onClick={()=>{
    // 单击事件行为
}}>{''}</Button>)
`
export const FormElementvalidatorCode = 
`function validator(value,error,callback,props){ 
    /** 请勿修改函数名称及参数信息**/
}
`
/** 上传组件验证规则 */
export const FORM_ELEMENT_UPLOAD_VALIDATOR_CODE = 
`function validator(value,error,callback,props){ 
    /** 请勿修改函数名称及参数信息**/
    //@param {*} value:UploadChangeParam
    if (value && value.fileList.length === 0) {
        callBack('附件不能为空')
    }
    callBack()
}
`

export const FormElementvalidatorRegCode = 
`/** 填写正则表达式，示例手机号: /^\d{3}-\d{8}|\d{4}-\d{7,8}$/    */
/^\d{3}-\d{8}|\d{4}-\d{7,8}$/
`
/** 上传文件改变时的状态事件 */
export const UPLOADCHANGEEVENT = `
function onChange(value){
    // upload 上传文件改变时的状态
    //@param {*} value 选中的值
}
`
/** 开关组件改变时的状态事件 */
export const SWITCHCHANGEEVENT = `
function onChange(value){
    // switch 变化时回调函数
    //@param {*} value:Boolean 选中的值
}
`
/** 开关组件改变时的状态事件 */
export const RADIO_BUTTON_CHCHANGEEVENT = `
function onChange(value){
    // radioButton 变化时回调函数
    //@param {*} value:Event 选中的值
}
`
/** 下拉框数据发生变化事件 */
export const SELECTCHANGEEVENT = `
function onChange(value){
    //Select发生改变时触发的回调
    //@param {*} value 选中的值
}
`
/** 下拉框获取焦点事件 */
export const SELECTFOCUSEVENT = `
function onFocus(value){
    //焦点事件
}
`
/** 下拉框失去焦点事件 */
export const SELECTBLUREVENT = `
function onBlur(value){
    //失去焦点事件
}
`
/** ==========日期=============== */
/** 日期数据发生变化事件 */
export const DATE_CHANGEEVENT = `
function onChange(date,dateString){
    //DatePicker发生改变时触发的回调
    //@param {*} date:moment
    //@param {*} dateString:string
}
`
/** 日期数获取焦点事件 */
export const DATE_FOCUSEVENT = `
function onFocus(value){
    //焦点事件
}
`
/**日期数失去焦点事件 */
export const DATE_BLUREVENT = `
function onBlur(value){
    //失去焦点事件
}
`
/** ==========日期=============== */


/** ==========日期范围=============== */
/** 日期范围数据发生变化事件 */
export const RANGE_PICKER_CHANGEEVENT = `
function onChange(date,dateString){
    //RangePicker发生改变时触发的回调
    //@param {*} date: moment, moment
    //@param {*} dateString:string,string
}
`
/** 日期范围数获取焦点事件 */
export const RANGE_PICKER_FOCUSEVENT = `
function onFocus(value){
    //焦点事件
}
`
/**日期范围数失去焦点事件 */
export const RANGE_PICKER_BLUREVENT = `
function onBlur(value){
    //失去焦点事件
}
`
/** ==========文本框=============== */
/** 文本框数据发生变化事件 */
export const INPUTCHANGEEVENT = `
function onChange(value){
    //文本框发生改变时触发的回调
    //@param {*} value 输入的值
}
`
/** 文本框获取焦点事件 */
export const INPUTFOCUSEVENT = `
function onFocus(value){

}
`
/** 文本框失去焦点事件 */
export const INPUTBLUREVENT = `
function onBlur(value){

}
`
/** ===========单选组合============= */
/** 单选组合数据发生变化事件 */
export const RADIO_CHANGEEVENT = `
function onChange(e){
    //单选组件发生改变时触发的回调
    //@param {*} e Event
}
`
/** 下拉接口请求托管 权限令牌 */
export const FORMSELECTTOKEN =
`
function token(){
    /** 权限字符串自行输入*/
    return 'token'
}
`
/** 下拉接口请求托管 查询条件函数 */
export const FORMSELECTPRAMS =
`
function params(pageIndex, pagesize, keywords){
    /** keywords 根据接口查询条件来确定*/
    return {
        pageIndex,
        pageSize: pagesize,
        keywords: keywords,
    }
}
`
/* 下拉接口请求托管 数据转换函数 **/
export const FORMSELECTTRANSFORM = `
function transform(value: observablePromise.PramsResult<{}>){
    let arr = value.value ? value.value['result'] : [];
    return {
        data: arr.map((item) => {
            return {
                key: item.labelKey,
                value: item.labelValue,
                label:item.labelValue,
            }
        }),
        total: value.value ? value.value['result'].total : 0,
    }
}
`
/** 表单下拉自动托管查询接口model */
export const FORMSELECTMODEL = 
`
import { JsonProperty } from 'json-mapper-object';
import {HlLabeledValue} from 'hoolinks-legion-design/lib/models/HlLabeledValue'
import {BaseEntity} from './common/baseEntity';
interface IBaseEntity<T> {
    msg: string,
    ok: boolean,
    code: string,
    data: T,
}
/** 请重新填写类名称， 
 * 此类对应到接口接口list item项
 * 及补充接口字段数据*/
class SelectOptionsDataEntity {
    @JsonProperty('labelKey')
    labelKey = '';
    @JsonProperty('labelValue')
    labelValue = '';

}
/** 请重新填写类名称， 
 * 此类对应到接口结构
 * 及补充接口字段数据*/
class SelectOptionsListEntity {
    @JsonProperty({ clazz: SelectOptionsDataEntity, name: 'rows' })
    data: SelectOptionsDataEntity[] = [];


    @JsonProperty('total')
    total = 0;

    get options():HlLabeledValue[] {
        const resData = this.data || [];
        return resData && resData.map((item) => {
            return {
                key: item.labelKey,
                value: item.labelValue,
                label:item.labelValue,
            }
        })

    }
}
/** 请重新填写类名称， 
 * 此类是前端使用的数据模型层*/
export class SelectOptionsContainer extends BaseEntity<SelectOptionsListEntity> {
    constructor(fromJson: IBaseEntity<SelectOptionsListEntity>) {
        super()
        this.code = fromJson.code;
        this.message = fromJson.msg;
        this.success = fromJson.ok;
        if (fromJson) {
            this.result = super.transformRow(fromJson, SelectOptionsListEntity)
        }
    }
}
`
/** 表单model 实体类代码 */
export const FORM_FORM_FIELDS_MODEL =
`
import { IBaseFormFields,BaseFormFields} from 'hoolinks-legion-design/lib/models/BaseFormFields';
import { createFormRule, FormRuleProperty } from 'hoolinks/form-rule';
import { HlLabeledValue } from 'hoolinks-legion-design/lib/models/HlLabeledValue';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import moment from 'moment';
import 'moment/locale/zh-cn';
export class PropertyColumnsConfigFormFields extends BaseFormFields {
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
`
export const FORM_COMPONENT_INSTANCE = 
`
import React from 'react';
import {
    HLFormContainer,
    HLModal,
    HLTable,
    OpenConfirm,
} from 'hoolinks-legion-design';
import {
    Row,
    Icon,
    Dropdown,
    Menu,
    message,
    Button,
} from 'antd';
import { InstanceForm,InstanceModal,InstanceHlTable,IGroup } from 'hoolinks-legion-design/lib/typings/components';
import { bind,observer } from 'legions/store-react';
import { WrappedFormUtils } from 'hoolinks-legion-design/lib/typings/antd';
import { shortHash } from 'hoolinks-legion-design/lib/utils/utils';
import classNames from 'classnames';
import { observable,action,computed,runInAction } from 'mobx';
import { observablePromise } from 'legions/store-utils';
import moment from 'moment';
import { HLFormUtils } from 'hoolinks-legion-design/lib/utils/config-utils';
import { HlLabeledValue } from 'hoolinks-legion-design/lib/models/HlLabeledValue';
interface IProps {
}
class ViewModel {
    /** 测试属性*/
    @observable id: string = ''
}
@observer
export default class FormComponent extends Component<IProps,{}> {
    formInstanceRef: InstanceForm = null;
    viewModel = observableViewModel<ViewModel>(new ViewModel());
    constructor(props: IProps) {
        super(props)
        this.state = {
        }
    }
    createRulesInstance<T>(func: ClassOf<T>,structparame?:Object):IFormRules<T>{
        // @ts-ignore
        const rules = func.createFormRules<func>(func,structparame);
        return rules;
    }
    /** 设置默认需要禁用表单选项*/
    settingDefaultDisabled(name:string[]){
        if(Array.isArray(name)){
            name.map((item)=>{
                 this.formInstanceRef.viewModel.setFormState(item,{
                     disabled:true,
                 })
            })
        }
     }
    /** 设置默认需要隐藏的表单选项*/
    settingDefaultVisible(name:string[]){
       if(Array.isArray(name)){
           name.map((item)=>{
                this.formInstanceRef.viewModel.setFormState(item,{
                    visible:true,
                })
           })
       }
    }
    createGroupConfig(){
        const group = [];
        return group;
    }
    createFormConfig(){
        const formUtils = new HLFormUtils();
        const rules = this.createRulesInstance<PropertyFormElementFormFieldsRule>(PropertyFormElementFormFieldsRule);
    }
    render(){
        return null
    }
}
`
/** 表单组件JSX */
export const FORM_HL_FORM_CONTAINER_INSTANCE = 
`
<HLFormContainer
       
        {...this.formInstanceRef && this.formInstanceRef.viewModel.InputDataModel}
        InputDataModel={PropertyFormGroupGlobalFormFields}
        mapPropsToFields={(props) => {
            return new PropertyFormGroupGlobalFormFields(props) // 实际处理结果实体
        }}
        onFieldsChange={(props,formFields:PropertyFormGroupGlobalFormFields) => {
            this.formInstanceRef.store.updateFormInputData(this.formInstanceRef.uid,formFields,this)
        }}
        onGetForm={(form,ref) => {
            this.formInstanceRef = {...ref, that: this };
            this.settingDefaultVisible([]);
            this.settingDefaultDisabled([]);
        }}
        colCount={1}
        controls={this.createFormConfig()}
    ></HLFormContainer>
`

