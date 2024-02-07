import {Component} from '@angular/core';
import {LocationService} from "../../services/location.service";
import {WeatherService} from "../../services/weather.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private locationService: LocationService, private weatherService: WeatherService) {
    this.getWeather();
  }

  getWeather(): void {
    let position = { latitude: 0, longitude: 0 };

    this.locationService.getPosition().then(
      (pos) => {
        position = pos;

        this.weatherService.getWeather(position.latitude, position.longitude, "metric").subscribe(
          (weatherData) => {
            console.log(weatherData);
          },
          (error) => {
            console.error("Error getting weather: ", error);
          }
        );
      }
    ).catch((error) => {
      console.error("Error getting location: ", error);
    });
  }

}
