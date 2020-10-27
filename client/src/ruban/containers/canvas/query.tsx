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
import moment from 'moment';
import { OPREATION_VIEW } from '../../constants/consts';
const { TabPane } = Tabs;
const { MonthPicker,RangePicker } = DatePicker;
const { Panel } = Collapse;
const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Cash Assets',
        className: 'column-money',
        dataIndex: 'money',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
];

const data = [
    {
        key: '1',
        name: 'John',
        money: '￥300,000',
        address: 'New York',
    },
    {
        key: '2',
        name: 'Jim',
        money: '￥1,256,000',
        address: 'London',
    },
    {
        key: '3',
        name: 'Joe',
        money: '￥120,000',
        address: 'Sidney',
    },
];
interface IProps {
    store?: ProjectStore
}
@bind({ store: ProjectStore })
@observer
export default class QueryCanvas extends Component<IProps,{}> {
    constructor(props: IProps) {
        super(props)
        this.state = {

        }
    }
    onOperationAdd = (type: string) => {
        const TbalePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
        
        this.props.store.projectEditViewModel.dispatchAction(() => {
            const defaultView = OPREATION_VIEW[type]
            const _Index = TbalePropertyApp.viewModel.operationConfigCode.findIndex(item => item.type === type);
            if (_Index > -1&&defaultView) {
                message.warning(`${defaultView['name']}不能重复添加`);
                return;
            }
            const nameEn = type.replace(type[0],type[0].toUpperCase());
            const opView = {
                // @ts-ignore
                type,
                name: defaultView?defaultView['name']:'操作按钮',
                btnIcon: defaultView ? defaultView['icon'] : '',
                btnType: defaultView ? defaultView['type'] : '',
                nameEn:defaultView?nameEn:`${nameEn}${TbalePropertyApp.viewModel.operationConfigCode.length}`,
                apiUrl: '',
                paramsList:[],
                id:new Date().getTime().toString(),
            }
            // @ts-ignore
            TbalePropertyApp.viewModel.operationConfigCode.push(opView)
        })
        
    }
    render() {
        return (
                <Collapse defaultActiveKey={['1']}>
                    <Panel header="查询条件区块" key="1">
                        <HlDragger
                            dragger-id="query"
                            style={{ width: '100%',minHeight: '200px' }}
                            options={{
                                animation: 150,
                                group: {
                                    name: 'query',
                                    pull: true,
                                    put: true,
                                    
                                },
                                sort: false,
                                dataIdAttr:'query',
                            }}
                            onChange={(items: string[]) => {
                            }}
                        >
                            <Row style={{ cursor: 'pointer' }} data-id={'text'}>
                                <Col span={5}><span style={{ lineHeight: '30px' }}>文本框:</span></Col>
                                <Col span={2 * 9}><Input></Input></Col>
                            </Row>
                            <Row style={{ paddingTop: '8px',cursor: 'pointer' }} data-id={'textArea'}>
                                <Col span={5}><span style={{ lineHeight: '30px' }}>多行文本:</span></Col>
                                <Col span={2 * 9}><Input></Input></Col>
                            </Row>
                            <Row style={{ paddingTop: '8px',cursor: 'pointer' }} data-id={'checkBox'}>
                                <Col span={5}><span style={{ lineHeight: '30px' }}>复选框:</span></Col>
                                <Col span={2 * 9}><Checkbox>Checkbox</Checkbox></Col>
                            </Row>
                            <Row style={{ paddingTop: '8px',cursor: 'pointer' }} data-id="select">
                                <Col span={5}><span style={{ lineHeight: '30px' }}>下拉列表:</span></Col>
                                <Col span={2 * 9}><Select style={{ width: '100%' }}></Select></Col>
                            </Row>
                            <Row style={{ paddingTop: '8px',cursor: 'pointer' }} data-id="radioButton">
                                <Col span={5}><span style={{ lineHeight: '30px' }}>单选组合:</span></Col>
                                <Col span={2 * 9}>
                                    <Radio.Group defaultValue="a">
                                        <Radio.Button value="a">Hangzhou</Radio.Button>
                                        <Radio.Button value="b">Shanghai</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>

                            <Row style={{ paddingTop: '8px',cursor: 'pointer' }} data-id="date">
                                <Col span={5}><span style={{ lineHeight: '30px' }}>日期组件:</span></Col>
                                <Col span={2 * 9}><DatePicker /></Col>
                            </Row>
                            <Row style={{ paddingTop: '8px',cursor: 'pointer' }} data-id="daterange">
                                <Col span={5}><span style={{ lineHeight: '30px' }}>日期区间:</span></Col>
                                <Col span={2 * 9}>
                                    <RangePicker
                                        defaultValue={[moment('2015/01/01','YYYY/MM/DD'),moment('2015/01/01','YYYY/MM/DD')]}
                                        format={'YYYY/MM/DD'}
                                    /></Col>
                            </Row>
                        </HlDragger>
                    </Panel>
                    <Panel header="操作事件区块" key="2">
                        <HlDragger
                            dragger-id="operation"
                            style={{ width: '100%' }}
                            options={{
                                animation: 150,
                                group: {
                                    name: 'operation',
                                    pull: true,
                                    put: true,
                                },
                                sort: false,
                                dataIdAttr:'operation',
                            }}
                            onChange={(items: string[]) => {
                            }}
                        >
                            <Row style={{ paddingTop: '8px',cursor: 'pointer' }}>
                                <Col span={4}><span style={{ lineHeight: '30px' }}>通用:</span></Col>
                                <Col span={5}>
                                    <Button size="small" type="primary" icon="bars" onClick={this.onOperationAdd.bind(this,'export')}>导出</Button>
                                </Col>
                                
                                <Col span={ 5}>
                                    <Button size="small" type="primary" icon="export" onClick={this.onOperationAdd.bind(this,'import')}>导入</Button>
                                </Col>
                                <Col span={5}>
                                    <Button size="small" type="primary" onClick={this.onOperationAdd.bind(this,'openCustomColumns')}>自定义列</Button>
                                </Col>
                            </Row>
                            <Row style={{ paddingTop: '8px',cursor: 'pointer' }}>
                                <Col span={4}><span style={{ lineHeight: '30px' }}>操作:</span></Col>
                                <Col span={5}>
                                    <Button size="small" type="primary" icon="unlock" onClick={this.onOperationAdd.bind(this,'enabled')}>启用</Button>
                                </Col>
                                <Col span={5}>
                                    <Button size="small" type="primary" icon="lock" onClick={this.onOperationAdd.bind(this,'disable')}>禁用</Button>
                                </Col>
                                <Col span={5}>
                                    <Button size="small" icon="delete" type="danger" onClick={this.onOperationAdd.bind(this,'delete')}>删除</Button>
                                </Col>
                                <Col span={5}>
                                    <Button size="small" type="primary" onClick={this.onOperationAdd.bind(this,'customBtn')}>操作按钮</Button>
                                </Col>
                            </Row>
                        </HlDragger>
                    </Panel>
                    <Panel header="数据展示区块" key="3">
                        <HlDragger
                            dragger-id="content"
                            style={{ width: '100%',minHeight: '200px' }}
                            options={{
                                animation: 150,
                                group: {
                                    name: 'content',
                                    pull: true,
                                    put: true,
                                },
                                sort: false,
                            }}
                            onChange={(items: string[]) => {
                            }}
                        >
                            <Row style={{ paddingTop: '8px',cursor: 'pointer' }} data-id="query-table">
                                <Col span={4}><span style={{ lineHeight: '30px' }}>表格:</span></Col>
                                <Col span={2 * 10}>
                                    <Table
                                        columns={columns}
                                        dataSource={data}
                                        bordered
                                    />
                                </Col>
                            </Row>
                        </HlDragger>
                    </Panel>
                </Collapse>
        )
    }
}