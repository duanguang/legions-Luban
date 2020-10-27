/* 列表页制作画布
 * @Author: duanguang 
 * @Date: 2020-01-16 15:06:01 
 * @Last Modified by: duanguang
 * @Last Modified time: 2020-07-31 13:44:53
 */
import React,{ Component } from 'react'
import { ListPageLayout,HLFormContainer,HLModal,HlDragger,HLTable,QueryConditions, OpenConfirm } from 'hoolinks-legion-design';
import {
    Row,
    Icon,
    Dropdown,
    Menu,
    message,
    Button,
} from 'antd';
import { InstanceForm,InstanceModal,IQuery,InstanceHlTable } from 'hoolinks-legion-design/lib/typings/components';
import { bind,observer } from 'legions/store-react'
import ProjectStore from '../../stores/projectStore';
import { WrappedFormUtils } from 'hoolinks-legion-design/lib/typings/antd';
import { shortHash } from 'hoolinks-legion-design/lib/utils/utils';
import TextProperty from '../../components/property/textProperty';
import classNames from 'classnames';
import styles from '../../assets/css/table-list-page.modules.less'
import TableProperty from '../../components/property/tableProperty';
import {
    PropertyColumnsConfigFormFields,
    PropertyTableDataSourceFormFields,
    PropertyTableBaseConfigFormFields,
    PropertyTableOperationFormFields,
} from '../../models/form/propertyFormModel';
import { HLModalContext } from '../../../common/components/modal/HLModalContext';
import { QueryTemplate } from '../../components/template/queryTemplate';
import { observable,action,computed,runInAction } from 'mobx';
import { observablePromise } from 'legions/store-utils'
import { PageListNameContainerEntity } from '../../models/pageListEntity';
import OperationProerty from '../../components/property/operation-proerty';
import { OPREATION_VIEW } from '../../constants/consts';
import { IOperationConfigCode } from '../../stores/projectTableProperty';
import { ContextStore } from '../../../common/components/contextStore/contextStore';
import get from 'lodash/get'
import set from 'lodash/set'
import  has  from 'lodash/has'
import { PropertyQueryFormFields } from '../../models/form/propertyQueryFormFields';
interface IProps {
    store?: ProjectStore
}
@bind({ store: ProjectStore })
@observer
export default class TableListViewCanvas extends QueryTemplate<IProps,{}> {
    /* formRef: InstanceForm = null */
    form: WrappedFormUtils = null
    modalRef: InstanceModal = null
    viewProperty: IQuery = null
    operattionProerterRef: OperationProerty = null;
    tableModalRef: InstanceModal = null
    constructor(props: IProps) {
        super(props)
        this.state = {

        }
    }

