import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import * as Collections from 'typescript-collections';

import {DxToastComponent} from 'devextreme-angular';
import {Subscription} from 'rxjs';
import {CustomDialogComponent} from '../custom-dialog/custom-dialog.component';
import {FilterPanelComponent} from '../filter-panel/filter-panel.component';
import {MessageResult, MessageStyle, MessageType, ToolbarItemType} from '../helpers';
import {BaseEntity} from '../model/base-entity.model';
import {BaseService} from '../services/base.service';
import {CrudService} from '../services/crud.service';
import {DialogService} from '../services/dialog.service';
import {ModelsMapService} from '../services/models-map.service';

/**
 * Componente que genera elementos visuales para listar, crear, actualizar y eliminar entidades
 *
 * @example
 *
 * <app-crud
 *             [entityType]="entityType"
 *             [entitiesList]="entitiesList"
 *             [multipleSelection]="false"
 *             [toolbarItems]="toolbarItems"
 *             [showToolbarDefaultButtons]="true"
 *             toolbarCssClass="navbar navbar-expand-lg navbar-light bg-light">
 * </app-crud>
 */
@Component({
  selector: 'gcl-crud',
  templateUrl: './crud.component.html',
  providers: [CrudService],
})
export class CrudComponent implements OnInit, OnDestroy {

  /**
   * Define el campo clave para ser utilizado por el componente {@link SelectableGridComponent}
   */
  @Input() keyField: string;

  /**
   * Define el tipo de las entidades que manejará el {@link CrudComponent}
   */
  @Input() entityType: string;

  /**
   * Define si el dx-grid del componente {@link SelectableGridComponent} será de múltiple selección
   */
  @Input() multipleSelection = true;

  /**
   * Define si serán mostrados los botones por defecto del componente {@link ToolbarComponent}
   */
  @Input() showToolbarDefaultButtons = true;

  /**
   * Define si será mostrado el botón *Aceptar* en el componente {@link ToolbarComponent}
   */
  @Input() showToolbarAcceptButton = false;

  /**
   * Define si será mostrado el botón *Cancelar* en el componente {@link ToolbarComponent}
   */
  @Input() showToolbarCancelButton = false;

  /**
   * Define si será mostrado el botón *Adicionar* en el componente {@link ToolbarComponent}
   */
  @Input() showToolbarAddButton = true;

  /**
   * Define si será mostrado el botón *Editar* en el componente {@link ToolbarComponent}
   */
  @Input() showToolbarEditButton = true;

  /**
   * Define si será mostrado el botón *Eliminar* en el componente {@link ToolbarComponent}
   */
  @Input() showToolbarRemoveButton = true;

  /**
   * Define si será mostrado el botón *Esconder Detalle* en el componente {@link ToolbarComponent}
   */
  @Input() showToolbarHideDetailButton = true;

  /**
   * Define si será mostrado el botón *Esconder Panel de Filtros* en el componente {@link ToolbarComponent}
   */
  @Input() showToolbarHideFilterPanelButton = false;

  /**
   * Define las clases CSS a utilizar por el componente {@link ToolbarComponent}
   */
  @Input() toolbarCssClass: string;

  /**
   * Define los elementos (botones, etc.) que contendrá el componente {@link ToolbarComponent}
   */
  @Input() toolbarItems: any[] = [];

  /**
   * Define el comportamiento del componente {@link CrudComponent}
   */
  @Input() isLocalData = false;

  /**
   * Define si el componente {@link SelectableGridComponent} será editable
   */
  @Input() editable = true;

  /**
   * Define si se mostrará el componente {@link AddEditComponent}
   */
  @Input() showAddEdit = false;

  /**
   * Define si se mostrará el componente {@link FilterPanelComponent}
   */
  @Input() showFilterPanel = false;

  /**
   * Verifica si la entidad es jerárquica y controla si se muestra el árbol o la tabla de la entidad.
   */
  @Input() isTree = false;

  /**
   * Evento lanzado cuando se interactúa con los elementos del {@link ToolbarComponent}
   */
  @Output() onToolbarItemClicked = new EventEmitter<{ type: string, selectedEntities: BaseEntity[] }>();

  /**
   * Evento lanzado cuando se seleccionan entidades en el componente {@link SelectableGridComponent}
   */
  @Output() onSelectEntities = new EventEmitter<BaseEntity[]>();

  @Output() entityChanged = new EventEmitter<any>();

  @ViewChild('confirmationDialog') confirmationDialog: CustomDialogComponent;

  @ViewChild('errorDialog') errorDialog: CustomDialogComponent;

  /**
   * Contiene una referencia al componente {@link DxToastComponent} empleado
   * para mostrar retroalimentación de operación ejecutada exitosamente
   */
  @ViewChild('successToast') successToast: DxToastComponent;

  /**
   * Controla todas las suscripciones a Observables
   */
  componentSubscriptions: Subscription[] = [];

  /**
   * Contiene el listado de entidades seleccionadas en el componente {@link SelectableGridComponent}
   */
  selectedEntities: BaseEntity[];

  /**
   * Controla la visibilidad del panel indicador de procesamiento"
   */
  loadPanelVisible = false;

  /**
   * Contiene la entidad mostrada en el componente {@link AddEditComponent}
   */
  addEditEntity: BaseEntity;

