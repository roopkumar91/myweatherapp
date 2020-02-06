import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { WeatherService } from '../service/weather.service';
import { LoaderService } from '../service/loader.service';
import { ForeCast, City, Main } from '../model/model';
import { citiesJson } from '../model/cities';
import { ModalComponent } from '../shared/modal/modal.component'

export interface CityName {
  name: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  citySearchQueryString: null;
  citySearchQuery = new Subject < string > ();
  public defaultMessage: string;
  public foreCastData: ForeCast;
  public cityData: City;
  public forCastDetails: ForeCast;
  public cityName: string;
  public selectedOption: string;
  public isClearlabel: boolean = false;

  myControl = new FormControl();
  options: CityName[] = citiesJson;
  filteredOptions: Observable < CityName[] > ;

  constructor(private weatherService: WeatherService, public dialog: MatDialog, private loaderService: LoaderService) {
    this.searchFilters();
  }

  ngOnInit() {
    this.defaultMessage = `Please search city to check today's weather`;
      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filter(name) : this.options.slice())
      );
  }

  // To get the search details and applied debounce to get the distinct value
  searchFilters() {
    this.citySearchQuery
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        let city = value ? value : '';
        this.getForeCastDetails(city);
      });
  }

  // Get the city name and process with the API to get the details
  getForeCastDetails(param) {
    this.loaderService.isLoading.next(true);
    this.weatherService.getForeCastData(param).subscribe(
      res => {
        this.foreCastData = res['list'];
        this.cityData = res['city'];
      },
      err => {
        this.foreCastData = null;
        this.defaultMessage = `Please enter valid city name`;
      }
    ).add(() => {
      //stop custom loader for api call
      this.loaderService.isLoading.next(0 > 0)
    });
  }

  // Enabled the modal to show details when the user clicks on view more
  getMoreDetails() {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '800px',
      height: '400px',
      data: {
        city: `${this.cityData['name']}, ${this.cityData['country']}`,
        moreDetails: this.foreCastData
      },
      restoreFocus: false
    });
  }

  //clear search data
  clearSearch() {
    this.isClearlabel = false;
    this.selectedOption = '';
    this.cityName = '';
    this.citySearchQueryString = null;
    // this.citySearchQuery.next();
    // this.getForeCastDetails(city.name);
    this.getForeCastDetails(this.cityName);
  }

  // display the city list in auto complete
  displayFn(city ? : City): string | undefined {
    return city ? city.name : undefined;
  }

  // Pass the city input to the api to get the response
  getCity(city) {
    this.cityName = city.name;
    this.getForeCastDetails(city.name);
  }

  // Applied the filter to get the relevant suggestions from the input
  filter(name: string): CityName[] {
    this.isClearlabel = (name != '') ? true : false;
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
