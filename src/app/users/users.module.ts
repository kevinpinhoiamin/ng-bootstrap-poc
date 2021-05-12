import { NgModule } from '@angular/core';

import { UserListModule } from './user-list/user-list.module';
import { UserFormModule } from './user-form/user-form.module';

@NgModule({
  imports: [UserListModule, UserFormModule],
})
export class UsersModule {}
