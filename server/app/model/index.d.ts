import { Mongoose, DocumentQuery, Document, Schema, Model, model } from 'mongoose';
import tableListCustom, {
    ITableListCustom,
    IApplicationTableListCustomModel,
} from './tableListCustom';
import { IApplicationUserModel } from './user';
import { IApplicationMonitorErrorModel } from './monitorError';
import { IApplicationMonitorLogModel } from './monitorLog';
import { ISandboxReportModel } from './sandboxReport';
import { ISandboxDispatchReportModel } from './sandboxDispatchReport';
import { IJenkinsTaskReportModel } from './jenkinsTaskModel';
import { IApplicationOperationLogModel } from './operationLog';
import { IJenkinsPlanReportModel } from './jenkinsPlanModel';
export { Model, Document, Schema };
declare module 'egg' {
  interface Application {
    mongoose: Mongoose;
  }

  interface Context {
    model: {
      TableListCustom: Model<IApplicationTableListCustomModel>;
      User: Model<IApplicationUserModel>,
      MonitorError: Model<IApplicationMonitorErrorModel>
      MonitorLog: Model<IApplicationMonitorLogModel>
      /** 沙箱项目集合 */
      SandboxReport: Model<ISandboxReportModel>,
      /** 沙箱调度集合 */
      SandboxDispatchReport: Model<ISandboxDispatchReportModel>,
      /** jenkins任务集合 */
      JenkinsTaskModel: Model<IJenkinsTaskReportModel>,
      /** jenkins计划集合 */
      JenkinsPlanModel: Model<IJenkinsPlanReportModel>,
      OperationLog: Model<IApplicationOperationLogModel>,
    };
  }
}
