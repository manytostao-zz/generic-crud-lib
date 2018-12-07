import {Injectable} from '@angular/core';

@Injectable()
export abstract class SettingsService {
  abstract getSettingValue(settingName): any;
}
