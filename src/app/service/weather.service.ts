import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  BASE_URL = environment.API_BASE_URL;
  APP_ID = environment.APP_ID;

  constructor(private http: HttpClient) { }

  getForeCastData(param: string) {
  	console.log(environment);
    return this.http.get(this.BASE_URL + `/forecast?q=${param}&appid=${this.APP_ID}`);
  }
}
