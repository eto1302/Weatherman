import {Injectable} from '@angular/core';
import {environment} from "../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiKey: string = environment.apiKey;
  private apiUrl: string = 'https://api.openweathermap.org/data/2.5/onecall';
  constructor(private http: HttpClient) {
  }

  getWeather(latitude: number, longitude: number, units: string):Observable<Object> {
    const params = {
      lat: latitude.toString(),
      lon: longitude.toString(),
      exclude: 'current,hourly,minutely,alerts',
      units: units,
      appid: this.apiKey,
    };

    return this.http.get(this.apiUrl, { params });
  }

}
