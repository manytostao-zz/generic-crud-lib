import {Component} from '@angular/core';
import {ApplicationDomainsService} from 'generic-crud-lib';
import {DomainsService} from './domains.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [{provide: ApplicationDomainsService, useClass: DomainsService}]
})
export class AppComponent {
  title = 'generic-crud-lib-app';

  constructor(private applicationDomainsService: ApplicationDomainsService) {
    console.log(applicationDomainsService.getDomain('tipo_cargo_descuento'));
  }
}
