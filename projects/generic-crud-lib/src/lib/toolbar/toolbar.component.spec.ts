import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {DevExtremeModule} from 'devextreme-angular';

import {HttpLoaderFactory} from '../../_translation';
import {CrudService} from '../../_services/crud.service';
import {ToolbarComponent} from './toolbar.component';

describe('ToolbarComponent', () => {

  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToolbarComponent],
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
      providers: [CrudService],
    }).compileComponents();
  })
  ;

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    component.items = [];
    fixture.detectChanges();
  });

  it('should create the toolbar component', () => {
    expect(component).toBeTruthy();
  });

  it('should make a tooltip visible for a button of a given type', () => {
    const type = 'add';
    component.showDynamicTooltip(type);
    expect(component.showTooltip.visible).toBe(true);
    expect(component.showTooltip.type).toBe(type);
  });

  it('should emit a CrudService event when clicked on a toolbar button', () => {
    const crudService = TestBed.get(CrudService);
    const $eventMock = {itemData: {type: 'add'}};
    crudService.toolbarItemClickedEvent.subscribe(($event) => {
      expect($event.itemData.type).toBe($eventMock.itemData.type);
    });

    component.handleItemClickedEvent($eventMock);
  });
});
