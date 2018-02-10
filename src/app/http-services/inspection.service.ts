import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class InspectionService {

  public constructor(private http: HttpClient) {
  }

  public getInspections() {
    return this.http.get(environment.apiBaseUrl + 'inspections')
  }
}
