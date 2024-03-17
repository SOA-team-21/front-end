import { Component, OnInit } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourPurchaseToken } from '../model/tour-purchase-token.model';

@Component({
  selector: 'xp-purchased-tours',
  templateUrl: './purchased-tours.component.html',
  styleUrls: ['./purchased-tours.component.css']
})
export class PurchasedToursComponent implements OnInit {
  private user: User;
  tokens: TourPurchaseToken[];

  constructor(private service: TourExecutionService, private authService: AuthService) { }
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.getPurchasedTours();
    })
    
  }

  getPurchasedTours() {
    this.service.getTouristTokens(this.user.id).subscribe({
      next: response => {
        this.tokens = response;

      },
      error: err => {
        console.log(err);
      }
    })
  }
}
