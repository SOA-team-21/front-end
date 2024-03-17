import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { ClubInvitation } from '../model/clubInvitation.model';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Club } from '../model/club.model';
import { ClubInvitationsComponent } from '../club-invitations/club-invitations.component';

@Component({
  selector: 'xp-club-invitation-form',
  templateUrl: './club-invitation-form.component.html',
  styleUrls: ['./club-invitation-form.component.css']
})
export class ClubInvitationFormComponent implements OnInit {
  @Input() club: Club;
  @Output() visibilityFlag = new EventEmitter<null>();
  @Output() invitationSent = new EventEmitter<void>();
  @ViewChild('clubInvitationsRef') clubInvitationsComponent: ClubInvitationsComponent;


  user: User | undefined;

  constructor(private authService: AuthService, private service: TourAuthoringService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    })
  }

  
  clubInvitationForm = new FormGroup({
    touristId: new FormControl(null, [Validators.required]),
    clubId: new FormControl(null,[Validators.required])
  });

  addClubInvitation(): void { 
    const invitation: ClubInvitation = {
      touristId: this.clubInvitationForm.value.touristId || 1,
      clubId: this.clubInvitationForm.value.clubId || 1
    }
    this.service.addClubInvitation(invitation).subscribe(
      (data) => {
        alert('Invitation sended successfully');
        this.clubInvitationForm.reset();
        this.clubInvitationsComponent.refreshInvitations();
      },
      (error) => {
        console.log(error);
        if (error.status === 400 && error.error === 'You are not owner of the club.') {
          alert('You are not owner of the club.');
          this.clubInvitationForm.patchValue({
            touristId: null,
            clubId: null,
          });
        } else {
          alert(error.error.message);
        }
      }
    )
  }
  
 
}
