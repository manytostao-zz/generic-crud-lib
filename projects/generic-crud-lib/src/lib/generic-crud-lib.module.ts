import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DevExtremeModule} from 'devextreme-angular';

import {GenericCrudLibComponent} from './generic-crud-lib.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {CrudService} from './services/crud.service';
import {DomainLookupComponent} from './domain-lookup/domain-lookup.component';
import {EntityFieldComponent} from './entity-field/entity-field.component';
import {EntityImageComponent} from './entity-image/entity-image.component';
import {CrudComponent} from './crud/crud.component';
import {FilterPanelComponent} from './filter-panel/filter-panel.component';
import {SelectableGridComponent} from './selectable-grid/selectable-grid.component';
import {SelectableTreeComponent} from './selectable-tree/selectable-tree.component';
import {AddEditComponent} from './add-edit/add-edit.component';
import {CustomDialogComponent} from './custom-dialog/custom-dialog.component';
import {CustomFieldTemplateComponent} from './custom-field-template/custom-field-template.component';
import {EntitySearchComponent} from './entity-search/entity-search.component';
import {EntityLookupComponent} from './entity-lookup/entity-lookup.component';
import {DialogService} from './services/dialog.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    GenericCrudLibComponent,
    ToolbarComponent,
    DomainLookupComponent,
    EntityFieldComponent,
    EntityImageComponent,
    CrudComponent,
    FilterPanelComponent,
    SelectableGridComponent,
    SelectableTreeComponent,
    AddEditComponent,
    CustomDialogComponent,
    CustomFieldTemplateComponent,
    EntitySearchComponent,
    EntityLookupComponent
  ],
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
  exports: [
    GenericCrudLibComponent,
    ToolbarComponent,
    DomainLookupComponent,
    EntityFieldComponent,
    EntityImageComponent,
    CrudComponent,
    FilterPanelComponent,
    SelectableGridComponent,
    SelectableTreeComponent,
    AddEditComponent,
    CustomDialogComponent,
    CustomFieldTemplateComponent,
    EntitySearchComponent,
    EntityLookupComponent
  ],
  providers: [DialogService]
})
export class GenericCrudLibModule {
}
