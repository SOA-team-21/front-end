import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PublicRegistrationRequest } from '../model/public-registration-request.model';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { UserNotification } from 'src/app/infrastructure/auth/model/user.model';
import { Tour } from '../../tour-authoring/model/tour.model';

@Component({
  selector: 'public-registration-requests',
  templateUrl: './public-registration-requests.component.html',
  styleUrls: ['./public-registration-requests.component.css']
})
export class PublicRegistrationRequestsComponent implements OnInit {

  constructor(private service: AdministrationService, private tourService: TourAuthoringService, private authService: AuthService) { }

  user: User;
  registrationRequests: PublicRegistrationRequest[] = [];
  selectedRequest: PublicRegistrationRequest;

  rejectionForm = new FormGroup({
    rejectionComment: new FormControl('') || "",
  });

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getRequests();
  }

  getRequests(): void {
    this.service.getAllPendingRequests().subscribe({
      next: (result: PublicRegistrationRequest[]) => {
        this.registrationRequests = result;
      },
      error: () => {
      }
    })
  }
  
  selectRequest(request: PublicRegistrationRequest) {
       this.selectedRequest = request;
    }   

   confirmReject() {
     const foundRequest = this.registrationRequests.find(r => r === this.selectedRequest);
     if(foundRequest){
       foundRequest.status = 'Rejected';
       foundRequest.comment = this.rejectionForm.value.rejectionComment || "";

       this.service.updatePublicRegistrationRequest(foundRequest).subscribe({
         next: () => {}
       });
     }
     this.registrationRequests = this.registrationRequests.filter(r => r !== foundRequest);

     if(foundRequest?.tourId !== -1){

      const notification: UserNotification = {
        senderId: this.user?.id || -1,
        message: 'Your request for publishing point has been rejected.',
      }
      console.log(notification);

      var tour: Tour;
      this.tourService.getTourById(foundRequest?.tourId).subscribe({
        next: (result: Tour) => {
          tour = result;
          this.service.notifyUser(tour.authorId, notification).subscribe((result: any) => {
            console.log(result);
          });
        }
      });
    }
  }

   confirmApprove() : void {
    const foundRequest = this.registrationRequests.find(r => r === this.selectedRequest);
    if(foundRequest){
      foundRequest.status = 'Approved';

      this.service.updatePublicRegistrationRequest(foundRequest).subscribe({
        next: () => {
          if(foundRequest.objectId !== -1 && foundRequest.tourId === -1)
          {
            this.tourService.setPublicObject(foundRequest.objectId).subscribe({
              next: () => {}
            })
          }
          if(foundRequest.objectId === -1 && foundRequest.tourId !== -1)
          {
            this.tourService.setPublicPoint(foundRequest.tourId, foundRequest.pointName).subscribe({
              next: () => {}
            })
          }
        }
      });
    }
    this.registrationRequests = this.registrationRequests.filter(r => r !== foundRequest);

    if(foundRequest?.tourId !== -1){

      const notification: UserNotification = {
        senderId: this.user?.id || -1,
        message: 'Your request for publishing point has been approved.',
      }

      var tour: Tour;
      this.tourService.getTourById(foundRequest?.tourId).subscribe({
        next: (result: Tour) => {
          tour = result;
          this.service.notifyUser(tour.authorId, notification).subscribe((result: any) => {
            console.log(result);
          });
        }
      });
    }
   }

}

