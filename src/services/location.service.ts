import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  getPosition(): Promise<{ latitude: number, longitude: number }>
  {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {

          resolve({latitude: resp.coords.latitude, longitude: resp.coords.longitude});
        },
        err => {
          reject(err);
        });
    });
  }
}
