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
  public foreCastData: any;
  public cityData: City;
  // public forCastDetails: ForeCast;
  public cityName: string;
  public selectedOption: string;
  public isClearlabel: boolean = false;
  // public finalForeCastData: Array;

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
  async getForeCastDetails(param) {
    const toTitleCase = (phrase) => {
      return phrase
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
    let paramString = toTitleCase(param);
    if (paramString != '') {
      var filteredArray = citiesJson.filter(function(obj) {
        if (obj.name.includes(paramString)) {
          return obj.name;
        }
      });
      if (filteredArray.length === 0) {
        this.foreCastData = null;
        this.defaultMessage = `Please enter valid city name`;
      } else {
        this.loaderService.isLoading.next(true);
        let list = new Array();
        for (let eachCity in filteredArray) {
          await this.weatherService.getForeCastData(filteredArray[eachCity].name).subscribe(
            res => {
              let weatherDetails = {};
              this.foreCastData = res['list'];
              this.cityData = res['city'];
              weatherDetails['foreCastDetails'] = this.foreCastData[0];
              weatherDetails['CityDetails'] = this.cityData;
              list.push(weatherDetails);
              this.foreCastData = list;
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
      }
    } else {
      this.foreCastData = null;
      this.defaultMessage = `Please enter valid city name`;
    }
  }

  // Enabled the modal to show details when the user clicks on view more
  getMoreDetails(modalData) {
    let modalDataArray = [];
    modalDataArray.push(modalData.foreCastDetails);
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '800px',
      height: '400px',
      data: {
        city: `${modalData.CityDetails['name']}, ${modalData.CityDetails['country']}`,
        moreDetails: modalDataArray
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
    this.citySearchQuery.next();
    this.searchFilters();
    // this.getForeCastDetails(this.cityName);
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
