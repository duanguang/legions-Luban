import React,{ Component } from 'react'
import { ListPageLayout } from 'hoolinks';
import {
    Button,
    Row,
    Col,
    Input,
    InputNumber,
    Collapse,
    message,
    Menu, Dropdown,
} from 'antd';
import { HLFormContainer,HLModal, OpenConfirm } from 'hoolinks-legion-design';
import { bind,observer } from 'legions/store-react'
import ProjectStore from '../../stores/projectStore';
import { WrappedFormUtils } from 'hoolinks-legion-design/lib/typings/antd';
import { ProjectModules } from '../../interface/project';
import { InstanceModal,InstanceForm } from 'hoolinks-legion-design/lib/typings/components';
import { observable,action,computed } from 'mobx';
import { observableViewModel } from 'legions/store-utils'
import { QuestionTooltip } from '../questionTooltip/questionTooltip';
import CodeEditor from '../codeEditor';
import {
    PropertyTableOperationFormFields,
    PropertyTableOperationFormFieldsRule,
    PropertyKeyValueFormFields,
} from '../../models/form/propertyFormModel';
import { OperationEnum } from '../../constants/enum-data';
import { HLModalContext } from '../../../common/components/modal/HLModalContext';
import { PropertyFormElementFormFieldsRule, PropertyFormElementFormFields, PropertyFormGroupGlobalFormFieldsRule, PropertyFormGroupGlobalFormFields } from '../../models/form/propertyFormElement';
import { HLFormUtils } from 'hoolinks-legion-design/lib/utils/config-utils';
import FormPropertyConfig from '../property/formConfig/formPropertyConfig';
import { shortHash } from 'hoolinks-legion-design/lib/utils/utils';
import AddCodeExpression from '../addCodeExpression';
import get from 'lodash/get'
import set from 'lodash/set'
import  has  from 'lodash/has'
import { HlLabeledValue } from 'hoolinks-legion-design/lib/models/HlLabeledValue';
interface IProps {
    store?: ProjectStore;
}
class ViewModel {
   /*  @observable tableData: { id: string,labelKey: string; labelValue: string; label?: string }[] = [] */
    @observable loading: boolean = false;
}
@bind({ store: ProjectStore })
@observer
export default class AddTableColumns extends FormPropertyConfig<IProps> {
    /** 分组信息编辑模态框实例 */
    viewModel = observableViewModel<ViewModel>(new ViewModel());
    /** 分组信息表单实例 */
    constructor(props: IProps) {
        super(props)
        this.state = {
        }
    }
    onAdd() {
        const TablePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
        this.viewModel.dispatchAction(() => {
            const uid = `${shortHash(new Date().getTime())}`
            /* if (formPropertyApp.formPropertyViewModel.selectValueData.length >= 40) {
                message.warning('为了更好的体验，最多添加40项,如果无法满足请使用表达式Expression...')
                return;
            }
            const index = formPropertyApp.formPropertyViewModel.selectValueData.findIndex((item) => item.id === uid);
            if (index < 0) {
                formPropertyApp.formPropertyViewModel.selectValueData.push({ labelKey:'',id:uid,labelValue:'' })
                formPropertyApp.formPropertyViewModel.selectValueData =formPropertyApp.formPropertyViewModel.selectValueData.slice()
            }
            else {
                message.warning('手速过快,请慢慢点,别急...')
            } */
        })
    }
    render() {
        const formPropertyApp = this.props.store.context.formPropertyApp;
        const TablePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
        const value = formPropertyApp.formPropertyViewModel.propertyData.get(formPropertyApp.formPropertyViewModel.editComponentData.keys)
        const selectOptionsValue = get(formPropertyApp.formProperyElementRef?formPropertyApp.formProperyElementRef.viewModel.InputDataModel:{},'selectOptionsValue.value') as HlLabeledValue
        return (
            <React.Fragment>
                <HLModalContext content={(<React.Fragment>
                    <HLFormContainer
                        <PropertyKeyValueFormFields>
                        {...formPropertyApp.formAddSelectValueRef && formPropertyApp.formAddSelectValueRef.viewModel.InputDataModel}
                        InputDataModel={PropertyKeyValueFormFields}
                        mapPropsToFields={(props) => {
                            return new PropertyKeyValueFormFields(props) // 实际处理结果实体
                        }}
                        onFieldsChange={(props,formFields: PropertyKeyValueFormFields) => {
                            formPropertyApp.formAddSelectValueRef.store.updateFormInputData(formPropertyApp.formAddSelectValueRef.uid,formFields,this)
                        }}
                        onGetForm={(form,ref) => {
                            formPropertyApp.formAddSelectValueRef = Object.assign(ref,{ that: this });
                        }}
                        colCount={1}
                        controls={(this.createTableColumnsConfig(this.onAdd.bind(this),formPropertyApp.formPropertyViewModel.selectValueData,this))}
                    ></HLFormContainer>
                </React.Fragment>)}>
                <HLModal
                    closable={false}
                        maskClosable={false}
                    footer={(<React.Fragment>
                        <Button onClick={() => {
                            OpenConfirm({
                                title: '关闭',
                                content: '如果不设置,将无法完整使用组件功能,您确定要取消属性设置吗？',
                                onOk: () => {
                                    formPropertyApp.formSelectValueModalRef.viewModel.visible = false;
                                }
                            })
                        }}>取消</Button>
                        <Button type="primary" onClick={() => {
                            formPropertyApp.formAddSelectValueRef.viewModel.form.validateFields((err,values: PropertyKeyValueFormFields) => {
                                if (!err) {
                                    const type = {'1':'normal','2':'expression','3':'autoQuery'}
                                    formPropertyApp.formPropertyViewModel.updatePropertyValue({value:selectOptionsValue.key,property:'selectOptionsValue',propertyType: type[selectOptionsValue.key]})
                                    if ((selectOptionsValue&&selectOptionsValue.key==='1')) {
                                        const arr = formPropertyApp.formPropertyViewModel.selectValueData.map(item => { return { key: item.labelKey,label:item.labelValue,value: item.labelValue } })
                                        // @ts-ignore 
                                        formPropertyApp.asyncElementData({ selectValue: { value: arr } })
                                        formPropertyApp.formPropertyViewModel.updatePropertyValue({
                                            value: arr,
                                            property: 'selectOptions',
                                            propertyType: 'normal',
                                            parent:'selectOptionsValue',
                                        })
                                    }
                                    if (selectOptionsValue&&selectOptionsValue.key==='3') {
                                        const autoQuery = {};
                                        ['isRemote','isPageing','apiUrl','token','method','params','transform'].map((m) => {
                                            const value = formPropertyApp.getAddSelectValueFormPropertyValue(m);
                                            autoQuery[m] = value;
                                        })
                                        formPropertyApp.formPropertyViewModel.updatePropertyValue({
                                            value: autoQuery,
                                            property: 'selectOptions',
                                            propertyType: 'autoQuery',
                                            parent:'selectOptionsValue',
                                        })
                                        /* formPropertyApp.formPropertyViewModel.updatePropertyValue(formPropertyApp.formPropertyViewModel.codeValue) */
                                    }
                                    message.success('添加成功')
                                    formPropertyApp.formSelectValueModalRef.viewModel.visible = false;
                                  }
                             }) 
                        }}>保存</Button>
                    </React.Fragment>)}
                    onReady={(value) => {
                        const width = 650;
                        TablePropertyApp.addTableColumnsModalRef = value;
                        TablePropertyApp.addTableColumnsModalRef.viewModel.okText='保存';
                        TablePropertyApp.addTableColumnsModalRef.viewModel.width = width;
                    }}>
                   
                </HLModal>
                </HLModalContext>
                <AddCodeExpression
                    onReady={(value) => {
                        formPropertyApp.formAddKeyValueCodeExpressionModalRef = value;
                    }}
                    onCancel={() => {
                        formPropertyApp.formSelectValueModalRef.viewModel.visible = true;
                    }}
                    onOk={() => {
                    const mapjson = { transform: 'transform',params: 'params',token: 'token' }
                    const formFields = {}
                    const name = mapjson[formPropertyApp.formPropertyViewModel.editComponentData.property]
                    if (name) {
                        formFields[name] = {
                            value:formPropertyApp.formPropertyViewModel.codeValue,
                        }
                        formPropertyApp.formAddSelectValueRef.store.updateFormInputData(formPropertyApp.formAddSelectValueRef.uid,formFields,this)
                    }
                        formPropertyApp.formSelectValueModalRef.viewModel.visible = true;
                        formPropertyApp.formAddKeyValueCodeExpressionModalRef.viewModel.visible = false;
                }}></AddCodeExpression>
            </React.Fragment>
        )
    }
}