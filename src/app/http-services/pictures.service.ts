import {Injectable} from '@angular/core';
import {Business} from '../models/business.model';
import {Observable} from 'rxjs/Observable';
import {Picture} from '../models/picture.model';


@Injectable()
export class PicturesService{

  public setPicture(business: Business ): Observable<Picture[]>{

    let location = new google.maps.LatLng(business.latitude, business.longitude);
    let map = new google.maps.Map(document.getElementById('map'),{center:location});

    let request = {
      location: location,
      query:business.name
    };

    let placeService = new google.maps.places.PlacesService(map);
    let pictures: Picture = {
      name: "",
      url: ""

    }

    ;
    placeService.textSearch(request, this.callback);
    return  pictures;

  }


  // private callback(results, status) {
  //   if (status == google.maps.places.PlacesServiceStatus.OK) {
  //     for (var i = 0; i < results.length; i++) {
  //       let places = [];
  //       let place = new Object({
  //         name: results[i].name,
  //         photo: typeof results[i].photos !== 'undefined' ?
  //           results[i].photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100})
  //           : undefined,
  //
  //       });
  //       places.push(place);
  //     }
  //   }
  //   ;
  //}

  private callback(results, status){
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      this.places = 2;
    }
  }
}
