import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../player.service';
import { Station } from '../station';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  url = 'http://ice10.securenetsystems.net/HUMFM';
  audioPlayer;
  isPlaying: boolean;
  playinInfo;
  constructor(public playerSrvc: PlayerService) { }

  ngOnInit() {
    // this.audioPlayer.onload = function(event) {
    //   console.log(event);
    // };
    // this.audioPlayer.load();
    this.playinInfo = this.playerSrvc.playStatus;
  }

  onPlay() {
    if (this.playerSrvc.isPlaying) {
      this.playerSrvc.stop();
    } else {
      this.playerSrvc.play();
    }
    // this.isPlaying = !this.isPlaying;
    // if (this.isPlaying) {
    //   this.audioPlayer = new Audio(this.url);
    //   this.audioPlayer.play();
    //   // nir.getStationInfo(this.url, function(value) {
    //   //   console.log(value);
    //   // });
    // } else {
    //   this.audioPlayer.pause();
    // }
  }

  onPrevious() {
    this.playerSrvc.playPrevious();
  }

  onNext() {
    this.playerSrvc.playNext();
  }
}
