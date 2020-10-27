import React from 'react';
import { HLFormUtils } from 'hoolinks-legion-design/lib/utils/config-utils'
import ProjectStore from '../../../stores/projectStore';
import { Row, Col, Button, Tooltip, Icon,Menu, Dropdown, message, } from 'antd';
import TableProperty from '../tableProperty';
import { OperationEnum } from '../../../constants/enum-data';
import FormProerty from '../formProperty';
import { PropertyFormGroupGlobalFormFieldsRule, PropertyFormElementFormFieldsRule, PropertyFormElementFormFields, PropertyFormGroupGlobalFormFields } from '../../../models/form/propertyFormElement';
import FormBasePropertyConfig from './formBasePropertyConfig';
import { ComponentType } from '../../../stores/projectFormProperty';
import { validationRuleReg, FORM_PROPS, SELECTOPTIONSVALUE, EVENTDATA } from '../../../constants/consts';
import { HlLabeledValue } from 'hoolinks-legion-design/lib/models/HlLabeledValue';
import { FormElementvalidatorCode, FormElementvalidatorRegCode, FORMSELECTMODEL, FORMSELECTTRANSFORM, FORMSELECTPRAMS, FORMSELECTTOKEN, INPUT_ADDON_AFTER_BUTTON, FORM_ELEMENT_UPLOAD_VALIDATOR_CODE, DATE_DISABLED_DATE_FUNC_CODE } from '../../../constants/code/formConfigCode';
import { getExecutableScript } from '../../../utils/codemodCore';
import { transformValidationRule } from '../../../utils/form-page-codemod';
import AddSelectValue from '../../addSelectValue';
import { PropertyKeyValueFormFields, PropertyKeyValueFormFieldsRule } from '../../../models/form/propertyFormModel';
import { QuestionTooltip } from '../../questionTooltip/questionTooltip';
import get from 'lodash/get'
import set from 'lodash/set'
import  has  from 'lodash/has'
import { shortHash } from 'hoolinks-legion-design/lib/utils/utils';
import { OpenDeleteConfirm } from 'hoolinks-legion-design';
import {runInAction} from 'mobx'
import FormPropertyInputConfig from './formPropertyInputConfig';
import FormPropertyCommonConfig from './formPropertyCommonConfig';
import FormPropertySelectConfig from './formPropertySelectConfig';
import FormPropertyUploadConfig from './formPropertyUploadConfig';
import FormPropertySwitchConfig from './formPropertySwitchConfig';
import FormPropertyRadioButtonConfig from './formPropertyRadioButtonConfig';
import AddTableColumns from '../../addTableColumns';

const Question = (lable:string,title:string|React.ReactNode) => {
    return (<QuestionTooltip label={lable} title={title}></QuestionTooltip>)
}
export default abstract class FormPropertyConfig<P> extends FormBasePropertyConfig<P>{ 
    protected instance: FormProerty
    protected addSelectValueInstance:AddSelectValue
    protected field = ['paramsRenders','apiUrl','method']
    constructor(props: P) {
        super(props)
    }
    protected registerInstance(Instance: FormProerty) {
        this.instance = Instance
    }
    protected registerAddSelectValueInstance(Instance:AddSelectValue){
        this.addSelectValueInstance = Instance;
    }
    createKeyVlaueConfig(onAdd:()=>void,data:{ id: string,labelKey: string; labelValue: string; label?: string }[]=[]) {
        const config = new FormPropertyCommonConfig()
        return config.createKeyVlaueConfig(onAdd,data,{addSelectValueInstance:this.addSelectValueInstance})
    }
    createTableColumnsConfig(onAdd:()=>void,data:{ id: string,labelKey: string; labelValue: string; label?: string }[]=[],instance:AddTableColumns) {
        const config = new FormPropertyCommonConfig()
        return config.createTableColumnsConfig(onAdd,data,{instance})
    }
    createGroupConfig() {
        const config = new FormPropertyCommonConfig()
        return config.createGroupConfig()
    }
    
    createConfig() {
        const config = new FormPropertyCommonConfig()
        return config.createConfig({
            instance:this.instance,
        })
    }
    
