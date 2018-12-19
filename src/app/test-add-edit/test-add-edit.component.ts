import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {CrudService, BaseService, DomainsService, SettingsService, ModelsMapService} from 'generic-crud-lib';

import {ApplicationModelsMapService} from '../application-models-map.service';
import {TestEntityService} from '../test-entity.service';
import {ApplicationDomainsService} from '../application-domains.service';
import {ApplicationSettingsService} from '../application-settings.service';

@Component({
  selector: 'app-test-add-edit',
  templateUrl: './test-add-edit.component.html',
  styleUrls: ['./test-add-edit.component.scss'],
  providers: [
    CrudService,
    {provide: DomainsService, useClass: ApplicationDomainsService},
    {provide: ModelsMapService, useClass: ApplicationModelsMapService},
    {provide: SettingsService, useClass: ApplicationSettingsService},
    {provide: BaseService, useClass: TestEntityService},
  ]
})
export class TestAddEditComponent implements OnInit {

  entityType = 'TestEntityModel';
  id: string;

  constructor(
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
  }

}
