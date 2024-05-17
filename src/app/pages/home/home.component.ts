import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { Participation } from 'src/app/core/models/Participation';
import { Olympic } from 'src/app/core/models/Olympic';
import { NgxPieCharts } from "../../core/models/NgxPieCharts";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  public olympics$: Observable<Olympic[]> = of([]);
  private destroy$!: Subject<boolean>;

  view: [number, number] = [700, 400];
  showLabels: boolean = true;

  joYears: number[] = [];
  countries: NgxPieCharts[] = [];

  constructor(private olympicService: OlympicService, private router: Router) {
    this.view = [innerWidth / 1.35, 400];
  }

  ngOnInit(): void {

    this.destroy$ = new Subject<boolean>();

    this.buildOlympics();

  }

  
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  // construire la liste des pays participants aux JO avec le nombre total de médailles
  buildOlympics() {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.pipe(
      //arrêter le subscribe lorsque le subject destroy$ émet une valeur
      takeUntil(this.destroy$)
    ).subscribe((olympics: Olympic[]) => {
      this.countries = olympics.map((olympic: Olympic) => {
        const medalsCount = olympic.participations.reduce((total: number, participation: Participation) => {
          // Si l'année de la participation n'est pas déjà dans le tableau joYears, l'ajoute
          if (!this.joYears.includes(participation.year)) {
            this.joYears.push(participation.year);
          }
          // Ajoute le nombre de médailles de cette participation au total de médailles du pays
          return total + participation.medalsCount;
        }, 0);
        // Retourne un objet représentant le pays avec son nom, le nombre total de médailles et l'ID du pays
        return { name: olympic.country, value: medalsCount, extra: { id: olympic.id } };
      });
    })
  }

//Met à jour la taille de pie charts en fonction de la largeur lors du redimensionnement de la fenêtre
  onResize(event: any) {
    this.view = [event.target.innerWidth / 1.3, 400];
  }

  onChartElementClick(event: any) {
    this.router.navigate(['detail/' + event.extra.id]);
  }

}


