import {Component, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';

import {BaseEntity} from '../model/base-entity.model';
import {AddEditAction, ToolbarItemType} from '../helpers';
import {CrudService} from '../services/crud.service';
import {SettingsService} from '../services/settings.service';

/**
 * Componente que permite acceder al crud de la entitdad, o crear una nueva entidad
 *
 * @example
 *
 * <app-entity-search
 *             [properties]="['code']"
 *             [entityType]="'Certificate'"
 *             [(selectedEntity)]="entity">
 * </app-entity-search>
 */
@Component({
  selector: 'gcl-entity-search',
  templateUrl: './entity-search.component.html',
  styleUrls: ['./entity-search.component.scss'],
})
export class EntitySearchComponent implements OnChanges {

  /**
   * Define el tipo de las entidades que manejará el {@link CrudComponent}
   */
  @Input() entityType: string;

  /**
   * Contiene el identificador de la entidad seleccionada
   */
  @Input() containerInstance: BaseEntity;

  /**
   * Define si el componente {@link EntitySearchComponent} se mostrará editable
   */
  @Input() disabled: boolean;

  /**
   * Define las propiedades de la entidad que requiere se muestren en input del {@link EntitySearchComponent}
   */
  @Input() properties: Array<{ name: string, inverse: string, show: boolean }>;

  /**
   * Define si será mostrado el botón *Agregar* en el componente
   */
  @Input() showAddButton = true;

  /**
   * Define si será mostrado el botón *Buscar* en el componente
   */
  @Input() showSearchButton = true;

  /**
   * Define si será mostrado el botón *Eliminar* en el componente
   */
  @Input() showRemoveButton = true;

  /**
   * Define si la entidad es requerida o no
   */
  @Input() required = true;

  /**
   * Referencia al elemento input de la vista
   */
  @ViewChild('entitySearchTextBox') entitySearchTextBox;

  /**
   * Referencia al elemento popup de la vista
   */
  @ViewChild('addEditPopup') addEditPopup;

  /**
   * Referencia al elemento add-edit de la vista
   */
  @ViewChild('entitySearchAddEdit') entitySearchAddEdit;

  /**
   * Controla si se muestra la ventana modal que contiene un componente {@link CrudComponent} para seleccionar una entidad
   */
  crudPopupVisible = false;

  /**
   * Controla la posición en que se mostrará el diálogo del componente {@link CrudComponent}
   */
  crudPopupPosition: any;

  /**
   * Controla si se muestra la ventana modal que contiene un componente {@link AddEditComponent} para adicionar una entidad
   */
  addEditPopupVisible = false;

  /**
   * Controla la posición en que se mostrará el diálogo del componente {@link AddEditComponent}
   */
  addEditPopupPosition: any;

  /**
   * Contiene el valor a mostrar en el campo de texto
   */
  displayValue = '';

  /**
   * Contiene la entidad seleccionada en el componente {@link CrudComponent} que maneja el {@link EntitySearchComponent}
   */
  private _selectedEntity: BaseEntity;
  /**
   * Evento que se lanza cuando cambia el valor de la propiedad selectedEntity
   */
  @Output() selectedEntityChange = new EventEmitter<BaseEntity>();

  /**
   * @ignore
   */
  @Input() get selectedEntity(): BaseEntity {

    return this._selectedEntity;
  }

  /**
   * @ignore
   */
  set selectedEntity(value: BaseEntity) {
    this._selectedEntity = value;
    this.selectedEntityChange.emit(this._selectedEntity);
  }

  constructor(private crudService: CrudService, private settingsService: SettingsService) {
    this.crudPopupPosition = settingsService.getSettingValue('popupsDefaultPosition');
    this.addEditPopupPosition = settingsService.getSettingValue('popupsDefaultPosition');
  }

  /**
   * Inicializa el componente
   */
  ngOnChanges() {
    this.displayValue = '';
    if (this.properties && this.containerInstance) {
      for (const property of this.properties) {
        if (property.show) {
          if (this.displayValue === '') {
            this.displayValue = this.containerInstance[property.inverse] && this.containerInstance[property.inverse] !== null
              ? this.containerInstance[property.inverse]
              : null;
          } else {
            this.displayValue = this.containerInstance[property.inverse] && this.containerInstance[property.inverse] !== null
              ? this.displayValue + ' - ' + this.containerInstance[property.inverse]
              : '';
          }

        }
      }
    }
  }

  /**
   * Crea una nueva entidad y abre el modal con el componente {@link AddEditComponent}
   */
  createEntity() {
    this.addEditPopupVisible = true;
  }

  /**
   * Abre el modal con el componente {@link CrudComponent}
   */
  searchEntity() {
    this.crudPopupVisible = true;
  }

  /**
   * Limpia la entidad seleccionada.
   */
  removeEntity() {
    this.displayValue = '';
    this._selectedEntity = null;
    for (const property of this.properties) {
      this.containerInstance[property.inverse] = null;
    }
  }

  /**
   * Muestra en el input del {@link EntitySearchComponent} los valores de las propiedades pasadas como parámetros.
   */
  setTextBoxDisplayValue() {
    this.displayValue = '';
    if (this._selectedEntity !== undefined && this._selectedEntity !== null) {
      if (this.properties.length > 0) {
        for (const property of this.properties) {
          if (property.show) {
            this.displayValue = this.displayValue.length > 0
              ? this.displayValue + ' - ' + this._selectedEntity[property.name]
              : this._selectedEntity[property.name];
          }
        }
      }
    }
  }

  /**
   *  Maneja la suscripción al evento (toolbarItemClickedEvent) del componente (@link CrudComponent)
   */
  handleToolbarItemClickedEvent($event) {
    switch ($event.type) {
      case ToolbarItemType.Accept:
        this.selectedEntity = $event.selectedEntities[0];
        this.setTextBoxDisplayValue();
        for (const property of this.properties) {
          this.containerInstance[property.inverse] = this._selectedEntity[property.name];
        }
        this.crudPopupVisible = false;
        break;
      case ToolbarItemType.Cancel:
        this.crudPopupVisible = false;
        break;
      default:
        break;
    }
  }

  /**
   * Transforma el nombre provisto por {@link entityType}
   */
  unDTOEntityType() {
    return this.entityType.slice(0, this.entityType.length - 3);
  }

  handleAddEditPopupSaveButtonClickedEvent() {
    this.crudService.saveEntityAttempt.emit(
      {
        action: AddEditAction.Add,
        componentId: this.entitySearchAddEdit.componentId,
      },
    );
  }

  handleAddEditPopupCancelButtonClickedEvent() {
    this.addEditPopupVisible = false;
  }
}
