import React,{ Component } from 'react'
import { ListPageLayout,HLFormContainer,HLModal,NumericInput,HlDragger } from 'hoolinks-legion-design';
import {
    Button,
    Steps,
    Row,
    Col,
    Spin,
    Icon,
    Card,
    Tabs,
    Input,
    Checkbox,
    Select,
    Radio,
    DatePicker,
    Table,
    Collapse,
    message
} from 'antd';
import { InstanceForm,InstanceModal } from 'hoolinks-legion-design/lib/typings/components';
import { bind,observer } from 'legions/store-react'
import ProjectStore from '../../stores/projectStore';
import { directiveSend,directiveReceive,IDirective } from '../../utils/socket';
import { WrappedFormUtils } from 'hoolinks-legion-design/lib/typings/antd';
import { ProjectModules } from '../../interface/project';
import TerminalView from '../../../common/components/terminal';
import { observable,action,computed } from 'mobx';
import { observableViewModel } from 'legions/store-utils'
import moment from 'moment';
import { debounce } from 'hoolinks/property'
import { OPREATION_VIEW } from '../../constants/consts';
import QueryCanvas from '../canvas/query';
import FormElementCanvas from '../canvas/formElement';
import TableListViewCanvas from '../canvas/tableListView';
import { searchBtnConfig } from '../../constants/table-config/table';
import FormInformationCanvas from './formInformation';
import { tranformCreateModel } from '../../utils/form-model-codemod';
import { tranformCreateFormCommponent } from '../../utils/form-component-codemod';
import { HLModalContext } from '../../../common/components/modal/HLModalContext';
import { BasicModal } from '../../components/modal/basicModal';
import CreateProject,{ createProjectFormConfig,updateProjectFormConfig } from '../../components/project/createProject';
const serialize = require('serialize-javascript');
const { Step } = Steps;
const { TabPane } = Tabs;
const { MonthPicker,RangePicker } = DatePicker;
const { Panel } = Collapse;
const CREATE_PROJECT_CONFIG = {
    init: createProjectFormConfig,
    update: updateProjectFormConfig
}
interface IProps {
    store?: ProjectStore
    onCreatePageCode: () => void;
    onPreview: () => void
}
@bind({ store: ProjectStore })
@observer
export default class CanvasHomeEdit extends Component<IProps,{}> {
    formRef: InstanceForm = null
    form: WrappedFormUtils = null
    modalRef: InstanceModal = null
    searchBtn = searchBtnConfig
    colSpan = { left: 6,right: 18 }
    resize = debounce(() => {
        this.computedColSpan()
    },500)
    constructor(props: IProps) {
        super(props)
        /* directiveSend({}) */
        this.state = {

        }
        /*  this.computedColSpan() */
    }
    handlePreview = () => {
        const ViewCanvasApp = this.props.store.context.listPagePropertyApp.context.QueryPropertyApp;
        const query = serialize([...ViewCanvasApp.viewModel.query.map((item => item)),...this.searchBtn],{ ignoreFunction: false })
        const queryConfig = () => {
            return query
        }
        console.log([`const queryConfig = ()=>{
            return ${query}
        }`])
    }
    componentDidMount() {
        window.addEventListener && window.addEventListener('resize',this.computedColSpan.bind(this))
    }
    computedColSpan() {
        const width = document.body.clientWidth;
        const mixSizeWith = 1440;
        this.props.store.projectEditViewModel.dispatchAction(() => {
            if (width <= mixSizeWith) {
                this.props.store.projectEditViewModel.colSpan = {
                    left: 7,
                    right: 17,
                };
                // tslint:disable-next-line: no-magic-numbers
            } else if (width > 1980) {
                this.props.store.projectEditViewModel.colSpan = {
                    left: 5,
                    right: 19,
                };
            }
            else {
                this.props.store.projectEditViewModel.colSpan = {
                    left: 6,
                    right: 18,
                };
            }
        })

    }
    onOperationAdd = (type: string) => {
        const TbalePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
        this.props.store.projectEditViewModel.dispatchAction(() => {
            const defaultView = OPREATION_VIEW[type]
            const _Index = TbalePropertyApp.viewModel.operationConfigCode.findIndex(item => item.type === type);
            if (_Index > -1 && defaultView) {
                message.warning(`${defaultView['name']}不能重复添加`);
                return;
            }
            const nameEn = type.replace(type[0],type[0].toUpperCase());
            const opView = {
                // @ts-ignore
                type,
                name: defaultView ? defaultView['name'] : '操作按钮',
                btnIcon: defaultView ? defaultView['icon'] : '',
                btnType: defaultView ? defaultView['type'] : '',
                nameEn: defaultView ? nameEn : `${nameEn}${TbalePropertyApp.viewModel.operationConfigCode.length}`,
                apiUrl: '',
                paramsList: [],
                id: new Date().getTime().toString(),
            }
            // @ts-ignore
            TbalePropertyApp.viewModel.operationConfigCode.push(opView)
        })

    }
    /** 页面模板类型切换 */
    onTabClick = (value: 'listPage' | 'formPage') => {
        this.props.store.projectEditViewModel.setCurrentTemplatePage(value);
    }
    /** 打开项目信息填充模态框 */
    onOpenProjectModal = () => {
        const store = this.props.store;
        this.props.store.basicModalViewModel.modalRef.viewModel.title = '填写页面或模块信息';
        this.props.store.basicModalViewModel.modalRef.viewModel.visible = true;
        store.projectEditViewModel.setCreateProjectType('update');
    }
    render() {
        const store = this.props.store;
        const { currentTemplatePage } = store.projectEditViewModel;
        const { colSpan } = this.props.store.projectEditViewModel
        return (
            <Row className="hl-project-canvas" gutter={2 * 8} style={{ paddingBottom: '8px',paddingTop: '8px',background: 'rgb(236, 236, 236)' }}>
                <Col span={colSpan.left}>
                    <Card title="料件" bordered={true}>
                        <Tabs onTabClick={this.onTabClick} size="small" defaultActiveKey={currentTemplatePage} tabPosition="top" style={{ height: '100%' }}>
                            <TabPane tab="列表" key={'listPage'}>
                                <QueryCanvas></QueryCanvas>
                            </TabPane>

                            <TabPane tab="表单" key={'formPage'}>
                                <FormElementCanvas></FormElementCanvas>
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>

                <Col span={colSpan.right}>
                    <Card title={(
                        <Row>
                            <Col span={2 * 5}>画布</Col>
                        </Row>
                    )} bordered={true} extra={
                        <React.Fragment>
                            <div style={{ width: '260px' }}>
                                {/* <Col span={2}><Icon title="生成页面" style={{fontSize:'18px'}} type="code"  onClick={this.handlePreview}/></Col> */}

                                {
                                    currentTemplatePage === 'listPage' && <Button type="primary" icon="desktop" onClick={() => {
                                        this.props.onPreview && this.props.onPreview()
                                    }}>预览</Button>
                                }
                                <Button type="primary" icon="save" style={{ marginLeft: '5px' }} onClick={this.onOpenProjectModal}>保存</Button>

                            </div>

                        </React.Fragment>}>
                        {
                            currentTemplatePage === 'listPage' && <TableListViewCanvas></TableListViewCanvas>
                        }
                        {
                            currentTemplatePage === 'formPage' && <FormInformationCanvas></FormInformationCanvas>
                        }
                    </Card>
                    <BasicModal onOk={() => {
                        if (store.projectEditViewModel.createProjectType === 'update') {
                            this.props.onCreatePageCode && this.props.onCreatePageCode();
                            /* store.createProjectFormRef.viewModel.form.validateFields((error,value) => {
                                if (!error) {
                                    store.basicModalViewModel.modalRef.viewModel.visible = false;
                                    store.projectEditViewModel.setCreateProjectType(null);
                                    this.props.onCreatePageCode && this.props.onCreatePageCode();
                                    store.projectEditViewModel.dispatchAction(() => {
                                        store.projectEditViewModel.historyComponentsFileList.push(store.formFields.componentName.value)
                                    })
                                    // @ts-ignore
                                    store.setFormFields({ componentName: { value: void 0 } })

                                }
                                console.log(error)
                            }) */

                        }
                    }}>
                        {store.projectEditViewModel.createProjectType && <CreateProject controls={CREATE_PROJECT_CONFIG[store.projectEditViewModel.createProjectType]}></CreateProject>}
                    </BasicModal>
                </Col>

            </Row>
        )
    }
}