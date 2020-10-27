export default class ResponseModel<T> {
    message: string = '';
    success: boolean = false;
    data: T|null;
    code?: string = '';

    constructor(params?: Partial<ResponseModel<T>>) {
        if (params) {
            const data: ResponseModel<T> = { ...new ResponseModel(), ...params };
            this.data = data.data;
            this.code = data.code;
            this.success = data.success;
            this.message = data.message;
        }
    }
}

/** 分页数据模型 */
export class PageModel<T> {
    /** 当前页 */
    pageIndex: number = 0;
    /** 每页数量 */
    pageSize: number = 0;
    /** 分页数据 */
    list: T[] = [];
    /** 总条数 */
    total: number = 0;

    constructor(params?: Partial<PageModel<T>>) {
        if (params) {
            const data: PageModel<T> = { ...new PageModel(), ...params };
            this.pageIndex = data.pageIndex;
            this.pageSize = data.pageSize;
            this.list = data.list;
            this.total = data.total;
        }
    }
}

/**
 * 分页response模型
 * @export
 * @class PageResponseModel
 * @extends {ResponseModel<PageMode<T>>}
 * @template T
 */
export class PageResponseModel<T> extends ResponseModel<PageModel<T>> {
    constructor(params?: Partial<PageResponseModel<T>>) {
        if (params) {
            super(params);
            this.data = {
                ...new PageModel(),
                ...params.data,
            };
        }
    }
}
