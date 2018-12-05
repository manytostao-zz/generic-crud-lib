import { TestBed } from '@angular/core/testing';

import { GenericCrudLibService } from './generic-crud-lib.service';

describe('GenericCrudLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenericCrudLibService = TestBed.get(GenericCrudLibService);
    expect(service).toBeTruthy();
  });
});
