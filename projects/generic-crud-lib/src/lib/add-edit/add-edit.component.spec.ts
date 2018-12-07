import {HttpClient, HttpHandler} from '@angular/common/http';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {DevExtremeModule} from 'devextreme-angular';
import 'reflect-metadata';
import {of} from 'rxjs';

import {
  StubBaseService,
  StubCustomFieldTemplateComponent,
  StubDialogService,
  StubEntity,
} from '../../../testing';
import {ApplicationSettingsService} from '../../../testing/stub-application-settings-service';
import {BaseService} from '../../_services/base.service';
import {CrudService} from '../../_services/crud.service';
import {DialogService} from '../../_services/dialog.service';
import {HttpLoaderFactory} from '../../_translation';
import {AddEditComponent} from './add-edit.component';

describe('AddEditComponent', () => {

  let component: AddEditComponent;
  let fixture: ComponentFixture<AddEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddEditComponent,
        StubCustomFieldTemplateComponent,
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
        {provide: DialogService, useClass: StubDialogService},
        HttpClient,
        HttpHandler,
        ApplicationSettingsService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditComponent);
    component = fixture.componentInstance;
    component.entityType = 'StubEntity';
    component.modelMap = {StubEntity};
    fixture.detectChanges();
  });

  it('should create the add-edit component', () => {
    expect(component).toBeTruthy();
  });

  it('should extract metadata from the provided entity name/type', () => {
    component.extractEntityMetadata();
    expect(component.modelMap[component.entityType]).toBe(StubEntity);
    expect(component.fieldsLocationMetadata.getValue('general').getValue('')[0]).toBe('NumberProperty');
    expect(component.fieldsWidgetMetadata.getValue('NumberProperty').location.category).toBe('general');
  });

  it('should return field template name based on field name when widgetName metadata appears on field', () => {
    const fieldTemplateName = component.getItemTemplateName('NumberProperty');
    expect(fieldTemplateName).toBe('NumberPropertyTemplate');
  });

  it('should return empty field template name when widgetName metadata doesn\'t appear on field', () => {
    const fieldTemplateName = component.getItemTemplateName('StringProperty');
    expect(fieldTemplateName).toBe('');
  });

  it('should set isLoaded to true if CrudService entitySelectedEvent is emitted and "localData" mode is on', () => {
    component.isLocalData = true;
    component.isLoaded = false;
    const response: any[] = [{id: '1'}];
    const crudService = TestBed.get(CrudService);

    spyOn(crudService, 'entitySelectedEvent').and.returnValue(of(response));

    component.handleCrudServiceSubscriptions();

    fixture.detectChanges();

    setTimeout(() => {
      expect(component.isLoaded).toBe(true);
    }, 600);

  });

  it('should create an empty entity if entityId is null and "localData" mode is off', () => {
    component.isLocalData = false;
    const baseService = TestBed.get(BaseService);
    spyOn(baseService, 'new').and.callThrough();
    fixture.detectChanges();
    component.loadData(null);
    expect(baseService.new).toHaveBeenCalled();
  });

  it('should call BaseService getById if "localData" mode is off and entityId is not null', () => {
    component.isLocalData = false;
    const baseService = TestBed.get(BaseService);
    spyOn(baseService, 'getById').and.callThrough();
    fixture.detectChanges();
    component.loadData('1');
    expect(baseService.getById).toHaveBeenCalled();
  });

  it('should show tooltip for tab GENERAL', () => {
    component.showTabTooltip.visible = false;
    component.showTabTooltip.tab = '';
    component.showDynamicTooltip('GENERAL');
    expect(component.showTabTooltip.visible).toBe(true);
    expect(component.showTabTooltip.tab).toBe('GENERAL');
  });
});
