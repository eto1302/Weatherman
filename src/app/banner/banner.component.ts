import {Component, Input, OnInit} from '@angular/core';
import {Location} from "../../models/location.model";
import {LocationService} from "../../services/location.service";
import {WeatherService} from "../../services/weather.service";

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent implements OnInit {
  @Input() location!: Location;

  constructor(private locationService: LocationService, private weatherService: WeatherService) {
  }

  ngOnInit(): void {
    this.getWeather();
  }

  getWeather(): void {
    if (this.location) {
      this.locationService.getCoordinates(this.location.cityName).subscribe(
        (coordinates) => {
          console.log(coordinates[0])
          console.log(coordinates[0].lat)
          console.log(coordinates[0].lon)
          this.weatherService.getWeatherByLatitudeAndLongitude(coordinates[0].lat, coordinates[0].lon, "metric").subscribe(
            (weatherData) => {
              console.log(weatherData);
            },
            (error) => {
              console.error("Error getting weather: ", error);
            }
          );
        },
        (error) => {
          console.error("Error getting coordinates: ", error);
        }
      )
    } else {
      console.error("Location is undefined");
    }
  }
}

// let position = {latitude: 0, longitude: 0};
//
// this.locationService.getPosition().then(
//   (pos) => {
//     position = pos;
//
//     this.weatherService.getWeather(position.latitude, position.longitude, "metric").subscribe(
//       (weatherData) => {
//         console.log(weatherData);
//       },
//       (error) => {
//         console.error("Error getting weather: ", error);
//       }
//     );
//   }
// ).catch((error) => {
//   console.error("Error getting location: ", error);
// });
