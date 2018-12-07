import 'reflect-metadata';
import {BaseEntity} from 'generic-crud-lib';

export class TestEntityModel extends BaseEntity {

  @Reflect.metadata('listable', {
      value: true,
      order: 3,
      sortable: true,
      fieldType: 'domain',
      options: {
        domainName: 'test_domain',
      },
    },
  )
  @Reflect.metadata('widget', {
    widgetName: 'domain',
    options: {
      fieldType: 'domain',
      domainName: 'test_domain',
    },
    location: {category: 'general'},
  })
  @Reflect.metadata('filterable', {
    dataType: 'string',
    visible: true,
  })
  DomainField: string;

  constructor(Id: string, DomainField: string) {
    super(Id);
    this.DomainField = DomainField;
  }
}
