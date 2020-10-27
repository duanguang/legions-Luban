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
import { INPUT_ADDON_AFTER_BUTTON, UPLOAD_PARAMS_EXPRESSION, UPLOAD_TRANFORM_FUNC_CODE } from '../../../constants/code/formConfigCode';
import { SELECTOPTIONSVALUE, FORM_PROPS } from '../../../constants/consts';
import get from 'lodash/get'
import set from 'lodash/set'
import  has  from 'lodash/has'
import { shortHash } from 'hoolinks-legion-design/lib/utils/utils';
import { QuestionTooltip } from '../../questionTooltip/questionTooltip';
const { Panel } = Collapse;
interface IProps {}
const Question = (lable:string,title:string) => {
    return (<QuestionTooltip label={lable} title={title}></QuestionTooltip>)
}
export default  class FormPropertyUploadConfig<P = {}> extends FormBasePropertyConfig<P> {
    constructor(props?: IProps & P) {
        super(props)
    }
    createUploadElementConfig(options: { instance: FormProerty;commonConfig:IHLFormUtils['componentModel'][]}) {
        const formPropertyApp = options.instance.props.store.context.formPropertyApp;
        const rules =  this.createRulesInstance<PropertyFormElementFormFieldsRule>(PropertyFormElementFormFieldsRule);
        const formUtils = this.createFormUtils()
        const uploadaccept =['docx','doc','xlsx','xls','pdf','zip','bmp','png','jpeg','jpg']
        this.renderSwitchConfig(formUtils,{
            name: 'uploadIsDragger',
            label:'拖拽上传',
            rules:rules.uploadIsDragger,
        })
        this.renderSwitchConfig(formUtils,{
            name: 'uploadMultiple',
            label:'多选文件',
            rules:rules.uploadMultiple,
        })
        this.renderSwitchConfig(formUtils,{
            name: 'uploadShowFileList',
            label:'展示文件列表',
            rules:rules.uploadShowFileList,
        })
        formUtils.renderSelectConfig({
            iAntdProps: formUtils.createAntdProps('uploadaccept',null,'请选择允许上传文件'),
            iFormProps: {
                ...formUtils.createLayout('允许上传类型',this.span.labelSpan,this.span.wrapSpan),
                options: uploadaccept.map((item) => { return { value: item,key: item,label:item } }),
                multiple: true,
            },
            rules:rules.uploadaccept,
        })
        this.renderInputConfig(formUtils,{
            name: 'uploadmaxFileCount',
            label:'最大附件数',
            rules: rules.uploadmaxFileCount,
            type:'number',
        })
        this.renderInputConfig(formUtils,{
            name: 'uploadshowFileListGroup',
            label:'每行文件数量',
            rules: rules.uploadshowFileListGroup,
            type: 'number',
        })
        this.renderInputConfig(formUtils,{
            name: 'uploadParams',
            label:Question('上传参数','上传接口需要传递的参数信息'),
            rules: rules.uploadParams,
            disabled: true,
            addonAfter: (<Button onClick={() => {
                const property = 'uploadParams';
                formPropertyApp.formPropertyViewModel.dispatchAction(() => {
                    formPropertyApp.formPropertyViewModel.editComponentData.property = property
                    formPropertyApp.formPropertyViewModel.editComponentData.propertyType = 'expression'
                    formPropertyApp.formPropertyCodeEditModalRef.viewModel.visible = true;
                    formPropertyApp.formPropertyCodeEditModalRef.viewModel.title = '编辑上传参数表达式';
                    const item = formPropertyApp.formPropertyViewModel.getPropertyValueTemp(property,'expression')
                    if (!item || item.value === '') {
                        formPropertyApp.formPropertyViewModel.updatePropertyValueTemp({
                            value: UPLOAD_PARAMS_EXPRESSION,
                            property:property,
                            propertyType:'expression',
                        })
                    }
                })
            }}>编辑表达式</Button>)
        })
        this.renderInputConfig(formUtils,{
            name: 'uploadDataTransform',
            label:Question('数据转换','数据转化，使用该属性后，表单与上传组件的数据交流都为UploadFile[]类型'),
            rules: rules.uploadDataTransform,
            disabled: true,
            addonAfter: (<Button onClick={() => {
                const property = 'uploadDataTransform';
                const propertyType = 'function';
                formPropertyApp.formPropertyViewModel.dispatchAction(() => {
                    formPropertyApp.formPropertyViewModel.editComponentData.property = property
                    formPropertyApp.formPropertyViewModel.editComponentData.propertyType = propertyType
                    formPropertyApp.formPropertyCodeEditModalRef.viewModel.visible = true;
                    formPropertyApp.formPropertyCodeEditModalRef.viewModel.title = '编辑数据转换函数';
                    const item = formPropertyApp.formPropertyViewModel.getPropertyValueTemp(property,propertyType)
                    if (!item || item.value === '') {
                        formPropertyApp.formPropertyViewModel.updatePropertyValueTemp({
                            value: UPLOAD_TRANFORM_FUNC_CODE,
                            property:property,
                            propertyType:propertyType,
                        })
                    }
                })
            }}>编辑函数</Button>)
        })
        return [
            ...options.commonConfig,
            formUtils.getFormConfig('uploadIsDragger'),
            formUtils.getFormConfig('uploadMultiple'),
            formUtils.getFormConfig('uploadShowFileList'),
            formUtils.getFormConfig('uploadaccept'),
            formUtils.getFormConfig('uploadmaxFileCount'),
            formUtils.getFormConfig('uploadshowFileListGroup'),
            formUtils.getFormConfig('uploadParams'),
            formUtils.getFormConfig('uploadDataTransform'),
        ]
    }
}