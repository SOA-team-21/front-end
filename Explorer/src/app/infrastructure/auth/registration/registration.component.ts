import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Registration } from '../model/registration.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ShoppingCart } from 'src/app/feature-modules/marketplace/model/shopping-cart.model';
import { Wallet } from 'src/app/feature-modules/marketplace/model/wallet.model';

@Component({
  selector: 'xp-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  register(): void {
    const registration: Registration = {
      name: this.registrationForm.value.name || "",
      surname: this.registrationForm.value.surname || "",
      email: this.registrationForm.value.email || "",
      username: this.registrationForm.value.username || "",
      password: this.registrationForm.value.password || "",
    };

    if (this.registrationForm.valid) {
      this.authService.register(registration).subscribe({
        next: (response) => {
          const shoppingCart: ShoppingCart = {
            id: 0,
            idUser: response.id,
            items: [],
          }
          const wallet: Wallet = {
            id: 0,
            userId: response.id,
            coins: 0
          }
          this.authService.createShoppingCart(shoppingCart).subscribe({})
          this.authService.createWallet(wallet).subscribe({})
          this.router.navigate(['home']);
        },
      });
    }
  }
}
