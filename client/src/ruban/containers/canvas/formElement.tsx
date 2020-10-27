import React,{ Component } from 'react'
import { ListPageLayout,HLFormContainer,HLModal,NumericInput,HlDragger, HLUpload } from 'hoolinks-legion-design';
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
    message,
    Switch
} from 'antd';
import { InstanceForm,InstanceModal } from 'hoolinks-legion-design/lib/typings/components';
import { bind,observer } from 'legions/store-react'
import ProjectStore from '../../stores/projectStore';
import moment from 'moment';
import { OPREATION_VIEW } from '../../constants/consts';
const { TabPane } = Tabs;
const { MonthPicker,RangePicker } = DatePicker;
const { Panel } = Collapse;

interface IProps {
    store?: ProjectStore
}
@bind({ store: ProjectStore })
@observer
export default class FormElementCanvas extends Component<IProps,{}> {
    constructor(props: IProps) {
        super(props)
        this.state = {

        }
    }


    render() {
        const { formFields } = this.props.store
        const { colSpan } = this.props.store.projectEditViewModel
        return (
            <Collapse defaultActiveKey={['1']}>
                <Panel header="元素组件" key="1">
                    <HlDragger
                        dragger-id="formElement"
                        style={{ width: '100%',minHeight: '200px' }}
                        options={{
                            animation: 150,
                            group: {
                                name: 'formElement',
                                pull: true,
                                put: true,

                            },
                            sort: false,
                            dataIdAttr: 'formElement',
                        }}
                        onChange={(items: string[]) => {
                        }}
                    >
                        <Row style={{ cursor: 'pointer' }} data-id={'text'}>
                            <Col span={5}><span style={{ lineHeight: '30px' }}>文本框:</span></Col>
                            <Col span={2 * 9}><Input></Input></Col>
                        </Row>
                        <Row style={{ paddingTop: '8px',cursor: 'pointer' }} data-id="select">
                            <Col span={5}><span style={{ lineHeight: '30px' }}>下拉列表:</span></Col>
                            <Col span={2 * 9}><Select style={{ width: '100%' }}></Select></Col>
                        </Row>
                       {/*  <Row style={{ paddingTop: '8px',cursor: 'pointer' }} data-id={'checkBox'}>
                            <Col span={5}><span style={{ lineHeight: '30px' }}>复选框:</span></Col>
                            <Col span={2 * 9}><Checkbox>Checkbox</Checkbox></Col>
                        </Row> */}
                        
                        <Row style={{ paddingTop: '8px',cursor: 'pointer' }} data-id="radioButton">
                            <Col span={5}><span style={{ lineHeight: '30px' }}>单选组合:</span></Col>
                            <Col span={2 * 9}>
                                <Radio.Group defaultValue="a">
                                    <Radio.Button value="guangzhou">广州</Radio.Button>
                                    <Radio.Button value="shanghai">上海</Radio.Button>
                                </Radio.Group>
                            </Col>
                        </Row>
                        <Row style={{ paddingTop: '8px',cursor: 'pointer' }} data-id="radio">
                            <Col span={5}><span style={{ lineHeight: '30px' }}>单选组合:</span></Col>
                            <Col span={2 * 9}>
                                <Radio.Group defaultValue="a">
                                    <Radio value="1">是</Radio>
                                    <Radio value="0">否</Radio>
                                </Radio.Group>
                            </Col>
                        </Row>
                        <Row style={{ paddingTop: '8px',cursor: 'pointer' }} data-id="switch">
                            <Col span={5}><span style={{ lineHeight: '30px' }}>开关:</span></Col>
                            <Col span={2 * 9}><Switch /></Col>
                        </Row>
                        <Row style={{ paddingTop: '8px',cursor: 'pointer' }} data-id="upload">
                            <Col span={5}><span style={{ lineHeight: '30px' }}>上传:</span></Col>
                            <Col span={2 * 9}><HLUpload /></Col>
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

                </Panel>
            </Collapse>
        )
    }
}