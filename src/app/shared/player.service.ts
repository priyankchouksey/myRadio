import { Injectable, Output, EventEmitter } from '@angular/core';
import { Station } from './station';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  @Output() playStatusChange = new EventEmitter();
  currentStation: Station;

  constructor() { }

  play() {

  }

  statusChange() {
    return this.playStatusChange;
  }
}
