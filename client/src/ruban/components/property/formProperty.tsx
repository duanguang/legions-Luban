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
import { HLFormContainer,HLModal } from 'hoolinks-legion-design';
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
import { title } from 'process';
import FormPropertyConfig from './formConfig/formPropertyConfig';
import AddSelectValue from '../addSelectValue';
import get from 'lodash/get'
import set from 'lodash/set'
import  has  from 'lodash/has'
import AddCodeExpression from '../addCodeExpression';
import AddEvent from '../addEvent';
interface IProps {
    store?: ProjectStore
}
const { Panel } = Collapse;
class ViewModel {
    @observable key: string = ''
}
@bind({ store: ProjectStore })
@observer
export default class FormProerty extends FormPropertyConfig<IProps> {
    /** 分组信息编辑模态框实例 */
    modalRef: InstanceModal = null
    viewModel = observableViewModel<ViewModel>(new ViewModel());
    /** 分组信息表单实例 */
    formGroupRef: InstanceForm = null;
    constructor(props: IProps) {
        super(props)
        this.state = {
        }
        this.registerInstance(this);
    }
    
    addOptions() {
        this.modalRef.viewModel.visible = true;
        this.modalRef.viewModel.title = '添加数据项';
    }
    
    
    createElement() {
        return []
    }
    /** 获取表单属性 */
    get getFormComponentPropertyViewModel() {
        const formPropertyApp = this.props.store.context.formPropertyApp;
        const InputDataModel: PropertyFormElementFormFields = formPropertyApp.formComponentProperyRef.viewModel.InputDataModel as PropertyFormElementFormFields
        return InputDataModel
    }
    isEditGroupState() {
        const formPropertyApp = this.props.store.context.formPropertyApp;
        const title = this.modalRef.viewModel.title as string;
        if (this.getFormComponentPropertyViewModel.groupList.value && title.indexOf('编辑') > -1) {
            return true;
        }
        return false;
    }
    clearGroupFormData() {
        this.formGroupRef.store.updateFormInputData(this.formGroupRef.uid,new PropertyFormGroupGlobalFormFields(),this);
    }
    render() {
        const formPropertyApp = this.props.store.context.formPropertyApp;
        return (
            <div>
                <Collapse defaultActiveKey={['1','0']}>
                    <Panel header="表单属性" key="0">
                        <HLFormContainer
                                <PropertyFormElementFormFields>
                                {...formPropertyApp.formComponentProperyRef && formPropertyApp.formComponentProperyRef.viewModel.InputDataModel}
                                InputDataModel={PropertyFormElementFormFields}
                                mapPropsToFields={(props) => {
                                    return new PropertyFormElementFormFields(props) // 实际处理结果实体
                                }}
                                onFieldsChange={(props,formFields:PropertyFormElementFormFields) => {
                                    formPropertyApp.formComponentProperyRef.store.updateFormInputData(formPropertyApp.formComponentProperyRef.uid,formFields,this)
                                    formFields.layout && (formPropertyApp.formPropertyViewModel.layout = parseInt(formFields.layout.value));
                                    formFields.sizes&&(formPropertyApp.formPropertyViewModel.size = formFields.sizes.value);
                                }}
                                onGetForm={(form,ref) => {
                                    formPropertyApp.formComponentProperyRef = ref;
                                }}
                                colCount={1}
                                controls={this.createConfig()}
                            ></HLFormContainer>
                    </Panel>
                    <Panel header="组件属性" key="1">
                        <HLFormContainer
                            <PropertyFormElementFormFields>
                                {...formPropertyApp.formProperyElementRef && formPropertyApp.formProperyElementRef.viewModel.InputDataModel}
                                InputDataModel={PropertyFormElementFormFields}
                                mapPropsToFields={(props) => {
                                    return new PropertyFormElementFormFields(props) // 实际处理结果实体
                                }}
                                onFieldsChange={(props,formFields: PropertyFormElementFormFields) => {
                                    formPropertyApp.formProperyElementRef.store.updateFormInputData(formPropertyApp.formProperyElementRef.uid,formFields,this)
                                    formPropertyApp.asyncElementData(formFields)
                                }}
                                onGetForm={(form,ref) => {
                                    formPropertyApp.formProperyElementRef = Object.assign(ref,{ that: this });
                                }}
                                colCount={1}
                                controls={this.createElementConfig()}
                            ></HLFormContainer>
                    </Panel>
                </Collapse>
                <HLModalContext content={(<React.Fragment>
                    <HLFormContainer
                                <PropertyFormGroupGlobalFormFields>
                                {...this.formGroupRef && this.formGroupRef.viewModel.InputDataModel}
                                InputDataModel={PropertyFormGroupGlobalFormFields}
                                mapPropsToFields={(props) => {
                                    return new PropertyFormGroupGlobalFormFields(props) // 实际处理结果实体
                                }}
                                onFieldsChange={(props,formFields:PropertyFormGroupGlobalFormFields) => {
                                    this.formGroupRef.store.updateFormInputData(this.formGroupRef.uid,formFields,this)
                                }}
                                onGetForm={(form,ref) => {
                                    this.formGroupRef = ref;
                                }}
                                colCount={1}
                                controls={this.createGroupConfig()}
                            ></HLFormContainer>
                </React.Fragment>)}>
                <HLModal
                    onOk={() => {
                            this.formGroupRef.viewModel.form.validateFields((err,values: PropertyFormGroupGlobalFormFields) => { 
                                const value = PropertyFormGroupGlobalFormFields.formFieldsToData(PropertyFormGroupGlobalFormFields,this.formGroupRef.viewModel.InputDataModel)
                                if (!err) {
                                    formPropertyApp.formPropertyViewModel.dispatchAction(() => {
                                        const InputDataModel: PropertyFormElementFormFields = formPropertyApp.formComponentProperyRef.viewModel.InputDataModel as PropertyFormElementFormFields
                                        const _index = formPropertyApp.formPropertyViewModel.group.findIndex((item) =>  item.name === value['name'])
                                        if (_index < 0) {
                                            value['id'] = formPropertyApp.formPropertyViewModel.group.length + 1;
                                            console.log(value,'value')
                                            // @ts-ignore
                                            formPropertyApp.formPropertyViewModel.group.push(value);
                                           
                                            if (this.isEditGroupState()) { // 编辑状态 如果id和name 都变了，则进行新增，删除源数据
                                                const _oldIndex = formPropertyApp.formPropertyViewModel.group.findIndex((item) => item.id.toString() === InputDataModel.groupList.value.key)
                                                formPropertyApp.formPropertyViewModel.group.splice(_oldIndex,1);
                                                message.success('更新成功');
                                            }else{
                                                message.success('添加成功');
                                            }
                                            formPropertyApp.formPropertyViewModel.group =  formPropertyApp.formPropertyViewModel.group.slice()
                                            this.clearGroupFormData()
                                        } else {
                                            if (this.isEditGroupState()) { // 如果是编辑状态，且编辑后数据在源数据存在，则执行修改

                                                formPropertyApp.formPropertyViewModel.group[_index] = {
                                                    ...formPropertyApp.formPropertyViewModel.group[_index],
                                                ... {
                                                      name: value['name'],
                                                      isFolding: value['isFolding'],
                                                      isSetFormSize:value['isSetFormSize'],
                                                        /* id:value['id'] */
                                                    },
                                                }
                                                formPropertyApp.formPropertyViewModel.group = formPropertyApp.formPropertyViewModel.group.slice()
                                                message.success('数据更新成功');
                                                return;
                                            }
                                            message.warning('名称或标识重复添加,请重新填写')
                                        }
                                    })
                                }
                            })
                    }}
                    onReady={(value) => {
                        this.modalRef = value;
                        const width = 550;
                        this.modalRef.viewModel.width = width;
                    }}>
                   
                </HLModal>
                </HLModalContext>
                <AddSelectValue></AddSelectValue>
                {/* <AddCodeExpression
                    onReady={(value) => {
                        formPropertyApp.formAddEventCodeExpressionModalRef = value;
                    }}
                    onOk={() => {
                        formPropertyApp.formPropertyViewModel.updatePropertyValue({
                            value: formPropertyApp.formPropertyViewModel.codeValue,
                            propertyType: 'function',
                            property: formPropertyApp.formPropertyViewModel.editComponentData.property,
                            execast:null,// 待转化 预览时用
                        })
                        formPropertyApp.formPropertyViewModel.editComponentData.property = null;
                        formPropertyApp.formAddEventCodeExpressionModalRef.viewModel.visible = false;
                }}></AddCodeExpression> */}
                <AddEvent
                    onEdit={(record) => {
                        formPropertyApp.formPropertyViewModel.dispatchAction(() => {
                            let code = ''
                            const model = formPropertyApp.formPropertyViewModel.getPropertyValue(record['event']);
                            if(model){
                                code = model.value as string;
                            }
                            formPropertyApp.formPropertyViewModel.codeValue = code;
                            formPropertyApp.formAddEventCodeExpressionModalRef.viewModel.visible = true;
                            formPropertyApp.formAddEventCodeExpressionModalRef.viewModel.title = `${record['event']}事件`;
                            formPropertyApp.formPropertyViewModel.editComponentData.property = record['event']
                        })
                    }}
                    onDelete={(record) => {
                    formPropertyApp.formPropertyViewModel.deleteEvent(record['event'])
                    formPropertyApp.formPropertyViewModel.updateEventData();
                }}></AddEvent>
            </div>
        )
    }
}