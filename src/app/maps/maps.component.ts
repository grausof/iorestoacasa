import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  temporallUrl = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json';
  dateMaps = {}
  datiPerRegione = {}
  maxValue = 0
  showCloseButton = false;
  lastUpdate = ""
  temporalData = []
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
  

  constructor(private http: HttpClient) {
    
   }

  closeButton(){
    this.detailValue = UtilityService.calculateSum(this.datiPerRegione, this.detailValue);
    this.showCloseButton = false;
  }

  ngOnInit(): void {

    let title = "ITALIA";
    let currentMap = "italyLow";
    let arrayDetail = []

    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    let todaydate = UtilityService.dateToString(new Date());
    let yesterdaydate = UtilityService.dateToString(yesterday);

    //Request to server
    this.http.get(this.detailRegioniUrl).subscribe((data: any) => {
      data.forEach(element => {
        let data = element.data;
        if (!(data in this.dateMaps)){
          this.dateMaps[data] = [];
        } 
        this.dateMaps[data].push(element)
      });

      let date;
      if (todaydate in this.dateMaps){
        date = this.dateMaps[todaydate];
        this.lastUpdate = todaydate;
      } else {
        date = this.dateMaps[yesterdaydate];
        this.lastUpdate = yesterdaydate;
      }
      
      date.forEach(element => {
        let value = element.totale_casi;
        if(value > this.maxValue){
          this.maxValue = value
        }

        let v = {
          "title": element.denominazione_regione,
          "latitude": element.lat,
          "longitude": element.long,
          "color":colorSet.next(),
          "value":element.totale_casi
        } 
        arrayDetail.push(v);
        this.datiPerRegione[element.denominazione_regione]=element;

      });
      this.detailValue = UtilityService.calculateSum(this.datiPerRegione, this.detailValue);
      imageSeries.data=arrayDetail;
      mapChart.validateData();
    });


  /* MAP Chart start */
  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  // Create map instance
  let mapChart = am4core.create("chartdiv", am4maps.MapChart);

  // Set map definition
  mapChart.geodata = am4geodata_italyLow;
  

  // Set projection
  mapChart.projection = new am4maps.projections.Miller();

  // Create map polygon series
  let polygonSeries = mapChart.series.push(new am4maps.MapPolygonSeries());

  // Exclude Antartica
  polygonSeries.exclude = ["AQ"];

  // Make map load polygon (like country names) data from GeoJSON
  polygonSeries.useGeodata = true;

  // Configure series
  let polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.tooltipText = "{name}";
  polygonTemplate.polygon.fillOpacity = 0.6;


  // Create hover state and set alternative fill color
  let hs = polygonTemplate.states.create("hover");
  hs.properties.fill = mapChart.colors.getIndex(0);

  // Add image series
  let imageSeries = mapChart.series.push(new am4maps.MapImageSeries());
  imageSeries.mapImages.template.propertyFields.longitude = "longitude";
  imageSeries.mapImages.template.propertyFields.latitude = "latitude";
  imageSeries.mapImages.template.tooltipText = "{title}:{value}";
  imageSeries.mapImages.template.propertyFields.url = "url";

  imageSeries.mapImages.template.events.on("hit", function(ev) {

    let tappedRegion = ev.target.dataItem.dataContext['title'];
    let val = this.datiPerRegione[tappedRegion];
    this.showCloseButton = true;

    this.detailValue = val;
    console.log(val);
  }, this);



  let circle = imageSeries.mapImages.template.createChild(am4core.Circle);
  circle.radius = 3;

  circle.propertyFields.fill = "color";

  let circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
  circle2.radius = 3;
  circle2.propertyFields.fill = "color";



  circle2.events.on("inited", function(event){
    animateBullet(event.target);
  })

  var heat = imageSeries.heatRules.push({
    target: circle,
    property: "radius",
    min: 4,
    max: 10
  });

  var heat = imageSeries.heatRules.push({
    target: circle2,
    property: "radius",
    min: 4,
    max: 10
  });

  function animateBullet(circle) {
      let animation = circle.animate([{ property: "scale", from: 1, to: 5 }, { property: "opacity", from: 1, to: 0 }], 1000, am4core.ease.circleOut);
      animation.events.on("animationended", function(event){
        animateBullet(event.target.object);
      })
  }

  let colorSet = new am4core.ColorSet();
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
