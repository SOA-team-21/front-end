import { ChangeDetectorRef,Component, EventEmitter, Input, OnInit, Output, OnChanges  } from '@angular/core';
import { ClubMember } from '../model/clubMember.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Club } from '../model/club.model';

@Component({
  selector: 'xp-club-members',
  templateUrl: './club-members.component.html',
  styleUrls: ['./club-members.component.css']
})
export class ClubMembersComponent implements OnChanges {

  @Input() club: Club;
  @Output() visibilityFlag = new EventEmitter<null>();

  clubMembers: ClubMember[] = [];
  selectedClubMember: ClubMember;
  shouldRenderClubForm: boolean = false;
  shouldEdit: boolean = false;
  user: User | undefined;

  constructor(private service: TourAuthoringService, private authService: AuthService, private cd: ChangeDetectorRef) { }
  ngOnChanges() {
    this.authService.user$.subscribe(user => {
      this.user = user;
    })
    const table = document.getElementById('myMembers') as HTMLTableElement;

    if (table) {
        const rows = table.getElementsByTagName('tr'); 
        for (let i = 1; i < rows.length; i++) {
              const row = rows[i];
              row.innerHTML = ''; 
        }
    }
      this.getClubMembers();
    
  }
  

  deleteClubMember(id: number): void {
    if(this.club.ownerId===this.user?.id){
    this.service.deleteClubMember(id).subscribe({
      next: () => {
        
        const table = document.getElementById('myMembers') as HTMLTableElement;

        if (table) {
            const rows = table.getElementsByTagName('tr'); 
            for (let i = 1; i < rows.length; i++) {
                  const row = rows[i];
                  row.innerHTML = ''; 
            }
        }
        this.getClubMembers();
      },
    })
  }
   
 else alert('You are not owner of the club.');
}

  getClubMembers(): void {
    
    this.service.getClubMembers().subscribe({
      next: (result: PagedResults<ClubMember>) => {
       
        const temp = result.results;
        for(const clubMember of temp){
          if(clubMember.clubId === this.club.id){
            this.clubMembers.push(clubMember);
           console.log(this.clubMembers);
           
          }
        } 
      },

      error: () => {
      }
    })
  }
 

}
