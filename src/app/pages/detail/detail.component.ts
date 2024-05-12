import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, of, partition, takeUntil } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Serie } from 'src/app/core/models/Serie';
import { DetailChartCountry } from 'src/app/core/models/DetailChartCountry';
import { Participation } from "../../core/models/Participation";



@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit, OnDestroy {

  private destroy$!: Subject<boolean>;
  public countyId!: number;
  series: Serie[] = [];

  multi: DetailChartCountry[] = [];

  view: [number, number] = [700, 400];

  // options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';
  yAxisLabel: string = 'Medals';
  timeline: boolean = true;

  public colorScheme: any = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };


  participationJOCount: number = 0;
  medalsCount: number = 0;
  athleteCount: number = 0;
  countryName: string = '';

  constructor(private olympicService: OlympicService, private route: ActivatedRoute) {
    this.view = [innerWidth / 1.35, 400];
  }

  ngOnInit(): void {

    this.destroy$ = new Subject<boolean>();

    this.route.params.subscribe(params => {
      this.countyId = parseInt(params['id']);
    });


    this.transfomDataToLineChart();

    this.getStatDataByCountry();

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }


  getStatDataByCountry() {
    this.olympicService.getOlympicById(this.countyId).pipe(
      takeUntil(this.destroy$)
    ).subscribe((country) => {
      if (country && country.participations) {

        this.countryName = country.country;

        this.participationJOCount = country.participations.length;

        this.medalsCount = country.participations.reduce((total: number, participation: Participation) => {
          return total + participation.medalsCount;
        }, 0);

        this.athleteCount = country.participations.reduce((total: number, participation: Participation) => {
          return total + participation.athleteCount;
        }, 0);

      }
    });
  }


  transfomDataToLineChart() {
    this.olympicService.getOlympicById(this.countyId).pipe(
      takeUntil(this.destroy$)
    ).subscribe((country) => {
      if (country && country.participations) {

        this.series = country.participations.map((participation: Participation) => {
          return { name: participation.year.toString(), value: participation.medalsCount };
        });

        const detailChartCountry: DetailChartCountry = {
          name: country.country,
          series: this.series
        };

        this.multi = [detailChartCountry];
      }
    })
  }

  onResize(event: any) {
    this.view = [event.target.innerWidth / 1.3, 400];
  }

}