    createElementConfig() {
        const formPropertyApp = this.instance.props.store.context.formPropertyApp;
        const type: ComponentType = formPropertyApp.formPropertyViewModel.editComponentData.type;
        const compoent = {
            text: this.createInputElementConfig(),
            select: this.createSelectElementConfig(),
            date: this.createDatePickerElementConfig(),
            daterange: this.createRangePickerElementConfig(),
            switch: this.createSwitchElementConfig(),
            upload:this.createUploadElementConfig(),
            radioButton:this.createRadioButtonElementConfig(),
            radio:this.createRadioButtonElementConfig(),
        }
        return compoent[type]
    }
    createAddSelectOptionsValue(){
        const config = new FormPropertyCommonConfig()
        return config.createAddSelectOptionsValue({
            addSelectValueInstance:this.addSelectValueInstance,
        })
    }
    createRadioButtonElementConfig() {
        const config = new FormPropertyRadioButtonConfig()
        return config.createRadioButtonElementConfig({
            instance: this.instance,
            commonConfig:this.createElementCommonConfig(),
        })
    }
    createSwitchElementConfig() {
        const config = new FormPropertySwitchConfig()
        return config.createSwitchElementConfig({
            instance: this.instance,
            commonConfig:this.createElementCommonConfig(),
        })
    }
    createUploadElementConfig(){
        const config = new FormPropertyUploadConfig()
        return config.createUploadElementConfig({
            instance: this.instance,
            commonConfig:this.createElementCommonConfig(),
        })
    }
    createDateCommonElementConfig() {
        const formPropertyApp = this.instance.props.store.context.formPropertyApp;
        const rules =  this.createRulesInstance<PropertyFormElementFormFieldsRule>(PropertyFormElementFormFieldsRule);
        const formUtils = this.createFormUtils()
        this.renderInputConfig(formUtils,{
            name:'format',
            placeholder: '日期显示格式',
            label: Question('日期格式',<React.Fragment>
                <p>年月日:YYYY-MM-DD</p>
                <p>年月日:YYYY/MM/DD</p>
                <p>年月日:YYYYMMDD</p>
                <p>年月日时分秒:YYYY-MM-DD HH:mm:ss</p>
                <p>年月日时分:YYYY-MM-DD HH:mm</p>
            </React.Fragment>),
            rules:rules.format
        })
        this.renderInputConfig(formUtils,{
            name: 'disabledDate',
            label:'不可选日期',
            rules: rules.disabledDate,
            disabled: true,
            addonAfter: (<Button onClick={() => {
                const property = 'disabledDate';
                const propertyType = 'function';
                formPropertyApp.formPropertyViewModel.dispatchAction(() => {
                    formPropertyApp.formPropertyViewModel.editComponentData.property = property
                    formPropertyApp.formPropertyViewModel.editComponentData.propertyType = propertyType
                    formPropertyApp.formPropertyCodeEditModalRef.viewModel.visible = true;
                    formPropertyApp.formPropertyCodeEditModalRef.viewModel.title = '编辑数据转换函数';
                    const item = formPropertyApp.formPropertyViewModel.getPropertyValueTemp(property,propertyType)
                    if (!item || item.value === '') {
                        formPropertyApp.formPropertyViewModel.updatePropertyValueTemp({
                            value: DATE_DISABLED_DATE_FUNC_CODE,
                            property:property,
                            propertyType:propertyType,
                        })
                    }
                })
            }}>编辑函数</Button>)
        })
        /* this.renderSwitchConfig(formUtils,{
            name:'showTime',
            placeholder:'',
            label:'增加时间选择功能',
            rules:rules.showTime,
        }) */
        return [
            formUtils.getFormConfig('format'),
            formUtils.getFormConfig('disabledDate')
        ]
    }
    createDatePickerElementConfig() {
        const formPropertyApp = this.instance.props.store.context.formPropertyApp;
        const rules =  this.createRulesInstance<PropertyFormElementFormFieldsRule>(PropertyFormElementFormFieldsRule);
        const formUtils = this.createFormUtils()
        return [
            ...this.createElementCommonConfig(),
            ...this.createDateCommonElementConfig()
        ]
    }
    createRangePickerElementConfig() {
        const formPropertyApp = this.instance.props.store.context.formPropertyApp;
        const rules =  this.createRulesInstance<PropertyFormElementFormFieldsRule>(PropertyFormElementFormFieldsRule);
        const formUtils = this.createFormUtils()

        return [
            ...this.createElementCommonConfig(),
            ...this.createDateCommonElementConfig(),
        ]
    }
    createSelectElementConfig() {
        const config = new FormPropertySelectConfig()
        return config.createSelectElementConfig({
            instance:this.instance,
            commonConfig:this.createElementCommonConfig(),
        })
    }
    createInputElementConfig() {
        const config = new FormPropertyInputConfig()
        return config.createInputElementConfig({
            instance:this.instance,
            commonConfig:this.createElementCommonConfig(),
        })
    }
    createElementCommonConfig() {
        const formPropertyApp = this.instance.props.store.context.formPropertyApp;
        const rules = this.createRulesInstance<PropertyFormElementFormFieldsRule>(PropertyFormElementFormFieldsRule,{ that: this.instance,store: this.instance.props.store });
        const formUtils = this.createFormUtils()
        this.renderInputConfig(formUtils,{
            name:'name',
            label:'组件名称',
            rules: rules.name,
            placeholder:'只能填入英文字符',
        })
        this.renderInputConfig(formUtils,{
            name:'labelName',
            label:'label名称',
            rules: rules.labelName,
        })
        this.renderInputConfig(formUtils,{
            name:'labelSpan',
            placeholder:'label宽度,最大24',
            label:'label宽度',
            rules:rules.labelSpan,
            type:'number',
        })
        this.renderInputConfig(formUtils,{
            name:'elementSpan',
            placeholder:'组件宽度,最大24',
            label:'组件宽度',
            rules: rules.elementSpan,
            type:'number',
        })
        this.renderInputConfig(formUtils,{
            name:'containerSpan',
            placeholder:'容器宽度,最大24',
            label:'容器宽度',
            rules:rules.containerSpan,
            type:'number',
        })
        this.renderInputConfig(formUtils,{
            name:'placeholderProperty',
            placeholder:'占位提示的文案',
            label:'占位提示',
            rules:rules.placeholderProperty,
            type:'text',
        })
        formUtils.renderSelectConfig({
            iAntdProps: formUtils.createAntdProps('subGroup',null,'请选择分组'),
            iFormProps: {
                ...formUtils.createLayout('所属分组',this.span.labelSpan,this.span.wrapSpan),
                //@ts-ignore
                options: formPropertyApp.formPropertyViewModel.group.map((item) => {
                    return {key:item.id,value:item.name as string}
                }),
            },
            rules:rules.subGroup,
        })
        this.renderSwitchConfig(formUtils,{
            name: 'isDisabled',
            label:'禁用',
            rules:rules.isDisabled
        })
        this.renderSwitchConfig(formUtils,{
            name: 'isRequired',
            label:'必填',
            rules:rules.isRequired
        })
        this.renderSwitchConfig(formUtils,{
            name: 'visibleProperty',
            label:'默认显示/隐藏',
            rules:rules.isRequired
        })
        formUtils.renderSelectConfig({
            iAntdProps: formUtils.createAntdProps('validationRuleReg',null,'请选择验证规则方式'),
            iFormProps: {
                ...formUtils.createLayout('验证规则',this.span.labelSpan,this.span.wrapSpan),
                options: validationRuleReg,
                labelInValue: true,
                onChange: (value: HlLabeledValue) => {
                    if(!value){
                        return;
                    }
                    const property = 'validationRuleReg';
                    runInAction(()=>{
                        formPropertyApp.formPropertyViewModel.editComponentData.property = property
                    })
                    const updateData = (options: { propertyType: 'expression' | 'function'|null; title: string;code:string}) => {
                        if(formPropertyApp.formPropertyViewModel){
                            formPropertyApp.formPropertyViewModel.dispatchAction(() => { 
                                formPropertyApp.formPropertyCodeEditModalRef.viewModel.visible = true;
                                formPropertyApp.formPropertyCodeEditModalRef.viewModel.title = options.title;
                                const item = formPropertyApp.formPropertyViewModel.getPropertyValueTemp(property, options.propertyType)
                                if (!item||item.value==='') {
                                    formPropertyApp.formPropertyViewModel.updatePropertyValueTemp({
                                        value: options.code,
                                        property:property,
                                        propertyType:options.propertyType,
                                    })
                                }
                            })
                        }
                        
                    }
                    if (value.key === '2') {
                        updateData({propertyType:'expression',title:'添加验证规则表达式',code:FormElementvalidatorRegCode})
                    }
                    else if (value.key === '3') {
                        const type = formPropertyApp.formPropertyViewModel.editComponentData.type
                        const typeCode = {
                            upload:FORM_ELEMENT_UPLOAD_VALIDATOR_CODE,
                        }
                        updateData({propertyType:'function',title:'添加自定义验证方法',code:typeCode[type]||FormElementvalidatorCode})
                    }else {
                        updateData({propertyType:'expression',title:'手机号验证表达式',code:(`${value.keyValue}`)})
                    }
                }
            },
            rules:rules.validationRuleReg,
        })
        this.createExecCodeConfig(formUtils,{
            name: 'eventList',
            label:'添加事件',
            btnText:'查看事件',
            rules: rules.eventList,
            options: EVENTDATA[formPropertyApp.formPropertyViewModel.editComponentData.type],
            onChange:(value)=>{
                if(!value){
                    return;
                }
                // @ts-ignore
                const values = value as HlLabeledValue;
                let code = values.keyValue
                const model = formPropertyApp.formPropertyViewModel.getPropertyValue(values.label);
                if(model){
                    code = model.value as string;
                }
                runInAction(()=>{
                    formPropertyApp.formPropertyViewModel.codeValue = code;
                    formPropertyApp.formAddEventCodeExpressionModalRef.viewModel.visible = true;
                    formPropertyApp.formAddEventCodeExpressionModalRef.viewModel.title = `${values.label}事件`;
                    formPropertyApp.formPropertyViewModel.editComponentData.property = values.label
                })
            },
            onSetting: () => {
                formPropertyApp.formAddEventListTableModalRef.viewModel.visible = true;
                formPropertyApp.formAddEventListTableModalRef.viewModel.title = '事件信息';
                formPropertyApp.formPropertyViewModel.updateEventData();
            }
        })
        return [
            formUtils.getFormConfig('name'),
            formUtils.getFormConfig('labelName'),
            formUtils.getFormConfig('labelSpan'),
            formUtils.getFormConfig('elementSpan'),
            formUtils.getFormConfig('containerSpan'),
            formUtils.getFormConfig('placeholderProperty'),
            formUtils.getFormConfig('subGroup'),
            formUtils.getFormConfig('isDisabled'),
            formUtils.getFormConfig('isRequired'),
            formUtils.getFormConfig('visibleProperty'),
            formUtils.getFormConfig('validationRuleReg'),
            formUtils.getFormConfig('eventListRender'),
        ]
    }
}