import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DevExtremeModule} from 'devextreme-angular';

import {GenericCrudLibComponent} from './generic-crud-lib.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {CrudService} from './services/crud.service';
import {ApplicationDomainsService} from './services/application-domains.service';
import {DomainLookupComponent} from './domain-lookup/domain-lookup.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [GenericCrudLibComponent, ToolbarComponent, DomainLookupComponent],
  imports: [
    BrowserModule,
    DevExtremeModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [GenericCrudLibComponent, ToolbarComponent, DomainLookupComponent],
  providers: [CrudService]
})
export class GenericCrudLibModule {
}
