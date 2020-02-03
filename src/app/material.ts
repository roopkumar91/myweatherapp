import { NgModule } from '@angular/core';
import {MatInputModule, MatCardModule, MatFormFieldModule, MatButtonModule, MatToolbarModule, MatGridListModule, MatIconModule, MatProgressSpinnerModule} from '@angular/material';

@NgModule({
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatToolbarModule,
    MatGridListModule,
    MatIconModule,
    MatProgressSpinnerModule
    
  ],
  exports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatToolbarModule,
    MatGridListModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
})
export class MaterialModule { }
