import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { _throw } from 'rxjs/observable/throw';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GebruikerDataService {

  constructor(private afs: AngularFirestore) {}

  getUsers(): Observable<any[]> {
    const gebruikerCollection = this.afs.collection('Gebruiker')
    const gebruikers: Observable<any> = gebruikerCollection.valueChanges()
    return gebruikers
  }

  getUserById(id: string): Observable<any> {
    const gebruikerDoc = this.afs.collection("Gebruiker").doc(id)
    const gebruiker: Observable<any> = gebruikerDoc.valueChanges()
    return gebruiker
  }

  updateUser(id: string, user): void {
    const gebruikerDoc = this.afs.collection("Gebruiker").doc(id)
    gebruikerDoc.update(user)
  }

  removeUser(id: string): void {
    this.afs.collection('Gebruiker').doc(id).delete()
  }
}
