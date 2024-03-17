import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import {Coupon} from '../model/coupons.model';

@Component({
  selector: 'xp-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponComponents implements OnInit {
  private user: User;

  shouldEdit: boolean;
  coupons: Coupon[] = [];
  shouldRenderPreferenceForm: boolean = false;
  selectedCoupon: Coupon;

  constructor(private service: MarketplaceService,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getAllCoupons();
  }

  getAllCoupons() {
    this.service.getAllCoupons().subscribe(
      (response: any) => {
        if (response && response.results) {
          console.log('Coupons:', response.results);
          this.coupons = response.results;
        } else {
          console.error('Invalid API response:', response);
        }
      },
      (error) => {
        console.error('Error fetching coupons:', error);
      }
    );
  }
  
  deleteCoupon(id: number) {
    this.service.deleteCoupon(id).subscribe({
      next: (_) => {
        this.getAllCoupons();
        console.log("Successfully deleted!");
      }
    })
  }
  onEditClicked(coupon: Coupon) {
    this.selectedCoupon = coupon;
    this.shouldRenderPreferenceForm = true;
    this.shouldEdit = true;
  }
  
 
  
  onAddClicked() {
    this.shouldRenderPreferenceForm = true;
    this.shouldEdit = false;
  }


}
