import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public loggedIn: Boolean = false;

  constructor(private af: AngularFireAuth) {
    if (this.af.user) {
      this.loggedIn = true;
    }
   }
}
