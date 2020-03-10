import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { 

  }

  static dateToString(today){
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    let data_string = yyyy+"-"+mm+"-"+dd+" 18:00:00";
    return data_string;
  }

  static calculateSum(datiPerRegione, detailValue){

    detailValue.totale_casi=0;
    detailValue.tamponi=0;
    detailValue.dimessi_guariti=0;
    detailValue.terapia_intensiva=0;
    detailValue.ricoverati_con_sintomi=0;
    detailValue.isolamento_domiciliare=0;

    for (let regione in datiPerRegione) {
        let element = datiPerRegione[regione];
        detailValue.denominazione_regione = 'Italia'
        detailValue.totale_casi+=element.totale_casi
        detailValue.tamponi+=element.tamponi
        detailValue.dimessi_guariti+=element.dimessi_guariti
        detailValue.terapia_intensiva+=element.terapia_intensiva
        detailValue.ricoverati_con_sintomi+=element.ricoverati_con_sintomi
        detailValue.isolamento_domiciliare+=element.dimessi_guariti
        detailValue.deceduti+=element.deceduti
    }
    return detailValue;

  }
  static mapRegion(region){
    if(region=="IT-21"){
      return "Piemonte"
    }
    if(region=="IT-23"){
      return "Valle d'Aosta"
    }
    if(region=="IT-25"){
      return "Lombardia"
    }
    if(region=="IT-32"){
      return "Trento"
    }
    if(region=="IT-34"){
      return "Veneto"
    }
    if(region=="IT-36"){
      return "Friuli Venezia Giulia"
    }
    if(region=="IT-42"){
      return "Liguria"
    }
    if(region=="IT-45"){
      return "Emilia Romagna"
    }
    if(region=="IT-52"){
      return "Toscana"
    }
    if(region=="IT-55"){
      return "Umbria"
    }
    if(region=="IT-57"){
      return "Marche"
    }
    if(region=="IT-62"){
      return "Lazio"
    }
    if(region=="IT-65"){
      return "Abruzzo"
    }
    if(region=="IT-67"){
      return "Molise"
    } 
    if(region=="IT-72"){
      return "Campania"
    }
    if(region=="IT-75"){
      return "Puglia"
    } 
    if(region=="IT-77"){
      return "Basilicata"
    } 
    if(region=="IT-78"){
      return "Calabria"
    } 
    if(region=="IT-82"){
      return "Sicilia"
    } 
    if(region=="IT-88"){
      return "Sardegna"
    } 
    return null;
  }
}
