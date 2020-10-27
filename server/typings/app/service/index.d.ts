// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTest from '../../../app/service/Test';
import ExportDirective from '../../../app/service/directive';
import ExportJenkinsService from '../../../app/service/jenkinsService';
import ExportMonitorError from '../../../app/service/monitorError';
import ExportSandboxService from '../../../app/service/sandboxService';
import ExportTableListCustom from '../../../app/service/tableListCustom';
import ExportUser from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    test: ExportTest;
    directive: ExportDirective;
    jenkinsService: ExportJenkinsService;
    monitorError: ExportMonitorError;
    sandboxService: ExportSandboxService;
    tableListCustom: ExportTableListCustom;
    user: ExportUser;
  }
}
