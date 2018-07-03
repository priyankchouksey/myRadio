import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../player.service';
import { Station } from '../station';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  isPlaying: boolean;
  constructor(private playerSrvc: PlayerService) { }

  ngOnInit() {
  }

  onPlay() {
    this.isPlaying = !this.isPlaying;
  }

  onPrevious() {

  }

  onNext() {

  }
}
