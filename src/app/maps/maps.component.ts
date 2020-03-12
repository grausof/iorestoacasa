import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";

import am4geodata_italyLow from "@amcharts/amcharts4-geodata/italyLow";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {UtilityService} from "../utility.service"

am4core.useTheme(am4themes_kelly);
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  title = 'coviditalyng';
  detailRegioniUrl = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json';
  detailProvinceUrl = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-province.json';
  temporallUrl = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json';

  datiPerRegione = {}
  maxValue = 0
  showCloseButton = false;
  lastUpdate = ""
  temporalData = []
  showRegion = true;
  detailValue = {
    denominazione_regione : "Italia",
    totale_casi : 0,
    tamponi : 0,
    dimessi_guariti :  0,
    terapia_intensiva : 0,
    ricoverati_con_sintomi : 0,
    isolamento_domiciliare : 0,
    deceduti : 0,
  }
  colorSet = new am4core.ColorSet();
  mapChart;
  imageSeries;
  circle;
  circle2;
  numeriEmergenza = {
    'Italia':'1500',
    'Basilicata':'800 99 66 88',
    'Calabria':'800 76 76 76',
    'Campania':'800 90 96 99',
    'Emilia Romagna':'800 033 033',
    'Friuli V. G.': '800 500 300',
    'Lazio': '800 11 88 00',
    'Lombardia': '800 89 45 45',
    'Marche': '800 93 66 77',
    'Piemonte':'800 19 20 20',
    'P.A. Trento':'800 867 388',
    'P.A. Bolzano':'800 751 751',
    'Puglia':'800 713 931',
    'Sardegna': '800 311 377',
    'Sicilia': '800 45 87 87',
    'Toscana': '800 55 60 60',
    'Umbria': '800 63 63 63',
    'Valle d\'Aosta': '800 122 121',
    'Veneto': '800 462 340',
    'Abruzzo': '800 860 146',
    'Liguria': '112',
    'Molise': '0874 313000'
  }


  constructor(private http: HttpClient) {

  }

  closeButton(){
    this.detailValue = UtilityService.calculateSum(this.datiPerRegione, this.detailValue);
    this.showCloseButton = false;
  }

  requestToServer( url){
    let arrayDetail = []
    let dateMaps = {}
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    let todaydate = UtilityService.dateToString(new Date());
    let yesterdaydate = UtilityService.dateToString(yesterday);
    
    this.http.get(url).subscribe((data: any) => {

      this.datiPerRegione = {}
      
      data.forEach(element => {
        let data = element.data;
        data = data.split(" ")[0];
        if (!(data in dateMaps)){
          dateMaps[data] = [];
        } 
        dateMaps[data].push(element)
      });

      let date;
      if (todaydate in dateMaps){
        date = dateMaps[todaydate];
        this.lastUpdate = todaydate;
      } else {
        date = dateMaps[yesterdaydate];
        this.lastUpdate = yesterdaydate;
      }
      
      date.forEach(element => {
        let value = element.totale_casi;
        if(value > this.maxValue){
          this.maxValue = value
        }
        let title = element.denominazione_regione
        if(!this.showRegion){
          title = element.denominazione_provincia
        }
        let v = {
          "title": title,
          "latitude": element.lat,
          "longitude": element.long,
          "color":this.colorSet.next(),
          "value":element.totale_casi
        } 
        arrayDetail.push(v);
        this.datiPerRegione[element.denominazione_regione]=element;

      });
      if(this.showRegion){
        this.detailValue = UtilityService.calculateSum(this.datiPerRegione, this.detailValue);
      }
      
      this.imageSeries.data=arrayDetail;
      this.mapChart.validateData();
  });
  }

  switchToRegion(){
    this.showRegion = true;
    this.requestToServer(  this.detailRegioniUrl);
    this.circle.radius = 3;
    this.circle2.radius = 3;

  }

  switchToProv(){
    this.showRegion = false;
    this.requestToServer( this.detailProvinceUrl);

    this.circle.radius = 1;
    this.circle2.radius = 1;


  }


  ngOnInit(): void {

  let title = "ITALIA";
  let currentMap = "italyLow";
  
  /* MAP Chart start */
  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  this.mapChart = am4core.create("chartdiv", am4maps.MapChart);
  

  // Set map definition
  this.mapChart.geodata = am4geodata_italyLow;
  

  // Set projection
  this.mapChart.projection = new am4maps.projections.Miller();

  // Create map polygon series
  let polygonSeries = this.mapChart.series.push(new am4maps.MapPolygonSeries());

  polygonSeries.exclude = ["FR-H"];
  // Make map load polygon (like country names) data from GeoJSON
  polygonSeries.useGeodata = true;

  // Configure series
  let polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.tooltipText = "{name}";
  polygonTemplate.polygon.fillOpacity = 0.6;


  // Create hover state and set alternative fill color
  let hs = polygonTemplate.states.create("hover");
  hs.properties.fill = this.mapChart.colors.getIndex(0);

  this.imageSeries = this.mapChart.series.push(new am4maps.MapImageSeries());
  // Add image series
  this.imageSeries.mapImages.template.propertyFields.longitude = "longitude";
  this.imageSeries.mapImages.template.propertyFields.latitude = "latitude";
  this.imageSeries.mapImages.template.tooltipText = "{title}:{value}";
  this.imageSeries.mapImages.template.propertyFields.url = "url";

  this.imageSeries.mapImages.template.events.on("hit", function(ev) {
    if(this.showRegion){
      let tappedRegion = ev.target.dataItem.dataContext['title'];
      let val = this.datiPerRegione[tappedRegion];
      this.showCloseButton = true;
  
      this.detailValue = val;
      console.log(val);
    }
    
  }, this);



  this.circle = this.imageSeries.mapImages.template.createChild(am4core.Circle);
  this.circle.radius = 3;

  this.circle.propertyFields.fill = "color";


  var heat = this.imageSeries.heatRules.push({
    target: this.circle,
    property: "radius",
    min: 3,
    max: 8
  });

  this.circle2 = this.imageSeries.mapImages.template.createChild(am4core.Circle);
  this.circle2.radius = 5;
  this.circle2.propertyFields.fill = "color";
  this.circle2.events.on("inited", function(event){
    animateBullet(event.target);
  })
 

  function animateBullet(circle) {
    let animation = circle.animate([{ property: "scale", from: 1, to: 5 }, { property: "opacity", from: 1, to: 0 }], 1000, am4core.ease.circleOut);
  
    animation.events.on("animationended", function(event){
        animateBullet(event.target.object);
      })
      
  }
  

  this.requestToServer(  this.detailRegioniUrl);

  
  /* MAP Chart end */

  this.http.get(this.temporallUrl).subscribe((data: any) => {
    data.forEach(element => {
      this.temporalData.push(element)
    });
    lineChart.validateData();
  });
  
  let lineChart = am4core.create("linearchart", am4charts.XYChart);
  // Add data
  lineChart.data = this.temporalData

  // Set input format for the dates
  lineChart.dateFormatter.inputDateFormat = "yyyy-MM-dd hh:mm:ss";

  // Create axes
  let dateAxis = lineChart.xAxes.push(new am4charts.DateAxis());

  let valueAxis = lineChart.yAxes.push(new am4charts.ValueAxis());

  // Create series

  var series1 = lineChart.series.push(new am4charts.LineSeries());
  series1.dataFields.valueY = "totale_casi";
  series1.dataFields.dateX = "data";
  series1.name = 'Casi totali';
  series1.strokeWidth = 1;
  series1.bullets.push(new am4charts.CircleBullet());
  series1.tooltipText = "Totale: {totale_casi}";

  var series2 = lineChart.series.push(new am4charts.LineSeries());
  series2.dataFields.valueY = "deceduti";
  series2.dataFields.dateX = "data";
  series2.name = 'Deceduti';
  series2.strokeWidth = 1;
  series2.bullets.push(new am4charts.CircleBullet());
  series2.tooltipText = "Deceduti: {deceduti}";

  var series3 = lineChart.series.push(new am4charts.LineSeries());
  series3.dataFields.valueY = "dimessi_guariti";
  series3.dataFields.dateX = "data";
  series3.name = 'Guariti';
  series3.strokeWidth = 1;
  series3.bullets.push(new am4charts.CircleBullet());
  series3.tooltipText = "Guariti: {dimessi_guariti}";





  lineChart.cursor = new am4charts.XYCursor();
  lineChart.cursor.behavior = "zoomY";

  

  // Create a horizontal scrollbar with previe and place it underneath the date axis
  lineChart.scrollbarX = new am4charts.XYChartScrollbar();
  //lineChart.scrollbarX.series.push(series1);
  lineChart.scrollbarX.parent = lineChart.bottomAxesContainer;

  dateAxis.start = 0.1;
  dateAxis.keepSelection = true;

  // Add legend
  lineChart.legend = new am4charts.Legend();

  }


}
