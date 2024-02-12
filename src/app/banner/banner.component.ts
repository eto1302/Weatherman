import {Component, Input, OnInit} from '@angular/core';
import {Location} from "../../models/location.model";
import {LocationService} from "../../services/location.service";
import {WeatherService} from "../../services/weather.service";
import {Weather} from "../../models/weather.model";
import {CommonModule, DatePipe} from "@angular/common";

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
          this.location.countryCode = coordinates[0].country;
          this.location.cityName = coordinates[0].name;
          this.weatherService.getWeatherByLatitudeAndLongitude(coordinates[0].lat, coordinates[0].lon, "metric").subscribe(
            (weatherData) => {
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


    const dayOfWeek = new Date(dt * 1000).getDay();

    return daysOfWeekAbbreviations[dayOfWeek];
  }

  getDate(dt: number): string {
    const formattedDate = new DatePipe('en-US').transform(new Date(dt * 1000), 'dd.MM.yyyy');
    return formattedDate || '';
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
    return `url(${img})`
  }
}
