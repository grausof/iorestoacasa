import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';


@Component({
  selector: 'app-inserimento-attivita',
  templateUrl: './inserimento-attivita.component.html',
  styleUrls: ['./inserimento-attivita.component.scss']
})
export class InserimentoAttivitaComponent implements OnInit {

  
  constructor(db: AngularFirestore) {
    
   }

   model: Appointment = {
    name: '',
    mail: '',
    dayOfTheWeek: 'Lunedì',
    office: 'ufficio_A',
    application0: false,
    application1: false,
    application2: false
  };

  ngOnInit(): void {
  }

}

export interface Appointment {
  name: string;
  mail: string;
  dayOfTheWeek: string;
  office: string;
  application0: boolean;
  application1: boolean;
  application2: boolean;
}
