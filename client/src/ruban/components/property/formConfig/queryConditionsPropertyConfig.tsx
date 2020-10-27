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
import { SELECTOPTIONSVALUE, FORM_PROPS } from '../../../constants/consts';
import get from 'lodash/get'
import set from 'lodash/set'
import  has  from 'lodash/has'
import { shortHash } from 'hoolinks-legion-design/lib/utils/utils';
import { QuestionTooltip } from '../../questionTooltip/questionTooltip';
import TableProperty from '../tableProperty';
import { CUSTOM_COLUMNS_RENDER_CODE } from '../../../constants/code/tableConfigCode';
import { PropertyQueryFormFieldsRule, PropertyQueryFormFields } from '../../../models/form/propertyQueryFormFields';
import TextProperty from '../textProperty';
const { Panel } = Collapse;
interface IProps {}
const Question = (lable:string,title:string) => {
    return (<QuestionTooltip label={lable} title={title}></QuestionTooltip>)
}
export default  class QueryConditionsPropertyConfig<P = {}> extends FormBasePropertyConfig<P> {
    constructor(props?: IProps & P) {
        super(props)
    }
    createQueryConditionsPropertyConfig(Instance?: TextProperty) {
        const span = 6
        const wrapSpan = 18
        const rules = PropertyQueryFormFieldsRule.createFormRules<PropertyQueryFormFieldsRule>(PropertyQueryFormFieldsRule,{ that: Instance});
        const formUtils = this.createFormUtils()
        const TbalePropertyApp = Instance.props.store.context.listPagePropertyApp.context.TablePropertyApp;
        const ViewCanvasApp = Instance.props.store.context.listPagePropertyApp.context.QueryPropertyApp;
        const formPropertyApp = Instance.props.store.context.formPropertyApp;
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('labelName',null,''),
            iFormProps: {
                ...formUtils.createLayout('Label名称',span,wrapSpan),
                onChange: (even) => {
                    runInAction(() => {
                        //@ts-ignore
                        TbalePropertyApp.viewModel.currComponentView.container.component.label = even as string;
                        TbalePropertyApp.triggerUpdateComponentViewEven(TbalePropertyApp.viewModel.currComponentView,TbalePropertyApp.viewModel.currComponentView.container.component.JsonProperty.uuid)
                    })
                }
            },
            rules:rules.labelName,
        })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('componentName',null,'组件属性名称'),
            iFormProps: {
                ...formUtils.createLayout('组件属性名称',span,wrapSpan),
            },
            rules:rules.componentName,
        })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('queryPrams',null,'接口字段名称'),
            iFormProps: {
                ...formUtils.createLayout(Question('接口字段名','后端接口所需要的字段名称,可以跟组件属性名称命名相同'),span,wrapSpan),
            },
            rules:rules.queryPrams,
        })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('labelWidth',null,'label宽度'),
            iFormProps: {
                ...formUtils.createLayout(Question('label宽度','label文字区域宽度等于总宽度减去组件宽度'),span,wrapSpan),
                type: 'number',
                disabled:true,
            },
            rules:rules.maxlength,
        })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('maxlength',null,'字符串长度'),
            iFormProps: {
                ...formUtils.createLayout('输入字符长度',span,wrapSpan),
                type: 'number',
                onChange: (even) => {
                    //@ts-ignore
                    const value = parseInt(even as string,10) 
                    const nan = NaN
                    let leg = 50
                    if (value > 0 && value !== nan) {
                        leg = value;
                    }
                    runInAction(() => {
                        TbalePropertyApp.viewModel.currComponentView.container.component.props.maxlength = leg
                    })
                    TbalePropertyApp.triggerUpdateComponentViewEven(TbalePropertyApp.viewModel.currComponentView,TbalePropertyApp.viewModel.model.currComponentView.container.component.JsonProperty.uuid)
                }
            },
            rules:rules.maxlength,
        })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('width',null,'宽度'),
            iFormProps: {
                ...formUtils.createLayout('组件宽度',span,wrapSpan),
                type: 'number',
                onChange: (even) => {
                    //@ts-ignore
                    const value = parseInt(even as string,10) 
                    const nan = NaN
                    let leg = 10
                    if (value > 0 && value !== nan) {
                        leg = value;
                    }
                    runInAction(() => {
                        TbalePropertyApp.viewModel.currComponentView.container.component.props.width = leg
                    })
                    TbalePropertyApp.triggerUpdateComponentViewEven(TbalePropertyApp.viewModel.currComponentView,TbalePropertyApp.viewModel.model.currComponentView.container.component.JsonProperty.uuid)
                }
            },
            rules:rules.width,
        })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('containerWidth',null,'总宽度'),
            iFormProps: {
                ...formUtils.createLayout('总宽度',span,wrapSpan),
                type: 'number',
                onChange: (even) => {
                    //@ts-ignore
                    const value = parseInt(even as string,10) 
                    const nan = NaN
                    let leg = 180
                    if (value > 0 && value !== nan) {
                        leg = value;
                    }
                    runInAction(() => {
                        TbalePropertyApp.viewModel.currComponentView.container.width = leg
                    })
                    TbalePropertyApp.triggerUpdateComponentViewEven(TbalePropertyApp.viewModel.currComponentView,TbalePropertyApp.viewModel.model.currComponentView.container.component.JsonProperty.uuid)
                }
            },
            rules:rules.containerWidth,
        })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('placeholderContent',null,'占位提示'),
            iFormProps: {
                ...formUtils.createLayout('占位提示',span,wrapSpan),
                onChange: (even) => {
                    runInAction(() => {
                        //@ts-ignore
                        TbalePropertyApp.viewModel.currComponentView.container.component.props.placeholder = even as string;
                        TbalePropertyApp.triggerUpdateComponentViewEven(TbalePropertyApp.viewModel.currComponentView,TbalePropertyApp.viewModel.currComponentView.container.component.JsonProperty.uuid)
                    })
                }
            },
            rules:rules.placeholderContent,
        })
        this.createExecCodeConfig(formUtils,{
            name: 'selectOptionsValue',
            label:'数据项',
            rules: rules.selectOptionsValue,
            options:  [{ key: '1',value: '数组List',label: '数组List' }],
            onSetting: () => {
                runInAction(()=>{
                    const value = get(TbalePropertyApp.updateQueryConditionsFormProperyRef.viewModel.InputDataModel,'selectOptionsValue.value') as HlLabeledValue
                    if(!value){
                         message.warn('请先选择单选组件数据类型');
                         return;
                    }
                    if (value.key === '1') {  // 数组List
                        const view = TbalePropertyApp.viewModel.currComponentView
                        Instance.viewModel.itemDataType = value.key;
                        const options = get(view,'container.component.data') || []
                        formPropertyApp.formSelectValueModalRef.viewModel.visible = true;
                        formPropertyApp.formSelectValueModalRef.viewModel.title='数据项信息编辑'
                        formPropertyApp.formPropertyViewModel.selectValueData = [];
                        options.map((item,index) => {
                            const uid = `${shortHash(new Date().getTime()) + index}`
                            const componentActiveType = TbalePropertyApp.viewModel.componentActiveType
                            if (componentActiveType === 'select') {
                                formPropertyApp.formPropertyViewModel.selectValueData.push({ labelKey: item.key,id: uid,labelValue: item.value })
                            }
                            if (componentActiveType === 'radioButton') {
                                formPropertyApp.formPropertyViewModel.selectValueData.push({ labelKey: item.value,id: uid,labelValue: item.label })
                            }
                        })
                       formPropertyApp.formPropertyViewModel.selectValueData =formPropertyApp.formPropertyViewModel.selectValueData.slice()
                       const timeid= setTimeout(()=>{
                           const formFields = {}
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
            formUtils.getFormConfig('labelName'),
            formUtils.getFormConfig('labelWidth'),
            formUtils.getFormConfig('componentName'),
            formUtils.getFormConfig('queryPrams'),
            formUtils.getFormConfig('maxlength'),
            formUtils.getFormConfig('width'),
            formUtils.getFormConfig('containerWidth'),
            formUtils.getFormConfig('placeholderContent'),
            formUtils.getFormConfig('selectOptionsValueRender'),
            ]
    }
}