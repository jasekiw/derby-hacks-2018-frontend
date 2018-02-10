import {Component, OnInit} from '@angular/core';
import {InspectionService} from './http-services/inspection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements  OnInit {

  constructor(private inspectionService: InspectionService) {}
  title = 'app';
  ngOnInit(): void {
    this.inspectionService.getInspections().subscribe((inspections) => {
      console.log(inspections);
    })
  }

}
