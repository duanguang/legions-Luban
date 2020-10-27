/*
 * @Author: duanguang
 * @Date: 2020-05-26 14:00:08
 * @Last Modified by: duanguang
 * @Last Modified time: 2020-09-25 17:44:41
 */
import StoreBase, { IStoreBaseMeta } from '../../common/stores/StoreBase';
import { observable, autorun, action, computed } from 'mobx';
import {
  observablePromise,
  ObservableTempState,
  observableViewModel,
} from 'legions/store-utils';
/* import UserInfoStore, { User } from './UserInfoStore'; */
import { ProjectFormFields } from '../models/form/projectFormFields';
/* import ViewCanvasUIStore from './viewCanvaUIStore';
import PropertyUIStore from './propertyUIStore'; */
import {
  InstanceForm,
  InstanceModal,
} from 'hoolinks-legion-design/lib/typings/components';
import ProjectListPagePropertyStore from './projectListPageProperty';
import {
  OperationEnum,
  createProjectEnum,
  templatePageEnum,
} from '../constants/enum-data';
import ProjectFormPropertyStore from './projectFormProperty';
interface IContext {
  formPropertyApp: ProjectFormPropertyStore;
  /**
   *
   * 列表页数据属性
   * @type {ProjectListPagePropertyStore}
   * @memberof IContext
   */
  listPagePropertyApp: ProjectListPagePropertyStore;
}
type ILoading = 'none' | 'pending' | 'complete' | 'error';
export type TStepCurr = 0 | 2 | 1;
class ViewModel {
  @computed get computedLoading(): boolean {
    if (this.loading === 'pending') {
      return true;
    }
    return false;
  }
  @computed get computedLoad(): ILoading {
    return this.loading;
  }

  /**
   * 项目当前编辑步骤 (包含项目信息填写->页面制作->生成页面)
   *
   * @type {(0 | 2 | 1)}
   * @memberof ViewModel
   */
  @observable stepCurr: TStepCurr = 1;
  /**
   *
   * 选中的仓库信息KEY
   * @memberof ViewModel
   */
  @observable selectedWarehouseKey = '';

  /**
   *
   * 页面操作类型 预览和保存
   * @type {(typeof OperationEnum)[keyof typeof OperationEnum]}
   * @memberof ViewModel
   */
  @observable operation: typeof OperationEnum[keyof typeof OperationEnum] = 1;

  @observable token = '';

  @observable colSpan = { left: 6, right: 18 };

  @observable private loading: ILoading = 'none';

  /** 创建项目操作类型 */
  @observable createProjectType: keyof typeof createProjectEnum = null;

  /** 当前模块类型，例如列表页或者表单页 */
  @observable currentTemplatePage: keyof typeof templatePageEnum = 'listPage';

  /** 创建的组件文件信息，主要用于重复生成同样代码文件 */
  @observable historyComponentsFileList: string[] = [];

  @action updateLoadingState(state: ILoading) {
    this.loading = state;
  }
  /** 设置项目数据类型 */
  @action setCreateProjectType(type: keyof typeof createProjectEnum) {
    this.createProjectType = type;
  }
  /** 设置当前需要生成的模块类型  */
  @action setCurrentTemplatePage(type: keyof typeof templatePageEnum) {
    this.currentTemplatePage = type;
  }
}
class BasicModalViewModel {
  modalRef: InstanceModal = null;
}
/**
 *
 * 可视化数据 包含初始化项目数据
 * @export
 * @class ProjectStore
 * @extends {StoreBase<IContext>}
 */
export default class ProjectStore extends StoreBase<IContext> {
  static meta: IStoreBaseMeta = {
    ...StoreBase.meta,
    className: 'ProjectStore',
    eventScopes: [],
    contextTypes: {
      listPagePropertyApp: ProjectListPagePropertyStore,
      formPropertyApp: ProjectFormPropertyStore,
    },
  };

  @observable formFields = new ProjectFormFields();

  /**
   * 表格列配置属性添加表单实例
   *
   * @type {InstanceForm}
   * @memberof ProjectStore
   */
  formProperyAddTableColumnsRef: InstanceForm = null;

  /**
   * 表格数据源配置属性表单实例
   *
   * @type {InstanceForm}
   * @memberof ProjectStore
   */
  formProperyDataSourceRef: InstanceForm = null;

  /**
   *
   *  表格基础配置属性表单实例
   * @type {InstanceForm}
   * @memberof ProjectStore
   */
  formProperyBaseConfigRef: InstanceForm = null;

  formProperyOperattionRef: InstanceForm = null;
  formProperKeyValueRef: InstanceForm = null;

  /**
   * 项目编辑快速生成组件内部状态
   *
   * @memberof ProjectStore
   */
  projectEditViewModel = observableViewModel<ViewModel>(new ViewModel());

  /** 创建项目信息表单实例对象 */
  createProjectFormRef: InstanceForm = null;

  /** 模态框数据模型 */
  basicModalViewModel = observableViewModel<BasicModalViewModel>(
    new BasicModalViewModel()
  );
  /**
   * 当表单数据变化时，同步更新store 表单数据
   *
   * @param {*} formFields
   * @memberof GroundManageInfoStore
   */
  @action setFormFields(formFields: ProjectFormFields) {
    this.formFields = new ProjectFormFields({
      ...this.formFields,
      ...formFields,
    });
  }
}
