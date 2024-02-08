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

  constructor(private locationService: LocationService,
              private weatherService: WeatherService) {
    this.locations = this.locationService.getLocations();
    console.log(this.locations)
  }

  addLocation() {
    const sof: Location = {
      cityName: 'Sofia',
      countryCode: 'bg',
      latitude: 42.720037643584085,
      longitude: 23.285486408484694,
    };
    this.locationService.saveLocation(sof);
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
