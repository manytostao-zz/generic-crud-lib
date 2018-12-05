import 'reflect-metadata';

export class BaseEntity {
  @Reflect.metadata('key', true)
  Id: string;

  // @Reflect.metadata('listable', {value: false})
  // CustomPropertyValues: CustomPropertyValueDTO[];

  constructor(Id: string) {
    this.Id = Id;
  }
}
