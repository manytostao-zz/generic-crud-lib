import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import {ApplicationDomainsService} from '../services/application-domains.service';

@Component({
  selector: 'gcl-domain-lookup',
  templateUrl: './domain-lookup.component.html',
})
export class DomainLookupComponent implements OnInit {

  /**
   * Fuente de datos de la lista desplegable
   */
  lookupDataSource: any[] = [];

  /**
   * Nombre del dominio a mostrar en la lista desplegable
   */
  @Input() domainName = '';

  /**
   * Define si el componente visual se muestra deshabilitado
   */
  @Input() disabled: false;

  /**
   * Evento que se emite cuando el valor seleccionado en la lista desplegable cambia
   */
  @Output() valueChanged = new EventEmitter<any>();

  private _entityField: any = '';
  /**
   * Evento que se lanza cuando cambia el valor de la propiedad selectedEntity
   */
  @Output() entityFieldChange = new EventEmitter<string>();

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

  constructor(private applicationDomainsService: ApplicationDomainsService) {
  }

  /**
   * Inicializa el componente estableciendo la fuente de datos de la lista desplegable
   */
  ngOnInit() {
    console.log(this.domainName, this.applicationDomainsService);
    this.lookupDataSource = this.applicationDomainsService.getDomain(this.domainName);
  }

  /**
   * Maneja el evento onValueChanged de la lista desplegable y emite el propio del componente
   */
  handleOnValueChangedEvent($event: any) {
    this.entityField = $event.value;
    this.valueChanged.emit();
  }
}
