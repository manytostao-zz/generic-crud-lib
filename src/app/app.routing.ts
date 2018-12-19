import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AppComponent} from './app.component';
import {TestCrudComponent} from './test-crud/test-crud.component';
import {TestAddEditComponent} from './test-add-edit/test-add-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        component: TestCrudComponent
      },
      {
        path: 'add',
        component: TestAddEditComponent,
      },
      {
        path: 'edit/:id',
        component: TestAddEditComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {

}
