import {Injectable} from '@angular/core';
import {Location} from "../models/location.model";
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {catchError, from, map, mergeMap, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private storageKey = 'userLocations';
  private geocodeAPI = 'http://api.openweathermap.org/geo/1.0/direct?'
  private reverseGeocodeAPI = 'http://api.openweathermap.org/geo/1.0/reverse?'
  private apiKey = environment.apiKey

  constructor(private http: HttpClient) {
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

  getCoordinates(city: string): Observable<any> {
    const params = {
      q: city,
      limit: 1,
      appid: this.apiKey,
    };

    return this.http.get<any>(this.geocodeAPI, {params}).pipe();
  }

  getCityName(lat: number, lon: number): Observable<any>{
    const params = {
      lat: lat,
      lon: lon,
      limit: 1,
      appid: this.apiKey,
    };

    return this.http.get<any>(this.reverseGeocodeAPI, {params}).pipe();

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

  getCityNameFromCoordinates(): Observable<Location | null> {
    return from(this.getPosition()).pipe(
      mergeMap(coordinates =>
        this.getCityName(coordinates.latitude, coordinates.longitude).pipe(
          map(result => ({
            cityName: result[0].name,
            countryCode: result[0].country,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
          } as Location)),
          catchError(error => {
            console.error('Error getting city name:', error);
            return of(null);
          })
        )
      )
    );
  }
  }
