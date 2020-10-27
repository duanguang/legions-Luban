// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportJenkins from '../../../app/controller/jenkins';
import ExportMonitor from '../../../app/controller/monitor';
import ExportSandbox from '../../../app/controller/sandbox';
import ExportTable from '../../../app/controller/table';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    jenkins: ExportJenkins;
    monitor: ExportMonitor;
    sandbox: ExportSandbox;
    table: ExportTable;
    user: ExportUser;
  }
}
