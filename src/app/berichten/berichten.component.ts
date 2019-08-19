import { Component, OnInit, OnDestroy } from "@angular/core";
import { AngularFireList } from '@angular/fire/database';
import { Observable, Subscription } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "app-berichten",
  templateUrl: "./berichten.component.html",
  styleUrls: ["./berichten.component.css"]
})
export class BerichtenComponent implements OnInit, OnDestroy {
  
  chatRef$: AngularFireList<any>;
  public klanten: ChatUser[] = [];
  public ongelezen: number[] = [];

  public gekozenChatUser: ChatUser = null;

  public gebruikers: Observable<any[]>
  public chat$: Observable<any[]>;
  public messagesfb$: Observable<any>;
  public gelezenMessages$: Observable<any>;


  private huidigeGebruikerSub: Subscription;
  private gelezenChecker: Subscription;
  private initieleSubscription: Subscription;

  public name: string = "Psycholoog";
  public textChat: string = null;
  public messages: Message[] = null;

  constructor(public afs: AngularFirestore, public af: AngularFireAuth) {
    this.chat$ = afs.collection("Chat").snapshotChanges();
    this.initieerLijsten();
  }

  ngOnInit() {}

  //sluit alle observables
  ngOnDestroy() {
    this.initieleSubscription.unsubscribe();
    if (this.huidigeGebruikerSub) {
      this.huidigeGebruikerSub.unsubscribe();
    }
    if (this.gelezenChecker) {
      this.gelezenChecker.unsubscribe();
    }
  }

  //vult observables in om de lijsten van chat weer te geven.
  initieerLijsten() {
     this.initieleSubscription = this.chat$.subscribe(actions => {
      this.klanten = [];
      this.ongelezen = [];
      actions.forEach(action => {
        this.zoekKlant(action.email).subscribe(value => {
          let chatUser = new ChatUser();
          chatUser.naam = value["name"];
          chatUser.email = action.email
          this.klanten.push(chatUser);
        });
        this.geefWeerOngelezen(action.email).subscribe(value => {
          let waarde: number = 0;
          value.forEach(v => {
            if (!v.gelezen) {
              waarde++;
            }
          });
          this.ongelezen.push(waarde);
        });
      });
    });
  }

  //haalt de naam van de klant op uit hun id die bij de chatberichten hoort en geeft deze terug als een observable.
  zoekKlant(email: String): Observable<any> {
    return this.afs.collection("Gebruiker").doc(email.toString()).valueChanges();
  }

  //Sluit huidige subscriptions en zet de huidig geselecteerde gebruiker, roept ook de getgesprekken methode op.
  kiesGesprek(user: ChatUser) {
    if (this.huidigeGebruikerSub) {
      this.huidigeGebruikerSub.unsubscribe();
    }
    if (this.gelezenChecker) {
      this.gelezenChecker.unsubscribe();
    }
    this.gekozenChatUser = user;
    this.messages = [];
    this.messagesfb$ = this.afs.collection("Chat").doc(this.gekozenChatUser.email.toString()).collection("messages").valueChanges();
    this.huidigeGebruikerSub = this.messagesfb$.subscribe(actions => {
      this.messages = [];
      actions.forEach(a => {
        let message = new Message();
        message.content = a.content;
        message.messageTime = a.messageTime;
        message.messageUser = a.messageUser;
        message.admin = true;
        //als er geen admin veldje bestaat, dan word de username van de messages opgehaald uit de db en ingesteld.
        if (a.admin === undefined) {
          message.admin = false;
          message.messageUser = this.gekozenChatUser.naam;
        }
        this.messages.push(message);
      });
      this.controleerGelezen();
      this.messages = this.messages.sort(function (a,b) {
        return (+a.messageTime - +b.messageTime)
      })
    });
  }

  //Geeft observable terug die overeenkomt met de lijst van messages van gebruiker adh van zijn uid.
  geefWeerOngelezen(email: String): Observable<any> {
    return this.afs.collection("Chat").doc(email.toString()).collection("messages").valueChanges();
  }

  //steekt adh van de gekozen gebruiker alle veldjes gelezen op true.
  controleerGelezen() {
    this.gelezenMessages$ = this.afs.collection("Chat").doc(this.gekozenChatUser.email.toString()).collection("messages").valueChanges();
    this.gelezenChecker = this.gelezenMessages$.subscribe(actions => {
      this.initieleSubscription;
      actions.forEach(a => {
        this.afs.collection("Chat").doc(this.gekozenChatUser.email.toString()).collection("messages").doc(a.id).update({gelezen: true});
      });
    });
  }

  //Haalt de tekst op uit het inputveldje, controleerd of deze leeg is en stuurt een bericht naar firebase met de huidige datum, gebruiker en zet het inputveldje dan op leeg
  stuurBericht(tekst: String) {
    if (tekst != "") {
      let messageTime = Date.now();

      //TODO: Haal huidige admin op en vul hier in.
      let messageUser = this.name;

      //workaround omdat de database niet ingevuld is met messageUser uit de db op messages vanuit de android kant.
      let admin = true;
      let gelezen = true;
      this.afs.collection("Chat").doc(this.gekozenChatUser.email.toString())
        .collection("messages").doc((this.messages.length+1).toString()).set({ content: tekst, gelezen, messageTime, messageUser, admin });

      this.textChat = "";
    }
  }
}

export class Message {
  content: String;
  messageTime: String;
  messageUser: String;
  admin: boolean;
}

export class ChatUser {
  naam: String;
  email: String;
  ongelezen: number;
}