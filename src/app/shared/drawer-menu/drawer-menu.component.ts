import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'app-drawer-menu',
  templateUrl: './drawer-menu.component.html',
  styleUrls: ['./drawer-menu.component.css']
})
export class DrawerMenuComponent implements OnInit {
  private showingMe: boolean;
  showDraw: boolean;
  @Input()
  get show(): boolean {
    return this.showDraw;
  }
  @Output() showChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  set show(value: boolean) {
    this.showDraw = value;
    this.showingMe = value;
    if (value) {
      setInterval(() => {
        this.showingMe = false;
      }, 100);
    }
    this.showChanged.emit(this.showDraw);
  }
  @Output() optionClicked: EventEmitter<string> = new EventEmitter<string>();
  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (this.showingMe) { return; }
      if (!targetElement) {
          return;
      }
      const clickedInside = this.elRef.nativeElement.contains(targetElement);
      if (!clickedInside) {
          this.show = false;
      }
  }
  constructor(public usrSrvc: UserService, private elRef: ElementRef) { }

  ngOnInit() {
  }
  onOptionClick(type: string) {
    this.optionClicked.emit(type);
  }
}
