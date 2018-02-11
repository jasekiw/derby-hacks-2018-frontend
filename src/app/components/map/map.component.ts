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

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private googleMap?: Map;
  @ViewChild('map') mapElement: ElementRef;
  constructor(private businessService: BusinessService, private inspectionService: InspectionService, private violationService: ViolationService, private pictureService: PictureService) { }

  ngOnInit() {
    this.googleMap = new google.maps.Map(this.mapElement.nativeElement, {
      center: {lat: 38.2125814, lng: -85.7059149},
      zoom: 12
    });

    this.businessService.getBusinesses().subscribe((businesses) => {
      this.inspectionService.getInspections()
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
