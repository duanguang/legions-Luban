/*
 * @Author: linzeqin
 * @Date: 2019-10-15 11:33:04
 * @description: Layout
 */
import React from 'react';

import { HttpConfig } from '../../constants/httpConfig';
import { bind } from 'brain-store-react';
import { observer } from 'mobx-react';
import { message } from 'antd';
import { ContainLayout} from 'hoolinks-legion-design'
/** 左上方logo */
import UserInfoStore from '../../stores/UserInfoStore';
import { ISchedule} from 'hoolinks-legion-design/lib/typings/antd'
const logo = require('../../assets/image/companyLogo.png')
/** 测试数据 */
const testData = require('./test.json')
const RouterConfig = [
    {
        path: '/home/workbench',component: () => {
        return <div>2222</div>
    },key: 'workbench' },
   /*  { path: '/home/project/edit',component: ProjectEdit,key: 'ProjectEdit' }, */
]
interface IProps {
    store: UserInfoStore,
}
function clearAllCookie(){
    let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if(keys) {
        // tslint:disable-next-line: no-var-keyword
        // tslint:disable-next-line: curly
        for(let i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}
@bind({store: UserInfoStore})
@observer
export default class HomeManage extends React.Component<IProps> {
    subscription: ISchedule;

    componentWillMount() {
    /*  this.subscription = this.props.store.schedule([this.watch.bind(this)]) */
        this.props.store.test.set('s1',{ a: 1 })
        this.props.store.test.set('s2',{a:1})
        const keys = this.props.store.test.keys()
        for (let key of keys) {
            console.log(key,'22')
        }
     
    }
    componentWillUnmount() {
       /*  this.subscription&&this.subscription.unsubscribe(); */
        
    }
    componentDidMount() {
        /** 请求获取当前登录用户信息 */
        this.props.store.getUserInfo()
       
    }
    watch() {
        const { obUserInfoResponse, history } = this.props.store;
        if (obUserInfoResponse.state === 'rejected' && history.location.pathname !== '/login') {
            obUserInfoResponse.clear()
            history.replace('/login')
        }
    }
    /** 退出登录 */
    handleLoginOut = () => {
        /** 清空cookie信息 */
        clearAllCookie()
        /** 回到登录页面 */
        this.props.store.history.replace('/login')
    }
    render() {
        const { obUserInfo } = this.props.store;
        return(
            <div>
               {/*  <ContainLayout
                    router={RouterConfig}
                    isEnabledTabs={false}
                    userName={obUserInfo.name}
                    companyName=""
                    logo={logo}
                    onGetMenuEntity={() => new Promise<{}>((resolve) => {
                        resolve(testData)
                    })}
                    onLoginOut={this.handleLoginOut}
                    notFoundUrl=""
                    userEntity={{
                        userUid: obUserInfo.uuid,
                        userName: obUserInfo.name,
                        rowData: obUserInfo,
                    }}
                    domainUrl={''}
                ></ContainLayout> */}
            </div>
        )
    }
}
