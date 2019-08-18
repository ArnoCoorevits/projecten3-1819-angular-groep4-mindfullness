import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule,
  MatIconModule, MatListModule, MatCardModule, MatDatepickerModule} from '@angular/material';
import { MatButtonToggleModule, MatDialogModule, MatFormFieldModule,
  MatInputModule, MatTableModule ,MatNativeDateModule} from '@angular/material';
import { MatSelectModule, MatCheckboxModule,MatSnackBarModule } from '@angular/material';
import { MatTabsModule } from '@angular/material';
import { HomeComponent } from './home/home.component';
import { SessieLijstComponent } from './sessie-lijst/sessie-lijst.component';
import { SessieComponent } from './sessie/sessie.component';
import { OefeningComponent } from './oefening/oefening.component';
import { OefeningEmptyComponent } from './oefening-empty/oefening-empty.component';
import { OefeningDataService } from './oefening-data.service';
import { SessieDataService } from './sessie-data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SessieEmptyComponent } from './sessie-empty/sessie-empty.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './authentication.service';
import { AuthGuardService } from './auth-guard.service';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { firebaseAndroidConfig } from 'src/environments/environment';
import { AngularFireDatabaseModule  } from 'angularfire2/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage'
import { RegistrerenComponent } from './registreren/registreren.component';
import { GebruikersComponent } from './gebruikers/gebruikers.component';
import { AankondigingenComponentDialog } from './aankondiging-empty/aankondigingdialog.component';
import { AankondigingenComponent} from './aankondiging/aankondigingen.component';
import { CommonModule, registerLocaleData } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BerichtenComponent } from './berichten/berichten.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ChartsModule } from 'ng2-charts';
import { VerwijderAlertComponent } from './verwijder-alert/verwijder-alert.component';
import localeNl from '@angular/common/locales/nl-BE';

/** test@test.com   123456 */

registerLocaleData(localeNl);

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    SessieLijstComponent,
    SessieComponent,
    OefeningComponent,
    OefeningEmptyComponent,
    SessieEmptyComponent,
    LoginComponent,
    RegistrerenComponent,
    GebruikersComponent,

    AankondigingenComponent,
    AankondigingenComponentDialog,
    BerichtenComponent,
    FeedbackComponent,
    VerwijderAlertComponent
  ],
  entryComponents: [OefeningComponent, OefeningEmptyComponent, SessieEmptyComponent,
    AankondigingenComponentDialog, VerwijderAlertComponent],

  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatTabsModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSnackBarModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseAndroidConfig, 'angular'),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    MatNativeDateModule,
    CommonModule,
    FormsModule,
    NgbModalModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
  ],
  providers: [ AuthenticationService, AuthGuardService, OefeningDataService, SessieDataService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
