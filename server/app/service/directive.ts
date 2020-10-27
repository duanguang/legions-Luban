import { Service } from 'egg';
import { formatDate } from '../utils/format-date';
import * as  shell from 'shelljs';
import { DirectiveModules } from '../interface/index.d';
import { InitProjectResponseModel } from '../model/directiveModel';
import { StateEnum } from '../utils/directiveEnum';
import * as path from 'path';
import * as recast from 'recast';
// tslint:disable-next-line: no-var-requires
const terminate = require('terminate');
import * as fs from 'fs';
/* const fs = require('fs'); */
import { prettyPrint, transformProperty } from '../utils/ast';
import { compose } from '../utils/fun';
export default class DirectiveService extends Service {
    public async initProject(sendData: DirectiveModules.ISendData) {
        shell.cd(`${process.cwd()}/app/shelljs`);
        let state = StateEnum.pending;
        const child = shell.exec(`bash ./git-init-project.sh ${sendData.projectSrc} ${sendData.gitSrc} ${sendData.branch}`, { async: true });
        child.stdout.on('data', async (data: string) => {
            let message = data.replace('state:pending', '').replace('state:complete', '').replace('state:error', '');
            if (data.indexOf(StateEnum.complete) > -1) {
                state = StateEnum.complete;
            }
            if (data.indexOf(StateEnum.pending) > -1) {
                state = StateEnum.pending;
            }
            if (data.indexOf(StateEnum.error) > -1) {
                state = StateEnum.error;
            }
            const result = new InitProjectResponseModel(sendData, message, state);
            await await this.ctx.socket.emit('message', result);
        });
        child.stderr.on('data',buffer => {
            const result = new InitProjectResponseModel(sendData, buffer.toString(), state);
            this.ctx.socket.emit('message', result);
        });
        child.on('error', error => {
            console.log(`error:${error}`);
        });
    }
    /**
     * 生成列表页代码文件
     *
     * @param {DirectiveModules.ISendAst} sendData
     * @memberof DirectiveService
     */
    public async generatedCode(sendData: DirectiveModules.ISendAst) {
        const file = path.join(process.cwd(),'/app/test/test.js');
        let state = StateEnum.pending;
        const pagePath = `${sendData.projectSrc}/src/${sendData.modulesSystem}/containers/${sendData.componentName}`;
        const pathSrc = `${sendData.projectSrc}/src/${sendData.modulesSystem}`;
        const createMessageInfo = (message: string,states?:InitProjectResponseModel['state']) => {
            const result = new InitProjectResponseModel(sendData, message, states||state);
            return result;
        };
        // tslint:disable-next-line: ban-types
        const sendToClinet = (result: Object) => {
            this.ctx.socket.emit('message',result);
        };
        this.ctx.socket.emit('message', new InitProjectResponseModel(sendData, '开始执行...\n', state));
        /* const code = [ sendData.ast.queryAst ].join('\n');
        const ast = recast.parse(ComponentCommonHeaders,{
            parser: require('recast/parsers/typescript')
          }); */
        /* const output = recast.print(ast).code; */
        /* const output = recast.prettyPrint(ast,
            {
                tabWidth: 2,
                quote: 'single',
                trailingComma: true,
            }).code; */
        if (fs.existsSync(pagePath)) {
            sendToClinet(createMessageInfo('文件已经存在，请重新设置页面名称'));
        } else {
            if (sendData.tablePageListCode) {
                sendToClinet(createMessageInfo('正在生成列表页组件代码...\n'));
                fs.mkdirSync(pagePath);
                sendToClinet(createMessageInfo(`正在创建列表页面文件夹:${pagePath}...\n`));
                fs.writeFileSync(`${pagePath}/${sendData.componentName}Config.tsx`,sendData.tablePageListCode.tableConfigCode);
                sendToClinet(createMessageInfo(`正在生成Table列数据和搜索条件数据代码: ${pagePath}/${sendData.componentName}Config.tsx...\n`));

                const ModelFilePath = `${pathSrc}/models/${sendData.componentName}Entity.ts`;
                sendToClinet(createMessageInfo(`正在生成列表页数据Model:${ModelFilePath}\n`));
                fs.writeFileSync(ModelFilePath,sendData.tablePageListCode.tableModelCode);

                fs.writeFileSync(`${pagePath}/index.tsx`,sendData.tablePageListCode.tableHomePageCode);
                sendToClinet(createMessageInfo(`正在生成列表页:${pagePath}/index.tsx...\n`));
                fs.writeFileSync(`${pathSrc}/stores/${sendData.componentName}Store.ts`,sendData.tablePageListCode.storeCode);
            }
            if (sendData.formPageCode) {
                sendToClinet(createMessageInfo('正在生成表单页组件代码...\n'));
                fs.mkdirSync(pagePath);
                sendToClinet(createMessageInfo(`正在创建表单页面文件夹:${pagePath}...\n`));
                sendToClinet(createMessageInfo(`正在生成表单组件:${pagePath}/index.tsx...\n`));
                fs.writeFileSync(`${pagePath}/index.tsx`,sendData.formPageCode.formComponentCode);
                sendToClinet(createMessageInfo(`正在生成表单组件Model:${pagePath}/${sendData.componentName}FormFields.tsx\n`));
                fs.writeFileSync(`${pagePath}/${sendData.componentName}FormFields.tsx`,sendData.formPageCode.modelCode);
            }
        }
        /* const files = path.join(`${pagePath}/index.tsx`);
        const code = [fs.readFileSync(files).toString()].join('\n'); */
        setTimeout(async () => {
            await shell.cd(`${process.cwd()}/app/shelljs`);
            const email = `${sendData.gitUserName}@hoolinks.com`;
            const child = shell.exec(`bash ./git-push-project.sh ${sendData.projectSrc}  ${sendData.branch} ${email} ${sendData.gitUserName}`, { async: true });
            await child.stderr.on('data', async (buffer) => {
            await sendToClinet(createMessageInfo(buffer.toString(),StateEnum.complete));
            });
        },500)
        
        sendToClinet(createMessageInfo('执行完毕...',StateEnum.complete));
    }
}
