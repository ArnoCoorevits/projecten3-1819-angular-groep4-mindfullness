import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AngularFireDatabase} from "@angular/fire/database";

import { FormGroup, FormBuilder } from '@angular/forms';
import { GebruikerDataService } from '../gebruiker-data.service';
import { Observable } from 'rxjs';
@Component({
    selector: 'app-dialog',
    templateUrl: './aankondigingdialog.html',
    styleUrls: ['./aankondigingdialog.css'],
   
  })
  
export class AankondigingenComponentDialog implements OnInit {
    form: FormGroup;
    aankondiging : string;
    date : Date;
    groep : string;
    private _gebruikers: Observable<any[]>;
    public groepNummers = [];

constructor(private dialog: MatDialog, private db :AngularFireDatabase ,
    private fb: FormBuilder,public gService: GebruikerDataService,
    private dialogRef: MatDialogRef<AankondigingenComponentDialog>,
   @Inject(MAT_DIALOG_DATA) public data) {
  
    this._gebruikers = this.gService.getUsers();
    this._gebruikers.subscribe(result => {
      this.setGroepen(result);
      
    });
    
  }

  ngOnInit() {
    this.form = this.fb.group({
      aankondiging: [this.aankondiging,[]],
      date: [this.date,[]],
      groep: [this.groep,[]],
      });
     
  }

  setGroepen(result: any[]) {
    result.forEach(gebruiker => {
      if (this.groepNummers.indexOf(gebruiker.groepnr) === -1) {
        this.groepNummers.push(gebruiker.groepnr);
      }
    });
    this.groepNummers.sort();
  }
  save() {
    this.dialogRef.close(this.form.value);
}

close() {
    this.dialogRef.close();
}
}