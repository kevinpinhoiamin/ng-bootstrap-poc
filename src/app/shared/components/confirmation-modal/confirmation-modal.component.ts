import { ConfirmationModalData } from './confirmation-modal-data';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  @Input() data: ConfirmationModalData;

  constructor(public modal: NgbActiveModal) {}
}
