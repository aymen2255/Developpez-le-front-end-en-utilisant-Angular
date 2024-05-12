import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData() {

    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        this.olympics$.next([]);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Error loading initial data`
        });
        return throwError(() => new Error(`Error loading initial data`));
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  public getOlympicById(id: number): Observable<Olympic> {

    return this.olympics$.pipe(
      filter((countries: Olympic[]) => countries.length > 0),
      map((countries: Olympic[]) => {
          const foundCountry = countries.find((foundCountry: Olympic) => foundCountry.id === id)

          if (foundCountry === undefined) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `Country not found`
            });
            throw new Error("Country not found");
          }
console.log('foundCountry',foundCountry);
          return foundCountry;
        }
      ));
  }
}
