import {Injectable} from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Weather} from "../models/weather.model";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiKey: string = environment.apiKey;
  private apiUrl: string = 'https://api.openweathermap.org/data/3.0/onecall?';
  constructor(private http: HttpClient) {
  }


  getWeatherByLatitudeAndLongitude(latitude: number, longitude: number, units: string):Observable<Weather> {
    const params = {
      lat: latitude.toString(),
      lon: longitude.toString(),
      units: units,
      appid: this.apiKey,
    };

    return this.http.get<Weather>(this.apiUrl, { params });
  }
}
