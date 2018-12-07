import {Injectable} from '@angular/core';

@Injectable()
export abstract class ModelsMapService {
  abstract getModelsMap(): any;
  abstract getNewEntityInstance(entityName: string): any;
}
