import { Component, OnInit, Output } from '@angular/core';
import { Tour } from '../model/tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { Point } from '../model/points.model';
import { TourReview } from '../model/tourReview.model';
import { TransportType } from '../model/requiredTime.model';

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {

  public tours: Tour[] = [];
  @Output() points: Point[] = [];
  @Output() reviews: TourReview[] = [];
  selectedTour: Tour = {
    id: 0,
    name: '',
    description: '',
    difficult: 0,
    tags: undefined,
    status: 0,
    price: 0,
    authorId: 0,
    length: 0,
    publishTime: '',
    arhiveTime: '',
    points: [],
    requiredTime: {
      transportType: TransportType.Bicycle,
      minutes: 0
    },
    reviews: [],
    problems: [],
    myOwn: false
  };
  shouldRenderTourForm: boolean = false;
  shouldEdit: boolean = false;

  constructor(private service: TourAuthoringService) { }

  ngOnInit(): void {
    this.getTours();

  }

  deleteTour(id: number): void {
    this.service.deleteTour(id).subscribe({
      next: () => {
        this.getTours();
      },
    })
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

  onEditClicked(tour: Tour): void {
    this.selectedTour = tour;
    this.shouldRenderTourForm = true;
    this.shouldEdit = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderTourForm = true;
  }

  getTourPoints(id: number): void {
    this.service.getPointsForTour(id).subscribe({
      next: (result: Point[]) => {
        this.points = result
      }
    })
  }

  

  arhive(id: number){
    this.service.arhiveTour(id).subscribe({
    })
  }

  publish(id: number){
    this.service.publishTour(id).subscribe({
    })
  }
}