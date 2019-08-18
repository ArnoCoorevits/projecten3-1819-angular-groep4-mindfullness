import { Injectable } from '@angular/core';
import { Sessie } from './sessie/sessie.model';
import { Observable } from 'rxjs/Observable';
import {
  AngularFirestore,
} from '@angular/fire/firestore';
import { v4 as uuid } from 'uuid'

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

  voegNieuweSessieToe(sessie: Sessie): void {
    const id = uuid()
    let doc = {
      'naam': sessie.naam,
      'beschrijving': sessie.beschrijving,
      'id': id
    }
    this.afs.collection('Sessies').doc(id.toString()).set(doc)
  }

  verwijderSessie(sessie: Sessie) {
    this.afs.collection('Sessies').doc(sessie.id.toString()).delete()
  }

  updateSessie(sessie: Sessie) {
    this.afs.collection('Sessies').doc(sessie.id.toString()).update(sessie)
  }
}
