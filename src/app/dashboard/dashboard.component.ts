import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog} from '@angular/material';
import { WeatherService } from '../service/weather.service';
import { LoaderService } from '../service/loader.service';
import { ForeCast, City, Main } from '../model/model';
import { ModalComponent } from '../shared/modal/modal.component'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  
  citySearchQueryString: null;
  citySearchQuery = new Subject<string>();
  public defaultMessage: string;
  public foreCastData: ForeCast;
  public cityData: City;
  public forCastDetails: ForeCast;

  constructor( private weatherService: WeatherService, public dialog: MatDialog, private loaderService: LoaderService) { 
    this.searchFilters();
  }

  ngOnInit() {
    this.defaultMessage = `Please search city to check today's weather`;
  }

  // To get the search details and applied debounce to get the distinct value
  searchFilters() {
    this.citySearchQuery
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        console.log(value);
        let city = value ? value : '';
        this.getForeCastDetails(city);
      });
  }

  // Get the city name and process with the API to get the details
  getForeCastDetails(param) {
    console.log(param);
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
  clearSearch(){
    this.citySearchQueryString = null;
    this.citySearchQuery.next();
    this.searchFilters();
  }

}
