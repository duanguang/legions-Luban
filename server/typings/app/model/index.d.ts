// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportDirectiveModel from '../../../app/model/directiveModel';
import ExportJenkinsPlanModel from '../../../app/model/jenkinsPlanModel';
import ExportJenkinsTaskModel from '../../../app/model/jenkinsTaskModel';
import ExportMonitorError from '../../../app/model/monitorError';
import ExportMonitorLog from '../../../app/model/monitorLog';
import ExportOperationLog from '../../../app/model/operationLog';
import ExportResponseListModel from '../../../app/model/responseListModel';
import ExportResponseModel from '../../../app/model/responseModel';
import ExportSandboxDispatchReport from '../../../app/model/sandboxDispatchReport';
import ExportSandboxReport from '../../../app/model/sandboxReport';
import ExportTableListCustom from '../../../app/model/tableListCustom';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    DirectiveModel: ReturnType<typeof ExportDirectiveModel>;
    JenkinsPlanModel: ReturnType<typeof ExportJenkinsPlanModel>;
    JenkinsTaskModel: ReturnType<typeof ExportJenkinsTaskModel>;
    MonitorError: ReturnType<typeof ExportMonitorError>;
    MonitorLog: ReturnType<typeof ExportMonitorLog>;
    OperationLog: ReturnType<typeof ExportOperationLog>;
    ResponseListModel: ReturnType<typeof ExportResponseListModel>;
    ResponseModel: ReturnType<typeof ExportResponseModel>;
    SandboxDispatchReport: ReturnType<typeof ExportSandboxDispatchReport>;
    SandboxReport: ReturnType<typeof ExportSandboxReport>;
    TableListCustom: ReturnType<typeof ExportTableListCustom>;
    User: ReturnType<typeof ExportUser>;
  }
}
