import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, delay, map } from 'rxjs/operators';
import { User } from './user';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private httpClient: HttpClient) {}

  usernameAlreadyInUse(username: string): Observable<boolean> {
    return this.httpClient
      .get<User[]>(environment.api.users, {
        params: new HttpParams().append('username', username.trim()),
      })
      .pipe(map((users) => users.length > 0));
  }

  get(id: number) {
    return this.httpClient.get<User>(`${environment.api.users}/${id}`);
  }

  save(user: User): Observable<User> {
    if (user.id) {
      return this.httpClient.put<User>(
        `${environment.api.users}/${user.id}`,
        user
      );
    }
    return this.httpClient.post<User>(environment.api.users, user);
  }

  delete(user: User): Observable<User> {
    return this.httpClient.delete<User>(`${environment.api.users}/${user.id}`).pipe(delay(2000));
  }
}
