import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

interface User {
  uid: string;
  email: string;
  displayName?: string;
  admin: boolean;
}

@Component({
  selector: 'app-registreren',
  templateUrl: './registreren.component.html',
  styleUrls: ['./registreren.component.css']
})
export class RegistrerenComponent implements OnInit {
  options: FormGroup;
  error: any;
  public loginForm: FormGroup;

  constructor(public af: AngularFireAuth, private router: Router, private fb: FormBuilder, private afs: AngularFirestore ) { }

  // Register validation
  ngOnInit() {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Register
  onSubmit() {
    if (this.loginForm.valid) {
      this.af.auth.createUserWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password)
        .then((result) => {
          this.updateUserData(result.user);
          localStorage.setItem('user', this.af.idToken + '');
          this.router.navigate(['/']);
        }).catch((err) => {
          this.error = err;
        });
    }
  }

  // Update user in database (set admin to true)
  private updateUserData(user) {
    const userDoc = this.afs.collection("admins").doc(user.uid)
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: this.loginForm.value.name,
      admin: true
    };
    return userDoc.set(data, { merge: true });
  }
}
