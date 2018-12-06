import {Injectable} from '@angular/core';

import {ApplicationDomainsService} from 'generic-crud-lib';
import {ApplicationDomains} from './domains';

@Injectable()
export class DomainsService extends ApplicationDomainsService {

  getDomain(domainName: string) {
    return ApplicationDomains[domainName];
  }
}
