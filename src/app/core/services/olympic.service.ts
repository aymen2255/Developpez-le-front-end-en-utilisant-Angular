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

  // Charger les données initiales des pays
  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        this.olympics$.next([]);
        // Affiche une alerte  avec SweetAlert2 pour informer l'utilisateur de l'erreur
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

  // Récupère un Observable contenant la liste des pays
  public getOlympicById(id: number): Observable<Olympic> {
    return this.olympics$.pipe(
      filter((countries: Olympic[]) => countries.length > 0),
      map((countries: Olympic[]) => {
          const foundCountry = countries.find((foundCountry: Olympic) => foundCountry.id === id)

          if (foundCountry === undefined) {
            // Affiche une alerte avec SweetAlert2 pour informer l'utilisateur
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `Country not found`
            });
            throw new Error("Country not found");
          }

          return foundCountry;
        }
      ));
  }
}
