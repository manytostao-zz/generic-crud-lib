import {Injectable} from '@angular/core';

import {DomainsService} from 'generic-crud-lib';
import {ApplicationDomains} from './domains';

@Injectable()
export class ApplicationDomainsService extends DomainsService {

  getDomain(domainName: string) {
    return ApplicationDomains[domainName];
  }
}
