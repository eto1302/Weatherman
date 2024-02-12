import {Component, Input, OnInit} from '@angular/core';
import {Location} from "../../models/location.model";
import {LocationService} from "../../services/location.service";
import {WeatherService} from "../../services/weather.service";
import {Weather} from "../../models/weather.model";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent implements OnInit {
  @Input() location!: Location;
  weather!: Weather;
  loadedWeather: boolean = false

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
              console.log(weatherData)
              this.weather = weatherData
              this.loadedWeather = true
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

  getDayOfWeekAbbreviation(dt: number): string {
    const daysOfWeekAbbreviations = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const milliseconds = dt * 1000;

    const dayOfWeek = new Date(milliseconds).getDay();

    return daysOfWeekAbbreviations[dayOfWeek];
  }

  getBackground() : string {
    let img: string;
    switch (this.weather.current.weather[0].id) {
      case 500:
      case 501:
      case 502:
      case 503:
      case 504:
        img = "\"/assets/weather-images/rainy.jpg\"";
        break;
      case 801:
      case 802:
      case 803:
      case 804:
        img = "\"/assets/weather-images/cloudy.jpg\"";
        break;
      case 600:
      case 601:
      case 602:
      case 611:
      case 612:
      case 613:
      case 615:
      case 616:
      case 620:
      case 621:
      case 622:
        img = "\"/assets/weather-images/snowy.jpg\"";
        break;
      default:
        img = "\"/assets/weather-images/sunny.jpg\"";
        break;
    }
    console.log(img)
    return `url(${img})`
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
