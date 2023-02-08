import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from 'src/app/about-us/about-us.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { BlogComponent } from './blog/blog.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PublicModule } from './public.module';
import { VideosComponent } from './videos/videos.component';
import { ServicesComponent } from './services/services.component';
// import { WhatWeDoComponent } from './what-we-do/what-we-do.component';
// import { PublicHomeComponent } from './public-home/public-home.component';

const routes: Routes = [
  {
    path: '',
    component: PublicModule,
    children: [
      { path: `nlpvideos`, component: VideosComponent },
      { path: 'nlp', component: AboutUsComponent },
      { path: 'blog', component: BlogComponent },
      { path: `blog-details`, component: BlogDetailsComponent },
      { path: 'probono-coaching', component: ContactUsComponent },
      { path: 'services', component: ServicesComponent},
      // { path: 'about-and-contact', component: WhatWeDoComponent },
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {
}
