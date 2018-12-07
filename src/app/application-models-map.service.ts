import {Injectable} from '@angular/core';

import {ModelsMapService} from 'generic-crud-lib';
import * as ModelsMap from './models-map';

@Injectable()
export class ApplicationModelsMapService extends ModelsMapService {
  getModelsMap(): any {
    return ModelsMap;
  }

  getNewEntityInstance(entityName: string) {
    return new ModelsMap[entityName]();
  }
}
