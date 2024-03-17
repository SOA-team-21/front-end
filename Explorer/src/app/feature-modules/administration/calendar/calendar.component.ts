import { DatePipe } from '@angular/common';

import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Tour } from '../../tour-authoring/model/tour.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin],
    events: [], // Postavljamo prazno polje za događaje
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek,dayGridYear,timeGridMonth',
    },
    views: {
      dayGridMonth: {
        titleFormat: { month: 'long', year: 'numeric' },
      },
      timeGridWeek: {
        titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
      },
      dayGridYear: {
        type: 'dayGridYear',
      },
      timeGridMonth: {
        titleFormat: { year: 'numeric', month: 'long' },
      },
    },
  };

  constructor(private authService: TourAuthoringService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    const date = new Date();
    this.authService.getTours().subscribe(
      response => {
        console.log('Fetched tours response:', response);

        // Proveri da li postoji results i da li je niz
        const tours = response?.results || [];

        console.log('Results part of tours:', tours);

        // Mapiranje tura na format koji podržava FullCalendar
        const calendarEvents = tours.map(tour => ({
          title: tour.name,
          start: this.datePipe.transform(tour.arhiveTime, 'yyyy-MM-ddTHH:mm:ss'),
          // Dodajte dodatne informacije o turi prema potrebi
          // Na primer: tourId: tour.id
        }));

        // Postavljanje događaja u polje events unutar calendarOptions
        this.calendarOptions.events = calendarEvents as unknown as EventInit[];


        console.log('Mapped events:', this.calendarOptions.events);
      },
      // ...
    );
    // ...
  }
}
