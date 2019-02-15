import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { GenericCrudLibModule } from 'generic-crud-lib';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    GenericCrudLibModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
