import { CompanyService } from './company.service';
import { Injectable } from '@angular/core';
import { Observable, OperatorFunction, of } from 'rxjs';
import { Company } from './company';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  catchError,
} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CompanyTypeaheadService {
  constructor(private companyService: CompanyService) {}

  searching = false;
  searchFailed = false;

  search: OperatorFunction<string, readonly Company[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term: string) =>
        this.companyService.search(term).pipe(
          tap(() => (this.searchFailed = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );

  formatter = (company: Company) => company.name;
}
