import { DirectiveModules } from '../interface';
export class InitProjectResponseModel<T = string> {
    sendData: DirectiveModules.ISendData;
    responseData: T;
    state: 'complete' | 'pending' | 'none'|'error' = 'none';
    constructor(sendData: DirectiveModules.ISendData, responseData: T, state: 'complete' | 'pending' | 'none'|'error') {
        this.sendData = sendData;
        this.responseData = responseData;
        this.state = state;
    }
}
