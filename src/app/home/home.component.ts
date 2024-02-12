import {Component, OnInit} from '@angular/core';
import {LocationService} from "../../services/location.service";
import {WeatherService} from "../../services/weather.service";
import {BannerComponent} from "../banner/banner.component";
import {Location} from "../../models/location.model";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    BannerComponent,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  locations: Location[] = [];

  constructor(private locationService: LocationService) {
    this.locations = this.locationService.getLocations();
  }

  addLocation() {
    let userInput = window.prompt('Enter a city: ');
    if (userInput === null || userInput.trim() === '') {
      console.log('User canceled or entered an empty string.');
      return;
    }
    const loc: Location = {
      cityName: userInput,
      countryCode: '',
      latitude:0,
      longitude:0
    };
    this.locationService.saveLocation(loc);
    this.reload()
  }

  removeLocations() {
    this.locationService.clearAllLocations();
    this.reload()
  }

  private reload(): void {
    window.location.reload();
  }
}
