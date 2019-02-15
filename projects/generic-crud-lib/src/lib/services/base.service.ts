/*
 * Copyright (c) 2018. DATYS Soluciones Tecnológicas
 */

import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import * as Collections from 'typescript-collections';

import {BaseEntity} from '../model/base-entity.model';
import {Filter} from '../model/filter.model';

@Injectable()
export abstract class BaseService {

  servicesMap: Collections.Dictionary<string, any> = new Collections.Dictionary<string, any>();

  constructor() {
  }

  abstract getAll(first?: number, count?: number, filters?: any[], orders?: any[], complete?: boolean): Observable<any>;

  abstract getById(id: string, complete?: boolean): Observable<any>;

  abstract count(filters?: Filter[]): Observable<any>;

  abstract add(entity: BaseEntity): Observable<any>;

  abstract update(entity: BaseEntity): Observable<any>;

  abstract remove(id: string): Observable<any>;

  abstract new(): Observable<any>;
}
