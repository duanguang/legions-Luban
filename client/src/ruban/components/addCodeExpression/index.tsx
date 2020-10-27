import React,{ Component } from 'react'
import {
    Button,
    Row,
    Col,
    message,
} from 'antd';
import { HLFormContainer,HLModal } from 'hoolinks-legion-design';
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
interface IProps {
    store?: ProjectStore;
    onOk: () => void;
    onCancel?: () => void;
    onReady:(value:InstanceModal)=>void
}
class ViewModel {
}
@bind({ store: ProjectStore })
@observer
export default class AddCodeExpression extends FormPropertyConfig<IProps> {
    /** 分组信息编辑模态框实例 */
    viewModel = observableViewModel<ViewModel>(new ViewModel());
    /** 分组信息表单实例 */
    constructor(props: IProps) {
        super(props)
        this.state = {
        }
    }
    render() {
        const formPropertyApp = this.props.store.context.formPropertyApp;
        let code = formPropertyApp.formPropertyViewModel.codeValue;
        return (
            <React.Fragment>
                <HLModalContext content={(<React.Fragment>
                    <CodeEditor
                        width="100%"
                        height="300px"
                        mode="typescript"
                        value={code}
                        tabSize={4}
                        readOnly={formPropertyApp.formPropertyViewModel.codeEditorprop.readOnly}
                        onChange={(values: string,evet) => {
                            formPropertyApp.formPropertyViewModel.codeValue = values;
                        }}
                    ></CodeEditor>
                </React.Fragment>)}>
                    <HLModal
                    onCancel={() => {
                        this.props.onCancel&&this.props.onCancel()
                    }}
                    closable={false}
                    maskClosable={false}
                    onOk={() => {
                        this.props.onOk && this.props.onOk();
                        message.success('保存成功')
                    }}
                    onReady={(value) => {
                        const width = 850;
                        this.props.onReady&&this.props.onReady(value)
                       /*  formPropertyApp.formAddCodeExpressionModalRef = value; */
                        value.viewModel.okText='保存';
                        value.viewModel.width = width;
                    }}>
                   
                </HLModal>
                </HLModalContext>
            </React.Fragment>
        )
    }
}