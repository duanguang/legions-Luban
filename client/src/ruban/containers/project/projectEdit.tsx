import React,{ Component } from 'react'
import { ListPageLayout,HLFormContainer,HLModal } from 'hoolinks-legion-design';
import { InstanceForm,IHLFormProps,IGroup,InstanceModal } from 'hoolinks-legion-design/lib/typings/components'
import { Button,Steps,Row,Col,Spin,Icon,Card,message } from 'antd';
import { ProjectFormFields } from '../../models/form/projectFormFields';
import { bind,observer } from 'legions/store-react'
import ProjectStore,{ TStepCurr } from '../../stores/projectStore';
import { directiveSend,directiveReceive,IDirective,ISendAst } from '../../utils/socket';
import { WrappedFormUtils } from 'hoolinks-legion-design/lib/typings/antd';
import { ProjectModules } from '../../interface/project';
import { observable,action,computed,toJS } from 'mobx';
import { observableViewModel,observablePromise } from 'legions/store-utils'
import TerminalView from '../../../common/components/terminal';
const serialize = require('serialize-javascript');
import './project.less'
import { OperationEnum } from '../../constants/enum-data';
import { runInAction } from 'mobx'
import get from 'lodash/get'
import unset from 'lodash/unset'
import {
    transformTableToekn,
    getExecutableScript,
    prettyPrint,
    transformTableParames,
    transformTableComponentCode,
} from '../../utils/codemod';
import { createTableListPage } from '../../utils/table-page-template';
import CanvasHomeEdit from '../canvas/canvasHome';
import { searchBtnConfig } from '../../constants/table-config/table';
import { transformHlTableComponentCode } from '../../utils/tablePageLayout';
import { transformOperation } from '../../utils/tableOperation';
import { transformTableConfig } from '../../utils/table-config-codemod';
import { transformFuncToExeccodeast } from '../../utils/codemodCore';
import { PageListNameContainerEntity } from '../../models/pageListEntity';
import { cloneDeep } from 'lodash'
import CreateProject,{ createProjectFormConfig } from '../../components/project/createProject';
import { tranformCreateFormCommponent } from '../../utils/form-component-codemod';
import { FormPropertyAstUtils } from '../../utils/formPropertyUilts';
import { tranformCreateModel } from '../../utils/form-model-codemod';
import { FORM_PROPERTY_AST } from '../../constants/consts';
const { Step } = Steps;
interface IProps {
    store?: ProjectStore
}

