import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketplaceService } from '../marketplace.service';
import { SearchResultTour } from '../model/search-result-tour.model';
import { OrderItem } from '../model/order-item.model';
import { ShoppingCart } from '../model/shopping-cart.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  tours: SearchResultTour[];
  starRating: number = 5;
  user: User;
  shoppingCart: ShoppingCart;

  constructor(private route: ActivatedRoute, private marketplaceService: MarketplaceService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.getSearchResults();
    this.authService.user$.subscribe(user => {
      this.user = user;
      const isReloaded = sessionStorage.getItem('isReloaded');
      if (!isReloaded && this.user && this.user.role == 'tourist') {
        this.startSession()
      } 
      
    })
  }

  getSearchResults() {
    const queryParams = this.route.snapshot.queryParams;
    const longitude = queryParams['longitude'];
    const latitude = queryParams['latitude'];
    const distance = queryParams['distance'];

    this.marketplaceService.getSearchResults(longitude, latitude, distance).subscribe({
      next: (results: SearchResultTour[]) => {
        this.tours = results;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  startSession() {
    this.marketplaceService.startSession(this.user.id).subscribe({
      next: response => {
        console.log(response);
      }
    })
  }
}
