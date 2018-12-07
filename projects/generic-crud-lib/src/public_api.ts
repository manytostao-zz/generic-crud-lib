/*
 * Public API Surface of generic-crud-lib
 */

/*
 * Interfaces
 */
export * from './lib/interfaces/has-image.interface';
export * from './lib/interfaces/is-tree.interface';

/*
 * Entities
 */
export * from './lib/model/base-entity.model';
export * from './lib/model/filter.model';

/*
 * Services
 */
export * from './lib/services/crud.service';
export * from './lib/services/domains.service';
export * from './lib/services/models-map.service';
export * from './lib/services/base.service';
export * from './lib/services/settings.service';
export * from './lib/generic-crud-lib.service';

/*
 * Components
 */
export * from './lib/crud/crud.component';
export * from './lib/toolbar/toolbar.component';
export * from './lib/domain-lookup/domain-lookup.component';
export * from './lib/entity-field/entity-field.component';
export * from './lib/entity-image/entity-image.component';
export * from './lib/filter-panel/filter-panel.component';
export * from './lib/selectable-grid/selectable-grid.component';
export * from './lib/selectable-tree/selectable-tree.component';
export * from './lib/add-edit/add-edit.component';
export * from './lib/custom-dialog/custom-dialog.component';
export * from './lib/custom-field-template/custom-field-template.component';
export * from './lib/entity-search/entity-search.component';
export * from './lib/entity-lookup/entity-lookup.component';

/*
 * Module
 */
export * from './lib/generic-crud-lib.module';