@bind({ store: ProjectStore })
@observer
export default class ProjectEdit extends Component<IProps,{}> {
    formRef: InstanceForm = null
    form: WrappedFormUtils = null
    modalRef: InstanceModal = null
    queryPrams = {}
    constructor(props: IProps) {
        super(props)
        /*  directiveSend({}) */
        /* directiveReceive((result) => {
            if (result && result.state) {
                this.props.store.projectEditViewModel.updateLoadingState(result.state)
            }
        }) */
        this.state = {

        }
    }
    handleOnInit() {
        this.props.store.createProjectFormRef.viewModel.form.validateFields((err,values: ProjectFormFields) => {
            if (!err) {
                directiveSend({
                    initProject: {
                        sendData: ProjectFormFields.formFieldsToData<ProjectFormFields,ProjectModules.ISendData>(ProjectFormFields,this.props.store.formFields),
                    },
                })
            }
            else {
                console.log(values,this.props.store.formFields,'不通过')
            }

        })
    }
    handleDebugCreatePage = () => {

    }
    /**
     * 生成代码
     *
     * @memberof ProjectEdit
     */
    handleCreatePage = () => {
        const ViewCanvasApp = this.props.store.context.listPagePropertyApp.context.QueryPropertyApp;
        const TbalePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
        const projectConfig = ProjectFormFields.formFieldsToData<ProjectFormFields,ProjectModules.ISendData>(ProjectFormFields,this.props.store.formFields)
        const query = serialize([...ViewCanvasApp.viewModel.query.map((item => {
            const newItem = cloneDeep(toJS(item));
            unset(newItem,'container.component.JsonProperty.uuid')
            return newItem;
        })),...searchBtnConfig],{ ignoreFunction: false })
        const tableColumns = serialize([...TbalePropertyApp.viewModel.tableColumns.map((item => item))],{ ignoreFunction: false })
        const sendData: ISendAst = {
            ast: {
                queryAst: [`const queryConfig:Array<IQuery> = ${query}`],
                tableAst: [`const columnsConfig:TableColumnConfig<{}>[] = ${tableColumns}`],
                tableDataSourceAst: TbalePropertyApp.viewModel.tableDataSourceCode,
                tableBaseConfigAst: TbalePropertyApp.viewModel.tableBaseConfigCode,
                /* operationAst:TbalePropertyApp.viewModel.operationConfigCode, */
            },
            branch: projectConfig.branch,
            gitSrc: projectConfig.gitSrc,
            templateType: this.props.store.projectEditViewModel.currentTemplatePage,
            projectSrc: projectConfig.projectSrc,
            modulesSystem: projectConfig.modulesSystem,
            gitUserName: projectConfig.gitUserName,
            componentName: projectConfig.componentName || 'orderPageList',
        }
        // @ts-ignore
        const code = createTableListPage(sendData)
        // @ts-ignore
        /*  transformTableComponentCode(code.tablePageCode,TbalePropertyApp.viewModel.operationConfigCode,sendData) */
        /* transformOperation(code.tableStore,TbalePropertyApp.viewModel.operationConfigCode) */
        /*  transformTableConfig(code.tableConfigCode,TbalePropertyApp.viewModel.tableColumns) */
        /* console.log(code.tablePageCode) */
        // @ts-ignore
        /* console.log(transformOperation(code.tableStore,TbalePropertyApp.viewModel.operationConfigCode)) */
        if (this.props.store.projectEditViewModel.stepCurr !== 1) {
            message.warning('请先填写项目信息...');
        }

        else {
            if (sendData.templateType === 'formPage') {
                const formPropertyApp = this.props.store.context.formPropertyApp;
                const { propertyData,compoentData } = formPropertyApp.formPropertyViewModel

                const keys = propertyData.keys()
                const config: { name: string }[] = [];
                for (let key of keys) {
                    const model = FormPropertyAstUtils.create(compoentData.get(key).type,propertyData.get(key).propertyValue)
                    config.push({ name: get(model,'name') })
                }
                if (config.every((item) => item.name)) {
                    /** 调试信息start */
                    /*  tranformCreateModel(formPropertyApp.formPropertyViewModel.propertyData,formPropertyApp.formPropertyViewModel.compoentData,projectConfig.componentName + 'FormFields',FORM_PROPERTY_AST) */
                    tranformCreateFormCommponent({
                        propertyData: formPropertyApp.formPropertyViewModel.propertyData,
                        compoentData: formPropertyApp.formPropertyViewModel.compoentData,
                        controlsElementSort: formPropertyApp.formPropertyDraggerRef.localViewModel.computedControlsSort,
                    },{
                        componentName: projectConfig.componentName,
                        group: [...formPropertyApp.formPropertyViewModel.group],
                        size: formPropertyApp.formPropertyViewModel.size,
                        layout: formPropertyApp.formPropertyViewModel.layout,
                    },FORM_PROPERTY_AST)
                    /**end */
                    /* directiveSend({
                        generatedCode: {
                            sendData: {...sendData,
                                formPageCode:{
                                    modelCode: tranformCreateModel(formPropertyApp.formPropertyViewModel.propertyData,formPropertyApp.formPropertyViewModel.compoentData,projectConfig.componentName+'FormFields'),
                                    formComponentCode:tranformCreateFormCommponent({
                                        propertyData: formPropertyApp.formPropertyViewModel.propertyData,
                                        compoentData: formPropertyApp.formPropertyViewModel.compoentData,
                                        controlsElementSort:formPropertyApp.formPropertyDraggerRef.localViewModel.computedControlsSort,
                                    },{
                                        componentName: projectConfig.componentName,
                                        group: [...formPropertyApp.formPropertyViewModel.group],
                                        size: formPropertyApp.formPropertyViewModel.size,
                                        layout:formPropertyApp.formPropertyViewModel.layout,
                                    }),
                                }},
                        },
                    }) */
                    this.props.store.projectEditViewModel.operation = OperationEnum.save;
                    this.modalRef.viewModel.visible = true;
                    this.modalRef.viewModel.title = '页面执行'
                }
            }
            else if (sendData.templateType === 'listPage') {
                if (TbalePropertyApp.viewModel.tableDataSourceCode === null) {
                    message.warning('请设置表格属性')
                    return
                }
                /* const queryConfig = () => {
                    return query
                } */
                this.props.store.projectEditViewModel.operation = OperationEnum.save;
                this.modalRef.viewModel.visible = true;
                this.modalRef.viewModel.title = '页面执行'
                this.modalRef.viewModel.okText = '生成';



                /* directiveSend({
                    generatedCode: {
                        sendData: {...sendData,
                            tablePageListCode: {
                                tableConfigCode: transformTableConfig(code.tableConfigCode,TbalePropertyApp.viewModel.tableColumns),
                                // @ts-ignore
                                tableHomePageCode: transformTableComponentCode(code.tablePageCode,TbalePropertyApp.viewModel.operationConfigCode,sendData),
                                tableModelCode: code.tableModelCode,
                                storeCode: transformOperation(code.tableStore,TbalePropertyApp.viewModel.operationConfigCode),
                            }},
                    },
                }) */
                /* console.log([`const columnsConfig =()=>{return ${tableColumns}}`])*/
                /*  console.log([`const queryConfig = ()=>{
                     return ${query}
                 }`]) 
                 console.log(projectConfig) */
            }
            else {
                message.warning('请先选择需要生成的模板')
            }
        }

    }
    onTransfrom = (value: IDirective['initProject']) => {
        return value.responseData.replace('client:','').replace(/state:error[\r\n]/g,'').replace('state:error','').replace('state:pending↵','')
            .replace('state:pending','').replace('state:complete↵','').replace('state:complete↵','').replace('state:complete','').replace('↵','')
    }
    onReceive = (resmessage: IDirective['initProject']) => {
        if (resmessage && resmessage.state) {
            this.props.store.projectEditViewModel.updateLoadingState(resmessage.state)
        }
    }
    onChangeStep = (step: TStepCurr) => {
        if (this.props.store.projectEditViewModel.stepCurr === step) {
            return;
        }
        if (this.props.store.projectEditViewModel.computedLoad === 'complete') {
            this.props.store.projectEditViewModel.stepCurr = step;
        } else {
            message.warning('请先填写项目信息')
        }
    }
    onPreview = () => {
        /* this.props.store.projectEditViewModel.operation = OperationEnum.preview;
        this.modalRef.viewModel.visible = true;
        this.modalRef.viewModel.title = '预览'
        this.modalRef.viewModel.okText = '' */
        const tableData = this.props.store.context.listPagePropertyApp.context.TablePropertyApp
        const receiveValue = 'this.props.store.context.listPagePropertyApp.context.TablePropertyApp'
        runInAction(() => {
            if (tableData.viewModel.tableDataSourceCode) {
                const a = transformTableToekn(tableData.viewModel.tableDataSourceCode.token)
                // tslint:disable-next-line: no-eval
                eval(getExecutableScript(a,this))
                /* const execcodeast=this.props.store.context.formPropertyApp.formPropertyViewModel.execcodeast */
                const renderValue = transformFuncToExeccodeast(tableData.viewModel.tableDataSourceCode.parames,{
                    propertyName: 'params',
                    receiveValue: `${receiveValue}.viewModel.paramesExeccodeast`
                })
                eval(getExecutableScript(renderValue,this))
                /* const tranformExeccodeast = transformFuncToExeccodeast(tableData.viewModel.tableDataSourceCode.transform,{
                    propertyName: 'transform',
                    receiveValue:`${receiveValue}.viewModel.tranformExeccodeast`
                })
                eval(getExecutableScript(tranformExeccodeast,this)) */
                if (tableData.viewModel.paramesExeccodeast) {

                    const autoQuery = {
                        params: tableData.viewModel.paramesExeccodeast['params'],

                        token: this.props.store.projectEditViewModel.token,
                        ApiUrl: tableData.viewModel.tableDataSourceCode.apiUrl,
                        // @ts-ignore
                        method: tableData.viewModel.tableDataSourceCode.method,
                        transform: (value: observablePromise.PramsResult<PageListNameContainerEntity>) => {
                            if (value && !value.isPending && value.value) {
                                const { data,current,size } = value.value['result'];
                                return {
                                    data: Array.isArray(data) && data.map((item,index) => {
                                        item['key'] = (index + 1) + (current - 1) * size;
                                        return item;
                                    }),
                                    total: value.value['result'].total,
                                };
                            }
                            return {
                                total: 0,
                                data: [],
                            };
                        },
                        model: PageListNameContainerEntity,
                    }
                    tableData.tableRef && tableData.tableRef.localViewModel.dispatchRequest(autoQuery,{
                        pageIndex: tableData.tableRef.viewModel.pageIndex,
                        pageSize: tableData.tableRef.viewModel.pageSize,
                    })
                }

            } else {
                message.warning('请先填写表格配置信息1')
            }
        })

    }
    renderStepIcon(type: string,step: TStepCurr) {
        return <Icon type={type} style={{ cursor: 'pointer' }} onClick={this.onChangeStep.bind(this,step)} />
    }
    render() {
        const { formFields } = this.props.store
        return (
            <ListPageLayout
                operation={(
                    <Row>
                        <Steps current={this.props.store.projectEditViewModel.stepCurr}>
                            <Step title="项目信息" icon={(this.renderStepIcon('folder',0))} description="This is a description." />
                            <Step title="页面制作" icon={(this.renderStepIcon('folder-add',1))}
                            /* description={(
                            <Row>
                                <span style={{ cursor: 'pointer' }} onClick={this.handleCreatePage}><Icon type="codepen-circle" /> 生成</span>
                            </Row>

                            )} */
                            />
                            <Step title="生成页面" icon={(<Icon type="chrome" />)} description="This is a description." />
                        </Steps>
                    </Row>
                )}
                content={(<div>
                    <Spin spinning={this.props.store.projectEditViewModel.computedLoading}>
                        {this.props.store.projectEditViewModel.stepCurr === 0 && <Row>
                            <Col span={2 * 4}>
                                <CreateProject controls={createProjectFormConfig}></CreateProject>
                                <Col offset={2 * 4}>
                                    {this.props.store.projectEditViewModel.computedLoad !== 'complete' && <Button type="primary" onClick={this.handleOnInit.bind(this)}>初始化</Button>}
                                    {this.props.store.projectEditViewModel.computedLoad === 'complete' && <Button type="primary" onClick={() => {
                                        this.props.store.projectEditViewModel.stepCurr = 1;
                                    }}>下一步</Button>}

                                </Col>
                            </Col>
                            <Col span={3 * 5} offset={1}>
                                {/* <TerminalView
                                    <IDirective['initProject']>
                                    style={{ marginTop: '10px' }}
                                    onTransfrom={this.onTransfrom}
                                    onSocketReceive={directiveReceive} onReceive={this.onReceive}></TerminalView> */}
                            </Col>
                        </Row>}
                        {
                            this.props.store.projectEditViewModel.stepCurr === 1 &&
                            <CanvasHomeEdit onCreatePageCode={this.handleCreatePage} onPreview={this.onPreview}></CanvasHomeEdit>
                        }
                        {/* ====生成页面代码界面start===== */}
                        <HLModal
                            okText="生成"
                            onReady={(value) => {
                                this.modalRef = value;
                                this.modalRef.viewModel.width = 300 * 3;
                                /*  this.modalRef.viewModel.title = '创建项目' */
                            }}>
                            {this.props.store.projectEditViewModel.operation === OperationEnum.save && <TerminalView
                                style={{ marginTop: '10px' }}
                                onTransfrom={this.onTransfrom}
                                onSocketReceive={directiveReceive} onReceive={this.onReceive}></TerminalView>}
                        </HLModal>
                        {/* ====生成页面代码界面end===== */}
                    </Spin>
                </div>)}></ListPageLayout>
        )
    }
}