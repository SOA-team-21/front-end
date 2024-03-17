import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { Wallet } from '../../marketplace/model/wallet.model';
import { UserInfo } from 'src/app/infrastructure/auth/model/user.model';


@Component({
  selector: 'xp-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  
  users: UserInfo[] = [];
  selectedUser: UserInfo;
  selectedUsersWallet: Wallet | null = null;
  addMoreCoins: boolean;

  constructor(private service: AdministrationService) { }
  
  
  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void{
    this.service.getAllUsers().subscribe({
      next: (result : any) => {
        if(result != undefined){
          this.users = result;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  selectUser(user: UserInfo): void {
    this.selectedUser = user;
    if(this.selectedUser.role == 2){ //Only for tourist
      this.service.getUserWallet(this.selectedUser.id).subscribe({
        next: (result: any) => {
            if(result != undefined){
              this.selectedUsersWallet = result; return;
            }
            this.selectedUsersWallet = {
              userId: this.selectedUser.id,
              coins: 0
            };
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  blockUser(username: string, index: number): void {
    if(username == null || username == "") return;
    this.service.blockUser(username).subscribe({
        next: (result: any) => {
          if(result != undefined){
            this.users[index] = result;
          }
        },
        error: (err) => {
          console.log(err);
        }
    })
  }

  addCoins(coins: string): void{
    const coinsToAdd: number = parseInt(coins, 10);
    if(isNaN(coinsToAdd)) return;
    if(this.selectedUser == null || this.selectedUser.role != 2 || coinsToAdd < 1) return;
    this.service.addCoins(this.selectedUser.id, coinsToAdd).subscribe({
      next: (result: any) => {
        if(result != undefined){
          this.selectedUsersWallet = result;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
