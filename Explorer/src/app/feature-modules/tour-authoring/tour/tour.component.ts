import { Component, OnInit, Output } from '@angular/core';
import { GoTour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { GoPoint} from '../model/points.model';
import { TourReview } from '../model/tourReview.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {

  public tours: GoTour[] = [];
  @Output() points: GoPoint[] = [];
  @Output() reviews: TourReview[] = [];
  selectedTour: GoTour = {
    id: 0,
    Name: '',
    Description: '',
    Difficult: 0,
    Tags: [],
    Status: 0,
    Price: 0,
    authorId: 0,
    Length: 0,
    PublishTime: null,
    ArchiveTime: '',
    KeyPoints: [],
    RequiredTimes: [],
    MyOwn: false
  };
  shouldRenderTourForm: boolean = false;
  shouldEdit: boolean = false;
  user : User;

  constructor(private authService: AuthService, private service: TourAuthoringService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.getTours();
    })
  }

  deleteTour(id: number): void {
    this.service.deleteTour(id).subscribe({
      next: () => {
        this.getTours();
      },
    })
  }

  getTours(): void {
    this.service.getToursByAuthor(this.user.id).subscribe({
      next: (result: GoTour[]) => {
        this.tours = result;
        console.log("These are tours: ", result)
      },
      error: () => {
        console.log("Error getting tours by author!")
      }
    })
  }

  onEditClicked(tour: GoTour): void {
    this.selectedTour = tour;
    this.shouldRenderTourForm = true;
    this.shouldEdit = true;
  }

  publishTour(tour: GoTour): void {
    this.selectedTour = tour;
    this.service.publishTour(this.selectedTour).subscribe({
      next: (response) => {
        if(response != undefined){
          alert("Tour published!");
          this.getTours();
        }
      },
      error: (err) => {
        alert("Error! " + err);
      }});

  }

  archiveTour(tour: GoTour): void {
    this.selectedTour = tour;
    this.service.archiveTour(this.selectedTour).subscribe({
      next: (response) => {
        if(response != undefined){
          alert("Tour archived!");
          this.getTours();
        }
      },
      error: (err) => {
        alert("Error! " + err);
      }});

  }

  closeModal() {
    this.shouldRenderTourForm = false;
  }

  onAddClicked(): void {
    this.selectedTour = {
      id: 0,
      Name: '',
      Description: '',
      Difficult: 0,
      Tags: [],
      Status: 0,
      Price: 0,
      authorId: 0,
      Length: 0,
      PublishTime: null,
      ArchiveTime: '',
      KeyPoints: [],
      RequiredTimes: [],
      MyOwn: false
    };
    this.shouldEdit = false;
    this.shouldRenderTourForm = true;
  }


}