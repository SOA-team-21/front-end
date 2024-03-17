import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Problem } from '../model/problem.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { DatePipe } from '@angular/common';
import { Tour } from '../model/tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { TourReview } from '../model/tourReview.model';

@Component({
  selector: 'xp-problem-form',
  templateUrl: './problem-form.component.html',
  styleUrls: ['./problem-form.component.css']
})
export class ProblemFormComponent implements OnChanges {

  tours: Tour[] = [];
  tours_original: Tour[] = [];
  selectedTour: Tour;
  selectedTourName: string;
  shouldRenderProblemForm: boolean = false;
  averageRatings: { [tourId: number]: number } = {};

  sortDirection?: boolean = undefined
  selectedPrice?: number = undefined
  selectedDifficulty?: number = undefined
  selectedRating?: number = undefined

  user: User | undefined;

  @Output() problemUpdated = new EventEmitter<null>();
  @Input() problem: Problem;
  @Input() shouldEdit: boolean = false;

  constructor(private authService: AuthService, private service: TourAuthoringService, private marketService: MarketplaceService) { }


  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if(this.user && this.user.role == 'tourist')
        this.openSession();
    })
    this.getTours();
    
  }

  ngOnChanges(): void {
    this.problemForm.reset();
    if (this.shouldEdit) {
      this.problemForm.patchValue(this.problem);
    }
  }

  problemForm = new FormGroup({
    category: new FormControl('', [Validators.required]),
    priority: new FormControl(false),
    description: new FormControl('', [Validators.required]),
    time: new FormControl(new Date(Date.now()), [Validators.required]),
  });

  addProblem(): void {
    const problem: Problem = {
      category: this.problemForm.value.category || "",
      priority: this.problemForm.value.priority || false,
      description: this.problemForm.value.description || "",
      time: this.formatDate(this.problemForm.value.time),
      tourId: this.selectedTour.id || 1,
      touristId: this.user?.id || -1,
      authorsSolution: '',
      isSolved: false,
      unsolvedProblemComment: '',
      deadline: this.formatDate(this.problemForm.value.time)
    };
    this.service.addProblem(this.selectedTour.id,problem).subscribe({
      next: () => { this.problemUpdated.emit() }
    });
  }

  formatDate(selectedDate: Date | null | undefined): Date {
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(selectedDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ');
    return formattedDate ? new Date(formattedDate) : new Date();
  }

  getTours(): void {
    this.service.getTours().subscribe({
      next: (result: PagedResults<Tour>) => {
        
        this.tours = result.results.filter(tour => tour.myOwn === false);
        this.tours_original = this.tours;

        for (const tour of this.tours) {
          if (tour.id !== undefined) {
            this.calculateAverageRating(tour.id);
          }
        }

      },
      error: () => {
      }
    })
  }

  onProblemClicked(tour: Tour): void {
    this.selectedTour = tour;
    this.shouldRenderProblemForm = true;
  }

  changeProblemVisibility(): void {
    this.shouldRenderProblemForm = false;
  }

  onRatingClicked(tour: Tour): void {
    this.selectedTour = tour;
    this.shouldRenderProblemForm = false;
  }


  calculateAverageRating(tourId: number): void {
    this.service.getAverageRating(tourId).subscribe(
      (averageRating: number) => {
        this.averageRatings[tourId] = averageRating;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  // ovde dezic radi filtriranje


  toggleSortDirection() {
    if (this.sortDirection === undefined) {
      this.sortDirection = true;
    }
    else {
      this.sortDirection = !this.sortDirection;
    }
    this.applySorting();
  }

  removeFilters() {
    this.selectedPrice = undefined;
    this.selectedDifficulty = undefined;
    this.selectedRating = undefined;
    this.sortDirection = undefined;
    this.resetTours();
  }

  resetTours() {
    this.tours = this.tours_original;
  }

  applyFilters() {
    this.resetTours();

    if (this.selectedPrice !== undefined && this.selectedPrice !== null) {
      if (this.selectedPrice == 0) {

        this.tours = this.tours.filter(tour => {
          return (tour.price ?? 0) >= 200;
        });
      }
      else {
        this.tours = this.tours.filter(tour => {
          return (tour.price ?? 0) <= this.selectedPrice!;
        });
      }
    }

    if (this.selectedDifficulty) {
      this.tours = this.tours.filter(tour => {
        return (tour.difficult ?? 0) == this.selectedDifficulty!;
      });
    }

    if (this.selectedRating) {
      this.tours = this.tours.filter(tour => {
        console.log(this.averageRatings[tour.id ?? 0]);
        return (this.averageRatings[tour.id ?? 0] ?? 0) <= this.selectedRating!;
      });
    }

    this.applySorting();
  }

  applySorting() {
    if (this.sortDirection != undefined) {
      this.tours.sort((a, b) => {
        if (this.sortDirection) {
          console.log("true strana");
          return a.name.localeCompare(b.name);
        }
        else {
          console.log("false strana");
          return b.name.localeCompare(a.name);
        }
      });
    }
  }

  selectTour(tour: Tour){
    this.selectedTour = tour;
    this.selectedTourName = tour.name;
  }


  setPriceFilter(price: number) {
    this.selectedPrice = price;
  }

  setDifficultyFilter(difficulty: number) {
    this.selectedDifficulty = difficulty;
  }

  setRatingFilter(rating: number) {
    this.selectedRating = rating;
  }

  openSession(){
    this.marketService.startSession(this.user!.id).subscribe({
      next: response => {
        console.log(response);
      }
    })
  }


















}