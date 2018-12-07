import {HttpClient, HttpHandler} from '@angular/common/http';
import {EventEmitter, NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {DevExtremeModule} from 'devextreme-angular';

import {
  StubActivatedRoute,
  StubAddEditComponent,
  StubCustomFieldTemplateComponent,
  StubEntity,
  StubEntitySearchComponent,
  StubFilterPanelComponent,
  StubSelectableGridComponent,
  StubSelectableTreeComponent,
  StubToolbarComponent,
} from '../../../testing';
import {HttpLoaderFactory} from '../../_translation';
import {MessageResult} from '../../_helpers/global-enums';
import {BaseService} from '../../_services/base.service';
import {DialogService} from '../../_services/dialog.service';
import {CrudComponent} from './crud.component';

describe('CrudComponent', () => {
  let component: CrudComponent;
  let fixture: ComponentFixture<CrudComponent>;

  beforeEach(() => {

    const activatedRouteSpy = new StubActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        CrudComponent,
        StubToolbarComponent,
        StubFilterPanelComponent,
        StubSelectableGridComponent,
        StubSelectableTreeComponent,
        StubAddEditComponent,
        StubCustomFieldTemplateComponent,
        StubEntitySearchComponent,
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
        {provide: DialogService},
        HttpClient,
        HttpHandler,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudComponent);
    component = fixture.componentInstance;
    component.entityType = 'StubEntity';
    component.modelMap = {StubEntity};
    component.confirmationDialog.messageResultEvent = new EventEmitter<MessageResult>();
    fixture.detectChanges();
  });

  it('should create the crud component', () => {
    expect(component).toBeTruthy();
  });

  it('should hide toolbar "edit" button when "localData" mode is on', () => {
    component.isLocalData = true;
    component.ngOnInit();
    expect(component.showToolbarEditButton).toBe(false);
  });

  it('should hide toolbar "hide filter panel" button when "localData" mode is on', () => {
    component.isLocalData = true;
    component.ngOnInit();
    expect(component.showToolbarHideFilterPanelButton).toBe(false);
  });

  it('should make add-edit component editable if localData mode is on', () => {
    component.isLocalData = true;
    component.ngOnInit();
    expect(component.addEditEditable).toBe(true);
  });
});
