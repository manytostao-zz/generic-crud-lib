import {Component} from '@angular/core';

import {DomainsService} from 'generic-crud-lib';
import {ModelsMapService} from 'generic-crud-lib';
import {ApplicationDomainsService} from './application-domains.service';
import {ApplicationModelsMapService} from './application-models-map.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {provide: DomainsService, useClass: ApplicationDomainsService},
    {provide: ModelsMapService, useClass: ApplicationModelsMapService}
  ]
})
export class AppComponent {

  constructor() {
  }

}
