import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideosComponent } from './videos/videos.component';
import { PublicRoutingModule } from './public-routing.module';
import { ShareModuleModule } from 'src/app/share-module/share-module.module';
import { AboutUsComponent } from 'src/app/about-us/about-us.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ServicesComponent } from './services/services.component';
import { ScheduleFreeIntakeDialogComponent } from './booking-calendar/components/schedule-free-intake-dialog/schedule-free-intake-dialog.component';

@NgModule({
  declarations: [
    VideosComponent,
    AboutUsComponent,
    BlogComponent,
    BlogDetailsComponent,
    ContactUsComponent,
    ServicesComponent,
    ScheduleFreeIntakeDialogComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    ShareModuleModule
  ],

  bootstrap: [VideosComponent]
})
export class PublicModule {

}
