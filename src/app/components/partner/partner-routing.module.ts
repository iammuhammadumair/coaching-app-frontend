import { NgModule } from "@angular/core";
import {
  RouterModule,
  Routes,
} from "@angular/router";

import { PartnerHomeComponent } from "./partner-home/partner-home.component";
import { PartnerModule } from "./partner.module";

const routes: Routes = [
  {
    path: "",
    // path: "",
    // redirectTo: "/home",
    // pathMatch: "full",
    component: PartnerModule,
    children: [{ path: "", component: PartnerHomeComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartnerRoutingModule {}
