/*生成项目信息组件
 * @Author: duanguang 
 * @Date: 2020-08-01 14:40:03 
 * @Last Modified by: duanguang
 * @Last Modified time: 2020-08-02 22:57:30
 */

import React from 'react';
import { HLFormContainer } from 'hoolinks-legion-design';
import { ProjectFormFields, ProjectFormFieldsRule } from '../../models/form/projectFormFields';
import { bind,observer } from 'legions/store-react';
import ProjectStore from '../../stores/projectStore';
import { InstanceForm } from 'hoolinks-legion-design/lib/typings/components';
import { WrappedFormUtils } from 'hoolinks-legion-design/lib/typings/antd';
import { IHLFormUtils } from '../property/formConfig/formBasePropertyConfig';
import { IAntdProps,IAntdRule } from 'hoolinks-legion-design/lib/typings/antd';
import {
    IFormInputProps,
    IFormSelectProps,
} from 'hoolinks-legion-design/lib/typings/components';
import { LabelWithInputModel,LabelWithHLSelectModel } from 'hoolinks-legion-design/lib/models/HLForm'
import { FEATURE_MODULES, WAREHOUSE_LIST } from '../../constants/system/gitConfig';



interface IProps {
    store?: ProjectStore;
    controls: (that?: CreateProject) => Array<IHLFormUtils['componentModel']>
}
/** 创建项目仓库信息表单组件 */
@bind({ store: ProjectStore })
@observer
export default class CreateProject extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props)
    }
    createProjectFormConfig() {
       return this.props.controls && this.props.controls(this)
    }
    render() {
        const { formFields } = this.props.store
        return (
            <HLFormContainer
                <ProjectFormFields>
                {...formFields}
                mapPropsToFields={(props) => {
                    return new ProjectFormFields(props)
                }}
                onFieldsChange={(props,formFields) => {
                    this.props.store.setFormFields(formFields)
                    if (this.props.store.projectEditViewModel.computedLoad === 'complete') {
                        this.props.store.projectEditViewModel.updateLoadingState('none');
                    }
                }}
                onGetForm={(form,ref) => {
                    this.props.store.createProjectFormRef ={...ref,that:this}
                }}
                colCount={1}
                controls={this.createProjectFormConfig()}
            ></HLFormContainer>
        )
    }
}

export function createProjectFormConfig(that: CreateProject) {
    const rules = ProjectFormFieldsRule.createFormRules<ProjectFormFieldsRule>(ProjectFormFieldsRule,{that});
    const modulesName: [IAntdProps,IFormSelectProps,IAntdRule[]] = [{
        id: 'modulesName',
        name: 'modulesName',
        placeholder: '系统模块',
    },
    {
        label: '系统模块',
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
        labelInValue: true,
        options: FEATURE_MODULES.filter((item) => item.warehouseKey === that.props.store.projectEditViewModel.selectedWarehouseKey).map((item) => {
            return { key: item.key,keyValue: item.keyValue,value: item.value }
        }),
    },rules.modulesName]
    /*  const templateType: [IAntdProps,IFormSelectProps,IAntdRule[]] = [{
         id: 'templateType',
         name: 'templateType',
         placeholder: '模板类型',
     },
     {
         label: '模板类型',
         labelCol: {
             span: 8,
         },
         wrapperCol: {
             span: 16,
         },
         labelInValue: true,
         options: [{ key: 'pageList',value: '列表页',title: 'pageList' },{ key: 'form',value: '表单',title: 'form' }],
     },rules.templateType] */

    const projectSrc: [IAntdProps,IFormInputProps,IAntdRule[]] = [{
        id: 'projectSrc',
        name: 'projectSrc',
        placeholder: '格式/xxx',
    },
    {
        label: '项目存放路径',
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
        maxLength: '160',
    },rules.projectSrc]

    const gitUserName: [IAntdProps,IFormInputProps,IAntdRule[]] = [{
        id: 'gitUserName',
        name: 'gitUserName',
        placeholder: 'Git账户名',
    },
    {
        label: 'Git账户名',
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
        maxLength: '16',
    },rules.gitUserName]
    const branch: [IAntdProps,IFormInputProps,IAntdRule[]] = [{
        id: 'branch',
        name: 'branch',
        placeholder: '功能分支名称',
    },
    {
        label: '分支名称',
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
        maxLength: '16',
    },rules.branch]

    const gitPwd: [IAntdProps,IFormInputProps,IAntdRule[]] = [{
        id: 'gitPwd',
        name: 'gitPwd',
        placeholder: 'Git密码',
    },
    {
        label: 'Git密码',
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
        maxLength: '16',
        type: 'password',
    },rules.gitPwd]

    const warehouse: [IAntdProps,IFormSelectProps,IAntdRule[]] = [{
        id: 'warehouse',
        name: 'warehouse',
        placeholder: '远程仓库',
    },
    {
        label: '远程仓库',
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
        labelInValue: true,
        options: [{ key: '000',value: '请选择' },...WAREHOUSE_LIST],
        onChange: (value) => {
            that.props.store.projectEditViewModel.selectedWarehouseKey = value['key']
            // @ts-ignore
            that.props.store.setFormFields({ modulesName: { value: { key: '',label: '',title: '' } } })
        },
        /*  options: [{ key: 'http://user:pwd@192.168.200.99:3000/Front-End-Project/hoolinks-pay-web.git',value: 'hoolinks-pay-web',title: 'hoolinks-system-web' }], */
    },rules.warehouse]
    return [
        new LabelWithHLSelectModel(...warehouse),
        new LabelWithHLSelectModel(...modulesName),
        /* new LabelWithInputModel(...modulesEnName), */
        new LabelWithInputModel(...projectSrc),
        new LabelWithInputModel(...gitUserName),
        new LabelWithInputModel(...gitPwd),
        new LabelWithInputModel(...branch),
        /* new LabelWithHLSelectModel(...templateType), */
        /* new LabelWithInputModel(...componentName), */
    ]
}

export function updateProjectFormConfig(that: CreateProject) {
    const rules = ProjectFormFieldsRule.createFormRules<ProjectFormFieldsRule>(ProjectFormFieldsRule,{that});
    const modulesName: [IAntdProps,IFormSelectProps,IAntdRule[]] = [{
        id: 'modulesName',
        name: 'modulesName',
        placeholder: '系统模块',
    },
    {
        label: '系统模块',
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
        labelInValue: true,
        options: FEATURE_MODULES.filter((item) => item.warehouseKey === that.props.store.projectEditViewModel.selectedWarehouseKey).map((item) => {
            return { key: item.key,keyValue: item.keyValue,value: item.value }
        }),
    },rules.modulesName]

    const componentName: [IAntdProps,IFormInputProps,IAntdRule[]] = [{
        id: 'componentName',
        name: 'componentName',
        placeholder: '模板名称只能是英文字符，最大长度为16',
    },
    {
        label: '模块名称',
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
        maxLength: '16',
    },rules.componentName]

    const warehouse: [IAntdProps,IFormSelectProps,IAntdRule[]] = [{
        id: 'warehouse',
        name: 'warehouse',
        placeholder: '远程仓库',
    },
    {
        label: '远程仓库',
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
        labelInValue: true,
        disabled:true,
        options: [{ key: '000',value: '请选择' },...WAREHOUSE_LIST],
    },rules.warehouse]
    return [
        new LabelWithHLSelectModel(...warehouse),
        new LabelWithHLSelectModel(...modulesName),
        new LabelWithInputModel(...componentName),
    ]
}
