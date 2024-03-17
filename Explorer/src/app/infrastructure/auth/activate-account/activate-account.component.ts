import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'xp-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit{

  constructor(private route: ActivatedRoute, private service: AuthService) {}
  
  userId: number = 0;

  activateUser(token: string) : number{
    const jwtHelperService = new JwtHelperService();
    const userId = +jwtHelperService.decodeToken(token).id;
    return userId;
  } 

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      this.userId = this.activateUser(token)
      console.log(token);
      console.log('id je: ' + this.userId);
      this.saveChanges()
    });
  }

  saveChanges(){
    this.service.activateUser(this.userId).subscribe({
      next:(result) => {
        console.log(result);
      },
      error: (err) => {console.log(err)}
    });
  }
}
