import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {DxFormComponent, DxToastComponent} from 'devextreme-angular';
import {Subscription} from 'rxjs';
import * as Collections from 'typescript-collections';
import {Guid} from 'guid-typescript';

import {CustomDialogComponent} from '../custom-dialog/custom-dialog.component';
import {AddEditAction, MessageStyle, MessageType} from '../helpers';
import {BaseEntity} from '../model/base-entity.model';
import {BaseService} from '../services/base.service';
import {CrudService} from '../services/crud.service';
import {DialogService} from '../services/dialog.service';
import {ModelsMapService} from '../services/models-map.service';
import {SettingsService} from '../services/settings.service';

/**
 * Componente que genera elementos visuales para crear y/o editar objetos de la entidad que controla
 *
 * @example
 *
 * <app-add-edit
 *             [entityType]="BaseEntity"
 *             [entityId]="id"
 *             [editable]="false">
 * </app-add-edit>
 */
@Component({
  selector: 'gcl-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss'],
})
export class AddEditComponent implements OnInit, OnDestroy, AfterViewInit {

  /**
   * Identificador del componente que se emplea en contextos donde hay varias instancias del mismo
   */
  componentId: Guid = Guid.create();

  /**
   * Controla todas las suscripciones a Observables
   */
  componentSubscriptions: Subscription[] = [];

  /**
   * Define si los elementos del componente se muestran habilitados
   */
  @Input() editable = true;

  /**
   * Contiene el identificador de la entidad que debe ser cargada en el comppnente
   */
  @Input() entityId: string;

  /**
   * Contiene el tipo o nombre de la entidad que debe ser cargada en el componente
   */
  @Input() entityType: string;

  /**
   * Define si el componente se está mostrando como parte de un {@link CrudComponent}
   */
  @Input() inCrud = true;

  /**
   * Define si los datos que controla el componente son para trabajo local o remoto
   */
  @Input() isLocalData: boolean;

  /**
   * Contiene metadatos de las propiedades de la entidad que controla relacionados con su ubicación
   */
  fieldsLocationMetadata = new Collections.Dictionary<string, Collections.Dictionary<string, string[]>>();

  /**
   * Contiene metadatos de las propiedades de la entidad que controla relacionados con su control visual
   */
  fieldsWidgetMetadata = new Collections.Dictionary<string, any>();

  /**
   * Controla la visibilidad del indicador de procesamiento
   */
  isLoadPanelVisible = false;

  /**
   * Define si el componente está siendo cargado por primera vez
   */
  isFirstLoad = true;

  /**
   * Define la posición del indicador de procesamiento
   */
  loadPanelPosition: any;

  /**
   * Campos requeridos que no han sido llenados
   */
  requiredEmptyFields;

  /**
   * Determina si existen cambios sin salvar en el componente para el control de rutas
   */
  changesSaved = true;

  /**
   * @ignore
   */
  @Output() entityChanged = new EventEmitter<any>();

  /**
   * @ignore
   */
  @Output() entityChange = new EventEmitter<any>();

  /**
   * Contiene la entidad que controla el componente
   */
  _entity: BaseEntity = new BaseEntity(null);

  isLoaded = false;

  @Input() get entity() {

    return this._entity;
  }

  set entity(value: any) {
    this._entity = value;
    this.entityChange.emit(this._entity);
  }

  /**
   * Contiene la instancia de {@link CrudService} que se emplea para controlar la comunicación entre
   * componentes integrantes del {@link CrudComponent}
   */
  private crudService: CrudService;

  /**
   * Contiene una referencia al componente {@link DxToastComponent} empleado
   * para mostrar retroalimentación de operación ejecutada exitosamente
   */
  @ViewChild('successToast') successToast: DxToastComponent;

  /**
   * Contiene una referencia al componente {@link DxFormComponent}
   */
  @ViewChild('addEditForm') addEditForm: DxFormComponent;

  /**
   * @ignore
   */
  @ViewChild('addEditForm', {read: ElementRef}) addEditFormRef: ElementRef;

  /**
   * Contiene una referencia al componente {@link CustomDialogComponent}
   */
  @ViewChild('addEditDialog') addEditDialog: CustomDialogComponent;

  /**
   * Contiene el mensaje a mostrar por el compoente {@link CustomDialogComponent}
   */
  dialogMessage: string;

  /**
   * Contiene el título a mostrar por el compoente {@link CustomDialogComponent}
   */
  dialogTitle: string;

