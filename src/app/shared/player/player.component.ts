import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { PlayerService } from '../player.service';
import { Station } from '../station';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  isPlaying: boolean;
  showDraw: boolean;
  playinInfo;
  currentStation: Station;
  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement): void {
      if (!targetElement) {
          return;
      }
      const clickedInside = this.elRef.nativeElement.contains(targetElement);
      if (!clickedInside) {
          this.showDraw = false;
      }
  }
  constructor(public playerSrvc: PlayerService, private elRef: ElementRef) { }

  ngOnInit() {
    // this.audioPlayer.onload = function(event) {
    //   console.log(event);
    // };
    // this.audioPlayer.load();
    this.playerSrvc.playStatus.subscribe(res => {
      switch (res.changeType) {
        case 'playstatus':
          this.currentStation = this.playerSrvc.playList[this.playerSrvc.currentIndex];
          break;
        case 'streamdata':
          this.playinInfo = res.data;
          break;
        case 'listupdate':
          this.currentStation = this.playerSrvc.playList[this.playerSrvc.currentIndex];
        break;
      }
    });
  }

  onPlay() {
    if (this.playerSrvc.isPlaying) {
      this.playerSrvc.stop();
    } else {
      this.playerSrvc.play();
    }

  }

  onPrevious() {
    this.playerSrvc.playPrevious();
  }

  onNext() {
    this.playerSrvc.playNext();
  }
}
