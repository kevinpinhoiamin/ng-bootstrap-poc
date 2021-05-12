import { Company } from './company';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  constructor(private httpClient: HttpClient) {}

  search(term: string) {
    return this.httpClient.get<Company[]>(environment.api.companies, {
      params: new HttpParams().append('name_like', term),
    });
  }
}
