import { ConfirmationModalModule } from './../../shared/components/confirmation-modal/confirmation-modal.module';
import { CardModule } from './../../shared/components/card/card.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortUserDirective } from './sort-user.directive';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { UserListComponent } from './user-list.component';

@NgModule({
  declarations: [UserListComponent, SortUserDirective],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule,
    CardModule,
    ConfirmationModalModule,
  ],
})
export class UserListModule {}
