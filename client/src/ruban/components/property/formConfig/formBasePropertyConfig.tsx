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
import { PropertyKeyValueFormFieldsRule } from '../../../models/form/propertyFormModel';
const { Panel } = Collapse;
interface IProps {}
interface IState{ }
type IFormRules<FormRules> = {
    [P in keyof FormRules]: IAntdRule[];
}
export interface IHLFormUtils{
    componentModel:LabelWithInputModel | LabelWithInputNumberModel| LabelWithDatePickerModel | LabelWithMonthPickerModel |
    LabelWithRangePickerModel | LabelWithUploadModel | LabelWithSwitchModel |
    LabelWithRadioButtonModel | LabelWithTextModel|LabelWithHLSelectModel
}
interface IRenderCommonComponentOptions{
    name: string;
    placeholder?: string;
    label: string|React.ReactNode;
    rules: IAntdRule[];
    onChange?: (value: boolean) => void;
}
interface IRenderInputComponentOptions extends IRenderCommonComponentOptions{
    type?: 'number' | 'text' | 'textarea';
    disabled?: boolean;
    addonAfter?:React.ReactNode
}
interface IRenderSwitchComponentOptions extends IRenderCommonComponentOptions{
}
interface IRenderRadioButtonComponentOptions extends IRenderCommonComponentOptions{
    options: { label: string;value:string}[]
}
interface IRenderApiComponentOptions{
    switchOptions?: IRenderCommonComponentOptions[]|IRenderCommonComponentOptions;
    apiOptions: IRenderCommonComponentOptions;
    tokenOptions: IRenderCommonComponentOptions&{onEdit?:()=>void};
    methodOptions: IRenderCommonComponentOptions;
    paramsOptions: IRenderCommonComponentOptions&{onEdit?:()=>void};
    transformOptions: IRenderInputComponentOptions&{onEdit?:()=>void};
    vmodelOptions?: IRenderInputComponentOptions&{onEdit?:()=>void};
}
interface IRenderDataOrginSourceComponentOptions extends IRenderCommonComponentOptions{
    options: {key:string, label: string; value: string }[]
    onAdd?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}
