import { Component, OnInit, Inject } from '@angular/core';
import { Oefening } from './oefening.model';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { OefeningDataService } from '../oefening-data.service';
import { FormGroup, Validators, FormBuilder } from '../../../node_modules/@angular/forms';
import { GebruikerDataService } from '../gebruiker-data.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-oefening',
  templateUrl: './oefening.component.html',
  styleUrls: ['./oefening.component.css']
})
export class OefeningComponent implements OnInit {
  public editMode = false;
  public oefeningFormGroup: FormGroup;
  public _file: File;

  private _gebruikers: Observable<any[]>;
  public groepNummers = [];
  public selectedGroepnummers = [];

  constructor(private _oefDataService: OefeningDataService, public gService: GebruikerDataService,
    public dialogRef: MatDialogRef<OefeningComponent>,
    @Inject(MAT_DIALOG_DATA) public oef: Oefening, private fb: FormBuilder) {
    this._gebruikers = this.gService.getUsers();
    this._gebruikers.subscribe(result => {
      this.setGroepen(result);
    });
    if (this.selectedGroepnummers.length !== 0){
      this.setSelectedGroepen();
    }
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

  // Set groupnrs of selected exercise
  setSelectedGroepen() {
    this.selectedGroepnummers = this.oef.groepen.split(',');
  }

  // Close dialog after cancel
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Exercise validation
  ngOnInit() {
    this.oefeningFormGroup = this.fb.group({
      oefeningNaam: [this.oef.naam, [Validators.required, Validators.minLength(4)]],
      oefeningBeschrijving: [this.oef.beschrijving, [Validators.required]],
    });
  }

  // Toggle editmode on/off
  public toggleEditMode(): void {
    this.editMode = !this.editMode;
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
    this.selectedGroepnummers.sort();
  }

  // Remove exercise
  oefeningVerwijderen() {
    if (confirm('Ben je zeker dat je ' + this.oef.naam + ' wilt verwijderen?')) {
      this._oefDataService.verwijderOefening(this.oef);
      this.dialogRef.close();
    }
  }

  // Save exercise
  oefeningOpslaan() {
    if (this.oefeningFormGroup.valid) {
      this.oef.naam = this.oefeningFormGroup.value.oefeningNaam;
      this.oef.beschrijving = this.oefeningFormGroup.value.oefeningBeschrijving;
      let groepen = '';
      this.selectedGroepnummers.forEach(element => {
        groepen = groepen + element + ',';
      });
      groepen = groepen.slice(0, -1);
      this.oef.groepen = groepen;
      if (this._file != null){
        this.oef.file = this._file;
      }
      this.dialogRef.close(this._oefDataService.updateOefening(this.oef));
    }
  }

  // If file is uploaded set current _file
  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this._file = file;
    }
  }

  // Select a new file
  openBestand() {
    window.open(this.oef.url);
  }

  isChecked(oef: Oefening, nummer): boolean {
    if (oef.groepen && oef.groepen.indexOf(nummer) > -1) {
      return true;
    }
    return false;
  }
}
