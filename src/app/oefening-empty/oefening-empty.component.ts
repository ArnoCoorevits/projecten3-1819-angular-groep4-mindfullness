import { Component, OnInit, Inject, Input } from '@angular/core';
import { Oefening } from '../oefening/oefening.model';
import { Sessie } from '../sessie/sessie.model';
import { MatDialogRef } from '@angular/material';
import { OefeningDataService } from '../oefening-data.service';
import { FormGroup, Validators, FormBuilder } from '../../../node_modules/@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { GebruikerDataService } from '../gebruiker-data.service';

@Component({
  selector: 'app-oefening-empty',
  templateUrl: './oefening-empty.component.html',
  styleUrls: ['./oefening-empty.component.css']
})
export class OefeningEmptyComponent implements OnInit {
  @Input() public sessie: Sessie;
  private _gebruikers: Observable<any[]>;
  private _file: File;
  public oefeningFormGroup: FormGroup;
  public groepNummers = [];
  public selectedGroepnummers = [];

  constructor(public dialogRef: MatDialogRef<OefeningEmptyComponent>, @Inject(MAT_DIALOG_DATA) public data: Sessie,
    private _oefDataService: OefeningDataService, public gService: GebruikerDataService, private fb: FormBuilder) {
    this._gebruikers = this.gService.getUsers();
    this._gebruikers.subscribe(result => {
      this.setGroepen(result);
    });
  }

  // Set available groupnrs
  setGroepen(result: any[]) {
    result.forEach(gebruiker => {
      if (this.groepNummers.indexOf(gebruiker.groepnr) === -1) {
        this.groepNummers.push(gebruiker.groepnr);
      }
    });
    this.groepNummers.sort();
  }

  // Close dialog after cancel
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Exercise validation
  ngOnInit() {
    this.oefeningFormGroup = this.fb.group({
      oefeningNaam: ['', [Validators.required, Validators.minLength(4)]],
      oefeningBeschrijving: ['', [Validators.required]]
    });
  }

  // Add to group (set checked)
  checkGroep(result, nummer) {
    if (result.checked) {
      this.selectedGroepnummers.push(nummer);
    } else {
      const index: number = this.selectedGroepnummers.indexOf(nummer);
      if (index !== -1) {
        this.selectedGroepnummers.splice(index, 1);
      }
    }
  }

  // Save exercise
  oefeningOpslaan() {
    if (this.oefeningFormGroup.valid) {
      const oefening = new Oefening(this.oefeningFormGroup.value.oefeningNaam,
        this.oefeningFormGroup.value.oefeningBeschrijving, this.data.id);
      let groepen = '';
      this.selectedGroepnummers.forEach(element => {
        groepen = groepen + element + ',';
      });
      groepen = groepen.slice(0, -1);
      oefening.groepen = groepen;
      oefening.file = this._file;
      this.dialogRef.close(this._oefDataService.voegNieuweOefeningToe(oefening));
    }
  }

  // If file is uploaded set current _file
  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this._file = file;
    }
  }
}
