import { Component } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Sale } from '../model/sale.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'xp-tours-on-sale',
  templateUrl: './tours-on-sale.component.html',
  styleUrls: ['./tours-on-sale.component.css'],
  providers: [DatePipe],
})
export class ToursOnSaleComponent {

  tours: Tour[] = [];
  sales: Sale[] = [];
  user: User | undefined;
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private authService: AuthService, private service: TourAuthoringService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    })
    this.getToursOnSale();
    this.getAllSales();
  } 

  getToursOnSale(): void {
    console.log('Entering getToursOnSale');
    this.service.getToursOnSale().subscribe(
      (response) => {
        this.tours = response.value; // Assuming 'data' contains the list of tours
      },
      (error) => {
        console.error('Error fetching tours on sale:', error);
        // Handle error as needed, e.g., display an error message to the user
      }
    );
  }

  getAllSales(): void { 
    this.service.getAllSales().subscribe(
      (response) => {  
        console.log('Response from getAllSales:', response);
        this.sales = response.results;
        console.log('All Sales:', this.sales); // Log the sales array to the console
      },
      (error) => {
        console.error('Error fetching all sales:', error);
        // Handle error as needed, e.g., display an error message to the user
      }
    );
  }
  
  calculateNewPrice(tour: Tour): number {
    const associatedSale = this.sales.find(sale => sale.toursOnSale.some(t => t.id === tour.id));
    if (associatedSale) {
      const discountPercentage = associatedSale.discountPercentage;
      return tour.price - (tour.price * (discountPercentage / 100));
    }
    return tour.price;
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortTours();
  }

  private sortTours(): void {
    // Sort sales based on discount percentage
    this.sales.sort((saleA, saleB) => {
      const discountPercentageA = saleA.discountPercentage;
      const discountPercentageB = saleB.discountPercentage;
      console.log('Sorting sales:', saleA, saleB, discountPercentageA, discountPercentageB);
      return this.sortOrder === 'asc' ? discountPercentageA - discountPercentageB : discountPercentageB - discountPercentageA;
    });
  
    // Sort tours within each sale
    this.sales.forEach(sale => {
      sale.toursOnSale.sort((a, b) => {
        const priceA = this.calculateNewPrice(a);
        const priceB = this.calculateNewPrice(b);
        console.log('Sorting tours within sale:', a, b, priceA, priceB);
        return this.sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });
    });
  }
  formatSaleEndDate(date: Date): string {
    // Use the DatePipe to format the date
    return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm') || '';
  }
}
