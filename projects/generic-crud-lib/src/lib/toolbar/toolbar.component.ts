import {Component, Input, OnInit} from '@angular/core';

import { Guid } from 'guid-typescript';
import {ToolbarItemType} from '../helpers';
import {CrudService} from '../services/crud.service';

/**
 * Componente que genera una barra botonera o de herramientas dinámicamente
 *
 * @example
 *
 * <app-toolbar
 *             [cssClass]="toolbarCssClass"
 *             [items]="toolbarItems"
 *             [inCrud]="true"
 *             [showDefaultButtons]="showToolbarDefaultButtons"
 *             [showAcceptButton]="showToolbarAcceptButton"
 *             [showCancelButton]="showToolbarCancelButton"
 *             [showAddButton]="showToolbarAddButton"
 *             [showEditButton]="showToolbarEditButton"
 *             [showRemoveButton]="showToolbarRemoveButton"
 *             [selectedEntities]="selectedEntities"
 *             (toolbarItemClickedEvent)="handleToolbarItemClickedEvent($event)">
 * </app-toolbar>
 */
@Component({
  selector: 'gcl-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent implements OnInit {

  /**
   * Define las clases CSS que empleará el componente
   */
  @Input() cssClass: string;

  /**
   * Define si el componente se está empleando dentro del componente {@link CrudComponent}
   */
  @Input() inCrud: boolean;

  /**
   * Define si serán mostrados los botones por defecto del componente
   */
  @Input() showDefaultButtons = false;

  /**
   * Define si será mostrado el botón *Aceptar* en el componente
   */
  @Input() showAcceptButton = false;

  /**
   * Define si será mostrado el botón *Cancelar* en el componente
   */
  @Input() showCancelButton = false;

  /**
   * Define si será mostrado el botón *Adicionar* en el componente
   */
  @Input() showAddButton = false;

  /**
   * Define si será mostrado el botón *Editar* en el componente
   */
  @Input() showEditButton = false;

  /**
   * Define si será mostrado el botón *Eliminar* en el componente
   */
  @Input() showRemoveButton = false;

  /**
   * Define si será mostrado el botón *Esconder Detalle* en el componente
   */
  @Input() showHideDetailButton = true;

  /**
   * Define si será mostrado el botón *Esconder Panel de Filtros* en el componente
   */
  @Input() showHideFilterPanelButton = true;

  /**
   * Define los elementos (botones, submenús, etc.) que se mostrarán en el componente
   */
  @Input() items: any[] = [];

  /**
   * Define la entidad que se encuentra seleccionada en el componente {@link CrudComponent} asociado
   */
  @Input() selectedEntities: any[] = [];

  /**
   * Indica si se muestra el tooltips (información) de la herramienta en el boton del toolbar.
   */
  showTooltip = {visible: false, type: ''};

  toolbarItemType = ToolbarItemType;

  toolbarItemsIds: any[] = [];

  constructor(private crudService: CrudService) {
    this.toolbarItemsIds['accept'] = 'a' + Guid.create();
    this.toolbarItemsIds['cancel'] = 'a' + Guid.create();
    this.toolbarItemsIds['add'] = 'a' + Guid.create();
    this.toolbarItemsIds['edit'] = 'a' + Guid.create();
    this.toolbarItemsIds['remove'] = 'a' + Guid.create();
    this.toolbarItemsIds['filters'] = 'a' + Guid.create();
    this.toolbarItemsIds['info'] = 'a' + Guid.create();
  }

  ngOnInit() {
    this.items.forEach((item) => {
      this.toolbarItemsIds[item.type] = 'a' + Guid.create();
    });
  }

  /**
   * Deshabilita o habilita los elementos del componente a partir de condiciones definidas en el elemento
   *
   * @example
   *
   * this.toolbarItems = [
   *             {
   *                 locateInMenu: 'always',
   *                 text: 'Print',
   *                 onClick: () => {
   *                     notify('Print option has been clicked!');
   *                 },
   *                 disableConditions: [
   *                     {
   *                         type: 'rowSelection',
   *                         values: ['multiple']
   *                     },
   *                     {
   *                         type: 'position',
   *                         values: ['CDO', 'CGO']
   *                     }
   *                 ]
   *             },
   *         ];
   *
   */
  disable(conditions: [{ type: string, values: any[] }]): boolean {
    if (this.inCrud) {
      if (conditions === undefined) {
        return false;
      }
      if (conditions.length < 1) {
        return false;
      }
      let result = false;
      for (const condition of conditions) {
        if (condition.type === 'rowSelection') {
          for (const conditionValue of condition.values) {
            if (conditionValue === 'multiple') {
              result = !(this.selectedEntities !== undefined && this.selectedEntities !== [] && this.selectedEntities.length === 1);
            }
          }
        } else {
          if (this.selectedEntities === undefined || this.selectedEntities.length === 0) {
            break;
          }
          const entity = this.selectedEntities[0];
          for (const conditionValue of condition.values) {
            if (entity.hasOwnProperty(condition.type) && entity[condition.type] === conditionValue) {
              result = true;
            }
          }
        }
      }
      return result;
    } else {
      return false;
    }
  }

  /**
   * Función que activa el tooltips(Información de herramienta) del boton señalado
   * @param type : tipo de boton.
   */
  showDynamicTooltip(type) {
    this.showTooltip.visible = !this.showTooltip.visible;
    this.showTooltip.type = type;
  }

  /**
   * Maneja la suscripción al evento onItemClick del componente dx-toolbar de DevExpress
   */
  handleItemClickedEvent($event: any) {
    this.crudService.toolbarItemClickedEvent.emit($event);
  }
}
