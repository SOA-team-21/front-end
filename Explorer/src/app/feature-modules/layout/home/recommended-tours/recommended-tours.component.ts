import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from 'src/app/feature-modules/marketplace/marketplace.service';
import { Tour } from 'src/app/feature-modules/tour-authoring/model/tour.model';
import { TourAuthoringService } from 'src/app/feature-modules/tour-authoring/tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-recommended-tours',
  templateUrl: './recommended-tours.component.html',
  styleUrls: ['./recommended-tours.component.css']
})
export class RecommendedToursComponent implements OnInit {
  starRating:number;
  starRatingNewYork:number;

  constructor(private authService: AuthService, private service: TourAuthoringService, private marketService: MarketplaceService){
    this.starRating = 4.7
    this.starRatingNewYork = 5;
  }
  
  tours: Tour[] = [];

  ngOnInit(): void {
    this.getTours();
  }

  getTours(): void {
    this.service.getTours().subscribe({
      next: (result: PagedResults<Tour>) => {
        this.tours = result.results;
      },
      error: () => {
      }
    })
  }
  
}
