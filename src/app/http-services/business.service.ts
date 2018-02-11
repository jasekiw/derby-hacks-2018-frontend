import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {Business} from '../models/business.model';

@Injectable()
export class BusinessService {
  constructor(private http: HttpClient) {}

  public getBusinesses(): Observable<Business[]>{
    return this.http.get(environment.apiBaseUrl + "businesses");
  }
}
