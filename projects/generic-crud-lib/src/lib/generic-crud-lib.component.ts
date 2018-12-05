import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'gcl-generic-crud-lib',
  template: `
    <dx-button text="Button of library" stylingMode="outlined"></dx-button>
  `,
  styles: []
})
export class GenericCrudLibComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
