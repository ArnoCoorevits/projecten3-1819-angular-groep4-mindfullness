import { Component, OnInit } from '@angular/core';
import { Sessie } from '../sessie/sessie.model';
import { MatDialogRef } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '../../../node_modules/@angular/forms';
import { SessieDataService } from '../sessie-data.service';

@Component({
  selector: 'app-sessie-empty',
  templateUrl: './sessie-empty.component.html',
  styleUrls: ['./sessie-empty.component.css']
})
export class SessieEmptyComponent implements OnInit {
  public sessieFormGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SessieEmptyComponent>,
    private _sessieDataService: SessieDataService,
    private fb: FormBuilder
  ) { }

  // Sessie form validation
  ngOnInit() {
    this.sessieFormGroup = this.fb.group({
      sessieNaam: ['', [Validators.required, Validators.minLength(4)]],
      sessieBeschrijving: ['', [Validators.required]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  sessieOpslaan() {
    if (this.sessieFormGroup.valid) {
      const sessie = new Sessie(
        this.sessieFormGroup.value.sessieNaam,
        this.sessieFormGroup.value.sessieBeschrijving
      );

      this.dialogRef.close(
        this._sessieDataService.voegNieuweSessieToe(sessie)
      );
    }
  }
}
