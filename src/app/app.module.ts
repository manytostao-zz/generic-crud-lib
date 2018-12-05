import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {GenericCrudLibModule} from 'generic-crud-lib';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    GenericCrudLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
