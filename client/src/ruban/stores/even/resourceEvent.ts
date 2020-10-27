import { resource } from 'legions/store';
import { IQuery } from 'hoolinks-legion-design/lib/typings/components';
export interface IResourceEvent<T>{
    
  /**
   * 事件名称
   *
   * @type {string}
   * @memberof IResourceEvent
   */
  name:string;

  /**
   * 事件作用域
   *
   * @type {string}
   * @memberof IResourceEvent
   */
  scope:string;


  /**
   * 派发数据对象
   * 
   * @type {T}
   * @memberof IResourceEvent
   */
  payload:T
}
export interface ITriggerEventPrams {
  currComponentView?: IQuery;

  /**
   * 组件原始kye值
   *
   * @type {string}
   * @memberof ITriggerEventPrams
   */
  componenyKeys?: string;
}
/**  可视化组件属性数据变更事件触发器 */
export const ComponentViewResource = resource('project/resource/componentView');