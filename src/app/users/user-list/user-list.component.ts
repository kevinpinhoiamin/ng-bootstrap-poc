import { ToastService } from './../../shared/components/toast/toast.service';
import { ConfirmationModalData } from './../../shared/components/confirmation-modal/confirmation-modal-data';
import { ConfirmationModalComponent } from './../../shared/components/confirmation-modal/confirmation-modal.component';
import { UserService } from './../user/user.service';
import {
  Component,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Observable } from 'rxjs';

import { UserListService } from './user-list.service';
import { SortUserDirective, SortEvent } from './sort-user.directive';
import { User } from './../user/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  users$: Observable<User[]>;
  total$: Observable<number>;

  @ViewChild('deletingUserTemplate', { read: TemplateRef })
  deletingUserTemplate: TemplateRef<any>;
  @ViewChildren(SortUserDirective) headers: QueryList<SortUserDirective>;

  constructor(
    public userListService: UserListService,
    public userService: UserService,
    private modalService: NgbModal,
    private toastService: ToastService
  ) {
    this.users$ = userListService.users$;
    this.total$ = userListService.total$;
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.userListService.sortColumn = column;
    this.userListService.sortDirection = direction;
  }

  onDelete(user: User): void {
    const data: ConfirmationModalData = {
      title: 'Exclusão de usuário',
      confirmationMessage: `Você tem certeza que deseja excluir o usuário <span class="text-primary">"${user.name}"</span>?`,
      associatedInformationMessage:
        'Toda informação associada com este usuário será permanentemente apagada. <span class="text-danger">Essa operação não pode ser desfeita.</span>',
    };
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.data = data;

    modalRef.result.then((shouldDelete: boolean) => {
      if (shouldDelete) {
        const infoToast = this.toastService.showInfo(this.deletingUserTemplate);
        this.userService.delete(user).subscribe(
          () => {
            this.toastService.remove(infoToast);
            this.toastService.showSuccess(`Usuário excluídao com sucesso!`);
            this.userListService.searchTerm = this.userListService.searchTerm;
          },
          (error) => {
            console.log(error);
            this.toastService.showDanger(
              `Ocorreu um erro ao excluir o usuário!`
            );
          }
        );
      }
    });
  }
}
