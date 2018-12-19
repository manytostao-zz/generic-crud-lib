import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {DxLookupComponent} from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';

import {Subscription} from 'rxjs';
import {BaseEntity} from '../model/base-entity.model';
import {Filter} from '../model/filter.model';
import {BaseService} from '../services/base.service';
import {CrudService} from '../services/crud.service';

@Component({
  selector: 'gcl-entity-lookup',
  templateUrl: './entity-lookup.component.html',
  styleUrls: ['./entity-lookup.component.scss'],
})
export class EntityLookupComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * Controla todas las suscripciones a Observables
   */
  componentSubscriptions: Subscription[] = [];
  /**
   * Define el tipo de las entidades que manejará el {@link CrudComponent}
   */
  @Input() entityType: string;
  /**
   * Define si el control visual se mostrará deshabilitado
   */
  @Input() disabled: boolean;
  /**
   * Indica si se muestra el tooltips (información) de la herramienta en el botón.
   */
  @Input() displayText: string;
  /**
   * Define las propiedades de la entidad que requiere se muestren en input del {@link EntitySearchComponent}
   */
  @Input() properties: Array<{ name: string, inverse: string, show: boolean }> = [];
  /**
   * Define el datasource que recibe el lookup
   */
  dataSourcelookup: any = [];

  /**
   * Contiene el identificador de la entidad seleccionada
   */
  @Input() containerInstance: BaseEntity;
  /**
   * Contiene la entidad seleccionada en el componente {@link CrudComponent} que maneja el {@link EntitySearchComponent}
   */
  private _selectedEntity: BaseEntity;
  /**
   * Evento que se lanza cuando cambia el valor de la propiedad selectedEntity
   */
  @Output() selectedEntityChanged = new EventEmitter<BaseEntity>();
  /**
   * Evento que se lanza cuando cambia el valor de la propiedad selectedEntity
   */
  @Output() selectedEntityChange = new EventEmitter<BaseEntity>();
  /**
   * Contiene el valor a mostrar en el campo de texto
   */
  filterValue: any = [];

  /**
   * Define el comportamiento del componente {@link CrudComponent}
   */
  @Input() isLocalData = false;

  private _options: any;

  /**
   * @ignore
   */
  @Input() get selectedEntity() {

    return this._selectedEntity;
  }

  /**
   * @ignore
   */
  set selectedEntity(value: any) {
    if (value.Id !== undefined) {
      this._selectedEntity = value;
    } else {
      this._selectedEntity.Id = value;
    }
    this.selectedEntityChange.emit(this._selectedEntity);
  }

  /**
   *  Referencia al elemento input de la vista
   */
  @ViewChild('EntityLookup') Lookup: DxLookupComponent;
  /**
   * Textos a traducir
   */
  public textTranslate = ['Close', 'placeholder', 'searchPlaceholder', 'noDataText', 'pullingDownText', 'Languages'];
  /**
   * Nombre de la entidad componente
   */
  public displayTextComponent: string;
  /**
   * Texto a mostrar en el componente EntityLookup
   */
  public textComponent: any = {
    Close: null,
    placeholder: null,
    searchPlaceholder: null,
    refreshingText: null,
    noDataText: null,
    pullingDownText: null,
    Languages: null,
  };

  constructor(private crudService: CrudService,
              private baseService: BaseService,
              private translate: TranslateService) {
    this.selectedEntity = new BaseEntity(null);
  }

  ngOnInit() {
    if (this.baseService.servicesMap.containsKey(this.entityType)) {
      this.baseService = this.baseService.servicesMap.getValue(this.entityType);
    }
    this.Lookup._setOption('displayProperties', this.properties);
    if (this.properties && this.containerInstance) {
      for (const property of this.properties) {
        if (property.show) {
          this.filterValue.push(property.name);
        }
      }
      this.selectedEntity.Id = this.containerInstance[this.properties[0].inverse];
    }
  }

  buildDataGridCustomStore(): CustomStore {
    const dataSourceConfiguration = {
      load: (loadOptions: any) => {
        const searchPanelFilters: Filter[] = [];
        this.buildSearchPanelFilters(searchPanelFilters, loadOptions);
        return this.baseService.getAll(loadOptions.skip, loadOptions.take, searchPanelFilters).toPromise()
          .then((response: any[]) => {
            return {data: response};
          })
          .catch((error) => {
            throw new Error('Data loading error: ' + error.toString());
          });
      },
      byKey(key) {
        return key;
      },
    };
    return new CustomStore(dataSourceConfiguration);
  }

  buildSearchPanelFilters(searchPanelFilters: Filter[], loadOptions) {
    if (loadOptions.searchExpr) {
      for (const searchExpr of loadOptions.searchExpr) {
        const filter = new Filter(
          searchExpr,
          loadOptions.searchValue,
          null,
          'Or',
          loadOptions.searchOperation,
        );
        searchPanelFilters.push(filter);
      }
    }
  }

  ngOnChanges() {
    this._selectedEntity = new BaseEntity(null);
    this.displayValueSelectOnTable();

    const dummyObject: any = {};
    for (const property of this.properties) {
      dummyObject[property.name] = this.containerInstance[property.inverse];
    }
    this.dataSourcelookup = [dummyObject];
  }

  onValueChangedLookup(e: any) {
    let selectedEntityChanged = false;
    const selectedItem = e.component.option('selectedItem');
    if (this._selectedEntity.Id !== selectedItem.Id) {
      selectedEntityChanged = true;
    }
    this._selectedEntity = selectedItem;
    for (const property of this.properties) {
      this.containerInstance[property.inverse] = this._selectedEntity[property.name];
    }

    if (selectedEntityChanged) {
      this.selectedEntityChanged.emit();
    }
  }

  getDisplayExpr(item) {
    let displayValue = [];
    if (!item) {
      return '';
    }
    const displayProperties: any[] = this._options.displayProperties;
    for (const property of displayProperties) {
      if (property.show) {
        if (displayValue.length > 0) {
          this.displayText = displayValue + ' - ' + item[property.name];
        } else {
          displayValue = item[property.name] ? item[property.name] : '';
        }
      }

    }
    return this.displayText;
  }

  displayValueSelectOnTable() {
    this._selectedEntity.Id = this.containerInstance[this.properties[0].inverse];
  }

  handleLookupOpenedEvent($event: any) {
    this.translateComponentText();
    this.dataSourcelookup = this.buildDataGridCustomStore();
  }

  translateComponentText() {
    const getSubscription1 = this.translate.get(this.textTranslate).subscribe((res: string) => {
      this.textComponent = res;
    });

    this.componentSubscriptions.push(getSubscription1);

    const getSubscription2 = this.translate.get(this.displayText).subscribe((textEntity: string) => {
      this.displayTextComponent = textEntity;
    });

    this.componentSubscriptions.push(getSubscription2);
  }

  ngOnDestroy() {
    this.componentSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
