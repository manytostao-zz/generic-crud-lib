import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import * as Collections from 'typescript-collections';
import {Guid} from 'guid-typescript';

import {MessageResult, MessageStyle, MessageType} from '../helpers';
import {DialogService} from '../services/dialog.service';
import {SettingsService} from '../services/settings.service';

@Component({
  selector: 'gcl-custom-dialog',
  templateUrl: './custom-dialog.component.html',
})
export class CustomDialogComponent implements OnInit {

  dialogId = Guid.create();

  /**
   * Contiene el título del mensaje a mostrar
   */
  @Input() title = '';

  /**
   * Contiene el texto del mensaje a mostrar
   */
  @Input() message = '';

  /**
   * Contiene el estilo del mensaje a mostrar
   */
  @Input() messageStyle: MessageStyle;

  /**
   * Contiene el tipo del mensaje a mostrar
   */
  @Input() messageType: MessageType;

  /**
   * Contiene la posición del popup
   */
  @Input() position: any;

  /**
   * Contiene el tipo del mensaje a mostrar
   */
  @Input() param: string;

  /**
   * Contiene las posibles clases a aplicar al mensaje en dependencia del {@link messageStyles}
   */
  classes = new Collections.Dictionary<MessageStyle, string>();

  /**
   * @ignore
   */
  messageStyles = MessageStyle;

  /**
   * @ignore
   */
  messageTypes = MessageType;

  /**
   * @ignore
   */
  messageResults = MessageResult;

  @Output() messageResultEvent = new EventEmitter<MessageResult>();

  isOpened = false;

  constructor(private dialogService: DialogService,
              private settingsService: SettingsService) {
    this.position = this.settingsService.getSettingValue('popupsDefaultPosition');
  }

  /**
   * Método que maneja el evento click de los botones del mensaje
   */
  handleMessageButtonClickedEvent(messageResult: MessageResult) {
    this.dialogService.navigateAwaySelection$.next(
      messageResult === MessageResult.Accept || messageResult === MessageResult.Continue,
    );
    this.messageResultEvent.emit(messageResult);
    this.dialogService.close(this.dialogId);
  }

  /**
   * Inicializa el componente
   */
  ngOnInit(): void {
    this.dialogService.registerDialog(this);
    this.classes.setValue(MessageStyle.Standard, 'bg-light text-center');
    this.classes.setValue(MessageStyle.Information, 'bg-info text-center');
    this.classes.setValue(MessageStyle.Warning, 'bg-warning text-center');
    this.classes.setValue(MessageStyle.Error, 'bg-danger text-center');
    this.classes.setValue(MessageStyle.Success, 'bg-success text-center');
  }

}
