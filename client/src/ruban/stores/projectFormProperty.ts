import StoreBase, { IStoreBaseMeta } from '../../common/stores/StoreBase';
import {observable,autorun,action, computed,ObservableMap,isObservableArray} from 'mobx';
import { observablePromise,ObservableTempState,observableViewModel } from 'legions/store-utils';
import { ViewModel } from 'brain-store-utils';
/* import UserInfoStore, { User } from './UserInfoStore'; */
import { ProjectFormFields } from '../models/form/projectFormFields';
import UiStoreBase from '../../common/stores/ui/UiStoreBase';
import { ComponentViewResource, IResourceEvent, ITriggerEventPrams } from './even/resourceEvent';
import { InstanceModal,IQuery,InstanceHlTable, InstanceForm, IGroup } from 'hoolinks-legion-design/lib/typings/components';
import { LabelWithInputModel, LabelWithHLSelectModel, LabelWithDatePickerModel, LabelWithRangePickerModel, LabelWithRadioButtonModel, LabelWithUploadModel, LabelWithSwitchModel } from 'hoolinks-legion-design/lib/models/HLForm';
import { I_FORM_PROPS } from '../constants/consts';
import { PropertyInputVModel } from '../models/propertyVModel';
import { MapperEntity } from 'json-mapper-object';
import { PropertyFormElementFormFields } from '../models/form/propertyFormElement';
import get from 'lodash/get'
import set from 'lodash/set'
import  has  from 'lodash/has'
// tslint:disable-next-line: no-empty-interface
import { message } from 'antd';
import { IAntdRule } from 'hoolinks-legion-design/lib/typings/antd';
import '../../main/assets/css/index.less';
import { PropertyKeyValueFormFields } from '../models/form/propertyFormModel';
interface IContext{ }
/** 组件类型 */
export type ComponentType = 'text' | 'select' | 'radioButton' | 'date' | 'daterange'|'upload'|'switch'|'radio'
const FORM_PROPS = I_FORM_PROPS.reduce((pre,curr) => {
    return {...pre,...curr}
},{})
interface IEditComponentData{
    /** 组件类型 比如文本框，下拉，日期等组件类型 */
    type: ComponentType,
    /** 组件唯一key值，系统自动生成，无法更改 */
    keys: string;
    property: string;
    propertyType?:IPropertyValue['type']
}
interface ICode{
    /** 组件元素单个属性数据key,对应属性表单设置的组件元素name值 */
    key: string;
    value: string;
    /** 代码类型 表达式,函数, 特殊托管函数对象配置*/
    type: IPropertyValue['type'],
    /** 可执行代码字符串对象 */
    execast?: Object
}

export interface ICompoentData{
    /** 组件配置 */
    config: FormElementViewModel['config'],
    /** 组件类型 比如文本框，下拉，日期等组件类型 */
    type: ComponentType,
}
export interface IPropertyValue{
    /** 组件元素单个属性数据key,对应属性表单设置的组件元素name值 */
    key: string;
    value?: Object | string | number | boolean;
     /** 代码类型 表达式,函数, 特殊托管函数对象配置*/
    type: 'expression' | 'function'|'autoQuery'|'normal';
    /** 可执行代码字符串对象 */
    execast?: Object
    /** 所属父级元素key */
    parent?:string
}
export interface IPropertyData{
        /** 当前节点属性设置类型*/ 
   /*  currElementPropertys: Partial<Pick<ICode,'key' | 'type'>>[]; */
    /** 渲染元素信息集合 */
    renderElements: Partial<Pick<ICode,'key'> & { isRender: boolean }>[];
    /** 表单组件属性设置数据结果集合 */
    propertyValue: IPropertyValue[];
    /** 表单临时数据存储区 */
    propertyValueTemp: IPropertyValue[];
}
class FormViewModel {
    /** 表单分组列表信息 */
    @observable group: IGroup[] =observable.array([]);
    /** 表单布局方式，单列，两列，三列，四列 */
    @observable layout: number = 1;
    /** 表单尺寸 正常，迷你，紧凑 */
    @observable size: 'default' | 'small' | 'table' = 'default'
    /** 当前正在编辑的组件类型属性 */
    @observable editComponentData: IEditComponentData = { type: null,keys: '',property:'' };
    /** 当前编辑器代码字符 */
    @observable codeValue = ''

    @observable codeEditorprop = {
        readOnly: false,
    }
    /**当前编辑器代码字符转成可执行代码 */
    @observable execcodeast: object = null;
    /** 组件元素配置数据集 */
    @observable propertyData = observable.map<string,IPropertyData>();
    /** 组件配置数据 */
    @observable compoentData = observable.map<string,ICompoentData>();

