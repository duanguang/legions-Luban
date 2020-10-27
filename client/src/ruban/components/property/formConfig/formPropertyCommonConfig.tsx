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
import { PropertyFormElementFormFieldsRule, PropertyFormElementFormFields, PropertyFormGroupGlobalFormFields, PropertyFormGroupGlobalFormFieldsRule } from '../../../models/form/propertyFormElement';
import FormProerty from '../formProperty';
import { INPUT_ADDON_AFTER_BUTTON, FORMSELECTMODEL, FORMSELECTPRAMS, FORMSELECTTRANSFORM, FORMSELECTTOKEN } from '../../../constants/code/formConfigCode';
import AddSelectValue from '../../addSelectValue';
import { PropertyKeyValueFormFieldsRule } from '../../../models/form/propertyFormModel';
import { QuestionTooltip } from '../../questionTooltip/questionTooltip';
import AddTableColumns from '../../addTableColumns';
const { Panel } = Collapse;
interface IProps {}
interface IState{ }
const Question = (lable:string,title:string) => {
    return (<QuestionTooltip label={lable} title={title}></QuestionTooltip>)
}
export default  class FormPropertyCommonConfig<P = {}> extends FormBasePropertyConfig<P> {
    constructor(props?: IProps & P) {
        super(props)
    }
    createKeyVlaueConfig(onAdd:()=>void,data:{ id: string,labelKey: string; labelValue: string; label?: string }[]=[],options:{addSelectValueInstance:AddSelectValue}) {
        const rules = this.createRulesInstance<PropertyKeyValueFormFieldsRule>(PropertyKeyValueFormFieldsRule,options.addSelectValueInstance);
        const formUtils = this.createFormUtils()
        const formPropertyApp = options.addSelectValueInstance.props.store.context.formPropertyApp;
        this.createTableConfig(formUtils,{
            columns:[{
                key: 'labelValue',
                title: '选项标签名(客户端展示)',
                dataIndex: 'labelValue',
                width: '160px',
                render: (_,record,index: number) => {
                    const labelValueInput = formUtils.renderInputConfig({
                        iAntdProps: formUtils.createAntdProps(`labelValue${record['id']}`,null),
                        iFormProps: {
                            ...formUtils.createLayout(Question('','下拉选项客户端展示使用,便于使用者识别'),4,2 * 9),
                            onChange: (value) => {
                                // @ts-ignore
                                const resul = value as string;
                                const index =  formPropertyApp.formPropertyViewModel.selectValueData.findIndex((item)=>item.id===record['id'])
                                if (index > -1) {
                                    formPropertyApp.formPropertyViewModel.dispatchAction(() => {
                                        formPropertyApp.formPropertyViewModel.selectValueData[index] = { ...formPropertyApp.formPropertyViewModel.selectValueData[index],...{ labelValue:resul } }
                                   })
                                }
                            },
                        },
                        rules:rules.labelValue,
                    })
                    return formPropertyApp.formAddSelectValueRef&&formUtils.createFormComponent(labelValueInput,formPropertyApp.formAddSelectValueRef.viewModel.form,formPropertyApp.formAddSelectValueRef.uid,formPropertyApp.formAddSelectValueRef)
                },
            },{
                key: 'labelKey',
                title: '选项值(服务端业务逻辑使用)',
                dataIndex: 'labelKey',
                width: '160px',
                render: (_,record,index: number) => {
                    
                    const labelKeyInput = formUtils.renderInputConfig({
                        iAntdProps: formUtils.createAntdProps(`labelKey${record['id']}`,null),
                        iFormProps: {
                            ...formUtils.createLayout(Question('','下拉选项服务端展示使用,便于开发者使用此值查询，更改数据'),4,2 * 9),
                            onChange: (value) => {
                                 // @ts-ignore
                                const resul = value as string;
                                const index =  formPropertyApp.formPropertyViewModel.selectValueData.findIndex((item)=>item.id===record['id'])
                                if (index > -1) {
                                    formPropertyApp.formPropertyViewModel.dispatchAction(() => {
                                        formPropertyApp.formPropertyViewModel.selectValueData[index] = { ...formPropertyApp.formPropertyViewModel.selectValueData[index],...{ labelKey: resul } }
                                   })
                               }
                            },
                        },
                        rules:rules.labelKey,
                    })
                    return formPropertyApp.formAddSelectValueRef&&formUtils.createFormComponent(labelKeyInput,formPropertyApp.formAddSelectValueRef.viewModel.form,formPropertyApp.formAddSelectValueRef.uid,formPropertyApp.formAddSelectValueRef)
                },
                }],
            onReady:(value)=>{
                formPropertyApp.formAddSelectValueTableRef = value
            },
            //@ts-ignore
            data: data,
            onAdd: () => {
                onAdd&&onAdd()
            },
            onDelete: () => {
               const rows= formPropertyApp.formAddSelectValueTableRef.viewModel.selectedRows;
               if(rows.length>0){
                   OpenDeleteConfirm({
                       onOk: () => {
                           rows.map((item) => {
                                formPropertyApp.formPropertyViewModel.dispatchAction(()=>{
                                    const index =  formPropertyApp.formPropertyViewModel.selectValueData.findIndex((m)=>m.id===item.id);
                                    formPropertyApp.formPropertyViewModel.selectValueData =  formPropertyApp.formPropertyViewModel.selectValueData.splice(index,1);
                                })
                            })
                       }
                   })
               }else{
                   message.warn('请先选择需要删除的数据')
               }
            }
        })
        return [
            formUtils.getFormConfig('CustomTable'),
            /* formUtils.getFormConfig('groupId'), */
        ]
    }
    createGroupConfig() {
        const rules = this.createRulesInstance<PropertyFormGroupGlobalFormFieldsRule>(PropertyFormGroupGlobalFormFieldsRule);
        const formUtils = this.createFormUtils()
        this.renderInputConfig(formUtils,{
            name: 'name',
            label:'分组名称',
            rules:rules.name,
        })
        /* this.renderInputConfig(formUtils,{
            name: 'groupId',
            label:'分组标识',
            rules:rules.groupId,
            type:'number',
        }) */
        this.renderSwitchConfig(formUtils,{
            name: 'isFolding',
            label:'是否折叠',
            rules:rules.isFolding,
        })
        this.renderSwitchConfig(formUtils,{
            name: 'isShowFormSizeIcon',
            label:'是否允许设置表单大小',
            rules:rules.isShowFormSizeIcon,
        })
        return [
            formUtils.getFormConfig('name'),
            /* formUtils.getFormConfig('groupId'), */
            formUtils.getFormConfig('isShowFormSizeIcon'),
            formUtils.getFormConfig('isFolding'),
        ]
    }
    /** 生成表单全局属性配置 */
    createConfig(options: { instance: FormProerty }) {
        const formPropertyApp = options.instance.props.store.context.formPropertyApp;
        const rules = this.createRulesInstance<PropertyFormElementFormFieldsRule>(PropertyFormElementFormFieldsRule);
        const formUtils = this.createFormUtils()
        this.renderRadioButtonConfig(formUtils,{
            name: 'layout',
            label:'布局',
            rules:rules.layout,
            options:[{
                label: '单列',
                value: '1',
            },{
                label: '两列',
                value: '2',
            },{
                label: '三列',
                value: '3',
            },{
                label: '四列',
                value: '4',
            }]
        })
        this.renderRadioButtonConfig(formUtils,{
            name: 'sizes',
            label:'尺寸',
            rules:rules.sizes,
            options:[{
                label: '正常',
                value: 'default',
            },{
                label: '迷你',
                value: 'small',
            },{
                label: '紧凑',
                value: 'table',
            }]
        })
        this.createDataOrginSource(formUtils,{
            name: 'groupList',
            label:'分组',
            rules: rules.groupList,
            //@ts-ignore
            options: formPropertyApp.formPropertyViewModel.group.map((item) => {
                return {key:item.id,value:item.name as string}
            }),
            onAdd:()=>{
                options.instance.modalRef.viewModel.visible = true;
                options.instance.modalRef.viewModel.title = '添加分组';
                const timeid = setTimeout(() => {
                    options.instance.clearGroupFormData()
                    clearTimeout(timeid)
                },50)
            },
            onEdit:()=>{
                const InputDataModel: PropertyFormElementFormFields = formPropertyApp.formComponentProperyRef.viewModel.InputDataModel as PropertyFormElementFormFields
                if (!InputDataModel.groupList.value) {
                    message.warning('请先选择需要编辑的分组');
                    return;
                }
                options.instance.modalRef.viewModel.visible = true;
                options.instance.modalRef.viewModel.title = '编辑分组';
                const item = formPropertyApp.formPropertyViewModel.group.find((model) => model.id.toString() === InputDataModel.groupList.value.key)
                const value = PropertyFormGroupGlobalFormFields.dataToFormFields<PropertyFormGroupGlobalFormFields,{}>(new PropertyFormGroupGlobalFormFields(),item)
                options.instance.formGroupRef.store.updateFormInputData(options.instance.formGroupRef.uid,value,options.instance)
            },
            onDelete: () => { 
                if (!options.instance.getFormComponentPropertyViewModel.groupList.value) {
                    message.warning('请先选择需要删除的分组');
                    return;
                }
                const _oldIndex = formPropertyApp.formPropertyViewModel.group.findIndex((item) => item.id.toString() === options.instance.getFormComponentPropertyViewModel.groupList.value.key)
                formPropertyApp.formPropertyViewModel.group.splice(_oldIndex,1);
                message.success('删除成功');
            }
        })
        return [
            formUtils.getFormConfig('layout'),
            formUtils.getFormConfig('sizes'),
            formUtils.getFormConfig('groupListRender'),
            ]
    }
    createAddSelectOptionsValue(options:{addSelectValueInstance:AddSelectValue}){
        const formUtils = this.createFormUtils()
        const formPropertyApp = options.addSelectValueInstance.props.store.context.formPropertyApp;
        const rules =  this.createRulesInstance<PropertyKeyValueFormFieldsRule>(PropertyKeyValueFormFieldsRule);
        return [
            ...this.createApiParamsComponen(formUtils,{
                switchOptions: [{
                    name: 'isRemote',
                    label: '远程搜索',
                    rules: rules.isRemote,
                    onChange: (value) => {
                    }
                },{
                    name: 'isPageing',
                    label: '分页',
                    rules: rules.isPageing,
                    onChange: (value) => {
                    }
                }],
                apiOptions: {
                    name: 'apiUrl',
                    label: '请求接口',
                    rules:rules.apiUrl,
                },
                tokenOptions: {
                    name: 'token',
                    label: '权限令牌',
                    rules:rules.token,
                    onEdit:()=>{
                        runInAction(()=>{
                            formPropertyApp.formAddKeyValueCodeExpressionModalRef.viewModel.visible = true;
                            formPropertyApp.formAddKeyValueCodeExpressionModalRef.viewModel.title = '编辑表达式'
                            formPropertyApp.formSelectValueModalRef.viewModel.visible = false;
                            const item = formPropertyApp.getAddSelectValueFormPropertyValue('token')
                            formPropertyApp.formPropertyViewModel.editComponentData.property = 'token';
                            formPropertyApp.formPropertyViewModel.codeValue =item?(item): FORMSELECTTOKEN;
                            formPropertyApp.formPropertyViewModel.codeEditorprop.readOnly = false;
                        })
                        
                    }
                },
                methodOptions: {
                    name: 'method',
                    label: '请求方式',
                    rules:rules.method,
                },
                paramsOptions: {
                    name: 'params',
                    label: '请求参数',
                    rules: rules.params,
                    onEdit:()=>{
                        runInAction(()=>{
                            const item = formPropertyApp.getAddSelectValueFormPropertyValue('params')
                            formPropertyApp.formSelectValueModalRef.viewModel.visible = false;
                            formPropertyApp.formPropertyViewModel.editComponentData.property = 'params';
                            formPropertyApp.formAddKeyValueCodeExpressionModalRef.viewModel.visible = true;
                            formPropertyApp.formAddKeyValueCodeExpressionModalRef.viewModel.title='编辑表达式'
                            formPropertyApp.formPropertyViewModel.codeValue =item?(item as string): FORMSELECTPRAMS;
                            formPropertyApp.formPropertyViewModel.codeEditorprop.readOnly = false;
                        })
                        
                    }
                },
                transformOptions: {
                    name: 'transform',
                    label: '数据变换',
                    rules: rules.transform,
                    onEdit: () => {
                        runInAction(()=>{
                            formPropertyApp.formAddKeyValueCodeExpressionModalRef.viewModel.visible = true;
                            formPropertyApp.formSelectValueModalRef.viewModel.visible = false;
                            formPropertyApp.formAddKeyValueCodeExpressionModalRef.viewModel.title = '编辑表达式'
                            const item = formPropertyApp.getAddSelectValueFormPropertyValue('transform')
                            formPropertyApp.formPropertyViewModel.editComponentData.property = 'transform';
                            formPropertyApp.formPropertyViewModel.codeValue =item?(item as string):  FORMSELECTTRANSFORM;
                            formPropertyApp.formPropertyViewModel.codeEditorprop.readOnly = false;
                        })
                    }
                },
                vmodelOptions:{
                    name: 'model',
                    label: 'model',
                    rules: rules.model,
                    onEdit: () => {
                        formPropertyApp.formAddKeyValueCodeExpressionModalRef.viewModel.visible = true;
                        formPropertyApp.formSelectValueModalRef.viewModel.visible = false;
                        /* formPropertyApp.formPropertyViewModel.editComponentData.property = 'model'; */
                        formPropertyApp.formAddKeyValueCodeExpressionModalRef.viewModel.title = '编辑表达式(只读)'
                        runInAction(()=>{
                            formPropertyApp.formPropertyViewModel.codeValue = FORMSELECTMODEL
                            formPropertyApp.formPropertyViewModel.codeEditorprop.readOnly = true;
                        })
                    }
                }
            })
        ]
    }
    createTableColumnsConfig(onAdd:()=>void,data:{ id: string,labelKey: string; labelValue: string; label?: string }[]=[],options:{instance:AddTableColumns}) {
        const rules = this.createRulesInstance<PropertyKeyValueFormFieldsRule>(PropertyKeyValueFormFieldsRule,options.instance);
        const formUtils = this.createFormUtils()
        const formPropertyApp = options.instance.props.store.context.formPropertyApp;
        this.createTableConfig(formUtils,{
            columns:[{
                key: 'title',
                title: '列名称',
                dataIndex: 'title',
                width: '160px',
                render: (_,record,index: number) => {
                    const labelValueInput = formUtils.renderInputConfig({
                        iAntdProps: formUtils.createAntdProps(`labelValue${record['id']}`,null),
                        iFormProps: {
                            ...formUtils.createLayout(Question('','下拉选项客户端展示使用,便于使用者识别'),4,2 * 9),
                            onChange: (value) => {
                                // @ts-ignore
                                const resul = value as string;
                                const index =  formPropertyApp.formPropertyViewModel.selectValueData.findIndex((item)=>item.id===record['id'])
                                if (index > -1) {
                                    formPropertyApp.formPropertyViewModel.dispatchAction(() => {
                                        formPropertyApp.formPropertyViewModel.selectValueData[index] = { ...formPropertyApp.formPropertyViewModel.selectValueData[index],...{ labelValue:resul } }
                                   })
                                }
                            },
                        },
                        rules:rules.labelValue,
                    })
                    return formPropertyApp.formAddSelectValueRef&&formUtils.createFormComponent(labelValueInput,formPropertyApp.formAddSelectValueRef.viewModel.form,formPropertyApp.formAddSelectValueRef.uid,formPropertyApp.formAddSelectValueRef)
                },
            },{
                key: 'dataIndex',
                title: '属性名称',
                dataIndex: 'dataIndex',
                width: '160px',
                render: (_,record,index: number) => {
                    
                    const labelKeyInput = formUtils.renderInputConfig({
                        iAntdProps: formUtils.createAntdProps(`labelKey${record['id']}`,null),
                        iFormProps: {
                            ...formUtils.createLayout(Question('','下拉选项服务端展示使用,便于开发者使用此值查询，更改数据'),4,2 * 9),
                            onChange: (value) => {
                                 // @ts-ignore
                                const resul = value as string;
                                const index =  formPropertyApp.formPropertyViewModel.selectValueData.findIndex((item)=>item.id===record['id'])
                                if (index > -1) {
                                    formPropertyApp.formPropertyViewModel.dispatchAction(() => {
                                        formPropertyApp.formPropertyViewModel.selectValueData[index] = { ...formPropertyApp.formPropertyViewModel.selectValueData[index],...{ labelKey: resul } }
                                   })
                               }
                            },
                        },
                        rules:rules.labelKey,
                    })
                    return formPropertyApp.formAddSelectValueRef&&formUtils.createFormComponent(labelKeyInput,formPropertyApp.formAddSelectValueRef.viewModel.form,formPropertyApp.formAddSelectValueRef.uid,formPropertyApp.formAddSelectValueRef)
                },
                }],
            onReady:(value)=>{
                formPropertyApp.formAddSelectValueTableRef = value
            },
            //@ts-ignore
            data: data,
            onAdd: () => {
                onAdd&&onAdd()
            },
            onDelete: () => {
               const rows= formPropertyApp.formAddSelectValueTableRef.viewModel.selectedRows;
               if(rows.length>0){
                   OpenDeleteConfirm({
                       onOk: () => {
                           rows.map((item) => {
                                formPropertyApp.formPropertyViewModel.dispatchAction(()=>{
                                    const index =  formPropertyApp.formPropertyViewModel.selectValueData.findIndex((m)=>m.id===item.id);
                                    formPropertyApp.formPropertyViewModel.selectValueData =  formPropertyApp.formPropertyViewModel.selectValueData.splice(index,1);
                                })
                            })
                       }
                   })
               }else{
                   message.warn('请先选择需要删除的数据')
               }
            }
        })
        return [
            formUtils.getFormConfig('CustomTable'),
            /* formUtils.getFormConfig('groupId'), */
        ]
    }
}