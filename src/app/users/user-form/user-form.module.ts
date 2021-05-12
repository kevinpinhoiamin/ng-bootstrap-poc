import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'src/app/shared/components/card/card.module';
import { RouterModule } from '@angular/router';

import { UserFormComponent } from './user-form.component';

@NgModule({
  declarations: [UserFormComponent],
  imports: [
    CommonModule,
    CardModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
  ],
})
export class UserFormModule {}