    /** 添加下拉选项组件UI数据 */
    @observable selectValueData: { id: string,labelKey: string; labelValue: string; label?: string }[] = []

    /** 事件数据Table组件展示 外部请勿直接改变数据 */
    @observable eventData: { event: string;value:string}[]

    /** 更新组件事件数据 用于事件数据Table组件展示 */
    @action updateEventData() {
        const data = [];
        ['onChange','onFocus','onBlur'].map((item) => {
            const value = this.getPropertyDataValue(item)
            if (value) {
                data.push({event:item,value})
            }
        })
        this.eventData = data;
        console.log(this.eventData,'this.eventData')
    }
    @action deleteEvent(key: string) {
        const items = this.propertyData.get(this.editComponentData.keys)
        const index= items.propertyValue.findIndex((e)=>e.key===key)
        if (index>-1) {
            items.propertyValue.splice(index,1);
        }
    }
    /** 清空Table组件展示的事件数据 */
    @action clearEventData() {
        this.eventData = [];
    }
    /**
     * 添加组件元素配置信息数据
     *
     * @param {string} key 组件唯一key 生成规则组件类型+时间戳 生成唯一hash
     * @param {ComponentType} type 组件类型
     * @param {string} label 组件label值
     * @param {FormElementViewModel['config']} config 表单子元素配置信息
     * @memberof FormViewModel
     */
    @action setCompoentData(key: string,type: ComponentType,label:string,config: FormElementViewModel['config']) {
        let item: FormElementViewModel['config'] = config;
        if (this.compoentData.has(key)) {
            item = this.compoentData.get(key).config;
        }
        const formProps = {};
        formProps[FORM_PROPS[type]]={...item[FORM_PROPS[type]],label}
        this.compoentData.set(key,{
            // @ts-ignore
            config: {
                iAntdProps: item.iAntdProps,
                ...formProps,
                rules: item.rules,
            },
            type,
        })
    }
    /** 获取相应属性节点临时变量值 */
    @action getPropertyValueTemp(property: string,propertyType:IPropertyValue['type']){
        const codes = this.propertyData.get(this.editComponentData.keys)
        if (codes) {
            const item = codes.propertyValueTemp.find((item) => item.key === property&&item.type===propertyType);
            return item;
        }
        return null
    }
    @action updatePropertyValueTemp(options:{
        value: string,execast?: Object;
        propertyType: IPropertyValue['type'];
        /** 组件元素单个属性数据key,对应属性表单设置的组件元素name值 */
        property: string;
        parent?:string
    }) {
        const codes = this.propertyData.get(this.editComponentData.keys)
        if (codes) {
            const index = codes.propertyValueTemp.findIndex((item) => item.key === options.property&&item.type===options.propertyType);
            if (index < 0) {
                codes.propertyValueTemp.push({
                    key: options.property,value:options.value,type: options.propertyType,
                    parent: get(options,'parent') || null,})
            } else {
                codes.propertyValueTemp[index].value = options.value;
                codes.propertyValueTemp[index]['parent'] = get(options,'parent');
                codes.propertyValueTemp[index].type = options.propertyType;
            }
        }
    }
     /** 获取相应属性节点变量值 */
     @action getPropertyValue(property: string){
        const codes = this.propertyData.get(this.editComponentData.keys)
        if (codes) {
            const item = codes.propertyValue.find((item) => item.key === property);
            return item;
        }
        return null
    }
    @action updatePropertyValue(options: {
        value?: Object | number | boolean | string;
        propertyType: IPropertyValue['type'];
        /** 组件元素单个属性数据key,对应属性表单设置的组件元素name值 */
        property: string;
        /** 可执行代码字符串对象 */
        execast?: Object;
         /** 所属父级元素key */
        parent?:string
    }) {
        const codes = this.propertyData.get(this.editComponentData.keys)
        if (codes) {
            const index = codes.propertyValue.findIndex((item) => item.key === options.property);
            if (index < 0) {
                codes.propertyValue.push({
                    key: options.property,type: options.propertyType,
                    value: get(options,'value',void 0),
                    execast: options.execast || null,
                    parent: options.parent || null,
                })
            } else {
                codes.propertyValue[index].type = options.propertyType;
                codes.propertyValue[index].value = get(options,'value',void 0);
                codes.propertyValue[index].execast = options.execast||null;
                codes.propertyValue[index].parent = options.parent||null;
            }
        }
    }
    /** 查询PropertyData指定属性数据对象  */
    @action getPropertyDataValue(key: string) {
        const items = this.propertyData.get(this.editComponentData.keys)
        return items.propertyValue.find((e)=>e.key===key)
    }
}
class FormElementViewModel {
    @observable.ref config: LabelWithInputModel | LabelWithHLSelectModel |
        LabelWithDatePickerModel | LabelWithRangePickerModel | LabelWithRadioButtonModel|LabelWithUploadModel|LabelWithSwitchModel = null;
    @observable label = ''
    @observable type: ComponentType = null;
}
type Proxify<T> = {
    [P in keyof T]:T[P]
}
export type IFormElement = ObservableMap<string,ViewModel<FormElementViewModel>& Proxify<FormElementViewModel>>
export default class ProjectFormPropertyStore extends UiStoreBase<IContext>{
    static meta :IStoreBaseMeta={
        ...StoreBase.meta,
        className:'ProjectFormPropertyStore',
        eventScopes: [],
        contextTypes:{
            
        },
    }
    @observable formElement = observable.map<string,ViewModel<FormElementViewModel> & Proxify<FormElementViewModel>>();
    @observable formDraggerModel = {}
    /** 表单组件属性数据 */
    formPropertyViewModel = observableViewModel<FormViewModel>(new FormViewModel());
    /** 拖拽区域表单组件实例 */
    formPropertyDraggerRef: InstanceForm = null;
    /** 表单属性设置侧边栏模态框实例 */
    formPropertyModalRef: InstanceModal = null;
    /** 表单元素属性组件实例 */
    formProperyElementRef: InstanceForm = null;
    /** 表单属性组件实例 */
    formComponentProperyRef: InstanceForm = null;
    /** 下拉选项值设置模态框实例 */
    formSelectValueModalRef: InstanceModal = null;
    /** 代码编辑器模态框实例 */
    formPropertyCodeEditModalRef: InstanceModal = null;
    /** 下拉选项值设置表单组件实例 */
    formAddSelectValueRef: InstanceForm = null;
    /** 下拉选项Table组件实例 */
    formAddSelectValueTableRef: InstanceHlTable = null;

