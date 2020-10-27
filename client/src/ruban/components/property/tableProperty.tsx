import React,{ Component } from 'react'
import {
    Collapse,
    Row,
    Col,
    Radio,
    Transfer,
    Button,
    message,
    Input,
} from 'antd';
import { HLFormContainer,HLModal } from 'hoolinks-legion-design';
import { bind,observer } from 'legions/store-react'
import ProjectStore from '../../stores/projectStore';
import { WrappedFormUtils } from 'hoolinks-legion-design/lib/typings/antd';
import { InstanceModal,InstanceForm } from 'hoolinks-legion-design/lib/typings/components';
import { observable,action,computed,runInAction } from 'mobx';
import { observableViewModel } from 'legions/store-utils'
import {
    PropertyColumnsConfigFormFields,
    PropertyTableDataSourceFormFieldsRule,
    PropertyTableDataSourceFormFields,
    PropertyTableBaseConfigFormFields,
} from '../../models/form/propertyFormModel';
import CodeEditor from '../codeEditor';
import './hl-table-property.less'
import { AutoQueryVModelCode,TABLE_SEARCH_CODE,TABLE_RESET_CODE,TABLE_SEARCH_PARAMS_CODE,TABLE_TRANFORM_CODE,TABLE_TOKEN_CODE } from '../../constants/code/tableConfigCode';
const RadioGroup = Radio.Group;
import { TransferListProps } from 'antd/lib/transfer/list'
import { OperationEnum } from '../../constants/enum-data';
import { HLModalContext } from '../../../common/components/modal/HLModalContext';
import AddTableColumns from '../addTableColumns';
import { RecastUtils } from '../../utils/recastUtils';
import * as recast from 'recast';
import { transformFuncToExeccodeast,getExecutableScript } from '../../utils/codemodCore';
import TableListPropertyConfig,{ EditCodeEnum } from './formConfig/tableListPropertyConfig';
import { transformCode } from 'legions-utils-ast/transform.format.code';
interface IProps {
    store?: ProjectStore
}
const { Panel } = Collapse;
class ViewModel {
    /**
     * 代码编辑器值
     *
     * @memberof ViewModel
     */
    @observable codeValue = ''

    @observable viewDataSourceForm: PropertyTableDataSourceFormFields = new PropertyTableDataSourceFormFields()

    /**
     * 编辑列时所选中的行数据
     *
     * @type {string[]}
     * @memberof ViewModel
     */
    @observable sourceSelectedKeys: string[] = [];

