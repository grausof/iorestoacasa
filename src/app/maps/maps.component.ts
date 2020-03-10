import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {UtilityService} from "../utility.service"

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  title = 'coviditalyng';
  configUrl = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json';
  datiRegione = {}
  maxValue = 0

  constructor(private http: HttpClient) {
    
   }

  ngOnInit(): void {

    let title = "ITALIA";
    let currentMap = "italyLow";
  
    // Set map definition
    let chart = am4core.create("chartdiv", am4maps.MapChart);
    
    //chart.titles.create().text = title;
    chart.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/" + currentMap + ".json";

    
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    let todaydate = UtilityService.dateToString(new Date());
    let yesterdaydate = UtilityService.dateToString(yesterday);

    this.http.get(this.configUrl).subscribe((data: any) => {
      let ultimiDati = {};

      data.forEach(element => {
        let data = element.data;
        if (!(data in this.datiRegione)){
          this.datiRegione[data] = [];
        } 
        this.datiRegione[data].push(element)
      });
      let date;
      if (todaydate in this.datiRegione){
        date = this.datiRegione[todaydate];
      } else {
        date = this.datiRegione[yesterdaydate];
      }
      
      date.forEach(element => {
        ultimiDati[element.denominazione_regione]=element;
        let value = element.totale_casi;
        if(value > this.maxValue){
          this.maxValue = value
        }
        
      });
      

      chart.geodataSource.events.on("parseended", function(ev) {
        let data = [];
        for(var i = 0; i < ev.target.data.features.length; i++) {
          let region = String(UtilityService.mapRegion(ev.target.data.features[i].id))
          let value = 0
          if(region && region in ultimiDati){
            value = ultimiDati[region].totale_casi
          }
          data.push({
            id: ev.target.data.features[i].id,
            value: value
          })
        }
        polygonSeries.data = data;
      });

      // Set projection
      chart.projection = new am4maps.projections.Mercator();

      // Create map polygon series
      let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

      //Set min/max fill color for each area
      polygonSeries.heatRules.push({
        property: "fill",
        target: polygonSeries.mapPolygons.template,
        min: chart.colors.getIndex(1).brighten(1),
        max: chart.colors.getIndex(1).brighten(-0.3)
      });

      // Make map load polygon data (state shapes and names) from GeoJSON
      polygonSeries.useGeodata = true;

      // Set up heat legend
      let heatLegend = chart.createChild(am4maps.HeatLegend);
      heatLegend.series = polygonSeries;
      heatLegend.align = "right";
      heatLegend.width = am4core.percent(25);
      heatLegend.marginRight = am4core.percent(4);
      heatLegend.minValue = 0;
      heatLegend.maxValue = this.maxValue;
      heatLegend.valign = "bottom";

      // Set up custom heat map legend labels using axis ranges
      let minRange = heatLegend.valueAxis.axisRanges.create();
      minRange.value = heatLegend.minValue;
      minRange.label.text = String(heatLegend.minValue);
      let maxRange = heatLegend.valueAxis.axisRanges.create();
      maxRange.value = heatLegend.maxValue;
      maxRange.label.text = String(heatLegend.maxValue);

      // Blank out internal heat legend value axis labels
      heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function(labelText) {
        return "";
      });

      // Configure series tooltip
      let polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.tooltipText = "{name}: {value}";
      polygonTemplate.nonScalingStroke = true;
      polygonTemplate.strokeWidth = 0.5;

      // Create hover state and set alternative fill color
      let hs = polygonTemplate.states.create("hover");
      hs.properties.fill = chart.colors.getIndex(1).brighten(-0.5);


  });

  


  }


}
