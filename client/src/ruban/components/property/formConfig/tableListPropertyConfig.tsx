import React,{Component} from 'react';
import {
    PropertyColumnsConfigFormFieldsRule,
    PropertyTableDataSourceFormFieldsRule,
    PropertyTableBaseConfigFormFieldsRule,
    PropertyTableOperationFormFieldsRule,
    PropertyKeyValueFormFieldsRule
} from '../../../models/form/propertyFormModel';
import { HLFormUtils } from 'hoolinks-legion-design/lib/utils/config-utils'
import ProjectStore from '../../../stores/projectStore';
import { Row, Col, Button, Tooltip, Icon } from 'antd';
import TableProperty from '../tableProperty';
import { QuestionTooltip } from '../../questionTooltip/questionTooltip';
import OperationProerty from '../operation-proerty';
import { OperationEnum } from '../../../constants/enum-data';
import AddTableColumnsPropertyConfig from './addTableColumnsPropertyConfig';
export enum EditCodeEnum{
    transform = 1,
    VModel = 2,
    headers = 3,
    token = 4,
    onSearch = 5,
    onReset =6,
    parames = 7,
}
export default abstract class TableListPropertyConfig<P> extends Component<P>{ 
    protected instance: TableProperty
    protected operationinstance:OperationProerty
    protected field = ['paramsRenders','apiUrl','method']
    constructor(props: P) {
        super(props)
    }
    protected registerInstance(Instance: TableProperty) {
        this.instance = Instance
    }
    protected registerOperationInstance(Instance: OperationProerty) {
        this.operationinstance = Instance
    }
    protected createTableColumnsConfig() {
        const config = new AddTableColumnsPropertyConfig()
        return config.createTableColumnsConfig(this.instance)
    }
    protected createBaseConfig() {
        const span = 6
        const wrapSpan = 18
        const rules = PropertyTableBaseConfigFormFieldsRule.createFormRules<PropertyTableBaseConfigFormFieldsRule>(PropertyTableBaseConfigFormFieldsRule);
        const formUtils = new HLFormUtils<ProjectStore>({ store: ProjectStore })
        const Question = (lable:string,title:string) => {
            return (<QuestionTooltip label={lable} title={title}></QuestionTooltip>)
        }
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('uniqueKey',null,'唯一字段'),
            iFormProps: {
                ...formUtils.createLayout(Question('唯一值','表格行数据中唯一数据字段名称,主要用来保证行选中正常使用'),span,wrapSpan),
            },
            rules:rules.uniqueKey,
        })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('tableModulesName',null,'模块名称'),
            iFormProps: { 
                ...formUtils.createLayout(Question('模块名称','模块名称可不填写，由系统自动生成,系统生成的无法根据用户级别来存储。如果自行填写，请保证模块名称绝对唯一'),span,wrapSpan),
            },
            rules:rules.tableModulesName,
        })
        formUtils.renderSwitchConfig({
            iAntdProps: formUtils.createAntdProps('isOpenCustomColumns',null,''),
            iFormProps: {
                ...formUtils.createLayout((<QuestionTooltip label="自定义列" title="自定义列默认开启"></QuestionTooltip>),span,wrapSpan),
            },
            rules:rules.isOpenCustomColumns,
        })
        formUtils.renderSwitchConfig({
            iAntdProps: formUtils.createAntdProps('isExportCurrData',null,''),
            iFormProps: {
                ...formUtils.createLayout('导出当页',span,wrapSpan),
            },
            rules:rules.isExportCurrData,
        })
        formUtils.renderSwitchConfig({
            iAntdProps: formUtils.createAntdProps('isOpenRowChange',null,''),
            iFormProps: {
                ...formUtils.createLayout('行选中',span,wrapSpan),
            },
            rules:rules.isExportCurrData,
        })
        return [
            formUtils.getFormConfig('uniqueKey'),
            formUtils.getFormConfig('tableModulesName'),
            formUtils.getFormConfig('isOpenRowChange'),
            formUtils.getFormConfig('isOpenCustomColumns'),
            formUtils.getFormConfig('isExportCurrData'),
            ]
    }
    protected createDataSourceConfig() {
        const span = 6
        const wrapSpan = 18
        const rules = PropertyTableDataSourceFormFieldsRule.createFormRules<PropertyTableDataSourceFormFieldsRule>(PropertyTableDataSourceFormFieldsRule);
        const formUtils = new HLFormUtils<ProjectStore>({ store: ProjectStore })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('apiUrl',null,'请求接口'),
            iFormProps: {
                ...formUtils.createLayout('请求接口',span,wrapSpan),
                maxLength:'800',
            },
            rules:rules.apiUrl,
        })
        formUtils.renderSelectConfig({
            iAntdProps: formUtils.createAntdProps('method',null,'请求方式'),
            iFormProps: {
                ...formUtils.createLayout('请求方式',span,wrapSpan),
                options: [
                    { value: 'get',label: 'get',key: 'get' },
                    {value:'post',label:'post',key:'post'},
                ],
                labelInValue:true,
            },
            rules:rules.method,
        })
        /* formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('method',null,'请求方式应为get或者post'),
            iFormProps: {
                ...formUtils.createLayout('请求方式',span,wrapSpan),
            },
            rules:rules.method,
        }) */
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('token',null,'令牌'),
            iFormProps: {
                ...formUtils.createLayout('令牌',span,wrapSpan),
                disabled:true,
                addonAfter:(<Button size="small" type="primary" onClick={this.instance.handleEditCode.bind(this.instance,EditCodeEnum.token)}>编辑</Button>),
            },
            rules:rules.token,
        })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('parames',null,'搜索条件'),
            iFormProps: {
                ...formUtils.createLayout('搜索条件',span,wrapSpan),
                disabled:true,
                addonAfter:(<Button size="small" type="primary" onClick={this.instance.handleEditCode.bind(this.instance,EditCodeEnum.parames)}>编辑</Button>),
            },
            rules:rules.onSearch,
        })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('onSearch',null,'搜索'),
            iFormProps: {
                ...formUtils.createLayout('搜索',span,wrapSpan),
                disabled:true,
                addonAfter:(<Button size="small" type="primary" onClick={this.instance.handleEditCode.bind(this.instance,EditCodeEnum.onSearch)}>编辑</Button>),
            },
            rules:rules.onSearch,
        })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('onReset',null,'重置'),
            iFormProps: {
                ...formUtils.createLayout('重置',span,wrapSpan),
                disabled:true,
                addonAfter:(<Button size="small" type="primary" onClick={this.instance.handleEditCode.bind(this.instance,EditCodeEnum.onReset)}>编辑</Button>),
            },
            rules:rules.onReset,
        })
        formUtils.renderCustomConfig({
            iAntdProps: formUtils.createAntdProps('headersRenders',null,'',{ span: 24 }),
            iFormProps: {
                render: (form,antdprops,rule,formRef) => {
                    return <Row>
                        <Col span={2*9}>
                            {
                                formUtils.createFormComponent(formUtils.renderInputConfig({
                                    iAntdProps: formUtils.createAntdProps('headers',null,''),
                                    iFormProps: {
                                        ...formUtils.createLayout('headers',8,2 * 7),
                                        disabled:true,
                                    },
                                    rules:rules.headers,
                                }),form,formRef.uid,formRef)
                          }
                        </Col>
                        <Col span={6} style={{marginTop:'4px'}}>
                            <Button onClick={this.instance.handleEditCode.bind(this.instance,3)}>编辑Headers</Button>
                        </Col>
                   </Row>  
                },
                
            },
        })
        formUtils.renderCustomConfig({
            iAntdProps: formUtils.createAntdProps('transformRenders',null,'',{ span: 24 }),
            iFormProps: {
                render: (form,antdprops,rule,formRef) => {
                    return <Row>
                        <Col span={2*9}>
                            {
                                formUtils.createFormComponent(formUtils.renderInputConfig({
                                    iAntdProps: formUtils.createAntdProps('transform',null,''),
                                    iFormProps: {
                                        ...formUtils.createLayout('数据变换',8,2 * 7),
                                        disabled:true,
                                    },
                                    rules:rules.transform,
                                }),form,formRef.uid,formRef)
                          }
                        </Col>
                        <Col span={6} style={{marginTop:'4px'}}>
                            <Button onClick={this.instance.handleEditCode.bind(this.instance,1)}>编辑代码</Button>
                        </Col>
                   </Row>  
                },
                
            },
        })
        formUtils.renderCustomConfig({
            iAntdProps: formUtils.createAntdProps('VModelRenders',null,'',{ span: 24 }),
            iFormProps: {
                render: (form,antdprops,rule,formRef) => {
                    return <Row>
                        <Col span={2*9}>
                            {
                                formUtils.createFormComponent(formUtils.renderInputConfig({
                                    iAntdProps: formUtils.createAntdProps('model',null,''),
                                    iFormProps: {
                                        ...formUtils.createLayout('VModel',8,2 * 7),
                                        disabled:true,
                                    },
                                    rules:rules.model,
                                }),form,formRef.uid,formRef)
                          }
                        </Col>
                        <Col span={6} style={{marginTop:'4px'}}>
                            <Button onClick={this.instance.handleEditCode.bind(this.instance,2)}>编辑VModel</Button>
                        </Col>
                   </Row>  
                },
                
            },
        })
        return [
            formUtils.getFormConfig('apiUrl'),
            formUtils.getFormConfig('method'),
            formUtils.getFormConfig('token'),
            formUtils.getFormConfig('parames'),
            formUtils.getFormConfig('onSearch'),
            formUtils.getFormConfig('onReset'),
            formUtils.getFormConfig('headersRenders'),
            formUtils.getFormConfig('transformRenders'),
            formUtils.getFormConfig('VModelRenders'),
            ]
    }
    protected createOperationConfig() {
        const span = 6
        const wrapSpan = 18
        const rules = PropertyTableOperationFormFieldsRule.createFormRules<PropertyTableOperationFormFieldsRule>(PropertyTableOperationFormFieldsRule);
        const formUtils = new HLFormUtils<ProjectStore>({ store: ProjectStore })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('apiUrl',null,'请求接口'),
            iFormProps: {
                ...formUtils.createLayout('请求接口',span,wrapSpan),
                maxLength:'800',
            },
            rules:rules.apiUrl,
        })
        formUtils.renderSelectConfig({
            iAntdProps: formUtils.createAntdProps('method',null,'请求方式'),
            iFormProps: {
                ...formUtils.createLayout('请求方式',span,wrapSpan),
                options: [
                    { value: 'get',key: 'get' },
                    {value:'post',key:'post'},
                ],
            },
            rules:rules.method,
        })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('name',null,'按钮中文名称'),
            iFormProps: {
                ...formUtils.createLayout('名称',span,wrapSpan),
            },
            rules:rules.name,
        })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('nameEn',null,'请填写英文，且首字母大写'),
            iFormProps: {
                ...formUtils.createLayout('英文名称',span,wrapSpan),
            },
            rules:rules.nameEn,
        })
        const TablePropertyApp = this.operationinstance.props.store.context.listPagePropertyApp.context.TablePropertyApp;
        const options =TablePropertyApp.viewModel.operationConfigCode.find(item=>item.id===TablePropertyApp.viewModel.openOperationConfigId)
        formUtils.renderCustomConfig({
            iAntdProps: formUtils.createAntdProps('paramsRenders',null,'',{ span: 24 }),
            iFormProps: {
                render: (form,antdprops,rule,formRef) => {
                    return <Row>
                        <Col span={2*9}>
                            {

                                formUtils.createFormComponent(
                                    formUtils.renderSelectConfig({
                                        iAntdProps: formUtils.createAntdProps('params',null,'请求参数'),
                                        iFormProps: {
                                            ...formUtils.createLayout('请求参数',8,2*7),
                                            options: options?options.paramsList:[],
                                            size:'default',
                                            labelInValue:true,
                                        },
                                        rules:rules.params,
                                    })
                                    ,form,formRef.uid,formRef)
                          }
                        </Col>
                        <Col span={6}>
                            <Button size="small" onClick={this.operationinstance.handleEditCode.bind(this,OperationEnum.addOperationParams)}>编辑</Button>
                            <Button size="small" type="danger" onClick={this.operationinstance.deleteParams.bind(this)}>删除</Button>
                        </Col>
                   </Row>  
                },
                
            },
        })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('onClick',null,'单击事件'),
            iFormProps: {
                ...formUtils.createLayout('单击事件',span,wrapSpan),
                disabled:true,
                addonAfter:(<Button size="small" type="primary" onClick={this.operationinstance.handleEditCode.bind(this,OperationEnum.editOperationOnlickCode)}>编辑</Button>),
            },
            rules:rules.onClick,
        })
        formUtils.renderSwitchConfig({
            iAntdProps: formUtils.createAntdProps('isNeedApi',null,''),
            iFormProps: {
                ...formUtils.createLayout('开启API',span,wrapSpan),
                onChange:(value:boolean)=>{
                    this.field.map((item) => {
                        this.operationinstance.props.store.formProperyOperattionRef.viewModel.setFormState(item,{visible:value}) 
                    })
                },
            },
            rules:rules.isNeedApi,
        })
        
        return [
            formUtils.getFormConfig('name'),
            formUtils.getFormConfig('nameEn'),
            formUtils.getFormConfig('isNeedApi'),
            formUtils.getFormConfig('method'),
            formUtils.getFormConfig('apiUrl'),
            formUtils.getFormConfig('paramsRenders'),
            formUtils.getFormConfig('onClick'),
            ]
    }
    protected createKeyVlaueConfig() {
        const span = 6
        const wrapSpan = 18
        const rules = PropertyKeyValueFormFieldsRule.createFormRules<PropertyKeyValueFormFieldsRule>(PropertyKeyValueFormFieldsRule);
        const formUtils = new HLFormUtils<ProjectStore>({ store: ProjectStore })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('value',null,'value'),
            iFormProps: {
                ...formUtils.createLayout('value',span,wrapSpan),
                maxLength:'800',
            },
            rules:rules.value,
        })
        
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps('keysId',null,'请填写英文'),
            iFormProps: {
                ...formUtils.createLayout('key',span,wrapSpan),
            },
            rules:rules.keysId,
        })
        return [
            formUtils.getFormConfig('keysId'),
            formUtils.getFormConfig('value'),
            
        ]
    }
}