    // tslint:disable-next-line: typedef
    componentDidCatch(error: Error, _errorInfo) {
        console.log(error,'error')
    }
    handleDraggerAdd =(evt)=> {
        const maxIndex = shortHash(new Date().getTime());
        const component = evt.clone.dataset.id as string;
        const ViewCanvasApp = this.props.store.context.listPagePropertyApp.context.QueryPropertyApp;
        switch (component) {
            case 'text':
                ViewCanvasApp.viewModel.addQuery(this.createText(maxIndex))
                break;
            case 'textArea':
                ViewCanvasApp.viewModel.addQuery(this.createTextArea(maxIndex))
                break;
            case 'select':
                ViewCanvasApp.viewModel.addQuery(this.createSelect(maxIndex))
                break;
            case 'date':
                ViewCanvasApp.viewModel.addQuery(this.createDate(maxIndex))
                break;
            case 'daterange':
                ViewCanvasApp.viewModel.addQuery(this.createDaterange(maxIndex))
                break;
            case 'checkBox':
                ViewCanvasApp.viewModel.addQuery(this.createCheckBox(maxIndex))
                break;
            case 'number':
                ViewCanvasApp.viewModel.addQuery(this.createNumberInput(maxIndex))
                break;
            case 'radioButton':
                ViewCanvasApp.viewModel.addQuery(this.createRadioButton(maxIndex))
                break;
        }
    }
    handleDraggerChange = (items: string[],sort,evt) => {
        const DATAID = evt.item.attributes['data-id']
        const GROUP_NAME = evt.to.attributes['dragger-id'];
        const ViewCanvasApp = this.props.store.context.listPagePropertyApp.context.QueryPropertyApp;
        if (items.length > 1 && items.length === ViewCanvasApp.viewModel.query.length) {
            const newQuery: IQuery[] = [];
            items.map((item) => {
                const entity = ViewCanvasApp.viewModel.query.find((model) => model.container.component.JsonProperty.uuid === item)
                if (entity) {
                    newQuery.push(entity);
                }
            })
            ViewCanvasApp.viewModel.query = newQuery;
        }
        else if (items.length < ViewCanvasApp.viewModel.query.length&&DATAID&&GROUP_NAME&&GROUP_NAME.value==='query') {
            const index = ViewCanvasApp.viewModel.query.findIndex((model) => model.container.component.JsonProperty.uuid === DATAID.value)
            console.log(index,DATAID.value)
            if (index > -1) {
                ViewCanvasApp.viewModel.dispatchAction(() => {
                    ViewCanvasApp.viewModel.query.splice(index,1);
                })
            }
        }
    }
    /**
     *
     * 搜索条件拖拽画布
     * @param {[]} items
     * @param {string} key
     * @returns
     * @memberof ListViewCanvas
     */
    renderQueryHlDragger(items: [],key: string) {
        return <HlDragger
            style={{ width: '100%' }}
            key={key}
            options={{
                animation: 150,
                group: {
                    name: 'query',
                    pull: true,
                    put: true,
                },
                onAdd: this.handleDraggerAdd,
            }}
            onChange={this.handleDraggerChange}
        >
            {items.map((item,index) => {
                const name = item['props']['name']
                return <div style={{ float: 'left',position: 'relative',width: `${item['props']['width']}px` }} key={name} onClick={this.handleClick.bind(this,name)} data-id={name}>{item}</div>
            })}
        </HlDragger>
    }