     /** 添加事件编辑代码表达式模态框实例 */
     formAddEventCodeExpressionModalRef: InstanceModal = null;
     /** 添加下拉选项编辑代码表达式模态框实例 */
    formAddKeyValueCodeExpressionModalRef: InstanceModal = null;
    /** 添加事件展示列表数据Table 组件实例 */
    formAddEventListTableRef: InstanceHlTable = null;
    /** 添加事件展示列表数据Table模态框 组件实例 */
    formAddEventListTableModalRef: InstanceModal = null;
    /** Dragger 表单元素配置项信息  */
    /* @computed get computedFormElement() {
       return this.formElement;
    } */
    hasIAntdName(name:string) {
        const keys = this.formElement.keys();
        let reulst = false;
        for (let key of keys) {
            const entity = this.formElement.get(key);
            if (entity.config.iAntdProps.name === name&&this.formPropertyViewModel.editComponentData.keys!==key) {
                reulst = true;
                break;
            }
        }
        return reulst;
    }
    /** 更新IAntdProps 对象信息*/
    updateIAntdProps(formFields: PropertyFormElementFormFields) {
        const iAntdProps = {}
        let nameValue = get(formFields,'nameSubmit.value')
        if (has(formFields,'containerSpan')) {
            iAntdProps['span']=get(formFields,'containerSpan.value')?Number(get(formFields,'containerSpan.value')):''
        }
        if (has(formFields,'nameSubmit')) {
            iAntdProps['name'] = nameValue;
            iAntdProps['id'] = nameValue;
        }
        has(formFields,'subGroup')&&(iAntdProps['groupId'] = Number(get(formFields,'subGroup.value')||1))
        has(formFields,'placeholderProperty')&&(iAntdProps['placeholder'] = get(formFields,'placeholderProperty.value'))
        return iAntdProps
    }
    /** 更新组件元素公共信息部分数据 */
    updateCommonElementProps(formFields: PropertyFormElementFormFields,keys:string) {
        const iformProps = {}
        const item = this.formElement.get(keys);
        has(formFields,'maxLength')&&(iformProps['maxLength']=get(formFields,'maxLength.value'))
        has(formFields,'labelSpan') && (iformProps['labelCol'] = { span: Number(get(formFields,'labelSpan.value')) })
        has(formFields,'elementSpan') && (iformProps['wrapperCol'] = { span: Number(get(formFields,'elementSpan.value')) })
        if (has(formFields,'labelName')) {
            if (!get(formFields,'labelName.value')) {// 如果名称为空,则拉取源数据进行填充
                message.warning('label名称不能为空')
                iformProps['label'] = get(item,'_defaultModel.label')
                set(formFields,'labelName.value',get(item,'_defaultModel.label'))
                this.formProperyElementRef.store.updateFormInputData(this.formProperyElementRef.uid,formFields,this.formProperyElementRef.that)
            } else {
                iformProps['label'] = get(formFields,'labelName.value')
            }
        }
        return iformProps
    }
    /** 更新Input 输入配置数据信息 */
    updateInputElementProps(formFields: PropertyFormElementFormFields,keys: string) {
        const inputPorps = {}
        const isDisabled = get(formFields,'isDisabled.value')
        has(formFields,'inputType') && (inputPorps['type'] = get(formFields,'inputType.value'))
        typeof isDisabled === 'boolean' && (inputPorps['disabled'] = get(formFields,'isDisabled.value'))
        return inputPorps;
    }
    updateSelectElementProps(formFields: PropertyFormElementFormFields,keys: string) {
        const selectPorps = {}
        const options = get(formFields,'selectValue.value')
        const selectModel = get(formFields,'selectModelProperty.value')
        has(formFields,'selectValue') && (selectPorps['options'] = options || [])
        if (has(formFields,'selectModelProperty') && selectModel === 'multiple') {
            selectPorps['model'] = selectModel
        }
        return selectPorps
    }
    updateUploadElementProps(formFields: PropertyFormElementFormFields,keys: string) {
        const uploadPorps = {}
        const uploadIsDragger = get(formFields,'uploadIsDragger.value')
        const uploadMultiple = get(formFields,'uploadMultiple.value')
        const uploadShowFileList = get(formFields,'uploadShowFileList.value')
        const uploadmaxFileCount = get(formFields,'uploadmaxFileCount.value')
        const uploadshowFileListGroup = get(formFields,'uploadshowFileListGroup.value')
        if (has(formFields,'uploadIsDragger') && uploadIsDragger === true) {
            uploadPorps['isDragger'] = uploadIsDragger
        }
        if (has(formFields,'uploadMultiple') && uploadMultiple === true) {
            uploadPorps['multiple'] = uploadMultiple
        }
        if (has(formFields,'uploadShowFileList') && uploadShowFileList === true) {
            uploadPorps['showFileList'] = uploadShowFileList
        }
        if (has(formFields,'uploadmaxFileCount') && uploadmaxFileCount) {
            uploadPorps['maxFileCount'] = Number(uploadmaxFileCount)
        }
        if (has(formFields,'uploadshowFileListGroup') && uploadshowFileListGroup) {
            uploadPorps['showFileListGroup'] = Number(uploadshowFileListGroup)
        }
        return uploadPorps
    }
    /** 更新日期组件输入配置数据信息 */
    updateDateElementProps(formFields: PropertyFormElementFormFields,keys: string){
        const dateProps = {}
        has(formFields,'format') && (dateProps['format'] = get(formFields,'format.value'))
        has(formFields,'showTime') && (dateProps['showTime'] = get(formFields,'showTime.value'))
        return dateProps;
    }
    /** 更新单选组合输入配置数据信息 */
    updateRadioElementProps(formFields: PropertyFormElementFormFields,keys: string){
        const dateProps = {}
        const options = get(formFields,'selectValue.value');
        const type = this.formPropertyViewModel.editComponentData.type
        if (type === 'radioButton' || type === 'radio') {
            if(options&&(isObservableArray(options)||Array.isArray(options)))
            dateProps[type] = {
                options: options.map((item) => {
                    return {label:item.value,value:item.key, disabled: false}
                })
            }
        }
        return dateProps;
    }
    updateRules(formFields: PropertyFormElementFormFields,rules: IAntdRule[]){}
    updateRulesRequired(formFields: PropertyFormElementFormFields,rules: IAntdRule[],type:IAntdRule['type']='string') {
        const isRequired = get(formFields,'isRequired.value')
        const index = rules.findIndex((item) => has(item,'required'))
        if (index > -1) {
            if (isRequired === false) {
                rules.splice(index,1);
            }
        } else {
            if (isRequired === true) {
                rules.push({message: "不能为空",
                required: true,
                //@ts-ignore
                trigger: 'blur,change',
                    type
                })
            }
        }
        return rules;
    }
    /**
     * 添加表单元素
     *
     * @param {Object} item
     * @memberof ViewModel
     */
    @action addFormElement(key: string,item: LabelWithInputModel | LabelWithHLSelectModel |
        LabelWithDatePickerModel | LabelWithRangePickerModel | LabelWithRadioButtonModel|LabelWithUploadModel|LabelWithSwitchModel,label: string,type:ComponentType,name:string) {
        const vmodel = new FormElementViewModel()
        vmodel.config = item;
        vmodel.label = label;
        vmodel.type = type;
        this.formElement.set(key,observableViewModel<FormElementViewModel>(vmodel));
        this.formPropertyViewModel.propertyData.set(key,{
            renderElements: [],
            propertyValue: [],
            propertyValueTemp:[],
        })
        /* set(this.formDraggerModel,name,{value:''}) */
    }
    
