import {Component, EventEmitter, Input, Output} from '@angular/core';

import {BaseEntity} from '../model/base-entity.model';

/**
 * Componente que genera dinámicamente un control visual de formulario para la edición del valor de la propiedad de una entidad
 *
 * @example
 *
 * <app-custom-field-template
 *             [widget]="widget"
 *             [fields]="fields"
 *             [(entity)]="entity"
 *             [disabled]="!editable">
 * </app-custom-field-template>
 */
@Component({
  selector: 'gcl-custom-field-template',
  templateUrl: './custom-field-template.component.html',
})
export class CustomFieldTemplateComponent {

  /**
   * Define si el control visual se mostrará deshabilitado
   */
  @Input() disabled: boolean;

  /**
   * Define el control visual que se generará
   */
  @Input() widgetConfiguration: any = {};

  /**
   * Define los campos a los que se le generará el control definido en el [widget]{@link CustomFieldTemplateComponent#widget}
   */
  @Input() field: string;

  /**
   * Define la entidad a la cual se le modificarán los [fields]{@link CustomFieldTemplateComponent#fields}
   */
  @Input() entity: BaseEntity;

  /**
   * Evento que se emite al cambiar algún valor de la entidad que se manipula
   */
  @Output() valueChangedEvent = new EventEmitter<any>();

  handleValueChangedEvent() {
    this.valueChangedEvent.emit();
  }
}
