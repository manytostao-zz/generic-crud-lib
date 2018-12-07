import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {GenericCrudLibModule} from 'generic-crud-lib';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing';
import {TestCrudComponent} from './test-crud/test-crud.component';
import {TestAddEditComponent} from './test-add-edit/test-add-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    TestCrudComponent,
    TestAddEditComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    GenericCrudLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
