import React,{ Component } from 'react'
import { HLModalContext } from '../../../common/components/modal/HLModalContext';
import { HLModal } from 'hoolinks-legion-design';
import { bind,observer } from 'legions/store-react';
import ProjectStore from '../../stores/projectStore';
interface IProps {
    onOk?: (e: React.MouseEvent<any,MouseEvent>) => void
    // @ts-ignore
    children?: any;
    store?: ProjectStore
}
@bind({ store: ProjectStore })
@observer
export class BasicModal extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }
    render() {
        return (
            <HLModalContext content={(<React.Fragment>
                {this.props.children}
            </React.Fragment>)}>
                <HLModal
                    onOk={(e) => {
                        this.props.onOk && this.props.onOk(e)
                    }}
                    onReady={(value) => {
                        this.props.store.basicModalViewModel.modalRef = value;
                        const width = 550;
                        this.props.store.basicModalViewModel.modalRef.viewModel.width = width;
                    }}>

                </HLModal>
            </HLModalContext>
        );
    }
}