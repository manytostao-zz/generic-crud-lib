import {HttpClient, HttpHandler} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {DxLookupModule} from 'devextreme-angular';

import {HttpLoaderFactory} from '../../_translation';
import {DomainLookupComponent} from './domain-lookup.component';

describe('DomainLookupComponent', () => {
  let component: DomainLookupComponent;
  let fixture: ComponentFixture<DomainLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DomainLookupComponent],
      imports: [
        DxLookupModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        })],
      providers: [
        HttpClient,
        HttpHandler,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event on component value change', () => {
    spyOn(component.valueChanged, 'emit').and.callThrough();
    fixture.detectChanges();
    component.handleOnValueChangedEvent({});
    expect(component.valueChanged.emit).toHaveBeenCalled();
  });
});
