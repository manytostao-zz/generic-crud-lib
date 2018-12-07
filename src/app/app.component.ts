import {Component} from '@angular/core';

import {DomainsService, ModelsMapService, BaseService, SettingsService} from 'generic-crud-lib';
import {ApplicationDomainsService} from './application-domains.service';
import {ApplicationModelsMapService} from './application-models-map.service';
import {TestEntityService} from './test-entity.service';
import {ApplicationSettingsService} from './application-settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {provide: DomainsService, useClass: ApplicationDomainsService},
    {provide: ModelsMapService, useClass: ApplicationModelsMapService},
    {provide: SettingsService, useClass: ApplicationSettingsService},
    {provide: BaseService, useClass: TestEntityService},
    {provide: 'HasImageInterface', useClass: TestEntityService}
  ]
})
export class AppComponent {

  constructor() {
  }

}
