import {Injectable} from '@angular/core';

import {SettingsService} from 'generic-crud-lib';

@Injectable()
export class ApplicationSettingsService extends SettingsService {
  getSettingValue(settingName: any): any {
    if (settingName === 'popupsDefaultPosition') {
      return {my: 'center top', at: 'center top', of: '.main', offset: '0 100'};
    }
    return {};
  }
}
