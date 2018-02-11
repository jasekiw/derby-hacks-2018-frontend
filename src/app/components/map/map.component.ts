import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Map = google.maps.Map;
import {BusinessService} from '../../http-services/business.service';
import {InspectionService} from '../../http-services/inspection.service';
import {ViolationService} from '../../http-services/violation.service'
import {PictureService} from '../../http-services/picture.service'
import {Business} from '../../models/business.model';
import Marker = google.maps.Marker;
import {Inspection} from '../../models/inspection.model';
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/forkJoin";
import {Violation} from "../../models/violation.model";
import {Picture} from "../../models/picture.model";
import {HeatMapPointsService} from '../../http-services/heat-map-points.service';
import {HeatMapPoint} from '../../models/heat-map-point.model';
import {PolygonMapPointsService} from '../../http-services/polygon-map-points.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private googleMap?: Map;
  @ViewChild('map') mapElement: ElementRef;
  private points: any[] = [];
  private heatMap?: google.maps.visualization.HeatmapLayer;

  constructor(
    private businessService: BusinessService,
    private inspectionService: InspectionService,
    private heatMapPointsService: HeatMapPointsService,
    private violationService: ViolationService,
    private pictureService: PictureService,
    private polygonService: PolygonMapPointsService
  ) { }

  ngOnInit() {
    this.googleMap = new google.maps.Map(this.mapElement.nativeElement, {
      center: {lat: 38.2125814, lng: -85.7059149},
      zoom: 12
    });

    // this.googleMap.addListener('zoom_changed', () => {
    //   this.setHeatMap();
    // });

    this.polygonService.getPolygonMapPoints().subscribe((points) => {
     this.points = points;
     // this.setHeatMap();
      this.setPolygon();
    });

    this.businessService.getBusinesses().subscribe((businesses) => {
      let markers = [];
      this.inspectionService.getInspections();
      for(let business of businesses) {

        let marker = new google.maps.Marker({
          position: { lat: business.latitude, lng:  business.longitude },
          icon: '/assets/icons/ic_business_black_24dp_1x.png'
        });


        marker.addListener('click', () => this.handleMarkerClick(business, marker));
        markers.push(marker );
      }
      let markerCluster = new MarkerClusterer(this.googleMap, markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    });


  }

  public setPolygon() {
    if(this.points.length == 0)
      return;

    for(let point of this.points) {
      let coords = [
      {lat: point.TopLeftLat, lng: point.TopLeftLng},
      {lat: point.TopLeftLat, lng: point.BottomRightLng},
      {lat: point.BottomRightLat, lng: point.BottomRightLng},
      {lat: point.BottomRightLat, lng: point.TopLeftLng},
        {lat: point.TopLeftLat, lng: point.TopLeftLng},
      ];
      let rating = point.Rating;
      let green = '#00ff00';
      let yellowgreen = '#d8ff00';
      let yellow = '#fff200';
      let orange = '#ffa100';
      let red =  '#ff1500';

      let color = red;

      if(rating > 97)
        color = green;
      else if(rating > 93)
        color = yellowgreen;
      else if(rating > 85)
        color = yellow;
      else if(rating > 80)
        color = orange;

      var polygon = new google.maps.Polygon({
        paths: coords,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35
      });
      polygon.setMap(this.googleMap);
    }

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
    for(let point of this.points) {
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
    Observable.forkJoin([
      this.inspectionService.getInspections(business.business_id),
      this.violationService.getViolations(business.business_id),
      this.pictureService.getPicture(business)
    ])
    .subscribe(([inspections, violations, picture]) => {
      let inspectionHtml = this.makeInspectionsListHtml(inspections);
      let violationHtml = this.makeViolationListHtml(violations);
      let imageSrc = 'data:image/jpeg;base64,' + picture;
      let infowindow = new google.maps.InfoWindow({
        content: `
                <h2>${business.name}</h2>
                
                <p>Phone Number: ${business.phone_number}</p>
               
                <h3>Inspections</h3>
                <hr/>
                ${inspectionHtml}
                <h3>Violations</h3>
                ${violationHtml}
                </br>
                <img src="${imageSrc}" />                
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
  public makeViolationListHtml(violations: Violation[]) {

    let html = '<ul>';
    for(let violation of violations){
      html += `
      <li>${violation.description}</li>      
      `
    }
    html += '</ul>'

    return html;

  }

}
