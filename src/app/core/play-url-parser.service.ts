import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayUrlParserService {

  constructor() { }
  parseUrl(url: string, type?: string) {
    return new Promise((resolve, reject) => {
      if (url.endsWith('.pls')) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.overrideMimeType('audio/x-scpls'); // Needed, see below.
        xhr.onload = (event) => {
          // const lines = xhr.response;
          console.log(event);
          if (xhr.response) {
            const lines: string[] = xhr.response.split('\n');
            lines.forEach(line => {
              if (line.trim().startsWith('File1')) {
                console.log(line.substr(4));
                line.substr(4);
                resolve(line.substr(6));
              }
            });
          } else {
            reject('Error parsing url');
          }
        };
        xhr.send();
      } else {
        resolve(url);
      }
    });
  }
}
