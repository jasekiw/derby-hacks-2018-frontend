import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {Picture} from '../models/picture.model';
import {Business} from '../models/business.model';
import "rxjs/add/operator/map";


@Injectable()
export class PictureService {
  public constructor(private http: HttpClient) {}

  public getPicture(business: Business): Observable<Picture[]> {
    let params = {};
    params['address'] = business.address;
    params['city'] = business.city;
    params['state'] = business.state;
    params['name'] = business.name;

    return this.http.get<string>(environment.apiBaseUrl + 'picture', {
      params: params
    }).map(res => {
      return res['image'];
    })
  }
}
