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
import { ProjectModules } from '../../interface/project';
import { InstanceModal,InstanceForm } from 'hoolinks-legion-design/lib/typings/components';
import { observable,action,computed } from 'mobx';
import { observableViewModel } from 'legions/store-utils'
import { QuestionTooltip } from '../questionTooltip/questionTooltip';
import { PropertyQueryFormFields } from '../../models/form/propertyQueryFormFields';
import QueryConditionsPropertyConfig from './formConfig/queryConditionsPropertyConfig';
import AddSelectValue from '../addSelectValue';
import { PropertyKeyValueFormFields } from '../../models/form/propertyFormModel';
import { runInAction} from 'mobx'
interface IProps {
    store?: ProjectStore
}
const { Panel } = Collapse;
class ViewModel {
    @observable itemDataType: "1" | "2" | "3"=null
}
@bind({ store: ProjectStore })
@observer
export default class TextProperty extends Component<IProps> {
    /* formRef: InstanceForm = null
    form: WrappedFormUtils = null */
    viewModel = observableViewModel<ViewModel>(new ViewModel());
    constructor(props: IProps) {
        super(props)
        this.state = {
        }
    }
   
    createQueryConditionsPropertyConfig =()=> {
        const config = new QueryConditionsPropertyConfig()
        return config.createQueryConditionsPropertyConfig(this)
    }
    render() {
        const TbalePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
        const view = TbalePropertyApp.viewModel.currComponentView
        const formPropertyApp = this.props.store.context.formPropertyApp;
        return (
            <div>
                <Collapse defaultActiveKey={['1','2']}>
                
                    <Panel header="组件属性" key="2">
                       {/*  <Row type="flex" style={{ marginTop: '15px' }}>
                            <Col span={5}>
                                <span style={{ lineHeight: '30px' }}>默认值:</span>
                            </Col>
                            <Col span={2 * 9}>
                                
                                <Col span={2 * 5} ><Input style={{ width: '100%' }} value={view&&view.container.component.defaultValue as number} placeholder="默认值"></Input></Col>
                            </Col>
                        </Row> */}
                         <HLFormContainer
                            <PropertyQueryFormFields>
                            {...TbalePropertyApp.updateQueryConditionsFormProperyRef && TbalePropertyApp.updateQueryConditionsFormProperyRef.viewModel.InputDataModel}
                                /* {...this.viewModel.viewDataSourceForm} */
                            InputDataModel={PropertyQueryFormFields}
                            mapPropsToFields={(props) => {
                                return new PropertyQueryFormFields(props) // 实际处理结果实体
                            }}
                            onFieldsChange={(props,formFields) => {
                                TbalePropertyApp.updateQueryConditionsFormProperyRef.store.updateFormInputData(TbalePropertyApp.updateQueryConditionsFormProperyRef.uid,formFields,this)
                            }}
                            onGetForm={(form,ref) => {
                                TbalePropertyApp.updateQueryConditionsFormProperyRef = {...ref,that:this};
                                TbalePropertyApp.updateQueryConditionsFormProperyRef.viewModel.setFormState('selectOptionsValueRender',{
                                    visible:false,
                                })
                            }}
                            colCount={1}
                            controls={this.createQueryConditionsPropertyConfig()}
                        ></HLFormContainer>
                    </Panel>
                </Collapse>
                
                <AddSelectValue
                    onOkSave={() => {
                        formPropertyApp.formAddSelectValueRef.viewModel.form.validateFields((err,values: PropertyKeyValueFormFields) => {
                            if (!err) {
                                if (view && this.viewModel.itemDataType === '1') {
                                    const componentActiveType = TbalePropertyApp.viewModel.componentActiveType
                                    const arr = formPropertyApp.formPropertyViewModel.selectValueData.map(item => { return { key: item.labelKey,label: item.labelValue,value: item.labelValue } })
                                    runInAction(() => {
                                        if (componentActiveType === 'select') {
                                            TbalePropertyApp.viewModel.currComponentView.container.component.data = arr
                                        }
                                        if (componentActiveType === 'radioButton') {
                                            TbalePropertyApp.viewModel.currComponentView.container.component.data = arr.map((item) => {
                                                return {
                                                    value:item.key,
                                                    label:item.value,
                                                }
                                            })
                                        }
                                        TbalePropertyApp.triggerUpdateComponentViewEven(TbalePropertyApp.viewModel.currComponentView,TbalePropertyApp.viewModel.model.currComponentView.container.component.JsonProperty.uuid)
                                        message.success('添加成功')
                                        formPropertyApp.formSelectValueModalRef.viewModel.visible = false;
                                    })
                                }
                              }
                         }) 
                    }}
                    itemDataType={this.viewModel.itemDataType}></AddSelectValue>
            </div>
        )
    }
}