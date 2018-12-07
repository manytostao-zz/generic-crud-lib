import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {DxDataGridComponent} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import {Subscription} from 'rxjs';
import 'rxjs';
import {Guid} from 'guid-typescript';

import {ToolbarItemType} from '../helpers';
import {BaseEntity} from '../model/base-entity.model';
import {Filter} from '../model/filter.model';
import {Order} from '../model/order.model';
import {BaseService} from '../services/base.service';
import {CrudService} from '../services/crud.service';
import {ModelsMapService} from '../services/models-map.service';
import {DomainsService} from '../services/domains.service';

/**
 * Componente para listar entidades
 *
 * @example
 *
 * <app-selectable-grid
 *              [keyField]="keyField"
 *              [entitiesList]="entitiesList"
 *              [editable]="editable"
 *              [multipleSelection]="multipleSelection">
 * </app-selectable-grid>
 */
@Component({
  selector: 'gcl-selectable-grid',
  templateUrl: './selectable-grid.component.html',
})
export class SelectableGridComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  /**
   * Define el campo clave del listado para establecer las reglas de selección de filas
   */
  @Input() keyField: string;

  /**
   * Define el tipo de las entidades que manejará el {@link CrudComponent}
   */
  @Input() entityType: string;

  /**
   * Define si el listado será de tipo de selección múltiple
   */
  @Input() multipleSelection = true;

  /**
   * Define el listado de entidades que se mostrará en el componente
   */
  @Input() entitiesList: BaseEntity[] = [];

  /**
   * Define si el listado contendrá celdas editables
   */
  @Input() editable = false;

  /**
   * Define si el listado manejará datos locales o remotos
   */
  @Input() isLocalData = false;

  /**
   * Controla todas las suscripciones a Observables
   */
  componentSubscriptions: Subscription[] = [];

  /**
   * Contiene el arreglo de columnas que serán definidas para el componente dx-data-grid
   */
  columns: any[] = [];

  /**
   * Contiene el arreglo de entidades actualmente seleccionadas en el componente dx-data-grid
   */
  selectedEntities: any[] = [];

  /**
   * Contiene la fuente de datos del componente dx-data-grid
   */
  dataSource: any = {};

  /**
   * Define si será visible el indicador de procesamiento
   */
  loadPanelVisible = false;

  /**
   * @ignore
   */
  filterPanelFilters: Filter[];

  /**
   * @ignore
   */
  pageInfoText = 'Page';

  /**
   * @ignore
   */
  itemsInfoText = 'items';

  /**
   * Contiene una referencia al componente dx-data-grid de DevExpress
   */
  @ViewChild('gridContainer') dataGrid: DxDataGridComponent;

  /**
   * Constructor del componente
   */
  constructor(
    private crudService: CrudService,
    private baseService: BaseService,
    private translateService: TranslateService,
    private modelsMapService: ModelsMapService,
    private domainsService: DomainsService) {
  }

  /**
   * Inicializa el componente
   */
  ngOnInit() {

    if (this.baseService.servicesMap.containsKey(this.entityType)) {
      this.baseService = this.baseService.servicesMap.getValue(this.entityType);
    }

    this.filterPanelFilters = [];

    this.handleCrudServiceSubscriptions();

    this.handleTranslateServiceSubscriptions();

    this.buildDataGridColumns();
  }

  ngOnChanges() {
    this.loadDataSource();
  }

  ngAfterViewInit() {
    this.setColumnsDefaultOrder();
  }

  /**
   * Inicializa o recarga el dataSource asociado al dx-data-grid, en dependencia del modo de trabajo del componente
   */
  loadDataSource() {
    if (!this.isLocalData) {
      this.dataSource = this.buildDataGridCustomStore();
    } else {
      if (!this.entitiesList) {
        this.entitiesList = [];
      }
      this.dataSource = this.entitiesList;
    }
  }

  /**
   * Establece el orden por defecto de las columnas en el dx-data-grid valiéndose de los metadatos de la entidad
   */
  setColumnsDefaultOrder() {
    this.columns.forEach((column, index) => {
      this.dataGrid.instance.columnOption(index, 'visibleIndex', column.order);
    });
  }

  /**
   * Construye un dataSource configurado para el trabajo remoto del componente dx-data-grid
   */
  buildDataGridCustomStore(): DataSource {
    const dataSourceConfiguration = {
      load: (loadOptions: any) => {
        let searchPanelFilters: Filter[];
        let sortingOptions: Order[];
        searchPanelFilters = this.buildSearchPanelFilters(loadOptions.filter);
        sortingOptions = this.buildOrderParameter(loadOptions.sort);
        const filters = this.filterPanelFilters ? this.filterPanelFilters.concat(searchPanelFilters) : searchPanelFilters;
        return this.baseService.getAll(loadOptions.skip, loadOptions.take, filters, sortingOptions).toPromise()
          .then((data: any[]) => {
            return {data};
          })
          .catch((error) => {
            throw new Error('Data loading error: ' + error.toString());
          });
      },
      map: (itemData) => {
        for (const field in itemData) {
          if (itemData.hasOwnProperty(field)) {
            const column = this.columns.find((value) => {
              return value.name === field;
            });

            if (column && column.type === 'domain') {
              const domain = this.domainsService.getDomain(column.options.domainName);
              itemData[field] = domain.find((value) => {
                return value.value === itemData[field];
              }).text;
            }
          }
        }
        return itemData;
      },
      totalCount: (loadOptions: any) => {
        let searchPanelFilters: Filter[];
        searchPanelFilters = this.buildSearchPanelFilters(loadOptions.filter);
        const filters = this.filterPanelFilters ? this.filterPanelFilters.concat(searchPanelFilters) : searchPanelFilters;
        return this.baseService.count(filters).toPromise()
          .then((totalCount: number) => {
            return totalCount;
          })
          .catch((error) => {
            throw new Error('Data loading error: ' + error.toString());
          });
      },
    };
    return new DataSource(dataSourceConfiguration);
  }

  /**
   * Construye los valores de filtrado que necesita el servidor a partir de las opciones del dx-data-grid
   */
  buildSearchPanelFilters(rawSearchPanelFilters): Filter[] {
    const filterOptions: Filter[] = [];
    if (rawSearchPanelFilters) {
      let operator: string;
      for (let i = 0; i < rawSearchPanelFilters.length; i++) {
        if (i % 2 === 0) {
          const field = rawSearchPanelFilters[i][0];
          const value = rawSearchPanelFilters[i][2];
          if (rawSearchPanelFilters[i + 1]) {
            operator = rawSearchPanelFilters[i + 1];
          }
          if (this.isFieldFilterable(field)) {
            filterOptions.push(new Filter(field, value, null, operator, 'Contains'));
          }
        }
      }
    }
    return filterOptions;
  }

  /**
   * Construye los valores de ordenamiento que necesita el servidor a partir de las opciones del dx-data-grid
   */
  buildOrderParameter(rawSortingOptions: any): Order[] {
    const sortingOptions: Order[] = [];
    if (rawSortingOptions) {
      for (const rawSortingOption of rawSortingOptions) {
        if (this.isFieldSortable(rawSortingOption.selector)) {
          sortingOptions.push(new Order(!rawSortingOption.desc, rawSortingOption.selector));
        }
      }
    }
    return sortingOptions;
  }

  /**
   * Determina si un campo de la entidad es filtrable a partir de sus metadatos
   */
  isFieldFilterable(field: string) {
    const dummyEntity = this.modelsMapService.getNewEntityInstance(this.entityType);
    return Reflect.hasMetadata('filterable', dummyEntity, field)
      && Reflect.getMetadata('filterable', dummyEntity, field).dataType === 'string';
  }

  /**
   * Determina si un campo de la entidad es ordenable a partir de sus metadatos
   */
  isFieldSortable(field: string) {
    const dummyEntity = this.modelsMapService.getNewEntityInstance(this.entityType);
    return Reflect.hasMetadata('listable', dummyEntity, field)
      && Reflect.getMetadata('listable', dummyEntity, field).sortable;
  }

  /**
   * Construye las columnas del dx-data-grid en dependencia de los metadatos de la entidad que listará
   */
  buildDataGridColumns() {
    const entity = this.modelsMapService.getNewEntityInstance(this.entityType);
    for (const propertyKey in entity) {
      if (entity.hasOwnProperty(propertyKey)) {
        if (Reflect.hasMetadata('listable', entity, propertyKey)) {
          const listableMetadata = Reflect.getMetadata('listable', entity, propertyKey);
          if (listableMetadata.value) {
            let typeName = typeof entity[propertyKey];
            if (typeName === 'object') {
              typeName = entity[propertyKey].constructor.name;
            }
            if (typeName === 'undefined') {
              typeName = listableMetadata.fieldType;
            }
            const column = {name: propertyKey, type: typeName};
            column['order'] = listableMetadata.order;
            column['visible'] = listableMetadata.visible;
            column['editable'] = listableMetadata.editable;
            column['options'] = listableMetadata.options;
            column['sortable'] = listableMetadata.sortable ? listableMetadata.sortable : false;
            this.columns.push(column);
          }
        }
        if (Reflect.getMetadata('key', entity, propertyKey)) {
          this.keyField = propertyKey;
        }
      }
    }
    console.log(this.keyField);
  }

  /**
   * Maneja la subscripción a los eventos del {@link CrudService}
   */
  handleCrudServiceSubscriptions() {
    if (this.isLocalData) {
      const toolbarItemClickedEventSubscription = this.crudService.toolbarItemClickedEvent.subscribe(($event) => {
        switch ($event.itemData.type) {
          case ToolbarItemType.Add:
            this.loadPanelVisible = true;
            const newSubscription = this.baseService.new().subscribe((newEntity) => {
              newEntity.Id = Guid.create();
              newEntity.New = true;
              this.entitiesList.push(newEntity);
              this.dataSource = this.entitiesList;
              this.dataGrid.instance.refresh();
              setTimeout(() => {
                if (!this.dataGrid.instance.isRowSelected(newEntity.Id)) {
                  this.dataGrid.instance.selectRows([newEntity.Id], false);
                }
                this.loadPanelVisible = false;
              }, 500);
            });
            this.componentSubscriptions.push(newSubscription);
            break;

          case ToolbarItemType.Remove:
            const selectedRowsData = this.dataGrid.instance.getSelectedRowsData();
            for (const selectedRowData of selectedRowsData) {
              this.entitiesList.some((value: BaseEntity, index: number, array: BaseEntity[]) => {
                if (value.Id === selectedRowData.Id) {
                  array.splice(index, 1);
                  this.crudService.entityChangedEvent.emit(true);
                  return true;
                }
                return false;
              });
            }
            if (this.entitiesList.length > 0) {
              this.dataGrid.instance.selectRows([this.entitiesList[0].Id], false);
            }
            break;
        }
      });

      this.componentSubscriptions.push(toolbarItemClickedEventSubscription);
    }

    const reloadDataGridAttemptSubscription = this.crudService.reloadDataGridAttempt.subscribe((filterPanelFilters: Filter[]) => {
      this.filterPanelFilters = filterPanelFilters;
      this.loadDataSource();
    });

    this.componentSubscriptions.push(reloadDataGridAttemptSubscription);
  }

  /**
   * Maneja la subscripción a los eventos del {@link CrudService}
   */
  handleTranslateServiceSubscriptions() {
    const getSubscription = this.translateService.get(['Page', 'items']).subscribe((translatedText) => {
      this.pageInfoText = translatedText['Page'];
      this.itemsInfoText = translatedText['items'];
    });

    this.componentSubscriptions.push(getSubscription);

    const onLangChangeSubscription = this.translateService.onLangChange.subscribe(() => {
      this.pageInfoText = this.translateService.instant('Page');
      this.itemsInfoText = this.translateService.instant('items');
    });

    this.componentSubscriptions.push(onLangChangeSubscription);
  }

  /**
   * Maneja la subscripción al evento selectionChanged del dx-data-grid
   */
  handleSelectionChangedEvent(e) {
    this.selectedEntities = e.selectedRowsData;
    this.crudService.entitySelectedEvent.emit(this.selectedEntities);
  }

  /**
   * Maneja la subscripción al evento contentReady del dx-data-grid
   */
  handleContentReadyEvent(e) {
    if (this.isLocalData) {
      if (!e.component.getSelectedRowKeys().length) {
        e.component.selectRowsByIndexes(0);
      }
    } else {
      e.component.selectRowsByIndexes(0);
    }
  }

  /**
   * Retorna el tamaño de una columna basado en el tipo de dato que maneja
   */
  getColumnWidth(type: string) {
    switch (type) {
      case 'string':
        return 400;
      case 'Date':
        return 200;
      case 'boolean':
        return 100;
    }
  }

  ngOnDestroy() {
    this.componentSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
