import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayUrlParserService {

  constructor() { }
  parseUrl(url: string, type?: string) {
    return new Promise<string>((resolve, reject) => {
      if (url.toLowerCase().endsWith('.pls')) {
        this.getWebResponse(url, 'audio/x-scpls').then(response => {
          const lines: string[] = response.split('\n');
          lines.forEach(line => {
            if (line.trim().startsWith('File1')) {
              console.log(line.substr(4));
              line.substr(4);
              resolve(line.substr(6));
            }
          });
        }).catch(error => {
          reject('Error getting web response');
        });
        // const xhr = new XMLHttpRequest();
        // xhr.open('GET', url);
        // xhr.overrideMimeType('audio/x-scpls'); // Needed, see below.
        // xhr.onload = (event) => {
        //   // const lines = xhr.response;
        //   console.log(event);
        //   if (xhr.response) {
        //     const lines: string[] = xhr.response.split('\n');
        //     lines.forEach(line => {
        //       if (line.trim().startsWith('File1')) {
        //         console.log(line.substr(4));
        //         line.substr(4);
        //         resolve(line.substr(6));
        //       }
        //     });
        //   } else {
        //     reject('Error parsing url');
        //   }
        // };
        // xhr.send();
      } else if (url.toLowerCase().endsWith('m3u')) {
        this.getWebResponse(url, 'audio/x-mpegurl').then(response => {
          const lines: string[] = response.split('\n');
          resolve(lines[0]);
          // lines.forEach(line => {
          //   if (line.trim().startsWith('File1')) {
          //     console.log(line.substr(4));
          //     line.substr(4);
          //     resolve(line.substr(6));
          //     return;
          //   }
          // });
        }).catch(error => {
          reject('Error getting web response');
        });
      } else {
        resolve(url);
      }
    });
  }
  private getWebResponse(url: string, mime: string) {
    return new Promise<string> ((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.overrideMimeType(mime); // Needed, see below.
      xhr.onload = (event) => {
        resolve(xhr.response);
      };
      xhr.onerror = (evt) => {
        reject(evt);
      };
      xhr.send();
    });
  }
}
