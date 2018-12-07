/*
 * Public API Surface of generic-crud-lib
 */

/*
 * Interfaces
 */
export * from './lib/interfaces/has-image.interface';

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
export * from './lib/generic-crud-lib.service';

/*
 * Components
 */
export * from './lib/generic-crud-lib.component';
export * from './lib/toolbar/toolbar.component';
export * from './lib/domain-lookup/domain-lookup.component';
export * from './lib/entity-field/entity-field.component';
export * from './lib/entity-image/entity-image.component';

/*
 * Module
 */
export * from './lib/generic-crud-lib.module';
