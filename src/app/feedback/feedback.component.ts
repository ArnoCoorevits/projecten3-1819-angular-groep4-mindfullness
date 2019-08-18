import { Component, OnInit, OnChanges } from '@angular/core';
import { OefeningDataService } from '../oefening-data.service';
import { Oefening } from '../oefening/oefening.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Feedback } from './feedback.model';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';
import { VerwijderAlertComponent } from '../verwijder-alert/verwijder-alert.component';

export interface IBarChartData {
  data: string;
  label: string;
}

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit, OnChanges {

  private _oefening: Oefening;
  private _oefeningen: Oefening[];
  private _feedback: Feedback[] = null;

  public errorMsg: string;

  public barChartOptions: any = {
    responsive: true,
    tooltips: {
      callbacks: {
        label: function (tooltipItem) {
          return tooltipItem.yLabel;
        }
      }
    },
    scales: {
      xAxes: [{
        display: false,
        gridLines: {
          display: false
        }
      }],
      yAxes: [{
        display: true,
        ticks: {
          max: 100,
          suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
          // OR //
          beginAtZero: true   // minimum value will be 0.
        }
      }]
    },
  };
  public barChartData: any[] = [{ data: [], label: 'Gemiddelde feedback-score per oefening (%)' }];
  public barChartLabels: string[] = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartColors = [{
    backgroundColor: '#AFDBCE',
    hoverBackgroundColor: '#A8D2C6',
    borderColor: '#AFDBCE',
    hoverBorderColor: '#AFDBCE'
  }];

  constructor(private _oefDataService: OefeningDataService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getOefeningen();
  }

  ngOnChanges() {
    this.getOefeningen();
  }

  get oefening(): Oefening {
    return this._oefening;
  }

  get oefeningen(): Oefening[] {
    return this._oefeningen;
  }

  get feedback(): Feedback[] {
    return this._feedback;
  }

  // Gets all exercises
  getOefeningen() {
    return this._oefDataService.getOefeningen().subscribe(oefeningen => {
      this._oefeningen = oefeningen;
      oefeningen.forEach(oefening => {
        this.getFeedback(oefening).subscribe(feedback => {
          if (feedback.length > 0) {
            this.barChartData[0].data.push(this.calculateFeedbackPercentage(feedback));
          }
        });
      });

      oefeningen.forEach(oefening => {
        this.getFeedback(oefening).subscribe(feedback => {
          if (feedback.length > 0) {
            this.barChartLabels.push(oefening.naam);
          }
        });
      });
    });
  }

  // Called when exercise is selected
  oefeningGekozen(): boolean {
    if (this._oefening != null) {
      return true;
    }
    return false;
  }

  // Sets feedback to that from the selected exercise
  toonOefeningFeedback(oefening: Oefening): Oefening {
    this.getFeedback(oefening)
      .subscribe(
        feedback => {
          if (feedback.length > 0) {
            this._feedback = feedback;
          } else {
            this._feedback = null;
          }
        },
        (error: HttpErrorResponse) => {
          this.errorMsg = `Error ${
            error.status
            } while trying to retrieve feedback: ${error.error}`;
        }
      );
    this._oefening = oefening;
    return oefening;
  }

  // HTTP request to get the feedback from an exercise
  getFeedback(oefening: Oefening): Observable<Feedback[]> {
    return this._oefDataService
      .getFeedbackFromOefening(oefening.id);
  }

  // Calculate mean percentage of all feedback from an exercise
  calculateFeedbackPercentage(feedback: Feedback[]): number {
    let totalFeedback = 0;
    let totalScore = 0;
    if (feedback) {
      feedback.forEach(element => {
        totalFeedback += 1;
        totalScore += element.score;
      });
      const percentage = totalScore / (totalFeedback * 10) * 100;
      return percentage;
    }
    return null;
  }

  // Remove all feedback (useful after exercise change or when view is too cluttered)
  verwijderFeedback() {
    const dialogRef = this.dialog.open(VerwijderAlertComponent, {
      minWidth: 300,
      data: {
        dataName: '',
        dataSentence: 'Ben je zeker dat je alle feedback van deze oefening wilt verwijderen?',
        dataId: this._oefening.id
      }
    });

    dialogRef.afterClosed().subscribe(r => {
      if (r) {
        this._feedback = null;
        // Remove feedback
        this._oefDataService.verwijderFeedbackOefening(this._oefening.id);
      }
    });
  }

  // events on chart click
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
