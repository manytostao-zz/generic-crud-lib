import {Component} from '@angular/core';

import {DomainsService, ModelsMapService, BaseService} from 'generic-crud-lib';
import {ApplicationDomainsService} from './application-domains.service';
import {ApplicationModelsMapService} from './application-models-map.service';
import {TestEntityService} from './test-entity.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {provide: DomainsService, useClass: ApplicationDomainsService},
    {provide: ModelsMapService, useClass: ApplicationModelsMapService},
    {provide: BaseService, useClass: TestEntityService},
    {provide: 'HasImageInterface', useClass: TestEntityService}
  ]
})
export class AppComponent {

  constructor() {
  }

}
