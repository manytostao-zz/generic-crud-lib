import {Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';

import {HasImageInterface} from '../interfaces/has-image.interface';
import {BaseService} from '../services/base.service';

@Component({
  selector: 'gcl-entity-image',
  templateUrl: './entity-image.component.html',
  styleUrls: ['./entity-image.component.css'],
})
export class EntityImageComponent implements OnInit {

  @Input() entityId: string;

  @Input() disabled: boolean;

  hasImageInterface: HasImageInterface;

  imageBlob: any = '';

  private _entityField: any = '';
  /**
   * Evento que se lanza cuando cambia el valor de la propiedad selectedEntity
   */
  @Output() entityFieldChange = new EventEmitter<string>();

  @Output() imageChanged = new EventEmitter<any>();

  /**
   * @ignore
   */
  @Input() get entityField(): string {

    return this._entityField;
  }

  /**
   * @ignore
   */
  set entityField(value: string) {
    this._entityField = value;
    this.entityFieldChange.emit(this._entityField);
  }

  constructor(injector: Injector, private baseService: BaseService) {
    this.hasImageInterface = injector.get('HasImageInterface', baseService);
  }

  ngOnInit() {
    if (this.entityField === '' || this.entityField === null || this.entityField === undefined) {
      this.hasImageInterface.getImageByEntityId(this.entityId).subscribe((result) => {
        this.imageBlob = 'data:image/png;base64,' + result;
      });
    } else {
      this.imageBlob = 'data:image/png;base64,' + this.entityField;
    }
  }

  handleFileUploaderValueChangedEvent($event: any) {
    const file: File = $event.value[0];
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.imageBlob = myReader.result;
      const stringedResult = myReader.result.toString();
      this.entityField = stringedResult.slice(stringedResult.lastIndexOf(',') + 1, stringedResult.length);
      this.imageChanged.emit();
    };

    myReader.readAsDataURL(file);
  }
}
