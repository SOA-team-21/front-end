import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { TourReview } from '../model/tourReview.model';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tour } from '../model/tour.model';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-tour-review-form',
  templateUrl: './tour-review-form.component.html',
  styleUrls: ['./tour-review-form.component.css']
})

export class TourReviewFormComponent implements OnInit{

  @Input() tour: Tour;
  @Output() visibilityFlag = new EventEmitter<null>();

  user: User | undefined;
  showNextButton: boolean = false;


  constructor(private authService: AuthService, private service: TourAuthoringService, private router: Router) {}


  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    })
  }

  onDataReceived(emittedTour: any) {
    this.tour = emittedTour;
  }

  images: string[] = [];
  reviewForm = new FormGroup({
    rating: new FormControl(null, [Validators.required]),
    comment: new FormControl('', [Validators.required]),
    tourDate: new FormControl(new Date(), [Validators.required]),
    images: new FormControl('')
  });
/*
  addReview(): void { 
    const review: TourReview = {
      rating: this.reviewForm.value.rating || 1,
      comment: this.reviewForm.value.comment || '',
      tourDate: this.formatDate(this.reviewForm.value.tourDate), 
      images: this.images || [],
      creationDate: new Date(),
      tourId: this.tour.id || -1,
      touristId: this.user?.id || -1,
      touristUsername: this.user?.username || ''
    }
    this.service.addTourReview(this.tour,review).subscribe({
      next: () => { this.visibilityFlag.emit()}
    });
    console.log(review);
  }*/
  
  addReview(): void { 
    const review: TourReview = {
      rating: this.reviewForm.value.rating || 1,
      comment: this.reviewForm.value.comment || '',
      tourDate: this.formatDate(this.reviewForm.value.tourDate), 
      images: this.images || [],
      creationDate: new Date(),
      tourId: this.tour.id || -1,
      touristId: this.user?.id || -1,
      touristUsername: this.user?.username || ''
    };
  
    this.service.addTourReview(this.tour, review).subscribe({
      next: () => { 
        this.visibilityFlag.emit();
        this.showNextButton = true;
      },
      error: (error) => {
        console.error(error);
        alert(error.error.detail || 'An unexpected error occurred.');
      }
    });
  
    console.log(review);
  }
  


  formatDate(selectedDate: Date | null | undefined): Date {
    const datePipe = new DatePipe('en-US');

    const formattedDate = datePipe.transform(selectedDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ');
    return formattedDate ? new Date(formattedDate) : new Date();
  }

  encodeImages(selectedFiles: FileList) {
    for(let i = 0; i < selectedFiles.length; i++){
      const file = selectedFiles[i];
      const reader = new FileReader();

      reader.onload = (event: any) => {
        this.images.push(event.target.result);
      }

      reader.readAsDataURL(file);
    }
  }

  onFileSelected(event: any) {
    const selectedFiles: FileList = event.target.files;

    if (selectedFiles.length > 0) {
      this.encodeImages(selectedFiles);
    }
  }


  goToNextPage(): void {
    
    this.router.navigate(['tour-community-recommend', this.tour.id]);
  }
}