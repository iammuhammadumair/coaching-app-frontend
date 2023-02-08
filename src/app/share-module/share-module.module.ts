import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormButtonComponent } from '../form-button/form-button.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio'
// Material Design:  Buttons & indicators
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [FormButtonComponent, PageHeaderComponent],
  exports: [FormButtonComponent, FlexLayoutModule, PageHeaderComponent, CommonModule,
            MatProgressSpinnerModule,CarouselModule,
      FormsModule, ReactiveFormsModule,MatSelectModule,MatRadioModule,
     MatButtonModule, MatButtonToggleModule, MatBadgeModule, MatChipsModule, MatIconModule,
     MatProgressSpinnerModule, MatProgressBarModule,MatCardModule,LazyLoadImageModule
    ],
 imports: [
    CommonModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    LazyLoadImageModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCardModule
 ]
})
export class ShareModuleModule { }
