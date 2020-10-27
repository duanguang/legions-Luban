import { IBaseFormFields,BaseFormFields } from 'hoolinks-legion-design/lib/models/BaseFormFields'
import { createFormRule,FormRuleProperty } from 'hoolinks/form-rule';
import { formatDate } from 'hoolinks/date-format'
import ProjectEdit from '../../containers/project/projectEdit';
import { windowsPathValidation,linuxPathValidation,getOperationSys } from '../../utils/utils';
import { GIT_URL } from '../../constants/system/gitConfig';
import { HttpConfig } from '../../constants/httpConfig';
import { HlLabeledValue } from 'hoolinks-legion-design/lib/models/HlLabeledValue';
import camelCase from 'lodash/camelCase';
export class ProjectFormFields extends BaseFormFields {

    @FormRuleProperty({
        required: true,
        name: 'gitUserName',
        error: '分支名称不能为空',
        desc: '分支名称',
        type: 'string',
    })
    branch: IBaseFormFields<string,string,ProjectFormFields> = {
        value: '',
        submitBeforeTransform: (value,formFields) => {
            console.log(formatDate(new Date(),'yyyyMMdd'))
            return `feature/${formatDate(new Date(),'yyyyMMdd')}/${formFields.gitUserName.value}/${value}`
        },
    }
    /**
     * 项目名称
     *
     *
     * @memberof GroupManageAddFrom
     * @groupName 事业部名称
     */
    @FormRuleProperty({
        required: true,
        name: 'modulesName',
        error: '系统模块',
        desc: '系统模块',
        type: 'object',
        validator(value: { key: string; label: string; title: string },error: string,callback: Function,props: ProjectEdit) { // 自定义验证规则
            if (value && !value.key) {
                callback(new Error('请先选择远程仓库'));
            }
            else {
                callback();
            }
        },
    })
    modulesName: IBaseFormFields<{ key: string; label: string; keyValue?: string; title: string },string> = {
        value: { key: '',label: '',title: '' },
        requestParamKey: 'modulesSystem',
        submitBeforeTransform: (value) => {
            return value.keyValue
        },
    }

    /**
     * git 账户名
     *
     * @type {IBaseFormFields<string>}
     * @memberof ProjectFormFields
     */
    @FormRuleProperty({
        required: true,
        name: 'gitUserName',
        error: 'Git账户名',
        desc: 'Git账户名',
        type: 'string',
        regex: /^[A-Z a-z]+$/, // 自定义验证规则
    })
    gitUserName: IBaseFormFields<string> = {
        value: '',
    }
    @FormRuleProperty({
        required: true,
        name: 'gitPwd',
        error: 'Git密码',
        desc: 'Git密码',
        type: 'string',
    })
    gitPwd: IBaseFormFields<string> = {
        value: '',
    }
    /**
     *
     * 远程仓库地址
     * @type {IBaseFormFields<{ key: string; label: string; title: string }>}
     * @memberof ProjectFormFields
     */
    @FormRuleProperty<ProjectEdit,{ key: string; label: string; title: string }>({
        required: true,
        name: 'warehouse',
        error: '远程仓库',
        desc: '远程仓库',
        type: 'object',
        /* transform: (value: { key: string; label: string; title: string }) => {
            console.log(value)
            return value&&value.key;
        }, */
        validator(value: { key: string; label: string; title: string },error: string,callback: Function,props: ProjectEdit) { // 自定义验证规则
            if (value && !value.key) {
                callback(new Error('请选择选择远程仓库'));
            }
            else {
                callback();
            }
        },
    })
    warehouse: IBaseFormFields<HlLabeledValue,string,ProjectFormFields> = {
        value: void 0,
        requestParamKey: 'gitSrc',
        submitBeforeTransform: (value,formFields) => {
            if (value) {
                const newValue = GIT_URL.replace('user',formFields.gitUserName.value).replace('pwd',formFields.gitPwd.value).replace('modules',value.label)
                return newValue
            }
            return ''
        },
    }
    @FormRuleProperty({
        required: true,
        name: 'projectSrc',
        error: '项目路径错误',
        desc: '项目路径',
        type: 'string',
        regex: /^\/(\w+\/?)+$/,
    })
    projectSrc: IBaseFormFields<string,string,ProjectFormFields> = {
        value: '',
        submitBeforeTransform: (value,formFields) => {
            if (value) {
                const newValue = `${HttpConfig.projectSrc}/${formFields.gitUserName.value}/${value}/${formFields.warehouse.value.label}`
                return newValue
            }
            return ''
        },
    }
    @FormRuleProperty({
        required: true,
        name: 'templateType',
        error: '模板类型',
        desc: '模板类型',
        type: 'object',
        validator(value: { key: string; label: string; title: string },error: string,callback: Function,props: ProjectEdit) { // 自定义验证规则
            if (value && !value.key) {
                callback(new Error('请选择选择模板类型'));
            }
            else {
                callback();
            }
        },
    })
    templateType: IBaseFormFields<HlLabeledValue,string> = {
        value: void 0,
        submitBeforeTransform: (value,formFields) => {
            return value ? value.key : ''
        },
    }
    /**
     * git 账户名
     *
     * @type {IBaseFormFields<string>}
     * @memberof ProjectFormFields
     */
    @FormRuleProperty({
        required: true,
        name: 'componentName',
        error: '模块名称只能为英文字符',
        desc: '模块名称',
        type: 'string',
        validator(value: string,error: string,callback: Function,props: { that: ProjectEdit }) { // 自定义验证规则
            const regex = /^[A-Z a-z]+$/;
            console.log(props)
            if (value && !regex.test(value)) {
                callback(new Error('模块名称只能为英文字符'));
            }
            else if (value && (camelCase(value) !== value)) {
                callback(new Error('模块名称只能输入驼峰类型字符串,示例pageList'));
            }
            else if (value && props.that.props.store.projectEditViewModel.historyComponentsFileList.findIndex((item) => item === value) > -1) {
                callback(new Error('模块已经被创建过,请重新更换名称'));
            }
            else {
                callback();
            }
        },
    })
    componentName: IBaseFormFields<string> = {
        value: '',
    }
    constructor(form?: ProjectFormFields) {
        super()
        ProjectFormFields.initMapPropsToFields.call(this,form)
    }
}

export class ProjectFormFieldsRule<P = {}> extends ProjectFormFields {
    constructor(props: P) {
        super();
        createFormRule(ProjectFormFields,this,{ props });
    }

}