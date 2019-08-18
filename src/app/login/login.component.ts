import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  options: FormGroup;
  error: any;
  public loginForm: FormGroup;

  constructor(
    public af: AngularFireAuth,
    private router: Router,
    private fb: FormBuilder,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    // Login form validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  // On login
  onSubmit() {
    if (this.loginForm.valid) {
      this.af.auth
        .signInWithEmailAndPassword(
          this.loginForm.value.email,
          this.loginForm.value.password
        )
        .then(success => {
          this.validateAdmin(success.user);
        })
        .catch(err => {
          console.log(err)
          this.error = err;
        });
    }
  }

  // Check if user is admin & route to homepage
  validateAdmin(userCredential: User) {
    const userDoc = this.afs.collection("admins").doc(userCredential.uid)
    const user = userDoc.valueChanges();
    user.subscribe(value => {
      if (value !== undefined) {
        localStorage.setItem('user', this.af.idToken + '');
        this.router.navigate(['home']);
      }
    });
  }
}
