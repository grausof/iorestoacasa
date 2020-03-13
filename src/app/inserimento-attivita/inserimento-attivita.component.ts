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

   model: Attivita = {
    name: '',

  };

  ngOnInit(): void {
  }

}

export interface Attivita {
  name: string;

}
