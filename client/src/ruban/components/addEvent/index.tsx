import React,{ Component } from 'react'
import {
    Button,
    Row,
    Col,
    message,
} from 'antd';
import { HLFormContainer,HLModal,HLTable } from 'hoolinks-legion-design';
import { bind,observer } from 'legions/store-react'
import ProjectStore from '../../stores/projectStore';
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
import FormPropertyConfig from '../property/formConfig/formPropertyConfig';
import { shortHash } from 'hoolinks-legion-design/lib/utils/utils';
import AddCodeExpression from '../addCodeExpression';
import { tranformEvent } from '../../utils/form-page-codemod';
import { getExecutableScript } from '../../utils/codemodCore';
interface IProps {
    store?: ProjectStore;
    /* onOk: () => void;
    onCancel?: () => void; */
    onDelete?: (record) => void;
    onEdit?: (record) => void;
}
class ViewModel {
}
@bind({ store: ProjectStore })
@observer
export default class AddEvent extends FormPropertyConfig<IProps> {
    /** 分组信息编辑模态框实例 */
    viewModel = observableViewModel<ViewModel>(new ViewModel());
    /** 分组信息表单实例 */
    constructor(props: IProps) {
        super(props)
        this.state = {
        }
    }
    onDelete(record) {
        this.props.onDelete&& this.props.onDelete(record)
    }
    onEdit(record) {
        this.props.onEdit&& this.props.onEdit(record)
    }

    render() {
        const formPropertyApp = this.props.store.context.formPropertyApp;
        const data = [];
        ['onChange','onFocus','onBlur'].map((item) => {
            const value = formPropertyApp.formPropertyViewModel.getPropertyDataValue(item)
            if (value) {
                data.push({ event: item,value })
            }
        })
        return (
            <React.Fragment>
                <AddCodeExpression
                    onReady={(value) => {
                        formPropertyApp.formAddEventCodeExpressionModalRef = value;
                    }}
                    onOk={() => {
                        formPropertyApp.formPropertyViewModel.dispatchAction(() => {
                            formPropertyApp.formPropertyViewModel.execcodeast = null;
                            const eventName = formPropertyApp.formPropertyViewModel.editComponentData.property;
                            eval(getExecutableScript(tranformEvent(formPropertyApp.formPropertyViewModel.codeValue,eventName),this));
                            formPropertyApp.formPropertyViewModel.updatePropertyValue({
                                value: formPropertyApp.formPropertyViewModel.codeValue,
                                propertyType: 'function',
                                property: formPropertyApp.formPropertyViewModel.editComponentData.property,
                                execast:formPropertyApp.formPropertyViewModel.execcodeast,// 待转化 预览时用
                            })
                            console.log(formPropertyApp.formPropertyViewModel.execcodeast)
                            formPropertyApp.formPropertyViewModel.editComponentData.property = null;
                            formPropertyApp.formAddEventCodeExpressionModalRef.viewModel.visible = false;
                        })
                    }}></AddCodeExpression>
                <HLModalContext content={(<React.Fragment>
                    <HLTable
                        scroll={{ x: formPropertyApp.formAddEventListTableRef && formPropertyApp.formAddEventListTableRef.viewModel.tableXAutoWidth,y: 300 }}
                        columns={[
                            {
                                key: 'event',
                                title: '已有事件',
                                dataIndex: 'event',
                                width: '160px',
                                render: (_,record,index: number) => {
                                    return <span style={{cursor: 'pointer'}} onClick={this.onEdit.bind(this,record)}>{record['event']}</span>
                                }
                            },
                            {
                                title: '操作',
                                dataIndex: 'operate',
                                key: 'operate',
                                width: '120px',
                                render: (text,record) => {
                                    return (<Button type="danger" style={{ marginRight: '10px' }} ghost onClick={this.onDelete.bind(this,record)}>删除</Button>)
                                },
                            },
                        ]}
                        bordered
                        uniqueKey="event"
                        onReady={(value) => {
                            formPropertyApp.formAddEventListTableRef = value;
                        }}
                        size="small"
                        isOpenRowChange
                        data={formPropertyApp.formPropertyViewModel.eventData}
                        pagination={false}
                    ></HLTable>
                </React.Fragment>)}>
                    <HLModal
                        afterClose={() => {
                            formPropertyApp.formPropertyViewModel.clearEventData();
                        }}
                        /* closable={false} */
                        maskClosable={false}
                        /* onOk={() => {
                        }} */
                        footer={null}
                        onReady={(value) => {
                            const width = 650;
                            formPropertyApp.formAddEventListTableModalRef = value;
                            value.viewModel.width = width;
                        }}>

                    </HLModal>
                </HLModalContext>
            </React.Fragment>
        )
    }
}