import { Component } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'xp-tour-statistics',
  templateUrl: './tour-statistics.component.html',
  styleUrls: ['./tour-statistics.component.css']
})
export class TourStatisticsComponent {

  constructor(private service: TourExecutionService, private authService: AuthService) { }
  
  user: User;
  tours: Tour[];
  activeTourCount: number;
  completedTourCount: number;
  purchasedTourCount: number;
  completedCount: number;
  activeCount: number;
  purchaseCount: number;

  selectedTourStats: {
    completedCount: number;
    activeCount: number;
    purchaseCount: number;
  };

  ngOnInit(): void { 
    this.authService.user$.subscribe(user => {
      this.user = user; 
    })
    this.getAllAuthorsTours();
    this.getAllActiveTours();
    this.getAllCompletedTours();
    this.getAllPurchasedTours();
  } 
  getAllActiveTours(): void {
    this.service.getAllActiveTours().subscribe({
      next: (result: number) => {  // Add the 'result' parameter to capture the emitted value
        this.activeTourCount = result;
        console.log(this.activeTourCount);
      },
      error: (error) => {
        // Handle error if needed
        console.error(error);
      }
    });
  }
  getAllCompletedTours(): void {
    this.service.getAllCompletedTours().subscribe({
      next: (result: number) => {  // Add the 'result' parameter to capture the emitted value
        this.completedTourCount = result;
        console.log(this.completedTourCount);
      },
      error: (error) => {
        // Handle error if needed
        console.error(error);
      }
    });
  }
  getAllPurchasedTours(): void {
    this.service.getAllPurchasedTours(this.user).subscribe({
      next: (result: number) => {  // Add the 'result' parameter to capture the emitted value
        this.purchasedTourCount = result;
        console.log(this.purchasedTourCount);
      },
      error: (error) => {
        // Handle error if needed
        console.error(error);
      }
    });
  }
  getAllAuthorsTours(): void {
    this.service.getAllAuthorsTours(this.user).subscribe({
      next: (result: Tour[]) => {  // Add the 'result' parameter to capture the emitted value
        this.tours = result;
        console.log(this.tours);
      },
      error: (error) => {
        // Handle error if needed
        console.error(error);
      }
    });
  }
  handleTourDetails(tourId: number): void {
    const completedTourCount$ = this.service.getCompletedTourCount(tourId);
    const activeTourCount$ = this.service.getActiveTourCount(tourId);
    const purchaseCount$ = this.service.getPurchaseCount(this.user, tourId);
  
    forkJoin([completedTourCount$, activeTourCount$, purchaseCount$]).subscribe({
      next: ([completedCount, activeCount, purchaseCount]) => {
        this.selectedTourStats = {
          completedCount,
          activeCount,
          purchaseCount,
        };
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
    
  
}
