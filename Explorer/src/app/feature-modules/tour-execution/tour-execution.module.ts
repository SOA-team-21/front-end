import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PositionSimulatorComponent} from "./position-simulator/position-simulator.component";
import {MatButtonModule} from "@angular/material/button";
import {MaterialModule} from "../../infrastructure/material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TextFieldModule} from "@angular/cdk/text-field";
import {MatRadioModule} from "@angular/material/radio";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {LayoutModule} from "../layout/layout.module";
import { TourAuthoringModule } from '../tour-authoring/tour-authoring.module';
import { PurchasedToursComponent } from './purchased-tours/purchased-tours.component';
import { BlogModule } from '../blog/blog.module';
import { TourStatisticsComponent } from './tour-statistics/tour-statistics.component';

@NgModule({
  declarations: [
    PositionSimulatorComponent,
    PurchasedToursComponent,
    TourStatisticsComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TextFieldModule,
    MatRadioModule,
    RouterModule,
    SharedModule,
    LayoutModule,
    TourAuthoringModule,
    BlogModule
  ],
  exports: [
    PositionSimulatorComponent,
    PurchasedToursComponent,
    TourStatisticsComponent
  ]
})
export class TourExecutionModule { }
