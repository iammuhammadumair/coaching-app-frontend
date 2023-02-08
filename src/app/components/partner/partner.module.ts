import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerRoutingModule } from './partner-routing.module';
import { PartnerHomeComponent } from './partner-home/partner-home.component';
import { PartnerCarouselComponent } from './partner-carousel/partner-carousel.component';
import { PartnerTitleComponent } from './partner-title/partner-title.component';
import { ShareModuleModule } from 'src/app/share-module/share-module.module';
import { PartnerSeachFormComponent } from './partner-seach-form/partner-seach-form.component';



@NgModule({
  declarations: [
    PartnerHomeComponent,
    PartnerCarouselComponent,
    PartnerTitleComponent,
    PartnerSeachFormComponent,
  ],
  imports: [
    CommonModule,
    PartnerRoutingModule,
    ShareModuleModule
  ]
})
export class PartnerModule { }
