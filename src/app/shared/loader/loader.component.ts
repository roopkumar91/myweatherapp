import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../service/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})

export class LoaderComponent implements OnInit, OnDestroy {

  show = false;

  private subscription: Subscription;
  constructor(public loaderService: LoaderService) { }

  ngOnInit() {  
    
  }

  ngOnDestroy() {
  }
}