/*
 * @Author: linzeqin
 * @Date: 2019-10-08 09:29:22
 * @description: 代码编辑器，基于react-ace
 */
import React from 'react';
import AceEditor, { IAceEditorProps } from 'react-ace';
import 'brace/mode/javascript';
import 'brace/mode/typescript';
import 'brace/theme/monokai';
import 'brace/snippets/mips_assembler';
import 'brace/ext/language_tools';

export interface ICodeEditorProps extends IAceEditorProps {
    /** 代码类型，考虑体积原因，暂时支持js和ts，其他类型自行引入 */
    mode?: 'javascript' | 'typescript' | string;
    /** 编辑器风格，固定为monokai */
    theme?: 'monokai';
}

export default class CodeEditor extends React.Component<ICodeEditorProps> {
    render() {
        return (
            <AceEditor
                mode="javascript"
                showPrintMargin={false}
                
                enableLiveAutocompletion={true}
                editorProps={{$blockScrolling: true}}
                {...this.props}
                theme="monokai"
            ></AceEditor>
        )
    }
}
