import { NgModule } from '@angular/core';
import {MatInputModule, MatCardModule, MatFormFieldModule, MatButtonModule, MatToolbarModule, MatGridListModule, MatIconModule, MatProgressSpinnerModule, MatAutocompleteModule} from '@angular/material';

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
    MatFormFieldModule,
    MatButtonModule,
    MatToolbarModule,
    MatGridListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatInputModule
  ],
})
export class MaterialModule { }