  /**
   * Define si el componente {@link AddEditComponent} será editable
   */
  addEditEditable = false;

  /**
   * Controla el mensaje a mostrar en el diálogo de confirmación
   */
  confirmationDialogMessage = 'Are you sure you want to remove this element?';

  /**
   * Controla el mensaje a mostrar en el diálogo de error
   */
  errorDialogMessage = '';

  /**
   * @ignore
   */
  messageStyles = MessageStyle;

  /**
   * @ignore
   */
  messageTypes = MessageType;

  /**
   * Evento que se lanza cuando cambio el valor de la propiedad entitiesList
   */
  @Output() entitiesListChange = new EventEmitter<any>();

  /**
   * Contiene el listado de las entidades que se van a mostrar en el grid.
   */
  private _entitiesList = new Collections.LinkedList<BaseEntity>();

  /**
   *
   * @ignore
   */
  @Input() get entitiesList() {

    return this._entitiesList;
  }

  /**
   *
   * @ignore
   */
  set entitiesList(value: any) {
    this._entitiesList = value;
    this.entitiesListChange.emit(this._entitiesList);
  }

  constructor(
    private crudService: CrudService,
    private baseService: BaseService,
    private modelsMapService: ModelsMapService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService) {
    this.selectedEntities = [];
  }

  /**
   * Inicializa el componente
   */
  ngOnInit() {

    this.handleCrudServiceSubscriptions();

    this.handleDialogEventSubscription();

    const entityInstance = this.modelsMapService.getNewEntityInstance(this.entityType);
    if (entityInstance.hasOwnProperty('ParentId')) {
      this.isTree = true;
    }
    this.showToolbarHideFilterPanelButton = true;

    if (this.isLocalData) {
      this.showAddEdit = this.selectedEntities.length > 0;
      this.addEditEditable = true;
      this.showToolbarEditButton = false;
      this.showToolbarHideFilterPanelButton = false;
    }

    console.log(this.showToolbarDefaultButtons);
  }

  /**
   * Maneja la suscripción a los eventos que controla el {@link CrudService}
   */
  private handleCrudServiceSubscriptions() {

    const toolbarItemClickedEventSubscription = this.crudService.toolbarItemClickedEvent.subscribe(($event) => {
      switch ($event.itemData.type) {
        case ToolbarItemType.Add:
          if (!this.isLocalData) {
            this.router.navigate(['../add'], {relativeTo: this.route});
          }
          break;

        case ToolbarItemType.Edit:
          if (!this.isLocalData) {
            this.router.navigate(['../edit/' + this.selectedEntities[0].Id], {relativeTo: this.route});
          }
          break;

        case ToolbarItemType.Info:
          this.addEditEditable = this.isLocalData;
          this.showAddEdit = !this.showAddEdit;
          this.addEditEntity = this.selectedEntities[0];
          this.onToolbarItemClicked.emit({type: $event.itemData.type, selectedEntities: this.selectedEntities});
          break;

        case ToolbarItemType.Filter:
          this.showFilterPanel = !this.showFilterPanel;
          this.onToolbarItemClicked.emit({type: $event.itemData.type, selectedEntities: this.selectedEntities});
          break;

        case ToolbarItemType.Remove:
          if (!this.isLocalData) {
            this.dialogService.open(this.confirmationDialog.dialogId);
          }
          break;

        default:
          this.onToolbarItemClicked.emit({type: $event.itemData.type, selectedEntities: this.selectedEntities});
          break;
      }
    });

    this.componentSubscriptions.push(toolbarItemClickedEventSubscription);

    const entitySelectedEventSubscription = this.crudService.entitySelectedEvent.subscribe(
      (selectedEntities: BaseEntity[]) => {
        this.selectedEntities = selectedEntities;
        this.onSelectEntities.emit(this.selectedEntities);
        if (this.selectedEntities.length > 1 || this.selectedEntities.length === 0) {
          this.showAddEdit = false;
        } else {
          if (this.isLocalData) {
            this.addEditEntity = this.selectedEntities[0];
            this.showAddEdit = true;
          }
        }
      });

    this.componentSubscriptions.push(entitySelectedEventSubscription);

    const entityChangedEvent = this.crudService.entityChangedEvent.subscribe(
      (entityChanged: boolean) => {
        this.entityChanged.emit(entityChanged);
      },
    );

    this.componentSubscriptions.push(entityChangedEvent);
  }

  private handleDialogEventSubscription() {
    const messageResultEventSubscription = this.confirmationDialog.messageResultEvent.subscribe((messageResult: MessageResult) => {
      if (messageResult === MessageResult.Accept) {
        this.loadPanelVisible = true;
        this.baseService.remove(this.selectedEntities[0].Id).subscribe(() => {
          this.loadPanelVisible = false;
          this.successToast.instance.show();
          this.crudService.reloadDataGridAttempt.emit(null);
        }, (error) => {
          this.loadPanelVisible = false;
          this.errorDialogMessage = error.error.ExceptionMessage ? error.error.ExceptionMessage : error.error.Message;
          this.dialogService.open(this.errorDialog.dialogId);
        });
      }
    });

    this.componentSubscriptions.push(messageResultEventSubscription);
  }

  ngOnDestroy() {
    this.componentSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
