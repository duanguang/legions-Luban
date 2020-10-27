import { Tooltip,Icon } from 'antd';
import React from 'react';
interface IProps {
    label: string;
    title: string|React.ReactNode;
}
export const QuestionTooltip = (props: IProps) => <Tooltip title={props.title} placement="bottom">
    <span>
        {props.label}
        <Icon style={{color:'red'}} type="question-circle" />
    </span>
</Tooltip>