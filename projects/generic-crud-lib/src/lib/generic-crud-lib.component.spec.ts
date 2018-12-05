import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericCrudLibComponent } from './generic-crud-lib.component';

describe('GenericCrudLibComponent', () => {
  let component: GenericCrudLibComponent;
  let fixture: ComponentFixture<GenericCrudLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericCrudLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericCrudLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
