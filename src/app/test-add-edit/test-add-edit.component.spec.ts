import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAddEditComponent } from './test-add-edit.component';

describe('TestAddEditComponent', () => {
  let component: TestAddEditComponent;
  let fixture: ComponentFixture<TestAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
