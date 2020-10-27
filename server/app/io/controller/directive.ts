import { Controller } from 'egg';
import * as fs from 'fs';
import * as path from 'path';
import { DirectiveEnum } from '../../utils/directiveEnum';
import { DirectiveModules } from '../../interface/directive';
interface IResponse {
  data: Buffer;
  res: {
    status: number;
  };
}
export default class DirectiveController extends Controller {
  public async index() {
    const { ctx } = this;
    console.log(this.ctx.args);
    if (this.ctx.args && Array.isArray(this.ctx.args) && this.ctx.args[0]) {
      const commandShell = this.ctx.args[0] as DirectiveModules.IDirective;
      if (commandShell[DirectiveEnum.initProject] && commandShell.initProject) {
        this.ctx.service.directive.initProject(
          commandShell.initProject.sendData
        );
      } else if (
        commandShell[DirectiveEnum.generatedCode] &&
        commandShell.generatedCode
      ) {
        this.ctx.service.directive.generatedCode(
          commandShell.generatedCode.sendData
        );
      }
      /* await this.ctx.socket.emit('message', commandShell); */
    }
  }
}
