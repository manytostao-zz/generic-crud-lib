import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { BaseService, BaseEntity, Filter } from 'generic-crud-lib';
import { TestEntityModel2 } from './test-entity.model';
import { TestData } from './test-data';
import { TestEntity3Service } from './test-entity3.service';

@Injectable({ providedIn: 'root' })
export class TestEntity2Service extends BaseService {

  testEntity2Array: TestEntityModel2[] = new TestData().testEntityArray2;

  constructor (private testEntity3Service: TestEntity3Service) {
    super();
    this.servicesMap.setValue('TestEntityModel', testEntity3Service);
  }

  add(entity: BaseEntity): Observable<any> {
    return undefined;
  }

  count(filters?: Filter[]): Observable<any> {
    return of(5);
  }

  getAll(first?: number, count?: number, filters?: any[], orders?: any[], complete?: boolean): Observable<any> {
    return of(this.testEntity2Array);
  }

  getById(id: string, complete?: boolean): Observable<any> {
    const testEntity2 = this.testEntity2Array.find(function (value, index, array) {
      return value.Id.toString() === id;
    });
    return of(testEntity2);
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
