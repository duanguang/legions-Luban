import React,{ Component } from 'react'
import {
    ListPageLayout,
    HLFormContainer,
    HLModal,
    HlDragger,
    HLTable,
    QueryConditions,
    OpenConfirm
} from 'hoolinks-legion-design';
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
import classNames from 'classnames';
import { HLModalContext } from '../../../common/components/modal/HLModalContext';
import { observable,action,computed,runInAction } from 'mobx';
import { observablePromise } from 'legions/store-utils'
import styles from '../../assets/css/form-page.modules.less'
import { HLFormUtils } from 'hoolinks-legion-design/lib/utils/config-utils';
import { LabelWithInputModel } from 'hoolinks-legion-design/lib/models/HLForm';
import FormProerty from '../../components/property/formProperty';
import { PropertyFormElementFormFields } from '../../models/form/propertyFormElement';
import { ComponentType } from '../../stores/projectFormProperty';
import { PropertyInputVModel, PropertySelectVModel, PropertyDatePickerVModel, PropertyRangePickerVModel, PropertyUploadVModel, PropertySwitchVModel, PropertyRadioButtonVModel } from '../../models/propertyVModel';
import { MapperEntity } from 'json-mapper-object';
import { I_FORM_PROPS, FORMSUBMITPROPERTY } from '../../constants/consts';
import {cloneDeep} from 'lodash'
import CodeEditor from '../../components/codeEditor';
import { transformValidationRule } from '../../utils/form-page-codemod';
import { getExecutableScript } from '../../utils/codemodCore';
import { HlLabeledValue } from 'hoolinks-legion-design/lib/models/HlLabeledValue';
import get from 'lodash/get'
interface IProps {
    store?: ProjectStore
}
const FORM_BASE_DATA = {
    text: {
        name: '文本框',
    },
    select: {
        name:'下拉列表'
    },
    radioButton: {
        name:'单选组合'
    },
    radio: {
        name:'单选组合'
    },
    date: {
        name:'日期',
    },
    daterange: {
        name:'日期范围',
    },
    upload: {
        name:'上传',
    },
    switch: {
        name:'开关',
    }
}
const valueEnum = { '1': 'expression','2': 'expression','3': 'function' }
@bind({ store: ProjectStore })
@observer
export default class FormInformationCanvas extends Component<IProps,{}> {
    @computed get computedFormElementConfig() {
        const config = []
        const formPropertyApp = this.props.store.context.formPropertyApp;
        const FORM_PROPS = I_FORM_PROPS.reduce((pre,curr) => {
            return {...pre,...curr}
        },{})
        for (let item of formPropertyApp.formElement.keys()) {
            const configs = formPropertyApp.formElement.get(item)
            if (configs.config) {
                configs.config[FORM_PROPS[configs.type]] = {
                    ...configs.config[FORM_PROPS[configs.type]],
                    label:this.renderFormLable(configs.label,configs.type,item)
                }
                config.push(configs.config)
            }
        }
       return config;
    }
    @computed get group() {
        const formPropertyApp = this.props.store.context.formPropertyApp;
        return formPropertyApp.formPropertyViewModel.group;
    }
    /* formRef: InstanceForm = null */
    constructor(props: IProps) {
        super(props)
        this.state = {

        }
    }
    onLabelClick(type:ComponentType,mapKeys:string,label:string) {
        const formPropertyApp = this.props.store.context.formPropertyApp;
        formPropertyApp.formPropertyViewModel.dispatchAction(() => {
            formPropertyApp.formPropertyViewModel.editComponentData.keys = mapKeys;
            formPropertyApp.formPropertyViewModel.editComponentData.type = type;
        })
        formPropertyApp.formPropertyModalRef.viewModel.visible = true;
        formPropertyApp.formPropertyModalRef.viewModel.title = '设置表单元素属性';
        const item = formPropertyApp.getFormElementConfig(mapKeys);
        formPropertyApp.formPropertyViewModel.setCompoentData(mapKeys,type,label,item.config)
        const VModel = {
            text:PropertyInputVModel,
            select: PropertySelectVModel,
            date: PropertyDatePickerVModel,
            daterange: PropertyRangePickerVModel,
            upload: PropertyUploadVModel,
            switch:PropertySwitchVModel,
            radioButton:PropertyRadioButtonVModel,
            radio:PropertyRadioButtonVModel,
        }
        let model = {};
        FORMSUBMITPROPERTY[type] && FORMSUBMITPROPERTY[type].map(items => {
            const itemValue = formPropertyApp.formPropertyViewModel.propertyData.get(mapKeys).propertyValue.find((item) => item.key === items)
            model[items] = get(itemValue,'value',void 0);
        })
        const values = MapperEntity(VModel[type],{...formPropertyApp.formPropertyViewModel.compoentData.get(mapKeys).config,...model})
        console.log(model,values,{...formPropertyApp.formPropertyViewModel.compoentData.get(mapKeys).config,...model},formPropertyApp.formPropertyViewModel.compoentData.get(mapKeys).config)
        

        const value = PropertyFormElementFormFields.dataToFormFields<PropertyFormElementFormFields,{}>(new PropertyFormElementFormFields(),values)
        const timeid = setTimeout(() => {
            formPropertyApp.formProperyElementRef.store.updateFormInputData(formPropertyApp.formProperyElementRef.uid,value,formPropertyApp.formProperyElementRef.that)
            clearTimeout(timeid);
        },100)
    }
    renderFormLable(label: string,type: string,mapKeys:string) {
        return <span onClick={this.onLabelClick.bind(this,type,mapKeys,label)}>{label}</span>
    }
    createElementConfig(type: string,item: { antdNameKey: string; label: string,mapKeys: string }) {
        const formPropertyApp = this.props.store.context.formPropertyApp;
        const formUtils = new HLFormUtils<ProjectStore>({ store: ProjectStore })
        const span = 6
        const wrapSpan = 18
        switch (type) {
            case 'text':
                return formUtils.renderInputConfig({
                    iAntdProps: formUtils.createAntdProps(item.antdNameKey,1,''),
                    iFormProps: {
                        ...formUtils.createLayout(this.renderFormLable(item.label,type,item.mapKeys),span,wrapSpan),
                        maxLength: '50',
                        type: 'text',
                        /*  disabled: false, */
                    },
                    rules: [],
                })
            case 'select':
                return formUtils.renderSelectConfig({
                    iAntdProps: formUtils.createAntdProps(item.antdNameKey,1,''),
                    iFormProps: {
                        ...formUtils.createLayout(this.renderFormLable(item.label,type,item.mapKeys),span,wrapSpan),
                        allowClear: true,
                        options: [],
                    },
                    rules:[],
                })
            case 'radioButton':
                return formUtils.renderRadioButtonConfig({
                    iAntdProps: formUtils.createAntdProps(item.antdNameKey,1,''),
                    iFormProps: {
                        ...formUtils.createLayout(this.renderFormLable(item.label,type,item.mapKeys),span,wrapSpan),
                        radioButton: {
                            options: [{
                                label: '广州',
                                value: 'guangzhou',
                               /*  disabled: true, */
                            },{
                                label: '上海',
                                value: 'shanghai',
                            }],
                        },
                    },
                    rules:[],
                })
            case 'radio':
                return formUtils.renderRadioButtonConfig({
                    iAntdProps: formUtils.createAntdProps(item.antdNameKey,1,''),
                    iFormProps: {
                        ...formUtils.createLayout(this.renderFormLable(item.label,type,item.mapKeys),span,wrapSpan),
                        radio: {
                            options: [
                                {disabled: false,label: '是',value: '1' },
                                {disabled: false,label: '否',value: '0' },
                            ],
                        }
                    },
                    rules:[],
                })
            case 'date':
                return formUtils.renderDatePickerConfig({
                    iAntdProps: formUtils.createAntdProps(item.antdNameKey,1,'日期'),
                    iFormProps: {
                        ...formUtils.createLayout(this.renderFormLable(item.label,type,item.mapKeys),span,wrapSpan),
                       format:'YYYY-MM-DD HH:mm:ss',
                       showToday:true,
                       showTime:true,
                    },
                    rules:[]
                })
            case 'daterange':
                return formUtils.renderRangePickerConfig({
                    iAntdProps: formUtils.createAntdProps(item.antdNameKey,1,'日期'),
                    iFormProps: {
                        ...formUtils.createLayout(this.renderFormLable(item.label,type,item.mapKeys),span,wrapSpan),
                       format:'YYYY-MM-DD HH:mm:ss', 
                       showTime:true,
                    },
                    rules:[]
                })
            case 'upload':
                return formUtils.renderUploadConfig({
                    iAntdProps: formUtils.createAntdProps(item.antdNameKey,1,'上传'),
                    iFormProps: {
                        ...formUtils.createLayout(this.renderFormLable(item.label,type,item.mapKeys),span,wrapSpan),
                       /*  isDragger:true, */
                    },
                    rules:[]
                })
            case 'switch':
                return formUtils.renderSwitchConfig({
                    iAntdProps: formUtils.createAntdProps(item.antdNameKey,1,'开关'),
                    iFormProps: {
                        ...formUtils.createLayout(this.renderFormLable(item.label,type,item.mapKeys),span,wrapSpan),
                    },
                    rules:[]
                })
        }
    }
    get getFormComponentPropertyViewModel() {
        const formPropertyApp = this.props.store.context.formPropertyApp;
        if (!formPropertyApp.formComponentProperyRef) {
            return null;
        }
        const InputDataModel: PropertyFormElementFormFields = formPropertyApp.formComponentProperyRef.viewModel.InputDataModel as PropertyFormElementFormFields
        return InputDataModel
    }
    newViewModel = (props) => {
        const formPropertyApp = this.props.store.context.formPropertyApp;
        return {...formPropertyApp.formDraggerModel,...props}
    }
    render() {
        const formPropertyApp = this.props.store.context.formPropertyApp;
        const { propertyType,property} = formPropertyApp.formPropertyViewModel.editComponentData
        const value = formPropertyApp.getProperyElementValue(property) as HlLabeledValue;
        const codes = formPropertyApp.formPropertyViewModel.getPropertyValueTemp(property,valueEnum[value?.key]||propertyType)
        let code = '';
        if (codes) {
            code = codes.value as string
            formPropertyApp.formPropertyViewModel.codeValue = code;
        }
        return (
            <React.Fragment>
                <HlDragger
                    style={{ width: '100%' }}
                    className={styles['FormPageContainer']}
                options={{
                    animation: 150,
                    group: {
                        name: 'formElement',
                        pull: true,
                        put: true,
                    },
                }}
            onChange={(items: string[],sort,evt) => {
                const DATAID = evt.item.attributes['data-id']
                const GROUP_NAME = evt.to.attributes['dragger-id'];
                const formPropertyApp = this.props.store.context.formPropertyApp;
                const baseValue = FORM_BASE_DATA[DATAID.value]
                const mapKeys = `${shortHash(DATAID.value + new Date().getTime())}`
                /* const name = `${DATAID.value}${this.computedFormElementConfig.length}` */
                const name = `element${this.computedFormElementConfig.length}`
                formPropertyApp.addFormElement(mapKeys,this.createElementConfig(DATAID['value'] as string,{
                    antdNameKey: name,
                    label: baseValue && baseValue.name,
                    mapKeys,
                }),baseValue && baseValue.name,DATAID['value'] as ComponentType,name)
            }}
            >
                    {this.computedFormElementConfig.length ? <HLFormContainer
                    {...formPropertyApp.formPropertyDraggerRef && formPropertyApp.formPropertyDraggerRef.viewModel.InputDataModel}
                    mapPropsToFields={(props) => {
                        const obj = {}
                        Object.keys(props).forEach((item) => {
                            obj[item] = {
                                ...props[item],
                                value:props[item]&&props[item].value
                            }
                        })
                        return obj // 实际处理结果实体
                    }}
                    InputDataModel={this.newViewModel}
                    onFieldsChange={(props,formFields) => {
                        console.log(formFields)
                        formPropertyApp.formPropertyDraggerRef.store.updateFormInputData(formPropertyApp.formPropertyDraggerRef.uid,formFields,this)
                    }}
                    onGetForm={(form,ref) => {
                        formPropertyApp.formPropertyDraggerRef = Object.assign(ref,{that:this});
                    }}
                    isDragSort
                    group={this.group}
                    // @ts-ignore
                    colCount={formPropertyApp.formPropertyViewModel.layout}
                    size={formPropertyApp.formPropertyViewModel.size} 
                    controls={this.computedFormElementConfig}
                ></HLFormContainer>:<Row className={classNames({
                        [styles['FormPageUnSelected']]: true,
                    })}><h3>请拖入表单元素组件</h3></Row>}
                </HlDragger>
                <HLModalContext content={(<FormProerty></FormProerty>)}>
                    <HLModal
                        closable={false}
                        maskClosable={false}
                        footer={(<React.Fragment>
                            <Button onClick={() => {
                                OpenConfirm({
                                    title: '关闭',
                                    content: '部分数据未保存,如果离开数据将无法保存,您确定离开吗？',
                                    onOk: () => {
                                        formPropertyApp.formPropertyModalRef.viewModel.visible = false;
                                    }
                                })
                            }}>取消</Button>
                            <Button type="primary" onClick={() => {
                                formPropertyApp.formProperyElementRef.viewModel.form.validateFields((error,values) => {
                                    if (!error) {
                                        // @ts-ignore
                                        formPropertyApp.asyncElementData({ nameSubmit: { value: values['name'] } })
                                        const arr: string[] = FORMSUBMITPROPERTY[formPropertyApp.formPropertyViewModel.editComponentData.type]
                                        arr.map((item) => {
                                            if (values.hasOwnProperty(item)) {
                                                let oldPropertyType = 'normal';
                                                const oldItem = formPropertyApp.formPropertyViewModel.getPropertyValue(item)
                                                if (oldItem) {
                                                    oldPropertyType = oldItem.type;
                                                }
                                                formPropertyApp.formPropertyViewModel.updatePropertyValue({
                                                    value: values[item],
                                                    property: item,
                                                    //@ts-ignore
                                                    propertyType:oldPropertyType,
                                                })
                                            }
                                        })
                                        message.success('设置成功');
                                        formPropertyApp.formPropertyModalRef.viewModel.visible = false;
                                    }
                                })
                            }}>保存</Button>
                        </React.Fragment>)}
                        modalType="Drawer"
                        placement="right"
                        onReady={(value) => {
                            formPropertyApp.formPropertyModalRef = value;
                            const width = 400;
                            formPropertyApp.formPropertyModalRef.viewModel.width = width;
                        }}>
                    </HLModal>
                </HLModalContext>
                <HLModalContext content={<CodeEditor
                        width="100%"
                        height="300px"
                        mode="typescript"
                        value={code}
                        tabSize={4}
                        onChange={(values: string,evet) => {
                            formPropertyApp.formPropertyViewModel.codeValue = values;
                            console.log(formPropertyApp.formPropertyViewModel.codeValue)
                        }}
                    ></CodeEditor>}>
                <HLModal 
                    closable={false}
                    footer={(<React.Fragment>
                        <Button onClick={() => {
                            OpenConfirm({
                                title: '关闭',
                                content: '您还未保存输入信息,确定需要离开？',
                                onOk: () => {
                                    formPropertyApp.formPropertyCodeEditModalRef.viewModel.visible = false;
                                }
                            })
                        }}>取消</Button>
                        <Button type="primary" onClick={() => {
                            try {
                                runInAction(() => { 
                                    formPropertyApp.formPropertyViewModel.execcodeast = null;
                                    const backfillField = ['uploadParams','uploadDataTransform','disabledDate'];// 回填到表单组件属性项
                                    let formFields = null;
                                    backfillField.map((item) => {
                                        if (formFields === null) {
                                            formFields = {};
                                        }
                                        if (formPropertyApp.formPropertyViewModel.editComponentData.property === item) {
                                            formFields[item] = {
                                                value:formPropertyApp.formPropertyViewModel.codeValue
                                            }
                                        }
                                    })
                                    if (formFields) {
                                        formPropertyApp.formProperyElementRef.store.updateFormInputData(formPropertyApp.formProperyElementRef.uid,formFields,formPropertyApp.formProperyElementRef.that)
                                    }
                                    const mapjson = {
                                        validationRuleReg:transformValidationRule
                                    }
                                    const keyvalue = mapjson[formPropertyApp.formPropertyViewModel.editComponentData.property]
                                    if (keyvalue) {
                                        eval(getExecutableScript(keyvalue(formPropertyApp.formPropertyViewModel.codeValue,valueEnum[value.key]),this));
                                     }
                                    formPropertyApp.formPropertyViewModel.updatePropertyValueTemp({
                                        value: formPropertyApp.formPropertyViewModel.codeValue,
                                        property: property,
                                        propertyType: valueEnum[value?.key]||propertyType,
                                    });
                                    formPropertyApp.formPropertyViewModel.updatePropertyValue({ 
                                        value: formPropertyApp.formPropertyViewModel.codeValue,
                                        property: property,
                                        propertyType: valueEnum[value?.key]||propertyType,
                                        execast:formPropertyApp.formPropertyViewModel.execcodeast,
                                    })
                                    message.success('保存成功');
                                    formPropertyApp.formPropertyViewModel.editComponentData.property = null;
                                    formPropertyApp.formPropertyViewModel.editComponentData.propertyType = null;
                                    formPropertyApp.formPropertyCodeEditModalRef.viewModel.visible = false;
                                })
                            } catch (error) {
                                console.log(error)
                                message.warning('error.message',4)
                            }
                            
                        }}>保存</Button>
                    </React.Fragment>)}
                    maskClosable={false}
                    onReady={(value) => {
                        formPropertyApp.formPropertyCodeEditModalRef = value;
                        const width = 600;
                        formPropertyApp.formPropertyCodeEditModalRef.viewModel.width = width;
                    }}
                >
                
                </HLModal>
                </HLModalContext>
                
            </React.Fragment>
        )
    }
}