  /**
   * Contiene el tipo del mensaje a mostrar por el compoente {@link CustomDialogComponent}
   */
  dialogStyle: MessageStyle;

  /**
   * Contiene el tipo del mensaje a mostrar por el compoente {@link CustomDialogComponent}
   */
  dialogType: MessageType;

  /**
   * Contiene los parametros a mostrar por el compoente {@link CustomDialogComponent}
   */
  dialogParam: { value: string; };

  /**
   * @ignore
   */
  formWidth: any;

  /**
   * @ignore
   */
  tabsIds: any[] = [];

  /**
   * @ignore
   */
  showTabTooltip = {visible: false, tab: ''};

  constructor(
    injector: Injector,
    private baseService: BaseService,
    private translateService: TranslateService,
    private dialogService: DialogService,
    private modelsMapService: ModelsMapService,
    private settingsService: SettingsService) {
    this.crudService = injector.get(CrudService, CrudService);
    this.loadPanelPosition = this.settingsService.getSettingValue('popupsDefaultPosition');
  }

  /**
   * Inicializa el componente
   */
  ngOnInit() {

    if (!(!this.entityId || this.entityId === null || this.entityId === '') && !this.isLocalData) {
      this.isLoadPanelVisible = true;
    }

    const onLangChangeSubscription = this.translateService.onLangChange.subscribe(() => {
      this.fillFieldsDisplayText();
    });

    this.componentSubscriptions.push(onLangChangeSubscription);

    setTimeout(() => {
      const onFieldDataChangedSubscription = this.addEditForm.onFieldDataChanged.subscribe(
        (value) => {
          this.crudService.entityChangedEvent.emit(this.isLoaded);
          if (this.crudService.shouldEmitEntityChangedEvent) {
            this.entityChanged.emit();
          }
        });

      this.componentSubscriptions.push(onFieldDataChangedSubscription);
    }, 500);

    setTimeout(() => {
      this.formWidth = this.addEditFormRef.nativeElement.offsetWidth;
    }, 1000);

    this.extractEntityMetadata();

    this.fillFieldsDisplayText();

    this.loadData(this.entityId);

    this.handleCrudServiceSubscriptions();

    this.fieldsLocationMetadata.keys().forEach((item) => {
      this.tabsIds[item] = 'a' + Guid.create();
    });
  }

  ngAfterViewInit() {
    this.isFirstLoad = false;
  }

  /**
   * Extrae los metadatos de la entidad que controla y los carga en [fieldsLocationMetadata]{@link AddEditComponent#fieldsLocationMetadata}
   * y [fieldsWidgetMetadata]{@link AddEditComponent#fieldsWidgetMetadata}
   */
  extractEntityMetadata() {
    const dummyEntity = this.modelsMapService.getNewEntityInstance(this.entityType);
    for (const field in dummyEntity) {
      if (dummyEntity.hasOwnProperty(field)) {
        let widgetMetadata: any;
        if (Reflect.hasMetadata('widget', dummyEntity, field)) {
          widgetMetadata = Reflect.getMetadata('widget', dummyEntity, field);
          if (!this.fieldsLocationMetadata.containsKey(widgetMetadata.location.category)) {
            this.fieldsLocationMetadata.setValue(widgetMetadata.location.category, new Collections.Dictionary<string, string[]>());
          }
          if (!this.fieldsLocationMetadata
            .getValue(widgetMetadata.location.category)
            .containsKey(widgetMetadata.location.group !== undefined ? widgetMetadata.location.group : '')) {
            this.fieldsLocationMetadata
              .getValue(widgetMetadata.location.category)
              .setValue(widgetMetadata.location.group !== undefined ? widgetMetadata.location.group : '', [field]);
          } else {
            this.fieldsLocationMetadata
              .getValue(widgetMetadata.location.category)
              .getValue(widgetMetadata.location.group !== undefined ? widgetMetadata.location.group : '')
              .push(field);
          }

          this.fieldsWidgetMetadata.setValue(field, widgetMetadata);

        }
      }
    }

    this.fieldsLocationMetadata.keys().forEach((category) => {
      this.fieldsLocationMetadata.getValue(category).keys().forEach((group) => {
        this.fieldsLocationMetadata.getValue(category).getValue(group).sort((field1, field2) => {
          return this.fieldsWidgetMetadata.getValue(field1).order - this.fieldsWidgetMetadata.getValue(field2).order;
        });
      });
    });
  }

