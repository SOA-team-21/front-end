import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Point } from '../model/points.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from '../model/tour.model';
import { OrderItem, OrderItemType } from '../../marketplace/model/order-item.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TransportType } from '../model/requiredTime.model';

@Component({
  selector: 'xp-points-view',
  templateUrl: './points-view.component.html',
  styleUrls: ['./points-view.component.css']
})
export class PointsViewComponent implements OnInit {
  points: Point[] = [];
  selectedPoints: Point[] = [];
  tours: Tour[]=[];
  containsUnselectedPoints = true;
  selectedTour: Tour;
  isSelected: boolean = false;
  tour: Tour = {
    id:0,
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

  user: User;
  constructor(private service: TourAuthoringService,private authService: AuthService) {}
  

  ngOnInit(): void {
    this.getPoints();
    this.authService.user$.subscribe(user => {
      this.user = user;
    })
    
  }


    getPoints(): void {
        this.service.getAllPublicPointsForTours().subscribe((data: Point[]) => {
          this.points = data;
         
        });
      }
   

      onSelect(point: Point): void {
        const index = this.selectedPoints.indexOf(point);
        
        if (index >= 0) {
          this.selectedPoints.splice(index, 1); 
        } else {
          this.selectedPoints.push(point); 
        }
      }
     
      
      

      findTours(): void {
        if (this.selectedPoints.length < 2) {
             alert('List must contain at least 2 points.');
             
          }
        this.service.findToursContainingPoints(this.selectedPoints).subscribe((data: Tour[]) => {
          this.tours = data;
          
          
    
        });
      }

      save() {
        
        this.tour.id=50;
        this.tour.length = 2
        this.tour.publishTime = new Date().toISOString();
        this.tour.arhiveTime =new Date().toISOString();
        this.tour.status = 1;
        this.tour.myOwn = true;
        this.tour.points=this.selectedPoints;
        this.tour.authorId=this.user.id;
        this.service.addTour(this.tour).subscribe({
          next: () => { }
        });
      }

      checkForUnselectedPoints(tour: Tour): boolean {
        const tourPoints = tour.points.map((point: Point) => point.name); 
        const selectedPoints = this.selectedPoints.map((point: Point) => point.name); 
    
        return tourPoints.some(pointName => !selectedPoints.includes(pointName));
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
    
   
    
    

      
  }