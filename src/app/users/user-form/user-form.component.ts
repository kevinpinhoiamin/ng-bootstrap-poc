import { ToastService } from './../../shared/components/toast/toast.service';
import { UserProfilePicture } from './../user/user-profile-picture';
import { CompanyTypeaheadService } from './../../companies/company/company-typeahead.service';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UserService } from '../user/user.service';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  first,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { User } from '../user/user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  isEdit: boolean;
  loadedUser: User;
  userForm: FormGroup;
  selectedProfilePicture: UserProfilePicture;
  enabledProfilePictureExtenstion = ['jpg', 'jpeg', 'png'];

  constructor(
    public userService: UserService,
    public companyTypeaheadService: CompanyTypeaheadService,
    private toastService: ToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id) {
      this.initForm();
      this.userForm.disable();

      this.userService.get(this.activatedRoute.snapshot.params.id).subscribe(
        (user) => {
          this.isEdit = true;
          this.loadedUser = user;
          this.userForm.enable();
          this.initForm();
        },
        (error) => {
          console.log(error);
          this.toastService.showDanger(
            'Ocorreu um erro ao carregar os dados do usuário!'
          );
          this.router.navigate(['..', 'list']);
        }
      );
    } else {
      this.initForm();
    }
  }

  initForm(): void {
    this.userForm = new FormGroup({
      name: new FormControl(this.loadedUser?.name || '', [Validators.required]),
      username: new FormControl(
        this.loadedUser?.username || '',
        [Validators.required],
        [this.usernameAlreadyInUse.bind(this)]
      ),
      password: new FormControl('', this.isEdit ? [] : [Validators.required]),
      profile: new FormControl(this.loadedUser?.profile?.toString() || '', [
        Validators.required,
      ]),
      company: new FormControl(this.loadedUser?.company || '', [
        Validators.required,
      ]),
      profilePicture: new FormControl(''),
      gender: new FormControl(this.loadedUser?.gender || '', [
        Validators.required,
      ]),
      active: new FormControl(this.loadedUser !== undefined ? this.loadedUser.active : true),
    });
  }

  hasBeenTouched(inputName: string): boolean {
    const input = this.userForm.get(inputName);
    return input !== null && input.touched;
  }

  hasError(inputName: string, errorCode: string = 'required'): boolean {
    const input = this.userForm.get(inputName);
    return (
      input !== null && input.touched && input.errors && input.errors[errorCode]
    );
  }

  usernameAlreadyInUse(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    if (!control.value || control.value === this.loadedUser?.username) {
      return of(null);
    }
    return control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: string) =>
        this.userService.usernameAlreadyInUse(value)
      ),
      map((alreadyInUse: boolean) => {
        return alreadyInUse ? { alreadyInUse: true } : null;
      }),
      first()
    );
  }

  onProfilePictureChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files !== null && files.length > 0) {
      const file = files[0];
      this.selectedProfilePicture = { name: file.name, base64: '' };

      this.validateProfilePicture(file);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        (this.selectedProfilePicture.base64 =
          reader.result !== null ? reader.result.toString() : '');
      reader.onerror = (error) => console.log(error);
    }
  }

  private validateProfilePicture(file: File): void {
    const fileExtension: string =
      file.name.split('.').pop()?.toLowerCase() || '';
    const invalidFileExtension =
      !this.enabledProfilePictureExtenstion.includes(fileExtension);
    const invalidFileSize = file.size > 500000; // 0,5MB

    if (invalidFileExtension || invalidFileSize) {
      this.userForm
        .get('profilePicture')
        ?.setErrors({ invalidFileExtension, invalidFileSize });
    } else {
      this.userForm.get('profilePicture')?.setErrors(null);
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.userForm.disable();

      const user: User = this.userForm.value;
      if (this.selectedProfilePicture !== undefined) {
        user.profilePicture = this.selectedProfilePicture;
      }
      if (this.isEdit) {
        user.id = this.loadedUser.id;
        if (!user.password) {
          user.password = this.loadedUser.password;
        }
        if (!user.profilePicture) {
          user.profilePicture = this.loadedUser.profilePicture;
        }
      }

      this.userService
        .save(user)
        .pipe(delay(500))
        .subscribe(
          () => {
            this.toastService.showSuccess(
              `Usuário ${this.isEdit ? 'editado' : 'cadastrado'} com sucesso!`
            );
            this.router.navigate(['..', 'list']);
          },
          (error) => {
            console.log(error);
            this.userForm.enable();
            this.toastService.showDanger(
              `Ocorreu um erro ao ${
                this.isEdit ? 'editar' : 'cadastrar'
              } o usuário!`
            );
          }
        );
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
