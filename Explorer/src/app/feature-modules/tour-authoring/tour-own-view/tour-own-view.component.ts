import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from '../model/tour.model';
import { OrderItem, OrderItemType } from '../../marketplace/model/order-item.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-tour-own-view',
  templateUrl: './tour-own-view.component.html',
  styleUrls: ['./tour-own-view.component.css']
})
export class TourOwnViewComponent implements OnInit {
  tours: Tour[]=[];
  selectedTour: Tour;
  isSelected: boolean = false;
  selectedRating: number = 1;

  user: User;
  averageRatings: { [tourId: number]: number } = {};
  constructor(private service: TourAuthoringService, private authService: AuthService, private router: Router) {}
  

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.getTours();
    });
  }
  
  
  getTours(): void {
    this.service.getTours().subscribe({
      next: (result: PagedResults<Tour>) => {
        
        this.tours = result.results.filter(tour => tour.myOwn === true && tour.authorId===this.user.id);
        

      },
      error: () => {
      }
    })
  }

  selectTourAndActivate(tour: Tour): void {
    this.selectedTour=tour; 
    this.activateTour(); 
  }

  activateTour() {
    this.router.navigate(['/tour-execution-lifecycle'], { state: { tour: this.selectedTour } });
  }

  
   
   
    
}
