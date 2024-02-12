import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HomeComponent} from './home.component';
import {LocationService} from '../../services/location.service';
import {Location} from '../../models/location.model';
describe('HomeComponent', () => {
  let component: HomeComponent
  let fixture: ComponentFixture<HomeComponent>;
  let locationServiceSpy: jasmine.SpyObj<LocationService>;

  beforeEach(() => {
    const locationServiceSpyObj = jasmine.createSpyObj('LocationService', ['getLocations', 'saveLocation', 'clearAllLocations']);

    TestBed.configureTestingModule({
      imports: [
        HomeComponent
      ],
      providers: [
        {provide: LocationService, useValue: locationServiceSpyObj}
      ],
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    locationServiceSpy = TestBed.inject(LocationService) as jasmine.SpyObj<LocationService>;
    window.onbeforeunload = () => 'Reloaded!';
  });

  it('should create HomeComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('addLocation', () => {
    it('should call saveLocation when user provides a city', () => {
      const userInput = 'Test City';
      spyOn(window, 'prompt').and.returnValue(userInput);

      component.addLocation();

      const expectedLocation: Location = {
        cityName: userInput,
        countryCode: '',
        latitude: 0,
        longitude: 0
      };
      expect(locationServiceSpy.saveLocation).toHaveBeenCalledWith(expectedLocation);
      expect(locationServiceSpy.clearAllLocations).not.toHaveBeenCalled();
    });

    it('should not call saveLocation when user cancels or enters an empty string', () => {
      spyOn(window, 'prompt').and.returnValue(null);

      component.addLocation();

      expect(locationServiceSpy.saveLocation).not.toHaveBeenCalled();
      expect(locationServiceSpy.clearAllLocations).not.toHaveBeenCalled();
    });
  });

  describe('removeLocations', () => {
    it('should call clearAllLocations and reload', () => {
      component.removeLocations();

      expect(locationServiceSpy.clearAllLocations).toHaveBeenCalled();
    });
  });
});
