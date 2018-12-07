import {Injectable} from '@angular/core';

@Injectable()
export abstract class DomainsService {
  abstract getDomain(domainName: string): any[];
}
