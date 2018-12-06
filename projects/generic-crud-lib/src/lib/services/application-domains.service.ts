import {Injectable} from '@angular/core';

@Injectable()
export abstract class ApplicationDomainsService {
  abstract getDomain(domainName: string): any[];
}