    /**
     *
     * 表格组件画布区域
     * @returns
     * @memberof ListViewCanvas
     */
    renderContentDragger() {
        const TbalePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
       /*  let tablePrams = {
            method: 'get',
            token:'',
            url:'',
        }
        if (TbalePropertyApp.viewModel.tableDataSourceCode) {
            tablePrams = {
                method: TbalePropertyApp.viewModel.tableDataSourceCode.method,
                token: this.props.store.projectEditViewModel.token,
                url: TbalePropertyApp.viewModel.tableDataSourceCode.apiUrl,
                ... TbalePropertyApp.viewModel.paramesExeccodeast
            }
        } */
        /* const { PropertyApp} = this.props.store.context */
        return <HlDragger
            style={{ width: '100%' }}
            options={{
                animation: 150,
                group: {
                    name: 'content',
                    pull: true,
                    put: true,
                },
            }}
            onChange={(items: string[]) => {
                console.log(items)
                TbalePropertyApp.viewModel.contentDraggerList = items.length ? [items[0]] : [];
            }}
        >
            {TbalePropertyApp.viewModel.contentDraggerList.length?TbalePropertyApp.viewModel.contentDraggerList.map((item) => {
                return <ContextStore content={(
                    <HLTable
                        onReady={(instance: InstanceHlTable) => {
                        instance.viewModel.isAdaptiveHeight = true;
                        instance.viewModel.bodyExternalContainer.set('btn',{ height: 32 });
                        instance.viewModel.bodyExternalContainer.set('other',{ height: 160 });
                        this.props.store.context.listPagePropertyApp.context.TablePropertyApp.tableRef = instance
                        }}
                        autoQuery={{
                            params: (pageIndex,pageSize) => {
                                
                                return { pageSize, pageIndex }
                            },
                            token: '',
                            ApiUrl: '',
                            method: 'get',
                            transform: (value: observablePromise.PramsResult<PageListNameContainerEntity>) => {
                                console.log(value)
                                if (value && !value.isPending&&value.value) {
                                    const { data, current, size } = value.value['result'];
                                    return {
                                        data:Array.isArray(data)&&data.map((item, index) => {
                                            item['key'] = (index + 1) + (current - 1) * size;
                                            return item;
                                        }),
                                        total:value.value['result'].total,
                                    };
                                }
                                return {
                                    total: 0,
                                    data:[],
                                };
                            },
                            model:PageListNameContainerEntity,
                        }}
                    size="middle"
                    scroll={{ y: 300,x: '100%' }}
                    loading={false}
                    total={0}
                    uniqueKey="id"
                    data={[]}
                    columns={TbalePropertyApp.viewModel.tableColumns}
                    onPagingQuery={() => { }}
                ></HLTable>
                )}>< Row key = { item } className = {
                        classNames({
                    [styles['tableSelected']]:TbalePropertyApp.viewModel.isEditByTable,
                        })}
                    // @ts-ignore
                    onClick={() => {
                    let  isEditByTable = TbalePropertyApp.viewModel.isEditByTable
                    TbalePropertyApp.viewModel.isEditByTable = !isEditByTable
                    this.tableModalRef.viewModel.visible = true;
                    this.tableModalRef.viewModel.title = '设置表格属性'
                    }} >
                    </Row></ContextStore>
            }) : <Row
                    // @ts-ignore
                onClick={() => {
               /*  let  isEditByTable = TbalePropertyApp.viewModel.isEditByTable
                TbalePropertyApp.viewModel.isEditByTable = !isEditByTable
                this.tableModalRef.viewModel.visible = true;
                this.tableModalRef.viewModel.title = '设置表格属性' */
                }}
                className={classNames({
                [styles['tableUnSelected']]:true,
            })}
                ><h3>请拖入表格组件展示数据</h3></Row>}
        </HlDragger>
    }
    renderOperationDragger() {
        const TbalePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
        return <HlDragger
            style={{ width: '100%' }}
            options={{
                animation: 150,
                group: {
                    name: 'operation',
                    pull: true,
                    put: true,
                },
            }}
            onChange={(items: string[],sort,evt) => {
                const DATAID = evt.item.attributes['data-id']
                const GROUP_NAME = evt.to.attributes['dragger-id'];
                const ViewCanvasApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
                if (items.length > 1 && items.length === ViewCanvasApp.viewModel.operationConfigCode.length) {
                    const newQuery: IOperationConfigCode[] = [];
                    items.map((item) => { /** 操作按钮重新排序 */
                        const entity = ViewCanvasApp.viewModel.operationConfigCode.find((model) => model.id === item)
                        if (entity) {
                            newQuery.push(entity);
                        }
                    })
                    ViewCanvasApp.viewModel.operationConfigCode = newQuery;
                }
                else if (items.length < ViewCanvasApp.viewModel.operationConfigCode.length&&DATAID&&GROUP_NAME&&GROUP_NAME.value==='operation') {
                    const index = ViewCanvasApp.viewModel.operationConfigCode.findIndex((model) => model.id === DATAID.value)
                    if (index > -1) { /** 操作按钮删除 */
                        ViewCanvasApp.viewModel.dispatchAction(() => {
                            ViewCanvasApp.viewModel.operationConfigCode.splice(index,1);
                        })
                    }
                }
            }}
        >
            {TbalePropertyApp.viewModel.operationConfigCode.length?TbalePropertyApp.viewModel.operationConfigCode.map((item,index) => {
                // @ts-ignore
                return <Button data-id={item.id} size="small" type={item.btnType} icon={item.btnIcon} onClick={this.onOperationClick.bind(this,item.type,item.id)}>{item.name}</Button>;
                /* </Dropdown> */
            }):<Row className={classNames({
                [styles['operationUnSelected']]:true,
            })}
                ><h3>请拖入操作组件</h3></Row>}
        </HlDragger>
    }
    onOperationClick = (type:string,id:string) => {
        const TbalePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
        const defaultView = OPREATION_VIEW[type]
        const operationCurrView = TbalePropertyApp.viewModel.operationConfigCode.find(item => item.id === id)
        TbalePropertyApp.operationModalRef.viewModel.visible = true;
        TbalePropertyApp.operationModalRef.viewModel.title = defaultView ? defaultView['name'] : '操作按钮';
        if (operationCurrView) {
            TbalePropertyApp.viewModel.openOperationConfigId = id;
            const timeId = setTimeout(() => {
                // @ts-ignore
               const Model = PropertyTableOperationFormFields.dataToFormFields<PropertyTableOperationFormFields,IOperationConfigCode>(this.props.store.formProperyOperattionRef.viewModel.InputDataModel,operationCurrView)
                this.props.store.formProperyOperattionRef.store.updateFormInputData(this.props.store.formProperyOperattionRef.uid,Model,this.operattionProerterRef)
                clearTimeout(timeId)
            }, 500);
        }
    }
    /**
     * 搜索条件属性设置触发事件
     *
     * @param {string} [keys='']
     * @memberof ListViewCanvas
     */
    handleClick(keys: string = '') {
        this.modalRef.viewModel.visible = true;
        const { context } = this.props.store
        const TbalePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
        Object.keys(this.componentType).forEach((key) => {
            if (keys.indexOf(key) > -1) {
                this.modalRef.viewModel.title = this.componentType[key].title
                // @ts-ignore
                TbalePropertyApp.viewModel.componentActiveType = key
                /* context.ViewCanvasApp.triggerGetQueryEven(keys); */
                context.listPagePropertyApp.context.QueryPropertyApp.triggerGetQueryEven(keys);
            }
        })
        const property ={
            label: 'container.component.label',
            name: 'container.component.JsonProperty.name',
            queryPrams: 'container.component.JsonProperty.queryPrams',
            maxlength: 'container.component.props.maxlength',
            width: 'container.component.props.width',
            containerWidth: 'container.width',
            placeholder:'container.component.props.placeholder',
        }
        const values = {};
        Object.keys(property).map((item) => {
            let value = get(TbalePropertyApp.viewModel.currComponentView,property[item]);
            if (item === 'label') {
                if (value === void 0) {
                    value =''
                }
                value = value.replace(':','')
            }
            values[item] =value
        })
        const value = PropertyQueryFormFields.dataToFormFields<PropertyQueryFormFields,{}>(new PropertyQueryFormFields(),values)
        const timeid = setTimeout(() => {
            TbalePropertyApp.updateQueryConditionsFormProperyRef.store.updateFormInputData(TbalePropertyApp.updateQueryConditionsFormProperyRef.uid,value,TbalePropertyApp.updateQueryConditionsFormProperyRef.that)
            const componentActiveType = TbalePropertyApp.viewModel.componentActiveType
            let visible = false;
            let labelNamevisible = true;
            if (componentActiveType === 'radioButton' || componentActiveType === 'select') {
                visible = true;
            } 
            TbalePropertyApp.updateQueryConditionsFormProperyRef.viewModel.setFormState('selectOptionsValueRender',{
                visible:visible,
            })
            if (componentActiveType === 'checkBox') {
                labelNamevisible = false;
            }
            TbalePropertyApp.updateQueryConditionsFormProperyRef.viewModel.setFormState('labelName',{
                visible:labelNamevisible,
            })
            clearTimeout(timeid)
        },100)
    }
    handleTableProperyCancel = () => {
        this.tableModalRef.viewModel.visible = false;
    }

