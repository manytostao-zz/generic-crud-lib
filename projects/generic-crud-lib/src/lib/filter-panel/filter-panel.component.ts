import {Component, Input, OnInit} from '@angular/core';

import CustomStore from 'devextreme/data/custom_store';

import {BaseEntity} from '../model/base-entity.model';
import {Filter} from '../model/filter.model';
import {BaseService} from '../services/base.service';
import {CrudService} from '../services/crud.service';
import {ModelsMapService} from '../services/models-map.service';

@Component({
  selector: 'gcl-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
})
export class FilterPanelComponent implements OnInit {

  /**
   *  Define el nombre de la entidad.
   */
  @Input() entityName: string;

  /**
   *  obtiene que se selecciono en el combo
   */
  @Input() itemSelected;

  /**
   *  Define la entidad.
   */
  filterInstance: any;

  /**
   *  Define un arreglo que contiene los valores que ayudan a armar los filtros.
   */
  filters: Array<{ fieldName: string, value: any, value2: any, operator: string }>;

  /**
   *  Define un arreglo de informacion compuesto por el nombre del atributo, el tipo de dato
   *  y el nombre del campo, si es visible y si el combo esta seleccionado como between.
   */
  fieldsFilterMetadata: Array<{
    name: string, dataType: string, fieldName: string,
    visible: boolean, between: boolean, opDataType: string, opFilterableFields: any,
  }> = [];

  /**
   *  Define un arreglo de informacion de campos visibles compuesto por el nombre del atributo, el tipo de dato y
   *  el nombre del campo, si es visible y si el combo esta seleccionado como between.
   */
  fieldsVisibles: Array<{
    name: string, dataType: string, fieldName: string,
    visible: boolean, between: boolean, opDataType: string, opFilterableFields: any,
  }>
    = this.fieldsFilterMetadata;

  /**
   *  Define un arreglo de informacion de campos visibles compuesto por el nombre del atributo, el tipo de dato y
   *  el nombre del campo, si es visible y si el combo esta seleccionado como between.
   *  esta separado asi para mostrarlo en dos columnas
   */
  fieldVisiblesCol2: Array<{
    name: string, dataType: string, fieldName: string,
    visible: boolean, between: boolean, opDataType: string, opFilterableFields: any,
  }> = [];

  /**
   *  Define un arreglo de informacion de campos visibles compuesto por el nombre del atributo, el tipo de dato y
   *  el nombre del campo, si es visible y si el combo esta seleccionado como between.
   *  esta separado asi para mostrarlo en dos columnas
   */
  fieldVisiblesCol1: Array<{
    name: string, dataType: string, fieldName: string,
    visible: boolean, between: boolean, opDataType: string, opFilterableFields: any,
  }> = [];

  /**
   *  Define un arreglo de operadores para el filtrado de los tipos de datos strings.
   */
  filterStringAttributes: any =
    [
      {ID: '=', Name: 'Equal'},
      {ID: '<>', Name: 'NotEqual'},
      {ID: 'contains', Name: 'Contains'},
      {ID: 'notcontains', Name: 'NotContains'},
      {ID: 'startswith', Name: 'StartsWith'},
      {ID: 'endswith', Name: 'EndsWith'},
    ];

  /**
   *  Define un arreglo de operadores para el filtrado de los tipos de datos date.
   */
  filterDateAttributes: any =
    [
      {ID: '=', Name: 'Equal'},
      {ID: '<>', Name: 'NotEqual'},
      {ID: '<', Name: 'LessThan'},
      {ID: '<=', Name: 'LessThanOrEqual'},
      {ID: '>', Name: 'GreaterThan'},
      {ID: '>=', Name: 'GreaterThanOrEqual'},
      {ID: 'between', Name: 'Between'},
    ];

  /**
   *  Define un arreglo de operadores para el filtrado de los tipos de datos number.
   */
  filterNumberAttributes: any =
    [
      {ID: '=', Name: 'Equal'},
      {ID: '<>', Name: 'NotEqual'},
      {ID: '<', Name: 'LessThan'},
      {ID: '<=', Name: 'LessThanOrEqual'},
      {ID: '>', Name: 'GreaterThan'},
      {ID: '>=', Name: 'GreaterThanOrEqual'},
      {ID: 'between', Name: 'Between'},
    ];

  /**
   *  Define un arreglo de operadores para el filtrado de los tipos de datos boolean.
   */
  filterBooleanAttributes: any =
    [
      {ID: '=', Name: 'Equal'},
    ];

  filterLookupAttributes: any = [

    {ID: 'IncludedIn', Name: 'Included In'},
  ];
  filterDomainAttributes: any = [

    {ID: '=', Name: 'Equal'},
  ];

  /**
   *  Define la visibilidad del popup de seleccion de los filtros.
   */
  popupFilterVisible = false;

  /**
   *  Define la visibilidad del tooltip del boton del popup.
   */
  isTooltipPopupVisible = false;

