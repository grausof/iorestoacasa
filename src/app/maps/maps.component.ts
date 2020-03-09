import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  title = 'coviditalyng';
  configUrl = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json';
  datiRegione;

  constructor(private http: HttpClient) {
    
   }

  ngOnInit(): void {
    this.http.get(this.configUrl).subscribe((data: any) => {
      this.datiRegione = data;
  });
  }


}
