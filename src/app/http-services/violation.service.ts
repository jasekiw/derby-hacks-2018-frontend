import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {Violation} from '../models/violation.model';

@Injectable()
export class BusinessService {
  constructor(private http: HttpClient) {}

  public getBusinesses(): Observable<Violation[]>{
    return this.http.get<Violation[]>(environment.apiBaseUrl + "violation");
  }
}
