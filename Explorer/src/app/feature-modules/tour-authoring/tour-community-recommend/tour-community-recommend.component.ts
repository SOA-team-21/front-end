import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from '../model/tour.model';
import { OrderItem, OrderItemType } from '../../marketplace/model/order-item.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xp-tour-community-recommend',
  templateUrl: './tour-community-recommend.component.html',
  styleUrls: ['./tour-community-recommend.component.css']
})
export class TourCommunityRecommendComponent implements OnInit {
  
  tours: Tour[]=[];
  selectedTour: Tour;
  isSelected: boolean = false;
  selectedRating: number = 1;

  user: User;
  averageRatings: { [tourId: number]: number } = {};
  constructor(private service: TourAuthoringService, private authService: AuthService, private route: ActivatedRoute) {}
  

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.route.params.subscribe(params => {
        const tourId = +params['tourId']; // '+' pretvara string u broj
        this.getRecommendedTours(tourId);
      });
    });
  }
  
  
  getRecommendedTours(tourId: number): void {
    this.service.findToursReviewedByUsersIFollow(this.user.id, tourId).subscribe((data: Tour[]) => {
      this.tours = data;
      for (const tour of this.tours) {
        if (tour.id !== undefined) {
          this.calculateAverageRating(tour.id);
        }
      }
    });
  }

    selectTourAndShop(tour: Tour): void {
      this.selectedTour=tour; 
      this.shopping(); 
    }

    shopping(): void {
      if (!this.selectedTour || !this.selectedTour.id || this.selectedTour.id === 0) {
        throw new Error('Invalid TourId');
      }
    
      const orderItem: OrderItem = {
        idType: this.selectedTour.id,
        name: this.selectedTour.name,
        price: this.selectedTour.price,
        image: this.selectedTour.points[0].picture,
        type: OrderItemType.singleTour,
        couponCode:""
      };
    
      console.log(orderItem);
     
      this.service.addToCart(orderItem, this.user?.id).subscribe(
        () => {
          
          alert('Successfully added to cart!');
        },
        (error) => {
          
          console.error(error);
          alert('Error while adding to cart!');
        }
      );
      
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
    
      getFilteredTours(): Tour[] {
        return this.tours.filter(tour => 
          tour.id !== undefined && 
          this.averageRatings[tour.id] !== undefined && 
          this.averageRatings[tour.id] >= this.selectedRating
        );
      }
      
  }