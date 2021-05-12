import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ConfirmationModalComponent],
  imports: [CommonModule, NgbModule],
  exports: [ConfirmationModalComponent],
})
export class ConfirmationModalModule {}