  /**
   *  Define la visibilidad del checkbox del atributo cuyo metadato q contiene el tipo de dato boolean
   */
  valueBooleanCheckBox = false;

  /**
   *  Define el datasource del DropBox
   */
  dataSource: any;

  /**
   *  Define el la entidad que le dara vida al dropdown
   */
  baseEntityDropDown: string;

  fieldExprDropDown: any;

  /**
   * Define el datasource que recibe el lookup
   */
  constructor(
    private crudService: CrudService,
    private baseService: BaseService,
    private baseSubEntityService: BaseService,
    private modelsMapService: ModelsMapService) {
  }

  /**
   * Inicializa el componente
   */
  ngOnInit() {
    this.getNameFromClassMap();
    this.moveFieldsToArrays();
  }

  /**
   * funcion que devielve la entidad para crear el componente
   */
  getNameFromClassMap() {
    this.filterInstance = this.modelsMapService.getNewEntityInstance(this.entityName);
    this.extractEntityFilterMetadata();
  }

  /**
   * funcion que extrae de la entidad los metadatos e inforacion adicional para ponerla en el arreglo fieldsFilterMetadata
   */
  extractEntityFilterMetadata() {
    this.filters = [];
    for (const field in this.filterInstance) {
      if (this.filterInstance.hasOwnProperty(field)) {
        if (Reflect.hasMetadata('filterable', this.filterInstance, field)) {
          const filter = Reflect.getMetadata('filterable', this.filterInstance, field);
          if (filter.visible === true) {
            let optionDataType = '';
            let optionFilterableFields: any;
            if (filter['dataType'] === 'entity') {
              optionDataType = filter['options']['entityType'];
              optionFilterableFields = filter['options']['filterableFields'];
            }
            if (filter['dataType'] === 'domain') {
              optionDataType = filter['options']['domainName'];
            }
            const CamelCase = this.camelCaseToTitleCase(field);
            this.fieldsFilterMetadata.push({
              name: CamelCase, dataType: filter['dataType'],
              fieldName: field, visible: filter['visible'],
              between: false,
              opDataType: optionDataType,
              opFilterableFields: optionFilterableFields,
            });
            if (filter === 'date' || filter === 'number') {
              this.filterInstance[field + '_from'] = null;
              this.filterInstance[field + '_to'] = null;
            }
            this.filters[field] = {fieldName: field, value: null, value2: null, operator: null};
          }
        }
      }
    }
  }

