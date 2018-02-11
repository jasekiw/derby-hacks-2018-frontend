import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {InspectionService} from './http-services/inspection.service';
import {HttpClientModule} from '@angular/common/http';
import { MapComponent } from './components/map/map.component';
import {BusinessService} from './http-services/business.service';
import {ViolationService} from "./http-services/violation.service";


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
    ViolationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
