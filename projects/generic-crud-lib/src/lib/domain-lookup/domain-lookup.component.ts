import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import {DomainsService} from '../services/domains.service';

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

  private _domainValue: any = '';
  /**
   * Evento que se lanza cuando cambia el valor de la propiedad selectedEntity
   */
  @Output() domainValueChange = new EventEmitter<string>();

  /**
   * @ignore
   */
  @Input() get domainValue(): string {

    return this._domainValue;
  }

  /**
   * @ignore
   */
  set domainValue(value: string) {
    this._domainValue = value;
    this.domainValueChange.emit(this._domainValue);
  }

  constructor(private domainsService: DomainsService) {
  }

  /**
   * Inicializa el componente estableciendo la fuente de datos de la lista desplegable
   */
  ngOnInit() {
    this.lookupDataSource = this.domainsService.getDomain(this.domainName);
  }

  /**
   * Maneja el evento onValueChanged de la lista desplegable y emite el propio del componente
   */
  handleOnValueChangedEvent($event: any) {
    this.domainValue = $event.value;
    this.valueChanged.emit();
  }
}
