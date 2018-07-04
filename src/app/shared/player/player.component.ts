import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../player.service';
import { Station } from '../station';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  audioPlayer = new Audio('http://ice10.securenetsystems.net/HUMFM');
  isPlaying: boolean;
  constructor(private playerSrvc: PlayerService) { }

  ngOnInit() {
    this.audioPlayer.onload = function(event) {
      console.log(event);
    };
    this.audioPlayer.load();
  }

  onPlay() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.audioPlayer.play();
    } else {
      this.audioPlayer.pause();
    }
  }

  onPrevious() {

  }

  onNext() {

  }
}
