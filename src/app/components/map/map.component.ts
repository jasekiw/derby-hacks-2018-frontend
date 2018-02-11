import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Map = google.maps.Map;
import {BusinessService} from '../../http-services/business.service';
import {InspectionService} from '../../http-services/inspection.service';
import {Business} from '../../models/business.model';
import Marker = google.maps.Marker;
import {Inspection} from '../../models/inspection.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private googleMap?: Map;
  @ViewChild('map') mapElement: ElementRef;
  constructor(private businessService: BusinessService, private inspectionService: InspectionService) { }

  ngOnInit() {
    this.googleMap = new google.maps.Map(this.mapElement.nativeElement, {
      center: {lat: 38.2125814, lng: -85.7059149},
      zoom: 12
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
