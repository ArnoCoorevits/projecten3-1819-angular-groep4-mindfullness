import { Injectable } from '@angular/core';
import { Oefening } from './oefening/oefening.model';
import { Observable } from 'rxjs/Observable';
import { Feedback } from './feedback/feedback.model';
import { AngularFireStorage } from '@angular/fire/storage'
import {
  AngularFirestore,
} from '@angular/fire/firestore';
import { v4 as uuid } from 'uuid'
import { finalize } from 'rxjs/operators';

@Injectable()
export class OefeningDataService {
  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) {}

  getOefeningen(): Observable<Oefening[]> {
    const oefeningCollection = this.afs.collection('Oefeningen')
    const oefeningen: Observable<any> = oefeningCollection.valueChanges()
    return oefeningen
  }

  getOefeningenFromSessie(sessieId: number): Observable<Oefening[]> {
    const oefeningCollection = this.afs.collection('Oefeningen', oef => oef.where('sId', '==', sessieId.toString()))
    const oefeningen: Observable<any> = oefeningCollection.valueChanges()
    return oefeningen
  }

  getOefening(oefeningId: number): Observable<Oefening> {
    const oefeningDoc = this.afs.collection("Oefeningen").doc(oefeningId.toString())
    const oefening: Observable<any> = oefeningDoc.valueChanges()
    return oefening
  }

  voegNieuweOefeningToe(oefening: Oefening){
    const id = uuid()
    const ref = this.storage.ref(`PDF/${oefening.file.name}`)
    const task = this.storage.upload(`PDF/${oefening.file.name}`, oefening.file)
    task.snapshotChanges().pipe(
      finalize(() => {
        let url = ''
        ref.getDownloadURL().subscribe(downloadUrl => {
          url = downloadUrl

          const doc = {
            'naam': oefening.naam,
            'beschrijving': oefening.beschrijving,
            'mimeType': oefening.file.type,
            'fileNaam': oefening.file.name,
            'sId': oefening.sessieId.toString(),
            'id': id,
            'datumGemaakt': oefening.datumGemaakt,
            'url': url,
            'groepen': oefening.groepen
          }
          this.afs.collection('Oefeningen').doc(id.toString()).set(doc)
        })
      })
    ).subscribe()
  }

  verwijderOefening(oefening: Oefening) {
    this.afs.collection('Oefeningen').doc(oefening.id.toString()).delete()
  }

  updateOefening(oefening: Oefening) {
    this.afs.collection('Oefeningen').doc(oefening.id.toString()).set(oefening, { merge: true })
  }

  getFeedbackFromOefening(oefeningId: number): Observable<Feedback[]> {
    let feedbackCollection = this.afs.collection('Feedback', oef => oef.where('oefId', '==', oefeningId))
    let feedbacks: Observable<any> = feedbackCollection.valueChanges()
    return feedbacks
  }

  verwijderFeedbackOefening(oefeningId: number) {
    this.afs.collection('Feedback').doc(oefeningId.toString()).delete()
  }
}
