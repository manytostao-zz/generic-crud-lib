import {AfterViewInit, Component, Injector, Input, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {DxTreeListComponent} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import {Subscription} from 'rxjs';
import {Guid} from 'guid-typescript';

import {BaseEntity} from '../model/base-entity.model';
import {Filter} from '../model/filter.model';
import {Order} from '../model/order.model';
import {BaseService} from '../services/base.service';
import {CrudService} from '../services/crud.service';
import {IsTreeInterface} from '../interfaces/is-tree.interface';
import {DomainsService} from '../services/domains.service';
import {ModelsMapService} from '../services/models-map.service';

/**
 * Componente para listar entidades en forma de árbol
 *
 * @example
 *
 */
@Component({
  selector: 'gcl-selectable-tree',
  templateUrl: './selectable-tree.component.html',
  styleUrls: ['./selectable-tree.component.scss'],
})
export class SelectableTreeComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  selectedParentId: string = undefined;
  /**
   * Define el campo clave del listado para establecer las reglas de selección de filas
   */
  @Input() keyField = 'Id';
  /**
   * Define el tipo de las entidades que manejará el {@link CrudComponent}
   */
  @Input() entityType: string;
  /**
   * Define si el listado será de tipo de selección múltiple
   */
  @Input() multipleSelection = false;
  /**
   * Define el listado de entidades que se mostrará en el componente
   */
  @Input() entitiesListTree: BaseEntity[] = [];
  /**
   * Define si el listado manejará datos locales o remotos
   */
  @Input() isLocalData = false;
  /**
   * Controla todas las suscripciones a Observables
   */
  componentSubscriptions: Subscription[] = [];
  /**
   * Contiene el arreglo de columnas que serán definidas para el componente dx-tree-list
   */
  columns: any[] = [];
  /**
   * Contiene el arreglo de entidades actualmente seleccionadas en el componente dx-tree-list
   */
  selectedEntities: any[] = [];
  /**
   * Contiene la fuente de datos del componente dx-tree-list
   */
  dataTreeSource: any = {};
  // entityType = 'creditor-debtor';
  /**
   * Constructor del componente
   */
  filterPanelFilters: Filter[];

  isTreeInterface: IsTreeInterface;

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
  @ViewChild('TreeContainer') TreeGrid: DxTreeListComponent;

  /**
   * Constructor del componente
   */
  constructor(
    private injector: Injector,
    private crudService: CrudService,
    private baseService: BaseService,
    private translateService: TranslateService,
    private domainsService: DomainsService,
    private modelsMapService:ModelsMapService) {

  }

  /**
   * Construye el listado por cada cambio detectado en las propiedades del componente
   */
  ngOnChanges() {
    this.loadDataSource();
  }

  ngOnInit() {
    if (this.baseService.servicesMap.containsKey(this.entityType)) {
      this.baseService = this.baseService.servicesMap.getValue(this.entityType);
    }

    this.isTreeInterface = this.injector.get('IIsTreeInterface', this.baseService);

    this.filterPanelFilters = [];

    this.handleCrudServiceSubscriptions();

    this.handleTranslateServiceSubscriptions();

    this.handleCrudServiceSubscriptions();

    this.buildTreeColumns();
  }

  ngAfterViewInit() {
    this.setColumnsDefaultOrder();
  }

  loadDataSource() {
    if (!this.isLocalData) {
      this.dataTreeSource = this.buildDataTreeCustomStore();
    } else {
      this.dataTreeSource = this.entitiesListTree !== null ? this.entitiesListTree : [];
    }
  }

  /**
   * Establece el orden por defecto de las columnas en el dx-data-grid valiéndose de los metadatos de la entidad
   */
  setColumnsDefaultOrder() {
    this.columns.forEach((column, index) => {
      this.TreeGrid.instance.columnOption(index, 'visibleIndex', column.order);
    });
  }

  buildDataTreeCustomStore(): DataSource {
    const dataSourceConfiguration = {
      load: (loadOptions: any) => {
        let searchPanelFilters: Filter[];
        let sortingOptions: Order[];
        searchPanelFilters = this.buildSearchPanelFilters(loadOptions.filter);
        sortingOptions = this.buildOrderParameter(loadOptions.sort);
        const filters = this.filterPanelFilters ? this.filterPanelFilters.concat(searchPanelFilters) : searchPanelFilters;
        let idParent =
          loadOptions.parentIds !== undefined ? loadOptions.parentIds[0] !== 0
            ? loadOptions.parentIds[0] : loadOptions.parentIds[1] : undefined;
        idParent = idParent ? idParent : this.selectedParentId;
        return this.isTreeInterface.getByParent(idParent, filters, sortingOptions)
          .toPromise()
          .then((response: any[]) => {
            const data = response;
            data.forEach((item) => {
              if (item.ParentId === '00000000-0000-0000-0000-000000000000') {
                item.ParentId = null;
              }
            });
            return {data};
          })
          .catch((error) => {
            throw new Error('Data loading error: ' + error.toString());
          });
      },
      map: (itemData) => {
        itemData.hasChildren = !itemData.data.IsLeaf;
        for (const field in itemData.data) {
          if (itemData.data.hasOwnProperty(field)) {
            const column = this.columns.find((value) => {
              return value.name === field;
            });

            if (column && column.type === 'domain') {
              const domain = this.domainsService.getDomain(column.options.domainName);
              itemData.data[field] = domain.find((value) => {
                if (value.value === itemData.data[field]) {
                  return value.value === itemData.data[field];
                } else {
                  return value.text === itemData.data[field];
                }
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

  buildSearchPanelFilters(rawSearchPanelFilters): Filter[] {
    const filterOptions: Filter[] = [];

    if (rawSearchPanelFilters) {
      let operator: string;
      if (Array.isArray(rawSearchPanelFilters[0])) {
        for (let i = 0; i < rawSearchPanelFilters.length; i++) {
          if (i % 2 === 0) {
            const field = rawSearchPanelFilters[i][0];
            const value = rawSearchPanelFilters[i][2];
            if (field === 'ParentId') {
              continue;
            }
            if (rawSearchPanelFilters[i + 1]) {
              operator = rawSearchPanelFilters[i + 1];
            }
            if (this.isFieldFilterable(field)) {
              filterOptions.push(new Filter(field, value, null, operator, 'Contains'));
            }
          }
        }
      } else {
        if (rawSearchPanelFilters[0] !== 'ParentId') {
          filterOptions.push(new Filter(rawSearchPanelFilters[0], rawSearchPanelFilters[2], null, rawSearchPanelFilters[1], 'Contains'));
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

  buildTreeColumns() {
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
  }

  private handleCrudServiceSubscriptions() {
    if (this.isLocalData) {
      this.crudService.toolbarItemClickedEvent.subscribe(($event) => {
        if ($event.itemData.type === 'add') {
          const newEntity = this.modelsMapService.getNewEntityInstance(this.entityType);
          // TODO: llamar a un servicio que me retorne un GUID válido
          newEntity.id = Guid.create();
          this.entitiesListTree.push(newEntity);
          this.dataTreeSource = this.entitiesListTree;
          this.TreeGrid.instance.refresh();
          setTimeout(() => {
            if (!this.TreeGrid.instance.isRowSelected(newEntity.id)) {
              this.TreeGrid.instance.selectRows([newEntity.id], false);
            }
          }, 500);
        }
      });
    }

    this.crudService.reloadDataGridAttempt.subscribe((filterPanelFilters: Filter[]) => {
      this.filterPanelFilters = filterPanelFilters;
      this.loadDataSource();
    });
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

  handleSelectionChangedEvent(e) {
    this.selectedEntities = e.selectedRowsData;
    this.crudService.entitySelectedEvent.emit(this.selectedEntities);
  }

  handleContentReadyEvent(e) {
    if (this.isLocalData) {
      if (!e.component.getSelectedRowKeys().length) {
        e.component.selectRowsByIndexes(0);
      }
    } else {
      e.component.selectRowsByIndexes(0);
    }
  }

  getColumnWidth(type: string) {
    switch (type) {
      case 'string':
        return 120;
      case 'Date':
        return 200;
    }
  }

  ngOnDestroy() {
    this.componentSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  handleRowExpandingEvent($event: any) {
    this.selectedParentId = $event.key;
  }

  handleRowExpandedEvent($event: any) {
    this.selectedParentId = undefined;
  }
}
