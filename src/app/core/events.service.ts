import { Injectable } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';

const ServiceName = 'Events Service';

@Injectable()
export class EventsService {
    private events = {};

    constructor() {}

    public subscribe(event: string): Observable<any>;
    public subscribe(event: string, callback: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription;
    public subscribe(event: string, callback?: (value: any) => void, error?: (error: any) => void, complete?: () => void) {
        if (!event) {
            throw new Error(`[${ServiceName}] => Subscription method must get event name.`);
        }

        if (this.events[event] === undefined) {
            this.events[event] = new Subject<any>();
        }

        if (typeof callback !== 'function') {
            return this.events[event].asObservable();
        } else {
            return this.events[event].asObservable().subscribe(callback, error, complete);
        }
    }

    public unSubscribe(event: string) {
      if (!event) {
        throw new Error(`[${ServiceName}] => Subscription method must get event name.`);
      }

      if (this.events[event] === undefined) {
          return;
      }
      this.events[event] = undefined;
    }
    public publish(event: string, eventObject?: any): void {
        if (!event) {
            throw new Error(`[${ServiceName}] => Publish method must get event name.`);
        } else if (!this.events[event]) {
            return;
        }

        this.events[event].next(eventObject);
    }
}
