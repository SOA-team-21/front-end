import { Component } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Person } from '../model/userprofile.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { AdministrationService } from '../administration.service';

@Component({
  selector: 'xp-find-people',
  templateUrl: './find-people.component.html',
  styleUrls: ['./find-people.component.css']
})
export class FindPeopleComponent {

  user: User;
  users: User[];

  constructor(private authService: AuthService, private service: AdministrationService) {}

  ngOnInit(): void {
    this.user = this.authService.user$.value;
    this.service.getUserFollowers(this.user.id).subscribe((result: any) => {
      this.user.followers = result;
      console.log(result);
    });
    this.getUsers();
  }

  getUsers(): void {
    this.service.getUsersToFollow().subscribe((result: any) => {
      this.users = result;
      console.log("Users: ", this.users);
    });
  }

  followUser(user: User): void {
    console.log(user);
    this.service.followUser(this.user.id, user.id).subscribe((result: any) => {
      console.log(result);
      user.followers?.push(this.user);
    });
  }

  unfollowUser(user: User): void {
    console.log(user);
    this.service.unfollowUser(this.user.id, user.id).subscribe((result: any) => {
      console.log(result);
      user.followers?.splice(user.followers.findIndex((u: User) => u.id === this.user.id), 1);
    });
  }

  isUserFollowed(current: User): boolean {
    console.log("Current: " + current.username);
    console.log("Followers: ", current.followers);
    return !!current.followers?.some((u: User) => u.username === this.user.username);
  }

}
