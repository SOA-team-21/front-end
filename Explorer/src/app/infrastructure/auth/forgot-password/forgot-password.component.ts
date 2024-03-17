import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  email: string = '';
  constructor(private service: AuthService, private router: Router){}

  emailFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')])
  });

  sendResetLink(): void {
    if(!this.emailFormGroup.valid) return;    
    this.email = this.emailFormGroup.value.email || '';
    this.service.sendPasswordResetLink(this.email).subscribe({
        next: (result) => {
            if(!result || result == null || result == undefined) {
              alert("Something is wrong, please try again")
              return;
            }
            alert("Your reset link has been sent to " + this.email)
            this.router.navigate(['/login']);
        },
        error: (err) => {
          console.log(err);
        }
      })
  };

}
