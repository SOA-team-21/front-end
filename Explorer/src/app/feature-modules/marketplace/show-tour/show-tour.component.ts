import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { Point } from '../../tour-authoring/model/points.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { MarketplaceService } from '../marketplace.service';
import { ShoppingCart } from '../model/shopping-cart.model';
import { OrderItem } from '../model/order-item.model';
import { EventType, ShoppingEvent } from '../model/shopping-event.model';
import { TourReview } from '../../tour-authoring/model/tourReview.model';
import { Problem } from '../../tour-authoring/model/problem.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'xp-show-tour',
  templateUrl: './show-tour.component.html',
  styleUrls: ['./show-tour.component.css']
})
export class ShowTourComponent {

  constructor(private marketService: MarketplaceService, private route: ActivatedRoute, private checkpointService: TourAuthoringService, private service: AuthService, private router: Router) { }

  tour: Tour

  isPaid: boolean = true

  user: User;
  shoppingCart: ShoppingCart;

  forCart: boolean = true
  images : string[];
  currentTourId: number
  couponCode: string = '';
  currentImageIndex: number = 0;
  averageRating: number = 0;
  currentPicture: string = '';
  reviewImages: string[] = [];
  reviewForm = new FormGroup({
    rating: new FormControl(null, [Validators.required]),
    comment: new FormControl('', [Validators.required]),
    tourDate: new FormControl(new Date(), [Validators.required]),
    images: new FormControl('')
  });
  problems: Problem[];
  shouldRenderProblemForm: boolean = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const tourIdFromParams = params['tourId'];
      console.log('Raw tourId from params:', tourIdFromParams);

      this.currentTourId = +tourIdFromParams;
      console.log('Parsed currentTourId:', this.currentTourId);

      this.service.user$.subscribe(user => {
        this.user = user;
        if (this.user.role == 'tourist') this.getShoppingCart();
      });
      this.loadTourData();

    });
  }

  ngOnChanges(): void {
    this.problemForm.reset();
    if (this.shouldEdit) {
      this.problemForm.patchValue(this.problem);
    }
  }
  
  @Output() problemUpdated = new EventEmitter<null>();
  @Output() points: Point[] = []
  @Input() problem: Problem;
  @Input() shouldEdit: boolean = false;

  onCouponCodeChange(event: any) {
    this.couponCode = event.target.value;
  }

  getImagesFromPoints(points: any[]): string[] {
    const images: string[] = [];

    points.forEach(point => {
      if (point.picture && point.picture.length > 0) {
        images.push(point.picture.toString());
      }
    });

    return images;
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
      tourId: this.currentTourId || 1,
      touristId: this.user?.id || -1,
      authorsSolution: '',
      isSolved: false,
      unsolvedProblemComment: '',
      deadline: this.formatDate(this.problemForm.value.time)
    };
    this.checkpointService.addProblem(this.currentTourId,problem).subscribe({
      next: () => { this.problemUpdated.emit() }
    });
  }
  
  formatDate(selectedDate: Date | null | undefined): Date {
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(selectedDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ');
    return formattedDate ? new Date(formattedDate) : new Date();
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.currentPicture = this.images[this.currentImageIndex];
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
      this.currentPicture = this.images[this.currentImageIndex];
    }
  }


  private loadTourData() {
    if (this.currentTourId) {
      this.checkpointService.getTourById(this.currentTourId).subscribe({
        next: (result: Tour) => {
          this.tour = result;
          console.log(result);
          this.images = this.getImagesFromPoints(this.tour.points)
          console.log(this.images)
          this.currentPicture = this.images[this.currentImageIndex];
          this.checkpointService.getAverageRating(this.currentTourId).subscribe({
            next:(result: number) => {
              this.averageRating = result;
            }
          })
        },
        error: (error: any) => {
          console.error(error);
        }
      });
      if (this.user && this.user.role == 'tourist') {
        this.marketService.getToken(this.user.id, this.currentTourId).subscribe({
          next: (result: boolean) => {
            this.isPaid = result;
            console.log(result);
          },
          error: (error: any) => {
            console.error(error);
          }
        });
      }
      
      this.checkpointService.getProblemsForTour(this.currentTourId).subscribe({
        next: (result) => {
          this.problems = result;
          console.log('problems:',result);
        },
        error: (error: any) => {
          console.error(error);
        }
      });
    }
  }

  activateTour() {
    this.router.navigate(['/tour-execution-lifecycle'], { state: { tour: this.tour } });
  }

  getShoppingCart() {
    this.marketService.getCartByUserId(this.user.id).subscribe({
      next: (result: ShoppingCart) => {
        this.shoppingCart = result;
      },
      error: err => {
        console.log(err);
        this.shoppingCart = {
          id: 0,
          idUser: this.user.id,
          items: []
        }
      }
    })
  }

  addToCart() {
    if (this.shoppingCart.items.findIndex((x: OrderItem) => x.idType === this.tour.id && x.type == "SingleTour") === -1) {
      const orderItem: OrderItem = {
        idType: this.tour.id,
        name: this.tour.name,
        price: this.tour.price,
        image: this.tour.points[0].picture ?? 'No image',
        couponCode: this.couponCode,
        type: "SingleTour"
      };
      console.log(orderItem);

      this.marketService.addToCart(orderItem, this.user.id).subscribe({
        next: result => {
          alert('Added to cart!');
          this.getShoppingCart();

          //Add event to shopping session
          const newEvent : ShoppingEvent = {
            eventType: EventType.AddTourToCart,
            itemId: this.tour.id,
          }
          this.marketService.addEvent(newEvent, this.user.id).subscribe({
            next: response => {
              console.log(response);
            }
          })
        },
        error: (err) => {
          console.log(err);
          alert('Error while adding to cart!');
        }
      })
    }
    else {
      alert('Tour is already in cart!');
    }
  }
  

  addReview(): void { 
    const review: TourReview = {
      rating: this.reviewForm.get('rating')?.value || 1,
      comment: this.reviewForm.get('comment')?.value || '',
      tourDate: this.formatDate(this.reviewForm.value.tourDate), 
      images: this.reviewImages || [],
      creationDate: new Date(),
      tourId: this.tour.id || -1,
      touristId: this.user?.id || -1,
      touristUsername: this.user?.username || ''
    };
  
    this.checkpointService.addTourReview(this.tour, review).subscribe({
      next: () => { 
        this.tour.reviews.push(review);
        
      },
      error: (error) => {
        console.error(error);
        alert(error.error.detail || 'An unexpected error occurred.');
      }
    });
    this.ngOnInit();

  
    console.log(review);
  }


  encodeImages(selectedFiles: FileList) {
    for(let i = 0; i < selectedFiles.length; i++){
      const file = selectedFiles[i];
      const reader = new FileReader();

      reader.onload = (event: any) => {
        this.reviewImages.push(event.target.result);
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
  onProblemClicked(): void {
    this.shouldRenderProblemForm = true;
  }
  changeProblemVisibility(): void {
    this.shouldRenderProblemForm = false;
  }
}

