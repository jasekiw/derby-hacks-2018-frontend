import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {HeatMapPoint} from '../models/heat-map-point.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PolygonMapPointsService {
  constructor(private http: HttpClient) {}

  public getPolygonMapPoints(): Observable<object[]> {
    return this.http.get<object[]>(environment.apiBaseUrl + "polygon-map-points")
  }
}
