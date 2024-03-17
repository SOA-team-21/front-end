import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './infrastructure/routing/app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './feature-modules/layout/layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './infrastructure/material/material.module';
import { AdministrationModule } from './feature-modules/administration/administration.module';
import { BlogModule } from './feature-modules/blog/blog.module';
import { MarketplaceModule } from './feature-modules/marketplace/marketplace.module';
import { TourAuthoringModule } from './feature-modules/tour-authoring/tour-authoring.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './infrastructure/auth/jwt/jwt.interceptor';
import { MapComponent } from './shared/map/map.component';
import { RouterModule } from '@angular/router';
import { TourComponent } from './feature-modules/tour-authoring/tour/tour.component';
import { SharedModule } from './shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {TourExecutionModule} from "./feature-modules/tour-execution/tour-execution.module";

import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule  } from 'ngx-google-analytics';  
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EncounterModule } from './feature-modules/encounter/encounter.module';



@NgModule({
  declarations: [
    AppComponent,
    //MapComponent,
    //TourComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    AdministrationModule,
    BlogModule,
    AuthModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    NgbModule,
    NgxGoogleAnalyticsModule.forRoot('G-S37GC75RZ8'),
    NgxGoogleAnalyticsRouterModule,
    SharedModule,
    LayoutModule,
    BrowserAnimationsModule,
    MarketplaceModule,
    TourAuthoringModule,
    TourExecutionModule,
    MatCheckboxModule,
    EncounterModule,
    
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }