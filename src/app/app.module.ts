import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {InspectionService} from './http-services/inspection.service';
import {HttpClientModule} from '@angular/common/http';
import { MapComponentComponent } from './components/map-component/map-component.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    InspectionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
