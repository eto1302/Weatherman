import {ComponentFixture, TestBed, async, inject} from '@angular/core/testing';
import {BannerComponent} from './banner.component';
import {LocationService} from '../../services/location.service';
import {WeatherService} from '../../services/weather.service';
import {CommonModule} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {of} from 'rxjs';
import {Weather} from "../../models/weather.model";

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let locationService: LocationService;
  let weatherService: WeatherService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientTestingModule, BannerComponent],
      providers: [LocationService, WeatherService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    locationService = TestBed.inject(LocationService);
    weatherService = TestBed.inject(WeatherService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getWeather', () => {
    it('should call getWeather when location is provided', () => {
      component.location = {cityName: 'TestCity', countryCode: 'TC', latitude: 40.7128, longitude: -74.0060};
      let weatherMock: Weather = {
        current: {
          clouds: 0,
          dew_point: 0,
          dt: 0,
          feels_like: 0,
          humidity: 0,
          pressure: 0,
          sunrise: 0,
          sunset: 0,
          temp: 0,
          uvi: 0,
          visibility: 0,
          weather: [],
          wind_deg: 0,
          wind_gust: 0,
          wind_speed: 0
        }, daily: [], hourly: [], lat: 0, lon: 0, minutely: [], timezone: "", timezone_offset: 0

      }

      spyOn(locationService, 'getCoordinates').and.returnValue(of([{lat: 40.7128, lon: -74.0060, country: 'US'}]));
      spyOn(weatherService, 'getWeatherByLatitudeAndLongitude').and.returnValue(
        of(weatherMock)
      );

      component.ngOnInit();

      expect(locationService.getCoordinates).toHaveBeenCalledWith('TestCity');
      expect(weatherService.getWeatherByLatitudeAndLongitude).toHaveBeenCalledWith(40.7128, -74.0060, 'metric');
      expect(component.loadedWeather).toBeTruthy();
    });
  });


  describe('getBackground', () => {
    it('should set background image for sunny weather', () => {
      component.weather = {current: {weather: [{id: 800}]}} as any;
      const background = component.getBackground();
      expect(background).toContain('sunny.jpg');
    });

    it('should set background image for rainy weather', () => {
      component.weather = {current: {weather: [{id: 500}]}} as any;
      const background = component.getBackground();
      expect(background).toContain('rainy.jpg');
    });

    it('should set background image for cloudy weather', () => {
      component.weather = {current: {weather: [{id: 803}]}} as any;
      const background = component.getBackground();
      expect(background).toContain('cloudy.jpg');
    });

    it('should set background image for snowy weather', () => {
      component.weather = {current: {weather: [{id: 601}]}} as any;
      const background = component.getBackground();
      expect(background).toContain('snowy.jpg');
    });
  });

  describe('getDayOfWeekAbriviation', () => {
    it('should return the correct day abbreviation', () => {
      const timestamp = 1707847200;

      const dayAbbreviation = component.getDayOfWeekAbbreviation(timestamp);

      expect(dayAbbreviation).toBe('Tue');
    });
  })
});
