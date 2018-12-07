import {Observable} from 'rxjs';

export interface HasImageInterface {

  getImageByEntityId(id: string): Observable<any>;

}
