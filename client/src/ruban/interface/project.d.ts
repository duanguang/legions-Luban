import { templatePageEnum } from "../constants/enum-data";

export declare namespace ProjectModules {
	interface ISendData {
		/**
		 *
		 * 系统模块
		 * @type {String}
		 * @memberof ISendData
		 */
		modulesSystem: string
		gitSrc: string
		projectSrc: string
		branch: string
		gitUserName:string
		templateType: keyof typeof templatePageEnum
		componentName: string
	}
}