    handleTableProperyOk = () => {
        const formValue: { error: Boolean; value: Object;key:string}[] = [];
        const DataSourceRefKey = 'DataSourceRef';
        const BaseConfigRefKey = 'BaseConfigRef';
        const updateFormValue = (key: string,error: boolean,value: Object) => {
            const item = formValue.find((entity) => entity.key === key);
            if (item) {
                item.value = value;
                item.error = error;
            }
            else {
                formValue.push({error,value,key})
            }
        }
        this.props.store.formProperyDataSourceRef&&this.props.store.formProperyDataSourceRef.viewModel.form.validateFields((err,values: PropertyTableDataSourceFormFields) => {
            const value = PropertyTableDataSourceFormFields.formFieldsToData(PropertyTableDataSourceFormFields,this.props.store.formProperyDataSourceRef.viewModel.InputDataModel)
            if (!err) {
                updateFormValue(DataSourceRefKey,false,value)
                
            } else {
                updateFormValue(DataSourceRefKey,true,value)
            }
        })
        this.props.store.formProperyBaseConfigRef&&this.props.store.formProperyBaseConfigRef.viewModel.form.validateFields((err,values: PropertyTableBaseConfigFormFields) => {
            const value = PropertyTableBaseConfigFormFields.formFieldsToData(PropertyTableBaseConfigFormFields,this.props.store.formProperyBaseConfigRef.viewModel.InputDataModel)
            if (!err) {
                updateFormValue(BaseConfigRefKey,false,value)
            } else {
                updateFormValue(BaseConfigRefKey,true,value)
            }
        })
        const result = formValue.every((item) => !item.error)
        if (result && formValue.length) {
            const TbalePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
            runInAction(() => {
                // @ts-ignore
                TbalePropertyApp.viewModel.tableDataSourceCode = formValue.find((item) => item.key === DataSourceRefKey).value;
                // @ts-ignore
                TbalePropertyApp.viewModel.tableBaseConfigCode = formValue.find((item) => item.key === BaseConfigRefKey).value
            })
            /* this.props.store.formProperyDataSourceRef.store.updateFormInputData(this.props.store.formProperyDataSourceRef.uid,new PropertyTableDataSourceFormFields(),this) */
            message.success('表格基础配置和数据源配置设置成功')
            console.log(TbalePropertyApp.viewModel.tableDataSourceCode);
            this.tableModalRef.viewModel.visible = false;
        }
    }
    render() {
        const ViewCanvasApp = this.props.store.context.listPagePropertyApp.context.QueryPropertyApp;
        const TablePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
        return (
            <React.Fragment>
                <ListPageLayout
                    query={(
                        <QueryConditions
                            ondragger={this.renderQueryHlDragger.bind(this)}
                            query={[...ViewCanvasApp.viewModel.query.map(item => {
                                return { ...item }
                            }),...this.createSearchButton()] as IQuery[]} onReady={(value) => {
                            }}></QueryConditions>
                    )}
                    content={(
                        this.renderContentDragger()
                    )}
                    operation={(this.renderOperationDragger())}
                ></ListPageLayout>
                
                <HLModalContext content={(<TextProperty ></TextProperty>)}>
                    <HLModal
                        closable={false}
                        maskClosable={false}
                        footer={(<React.Fragment>
                            <Button onClick={() => {
                                OpenConfirm({
                                    title: '关闭',
                                    content: '部分数据未保存,如果离开数据将无法保存,您确定离开吗？',
                                    onOk: () => {
                                        this.modalRef.viewModel.visible = false;
                                    }
                                })
                            }}>取消</Button>
                            <Button type="primary" onClick={() => {
                                TablePropertyApp.updateQueryConditionsFormProperyRef.viewModel.form.validateFields((error,values) => {
                                    const value =TablePropertyApp.updateQueryConditionsFormProperyRef.viewModel.InputDataModel as PropertyQueryFormFields
                                    if (!error) {
                                        runInAction(() => {
                                            TablePropertyApp.viewModel.currComponentView.container.component.JsonProperty.name = value.componentName.value;
                                            TablePropertyApp.viewModel.currComponentView.container.component.JsonProperty.queryPrams = value.queryPrams.value;
                                            TablePropertyApp.triggerUpdateComponentViewEven(TablePropertyApp.viewModel.currComponentView,TablePropertyApp.viewModel.model.currComponentView.container.component.JsonProperty.uuid)
                                        })
                                        this.modalRef.viewModel.visible = false;
                                        message.success('属性设置成功')
                                    }
                                })
                            }}>保存</Button>
                        </React.Fragment>)}
                        modalType="Drawer"
                        placement="right"
                        onReady={(value) => {
                            this.modalRef = value;
                            const width = 450;
                            this.modalRef.viewModel.width = width;
                            /*  this.modalRef.viewModel.title = '创建项目' */
                        }}>
                    </HLModal> 
                    </HLModalContext>
                <HLModalContext content={(<OperationProerty onReady={(that) => {
                    this.operattionProerterRef = that;
                }}></OperationProerty>)}>
                    <HLModal
                        onOk={() => {
                            /* const TbalePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
                            TbalePropertyApp.viewModel.dispatchAction(() => {
                                if(TbalePropertyApp.viewModel.operationConfigCode ===null){
                                    TbalePropertyApp.viewModel.operationConfigCode = [];
                                }
                                TbalePropertyApp.viewModel.operationConfigCode.push(TbalePropertyApp.viewModel.operationCurrView)
                                console.log(TbalePropertyApp.viewModel.operationConfigCode)
                            }) */
                            this.props.store.formProperyOperattionRef&&this.props.store.formProperyOperattionRef.viewModel.form.validateFields((err,values: PropertyTableOperationFormFields) => {
                                const value = PropertyTableOperationFormFields.formFieldsToData(PropertyTableOperationFormFields,this.props.store.formProperyOperattionRef.viewModel.InputDataModel)
                                const TbalePropertyApp = this.props.store.context.listPagePropertyApp.context.TablePropertyApp;
                                if (!err) {
                                    const _index = TbalePropertyApp.viewModel.operationConfigCode.findIndex(item => item.id === TbalePropertyApp.viewModel.openOperationConfigId)
                                    if (_index > -1) {
                                        TbalePropertyApp.viewModel.dispatchAction(() => {
                                            TbalePropertyApp.viewModel.operationConfigCode[_index]={
                                                ...TbalePropertyApp.viewModel.operationConfigCode[_index],
                                                ...{
                                                    name: value['name'],nameEn: value['nameEn'],apiUrl: value['apiUrl'],
                                                    method:value['method'],
                                                },
                                            }
                                            TbalePropertyApp.viewModel.operationConfigCode = TbalePropertyApp.viewModel.operationConfigCode.slice()
                                        })
                                        message.success('属性设置成功');
                                        TbalePropertyApp.operationModalRef.viewModel.visible = false;
                                    }
                                } else {
                                    console.log(value)
                                }
                                console.log(TbalePropertyApp.viewModel.operationConfigCode)
                            })
                        }}
                        modalType="Drawer"
                        placement="right"
                        onReady={(value) => {
                            this.props.store.context.listPagePropertyApp.context.TablePropertyApp.operationModalRef = value;
                            const width = 350;
                            this.props.store.context.listPagePropertyApp.context.TablePropertyApp.operationModalRef.viewModel.width = width;
                            /*  this.modalRef.viewModel.title = '创建项目' */
                        }}>
                    </HLModal> 
                    </HLModalContext>
                {/* <MobXProviderContext.Consumer>
                    {
                            (context) => {
                                return <HLModal
                              footer={(<Button onClick={() => {
                                  this.tableModalRef.viewModel.visible = false;
                              }}>取消</Button>)}
                              modalType="Drawer"
                              placement="right"
                              onReady={(value) => {
                                  this.tableModalRef = value;
                                  const width = 550;
                                  this.tableModalRef.viewModel.width = width;
                              }}>
                              <Provider storeManage={context.storeManage}> <TableProperty></TableProperty></Provider>
                          </HLModal>
                              
                            }
                        }
                </MobXProviderContext.Consumer> */}
                <HLModalContext content={(<TableProperty></TableProperty>)}>
                    <HLModal
                        maskClosable={false}
                        onCancel={this.handleTableProperyCancel}
                        onOk={this.handleTableProperyOk}
                        modalType="Drawer"
                        placement="right"
                        onReady={(value) => {
                            this.tableModalRef = value;
                            const width = 400;
                            this.tableModalRef.viewModel.width = width;
                        }}>
                    </HLModal>
                </HLModalContext>
            </React.Fragment>
        )
    }
}