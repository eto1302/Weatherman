import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LocationService } from './location.service';
import { Location } from '../models/location.model';

describe('LocationService', () => {
  let service: LocationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LocationService],
    });

    service = TestBed.inject(LocationService);
    httpTestingController = TestBed.inject(HttpTestingController);
    localStorage.removeItem('userLocations');

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveLocation', () => {
    it('should save a location', () => {
      const locationMock: Location = {
        cityName: 'Test',
        countryCode: 'TC',
        latitude: 71.5328523,
        longitude: 40.2314
      };

      service.saveLocation(locationMock);

      const expectedLocations = service.getLocations();
      expect(expectedLocations.length).toBe(1);
      expect(expectedLocations[0]).toEqual(locationMock);
    });
  });

  describe('getLocations', () => {
    it('should retrieve saved locations', () => {
      service.clearAllLocations();

      const locationMocks: Location[] = [
        {
          cityName: 'Test',
          countryCode: 'TC',
          latitude: 71.5328523,
          longitude: 40.2314
        },
        {
          cityName: 'Test1',
          countryCode: 'TC',
          latitude: 54.5328523,
          longitude: 12.2314
        },
      ];

      locationMocks.forEach((l) => service.saveLocation(l));

      const expectedLocations = service.getLocations();
      expect(expectedLocations.length).toBe(locationMocks.length);
      expect(expectedLocations).toEqual(locationMocks);
    });
  });

  describe('clearAllLocations', () => {
    it('should clear all saved locations', () => {
      const locationMock: Location = {
        cityName: 'Test',
        countryCode: 'TC',
        latitude: 71.5328523,
        longitude: 40.2314
      };

      service.saveLocation(locationMock);

      service.clearAllLocations();

      const expectedLocations = service.getLocations();
      expect(expectedLocations.length).toBe(0);
    });
  });

  describe('getCoordinates', () => {
    it('should get coordinates for a city', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        const city = 'Test';
        const expectedCoordinates = { lat: 123, lon: 456 };

        service.getCoordinates(city).subscribe((coordinates) => {
          expect(coordinates).toEqual(expectedCoordinates);
        });

        const mockResponse = {
          lat: expectedCoordinates.lat,
          lon: expectedCoordinates.lon
        };
        httpMock.expectOne(`${service['geocodeAPI']}q=${city}&limit=1&appid=${service['apiKey']}`)
          .flush(mockResponse);

        httpMock.verify();
      }
    ));
  });
});
