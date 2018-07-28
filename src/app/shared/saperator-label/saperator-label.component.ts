import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-saperator-label',
  templateUrl: './saperator-label.component.html',
  styleUrls: ['./saperator-label.component.css']
})
export class SaperatorLabelComponent implements OnInit {
  data: string;

  @Input('value')
  set value(data: string) {
    this.data = data;
  }
  constructor() { }

  ngOnInit() {
  }

}
