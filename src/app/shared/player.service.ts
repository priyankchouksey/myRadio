import { Injectable, OnDestroy, Output } from '@angular/core';
import { Station, PlayingInfo } from './station';
import { Subject } from 'rxjs';
import { EventEmitter } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class PlayerService implements OnDestroy {
  playStatus: Subject<any> = new Subject<any>();
  playList: Array<Station> = new Array<Station>();
  private audioPlayer = new Audio();
  currentIndex: number;
  private isplaying = false;

  constructor() { }
  ngOnDestroy(): void {
    this.playList = null;
  }
  /**
   * plays the station using HTML5 audio player
   * @param station object of station to be played.
   */
  play(station?: Station) {
    if (this.isplaying) { this.stop(); }
    if (station) { this.addToList(station); } else { station = this.playList[this.currentIndex]; }

    this.audioPlayer.src = station.playurl;
    this.audioPlayer.play().then(data => {
      this.playList[this.currentIndex].playing = true;
      this.isplaying = true;
      this.informSubject('playstatus', 'Playing...');
      this.informSubject('streamdata', 'Now Playing...');
    }).catch(err => {
      this.informSubject('playstatus', 'Error playing...');
      this.informSubject('streamdata', 'Error Playing...');
    });
  }
  stop() {
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
    if (wasPlaying) { this.play(); }
  }
  playPrevious() {
    const wasPlaying = this.isplaying;
    if (wasPlaying) { this.stop(); }
    this.currentIndex--;
    if (wasPlaying) { this.play(); }
  }
  playSelected(index: number) {
    this.currentIndex = index;
    this.play();
  }
  get isPlaying(): boolean {
    return this.isplaying;
  }
  get canGoNext(): boolean {
    return this.currentIndex + 1 !== this.playList.length;
  }
  get canGoPrevious(): boolean {
    return this.currentIndex !== 0;
  }
  addToList(station: Station) {
    let found = this.playList.findIndex(item => item.id === station.id);
    if (found < 0) {
      this.playList.unshift(station);
      found = 0;
    }
    if (this.playList.length > 0) {
      this.currentIndex = 0;
    }
    this.informSubject('listupdate', '');
    return found;
  }
  removeFromList(station: Station) {
    const index = this.playList.findIndex(item => item.id === station.id);
    if (index >= 0) {
      this.playList.splice(index, 1);
      if (this.currentIndex > this.playList.length + 1) {
        this.currentIndex = this.playList.length > 0 ? 0 : undefined;
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
