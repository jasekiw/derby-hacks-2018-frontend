import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {InspectionService} from './http-services/inspection.service';
import {HttpClientModule} from '@angular/common/http';
import { MapComponent } from './components/map/map.component';
import {BusinessService} from './http-services/business.service';
import {ViolationService} from "./http-services/violation.service";
import {PictureService} from "./http-services/picture.service";
import {HeatMapPointsService} from './http-services/heat-map-points.service';
import {PolygonMapPointsService} from './http-services/polygon-map-points.service';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    InspectionService,
    BusinessService,
    ViolationService,
    PictureService,
    HeatMapPointsService,
    PolygonMapPointsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
