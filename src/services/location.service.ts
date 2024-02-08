import {Injectable} from '@angular/core';
import {Location} from "../models/location.model";
import {environment} from "../../environment";
import {Weather} from "../models/weather.model";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocationService {


  private storageKey = 'userLocations';
  private geocodeAPI = 'http://api.openweathermap.org/geo/1.0/direct?'
  private apiKey = environment.apiKey

  constructor(private http: HttpClient) {
  }

  getPosition(): Promise<{ latitude: number, longitude: number }> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {

          resolve({latitude: resp.coords.latitude, longitude: resp.coords.longitude});
        },
        err => {
          reject(err);
        });
    });
  }

  saveLocation(location: Location): void {
    const locations = this.getLocations();
    locations.push(location);
    localStorage.setItem(this.storageKey, JSON.stringify(locations));
  }

  getLocations(): Location[] {
    const storedLocations = localStorage.getItem(this.storageKey);
    return storedLocations ? JSON.parse(storedLocations) : [];
  }

  clearAllLocations(): void {
    localStorage.removeItem(this.storageKey);
  }

  removeLocation(index: number): void {
    const locations = this.getLocations();
    locations.splice(index, 1);
    localStorage.setItem(this.storageKey, JSON.stringify(locations));
  }

  getCoordinates(city: string): Observable<any> {
    const params = {
      q: city,
      limit: 1,
      appid: this.apiKey,
    };

    return this.http.get<any>(this.geocodeAPI, {params}).pipe();
  }
}
