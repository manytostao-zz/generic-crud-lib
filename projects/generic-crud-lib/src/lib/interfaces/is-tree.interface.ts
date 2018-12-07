import {Observable} from 'rxjs';

export interface IsTreeInterface {

  getByParent(parentId?: string,  filters?: any[], orders?: any[], complete?: boolean): Observable<any>;

}
