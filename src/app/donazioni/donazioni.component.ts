import { Component, OnInit } from '@angular/core';
import donazioni from './donazioni.json';

@Component({
  selector: 'app-donazioni',
  templateUrl: './donazioni.component.html',
  styleUrls: ['./donazioni.component.scss']
})
export class DonazioniComponent implements OnInit {
  enti = []
  constructor() { }

  ngOnInit(): void {
    this.enti = donazioni;
  }

}
