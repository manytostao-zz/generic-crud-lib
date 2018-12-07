import 'reflect-metadata';

export class BaseEntity {
  @Reflect.metadata('key', true)
  Id: string;

  constructor(Id: string) {
    this.Id = Id;
  }
}
