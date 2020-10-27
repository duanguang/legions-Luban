import { IBFFBaseEntity, BFFContainerEntity } from './../common/baseEntity'
import { UserInfoEntity } from '../userInfoEntity'
import { JsonProperty } from 'json-mapper-object';

export class UserManagerTableEntity {
	@JsonProperty('page')
	page: number = 1;

	@JsonProperty('pageSize')
  pageSize: number = 10;

	@JsonProperty({ name: 'list', clazz: UserInfoEntity })
  list: UserInfoEntity[] = []

  @JsonProperty('total')
	total: number = 0;
}

export class UserManagerTableContainerEntity extends BFFContainerEntity<
	UserManagerTableEntity
> {
	constructor(res?: IBFFBaseEntity<UserManagerTableEntity>) {
		super(res)
		if (res && res.data) {
			this.result = this.transformRow(res.data, UserManagerTableEntity)
		} else {
			this.result = new UserManagerTableEntity();
		}
	}
}
