import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of, takeUntil } from 'rxjs';
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

  buildOlympics() {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((olympics: Olympic[]) => {
      this.countries = olympics.map((olympic: Olympic) => {
        const medalsCount = olympic.participations.reduce((total: number, participation: Participation) => {
          if (!this.joYears.includes(participation.year)) {
            this.joYears.push(participation.year);
          }
          return total + participation.medalsCount;
        }, 0);
        return { name: olympic.country, value: medalsCount, extra: { id: olympic.id } };
      });
    })
  }


  onResize(event: any) {
    this.view = [event.target.innerWidth / 1.3, 400];
  }

  onChartElementClick(event: any) {
    this.router.navigate(['detail/' + event.extra.id]);
  }

}


