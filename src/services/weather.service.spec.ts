import {TestBed, inject} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {WeatherService} from './weather.service';
import {Weather} from '../models/weather.model';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });

    service = TestBed.inject(WeatherService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWeatherByLatitudeAndLongitude', () => {
    const latitude = 40.7128;
    const longitude = -74.0060;
    const units = 'metric';

    it('should make a GET request with correct parameters', inject(
      [HttpTestingController],
      (httpClient: HttpTestingController) => {
        let mockWeather: Weather = {
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

        service.getWeatherByLatitudeAndLongitude(latitude, longitude, units).subscribe(response => {
          expect(response).toEqual(mockWeather);
        });

        const expectedUrl = `${service['apiUrl']}lat=${latitude}&lon=${longitude}&units=${units}&appid=${service['apiKey']}`;

        const req = httpClient.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(mockWeather);
      }
    ));
  });
});
