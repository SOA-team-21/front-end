import { Component } from '@angular/core';
import { MembershipRequest } from '../model/membership-request.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-membership-request',
  templateUrl: './membership-request.component.html',
  styleUrls: ['./membership-request.component.css']
})
export class MembershipRequestComponent {

  constructor(private service: TourAuthoringService) { }

  membershipRequests: MembershipRequest[] = [];

  ngOnInit(): void {
    this.getMembershipRequests();
  } 
  getMembershipRequests(): void {
    this.service.getAllMembershipRequests().subscribe({
      next: (result: PagedResults<MembershipRequest>) => {
        console.log(result.results)
        this.membershipRequests = result.results;
      },
      error: (err: any) => {
        console.log(err);
      }
    });

}

  onClickAccept(membershipRequest: MembershipRequest): void{
    this.service.acceptMembershipRequest(membershipRequest).subscribe();
  }

  onClickReject(membershipRequest: MembershipRequest): void{
    this.service.rejectMembershipRequest(membershipRequest).subscribe();

  }
}
