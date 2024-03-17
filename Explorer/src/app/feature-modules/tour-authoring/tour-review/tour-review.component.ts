import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';
import { TourReview } from '../model/tourReview.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-tour-review',
  templateUrl: './tour-review.component.html',
  styleUrls: ['./tour-review.component.css']
})
export class TourReviewComponent implements OnChanges{

  @Input() tour: Tour;
  tourReviews: TourReview[] =  [];

  constructor(private service: TourAuthoringService) {}

  ngOnChanges(): void {
    this.getTourReviews();
  }

  getTourReviews(): void {
    this.service.getTourReviews().subscribe({
      next: (result: PagedResults<TourReview>) => {
        (this.tourReviews = result.results.filter(review => review.tourId == this.tour.id));
      },
      error: () => {
      }
    })
  }

}
