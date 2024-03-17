import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { ClubInvitation } from '../model/clubInvitation.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';


@Component({
  selector: 'xp-club-invitations',
  templateUrl: './club-invitations.component.html',
  styleUrls: ['./club-invitations.component.css']
})

export class ClubInvitationsComponent implements OnInit {

  
  clubInvitations: ClubInvitation[] = [];
  selectedClubInvitation: ClubInvitation;
  shouldRenderClubForm: boolean = false;
  shouldEdit: boolean = false;
  user: User | undefined;

  constructor(private service: TourAuthoringService, private authService: AuthService, private cd: ChangeDetectorRef) { }

  ngOnInit() : void {
    this.getClubInvitations();
    this.authService.user$.subscribe(user => {
      this.user = user;
    })
  }

  deleteClubInvitation(id: number): void {
    this.service.deleteClubInvitation(id).subscribe({
      next: () => {
        
        this.clubInvitations = this.clubInvitations.filter(invitation => invitation.id !== id);
      },
      error: (error) => {
        
      }
    });
  }
  getClubInvitations(): void {
    this.service.getClubInvitations().subscribe({
      next: (result: PagedResults<ClubInvitation>) => {
        this.clubInvitations = [];
        const temp = result.results;
        for(const clubInvitation of temp){
          if(clubInvitation.touristId === this.user?.id){
            this.clubInvitations.push(clubInvitation);
           console.log(this.clubInvitations);
           
          }
        } 

      },
      error: () => {
      }
    })
  }
 
  refreshInvitations() {
    this.getClubInvitations();
  }
}