  /**
   * funcion que convierte el field en un posible nombre para q se muestre bien como campo
   */
  camelCaseToTitleCase(in_camelCaseString: string) {
    const result: string = in_camelCaseString
      .replace(/([a-z])([A-Z][a-z])/g, '$1 $2')
      .replace(/([A-Z][a-z])([A-Z])/g, '$1 $2')
      .replace(/([a-z])([A-Z]+[a-z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z][a-z])/g, '$1 $2')
      .replace(/([a-z]+)([A-Z0-9]+)/g, '$1 $2')
      // Note: the next regex includes a special case to exclude plurals of acronyms, e.g. "ABCs"
      .replace(/([A-Z]+)([A-Z][a-rt-z][a-z]*)/g, '$1 $2')
      .replace(/([0-9])([A-Z][a-z]+)/g, '$1 $2')
      .replace(/([A-Z]+)([0-9]+)/g, '$1 $2')
      .replace(/([0-9]+)([A-Z]+)/g, '$1 $2')
      .trim();

    // capitalize the first letter
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  /**
   * Funcion que reinicia los input a su estado original
   */
  onReset() {
    for (const filter in this.filters) {
      this.filters[filter].value = null;
      this.filters[filter].value2 = null;
      this.valueBooleanCheckBox = null;
      this.filters[filter].operator = null;
      this.crudService.reloadDataGridAttempt.emit(null);
    }
  }

  /**
   * Funcion que especifica si se selecciono en el combo el item Between y marcandolo asi en el
   * arreglo de informacion y luego pasarlo a los miniarreglos de campos visibles
   */
  onBetweenSelected(e, field: any) {
    const index = this.fieldsFilterMetadata.indexOf(field, 0);
    if (index > -1) {
      if (e.value === 'between') {
        this.fieldsFilterMetadata[index].between = true;
      } else {
        this.fieldsFilterMetadata[index].between = false;
      }
    }
    this.moveFieldsToArrays();
  }

  /**
   * Funcion que cambia el atributo de visible del popup de seleccionar filtros
   */
  handleFilterSelectorItemClickedEvent() {
    this.popupFilterVisible = true;
  }

  /**
   * Funcion que realiza cambios al seleccioar o deselecionar algun checkbox del popup de los filtros
   */
  onCheckBoxToggled(e, field: any) {
    const index = this.fieldsFilterMetadata.indexOf(field, 0);
    if (index > -1) {
      this.fieldsVisibles = [];
      if (e.value === false) {
        this.fieldsFilterMetadata[index].visible = false;
      } else {
        this.fieldsFilterMetadata[index].visible = true;
      }
      this.removeFiltersNonVisibles();
      this.moveFieldsToArrays();
    }
  }

  /**
   * Funcion que realiza cambios al seleccioar o deselecionar el checkbox de algun tipo de dato booleano en los filtros
   */
  onCheckBoxBooleanToggled(e, field: any) {
    this.filters[field].value = e.value;
    this.filters[field].operator = 'Equal';
  }

  /**
   * Funcion que realiza agrega los campos visibles al arreglo de campos visibles
   */
  removeFiltersNonVisibles() {
    for (const field of this.fieldsFilterMetadata) {
      if (field.visible === true) {
        this.fieldsVisibles.push(field);
      }
    }
  }

  /**
   * Funcion que separa los items seleccionados como visibles para los dos array q mostraran las columnas
   */
  moveFieldsToArrays() {
    const count = this.fieldsVisibles.length / 2;
    let iterator = 0;
    this.fieldVisiblesCol1 = [];
    this.fieldVisiblesCol2 = [];
    for (const fV of this.fieldsVisibles) {
      if (count > iterator) {
        this.fieldVisiblesCol1.push(fV);
        iterator++;
      } else {
        this.fieldVisiblesCol2.push(fV);
      }
    }
  }

  /**
   * Funcion que maneja el evento del boton de aceptar del componente
   */
  handleAcceptButtonClickedEvent() {
    const filtersService: Filter[] = [];
    for (const field of this.fieldsVisibles) {
      const filterFilled = this.filters[field.fieldName];
      if (filterFilled.value != null && filterFilled.operator != null) {
        let filter: Filter;
        if (field.dataType !== 'entity') {
          filter = new Filter(filterFilled.fieldName, filterFilled.value, filterFilled.value2, 'And', filterFilled.operator);
        } else {
          const path = this.unIdEntityType(filterFilled.fieldName);
          filter = new Filter(path, filterFilled.value, filterFilled.value2, 'And', filterFilled.operator);
        }
        filtersService.push(filter);
      }
    }
    this.crudService.reloadDataGridAttempt.emit(filtersService);
  }

  /**
   * Construye el datasource del Dropdown{@link entityType}
   */
  buildDropDownDataSource(): CustomStore {
    this.baseSubEntityService = this.baseService.servicesMap.getValue(this.baseEntityDropDown);
    const dataSourceConfiguration = {
      load: (loadOptions: any) => {
        const searchPanelFilters: Filter[] = [];
        this.buildSearchPanelFilters(searchPanelFilters, loadOptions);
        return this.baseSubEntityService.getAll(loadOptions.skip, loadOptions.take, searchPanelFilters).toPromise()
          .then((response: any[]) => {
            const data = response;
            return {data};
          })
          .catch((error) => {
            throw new Error('Data loading error: ' + error.toString());
          });
      },
      byKey: (key) => {
        return this.baseSubEntityService.getById(key).toPromise();
      },
    };
    return new CustomStore(dataSourceConfiguration);
  }

  /**
   * Construye el Filtro del Panel-Filter para pasarselo a los servicios {@link entityType}
   */
  buildSearchPanelFilters(searchPanelFilters: Filter[], rawSearchPanelFilters) {
    if (rawSearchPanelFilters.searchExpr !== undefined) {
      const field = rawSearchPanelFilters.searchExpr;
      const value = rawSearchPanelFilters.searchValue;
      searchPanelFilters.push(new Filter(field, value, null, '', 'Contains'));
    }
  }

  /**
   * Maneja el evento del clic sobre el DropDown, llena el combo con los datos al hacerle click {@link entityType}
   */
  handleDropDownClickedEvent(opDataType: string, opFilterableFields: any) {
    this.baseEntityDropDown = opDataType;
    this.fieldExprDropDown = opFilterableFields;
    this.dataSource = this.buildDropDownDataSource();
  }

  /**
   * Transforma el nombre provisto por {@link entityType}
   */
  unIdEntityType(Type: string) {
    const stringlength = Type.length;
    const positive = Type.search('Id');
    if (positive > -1 && positive <= stringlength) {
      return Type.substring(0, positive);
    } else {
      return Type;
    }
  }

  /**
   * Maneja el evento del Value Change del DropDown {@link entityType}
   */
  onDropDownValueChange(e: any, fieldName: any) {
    const values = e.selectedRowsData;
    if (values.length === 0) {
      this.filters[fieldName].value = null;
    } else {
      this.filters[fieldName].value = [];
      for (const val of values) {
        this.filters[fieldName].value.push(val['Id']);
      }
      this.filters[fieldName].operator = 'IncludedIn';
    }
  }

  dropDownDisplayExpr = (item) => {
    let displayExpr = '';
    for (const property of this.fieldExprDropDown) {
      displayExpr = displayExpr !== ''
        ? displayExpr + ' - ' + item[property]
        : item[property];
    }
    return displayExpr;
  }
}
