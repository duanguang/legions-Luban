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
} from 'antd';
import { HLFormContainer,HLModal } from 'hoolinks-legion-design';
import { bind,observer } from 'legions/store-react'
import ProjectStore from '../../stores/projectStore';
import { WrappedFormUtils } from 'hoolinks-legion-design/lib/typings/antd';
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
import TableListPropertyConfig from './formConfig/tableListPropertyConfig';
interface IProps {
    store?: ProjectStore
    onReady: (that: OperationProerty) => void;
}
const { Panel } = Collapse;
class ViewModel {
    /**
     *
     * 模态框装载内容
     * @type {number}
     * @memberof ViewModel
     */
    @observable modalContentType:number =-1
    /**
     * 代码编辑器值
     *
     * @memberof ViewModel
     */
    @observable codeValue = ''
}
@bind({ store: ProjectStore })
@observer
export default class OperationProerty extends TableListPropertyConfig<IProps> {
    modalRef: InstanceModal = null
    viewModel = observableViewModel<ViewModel>(new ViewModel());
    constructor(props: IProps) {
        super(props)
        this.state = {
        }
        this.registerOperationInstance(this);
        this.props.onReady && this.props.onReady(this);
    }
    addOptions() {
        this.modalRef.viewModel.visible = true;
        this.modalRef.viewModel.title = '添加数据项';
    }
    deleteParams() {
        const viewModel: PropertyTableOperationFormFields = this.props.store.formProperyOperattionRef.viewModel.InputDataModel as PropertyTableOperationFormFields;
        const id = viewModel.params.value.key;
        if (id) {
            const TablePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
            const Item = TablePropertyApp.viewModel.operationConfigCode.find(item => item.id === TablePropertyApp.viewModel.openOperationConfigId);
            if (Item) {
                const _index = Item.paramsList.findIndex(item => item.key === id);
                if (_index > -1) {
                    TablePropertyApp.viewModel.dispatchAction(() => {
                        Item.paramsList.splice(_index,1)
                    })
                }
            }
        }
        console.log(this.props.store.formProperyOperattionRef.viewModel.InputDataModel)
    }
    handleEditCode = (value:number) => {
        const viewModel: PropertyTableOperationFormFields = this.props.store.formProperyOperattionRef.viewModel.InputDataModel as PropertyTableOperationFormFields;
        if (value === OperationEnum.editOperationOnlickCode) {
            this.viewModel.codeValue = viewModel.onClick.value;
            this.modalRef.viewModel.title = '添加单击事件'
        } else {
            this.modalRef.viewModel.title = '添加请求参数'
        }
        this.modalRef.viewModel.visible = true;
        const width = 500;
        this.modalRef.viewModel.width = width;
        this.viewModel.modalContentType = value;
    }
    render() {
        const TbalePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
        return (
            <div>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header="组件属性" key="1">
                        <HLFormContainer
                                <PropertyTableOperationFormFields>
                                {...this.props.store.formProperyOperattionRef && this.props.store.formProperyOperattionRef.viewModel.InputDataModel}
                                InputDataModel={PropertyTableOperationFormFields}
                                mapPropsToFields={(props) => {
                                    return new PropertyTableOperationFormFields(props) // 实际处理结果实体
                                }}
                                onFieldsChange={(props,formFields) => {
                                    this.props.store.formProperyOperattionRef.store.updateFormInputData(this.props.store.formProperyOperattionRef.uid,formFields,this)
                                }}
                                onGetForm={(form,ref) => {
                                    this.props.store.formProperyOperattionRef = ref;
                                    const field = ['paramsRenders','apiUrl','method']
                                    field.map((item) => {
                                        this.props.store.formProperyOperattionRef.viewModel.setFormState(item,{visible:false}) 
                                    })
                                    
                                }}
                                colCount={1}
                                controls={this.createOperationConfig()}
                            ></HLFormContainer>
                    </Panel>
                </Collapse>
                <HLModalContext content={(<React.Fragment>
                    {this.viewModel.modalContentType===OperationEnum.editOperationOnlickCode?<CodeEditor
                        width="100%"
                        height="300px"
                        mode="typescript"
                        value={this.viewModel.codeValue}
                        onChange={(values: string) => {
                            this.viewModel.codeValue = values
                            this.props.store.formProperyOperattionRef.store.updateFormInputData(this.props.store.formProperyOperattionRef.uid,{ onClick: { value: values } },this)
                        }}
                    ></CodeEditor>:<HLFormContainer
                    <PropertyKeyValueFormFields>
                    {...this.props.store.formProperKeyValueRef && this.props.store.formProperKeyValueRef.viewModel.InputDataModel}
                    InputDataModel={PropertyKeyValueFormFields}
                    mapPropsToFields={(props) => {
                        return new PropertyKeyValueFormFields(props) // 实际处理结果实体
                    }}
                    onFieldsChange={(props,formFields) => {
                        console.log(formFields)
                        this.props.store.formProperKeyValueRef.store.updateFormInputData(this.props.store.formProperKeyValueRef.uid,formFields,this)
                    }}
                    onGetForm={(form,ref) => {
                        this.props.store.formProperKeyValueRef = ref;
                    }}
                    colCount={1}
                    controls={this.createKeyVlaueConfig()}
                ></HLFormContainer>}
                </React.Fragment>)}>
                <HLModal
                    onOk={() => {
                            if (this.viewModel.modalContentType === OperationEnum.addOperationParams) {
                            this.props.store.formProperKeyValueRef.viewModel.form.validateFields((err,values: PropertyKeyValueFormFields) => {
                                const value = PropertyKeyValueFormFields.formFieldsToData(PropertyKeyValueFormFields,this.props.store.formProperKeyValueRef.viewModel.InputDataModel)
                                const TablePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
                                if (!err) {
                                    const _index = TbalePropertyApp.viewModel.operationConfigCode.findIndex(item => item.id === TbalePropertyApp.viewModel.openOperationConfigId)
                                    if (_index > -1) {
                                        TbalePropertyApp.viewModel.dispatchAction(() => {
                                            // @ts-ignore
                                            TbalePropertyApp.viewModel.operationConfigCode[_index].paramsList.push(value)
                                            TbalePropertyApp.viewModel.operationConfigCode = TbalePropertyApp.viewModel.operationConfigCode.slice()
                                        })
                                        message.success('添加成功');
                                        this.props.store.formProperKeyValueRef.store.updateFormInputData(this.props.store.formProperKeyValueRef.uid,new PropertyKeyValueFormFields(),this)
                                        this.modalRef.viewModel.visible = false;
                                    }
                                }
                            })
                        }
                        else {
                            this.modalRef.viewModel.visible = false;
                        }  
                    }}
                    onReady={(value) => {
                        this.modalRef = value;
                        const width = 550;
                        this.modalRef.viewModel.width = width;
                    }}>
                   
                </HLModal>
                </HLModalContext>
            </div>
        )
    }
}