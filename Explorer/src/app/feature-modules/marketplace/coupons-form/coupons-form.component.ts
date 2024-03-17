import { Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MarketplaceService } from '../marketplace.service';
import { Coupon } from '../model/coupons.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'xp-coupons-form',
  templateUrl: './coupons-form.component.html',
  styleUrls: ['./coupons-form.component.css']
})
export class CouponFormComponents implements OnInit, OnChanges {
  @Output() couponsUpdated = new EventEmitter<null>();
  @Input() coupons: Coupon;
  @Input() shouldEdit: boolean;


  constructor(private mpservice: MarketplaceService,
    private authService: AuthService)
 {}
  
  private user: User;
 
couponsform = new FormGroup({
    code: new FormControl('', [Validators.required]),
    discount: new FormControl(0, [Validators.required]),
    expiryDate: new FormControl(new Date(), [Validators.required]), // Postavljamo podrazumevanu vrednost na trenutni datum
    tourId: new FormControl(0, [Validators.required])
  });
  

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.couponsform.reset();
    if(this.shouldEdit){
      this.couponsform.patchValue(this.coupons);
    }
  }

  addCoupon(): void {
    const coupon: Coupon = {
      id: 0,
      code: this.couponsform.value.code || "",
      discount: this.couponsform.value.discount || 0,
      expiryDate: this.formatDate(this.couponsform.value.expiryDate),
      tourId: this.couponsform.value.tourId || 0,
      authorId: this.user.id
    };
  
    this.mpservice.createCoupon(coupon).subscribe({
      next: () => { this.couponsUpdated.emit() }
    });
  }
  
  formatDate(selectedDate: Date | null | undefined): Date {
    const datePipe = new DatePipe('en-US');

    const formattedDate = datePipe.transform(selectedDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ');
    return formattedDate ? new Date(formattedDate) : new Date();
  }
  editCoupon(): void {
    const coupon: Coupon = {
      id: this.coupons.id,
      code: this.couponsform.value.code || "",
      discount: this.couponsform.value.discount || 0,
      expiryDate: this.formatDate(this.couponsform.value.expiryDate),
      tourId: this.couponsform.value.tourId || 0,
      authorId: this.user.id
    };
  
    coupon.id = this.coupons.id;
    this.mpservice.updateCoupon(coupon).subscribe({
      next: () => { this.couponsUpdated.emit(); }
    });
  }


}
