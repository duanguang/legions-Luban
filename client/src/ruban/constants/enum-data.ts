// tslint:disable-next-line: no-any
const lit = <V extends keyof any>(v: V) => v;
export const OperationEnum = {
    save: lit(1),
    preview: lit(2),
    EditColumns: lit(3),
    EditTableCode: lit(4),
    editOperationOnlickCode: lit(5),
    addOperationParams: lit(6),
}

export enum templatePageEnum{
    listPage = 'lisPage',
    formPage='formPage'
}
/** 项目信息枚举，包含初始化，生成页面时更新信息 */
export enum createProjectEnum{
    init = 'init',
    update='update',
}