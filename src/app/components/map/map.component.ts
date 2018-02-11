import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Map = google.maps.Map;
import {BusinessService} from '../../http-services/business.service';
import {InspectionService} from '../../http-services/inspection.service';
import {Business} from '../../models/business.model';
import Marker = google.maps.Marker;
import {Inspection} from '../../models/inspection.model';
import {HeatMapPointsService} from '../../http-services/heat-map-points.service';
import {HeatMapPoint} from '../../models/heat-map-point.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private googleMap?: Map;
  @ViewChild('map') mapElement: ElementRef;
  private points: HeatMapPoint[] = [];
  private heatMap?: google.maps.visualization.HeatmapLayer;

  constructor(
    private businessService: BusinessService,
    private inspectionService: InspectionService,
    private heatMapPointsService: HeatMapPointsService
  ) { }

  ngOnInit() {
    this.googleMap = new google.maps.Map(this.mapElement.nativeElement, {
      center: {lat: 38.2125814, lng: -85.7059149},
      zoom: 12
    });

    this.googleMap.addListener('zoom_changed', () => {
      this.setHeatMap();
    });

    this.heatMapPointsService.getHeatMapPoints().subscribe((points: HeatMapPoint[]) => {
     this.points = points;
     this.setHeatMap();
    });

    this.businessService.getBusinesses().subscribe((businesses) => {
      for(let business of businesses) {
        let marker = new google.maps.Marker({
          position: { lat: business.latitude, lng:  business.longitude },
          map: this.googleMap,
          icon: '/assets/icons/ic_business_black_24dp_1x.png'
        });

        marker.addListener('click', () => this.handleMarkerClick(business, marker))
      }

    });


  }

  public setHeatMap() {
    console.log("start setHeatMap");
    if(this.points.length == 0)
      return;

    if(this.heatMap)
      this.heatMap.setMap(null);
    let heatMapData = [];
    let distanceLng = this.googleMap.getBounds().getNorthEast().lng() - this.googleMap.getBounds().getSouthWest().lng();
    let screenWidth = window.innerWidth;
    let amountOfPoints = distanceLng / 0.003;
    let radius = screenWidth / amountOfPoints;
    console.log(radius);
    for(let point: HeatMapPoint of this.points) {
      let weight = (100 - point.Rating) + 1;

      heatMapData.push({location: new google.maps.LatLng(point.Lat, point.Lng), weight: weight});
    }

    this.heatMap = new google.maps.visualization.HeatmapLayer({
      data: heatMapData,
      // dissipating: false,
      // maxIntensity: 0.5,
      radius: radius
    });
    this.heatMap.setMap(this.googleMap);
  }

  public handleMarkerClick(business: Business, marker: Marker) {
    this.inspectionService.getInspections(business.business_id).subscribe((inspections) => {
      let inspectionHtml = this.makeInspectionsListHtml(inspections);
      let infowindow = new google.maps.InfoWindow({
        content: `
                <h2>${business.name}</h2>
                <p>Phone Number: ${business.phone_number}</p>
               
                <h3>Inspections</h3>
                <hr/>
                ${inspectionHtml}
              `
      });
      infowindow.open(this.googleMap, marker);
    });
  }

  public makeInspectionsListHtml(inspections: Inspection[]) {
    let html = '';
    for(let inspection of inspections)
    {
      html += `
      <p>Score: ${inspection.Score} <br/>
      Date: ${inspection.InspectionDate} <br/>
      Grade: ${inspection.Grade}</p>
      <hr/>
      `;
    }
    return html;
  }

}
