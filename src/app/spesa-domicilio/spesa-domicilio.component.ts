import { Component, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";

import am4geodata_italyLow from "@amcharts/amcharts4-geodata/italyLow";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {UtilityService} from "../utility.service"

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

am4core.useTheme(am4themes_kelly);
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-spesa-domicilio',
  templateUrl: './spesa-domicilio.component.html',
  styleUrls: ['./spesa-domicilio.component.scss']
})
export class SpesaDomicilioComponent implements OnInit {

  detailRegioniUrl = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json';
  currentRegion = null;
  province = []
  currentProv;
  currentCat;
  attivita=[];
  attivitaFiltered = [];
  db: AngularFirestore;


  elencoRegioni = {"Marche": {"province": ["AN", "AP", "FM", "MC", "PU"], "capoluoghi": ["Ancona", "Ascoli Piceno", "Fermo", "Macerata", "Pesaro e Urbino"], "nome": "Marche"}, "Toscana": {"province": ["AR", "FI", "GR", "LI", "LU", "MS", "PI", "PT", "PO", "SI"], "capoluoghi": ["Arezzo", "Firenze", "Grosseto", "Livorno", "Lucca", "Massa e Carrara", "Pisa", "Pistoia", "Prato", "Siena"], "nome": "Toscana"}, "Calabria": {"province": ["CZ", "CS", "KR", "RC", "VV"], "capoluoghi": ["Catanzaro", "Cosenza", "Crotone", "Reggio Calabria", "Vibo Valentia"], "nome": "Calabria"}, "Friuli-Venezia Giulia": {"province": ["GO", "PN", "TS", "UD"], "capoluoghi": ["Gorizia", "Pordenone", "Trieste", "Udine"], "nome": "Friuli-Venezia Giulia"}, "Molise": {"province": ["CB", "IS"], "capoluoghi": ["Campobasso", "Isernia"], "nome": "Molise"}, "Lazio": {"province": ["FR", "LT", "RI", "RM", "VT"], "capoluoghi": ["Frosinone", "Latina", "Rieti", "Roma", "Viterbo"], "nome": "Lazio"}, "Liguria": {"province": ["GE", "IM", "SP", "SV"], "capoluoghi": ["Genova", "Imperia", "La Spezia", "Savona"], "nome": "Liguria"}, "Campania": {"province": ["AV", "BN", "CE", "NA", "SA"], "capoluoghi": ["Avellino", "Benevento", "Caserta", "Napoli", "Salerno"], "nome": "Campania"}, "Sardegna": {"province": ["CA", "CI", "VS", "NU", "OG", "OT", "OR", "SS"], "capoluoghi": ["Cagliari", "Carbonia-Iglesias", "Medio Campidano", "Nuoro", "Ogliastra", "Olbia-Tempio", "Oristano", "Sassari"], "nome": "Sardegna"}, "Abruzzo": {"province": ["CH", "AQ", "PE", "TE"], "capoluoghi": ["Chieti", "L'Aquila", "Pescara", "Teramo"], "nome": "Abruzzo"}, "Trentino-Alto Adige": {"province": ["BZ", "TN"], "capoluoghi": ["Bolzano", "Trento"], "nome": "Trentino-Alto Adige"}, "Piemonte": {"province": ["AL", "AT", "BI", "CN", "NO", "TO", "VB", "VC"], "capoluoghi": ["Alessandria", "Asti", "Biella", "Cuneo", "Novara", "Torino", "Verbano Cusio Ossola", "Vercelli"], "nome": "Piemonte"}, "Sicilia": {"province": ["AG", "CL", "CT", "EN", "ME", "PA", "RG", "SR", "TP"], "capoluoghi": ["Agrigento", "Caltanissetta", "Catania", "Enna", "Messina", "Palermo", "Ragusa", "Siracusa", "Trapani"], "nome": "Sicilia"}, "Emilia-Romagna": {"province": ["BO", "FE", "FC", "MO", "PR", "PC", "RA", "RE", "RN"], "capoluoghi": ["Bologna", "Ferrara", "Forl\u00ec-Cesena", "Modena", "Parma", "Piacenza", "Ravenna", "Reggio Emilia", "Rimini"], "nome": "Emilia-Romagna"}, "Veneto": {"province": ["BL", "PD", "RO", "TV", "VE", "VR", "VI"], "capoluoghi": ["Belluno", "Padova", "Rovigo", "Treviso", "Venezia", "Verona", "Vicenza"], "nome": "Veneto"}, "Basilicata": {"province": ["MT", "PZ"], "capoluoghi": ["Matera", "Potenza"], "nome": "Basilicata"}, "Puglia": {"province": ["BA", "BT", "BR", "LE", "FG", "TA"], "capoluoghi": ["Bari", "Barletta-Andria-Trani", "Brindisi", "Lecce", "Foggia", "Taranto"], "nome": "Puglia"}, "Lombardia": {"province": ["BG", "BS", "CO", "CR", "LC", "LO", "MN", "MI", "MB", "PV", "SO", "VA"], "capoluoghi": ["Bergamo", "Brescia", "Como", "Cremona", "Lecco", "Lodi", "Mantova", "Milano", "Monza e Brianza", "Pavia", "Sondrio", "Varese"], "nome": "Lombardia"}, "Umbria": {"province": ["PG", "TR"], "capoluoghi": ["Perugia", "Terni"], "nome": "Umbria"}, "Valle d'Aosta": {"province": ["AO"], "capoluoghi": ["Aosta"], "nome": "Valle d'Aosta"}}
  constructor(db: AngularFirestore) { 
    this.db = db;
  }


