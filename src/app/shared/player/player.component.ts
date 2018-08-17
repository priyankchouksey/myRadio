import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { PlayerService } from '../player.service';
import { Station } from '../station';
// import * as ms from 'wicg-mediasession';
/// <reference path
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
/// <reference path="../../../../node_modules/@types/wicg-mediasession/index.d.ts" />
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
          this.playinInfo = '';
          break;
        case 'streamdata':
          this.playinInfo = res.data;
          break;
        case 'listupdate':
          this.currentStation = this.playerSrvc.playList[this.playerSrvc.currentIndex];
          this.playinInfo = '';
        break;
      }
    });
    if (this.playerSrvc.currentIndex > -1) {
      this.currentStation = this.playerSrvc.playList[this.playerSrvc.currentIndex];
    }
    this.setMediaSession();
  }
  setMediaSession() {
    const _self = this;
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', function() {
        _self.onPlay();
      });
      navigator.mediaSession.setActionHandler('pause', function() {
        _self.onPlay();
      });
      navigator.mediaSession.setActionHandler('previoustrack', function() {
        _self.onPrevious();
      });
      navigator.mediaSession.setActionHandler('nexttrack', function() {
        _self.onNext();
      });
    }
  }
  updateMediaSession() {
    const _self = this;
    if ('mediaSession' in navigator) {
      // const nav: any = navigator.mediaSession;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: _self.currentStation.name,
        artist: _self.currentStation.frequency,
        album: _self.currentStation.geo.city,
        artwork: [{src: _self.currentStation.logo, sizes: '96x96', type: 'image/png'}]
      });
    }
  }
  setMediaSessionStatus(value: any) {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState =  value;
    }
  }
  onPlay() {
    if (this.playerSrvc.isPlaying) {
      this.playerSrvc.stop();
      this.setMediaSessionStatus('paused');
    } else {
      this.playerSrvc.play();
      this.updateMediaSession();
      this.setMediaSessionStatus('playing');
    }
  }

  onPrevious() {
    this.playerSrvc.playPrevious();
  }

  onNext() {
    this.playerSrvc.playNext();
  }
}
