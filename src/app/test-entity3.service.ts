import { Injectable, Injector } from '@angular/core';

import { Observable, of } from 'rxjs';

import { BaseService, BaseEntity, Filter } from 'generic-crud-lib';
import { TestEntityService } from './test-entity.service';

@Injectable({ providedIn: 'root' })
export class TestEntity3Service extends BaseService {

  constructor(injector: Injector) {
    super();
    setTimeout(() => {
      this.servicesMap.setValue('TestEntityModel', injector.get(TestEntityService));
    });
  }

  add(entity: BaseEntity): Observable<any> {
    return undefined;
  }

  count(filters?: Filter[]): Observable<any> {
    return of(5);
  }

  getAll(first?: number, count?: number, filters?: any[], orders?: any[], complete?: boolean): Observable<any> {
    return undefined;
  }

  getById(id: string, complete?: boolean): Observable<any> {
    return undefined;
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
