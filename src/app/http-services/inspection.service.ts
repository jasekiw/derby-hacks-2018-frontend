import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {Inspection} from '../models/inspection.model';

@Injectable()
export class InspectionService {

  public constructor(private http: HttpClient) {
  }

  public getInspections(businessId?: number): Observable<Inspection[]> {
    let params = {};
    if(businessId)
      params['business_id'] = businessId;
    return this.http.get<Inspection[]>(environment.apiBaseUrl + 'inspections', {
      params: params
    })
  }
}
