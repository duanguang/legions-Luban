import React, { Component } from 'react'
import { shortHash } from 'hoolinks-legion-design/lib/utils/utils';
import { IQuery } from 'hoolinks-legion-design/lib/typings/components';
const ALL_SUITS = ['text', 'select', 'textArea', 'date'] as const; // TS 3.4
interface IComponentType {
    [index:string]:{ title: string; type: string}
}  
export class  QueryTemplate<P = {},S={}> extends Component<P> {
    componentType: IComponentType = {
        'text': {
            title: '设置文本框属性',
            type: 'text',
        },
        'select': {
            title: '设置下拉属性',
            type: 'select',
        },
        'textArea': {
            title: '设置多行文本框属性',
            type: 'textArea',
        },
        'date': {
            title: '设置日期属性',
            type: 'date',
        },
        'daterange': {
            title: '设置日期区间属性',
            type: 'daterange',
        },
        'checkBox': {
            title: '设置复选框属性',
            type: 'checkBox',
        },
        'radioButton': {
            title: '设置单选组合属性',
            type: 'radioButton',
        },
    }
    constructor(props: P) {
        super(props)
    }
    /**
     *
     * 搜索条件组件配置----生成文本框组件
     * @param {string} key
     * @returns {IQuery}
     * @memberof QueryTemplate
     */
    createText(key:string):IQuery {
        const maxIndex =key|| shortHash(new Date().getTime());
        const query: IQuery = {
            container: {
                width: 200,
                position: 'content',
                component: {
                    label: '文本框:',
                    props: {
                        width: 140,
                        placeholder: '请输入',
                        maxLength: '50',
                    },
                    type: 'text',
                    JsonProperty: {
                        name: ``,
                        uuid: `text${maxIndex}`,
                        value: '',
                        queryPrams: ``,
                    },
                    defaultValue: '',
                    hooks: [
                    ],
                },
            },
        };
        return query;
    }

    /**
     *
     * 搜索条件组件配置----生成多行文本框组件
     * @param {string} key
     * @returns {IQuery}
     * @memberof QueryTemplate
     */
    createTextArea(key:string): IQuery{
        return {
            container: {
                width: 220,
                position: 'content',
                component: {
                    label: '多行文本:',
                    props: {
                        width: 140,
                        placeholder: '请输入',
                        maxLength: '50',
                    },
                    type: 'textArea',
                    JsonProperty: {
                        name: ``,
                        value: '',
                        uuid: `textArea${key}`,
                        queryPrams: ``,
                    },
                    defaultValue: '',
                    hooks: [
                    ],
                },
            },
        };
    }

    /**
     *
     * 搜索条件组件配置----生成下拉框组件
     * @param {string} key
     * @returns {IQuery}
     * @memberof QueryTemplate
     */
    createSelect(key: string): IQuery{
        return {
            container: {
                width: 220,
                position: 'content',
                component: {
                    label: '下拉选择:',
                    props: {
                        width: 140,
                        placeholder: '请选择',
                        maxLength: '50',
                    },
                    type: 'select',
                    JsonProperty: {
                        name: ``,
                        value: '',
                        uuid: `select${key}`,
                        queryPrams: ``,
                    },
                    data: [{ key: '1',value: '昊链科技' }],
                    defaultValue: '',
                    hooks: [
                    ],
                },
            },
        };
    }


    /**
     *
     * 搜索条件组件配置----生成日期组件
     * @param {string} key
     * @returns {IQuery}
     * @memberof QueryTemplate
     */
    createDate(key: string): IQuery{
        return {
            container: {
                width: 220,
                position: 'content',
                component: {
                    label: '日期选择:',
                    props: {
                        width: 140,
                        placeholder: '请选择',
                        maxLength: '50',
                    },
                    type: 'date',
                    JsonProperty: {
                        name: ``,
                        value: '',
                        uuid: `date${key}`,
                        queryPrams: ``,
                    },
                    defaultValue: '',
                    hooks: [
                    ],
                },
            },
        }
    }


    /**
     *
     * 搜索条件组件配置----生成日期范围组件
     * @param {string} key
     * @returns {IQuery}
     * @memberof QueryTemplate
     */
    createDaterange(key: string): IQuery{
        return  {
            container: {
                width: 220,
                position: 'content',
                component: {
                    label: '日期选择:',
                    props: {
                        width: 140,
                        placeholder: '请选择',
                        maxLength: '50',
                    },
                    type: 'daterange',
                    JsonProperty: {
                        name: ``,
                        value: '',
                        uuid: `daterange${key}`,
                        queryPrams: ``,
                    },
                    defaultValue: [],
                    hooks: [
                    ],
                },
            },
        }
    }
    /**
     *
     * 搜索条件组件配置----生成复选框组件
     * @param {string} key
     * @returns {IQuery}
     * @memberof QueryTemplate
     */
    createCheckBox(key: string): IQuery{
        return {
            container: {
                width: 90,
                position: 'content',
                component: {
                    props: {
                        width: 90,
                        placeholder: '是否删除',
                        maxLength: '50',
                    },
                    type: 'checkBox',
                    JsonProperty: {
                        name: ``,
                        value: '',
                        uuid: `checkBox${key}`,
                        queryPrams: ``,
                    },
                    defaultValue: true,
                    hooks: [
                    ],
                },
            },
        }
    }


    /**
     * 搜索条件组件配置----生成数字文本框组件
     *
     * @param {string} key
     * @returns {IQuery}
     * @memberof QueryTemplate
     */
    createNumberInput(key: string): IQuery{
        return {
            container: {
                width: 220,
                position: 'content',
                component: {
                    label: '数字文本:',
                    props: {
                        width: 140,
                        placeholder: '请输入数字',
                        maxLength: '50',
                    },
                    type: 'number',
                    JsonProperty: {
                        name: ``,
                        value: '',
                        uuid: `number${key}`,
                        queryPrams: ``,
                    },
                    defaultValue: '',
                    hooks: [
                    ],
                },
            },
        }
    }

    /**
     * 搜索条件组件配置----生成RadioButton组件
     *
     * @param {string} key
     * @returns {IQuery}
     * @memberof QueryTemplate
     */
    createRadioButton(key: string): IQuery{
        return {
            container: {
                width: 170,
                position: 'content',
                component: {
                    label: '单选组合:',
                    props: {
                        width: 140,
                        placeholder: '单选组合',
                        maxLength: '50',
                    },
                    type: 'radioButton',
                    JsonProperty: {
                        name: ``,
                        value: '',
                        uuid: `radioButton${key}`,
                        queryPrams: ``,
                    },
                    data: [{ label: 'Hangzhou',value: 'a' }],
                    defaultValue: '',
                    hooks: [
                    ],
                },
            },
        }
    }


    /**
     * 搜索条件组件配置----生成搜索按钮组件
     *
     * @returns {Array<IQuery>}
     * @memberof QueryTemplate
     */
    createSearchButton(): Array<IQuery>{
        return [
            {
                container: {
                    position: 'right',
                    component: {
                        props: {
                            width: 86,
                        },
                        hooks: [
                            {
                                name: 'onSearch',handle: (value) => {
                                    /* that.modalRef.viewModel.visible = true;
                                    that.modalRef.viewModel.title = '设置搜索' */
                                },
                            },
                            {
                                name: 'onReset',handle: (value) => {
                                   
                                },
                            },
                        ],
                    },
                },
            },
        ]
    }
}