import {HttpClient, HttpHandler} from '@angular/common/http';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {DevExtremeModule} from 'devextreme-angular';

import {StubAddEditComponent, StubCrudComponent, StubEntity, StubSubEntity} from '../../../testing';
import {Guid} from '../../_helpers';
import {CrudService} from '../../_services/crud.service';
import {EntitySearchComponent} from './entity-search.component';

describe('EntitySearchComponent', () => {
  let component: EntitySearchComponent;
  let fixture: ComponentFixture<EntitySearchComponent>;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        EntitySearchComponent,
        StubCrudComponent,
        StubAddEditComponent,
      ],
      imports: [
        DevExtremeModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        HttpClient,
        HttpHandler,
        CrudService,
        TranslateService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitySearchComponent);
    component = fixture.componentInstance;
    component.entityType = 'StubEntity';
    component.modelMap = {StubEntity};
    fixture.detectChanges();
  });

  it('should create the crud component', () => {
    expect(component).toBeTruthy();
  });

  it('should show the crud popup when the "crudPopupVisible" mode is activated ', () => {

    component.crudPopupVisible = false;
    component.crudPopupPosition = {my: 'center', at: 'center', of: 'body', offset: '0 100'};
    component.searchEntity();
    fixture.detectChanges();
    expect(component.crudPopupVisible).toBe(true);
  });

  it('should show the add-edit popup when the "addEditPopupVisible" mode is activated ', () => {

    component.addEditPopupVisible = false;
    component.addEditPopupPosition = {my: 'center', at: 'center', of: 'body',  offset: '0 100'};
    component.createEntity();
    fixture.detectChanges();
    expect(component.addEditPopupVisible).toBe(true);
  });

  it('should clean the input and assign to "entitySearchTextBox" undefined value', () => {

    component.displayValue = 'some text';
    component.properties = [];
    component.removeEntity();
    fixture.detectChanges();
    expect(component.displayValue).toBe('');
    expect(component.selectedEntity).toBe(null);
  });

  it('should set the textbox displayValue according to entity metadata properties', () => {
    const stubSubEntityInstance = new StubSubEntity('1', true, 'SomeCode', 'SomeDescription');
    component.selectedEntity = stubSubEntityInstance;
    component.properties = [{name: 'Code', inverse: 'testProperty', show: true}];
    component.setTextBoxDisplayValue();
    expect(component.displayValue).toBe(stubSubEntityInstance.Code);
  });

  it('should hide addEditPopup when clicked on Cancel button', () => {
    component.addEditPopupVisible = true;
    component.addEditPopupPosition = {my: 'center', at: 'center', of: 'body',  offset: '0 100'};
    fixture.detectChanges();
    component.handleAddEditPopupCancelButtonClickedEvent();
    expect(component.addEditPopupVisible).toBe(false);
  });

  it('should emit crudService saveEntityAttempt event when clicked on Save button', () => {
    const crudService = TestBed.get(CrudService);
    spyOn(crudService.saveEntityAttempt, 'emit').and.callThrough();
    component.entitySearchAddEdit = {componentId: Guid.newGuid()};
    component.handleAddEditPopupSaveButtonClickedEvent();
    expect(crudService.saveEntityAttempt.emit).toHaveBeenCalled();
  });

});
