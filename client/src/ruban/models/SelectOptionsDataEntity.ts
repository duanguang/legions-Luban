
import { JsonProperty } from 'json-mapper-object';
import {HlLabeledValue} from 'hoolinks-legion-design/lib/models/HlLabeledValue'
import {BaseEntity} from './common/baseEntity';
/** 请重新填写类名称， 
 * 此类对应到接口接口list item项
 * 及补充接口字段数据*/
class SelectOptionsDataEntity {
    @JsonProperty('labelKey')
    labelKey = '';
    @JsonProperty('labelValue')
    labelValue = '';
}
/** 请重新填写类名称， 
 * 此类对应到接口结构
 * 及补充接口字段数据*/
class SelectOptionsListEntity {
    @JsonProperty({ clazz: SelectOptionsDataEntity, name: 'rows' })
    data: SelectOptionsDataEntity[] = [];
    @JsonProperty('total')
    total = 0;

    get options():HlLabeledValue[] {
        const resData = this.data || [];
        return resData && resData.map((item) => {
            return {
                key: item.labelKey,
                value: item.labelValue,
                label:item.labelValue,
            }
        })

    }
}
interface IBaseEntity<T> {
    msg: string,
    ok: boolean,
    code: string,
    data: T,
}
/** 请重新填写类名称， 
 * 此类是前端使用的数据模型层*/
export class SelectOptionsContainer extends BaseEntity<SelectOptionsListEntity> {
    constructor(fromJson: IBaseEntity<SelectOptionsListEntity>) {
        super()
        this.code = fromJson.code;
        this.message = fromJson.msg;
        this.success = fromJson.ok;
        if (fromJson) {
            this.result = super.transformRow(fromJson, SelectOptionsListEntity)
        }
    }
}
