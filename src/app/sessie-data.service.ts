import { Injectable } from '@angular/core';
import { Sessie } from './sessie/sessie.model';
import { Observable } from 'rxjs/Observable';
import {
  AngularFirestore,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SessieDataService {
  constructor(private afs: AngularFirestore) {}

  getSessies(): Observable<Sessie[]>{
    let sessieCollection = this.afs.collection('Sessies')
    let sessies: Observable<any> = sessieCollection.valueChanges()
    return sessies
  }

  getSessie(sessieId: number): Observable<Sessie> {
    let sessieDoc = this.afs.collection("Sessies").doc(sessieId.toString())
    let sessie: Observable<any> = sessieDoc.valueChanges()
    return sessie
  }

  updateSessie(sessie: Sessie) {
    this.afs.collection('Sessies').doc(sessie.id.toString()).update(sessie)
  }
}
