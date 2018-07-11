import { Injectable, OnDestroy } from '@angular/core';
import { Station, PlayingInfo } from './station';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService implements OnDestroy {

  playStatus: Subject<PlayingInfo> = new Subject<PlayingInfo>();
  playList: Array<Station> = new Array<Station>();
  private audioPlayer = new Audio();
  private currentIndex: number;
  private isplaying = false;

  constructor() { }
  ngOnDestroy(): void {
    this.playList = null;
  }
  play(station?: Station) {
    if (this.isplaying) { this.stop(); }
    if (station) { this.addToList(station); }
    this.playList[this.currentIndex].playing = true;
    this.isplaying = true;
    this.informSubject('Playing...');
  }
  stop() {
    this.isplaying = false;
    this.audioPlayer.src = '';
    this.playList[this.currentIndex].playing = false;
    this.informSubject('Stopped...');
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
    return found;
  }
  removeFromList(station: Station) {
    const index = this.playList.findIndex(item => item.id === station.id);
    if (index >= 0) {
      this.playList.splice(index, 1);
      if (this.currentIndex > this.playList.length + 1) {
        this.currentIndex = this.playList.length > 0 ? 0 : undefined;
      }
    }
  }
  statusChange() {
    return this.playStatus;
  }
  private informSubject(status: string) {
    this.playStatus.next(new PlayingInfo(this.playList[this.currentIndex].name, status));
  }
  private checkandRemoveNonFav() {
    if (!this.playList[this.currentIndex].favourite) {
      this.playList.splice(this.currentIndex, 1);
    }
  }
}
