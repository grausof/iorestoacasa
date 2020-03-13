import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';


@Component({
  selector: 'app-inserimento-attivita',
  templateUrl: './inserimento-attivita.component.html',
  styleUrls: ['./inserimento-attivita.component.scss']
})
export class InserimentoAttivitaComponent implements OnInit {

  private attivitaCollection: AngularFirestoreCollection<Attivita>;
  attivita: Observable<Attivita[]>;

  constructor(db: AngularFirestore) {
    this.attivitaCollection = db.collection<Attivita>('attivita');
    this.attivita = this.attivitaCollection.valueChanges();

  }
  
  submitted = false;
  error = false;

  onSubmit() {
     this.submitted = true; 
     this.attivitaCollection.add(this.model).then(success=>{
       console.log("OK");
       this.error = false;
     }, error =>{
      console.log("ERROR");
      this.error = true;
     })
  }


  model: Attivita = {
    name: '',
    category: '',
    description:'',
    website:'',
    email:'',
    phone:'',
    address:'',
    city:'',
    cap:'',
    prov:'',
  };

  ngOnInit(): void {
  }

  

}

(function() {
  'use strict';
  window.addEventListener('load', function() {
    var forms = document.getElementsByClassName('needs-validation');
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
      }, false);
      form.classList.add('was-validated');
    });
  }, false);
})();


export interface Attivita {
  name: string,
  category: string,
  description:string,
  website:string,
  email: string,
  phone: string,
  address: string,
  city: string,
  cap: string,
  prov: string,
  
}
