import { UserGender } from './../user/user-gender';
import { UserProfilePicture } from './../user/user-profile-picture';
import { environment } from './../../../environments/environment';
import { Company } from './../../companies/company/company';
import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject, pipe } from 'rxjs';

import { User } from '../user/user';
import { DecimalPipe } from '@angular/common';
import {
  catchError,
  debounceTime,
  delay,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { SortColumn, SortDirection } from './sort-user.directive';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserProfile } from '../user/user-profile';

interface SearchResult {
  users: User[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (
  v1: string | number | boolean | Company | UserProfilePicture,
  v2: string | number | boolean | Company | UserProfilePicture
) => {
  if (typeof v1 === 'object' && typeof v2 === 'object') {
    return v1.name < v2.name ? -1 : v1.name > v2.name ? 1 : 0;
  }
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
};

function sort(users: User[], column: SortColumn, direction: string): User[] {
  if (direction === '' || column === '') {
    return users;
  } else {
    return [...users].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(user: User, term: string, pipe: PipeTransform) {
  term = term.trim().toLowerCase();
  return (
    user.name.toLowerCase().includes(term) ||
    user.username.toLowerCase().includes(term) ||
    user.profile.toLowerCase().includes(term) ||
    user.company.name.toLowerCase().includes(term)
  );
}

@Injectable({ providedIn: 'root' })
export class UserListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _users$ = new BehaviorSubject<User[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 5,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor(private pipe: DecimalPipe, private httpClient: HttpClient) {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(300),
        switchMap(() => this._search()),
        delay(300),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._users$.next(result.users);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get users$() {
    return this._users$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;

    return this.httpClient.get<User[]>(environment.api.users).pipe(
      map((users) => sort(users, sortColumn, sortDirection)),
      map((users) =>
        users.filter((user) => matches(user, searchTerm, this.pipe))
      ),
      map((users) =>
        users.map((user) => {
          user.profile =
            UserProfile[user.profile.toString() as keyof typeof UserProfile];
          user.gender =
            UserGender[user.profile.toString() as keyof typeof UserGender];
          return user;
        })
      ),
      map((users) => {
        const total = users.length;
        users = users.slice(
          (page - 1) * pageSize,
          (page - 1) * pageSize + pageSize
        );

        return { users, total };
      }),
      catchError((errorRes: HttpErrorResponse) => {
        console.log(errorRes);
        return of({ users: [], total: 0 });
      })
    );
  }
}