    @observable operationEnum: number = -1
}
@bind({ store: ProjectStore })
@observer
export default class TableProperty extends TableListPropertyConfig<IProps> {
    form: WrappedFormUtils = null
    modalRef: InstanceModal = null
    /** 添加列信息模态框实例 */
    viewModel = observableViewModel<ViewModel>(new ViewModel());
    constructor(props: IProps) {
        super(props)
        this.state = {
        }
        this.registerInstance(this);
    }
    onEditColumns = () => {
        const TbalePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
        if (this.viewModel.sourceSelectedKeys.length > 1) {
            message.warning('单次只能编辑一行数据')
            return;
        }
        this.viewModel.operationEnum = OperationEnum.EditColumns;
        this.modalRef.viewModel.visible = true;
        // tslint:disable-next-line: no-magic-numbers
        this.modalRef.viewModel.width = 560;
        this.modalRef.viewModel.title = '编辑列信息';
        const item = TbalePropertyApp.viewModel.tableColumns.find((item) => item.key === this.viewModel.sourceSelectedKeys[0])
        const model = new PropertyColumnsConfigFormFields;
        model.columnsName.value = item.title as string;
        model.dataIndex.value = item.dataIndex;
        model.sorter.value = item.sorter as boolean;
        model.width.value = item.width.toString().replace('px','');
        let timeId = setTimeout(() => {
            this.props.store.formProperyAddTableColumnsRef.store.updateFormInputData(this.props.store.formProperyAddTableColumnsRef.uid,model,this)
            this.props.store.formProperyAddTableColumnsRef.viewModel.setFormState('dataIndex',{
                disabled: true,
            })
            clearTimeout(timeId);
        })
    }
    renderFooter = (props: TransferListProps) => {
        if (props.titleText === '全部列') {
            return (
                <Button
                    disabled={this.viewModel.sourceSelectedKeys.length ? false : true}
                    size="small"
                    style={{ float: 'right',margin: 5 }}
                    onClick={this.onEditColumns}
                >
                    编辑列
                </Button>
            );
        }
        return null
    }
    renderDeleteColumns() {
        /* const { PropertyApp } = this.props.store.context */
        const TbalePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
        const targetKeys = (TbalePropertyApp.viewModel.deletedTableColumns || []).map((item) => {
            /*  return { key: item.key as string,title: item.title as string }   */
            return item.key
        }).slice()
        return <Transfer
            dataSource={TbalePropertyApp.viewModel.transferShowColumns.map((item) => {
                return { key: item.key,title: item.title as string }
            })}
            titles={['全部列','移除列']}
            targetKeys={targetKeys}
            footer={this.renderFooter}
            onSelectChange={(sourceSelectedKeys,targetSelectedKeys) => {
                this.viewModel.sourceSelectedKeys = sourceSelectedKeys;
            }}
            onChange={(nextTargetKeys,direction,moveKeys) => {
                if (direction === 'right') {
                    const deletedColumns = TbalePropertyApp.viewModel.transferShowColumns.filter((item) => nextTargetKeys.includes(item.key.toString()))
                    const columns = TbalePropertyApp.viewModel.transferShowColumns.filter((item) => !nextTargetKeys.includes(item.key.toString()))
                    TbalePropertyApp.viewModel.tableColumns = columns.slice();
                    TbalePropertyApp.viewModel.deletedTableColumns = [...TbalePropertyApp.viewModel.deletedTableColumns || [],...deletedColumns]
                }
                if (direction === 'left') {
                    const deletedColumns = TbalePropertyApp.viewModel.transferShowColumns.filter((item) => nextTargetKeys.includes(item.key.toString()))
                    TbalePropertyApp.viewModel.deletedTableColumns = deletedColumns.slice();
                    const columns = TbalePropertyApp.viewModel.transferShowColumns.filter((item) => !nextTargetKeys.includes(item.key.toString()))
                    const arr = [...TbalePropertyApp.viewModel.tableColumns || [],...columns]
                    TbalePropertyApp.viewModel.tableColumns = arr.filter((item,index) => {
                        return arr.indexOf(item) === index  // 去重
                    })
                }
            }}
            render={item => item.title}
        />
    }
    renderAddTableColumns() {
        return <HLFormContainer
            <PropertyColumnsConfigFormFields>
            {...this.props.store.formProperyAddTableColumnsRef && this.props.store.formProperyAddTableColumnsRef.viewModel.InputDataModel}
            InputDataModel={PropertyColumnsConfigFormFields}
            mapPropsToFields={(props) => {
                return new PropertyColumnsConfigFormFields(props) // 实际处理结果实体
            }}
            onFieldsChange={(props,formFields) => {
                this.props.store.formProperyAddTableColumnsRef.store.updateFormInputData(this.props.store.formProperyAddTableColumnsRef.uid,formFields,this)
            }}
            onGetForm={(form,ref) => {
                this.form = form
                this.props.store.formProperyAddTableColumnsRef = ref;
            }}
            colCount={1}
            controls={this.createTableColumnsConfig()}
        ></HLFormContainer>
    }
    handleChangeColumsType = (e) => {
        /* const { PropertyApp } = this.props.store.context */
        const TbalePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
        TbalePropertyApp.viewModel.isEditTableColumnsType = e.target.value;
        if (e.target.value === 'delete') {
            this.viewModel.operationEnum = OperationEnum.EditColumns;
            TbalePropertyApp.viewModel.transferShowColumns = TbalePropertyApp.viewModel.tableColumns.slice();
        }
    }
    handleEditCode = (value) => {
        const viewModel: PropertyTableDataSourceFormFields = this.props.store.formProperyDataSourceRef.viewModel.InputDataModel as PropertyTableDataSourceFormFields;
        if (EditCodeEnum.transform === value) {
            this.modalRef.viewModel.title = '数据转换'
            this.viewModel.codeValue = viewModel.transform.value || TABLE_TRANFORM_CODE;
        }
        if (EditCodeEnum.VModel === value) {
            this.modalRef.viewModel.title = 'VModel'
            this.viewModel.codeValue = viewModel.model.value || AutoQueryVModelCode;
        }
        if (EditCodeEnum.headers === value) {
            this.modalRef.viewModel.title = 'headers'
            this.viewModel.codeValue = viewModel.headers.value || "{'HL-Access-Token':HeadersToken}";
        }
        if (EditCodeEnum.token === value) {
            this.modalRef.viewModel.title = 'token'
            this.viewModel.codeValue = viewModel.token.value || TABLE_TOKEN_CODE;
        }
        if (EditCodeEnum.onSearch === value) {
            this.modalRef.viewModel.title = '搜索'
            this.viewModel.codeValue = viewModel.onSearch.value || TABLE_SEARCH_CODE;
        }
        if (EditCodeEnum.onReset === value) {
            this.modalRef.viewModel.title = '重置'
            this.viewModel.codeValue = viewModel.onReset.value || TABLE_RESET_CODE;
        }
        if (EditCodeEnum.parames === value) {
            this.modalRef.viewModel.title = '搜索条件'
            this.viewModel.codeValue = viewModel.parames.value || TABLE_SEARCH_PARAMS_CODE;
        }
        this.modalRef.viewModel.visible = true;
        const width = 960;
        this.modalRef.viewModel.width = width;
        this.viewModel.operationEnum = OperationEnum.EditTableCode
    }
    updateCodeValue(values: string) {
        if (this.modalRef.viewModel.title === '数据转换') {
            this.props.store.formProperyDataSourceRef.store.updateFormInputData(this.props.store.formProperyDataSourceRef.uid,{ transform: { value: values } },this)
        }
        else if (this.modalRef.viewModel.title === 'VModel') {
            this.props.store.formProperyDataSourceRef.store.updateFormInputData(this.props.store.formProperyDataSourceRef.uid,{ model: { value: values } },this)
        }
        else if (this.modalRef.viewModel.title === 'headers') {
            this.props.store.formProperyDataSourceRef.store.updateFormInputData(this.props.store.formProperyDataSourceRef.uid,{ headers: { value: values } },this)
        }
        else if (this.modalRef.viewModel.title === 'token') {
            this.props.store.formProperyDataSourceRef.store.updateFormInputData(this.props.store.formProperyDataSourceRef.uid,{ token: { value: values } },this)
        }
        else if (this.modalRef.viewModel.title === '搜索') {
            this.props.store.formProperyDataSourceRef.store.updateFormInputData(this.props.store.formProperyDataSourceRef.uid,{ onSearch: { value: values } },this)
        }
        else if (this.modalRef.viewModel.title === '重置') {
            this.props.store.formProperyDataSourceRef.store.updateFormInputData(this.props.store.formProperyDataSourceRef.uid,{ onReset: { value: values } },this)
        }
        else if (this.modalRef.viewModel.title === '搜索条件') {
            this.props.store.formProperyDataSourceRef.store.updateFormInputData(this.props.store.formProperyDataSourceRef.uid,{ parames: { value: values } },this)
        }
        else if (this.modalRef.viewModel.title === '编辑自定义渲染函数') {
            this.props.store.formProperyAddTableColumnsRef.store.updateFormInputData(this.props.store.formProperyAddTableColumnsRef.uid,{ customColumnsRender: { value: values } },this)
        }
        /* this.modalRef.viewModel.visible = false; */
    }
    onEditOrAddColumns = () => {
        runInAction(() => {
            const TbalePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
            if (TbalePropertyApp.viewModel.isEditTableColumnsType === 'add') {
                this.props.store.formProperyAddTableColumnsRef.viewModel.form.validateFields((err,values: PropertyColumnsConfigFormFields) => {
                    const value = PropertyColumnsConfigFormFields.formFieldsToData(PropertyColumnsConfigFormFields,this.props.store.formProperyAddTableColumnsRef.viewModel.InputDataModel)
                    if (!err) {
                        /* const PropertyApp = this.props.store.context.PropertyApp */

                        // @ts-ignore
                        TbalePropertyApp.viewModel.tableColumns.push({ ...value,key: value['dataIndex'] })
                        TbalePropertyApp.viewModel.tableColumns = TbalePropertyApp.viewModel.tableColumns.slice()
                        message.success('添加成功');
                        this.props.store.formProperyAddTableColumnsRef.store.updateFormInputData(this.props.store.formProperyAddTableColumnsRef.uid,new PropertyColumnsConfigFormFields(),this)
                    }
                })
            }
            if (this.viewModel.operationEnum === OperationEnum.EditColumns) {
                this.props.store.formProperyAddTableColumnsRef.viewModel.form.validateFields((err,values: PropertyColumnsConfigFormFields) => {
                    const value = PropertyColumnsConfigFormFields.formFieldsToData(PropertyColumnsConfigFormFields,this.props.store.formProperyAddTableColumnsRef.viewModel.InputDataModel)
                    if (!err) {
                        let index = TbalePropertyApp.viewModel.tableColumns.findIndex((item) => item.dataIndex === value['dataIndex'])
                        if (index > -1) {
                            // @ts-ignore
                            TbalePropertyApp.viewModel.tableColumns[index] = { ...value,key: value['dataIndex'] }
                            TbalePropertyApp.viewModel.tableColumns = TbalePropertyApp.viewModel.tableColumns.slice()
                            message.success('编辑成功');
                            this.modalRef.viewModel.visible = false;
                            this.props.store.formProperyAddTableColumnsRef.store.updateFormInputData(this.props.store.formProperyAddTableColumnsRef.uid,new PropertyColumnsConfigFormFields(),this)
                        }
                    }
                })
            }
        })

    }
    render() {
        /* const { PropertyApp } = this.props.store.context */
        const TbalePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
        return (
            <React.Fragment>

                <Collapse className="hl-table-property" defaultActiveKey={['1','2','3']}>
                    <Panel header="列属性" key="1">

                        <Row>
                            <Col span={5}><Button type="primary" onClick={() => {
                                const TbalePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
                                TbalePropertyApp.viewModel.isEditTableColumnsType = 'add';
                                TbalePropertyApp.addTableColumnsModalRef.viewModel.visible = true;
                                TbalePropertyApp.addTableColumnsModalRef.viewModel.title = '添加列数据';
                            }}>添加</Button></Col>
                            <Col span={5}> <Button onClick={() => {
                                this.viewModel.operationEnum = OperationEnum.EditColumns;
                                TbalePropertyApp.viewModel.transferShowColumns = TbalePropertyApp.viewModel.tableColumns.slice();
                                TbalePropertyApp.viewModel.isEditTableColumnsType = 'edit';
                                TbalePropertyApp.addTableColumnsModalRef.viewModel.visible = true;
                                TbalePropertyApp.addTableColumnsModalRef.viewModel.title = '查看列数据';
                            }}>编辑</Button></Col>


                        </Row>

                    </Panel>
                    <Panel header="基础配置" key="3">
                        <HLFormContainer
                            <PropertyTableBaseConfigFormFields>
                            {...this.props.store.formProperyBaseConfigRef && this.props.store.formProperyBaseConfigRef.viewModel.InputDataModel}
                            InputDataModel={PropertyTableBaseConfigFormFields}
                            mapPropsToFields={(props) => {
                                return new PropertyTableBaseConfigFormFields(props) // 实际处理结果实体
                            }}
                            onFieldsChange={(props,formFields) => {
                                this.props.store.formProperyBaseConfigRef.store.updateFormInputData(this.props.store.formProperyBaseConfigRef.uid,formFields,this)
                            }}
                            onGetForm={(form,ref) => {
                                this.props.store.formProperyBaseConfigRef = ref;

                            }}
                            colCount={1}
                            controls={this.createBaseConfig()}
                        ></HLFormContainer>
                    </Panel>
                    <Panel header="数据源" key="2">
                        <HLFormContainer
                            <PropertyTableDataSourceFormFields>
                            {...this.props.store.formProperyDataSourceRef && this.props.store.formProperyDataSourceRef.viewModel.InputDataModel}
                            /* {...this.viewModel.viewDataSourceForm} */
                            InputDataModel={PropertyTableDataSourceFormFields}
                            mapPropsToFields={(props) => {
                                return new PropertyTableDataSourceFormFields(props) // 实际处理结果实体
                            }}
                            onFieldsChange={(props,formFields) => {
                                this.props.store.formProperyDataSourceRef.store.updateFormInputData(this.props.store.formProperyDataSourceRef.uid,formFields,this)
                                this.viewModel.viewDataSourceForm = this.props.store.formProperyDataSourceRef.viewModel.InputDataModel as PropertyTableDataSourceFormFields
                            }}
                            onGetForm={(form,ref) => {
                                this.props.store.formProperyDataSourceRef = ref;
                            }}
                            colCount={1}
                            controls={this.createDataSourceConfig()}
                        ></HLFormContainer>
                    </Panel>
                </Collapse>
                <HLModalContext content={(<React.Fragment>
                    {this.viewModel.operationEnum === OperationEnum.EditTableCode && <CodeEditor
                        width="100%"
                        height="300px"
                        mode="typescript"
                        value={this.viewModel.codeValue}
                        onChange={(values: string) => {
                            this.updateCodeValue(values)
                            /* this.viewModel.viewDataSourceForm = this.formDataSourceRef.viewModel.InputDataModel as PropertyTableDataSourceFormFields */
                            this.viewModel.codeValue = values
                        }}
                    ></CodeEditor>}
                    {
                        this.viewModel.operationEnum === OperationEnum.EditColumns && this.renderAddTableColumns()
                    }
                </React.Fragment>)}>
                    <HLModal
                        closable={false}
                        maskClosable={false}
                        onOk={() => {
                            if (this.viewModel.operationEnum === OperationEnum.EditTableCode) {
                                this.updateCodeValue(this.viewModel.codeValue);
                                console.log(transformCode(this.viewModel.codeValue));
                            }
                            if (this.viewModel.operationEnum === OperationEnum.EditColumns) {
                                this.onEditOrAddColumns()
                            }
                            this.modalRef.viewModel.visible = false;
                            if (this.modalRef.viewModel.title === '编辑自定义渲染函数') {
                                TbalePropertyApp.addTableColumnsModalRef.viewModel.visible = true;
                            }
                        }}
                        onReady={(value) => {
                            // 表格其他属性代码设置模态框
                            this.modalRef = value;
                            const width = 960;
                            this.modalRef.viewModel.width = width;
                        }}>

                    </HLModal>
                </HLModalContext>

                <HLModalContext content={(<React.Fragment>

                    {
                        TbalePropertyApp.viewModel.isEditTableColumnsType === 'add' && this.renderAddTableColumns()
                    }

                    {TbalePropertyApp.viewModel.isEditTableColumnsType === 'edit' && this.renderDeleteColumns()}
                </React.Fragment>)}>
                    <HLModal
                        onOk={() => {
                            this.onEditOrAddColumns()
                        }}
                        onCancel={() => {
                            TbalePropertyApp.viewModel.isEditTableColumnsType = null;
                        }}
                        closable={false}
                        maskClosable={false}
                        onReady={(value) => {
                            // 添加表格列数据模态框组件
                            TbalePropertyApp.addTableColumnsModalRef = value;
                            const width = 560;
                            TbalePropertyApp.addTableColumnsModalRef.viewModel.width = width;
                        }}>

                    </HLModal>
                </HLModalContext>
            </React.Fragment>
        )
    }
}