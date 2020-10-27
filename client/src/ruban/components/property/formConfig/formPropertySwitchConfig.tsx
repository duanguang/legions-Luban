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

export default  class FormPropertySwitchConfig<P = {}> extends FormBasePropertyConfig<P> {
    constructor(props?: IProps & P) {
        super(props)
    }
    createSwitchElementConfig(options: { instance: FormProerty;commonConfig:IHLFormUtils['componentModel'][]}) {
        const formPropertyApp = options.instance.props.store.context.formPropertyApp;
        const rules =  this.createRulesInstance<PropertyFormElementFormFieldsRule>(PropertyFormElementFormFieldsRule);
        const formUtils = this.createFormUtils()
        return [
            ...options.commonConfig,
        ]
    }
}