    /**
     * 根据keys 查询组件配置信息
     *
     * @param {string} key
     * @returns
     * @memberof ProjectFormPropertyStore
     */
    @action getFormElementConfig(key: string) {
        return this.formElement.get(key);
    }
    @action getFormCompoentData(key: string) {
        return this.formPropertyViewModel.compoentData.get(key);
    }
    /** 同步更新表单元素组件属性 */
    @action asyncElementData(formFields: PropertyFormElementFormFields) {
        const keys = this.formPropertyViewModel.editComponentData.keys;
        const item = this.formElement.get(keys);
        const newItem = this.formPropertyViewModel.compoentData.get(keys)
        const iAntdProps = this.updateIAntdProps(formFields);
        const inputPorps = this.updateInputElementProps(formFields,keys);
        // @ts-ignore
        const { label,...iformProps } = this.updateCommonElementProps(formFields,keys)
        const selectProps = this.updateSelectElementProps(formFields,keys)
        const uploadProps = this.updateUploadElementProps(formFields,keys)
        const radioProps = this.updateRadioElementProps(formFields,keys)
        /* const setDefaultModel = () => {
            nameValue = get(item,'_defaultModel.config.iAntdProps.name')
            set(formFields,'name.value',nameValue)
            this.formProperyElementRef.store.updateFormInputData(this.formProperyElementRef.uid,formFields,this.formProperyElementRef.that)
        } */
        const dataProps = this.updateDateElementProps(formFields,keys)
        const list = {
            text: [{key:'labelSpan',mapKeys:'labelCol'}]
        }
        const formProps = {};
        const type = this.formPropertyViewModel.editComponentData.type
        formProps[FORM_PROPS[type]] = { ...newItem.config[FORM_PROPS[type]],...iformProps,...inputPorps,...selectProps,...uploadProps,...dataProps,...radioProps }
        this.formPropertyViewModel.compoentData.set(keys,{
            //@ts-ignore
            config: {
                iAntdProps: { ...newItem.config.iAntdProps,...iAntdProps},
                ...formProps,
                rules: this.updateRulesRequired(formFields,newItem.config.rules),
            },
            type:newItem.type,
        })
        item.config.iAntdProps = { ...item.config.iAntdProps,...iAntdProps }
        item.config[FORM_PROPS[type]] = { ...item.config[FORM_PROPS[type]],...iformProps,...inputPorps,...selectProps,...uploadProps,...dataProps,...radioProps }
        item.config.rules=this.updateRulesRequired(formFields,item.config.rules)
        label && (item.label = label)
        this.formElement.set(keys,{ ...item })
        console.log(formFields,radioProps,item,'formFields')
    }

