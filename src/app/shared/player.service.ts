import { Injectable, OnDestroy, Output } from '@angular/core';
import { Station, PlayingInfo } from './station';
import { Subject } from 'rxjs';
import { EventEmitter } from 'protractor';
import { PlayUrlParserService } from '../core/play-url-parser.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService implements OnDestroy {
  playStatus: Subject<any> = new Subject<any>();
  playList: Array<Station> = new Array<Station>();
  private audioPlayer = new Audio();
  currentIndex = -1;
  private isplaying = false;
  private userStopped = true;

  constructor(private playurlsvc: PlayUrlParserService) { }
  ngOnDestroy(): void {
    this.playList = null;
  }
  /**
   * plays the station using HTML5 audio player
   * @param station object of station to be played.
   */
  play(station?: Station) {
    this.userStopped = false;
    if (this.isplaying) {
      this.audioPlayer.src = '';
      this.playList[this.currentIndex].playing = false;
    }
    if (station) { this.currentIndex = this.addToList(station); } else { station = this.playList[this.currentIndex]; }
    this.informSubject('streamdata', 'Connecting...');
    this.playurlsvc.parseUrl(station.playurl).then(url => {
      this.audioPlayer.src = url as string;
      this.audioPlayer.play().then(data => {
        this.playList[this.currentIndex].playing = true;
        this.isplaying = true;
        this.informSubject('playstatus', 'Playing...');
        this.informSubject('streamdata', 'Now Playing...');
      }).catch(err => {
        this.informSubject('playstatus', 'Error playing...');
        this.informSubject('streamdata', 'Error Playing...');
      });
    })
    .catch(error => {
      this.informSubject('playstatus', 'Error playing...');
      this.informSubject('streamdata', 'Error Playing...');
    });
  }
  stop() {
    this.userStopped = true;
    this.isplaying = false;
    this.audioPlayer.src = '';
    this.playList[this.currentIndex].playing = false;
    this.informSubject('playstatus', 'Stopped...');
    this.informSubject('streamdata', 'Stopped Playing...');
    // this.checkandRemoveNonFav();
  }
  playNext() {
    const wasPlaying = this.isplaying;
    if (wasPlaying) { this.stop(); }
    this.currentIndex++;
    this.informSubject('playstatus', 'Next');
    if (wasPlaying || !this.userStopped) { this.play(); }
  }
  playPrevious() {
    const wasPlaying = this.isplaying;
    if (wasPlaying) { this.stop(); }
    this.currentIndex--;
    this.informSubject('playstatus', 'Previous');
    if (wasPlaying || !this.userStopped) { this.play(); }
  }
  playSelected(index: number) {
    this.currentIndex = index;
    this.informSubject('playstatus', 'Stopped...');
    this.play();
  }
  get isPlaying(): boolean {
    return this.isplaying;
  }
  get canGoNext(): boolean {
//     console.log('canGoNext: ' + (this.currentIndex + 1 !== this.playList.length));
    return this.currentIndex + 1 !== this.playList.length;
  }
  get canGoPrevious(): boolean {
//     console.log('canGoPrevious' + (this.currentIndex > 0));
    return this.currentIndex > 0;
  }
  get canPlay(): boolean {
//     console.log('canPlay' + (this.playList[this.currentIndex] !== undefined));
    return this.playList[this.currentIndex] !== undefined;
  }
  addToList(station: Station) {
    let index = this.playList.findIndex(item => item.id === station.id);
    if (index < 0) {
      this.playList.push(station);
      index = this.playList.length - 1;
    }
    if (this.currentIndex === -1 && this.playList.length === 1) {
      this.currentIndex = 0;
    }
    this.informSubject('listupdate', '');
    return index;
  }
  removeFromList(station: Station) {
    const index = this.playList.findIndex(item => item.id === station.id);
    if (index >= 0) {
      if (index === this.currentIndex) { // Station is currently being played
        this.stop();
      }
      this.playList.splice(index, 1);
      if (this.currentIndex > this.playList.length - 1) {
        this.currentIndex = this.playList.length > 0 ? (this.playList.length - 1) : -1;
      }
      this.informSubject('listupdate', '');
    }
  }
  statusChange() {
    return this.playStatus;
  }
  private informSubject(type: string, status: string) {
    this.playStatus.next({'changeType': type, 'data': status});
  }
  private checkandRemoveNonFav() {
    if (!this.playList[this.currentIndex].favourite) {
      this.playList.splice(this.currentIndex, 1);
    }
  }

}
