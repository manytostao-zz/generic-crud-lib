import {HttpClient, HttpHandler} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DevExtremeModule} from 'devextreme-angular';
import 'reflect-metadata';

import {StubEntity} from '../../../testing';
import {EntityFieldComponent} from './entity-field.component';

describe('EntityFieldComponent', () => {

  let component: EntityFieldComponent;
  let fixture: ComponentFixture<EntityFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        EntityFieldComponent,
      ],
      imports: [
        DevExtremeModule],
      providers: [
        HttpClient,
        HttpHandler,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityFieldComponent);
    component = fixture.componentInstance;
    component.entityName = 'StubEntity';
    component.modelMap = {StubEntity};
    fixture.detectChanges();
  });

  it('should create the add-edit component', () => {
    expect(component).toBeTruthy();
  });

  it('should return an array with the properties of the class', () => {
    component.getTextBoxDisplayValue();
    fixture.detectChanges();
    expect(component.dataSourceTreeEntityField[0].properties).toBe('NumberProperty');

  });

  it('should return true, to activate the visibility of the tree view', () => {
    component.status = false;
    component.changeStatus();
    fixture.detectChanges();
    expect(component.status).toBe(true);
  });

  it('should return false, to desactivate the visibility of the tree view', () => {
    component.status = true;
    component.changeStatusOut();
    fixture.detectChanges();
    expect(component.status).toBe(false);
  });

  it('should the parameter e.node.parent take value null, and return EntityName+properties', () => {
    component.status = false;
    component._treeValue = '';
    const e = {
      node: {
        parent: null,
        itemData: {
          properties: 'properties',
        },
      },
    };
    component.selectItem(e);
    fixture.detectChanges();
    expect(component._treeValue).toBe(component.entityName + '.' + e.node.itemData.properties);
    expect(component.status).toBe(false);
  });

  it('should set e.node.parent value to defined', () => {
    component.status = false;
    component._treeValue = '';
    const e = {
      node: {
        parent: {
          parent: null,
          itemData: {
            properties: 'properties',
          },
        },
        itemData: {
          properties: 'properties',
        },
      },
    };
    component.selectItem(e);
    fixture.detectChanges();
    expect(component._treeValue).toBe(component.entityName + '.' + e.node.parent.itemData.properties + '.' + e.node.itemData.properties);
    expect(component.status).toBe(false);
  });

});
