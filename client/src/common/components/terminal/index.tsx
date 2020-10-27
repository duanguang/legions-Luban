import { Card, Icon } from 'antd';
import React, { Component } from 'react'
import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { FitAddon } from 'xterm-addon-fit';
import "xterm/css/xterm.css";
const defaultTheme = {
    foreground: '#2c3e50',
    background: '#e4f5ef',
    cursor: 'rgba(0, 0, 0, .4)',
    selection: 'rgba(0, 0, 0, 0.3)',
    black: '#000000',
    red: '#e83030',
    brightRed: '#e83030',
    green: '#42b983',
    brightGreen: '#42b983',
    brightYellow: '#ea6e00',
    yellow: '#ea6e00',
    magenta: '#e83030',
    brightMagenta: '#e83030',
    cyan: '#03c2e6',
    brightBlue: '#03c2e6',
    brightCyan: '#03c2e6',
    blue: '#03c2e6',
    white: '#d0d0d0',
    brightBlack: '#808080',
    brightWhite: '#ffffff'
}
const darkTheme = {
    ...defaultTheme,
    foreground: '#00F1B6',
    background: '#2c3e50',
    cursor: 'rgba(255, 255, 255, .4)',
    selection: 'rgba(255, 255, 255, 0.3)',
    magenta: '#e83030',
    brightMagenta: '#e83030'
}
interface IProps<receive = {}>{

    /**
     *
     * socket 接收函数
     * @memberof IProps
     */
    onSocketReceive: (data:(prams:receive)=>void) => void;
    onReceive: (result: receive) => void;

    /**
     * 输出信息到终端前，复杂对象转成输出所需要的字符串
     *
     * @memberof IProps
     */
    onTransfrom?: (data: receive) => string;
    style?: React.CSSProperties;
}
export default class TerminalView<receive = {}> extends React.PureComponent<IProps<receive>> {
    terminal = new Terminal({
        /* cols: 90,
        rows: 18, */
        theme: darkTheme,
        ...{
            scrollback: 5000,
            disableStdin: true,
            useFlowControl: true
        },
    });
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.props.onSocketReceive && this.props.onSocketReceive((message) => {
            const msg = JSON.stringify(message);
            const result = JSON.parse(msg);
            let responseData = result.responseData;
            if (this.props.onTransfrom) {
                responseData = this.props.onTransfrom(result)
            }
            if (responseData) {
                this.setContent(responseData);
            }
            if(result){
                this.props.onReceive&&this.props.onReceive(message)
            }
        })
    }
    componentDidMount() {
        const fitAddon = new FitAddon();
        this.terminal.loadAddon(new WebLinksAddon());
        this.terminal.loadAddon(fitAddon);
        // @ts-ignore
        this.terminal.open(this.refs['terminal']);
        fitAddon.fit()
    }
    setContent(value) {
        if (typeof value !== 'string') {
            console.warn('Output to the terminal information not characters')
        }
        else {
            if (value.indexOf('\n') !== -1) {
                value.split('\n').forEach(
                    t => this.setContent(t)
                )
                return
            }
            if (typeof value === 'string') {
                this.terminal.writeln(value)                                              
            } else {
                this.terminal.writeln('')
            }
        }
    }
    handleClick() {
        this.terminal.clear();
    }
    render() {
        return (
            <Card  style={this.props.style} title={<div><Icon type="code" />终端</div>}
                extra={<Icon type="close-square"
                style={{ cursor: 'pointer' }}
                onClick={this.handleClick} />}
                bodyStyle={{ padding: 6 }}>
                <div id="terminal" ref="terminal"></div>
            </Card>
        )
    }
}
