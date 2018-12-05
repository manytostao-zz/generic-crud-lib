/*
 * Copyright (c) 2018. DATYS Soluciones Tecnológicas
 */

import {EventEmitter} from '@angular/core';

import {Guid} from 'guid-typescript';
import {AddEditAction} from '../helpers';
import {Filter} from '../model/filter.model';

export class CrudService {

  entitySelectedEvent = new EventEmitter<any[]>();

  reloadDataGridAttempt = new EventEmitter<Filter[]>();

  toolbarItemClickedEvent = new EventEmitter<any>();

  saveEntityAttempt = new EventEmitter<{ action: AddEditAction, componentId: Guid }>();

  entitySavedEvent = new EventEmitter<any>();

  entityChangedEvent = new EventEmitter<any>();

  shouldEmitEntityChangedEvent = true;
}
