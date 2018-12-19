import * as randomString from 'random-string-simple';

import {TestEntityModel, TestEntityModel2} from './test-entity.model';
import {Guid} from 'guid-typescript';

export class TestData {

  public testEntityArray: TestEntityModel[] = [];

  public testEntityArray2: TestEntityModel2[] = [];

  constructor() {
    this.fillTestEntityArray2();
    this.fillTestEntityArray();
  }

  fillTestEntityArray2() {
    for (let i = 0; i < 5; i++) {
      this.testEntityArray2.push(new TestEntityModel2(Guid.create().toString(), randomString(5)));
    }
  }

  fillTestEntityArray() {
    for (let i = 0; i < 5; i++) {
      this.testEntityArray.push(new TestEntityModel(
        Guid.create().toString(),
        'test_domain_value_' + (i + 1).toString(),
        null,
        this.testEntityArray2[Math.floor((Math.random() * 4))]
        )
      );
    }
  }
}