  /**
   * Carga los datos de la entidad que posee el entityId provisto
   */
  loadData(entityId) {
    if (!this.isFirstLoad && !(!entityId || entityId === '') && !this.isLocalData) {
      this.isLoadPanelVisible = true;
    }
    if (entityId && !this.isLocalData) {
      const baseServiceBackup = this.baseService;
      if (this.baseService.servicesMap.containsKey(this.entityType)) {
        this.baseService = this.baseService.servicesMap.getValue(this.entityType);
      }
      const getByIdSubscription = this.baseService.getById(entityId).subscribe((result: BaseEntity) => {
        this.entity = result;
        this.setIsLoaded();
        this.isLoadPanelVisible = false;
      });

      this.componentSubscriptions.push(getByIdSubscription);
      this.baseService = baseServiceBackup;
    }
    if ((!entityId || entityId === null || entityId === '') && !this.isLocalData) {
      const newSubscription = this.baseService.new().subscribe((newEntity) => {
        this.entity = newEntity;
        this.setIsLoaded();
        this.isLoadPanelVisible = false;
      });

      this.componentSubscriptions.push(newSubscription);
    }
    if (this.isLocalData) {
      this.setIsLoaded();
    }
  }

  setIsLoaded() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 1000);
  }

  /**
   * Maneja las subscripciones a los eventos del {@link CrudService}
   */
  handleCrudServiceSubscriptions() {
    const entitySelectedEventSubscription = this.crudService.entitySelectedEvent.subscribe(
      (selectedEntities) => {
        if (this.isLocalData) {
          setTimeout(() => {
            this.isLoaded = true;
          }, 500);
        } else {
          if (selectedEntities[0]) {
            this.loadData(selectedEntities[0].Id);
          }
        }
      });

    this.componentSubscriptions.push(entitySelectedEventSubscription);

    const saveEntityAttemptSubscription = this.crudService.saveEntityAttempt.subscribe(
      (options) => {
        if (options.componentId === this.componentId) {
          const baseServiceBackup = this.baseService;
          if (this.baseService.servicesMap.containsKey(this.entityType)) {
            this.baseService = this.baseService.servicesMap.getValue(this.entityType);
          }
          if (this.validateEntity()) {
            switch (options.action) {
              case AddEditAction.Add:
                this.isLoadPanelVisible = true;
                this.resetEntity(this.entity);
                const addSubscription = this.baseService.add(this.entity).subscribe((guid: string) => {
                    this.isLoadPanelVisible = false;
                    this.successToast.instance.show();
                    this.entity.Id = guid;
                    this.loadData(this.entity.Id);
                    this.changesSaved = true;
                    this.crudService.entitySavedEvent.emit(true);
                    this.crudService.shouldEmitEntityChangedEvent = false;
                    this.resetShouldEmitEntitySavedEventValue();
                  },
                  (error) => {
                    this.isLoadPanelVisible = false;
                    this.dialogMessage = error.error.ExceptionMessage ? error.error.ExceptionMessage : error.error.Message;
                    this.dialogTitle = 'Error';
                    this.dialogType = MessageType.Default;
                    this.dialogStyle = MessageStyle.Error;
                    this.dialogService.open(this.addEditDialog.dialogId);
                    this.crudService.entitySavedEvent.emit(false);
                  });
                this.componentSubscriptions.push(addSubscription);
                break;
              case AddEditAction.Edit:
                this.isLoadPanelVisible = true;
                this.resetEntity(this.entity);
                const updateSubscription = this.baseService.update(this.entity).subscribe(() => {
                    this.isLoadPanelVisible = false;
                    this.successToast.instance.show();
                    this.loadData(this.entity.Id);
                    this.changesSaved = true;
                    this.crudService.entitySavedEvent.emit(true);
                    this.crudService.shouldEmitEntityChangedEvent = false;
                    this.resetShouldEmitEntitySavedEventValue();
                  },
                  (error) => {
                    this.isLoadPanelVisible = false;
                    this.dialogMessage = error.error.ExceptionMessage;
                    this.dialogTitle = 'Error';
                    this.dialogType = MessageType.Default;
                    this.dialogStyle = MessageStyle.Error;
                    this.dialogService.open(this.addEditDialog.dialogId);
                    this.crudService.entitySavedEvent.emit(false);
                  });
                this.componentSubscriptions.push(updateSubscription);
                break;
            }
          } else {
            this.dialogParam = {value: this.requiredEmptyFields};
            this.dialogTitle = 'Error';
            this.dialogType = MessageType.Default;
            this.dialogStyle = MessageStyle.Error;
            this.dialogService.open(this.addEditDialog.dialogId);
          }
          this.baseService = baseServiceBackup;
        }
      });

    this.componentSubscriptions.push(saveEntityAttemptSubscription);
  }

  validateEntity(): boolean {
    let res: boolean;
    let requiredOK = true;
    this.requiredEmptyFields = '';
    this.fieldsWidgetMetadata.keys().forEach((val: string) => {
      if (
        (this.entity[val] === undefined
          || this.entity[val] === null
          || this.entity[val] === '')
        && this.fieldsWidgetMetadata.getValue(val).required !== undefined) {
        this.requiredEmptyFields += '*' + this.fieldsWidgetMetadata.getValue(val).displayText + '  \n';
        res = false;
        requiredOK = false;
        this.dialogMessage = 'SaveRequired';
      }

      if (requiredOK) {
        if (
          (this.entity[val] !== undefined
            || this.entity[val] !== null
            || this.entity[val] !== '')
          && this.fieldsWidgetMetadata.getValue(val).validations !== undefined) {
          for (const rule of this.fieldsWidgetMetadata.getValue(val).validations) {
            const pattern = new RegExp(rule.pattern);
            res = pattern.test(this.entity[val]);
            this.dialogMessage = 'SaveValidations';
          }
        }
      }
    });
    return res;
  }

  fillFieldsDisplayText() {
    const dummyEntity = this.modelsMapService.getNewEntityInstance(this.entityType);
    for (const field in dummyEntity) {
      if (this.fieldsWidgetMetadata.containsKey(field)) {
        let displayText;
        if (this.fieldsWidgetMetadata.getValue(field).displayText) {
          displayText = this.fieldsWidgetMetadata.getValue(field).displayText;
        } else {
          displayText = field;
        }
        const getSubscription = this.translateService.get(displayText).subscribe((translatedText) => {
          this.fieldsWidgetMetadata.getValue(field).displayText = translatedText;
        });

        this.componentSubscriptions.push(getSubscription);
      }
    }
  }

  /**
   * Retorna el nombre que tendrá la plantilla que se empleará para gestionar el valor de campo
   */
  getItemTemplateName(field: string) {
    if (this.fieldsWidgetMetadata.getValue(field).widgetName) {
      return field + 'Template';
    }
    return '';
  }

  getItemColSpan(field) {
    return (this.fieldsWidgetMetadata.getValue(field).widgetName && this.fieldsWidgetMetadata.getValue(field).widgetName === 'detail') ||
    (this.fieldsWidgetMetadata.getValue(field).widgetName && this.fieldsWidgetMetadata.getValue(field).widgetName === 'image') ||
    (this.fieldsWidgetMetadata.getValue(field).widgetName && this.fieldsWidgetMetadata.getValue(field).widgetName === 'entity-extension')
      ? 2 : 1;
  }

  getItemLabel(field): { visible: boolean } {
    return this.fieldsWidgetMetadata.getValue(field).widgetName && this.fieldsWidgetMetadata.getValue(field).widgetName === 'detail'
      ? {visible: false} : {visible: true};
  }

  resetEntity(entity: BaseEntity) {
    if (entity.hasOwnProperty('New') && entity['New']) {
      entity.Id = Guid.create().toString();
    }
    for (const property in entity) {
      if (Array.isArray(entity[property])) {
        entity[property].forEach((element) => {
            if (element instanceof Object) {
              this.resetEntity(element as BaseEntity);
            }
          },
        );
      }
    }
  }

  /**
   * Emite un evento al detectar que un sub-componente posee cambios a la entidad que se maneja
   */
  handleCustomFieldTemplateValueChangedEvent() {
    this.crudService.entityChangedEvent.emit(this.changesSaved);
    this.crudService.entitySavedEvent.emit(false);
    this.entityChanged.emit();
  }

  /**
   * Ejecuta código personalizado al destruir el componente
   */
  ngOnDestroy() {
    this.componentSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  /**
   * Establece de forma programática el ancho del TabPanel
   */
  handleTabPanelContentReadyEvent($event: any) {
    $event.component.option('width', $event.component.option('formWidth') - 38);
    $event.component.option('showNavButtons', true);
  }

  /**
   * Función que activa el tooltip del tab señalado
   * @param tab: nombre de tab
   */
  showDynamicTooltip(tab) {
    this.showTabTooltip.visible = !this.showTabTooltip.visible;
    this.showTabTooltip.tab = tab;
  }

  private resetShouldEmitEntitySavedEventValue() {
    setTimeout(() => {
      this.crudService.shouldEmitEntityChangedEvent = true;
    }, 5000);
  }
}
