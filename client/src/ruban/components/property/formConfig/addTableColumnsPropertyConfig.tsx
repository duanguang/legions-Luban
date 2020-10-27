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
import { runInAction } from 'mobx'
import { NumericInput,HLSelect,OpenDeleteConfirm,HLTable } from 'hoolinks-legion-design';
import { InstanceModal,InstanceForm,InstanceHlTable } from 'hoolinks-legion-design/lib/typings/components';
import ProjectStore from '../../../stores/projectStore';
import { HLFormUtils } from 'hoolinks-legion-design/lib/utils/config-utils';
import { BaseFormFields } from 'hoolinks-legion-design/lib/models/BaseFormFields';
import { IAntdRule,ClassOf,WrappedFormUtils,TableColumnConfig } from 'hoolinks-legion-design/lib/typings/antd';
import { LabelWithInputModel,LabelWithDatePickerModel,LabelWithMonthPickerModel,LabelWithSwitchModel,LabelWithHLSelectModel,LabelWithInputNumberModel,LabelWithUploadModel,LabelWithTextModel,LabelWithRadioButtonModel,LabelWithRangePickerModel } from 'hoolinks-legion-design/lib/models/HLForm';
import FormBasePropertyConfig,{ IHLFormUtils } from './formBasePropertyConfig';
import { HlLabeledValue } from 'hoolinks-legion-design/lib/models/HlLabeledValue';
import { SELECTOPTIONSVALUE,FORM_PROPS } from '../../../constants/consts';
import get from 'lodash/get'
import set from 'lodash/set'
import has from 'lodash/has'
import { shortHash } from 'hoolinks-legion-design/lib/utils/utils';
import { QuestionTooltip } from '../../questionTooltip/questionTooltip';
import { PropertyColumnsConfigFormFieldsRule,PropertyColumnsConfigFormFields } from '../../../models/form/propertyFormModel';
import TableProperty from '../tableProperty';
import { CUSTOM_COLUMNS_RENDER_CODE } from '../../../constants/code/tableConfigCode';
import { OperationEnum } from '../../../constants/enum-data';
const { Panel } = Collapse;
interface IProps { }
const Question = (lable: string,title: string) => {
    return (<QuestionTooltip label={lable} title={title}></QuestionTooltip>)
}
export default class AddTableColumnsPropertyConfig<P = {}> extends FormBasePropertyConfig<P> {
    constructor(props?: IProps & P) {
        super(props)
    }
    createTableColumnsConfig(Instance: TableProperty) {
        const span = 6
        const wrapSpan = 18
        const rules = PropertyColumnsConfigFormFieldsRule.createFormRules<PropertyColumnsConfigFormFieldsRule>(PropertyColumnsConfigFormFieldsRule);
        const formUtils = this.createFormUtils()
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('columnsName',null,'列名称'),
            iFormProps: {
                ...formUtils.createLayout('列名称',span,wrapSpan),
            },
            rules: rules.columnsName,
        })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('dataIndex',null,'属性名称'),
            iFormProps: {
                ...formUtils.createLayout('属性名称',span,wrapSpan),
            },
            rules: rules.dataIndex,
        })
        formUtils.renderSwitchConfig({
            iAntdProps: formUtils.createAntdProps('sorter',null,''),
            iFormProps: {
                ...formUtils.createLayout('排序',span,wrapSpan),
            },
            rules: rules.sorter,
        })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('width',null,'列宽度'),
            iFormProps: {
                ...formUtils.createLayout('宽度',span,wrapSpan),
                type: 'number',
            },
            rules: rules.width,
        })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('customColumnsRender',null,'自定义渲染'),
            iFormProps: {
                ...formUtils.createLayout('自定义渲染',span,wrapSpan),
                disabled: true,
                addonAfter: (<Button size="small" type="primary" onClick={() => {
                    console.log(Instance);
                    const viewModel: PropertyColumnsConfigFormFields = Instance.props.store.formProperyAddTableColumnsRef.viewModel.InputDataModel as PropertyColumnsConfigFormFields;
                    Instance.modalRef.viewModel.title = '编辑自定义渲染函数'
                    Instance.modalRef.viewModel.visible = true;
                    const width = 760;
                    const TbalePropertyApp = Instance.props.store.context.listPagePropertyApp.context.TablePropertyApp;
                    TbalePropertyApp.addTableColumnsModalRef.viewModel.visible = false;
                    Instance.modalRef.viewModel.width = width;
                    Instance.viewModel.operationEnum = OperationEnum.EditTableCode
                    Instance.viewModel.codeValue = viewModel.customColumnsRender.value || CUSTOM_COLUMNS_RENDER_CODE;
                }}>编辑自定义渲染函数</Button>),
            },
            rules: rules.customColumnsRender,
        })
        return [
            formUtils.getFormConfig('columnsName'),
            formUtils.getFormConfig('dataIndex'),
            formUtils.getFormConfig('width'),
            formUtils.getFormConfig('customColumnsRender'),
            formUtils.getFormConfig('sorter'),
        ]
    }
}