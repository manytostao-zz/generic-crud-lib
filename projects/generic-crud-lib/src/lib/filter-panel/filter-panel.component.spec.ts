import {HttpClient, HttpHandler} from '@angular/common/http';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {DevExtremeModule} from 'devextreme-angular';
import {HttpLoaderFactory} from '../../_translation';

import {StubActivatedRoute, StubBaseService, StubSubEntity} from '../../../testing';
import {BaseService} from '../../_services/base.service';
import {CrudService} from '../../_services/crud.service';
import {BankDTO} from '../../nomenclatives/general/bank/model/bank-dto.model';
import {FilterPanelComponent} from './filter-panel.component';

describe('FilterPanelComponent', () => {
  let component: FilterPanelComponent;
  let fixture: ComponentFixture<FilterPanelComponent>;

  beforeEach(() => {

    const activatedRouteSpy = new StubActivatedRoute();
    TestBed.configureTestingModule({
      declarations: [
        FilterPanelComponent,
      ],
      imports: [
        DevExtremeModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      providers: [
        {provide: BaseService},
        {provide: Router},
        {provide: ActivatedRoute, useValue: activatedRouteSpy},
        CrudService,
        {provide: BaseService, useClass: StubBaseService},
        HttpClient,
        HttpHandler,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPanelComponent);
    component = fixture.componentInstance;
    component.entityName = 'BankDTO';
    fixture.detectChanges();
  });

  it('should create the filter-panel component', () => {
    expect(component).toBeDefined();
  });
  it('should show tooltip if filter-panel component fieldsFilterMetadata is true', () => {
    component.isTooltipPopupVisible = true;
    expect(fixture.nativeElement.querySelector('div').tooltip = 'Escoja los campos por los cuáles desea filtrar');
  });
  it('should set popupFilterVisible property to true', () => {
    const buton = fixture.nativeElement.querySelector('dx-button#showFilterPopup');
    buton.click();
    expect(component.popupFilterVisible).toBeTruthy();
  });
  it('should put some string in CamelCase format to TitleCase format', () => {
    const strinIn = 'nombreCompleto';
    const converted = component.camelCaseToTitleCase(strinIn);
    expect(converted).toEqual('Nombre Completo');
  });
  it('should reset the filters property to original state', () => {
    const crudService = TestBed.get(CrudService);
    spyOn(crudService.reloadDataGridAttempt, 'emit').and.callThrough();
    component.filters = filtersFilledStub;
    component.onReset();
    expect(component.filters).toEqual(filtersStub);
    expect(crudService.reloadDataGridAttempt.emit).toHaveBeenCalled();
  });
  it('should fill/remove items in the fieldsVisibles property when visible = false in fieldsFilterMetadata property', () => {
    component.fieldsFilterMetadata = metadataForVisibilityStub;
    component.fieldsVisibles = [];
    component.removeFiltersNonVisibles();
    expect(component.fieldsVisibles).toEqual(fieldsVisibilesStub);
  });
  it('should add items in the fieldsVisiblesCol1/2 property', () => {
    component.fieldsVisibles = fieldsVisibilesStub;
    component.moveFieldsToArrays();
    expect(component.fieldVisiblesCol1).toEqual(fieldsVisibilesCol1Stub);
    expect(component.fieldVisiblesCol2).toEqual(fieldsVisibilesCol2Stub);
  });
  it('should fill the fieldsFilterMetadata array', () => {
    component.filterInstance = new StubSubEntity();
    component.extractEntityFilterMetadata();
    expect(component.fieldsFilterMetadata).toEqual(fieldFilterMetadataStub);
  });
  it('should remove the "Id" substring for the filter of an subentity', () => {
    const converted = component.unIdEntityType('LenguageId');
    expect(converted).toEqual('Lenguage');
  });
});

const filtersStub: Array<{ fieldName: string, value: any, value2: any, operator: string }> = [
  {fieldName: 'Active', value: null, value2: null, operator: null},
  {fieldName: 'Address', value: null, value2: null, operator: null},
  {fieldName: 'Code', value: null, value2: null, operator: null},
  {fieldName: 'Description', value: null, value2: null, operator: null},
  {fieldName: 'Swift', value: null, value2: null, operator: null},
];

const filtersFilledStub: Array<{ fieldName: string, value: any, value2: any, operator: string }> = [
  {fieldName: 'Active', value: true, value2: null, operator: null},
  {fieldName: 'Address', value: 'calle 194', value2: null, operator: null},
  {fieldName: 'Code', value: '002145', value2: null, operator: null},
  {fieldName: 'Description', value: null, value2: null, operator: null},
  {fieldName: 'Swift', value: null, value2: null, operator: null},
];

const metadataForVisibilityStub:
  Array<{
    name: string,
    dataType: string,
    fieldName: string,
    visible: boolean,
    between: boolean,
    opDataType: string,
    opFilterableFields: any,
  }> = [
  {
    name: 'Active',
    dataType: 'boolean',
    fieldName: 'Active',
    visible: false,
    between: false,
    opDataType: '',
    opFilterableFields: null,
  },
  {
    name: 'Address',
    dataType: 'string',
    fieldName: 'Address',
    visible: false,
    between: false,
    opDataType: '',
    opFilterableFields: null,
  },
  {
    name: 'Code',
    dataType: 'string',
    fieldName: 'Code',
    visible: true,
    between: false,
    opDataType: '',
    opFilterableFields: null,
  },
  {
    name: 'Description',
    dataType: 'string',
    fieldName: 'Description',
    visible: false,
    between: false,
    opDataType: '',
    opFilterableFields: null,
  },
  {
    name: 'Swift',
    dataType: 'string',
    fieldName: 'Swift',
    visible: true,
    between: false,
    opDataType: '',
    opFilterableFields: null,
  },
];

const fieldsVisibilesStub:
  Array<{
    name: string,
    dataType: string,
    fieldName: string,
    visible: boolean,
    between: boolean,
    opDataType: string,
    opFilterableFields: any,
  }> = [
  {
    name: 'Code',
    dataType: 'string',
    fieldName: 'Code',
    visible: true,
    between: false,
    opDataType: '',
    opFilterableFields: null,
  },
  {
    name: 'Swift',
    dataType: 'string',
    fieldName: 'Swift',
    visible: true,
    between: false,
    opDataType: '',
    opFilterableFields: null,
  },
];

const fieldsVisibilesCol1Stub:
  Array<{
    name: string,
    dataType: string,
    fieldName: string,
    visible: boolean,
    between: boolean,
    opDataType: string,
    opFilterableFields: any,
  }> = [
  {
    name: 'Code',
    dataType: 'string',
    fieldName: 'Code',
    visible: true,
    between: false,
    opDataType: '',
    opFilterableFields: null,
  },
];

const fieldsVisibilesCol2Stub:
  Array<{
    name: string, dataType: string, fieldName: string, visible: boolean,
    between: boolean, opDataType: string, opFilterableFields: any,
  }> = [
  {
    name: 'Swift',
    dataType: 'string',
    fieldName: 'Swift',
    visible: true,
    between: false,
    opDataType: '',
    opFilterableFields: null,
  },
];

const fieldFilterMetadataStub:
  Array<{
    name: string,
    dataType: string,
    fieldName: string,
    visible: boolean,
    between: boolean,
    opDataType: string, opFilterableFields: any,
  }> = [
  {
    name: 'Active',
    dataType: 'boolean',
    fieldName: 'Active',
    visible: true,
    between: false,
    opDataType: '',
    opFilterableFields: undefined,
  },
  {
    name: 'Address',
    dataType: 'string',
    fieldName: 'Address',
    visible: true,
    between: false,
    opDataType: '',
    opFilterableFields: undefined,
  },
  {
    name: 'Code',
    dataType: 'string',
    fieldName: 'Code',
    visible: true,
    between: false,
    opDataType: '',
    opFilterableFields: undefined,
  },
  {
    name: 'Description',
    dataType: 'string',
    fieldName: 'Description',
    visible: true,
    between: false,
    opDataType: '',
    opFilterableFields: undefined,
  },
  {
    name: 'Swift',
    dataType: 'string',
    fieldName: 'Swift',
    visible: true,
    between: false,
    opDataType: '',
    opFilterableFields: undefined,
  },
];
