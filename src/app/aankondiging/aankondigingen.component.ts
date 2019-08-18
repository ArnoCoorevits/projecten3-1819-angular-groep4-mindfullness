import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  Injectable
} from "@angular/core";
import { startOfDay, isSameDay, isSameMonth } from "date-fns";
import { Subject } from "rxjs";
import { CalendarView } from "angular-calendar";
import { CalendarEvent } from "./calendarUtils";
import { MatDialog } from "@angular/material/dialog";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { Announcement } from "./aankondiging";
import { AankondigingenComponentDialog } from "../aankondiging-empty/aankondigingdialog.component";
import { Observable } from "rxjs";

@Component({
  selector: "app-aankondigingen",
  templateUrl: "./aankondigingen.component.html",
  styleUrls: ["./aankondigingen.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Injectable()
export class AankondigingenComponent implements OnInit {
  @ViewChild("modalContent")
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;
  announcementList: AngularFireList<Announcement> = null;
  announcementfirebase: AngularFireList<Announcement>;
  locale: string = "nl-BE";
  public _announcements: Announcement[];
  items: Observable<any>;
  item: Observable<any>;
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  constructor(private dialog: MatDialog, private db: AngularFireDatabase) {}

  ngOnInit() {
    this.db
      .list<Announcement>("/Announcement")
      .valueChanges()
      .subscribe((res: Announcement[]) => {
        res.forEach(item => {
          this.events.push({
            title: item._text,
            start: startOfDay(item._date),
            groep: item._group,
            draggable: true,
            resizable: {
              beforeStart: true,
              afterEnd: true
            }
          });
          this.refresh.next();
        });
      });
  }

  openDialog(): void {
    const dialogConfig = this.dialog.open(AankondigingenComponentDialog, {
      minWidth: 300,
      maxHeight: 300
    });
    var d = new Date();
    dialogConfig
      .afterClosed()
      .subscribe(data =>
        this.addAnnouncement(
          new Announcement(
            String(d.getTime()),
            data.aankondiging,
            data.date.getTime(),
            data.groep
          )
        )
      );
  }

  addAnnouncement(announcement: Announcement): void {
    this.db.list<Announcement>("/Announcement").push(announcement);
    window.location.reload();
  }
}
