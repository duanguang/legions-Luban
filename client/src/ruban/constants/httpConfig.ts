import { HttpConfigTest } from './http.test.config';
import { HttpConfigDev } from './http.dev.config';
import { getCookie } from '../../common/utils/cookie';
function getConfig() {
    if (process.env.environment === 'test') {
        return HttpConfigTest; // 测试环境 执行指令yarn build:test
    }
    else {
        return HttpConfigDev;// 开发环境 执行指令yarn dev
    }
}

export const HttpConfig = getConfig();
export const setHeaders = (url: string, option?: Object, cookie?: string) => {
    let cookies = cookie ? cookie : 'uctoken=MzJhYWY1MzMtNjgxZC00MmJmLWE1NzgtMzA2Yzg1MTk3OTdl'
    if (process.env.environment !== 'dev') {
        /* cookie 存储UCTOKEN为大写  需置换为小写(3pl接口使用) */
        cookies = (getCookie() || '').replace('UCTOKEN=', 'uctoken=')
    }
    let options = {
        'api-target': url,
        'api-cookie': cookies,
    }
    return option ? { ...options, ...option } : options
}
