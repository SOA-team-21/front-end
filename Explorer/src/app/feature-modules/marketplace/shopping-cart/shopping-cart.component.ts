import { Component } from '@angular/core';
import { ShoppingCart } from '../model/shopping-cart.model';
import { MarketplaceService } from '../marketplace.service';
import { OrderItem } from '../model/order-item.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Wallet } from '../model/wallet.model';
import { EventType, ShoppingEvent } from '../model/shopping-event.model';

@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  shoppingCart?: ShoppingCart;
  user: User;
  sum: number;
  wallet?: Wallet;

  constructor(private service: MarketplaceService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if(this.user && this.user.role == 'tourist'){
        this.getShoppingCart();
        this.getWallet();
      }
    })
  }

  getShoppingCart() {
    this.service.getCartByUserId(this.user.id).subscribe({
      next: (result: ShoppingCart) => {
        this.shoppingCart = result;
        this.getSum();
      }
    })
  }

  purchaseFromCart() {
    if(this.shoppingCart != undefined)
    this.service.purchaseFromCart(this.shoppingCart).subscribe({
      next: result => {
        let copiedCart = Object.assign({}, this.shoppingCart);
        copiedCart.items = [];
        this.service.updateCart(copiedCart).subscribe({
          next: result => {
            this.getShoppingCart();
            this.getWallet();
            //Zatvori shopping session
            if(this.user && this.user.role == 'tourist')
              this.service.closeSession(this.user.id).subscribe({
                next: response => {
                  console.log(response);
                }
              })
          }
        })
      }
    })
  }

  purchaseFromCartUsingAC() {
    if(this.wallet != undefined && this.wallet.coins < this.sum){
      alert("You don't have enouth AC to purchase everything from the cart! Please remove some items and try again...")
      return
    } else {

    this.purchaseFromCart()
    }
  }

  onRemoveClicked(t: OrderItem): void {
    let copiedCart = Object.assign({}, this.shoppingCart);
    let i = copiedCart.items.findIndex((x: OrderItem) => x.idType === t.idType);
    copiedCart.items.splice(i, 1);

    this.service.updateCart(copiedCart).subscribe({
      next: (result: ShoppingCart) => {
        this.shoppingCart = result;
        this.getSum();
        alert('Successfully removed from cart!');
        //Ubaci event
        const newEvent : ShoppingEvent = {
          eventType: t.type == 'Bundle' ? EventType.RemoveBundleFromCart : EventType.RemoveTourFromCart,
          itemId: t.idType,
        }
        this.service.addEvent(newEvent, this.user.id).subscribe({
          next: response => {
            console.log(response);
          }
        })
        
      },
      error: err => {
        console.log(err);
      }
    })
  }

  getSum(): void {
    this.sum = 0;
    if(this.shoppingCart != undefined)
    for (let o of this.shoppingCart.items) {
      this.sum += o.price
    }
  }

  getWallet() : void {
    this.service.getWalletByUserId(this.user.id).subscribe({
      next: (result: Wallet) => {
        if(result.coins != 0)
          result.coins = Math.round(result.coins * 100) / 100
        this.wallet = result;
      }
    })
  }
}
