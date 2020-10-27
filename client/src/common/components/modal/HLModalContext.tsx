import React,{ Component } from 'react'
import { PropTypes,Provider,MobXProviderContext } from "mobx-react"
interface IProps{
    content: React.ReactNode;
    modal?: React.ReactNode;
    // @ts-ignore
    children?:any;
}
export class HLModalContext extends React.Component<IProps> {
    renderMobXProviderContext() {
        return <MobXProviderContext.Consumer>
            {
                (context) => {
                    // @ts-ignore
                return React.cloneElement(this.props.modal||this.props.children,null,<Provider storeManage={context.storeManage}> {this.props.content}</Provider>)
                }
        
            }
        </MobXProviderContext.Consumer>
    }
    renderContextType() {
        return React.cloneElement(this.props.modal||this.props.children,null,<Provider storeManage={this.context.storeManage}> {this.props.content}</Provider>)
    }
    render() {
      return (
        this.renderContextType()
      );
    }
}
HLModalContext.contextType= MobXProviderContext