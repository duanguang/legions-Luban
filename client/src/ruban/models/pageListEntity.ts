
import {JsonProperty} from 'json-mapper-object';
import {BaseEntity} from './common/baseEntity';
// tslint:disable-next-line: jsdoc-format
/**  Name 请重新命名*/
export class ResponseVModelNameDataEntity{
    @JsonProperty('id')
    id = void 0

}

class ResponseEntity{

/* @JsonProperty({clazz:ResponseVModelNameDataEntity, name:'data'}) */
    @JsonProperty('data')
    data = []

    @JsonProperty('size')
    size = 0

    @JsonProperty('current')
    current = 0

    @JsonProperty('total')
    total = 0
}

interface IBaseEntity<T> {
    msg: string,
    ok: boolean,
    status: string,
    data: T,
}
// tslint:disable-next-line: jsdoc-format
/** Name 请重新命名*/
export class PageListNameContainerEntity extends BaseEntity<ResponseEntity>{
    constructor(fromJson:IBaseEntity<ResponseEntity>){
       // @ts-ignore
        super(fromJson);
        this.message=fromJson.msg||'查询成功';
        this.success=fromJson.ok ? true : false;
        this.code = fromJson.status || '';
        let data = fromJson;
        if(data){
            this.result=super.transformRow(fromJson,ResponseEntity);
        }
        else{
            this.result = new ResponseEntity();
        }
    }
}
