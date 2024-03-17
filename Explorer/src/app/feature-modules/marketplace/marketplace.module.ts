import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferenceFormComponent } from './preference-form/preference-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchFormComponent } from './search-form/search-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { ShowTourComponent } from './show-tour/show-tour.component';
import { RouterModule } from '@angular/router';
import { CouponComponents } from './coupons/coupons.components';
import { CouponFormComponents } from './coupons-form/coupons-form.component';
import { ToursOnSaleComponent } from './tours-on-sale/tours-on-sale.component';
import { ActivateSaleComponent } from './activate-sale/activate-sale.component';



@NgModule({
  declarations: [
    PreferenceFormComponent,
    ShoppingCartComponent,
    SearchResultsComponent,
    SearchFormComponent,
    ShowTourComponent,
    CouponComponents,
    CouponFormComponents,
    ToursOnSaleComponent,
    ActivateSaleComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgbModule,
    SharedModule,
    MatGridListModule,
    RouterModule,
  ],
  exports: [
    PreferenceFormComponent,
    ShoppingCartComponent,
    SearchFormComponent,
    SearchResultsComponent,
    ShowTourComponent,
    CouponComponents,
    CouponFormComponents
  ]
})
export class MarketplaceModule { }