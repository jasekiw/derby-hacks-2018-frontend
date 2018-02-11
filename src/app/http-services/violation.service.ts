import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {Violation} from '../models/violation.model';

@Injectable()
export class ViolationService {
  public constructor(private http: HttpClient) {}

  public getViolations(businessId?: number): Observable<Violation[]> {
    let params = {};
    if(businessId)
      params['business_id'] = businessId;
    return this.http.get<Violation[]>(environment.apiBaseUrl + 'violation', {
      params: params
    })
  }
}
