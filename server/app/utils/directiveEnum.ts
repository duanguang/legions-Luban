export enum DirectiveEnum {

    /**
     * 初始化项目命令
     */
    initProject = 'initProject',

    /**
     * 生成代码指令
     */
    generatedCode = 'generatedCode',
}

/**
 * 任务状态枚举
 *
 * @export
 * @enum {number}
 */
export enum StateEnum {

    /**
     * 数据或者任务处理完成
     */
    complete = 'complete',

    /**
     * 数据或任务处理中
     */
    pending = 'pending',

    /**
     * 错误
     */
    error = 'error',
}
