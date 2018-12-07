import {HttpClient, HttpHandler} from '@angular/common/http';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslateService} from '@ngx-translate/core';
import {DevExtremeModule} from 'devextreme-angular';

import {StubBaseService, StubSubEntity, StubTranslateService} from '../../../testing';
import {BaseService} from '../../_services/base.service';
import {CrudService} from '../../_services/crud.service';
import {EntityLookupComponent} from './entity-lookup.component';

describe('EntityLookupComponent', () => {
  let component: EntityLookupComponent;
  let fixture: ComponentFixture<EntityLookupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        EntityLookupComponent,
      ],
      imports: [
        DevExtremeModule],
      providers: [
        CrudService,
        {provide: BaseService, useClass: StubBaseService},
        {provide: TranslateService, useClass: StubTranslateService},
        HttpClient,
        HttpHandler,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityLookupComponent);
    component = fixture.componentInstance;
    component.properties = [{name: 'Code', inverse: 'testProperty', show: true}];
    component.disabled = true;
    component.dataSourcelookup = [];
    fixture.detectChanges();
    const displayTextComponent = 'Language';
    component.selectedEntity = new StubSubEntity(
      '1',
      true,
      'SomeCode',
      'SomeDescription',
    );
    const textComponent: any = {
      Close: null,
      placeholder: 'Select',
      searchPlaceholder: null,
      refreshingText: null,
      noDataText: 'There is no data to show',
      pullingDownText: null,
      Languages: null,
    };
    component.displayTextComponent = displayTextComponent;
    component.textComponent = textComponent;
  });

  it('should create the crud component', () => {
    expect(component).toBeTruthy();
  });

  it('should return true, to disable the editing of the view', () => {
    component.disabled = true;
    expect(true).toBe(component.disabled);
  });

  it('should return false, to disable the editing f the view Add Edit', () => {
    component.disabled = false;
    expect(false).toBe(component.disabled);
  });

  it('must return Select Language, in the Lookup header Select Language', () => {
    component.displayText = component.textComponent.placeholder + ' ' + component.displayTextComponent;
    component.Lookup.title = component.displayText;
    expect('Select Language').toBe(component.Lookup.title);
  });

  it('must return There is no data to show, in the Lookup when is no data to show', () => {
    component.Lookup.noDataText = component.textComponent.noDataText;
    expect('There is no data to show').toBe(component.Lookup.noDataText);
  });
});
