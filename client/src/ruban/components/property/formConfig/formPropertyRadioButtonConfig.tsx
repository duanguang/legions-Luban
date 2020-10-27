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
import { SELECTOPTIONSVALUE, FORM_PROPS } from '../../../constants/consts';
import get from 'lodash/get'
import set from 'lodash/set'
import  has  from 'lodash/has'
import { shortHash } from 'hoolinks-legion-design/lib/utils/utils';
const { Panel } = Collapse;
interface IProps {}

export default  class FormPropertyRadioButtonConfig<P = {}> extends FormBasePropertyConfig<P> {
    constructor(props?: IProps & P) {
        super(props)
    }
    createRadioButtonElementConfig(options: { instance: FormProerty;commonConfig:IHLFormUtils['componentModel'][]}) {
        const formPropertyApp = options.instance.props.store.context.formPropertyApp;
        const rules =  this.createRulesInstance<PropertyFormElementFormFieldsRule>(PropertyFormElementFormFieldsRule);
        const formUtils = this.createFormUtils()
        this.createExecCodeConfig(formUtils,{
            name: 'selectOptionsValue',
            label:'单选组合项',
            rules: rules.selectOptionsValue,
            options:  [{ key: '1',value: '数组List',label: '数组List' }],
            onSetting: () => {
                runInAction(()=>{
                    const value = get(formPropertyApp.formProperyElementRef.viewModel.InputDataModel,'selectOptionsValue.value') as HlLabeledValue
                    if(!value){
                         message.warn('请先选择单选组件数据类型');
                         return;
                    }
                    if (value.key === '1') {  // 数组List
                        const itemconfig = formPropertyApp.getFormCompoentData(formPropertyApp.formPropertyViewModel.editComponentData.keys);
                        const property = FORM_PROPS[formPropertyApp.formPropertyViewModel.editComponentData.type];
                        const options = get(itemconfig,`config.${property}.${formPropertyApp.formPropertyViewModel.editComponentData.type}.options`) || []
                        console.log(itemconfig,options,'options')
                        formPropertyApp.formSelectValueModalRef.viewModel.visible = true;
                        formPropertyApp.formSelectValueModalRef.viewModel.title='单选组合数据编辑'
                        formPropertyApp.formPropertyViewModel.selectValueData = [];
                        options.map((item,index) => {
                            const uid = `${shortHash(new Date().getTime())+index}`
                            formPropertyApp.formPropertyViewModel.selectValueData.push({ labelKey: item.value,id: uid,labelValue: item.label })
                        })
                       formPropertyApp.formPropertyViewModel.selectValueData =formPropertyApp.formPropertyViewModel.selectValueData.slice()
                       const timeid= setTimeout(()=>{
                           const formFields = {}
                           console.log(formPropertyApp.formPropertyViewModel.selectValueData)
                            formPropertyApp.formPropertyViewModel.selectValueData.map((item) => {
                                formFields[`labelValue${item.id}`] = {value:item.labelValue};
                                formFields[`labelKey${item.id}`] = {value:item.labelKey};
                            })
                            formPropertyApp.formAddSelectValueRef.store.updateFormInputData(formPropertyApp.formAddSelectValueRef.uid,formFields,formPropertyApp.formAddSelectValueRef.that)
                            clearTimeout(timeid)
                        },100)
                    }
                })
            }
        })
        return [
            ...options.commonConfig,
            formUtils.getFormConfig('selectOptionsValueRender'),
        ]
    }
}