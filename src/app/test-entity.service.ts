import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { BaseService, HasImageInterface, BaseEntity, Filter } from 'generic-crud-lib';

import { TestData } from './test-data';
import { TestEntityModel } from './test-entity.model';
import { TestEntity2Service } from './test-entity2.service';

@Injectable({ providedIn: 'root' })
export class TestEntityService extends BaseService implements HasImageInterface {

  constructor(private testEntity2Service: TestEntity2Service) {
    super();
    this.servicesMap.setValue('TestEntityModel2', testEntity2Service);
  }

  testEntityArray: TestEntityModel[] = new TestData().testEntityArray;

  add(entity: BaseEntity): Observable<any> {
    return undefined;
  }

  count(filters?: Filter[]): Observable<any> {
    return of(5);
  }

  getAll(first?: number, count?: number, filters?: any[], orders?: any[], complete?: boolean): Observable<any> {
    return of(this.testEntityArray);
  }

  getById(id: string, complete?: boolean): Observable<any> {
    const testEntity = this.testEntityArray.find(function (value, index, array) {
      return value.Id.toString() === id;
    });
    return of(testEntity);
  }

  getImageByEntityId(id: string): Observable<any> {
    return of('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');
  }

  new(): Observable<any> {
    return undefined;
  }

  remove(id: string): Observable<any> {
    return undefined;
  }

  update(entity: BaseEntity): Observable<any> {
    return undefined;
  }
}
