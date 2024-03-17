import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { RatingsComponent } from './home/ratings/ratings.component';
import { SearchComponent } from './home/search/search.component';
import { FormsModule } from '@angular/forms';
import { RecommendedToursComponent } from './home/recommended-tours/recommended-tours.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchFormComponent } from '../marketplace/search-form/search-form.component';
import { MarketplaceModule } from '../marketplace/marketplace.module';
import { AuthorsProblemsComponent } from '../tour-authoring/authors-problems/authors-problems.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    RatingsComponent,
    SearchComponent,
    RecommendedToursComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule,
    MarketplaceModule,
  ],
  exports: [
    NavbarComponent,
    HomeComponent,
    RatingsComponent,
    SearchComponent,
    RecommendedToursComponent
  ]
})
export class LayoutModule { }
