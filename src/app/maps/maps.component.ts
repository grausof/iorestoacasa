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
  readmeUrl = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/README.md';
  decessiUrl = 'https://raw.githubusercontent.com/grausof/COVID-19/master/dati-decessi/decessi-eta-20200318.json';
  decessiPatologieUrl = 'https://raw.githubusercontent.com/grausof/COVID-19/master/dati-decessi/decessi-patologie-20200318.json';

  datiPerRegione = {}
  maxValue = 0
  showCloseButton = false;
  lastUpdate = ""
  temporalData = []
  temporalDataAllRegion = []

  showRegion = true;
  showIncrement = false;
  detailValue = {
    denominazione_regione : "Italia",
    totale_casi : 0,
    totale_casi_increment : 0,
    totale_attualmente_positivi:0,
    totale_attualmente_positivi_increment:0,
    tamponi : 0,
    tamponi_increment : 0,
    dimessi_guariti :  0,
    dimessi_guariti_increment :  0,
    terapia_intensiva : 0,
    terapia_intensiva_increment : 0,
    ricoverati_con_sintomi : 0,
    ricoverati_con_sintomi_increment : 0,
    isolamento_domiciliare : 0,
    isolamento_domiciliare_increment : 0,
    deceduti : 0,
    deceduti_increment : 0,
  }
  colorSet = new am4core.ColorSet();
  mapChart;
  imageSeries;
  circle;
  circle2;
  allDataRegion=[];
  lineChart;
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
  alertMessage = "18/03/2020 - Dati Regione Campania e provincia di Parma non pervenuti!";

  constructor(private http: HttpClient) {

  }

  closeButton(){
    this.detailValue = UtilityService.calculateSum(this.datiPerRegione, this.detailValue);
    this.showCloseButton = false;
    this.temporalData = [...this.temporalDataAllRegion]
    this.lineChart.data = this.calculateTemporalIncrement(this.showIncrement)
    this.lineChart.validateData();
  }

  requestToServer( url){
    let arrayDetail = []
    let dateMaps = {}
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    var twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate()-2);

    let todaydate = UtilityService.dateToString(new Date());
    let yesterdaydate = UtilityService.dateToString(yesterday);
    let twodaysagodate = UtilityService.dateToString(twoDaysAgo);

    
    this.http.get(url).subscribe((data: any) => {
      if(this.showRegion){
        this.allDataRegion = []
      }
      this.datiPerRegione = {}
      
      data.forEach(element => {
        let data = element.data;
        data = data.split(" ")[0];
        if (!(data in dateMaps)){
          dateMaps[data] = [];
        } 
        dateMaps[data].push(element)

        if(this.showRegion){
          this.allDataRegion.push(element);
        }
      });

      let date;
      let previusDate;
      
      if (todaydate in dateMaps){
        date = dateMaps[todaydate];
        previusDate = dateMaps[yesterdaydate];
        this.lastUpdate = todaydate;
      } else {
        date = dateMaps[yesterdaydate];
        previusDate = dateMaps[twodaysagodate];
        this.lastUpdate = yesterdaydate;
      }
      
      
      date.forEach(element => {
        element = UtilityService.convertToInt(element);
        


        let value = element.totale_casi;
        if(value > this.maxValue){
          this.maxValue = value
        }
        let title = element.denominazione_regione
        if(!this.showRegion){
          title = element.denominazione_provincia
        } else {
          let yesterdayElement = UtilityService.getYesterdayValue(previusDate, element, this.showRegion);
          yesterdayElement = UtilityService.convertToInt(yesterdayElement);
          element.totale_casi_increment = element.totale_casi - yesterdayElement.totale_casi;
          element.totale_attualmente_positivi_increment = element.totale_attualmente_positivi - yesterdayElement.totale_attualmente_positivi;

          element.tamponi_increment = element.tamponi - yesterdayElement.tamponi;
          element.dimessi_guariti_increment = element.dimessi_guariti - yesterdayElement.dimessi_guariti;
          element.terapia_intensiva_increment = element.terapia_intensiva - yesterdayElement.terapia_intensiva;
          element.ricoverati_con_sintomi_increment = element.ricoverati_con_sintomi - yesterdayElement.ricoverati_con_sintomi;
          element.isolamento_domiciliare_increment = element.isolamento_domiciliare - yesterdayElement.isolamento_domiciliare;
          element.deceduti_increment = element.deceduti - yesterdayElement.deceduti;
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
        console.log(this.detailValue);
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

  switchToIncrement(increment){
    this.showIncrement = increment;
    if(increment){
      this.lineChart.data = this.calculateTemporalIncrement(true)
    } else {
      this.lineChart.data = this.calculateTemporalIncrement(false)
    }
    this.lineChart.validateData();
    
  }

  calculateTemporalIncrement(increment){
    
    let latElement = undefined
    let temporalDataIncrement = []

    this.temporalData.forEach(element => {
      if(increment){
        if(latElement!=undefined){
          let e = {
            'totale_casi':-latElement['totale_casi']+element['totale_casi'],
            'deceduti':-latElement['deceduti']+element['deceduti'],
            'dimessi_guariti':-latElement['dimessi_guariti']+element['dimessi_guariti'],
            'totale_attualmente_positivi':-latElement['totale_attualmente_positivi']+element['totale_attualmente_positivi'],
            'data':element['data']
          }
          temporalDataIncrement.push(e);
        }
        latElement = element;
      } else {
        temporalDataIncrement.push(element);
      }
      
    });
    console.log(temporalDataIncrement)
    return temporalDataIncrement;
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
      console.log(this.detailValue);

      this.temporalDataAllRegion = [...this.temporalData];
      this.temporalData = []
      this.allDataRegion.forEach(element => {
        if(element.denominazione_regione==tappedRegion){
          this.temporalData.push(element)
        }
      });

      this.lineChart.data = this.calculateTemporalIncrement(this.showIncrement)
      
      this.lineChart.validateData();
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
    this.lineChart.data = this.calculateTemporalIncrement(this.showIncrement)
    this.lineChart.validateData();
  });
  
  this.lineChart = am4core.create("linearchart", am4charts.XYChart);
  // Add data
  this.lineChart.data = this.calculateTemporalIncrement(false)
  
  // Set input format for the dates
  this.lineChart.dateFormatter.inputDateFormat = "yyyy-MM-dd hh:mm:ss";

  // Create axes
  let dateAxis = this.lineChart.xAxes.push(new am4charts.DateAxis());

  let valueAxis = this.lineChart.yAxes.push(new am4charts.ValueAxis());

  // Create series

  var series1 = this.lineChart.series.push(new am4charts.LineSeries());
  series1.dataFields.valueY = "totale_casi";
  series1.dataFields.dateX = "data";
  series1.name = 'Casi totali';
  series1.strokeWidth = 1;
  series1.bullets.push(new am4charts.CircleBullet());
  series1.tooltipText = "Totale: {totale_casi}";

  var series2 = this.lineChart.series.push(new am4charts.LineSeries());
  series2.dataFields.valueY = "deceduti";
  series2.dataFields.dateX = "data";
  series2.name = 'Deceduti';
  series2.strokeWidth = 1;
  series2.bullets.push(new am4charts.CircleBullet());
  series2.tooltipText = "Deceduti: {deceduti}";

  var series3 = this.lineChart.series.push(new am4charts.LineSeries());
  series3.dataFields.valueY = "dimessi_guariti";
  series3.dataFields.dateX = "data";
  series3.name = 'Guariti';
  series3.strokeWidth = 1;
  series3.bullets.push(new am4charts.CircleBullet());
  series3.tooltipText = "Guariti: {dimessi_guariti}";

  var series4 = this.lineChart.series.push(new am4charts.LineSeries());
  series4.dataFields.valueY = "totale_attualmente_positivi";
  series4.dataFields.dateX = "data";
  series4.name = 'Totale attualmente positivi';
  series4.strokeWidth = 1;
  series4.bullets.push(new am4charts.CircleBullet());
  series4.tooltipText = "Attualmente positivi: {totale_attualmente_positivi}";





  this.lineChart.cursor = new am4charts.XYCursor();
  this.lineChart.cursor.behavior = "zoomY";

  

  // Create a horizontal scrollbar with previe and place it underneath the date axis
  this.lineChart.scrollbarX = new am4charts.XYChartScrollbar();
  //this.lineChart.scrollbarX.series.push(series1);
  this.lineChart.scrollbarX.parent = this.lineChart.bottomAxesContainer;

  dateAxis.start = 0.1;
  dateAxis.keepSelection = true;

  // Add legend
  this.lineChart.legend = new am4charts.Legend();
  /*
  //README
  this.http.get(this.readmeUrl, {responseType:'text'}).subscribe((data: any) => {

    let readme = data;
    var alertMsg = readme.substring(readme.indexOf("```diff")+8, readme.length);
    alertMsg = alertMsg.substring(0, alertMsg.indexOf("```"));

    alertMsg = alertMsg.replace(/(?:\r\n|\r|\n)/g, '<br>');
    alertMsg = alertMsg.split("<br>")[0]
    this.alertMessage = alertMsg;

  });
  */
  //Decessi per eta
  this.http.get(this.decessiUrl).subscribe((data: any) => {
    barChart.data = data;
    barChart.validateData();
  });

  //Decessi per patologie
  /*
  this.http.get(this.decessiPatologieUrl).subscribe((data: any) => {
    pieChart.data=data;
    pieChart.validateData();
  });
  */



  let barChart = am4core.create('barChart', am4charts.XYChart)
  barChart.colors.step = 2;

  barChart.legend = new am4charts.Legend()
  barChart.legend.position = 'top'
  barChart.legend.paddingBottom = 10
  barChart.legend.labels.template.maxWidth = 90


  let xAxis = barChart.xAxes.push(new am4charts.CategoryAxis())
  xAxis.dataFields.category = 'age'
  xAxis.renderer.cellStartLocation = 0.1
  xAxis.renderer.cellEndLocation = 0.9
  xAxis.renderer.grid.template.location = 0;

  let yAxis = barChart.yAxes.push(new am4charts.ValueAxis());
  yAxis.min = 0;

  function createSeries(value, name) {
      let series = barChart.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueY = value
      series.dataFields.categoryX = 'age'
      series.name = name

      series.events.on("hidden", arrangeColumns);
      series.events.on("shown", arrangeColumns);

      let bullet = series.bullets.push(new am4charts.LabelBullet())
      bullet.interactionsEnabled = false
      bullet.dy = -10;
      bullet.label.text = '{valueY}'
      bullet.label.fill = am4core.color('#000000')
      bullet.label.fontSize = 10;
      return series;
  }

  createSeries('men', 'Uomini');
  createSeries('women', 'Donne');
  createSeries('total', 'Totale');
  /*
  let pieChart = am4core.create("pieChart", am4charts.PieChart3D);
  pieChart.hiddenState.properties.opacity = 0; // this creates initial fade-in
  pieChart.legend = new am4charts.Legend();

  let series = pieChart.series.push(new am4charts.PieSeries3D());
  series.dataFields.value = "percentage";
  series.dataFields.category = "number_diseases";
  */

  function arrangeColumns() {

    var series = barChart.series.getIndex(0);

    var w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
    if (series.dataItems.length > 1) {
        var x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
        var x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
        var delta = ((x1 - x0) / barChart.series.length) * w;
        if (am4core.isNumber(delta)) {
            var middle = barChart.series.length / 2;

            var newIndex = 0;
            barChart.series.each(function(series) {
                if (!series.isHidden && !series.isHiding) {
                    series.dummyData = newIndex;
                    newIndex++;
                }
                else {
                    series.dummyData = barChart.series.indexOf(series);
                }
            })
            var visibleCount = newIndex;
            var newMiddle = visibleCount / 2;

            barChart.series.each(function(series) {
                var trueIndex = barChart.series.indexOf(series);
                var newIndex = series.dummyData;

                var dx = (newIndex - trueIndex + middle - newMiddle) * delta

                series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
            })
        }
    }
  }




  }


}
