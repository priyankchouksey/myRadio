import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { EventsService } from '../../core/events.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router, private evtSrvc: EventsService) { }

  ngOnInit() {
    // if (this.auth.isLoggedIn) {
    //   this.router.navigate(['myStations']);
    // }
  }
  openDoc(type: string) {
    switch (type) {
      case 'privacy':
        this.evtSrvc.publish('showprivacy');
        break;
      case 'tos':
        this.evtSrvc.publish('showtos');
        break;
      default:
        break;
    }
  }
}
