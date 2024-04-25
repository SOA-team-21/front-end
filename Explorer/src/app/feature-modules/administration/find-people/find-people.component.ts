import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AdministrationService } from '../administration.service';
import { Follower } from '../model/userprofile.model';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'xp-find-people',
  templateUrl: './find-people.component.html',
  styleUrls: ['./find-people.component.css']
})
export class FindPeopleComponent {
  readonly FOLLOWERS = 'followers';
  readonly FOLLOWING = 'following';
  readonly RECOMMENDED  = 'recommended';

  @Input({required: true}) user: User;
  @Input({required: true}) people: Follower[] = [];
  @Input() type: string = '';

  @Output() followersUpdated = new EventEmitter<null>();
  @Output() followingUpdated = new EventEmitter<null>();
  @Output() recommendedUpdated = new EventEmitter<null>();

  constructor(private service: AdministrationService) {}

  ngOnInit(): void {
  }

  follow(toFollow: Follower): void{ //This is used only on people that are following you but you are not following them
    this.service.follow(this.user.id, toFollow.userId).subscribe((result: HttpStatusCode) => {
      console.log(result);
      if(result == HttpStatusCode.Ok){
        let toFollowIndex = this.people.indexOf(toFollow)
        if(toFollowIndex < 0) return;
        this.people.splice(toFollowIndex, 1);
        this.people.push(toFollow)
      }
    });
  }

  unfollow(toUnfollow: Follower): void{ //This is used on people you are following already
    this.service.unfollow(this.user.id, toUnfollow.userId).subscribe((result: HttpStatusCode) => {
        console.log(result);
        if(result == HttpStatusCode.Ok){
          let toUnfollowIndex = this.people.indexOf(toUnfollow)
          if(toUnfollowIndex < 0) return;
          this.people.splice(toUnfollowIndex, 1);
        }
    })
  }
}