    /** 获取指定下拉选项值设置表单属性值 */
    getAddSelectValueFormPropertyValue(field:string){
        const formvalue: PropertyKeyValueFormFields = this.formAddSelectValueRef.viewModel.InputDataModel as PropertyKeyValueFormFields;
        return get(formvalue,`${field}.value`);
    }
    /** 获取指定组件属性表单值 */
    getProperyElementValue(field:string){
        const formvalue: PropertyFormElementFormFields = get(this.formProperyElementRef,'viewModel.InputDataModel') as PropertyFormElementFormFields;
        return get(formvalue,`${field}.value`);
    }
    constructor(context:IContext) {
        super(context)
        this.initFormDraggerModel()
    }
    triggerUpdateComponentViewEven(currComponentView: IQuery,keys: string) {
       /*  this.context.dispatch(ComponentViewResource.updated,{currComponentView,componenyKeys:keys}) */
    }
    /** 初始化拖拽区域表单数据模型 */
    @action initFormDraggerModel() {
        for (let i = 0; i < 60; i++){
            set(this.formDraggerModel,`element${i}`,{value:void 0})
        }
    }
    @action onEvent(event: IResourceEvent<ITriggerEventPrams>) {
        
        /* if (ComponentViewResource.updated.name === event.name) {
            this.viewModel.currComponentView = {...this.viewModel.currComponentView,...event.payload.currComponentView}
        } */
    }
}
