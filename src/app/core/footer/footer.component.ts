import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private evtSrvc: EventsService) { }

  ngOnInit() {
  }
  openDoc(type: string) {
    this.evtSrvc.publish(type);
  }
}
