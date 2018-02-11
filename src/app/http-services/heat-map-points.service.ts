import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {HeatMapPoint} from '../models/heat-map-point.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HeatMapPointsService {
  constructor(private http: HttpClient) {}

  public getHeatMapPoints(): Observable<HeatMapPoint[]> {
    return this.http.get<HeatMapPoint[]>(environment.apiBaseUrl + "heat-map-points")
  }
}
