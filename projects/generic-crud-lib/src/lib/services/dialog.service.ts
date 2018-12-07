import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';

import {CustomDialogComponent} from '../custom-dialog/custom-dialog.component';
import {Guid} from 'guid-typescript';

/**
 * DialogService - Service used to interact with the CustomDialogComponent
 */
@Injectable()
export class DialogService {
  dialogs: CustomDialogComponent[];

  navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.dialogs = [];
  }

  /**
   * close - Closes the selected modal by searching for the component and setting
   * isOpen to false
   * Note: If a modal is set to be 'blocking' a user click outside of the modal will
   * not dismiss the modal, this is off my default
   */
  close(dialogId: Guid): void {
    const dialog = this.findModal(dialogId);

    if (dialog) {
      setTimeout(() => {
        dialog.isOpened = false;
      }, 250);

    }
  }

  /**
   * findModal - Locates the specified modal in the dialogs array
   */
  findModal(dialogId: Guid): CustomDialogComponent {
    for (const dialog of this.dialogs) {

      if (dialog.dialogId === dialogId) {
        return dialog;
      }
    }

    return null;
  }

  /**
   * open - Opens the specified modal based on the suplied modal id
   */
  open(dialogId: Guid): void {
    const dialog = this.findModal(dialogId);

    if (dialog) {
      setTimeout(() => {
        dialog.isOpened = true;
      }, 250);
    }
  }

  /**
   * registerDialog - Registers all modal components being used on initialization
   */
  registerDialog(newDialog: CustomDialogComponent): void {
    const dialog = this.findModal(newDialog.dialogId);

    // Delete existing to replace the modal
    if (dialog) {
      this.dialogs.splice(this.dialogs.indexOf(dialog), 1);
    }

    this.dialogs.push(newDialog);

  }

}