  makeQuery(){
    if(this.currentProv){

      this.db.collection('attivita', ref => {
        let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
        if (this.currentProv){query = query.where('prov', '==', this.currentProv)};
        if (this.currentCat && this.currentCat!='all'){
          query = query.where('category', '==', this.currentCat)
        }
        return query;
      }).valueChanges().subscribe(attivita => {
        this.attivita=attivita;
        this.onCityChange('');
      });;
    }
  }


  onCityChange(city:string){
    console.log("City change")
    this.attivitaFiltered = this.attivita.filter(function (att) {
      if(city!=''){
        city = city.toLowerCase();
        let currentCity = String(att.city).toLowerCase()
        return currentCity.includes(city);
      }
      else
        return true;
    });
    
  }


  ngOnInit(): void {
    
    let chart = am4core.create("chartdiv", am4maps.MapChart);
    // Set map definition
    chart.geodata = am4geodata_italyLow;
    // Set projection
    chart.projection = new am4maps.projections.Miller();
    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.exclude = ["FR-H"];
    polygonSeries.useGeodata = true;

    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.polygon.fillOpacity = 0.6;


    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(0);


    // Create active state
    let activeState = polygonTemplate.states.create("active");
    activeState.properties.fill = chart.colors.getIndex(4);
    let lastActiveTarget = null;

    // Create an event to toggle "active" state
    polygonTemplate.events.on("hit", function(ev) {
      ev.target.isActive = !ev.target.isActive;
      if(lastActiveTarget){
        lastActiveTarget.isActive = false;
      }
      lastActiveTarget = ev.target;
      let selectedRegion = ev.target.dataItem.dataContext['name'];

      if(!ev.target.isActive){
        selectedRegion = undefined;
      }
      

      this.currentRegion = selectedRegion;
      this.province = this.elencoRegioni[this.currentRegion].province
      this.currentProv = this.province[0]
      this.makeQuery();

      ev.target.series.chart.zoomToMapObject(ev.target);
      

    }, this);


    // Add image series
    let imageSeries = chart.series.push(new am4maps.MapImageSeries());
    imageSeries.mapImages.template.propertyFields.longitude = "longitude";
    imageSeries.mapImages.template.propertyFields.latitude = "latitude";
    imageSeries.mapImages.template.tooltipText = "{title}";
    imageSeries.mapImages.template.propertyFields.url = "url";

    let circle = imageSeries.mapImages.template.createChild(am4core.Circle);
    circle.radius = 2;
    circle.propertyFields.fill = "color";


    let colorSet = new am4core.ColorSet();

    imageSeries.data = [ ]
    
    /*
    for (let prov in negozi) {
      let value = negozi[prov];
      value.forEach(negozio => {
        if("latitude" in negozio && "longitude" in negozio){
          var n = {
            "title": negozio["city"]+" ("+negozio["province"]+")",
            "latitude": negozio['latitude'],
            "longitude": negozio['longitude'],
            "color":colorSet.next()
          };
          imageSeries.data.push(n);
        }
      });
    }*/


    


  }

  onProvChange(value:string){
    this.currentProv=this.province[value];
    console.log(this.currentProv)


    this.makeQuery();
  }
  
  onCatChange(value:string){
  this.currentCat = value
  
  this.makeQuery();
  }

  

}
