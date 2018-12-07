import {Component, OnInit} from '@angular/core';

import {BaseService, DomainsService, ModelsMapService, SettingsService} from 'generic-crud-lib';

import {ApplicationDomainsService} from '../application-domains.service';
import {ApplicationModelsMapService} from '../application-models-map.service';
import {ApplicationSettingsService} from '../application-settings.service';
import {TestEntityService} from '../test-entity.service';

@Component({
  selector: 'app-test-crud',
  templateUrl: './test-crud.component.html',
  styleUrls: ['./test-crud.component.scss'],
  providers: [
    {provide: DomainsService, useClass: ApplicationDomainsService},
    {provide: ModelsMapService, useClass: ApplicationModelsMapService},
    {provide: SettingsService, useClass: ApplicationSettingsService},
    {provide: BaseService, useClass: TestEntityService},
    {provide: 'HasImageInterface', useClass: TestEntityService}
  ]
})
export class TestCrudComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
