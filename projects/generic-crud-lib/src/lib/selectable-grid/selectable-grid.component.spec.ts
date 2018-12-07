import {HttpClient, HttpHandler} from '@angular/common/http';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {DevExtremeModule} from 'devextreme-angular';
import 'reflect-metadata';

import {StubBaseService, StubEntity} from '../../../testing';
import {HttpLoaderFactory} from '../../_translation';
import {Filter, Order} from '../../_model/model-map';
import {BaseService} from '../../_services/base.service';
import {CrudService} from '../../_services/crud.service';
import {SelectableGridComponent} from './selectable-grid.component';

describe('SelectableGridComponent', () => {

  let component: SelectableGridComponent;
  let fixture: ComponentFixture<SelectableGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SelectableGridComponent,
      ],
      imports: [
        DevExtremeModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        })],
      providers: [
        CrudService,
        {provide: BaseService, useClass: StubBaseService},
        HttpClient,
        HttpHandler,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectableGridComponent);
    component = fixture.componentInstance;
    component.entityType = 'StubEntity';
    component.modelMap = {StubEntity};
    fixture.detectChanges();
  });

  it('should create the add-edit component', () => {
    expect(component).toBeTruthy();
  });

  it('should build grid columns using provided entity metadata', () => {
    expect(component.columns.length).toBe(1);
  });

  it('should emit crud.services event when handling selectionChangedEvent', () => {
    const crudService = TestBed.get(CrudService);
    spyOn(crudService.entitySelectedEvent, 'emit').and.callThrough();
    fixture.detectChanges();
    component.handleSelectionChangedEvent({selectedRowsData: [{id: '1'}]});
    expect(crudService.entitySelectedEvent.emit).toHaveBeenCalled();
  });

  it('should return true when a field is filterable', () => {
    expect(component.isFieldFilterable('StringProperty')).toBe(true);
  });

  it('should return true when a field is not filterable', () => {
    expect(component.isFieldFilterable('NumberProperty')).toBe(false);
  });

  it('should build search panel filters', () => {
    const searchPanelFilters = [['StringProperty', 'contains', 'somethingToFilter'], 'or'];
    let filters: Filter[];
    filters = component.buildSearchPanelFilters(searchPanelFilters);
    expect(filters.length).toBe(1);
    expect(filters[0].Path).toBe('StringProperty');
  });

  it('should build sorting options', () => {
    const rawSortingOption = [{selector: 'NumberProperty', desc: true}];
    let sortingOptions: Order[];
    sortingOptions = component.buildOrderParameter(rawSortingOption);
    expect(sortingOptions.length).toBe(1);
    expect(sortingOptions[0].Path).toBe('NumberProperty');
  });
});