interface ITableConfig{
    onReady: (value:InstanceHlTable)=>void ,
    columns: TableColumnConfig<{}>[],
    data: [];
    onAdd: () => void;
    onDelete?:()=>void;
}
interface IRenderExecCodeComponentOptions extends IRenderCommonComponentOptions{
    options: {key:string, label: string; value: string }[]
    onSetting?: () => void;
    btnText?: string;
}
interface IRenderFormComponentComponentOptions{
    control: IHLFormUtils['componentModel'];
    form: WrappedFormUtils;
    formRef: InstanceForm;
    uid: string;
}
export default abstract class FormBasePropertyConfig<P = {}> extends Component<IProps & P,IState> {
    span = {
        labelSpan: 6,
        wrapSpan:18,
    }
    constructor(props: IProps & P) {
        super(props)
        this.state = {
        }
    }
    createTableConfig(formUtils:HLFormUtils<ProjectStore>,options:ITableConfig) {
        const span = 6
        const wrapSpan = 18
        formUtils.renderCustomConfig({
            iAntdProps: formUtils.createAntdProps('CustomTable',2,'',{ span: 24 }),
            iFormProps: {
                render: (form,antdProps,rule,formRefs) => {
                    let ref = null;
                    return formRefs && <HLTable
                        scroll={{ x: ref && ref.viewModel.tableXAutoWidth, y: 300 }}
                        columns={options.columns}
                        bordered
                        uniqueKey="id"
                        onReady={(value) => {
                            ref = value;
                            options.onReady&&options.onReady(value)
                        }}
                        footer={()=><React.Fragment><Button onClick={() => {
                            options.onAdd&&options.onAdd()
                        }}>添加</Button><Button style={{marginLeft:'5px'}} type="danger" onClick={() => {
                            options.onDelete&&options.onDelete()
                        }}>删除</Button></React.Fragment>}
                        size="small"
                        isOpenRowChange
                        data={options.data}
                        pagination={false}
                    ></HLTable>
                },
            },
        })  
    }
    renderButtonMenu(items: { title: string; onClick:()=>void}[]) {
        return  (
            <Menu>
                {items.map((item) => {
                    return  <Menu.Item>
                        <span onClick={item.onClick}>{item.title}</span>
                    </Menu.Item>
                })}
            </Menu>
          );
    }
    createFormUtils() {
        const formUtils = new HLFormUtils<ProjectStore>({ store: ProjectStore })
        return formUtils;
    }
    createRulesInstance<T>(func: ClassOf<T>,structparame?:Object):IFormRules<T>{
        // @ts-ignore
        const rules = func.createFormRules<func>(func,structparame);
        return rules;
    }
    renderRadioButtonConfig(formUtils: HLFormUtils<ProjectStore>,options: IRenderRadioButtonComponentOptions) {
        formUtils.renderRadioButtonConfig({
            iAntdProps: formUtils.createAntdProps(options.name,null,''),
            iFormProps: {
                ...formUtils.createLayout(options.label,this.span.labelSpan,this.span.wrapSpan),
                radio: {
                    options: options.options,
                }
            },
            rules: options.rules,
        })
    }
    renderSwitchConfig(formUtils: HLFormUtils<ProjectStore>,options: IRenderSwitchComponentOptions) {
        formUtils.renderSwitchConfig({
            iAntdProps: formUtils.createAntdProps(options.name,null,''),
            iFormProps: {
                ...formUtils.createLayout(options.label,this.span.labelSpan,this.span.wrapSpan),
                onChange:(value:boolean)=>{
                    
                },
            },
            rules:options.rules,
        })
    }
    renderInputConfig(formUtils: HLFormUtils<ProjectStore>,options: IRenderInputComponentOptions) {
        const iFormProps ={};
        if(options.disabled){
            iFormProps['disabled'] = options.disabled
        }
        if (options.addonAfter) {
            iFormProps['addonAfter'] = options.addonAfter
        }
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps(options.name,null,options.placeholder||options.label as string||''),
            iFormProps: {
                ...formUtils.createLayout(options.label,this.span.labelSpan,this.span.wrapSpan),
                maxLength: '50',
                type:options.type||'text',
                ...iFormProps
            },
            rules:options.rules,
        })
    }
    createFormComponent(formUtils: HLFormUtils<ProjectStore>,options: IRenderFormComponentComponentOptions) {
       return formUtils.createFormComponent(
           options.control
            ,options.form,options.uid,options.formRef)
    }
    createExecCodeConfig(formUtils: HLFormUtils<ProjectStore>,options: IRenderExecCodeComponentOptions) {
        formUtils.renderCustomConfig({
            iAntdProps: formUtils.createAntdProps(`${options.name}Render`,null,''),
            iFormProps: {
                render: (form,antdprops,rule,formRef) => {
                    const onchage = {};
                    if (options.onChange) {
                        onchage['onChange']=options.onChange
                    }
                    return <Row>
                        <Col span={2*7+3}>
                            {this.createFormComponent(formUtils,{
                            control:formUtils.renderSelectConfig({
                                iAntdProps: formUtils.createAntdProps(options.name,null,options.placeholder||'请选择'),
                                iFormProps: {
                                    ...formUtils.createLayout(options.label,8,2 * 7),
                                    // @ts-ignore
                                    options:options.options,
                                    size:'default',
                                    labelInValue: true,
                                    ...onchage,
                                },
                                rules:options.rules,
                            }),
                            form,
                            formRef,
                            uid:formRef.uid,
                        })}
                        </Col>
                        <Col span={6+1}>
                            <Button type="primary" icon="plus" onClick={() => {
                                options.onSetting&&options.onSetting()
                            }}>{options.btnText||'立即设置'}</Button>
                        </Col>
                   </Row>  
                },
                
            },
        })
    }
    /** 渲染数据源配置项,如购置下拉静态数据,查询条件参数静态数据等 */
    createDataOrginSource(formUtils: HLFormUtils<ProjectStore>,options: IRenderDataOrginSourceComponentOptions) {
        formUtils.renderCustomConfig({
            iAntdProps: formUtils.createAntdProps(`${options.name}Render`,null,'',{ span: 24 }),
            iFormProps: {
                render: (form,antdprops,rule,formRef) => {
                    return <Row>
                        <Col span={2*7+3}>
                            {this.createFormComponent(formUtils,{
                            control:formUtils.renderSelectConfig({
                                iAntdProps: formUtils.createAntdProps(options.name,null,options.placeholder||'请选择'),
                                iFormProps: {
                                    ...formUtils.createLayout(options.label,8,2 * 7),
                                    // @ts-ignore
                                    options:options.options,
                                    size:'default',
                                    labelInValue:true,
                                },
                                rules:options.rules,
                            }),
                            form,
                            formRef,
                            uid:formRef.uid,
                        })}
                        </Col>
                        <Col span={6+1}>
                        <Dropdown overlay={this.renderButtonMenu([{
                                title: '添加',
                                onClick: () => {
                                   options.onAdd()
                                }
                            },{
                                title: '编辑',
                                onClick: () => {
                                    options.onEdit()  
                                }
                                },{
                                    title: '删除',
                                    onClick: () => {
                                       options.onDelete()
                                    }
                            }])} placement="bottomLeft">
                                <Button type="primary">操作</Button>
                            </Dropdown>
                        </Col>
                   </Row>  
                },
                
            },
        })
    }
    /** 创建API请求配置组件 */
    createApiParamsComponen(formUtils: HLFormUtils<ProjectStore>,options:IRenderApiComponentOptions):Array<IHLFormUtils['componentModel']> {
        let switchOptions :IRenderCommonComponentOptions[]= []
        if (!Array.isArray(options.switchOptions)) {
            switchOptions = [options.switchOptions]
        } else {
            switchOptions= options.switchOptions||[]
        }
        switchOptions.map((item) => {
            formUtils.renderSwitchConfig({
                iAntdProps: formUtils.createAntdProps(item.name,null,''),
                iFormProps: {
                    ...formUtils.createLayout(item.label,this.span.labelSpan,this.span.wrapSpan),
                    onChange:(value:boolean)=>{
                        /* this.field.map((item) => {
                            this.props.store.formProperyOperattionRef.viewModel.setFormState(item,{visible:value}) 
                        }) */
                    },
                },
                rules:item.rules,
            })
        })
        
        this.renderInputConfig(formUtils,{
            name: options.apiOptions.name,
            label: options.apiOptions.label,
            rules:options.apiOptions.rules
        })
        formUtils.renderSelectConfig({
            iAntdProps: formUtils.createAntdProps(options.methodOptions.name,null,options.methodOptions.placeholder||'请求方式'),
            iFormProps: {
                ...formUtils.createLayout('请求方式',this.span.labelSpan,this.span.wrapSpan),
                options: [
                    { value: 'get',key: 'get' },
                    {value:'post',key:'post'},
                ],
            },
            rules:options.methodOptions.rules,
        })
        formUtils.renderCustomConfig({
            iAntdProps: formUtils.createAntdProps(`${options.paramsOptions.name}Render`,null,'',{ span: 24 }),
            iFormProps: {
                render: (form,antdprops,rule,formRef) => {
                    return <Row>
                        <Col span={2*9}>
                            {
                                formUtils.createFormComponent(formUtils.renderInputConfig({
                                    iAntdProps: formUtils.createAntdProps(options.paramsOptions.name,null,''),
                                    iFormProps: {
                                        ...formUtils.createLayout(options.paramsOptions.label,8,2 * 7),
                                        disabled:true,
                                    },
                                    rules:options.paramsOptions.rules,
                                }),form,formRef.uid,formRef)
                          }
                        </Col>
                        <Col span={6} style={{marginTop:'4px'}}>
                           <Button onClick={() => {
                                options.paramsOptions.onEdit&& options.paramsOptions.onEdit()
                            }}>编辑表达式</Button>
                        </Col>
                   </Row>  
                },
            },
        })
        
        formUtils.renderCustomConfig({
            iAntdProps: formUtils.createAntdProps(`${options.tokenOptions.name}Render`,null,'',{ span: 24 }),
            iFormProps: {
                render: (form,antdprops,rule,formRef) => {
                    return <Row>
                        <Col span={2*9}>
                            {
                                formUtils.createFormComponent(formUtils.renderInputConfig({
                                    iAntdProps: formUtils.createAntdProps(options.tokenOptions.name,null,''),
                                    iFormProps: {
                                        ...formUtils.createLayout(options.tokenOptions.label,8,2 * 7),
                                        disabled:true,
                                    },
                                    rules:options.tokenOptions.rules,
                                }),form,formRef.uid,formRef)
                          }
                        </Col>
                        <Col span={6} style={{marginTop:'4px'}}>
                           <Button onClick={() => {
                                options.tokenOptions.onEdit&& options.tokenOptions.onEdit()
                            }}>编辑表达式</Button>
                        </Col>
                   </Row>  
                },
            },
        })
        formUtils.renderCustomConfig({
            iAntdProps: formUtils.createAntdProps(`${options.vmodelOptions.name}Render`,null,'',{ span: 24 }),
            iFormProps: {
                render: (form,antdprops,rule,formRef) => {
                    return <Row>
                        <Col span={2*9}>
                            {
                                formUtils.createFormComponent(formUtils.renderInputConfig({
                                    iAntdProps: formUtils.createAntdProps(options.vmodelOptions.name,null,''),
                                    iFormProps: {
                                        ...formUtils.createLayout(options.vmodelOptions.label,8,2 * 7),
                                        disabled:true,
                                    },
                                    rules:options.vmodelOptions.rules,
                                }),form,formRef.uid,formRef)
                          }
                        </Col>
                        <Col span={6} style={{marginTop:'4px'}}>
                           <Button onClick={() => {
                                options.vmodelOptions.onEdit&& options.vmodelOptions.onEdit()
                            }}>编辑表达式</Button>
                        </Col>
                   </Row>  
                },
            },
        })
        formUtils.renderInputConfig({
            iAntdProps: formUtils.createAntdProps(options.transformOptions.name,null,''),
            iFormProps: {
                ...formUtils.createLayout(options.transformOptions.label,this.span.labelSpan,this.span.wrapSpan),
                maxLength: '50',
                disabled:true,
                addonAfter: (<Button onClick={() => {
                    options.transformOptions.onEdit&& options.transformOptions.onEdit()
                }}>编辑表达式</Button>)
            },
            rules:options.transformOptions.rules,
        })
        return [
            formUtils.getFormConfig(options.apiOptions.name),
            formUtils.getFormConfig(options.methodOptions.name),
            formUtils.getFormConfig(`${options.paramsOptions.name}Render`),
            formUtils.getFormConfig(`${options.tokenOptions.name}Render`),
            formUtils.getFormConfig(`${options.vmodelOptions.name}Render`),
            formUtils.getFormConfig(`${options.transformOptions.name}`),
            ... switchOptions.map((item) => {
                return formUtils.getFormConfig(item.name)
            }),
        ]
    }
}