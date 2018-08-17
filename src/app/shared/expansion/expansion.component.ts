import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-expansion',
  templateUrl: './expansion.component.html',
  styleUrls: ['./expansion.component.css']
})
export class ExpansionComponent implements OnInit {
  @Input('title')
  title: string;
  @Input('expanded')
  expanded: boolean;
  @Input('hidetitle')
  hidetitle: boolean;
  @Input('menu')
  menu: any;

  constructor() { }

  ngOnInit() {
  }
  onClick() {
    this.expanded = !this.expanded;
  }
  onMenuClick(type: string) {

  }
}
