import {Component, Input, OnInit} from '@angular/core';

import {ModelsMapService} from '../services/models-map.service';
import 'reflect-metadata';

@Component({
  selector: 'gcl-entity-field',
  templateUrl: './entity-field.component.html',
})
export class EntityFieldComponent implements OnInit {

  /**
   *  Define el nombre de la entidad.
   */
  @Input() entityName = 'Employee';

  /**
   * Define el datasource que recibe el lookup
   */
  dataSourceTreeEntityField: any[];

  /**
   * Valor que se muestra en el input del componente
   */
  _treeValue: any;

  /**
   *  Define el estado de la visibilidad del treeview
   */
  status = false;

  constructor(private modelsMapService: ModelsMapService) {
  }

  ngOnInit() {

    this.getTextBoxDisplayValue();

  }

  /**
   * Muestra en el input del {@link EntityFieldComponent} los valores de las propiedades de la entidad pasada como parámetros.
   */
  getTextBoxDisplayValue() {
    const entity = this.modelsMapService.getNewEntityInstance(this.entityName);
    let i = 0;

    this.dataSourceTreeEntityField = [{
      key: i,
      properties: '',
      parent: '',
    }];
    this.dataSourceTreeEntityField.pop();

    for (const field in entity) {
      if (!Reflect.hasMetadata('key', entity, field)) {
        if (entity.hasOwnProperty(field)) {
          let widgetMetadata: any;
          i++;
          this.dataSourceTreeEntityField.push({
            key: i.toString(),
            properties: field,
          });
          if (Reflect.hasMetadata('widget', entity, field)) {
            widgetMetadata = Reflect.getMetadata('widget', entity, field);
            if (widgetMetadata.name !== undefined && widgetMetadata.name === 'entity-search') {
              let widgetChildInstance;
              let j = 1;
              widgetChildInstance = this.modelsMapService.getNewEntityInstance(widgetMetadata.options.entityType);
              const entityChild: any = widgetChildInstance;

              for (const fieldChild in entityChild) {
                if (!Reflect.hasMetadata('key', entityChild, fieldChild)) {
                  if (entityChild.hasOwnProperty(fieldChild)) {
                    this.dataSourceTreeEntityField.push({
                      key: i + '_' + j,
                      properties: fieldChild,
                      parent: i.toString(),
                    });
                    j++;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * Evento lanzado al dar click sobre un item del treeview
   */
  selectItem(e) {
    if (e.node.parent === null) {
      this._treeValue = this.entityName + '.' + e.node.itemData.properties;
    } else {
      if (e.node.parent && e.node.parent.parent === null) {
        this._treeValue = this.entityName + '.' + e.node.parent.itemData.properties + '.' + e.node.itemData.properties;
      } else {
        if (e.node.parent && e.node.parent.parent && e.node.parent.parent.parent === null) {
          this._treeValue = this.entityName + '.' + e.node.parent.parent.itemData.properties + '.' + e.node.parent.itemData.properties +
            '.' + e.node.itemData.properties;
        }
      }
    }
    this.status = false;
  }

  /**
   * Define la visibilidad del treeview, cambia su estado a true
   */
  changeStatus() {
    this.status = true;
  }

  /**
   * Define la visibilidad del treeview, cambia su estado a false
   */
  changeStatusOut() {
    this.status = false;
  }
}
