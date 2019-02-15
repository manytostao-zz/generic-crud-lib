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

  @Reflect.metadata('listable',
    {
      value: false,
      visible: false,
    })
  public Hash: string;

  @Reflect.metadata('listable',
    {
      value: false,
      visible: false,
    })
  @Reflect.metadata('widget', {
    widgetName: 'image',
    location: {
      category: 'image',
    },
  })
  public ImageField: any;


  @Reflect.metadata('listable', {value: false})
  @Reflect.metadata('widget', {
    widgetName: 'entity-search',
    displayText: 'TestEntityModel2',
    options: {
      entityType: 'TestEntityModel2',
      properties: [
        {name: 'StringField', inverse: '', show: true}],
    },
    location: {category: 'general'},
  })
  @Reflect.metadata('filterable', {
    dataType: 'entity',
    visible: true,
    options: {
      entityType: 'TestEntityModel2',
      visible: true,
      filterableFields: ['Code', 'Description'],
    },
  })
  public EntityField: TestEntityModel2;

  constructor(Id: string, DomainField: string, ImageField: any, EntityField: TestEntityModel2) {
    super(Id);
    this.DomainField = DomainField;
    this.ImageField = ImageField;
    this.EntityField = EntityField;
  }
}

export class TestEntityModel2 extends BaseEntity {

  @Reflect.metadata('listable', {
      value: true,
      order: 3,
      sortable: true,
    },
  )
  @Reflect.metadata('widget', {
    location: {category: 'general'},
  })
  @Reflect.metadata('filterable', {
    dataType: 'string',
    visible: true,
  })
  StringField: string;

  constructor(Id: string, StringField: string) {
    super(Id);
    this.StringField = StringField;
  }
}
