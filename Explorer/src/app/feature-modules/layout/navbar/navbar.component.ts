import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { AdministrationService } from 'src/app/feature-modules/administration/administration.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { UserNotification } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User;
  messageContent: string = '';
  unreadNotificationCount: number = 0;

  constructor(private authService: AuthService, private administrationService: AdministrationService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getNotifications();
  }

  onLogout(): void {
    this.authService.logout();
  }

  getNotifications(): void {
    this.administrationService.getUserNotifications(this.user.id).subscribe((result: any) => {
      this.user.notifications = result;
      
      if(this.user.notifications){
      this.user.notifications.sort((a, b) => {
        const datetimeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const datetimeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return datetimeB - datetimeA;
      });
    }
    this.countUnreadNotifications();
    });
  }
  
  readNotification(notification: UserNotification): void {
    console.log(notification)
    this.administrationService.markAsReadNotification(this.user.id, notification.notificationId).subscribe((result: any) => {
      console.log(result);
      this.getNotifications();
    });
  }

  sendNotificationToFollowers(): void {
    const notification: UserNotification = {
      senderId: this.user?.id || -1,
      message: this.messageContent,
    }
    console.log(notification)
    this.administrationService.sendNotificationToFollowers(notification).subscribe((result: any) => {
      console.log(result);
      this.resetForm();
    });
  }

  removeNotification(notification: UserNotification): void {
    this.administrationService.removeNotification(this.user.id, notification.notificationId).subscribe((result: any) => {
      console.log(result);
      this.getNotifications();
    });
  }

  countUnreadNotifications(): number {
    if (this.user.notifications) {
      let unreadNotifications = this.user.notifications.filter(notification => notification.status === 0);
      this.unreadNotificationCount = unreadNotifications.length
      return this.unreadNotificationCount;
    } else {
      return 0;
    }
  }

  resetForm(){
    this.messageContent = '';
  }
}
