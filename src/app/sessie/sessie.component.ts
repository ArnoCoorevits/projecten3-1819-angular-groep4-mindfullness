import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Sessie } from './sessie.model';
import { MatDialog, MatSnackBar } from '@angular/material';
import { OefeningComponent } from '../oefening/oefening.component';
import { Oefening } from '../oefening/oefening.model';
import { OefeningEmptyComponent } from '../oefening-empty/oefening-empty.component';
import { OefeningDataService } from '../oefening-data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '../../../node_modules/@angular/forms';
import { SessieDataService } from '../sessie-data.service';

@Component({
  selector: 'app-sessie',
  templateUrl: './sessie.component.html',
  styleUrls: ['./sessie.component.css']
})
export class SessieComponent implements OnInit, OnChanges {
  @Input() public sessie: Sessie;
  private _oefeningen: Oefening[];
  public editMode = false;
  public errorMsg: string;
  public sessieFormGroup: FormGroup;

  constructor(
    public dialog: MatDialog,
    private _oefDataService: OefeningDataService,
    private _sessieDataService: SessieDataService,
    private fb: FormBuilder,
    public snackbar: MatSnackBar
  ) { }

  // Sessie form validation
  ngOnInit() {
    this.sessieFormGroup = this.fb.group({
      sessieNaam: [this.sessie.naam, [Validators.required, Validators.minLength(4)]],
      sessieBeschrijving: [this.sessie.beschrijving, [Validators.required]],
      sessieCode: [this.sessie.sessieCode]
    });
    this.getOefeningen();
  }

  ngOnChanges() {
    this.getOefeningen();
    if (this.editMode) {
      this.toggleEditMode();
    }
  }

  get oefeningen(): Oefening[] {
    return this._oefeningen;
  }

  // Open new dialog to edit exercise
  openDialog(oef: Oefening): void {
    const dialogRef = this.dialog.open(OefeningComponent, {
      minWidth: 300,
      data: oef
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        this.getOefeningen();
      }, 200);
    });
  }
  // Open new dialog to add exercise
  openEmptyDialog(): void {
    const dialogRef = this.dialog.open(OefeningEmptyComponent, {
      minWidth: 300,
      data: this.sessie
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._oefeningen.push(result);
      }
      setTimeout(() => {
        this.getOefeningen();
      }, 2000);
    });
  }

  showSnackBar(message: string) {
    this.snackbar.open(message, '', {
      duration: 2000,
    });
  }

  // Go into edit mode
  toggleEditMode(): void {
    this.editMode = !this.editMode;
    this.sessieFormGroup = this.fb.group({
      sessieNaam: [this.sessie.naam, [Validators.required, Validators.minLength(4)]],
      sessieBeschrijving: [this.sessie.beschrijving, [Validators.required]],
      sessieCode: [this.sessie.sessieCode]
    });
  }

  getOefeningen() {
    return this._oefDataService
      .getOefeningenFromSessie(this.sessie.id)
      .subscribe(
        oefs => (this._oefeningen = oefs),
        (error: HttpErrorResponse) => {
          this.errorMsg = `Error ${
            error.status
            } while trying to retrieve oefeningen: ${error.error}`;
        }
      );
  }

  onNoClick(): void {
    this.toggleEditMode();
  }

  sessieOpslaan() {
    if (this.sessieFormGroup.valid) {
      this.sessie.naam = this.sessieFormGroup.value.sessieNaam;
      this.sessie.beschrijving = this.sessieFormGroup.value.sessieBeschrijving;
      this.sessie.sessieCode = this.sessieFormGroup.value.sessieCode;
      this._sessieDataService.updateSessie(this.sessie);
      this.toggleEditMode();
      this.showSnackBar('Sessie succesvol gewijzigd!');
    }
  }
}
