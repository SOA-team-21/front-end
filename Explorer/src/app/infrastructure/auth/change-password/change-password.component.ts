import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordChange } from '../model/password-change.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenStorage } from '../jwt/token.service';

@Component({
  selector: 'xp-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  change: PasswordChange = {
    email: '',
    newPassword: ''
  }
  
  constructor(private service: AuthService, 
    private router: Router, 
    private route: ActivatedRoute,
    private tokenStorage: TokenStorage){}
  
  ngOnInit(): void {
    this.route.queryParams.subscribe( p => {
      const jwtHelperService = new JwtHelperService();
      const token = p['token'];
      this.tokenStorage.saveAccessToken(token);
      this.change.email = jwtHelperService.decodeToken(token).email;
    })
  }

  passwordFormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    doublePassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  }, {
    validators: this.passwordMatchValidator
  });

  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const passwordConfirmation = group.get('doublePassword')?.value;
    return password === passwordConfirmation ? null : { passwordMismatch: true };
  }

  changePassword(): void{
    if(!this.passwordFormGroup.valid) return;
    this.change.newPassword = this.passwordFormGroup.value.password || '';
    this.service.changePassword(this.change).subscribe({
      next: (result) => {
        if(!result){
          alert('One or more error accured. Please fill the form again');
          return;
        }
        alert('You successfully change your password');
        this.router.navigate(['/login']);
      }
    })
  }
}