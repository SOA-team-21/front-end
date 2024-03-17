import { Component } from '@angular/core';
import { Sale } from '../model/sale.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-activate-sale',
  templateUrl: './activate-sale.component.html',
  styleUrls: ['./activate-sale.component.css']
})
export class ActivateSaleComponent {

    sales: Sale[] = [];
    user: User | undefined;
    constructor(private authService: AuthService, private service: TourAuthoringService ) { }

    ngOnInit(): void {
      this.authService.user$.subscribe(user => {
        this.user = user;
      }) 
      this.getAllSales();
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
    activateSale(saleId: number): void {
      this.service.activateSale(saleId).subscribe(
          (response) => {
              console.log('Sale activated successfully:', response);
              // Update the sales array or perform any other necessary actions
              // For example, you might want to reload the sales after activation
              this.getAllSales();
          },
          (error) => {
              console.error('Error activating sale:', error);
              // Handle error as needed
          }
      );
  }
  }
