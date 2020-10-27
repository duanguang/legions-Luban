import React,{ Component,useState } from 'react'
import {
    Button,
    Row,
    Col,
    Spin,
    Icon,
    Card,
    Tabs,
    Input,
    InputNumber,
    Collapse,
    message,
    Modal,
    Dropdown,
    Menu,
} from 'antd';
import { runInAction} from 'mobx'
import { NumericInput,HLSelect,OpenDeleteConfirm, HLTable } from 'hoolinks-legion-design';
import { InstanceModal, InstanceForm, InstanceHlTable } from 'hoolinks-legion-design/lib/typings/components';
import ProjectStore from '../../../stores/projectStore';
import { HLFormUtils } from 'hoolinks-legion-design/lib/utils/config-utils';
import { BaseFormFields } from 'hoolinks-legion-design/lib/models/BaseFormFields';
import { IAntdRule, ClassOf, WrappedFormUtils, TableColumnConfig } from 'hoolinks-legion-design/lib/typings/antd';
import { LabelWithInputModel, LabelWithDatePickerModel, LabelWithMonthPickerModel, LabelWithSwitchModel, LabelWithHLSelectModel, LabelWithInputNumberModel, LabelWithUploadModel, LabelWithTextModel, LabelWithRadioButtonModel, LabelWithRangePickerModel } from 'hoolinks-legion-design/lib/models/HLForm';
import FormBasePropertyConfig, { IHLFormUtils } from './formBasePropertyConfig';
import { HlLabeledValue } from 'hoolinks-legion-design/lib/models/HlLabeledValue';
import { PropertyFormElementFormFieldsRule } from '../../../models/form/propertyFormElement';
import FormProerty from '../formProperty';
import { INPUT_ADDON_AFTER_BUTTON } from '../../../constants/code/formConfigCode';
const { Panel } = Collapse;
interface IProps {}
interface IState{ }

export default  class FormPropertyInputConfig<P = {}> extends FormBasePropertyConfig<P> {
    constructor(props?: IProps & P) {
        super(props)
        this.state = {
        }
    }
    createInputElementConfig(options: { instance: FormProerty;commonConfig:IHLFormUtils['componentModel'][]}) {
        const formPropertyApp = options.instance.props.store.context.formPropertyApp;
        const rules =  this.createRulesInstance<PropertyFormElementFormFieldsRule>(PropertyFormElementFormFieldsRule);
        const formUtils = this.createFormUtils()
        this.renderInputConfig(formUtils,{
            name:'maxLength',
            placeholder: '字符最大长度',
            label:'最大长度',
            rules:rules.maxLength
        })
        this.renderRadioButtonConfig(formUtils,{
            name: 'inputType',
            label:'输入框类型',
            rules:rules.inputType,
            options:[{
                label: '数字',
                value: 'number',
            },{
                label: '文本',
                value: 'text',
            },{
                label: '多行文本',
                value: 'textarea',
            }]
        })
        formUtils.renderSelectConfig({
            iAntdProps: formUtils.createAntdProps('inputAddonAfter',null,'请选择框后缀'),
            iFormProps: {
                ...formUtils.createLayout('文本框后缀',this.span.labelSpan,this.span.wrapSpan),
                options: [{key:'1',value:'按钮(button)',label:'按钮(button)'},{key:'2',value:'下拉框(select)',label:'下拉框(select)',disabled:true}],
                labelInValue: true,
                onChange: (value: HlLabeledValue) => {
                    const property = 'inputAddonAfter';
                    runInAction(()=>{
                        formPropertyApp.formPropertyViewModel.editComponentData.property = property
                    })
                    const updateData = (options: { propertyType: 'expression' | 'function'|null; title: string;code:string}) => {
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
                    if (value && value.key === '1') {
                        updateData({ propertyType: 'expression',title: '添加文本框后缀表达式',code: INPUT_ADDON_AFTER_BUTTON })
                    }
                }
            },
            rules:rules.inputAddonAfter,
        })
        return [
            ...options.commonConfig,
            formUtils.getFormConfig('maxLength'),
            formUtils.getFormConfig('inputType'),
            formUtils.getFormConfig('inputAddonAfter'),
        ]
    }
}