import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Follower, Person } from '../model/userprofile.model';
import { switchMap } from 'rxjs/operators';
import { Wallet } from '../../marketplace/model/wallet.model';
import { Preference } from '../../marketplace/model/preference.model';
import { MarketplaceService } from '../../marketplace/marketplace.service';

@Component({
  selector: 'xp-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  readonly FOLLOWERS = 'followers';
  readonly FOLLOWING = 'following';
  readonly RECOMMENDED  = 'recommended';

  user: User;
  person: Person;
  followers: Follower[] = [];
  following: Follower[] = [];
  recommended: Follower[] = [];

  toggleFollowers: string = '';

  selectedProfile: Person;
  wallet: Wallet;

  shouldEdit: boolean = false
  preferences: Preference[] = [];
  shouldRenderPreferenceForm: boolean = false;
  shouldRenderAdd: boolean = false
  selectedPreference: Preference;

  constructor(private authService: AuthService,private marketService: MarketplaceService, private service: AdministrationService) {}

  ngOnInit(): void {
    this.getUser();
    this.getPreferences();   
  }

  getUser(): void {
    this.authService.user$.pipe(
      switchMap((user: User) => {
        this.user = user;
        this.getWallet(user.id);
        return this.service.getProfile(this.user.id);
      })
    ).subscribe((result: any) => {
      this.person = result;
      console.log(this.person);
    });
  } 

  getFollowers(): void {
    this.toggleFollowers = this.FOLLOWERS; 
    //if(!this.followersChanged) return;
    this.service.getFollowers(this.user.id).subscribe((result: Follower[]) => {
      this.followers = result;
    });
  } 

  getFollowing(): void {
    this.toggleFollowers = this.FOLLOWING;
    //if(!this.followingChanged) return;
    this.service.getFollowing(this.user.id).subscribe((result: Follower[]) => {
      this.following = result;
    });
  }
  
  getRecommended():void {
    this.toggleFollowers = this.RECOMMENDED;
    //if(!this.recommendedChanged) return;
    this.service.getRecommended(this.user.id).subscribe((result: Follower[]) => {
      this.recommended = result;
    })
  }

  getWallet(userId: number): void{
    this.service.getUserWallet(userId).subscribe({
      next: (response: Wallet) => {
        this.wallet = response;
        console.log(this.wallet);
      }
    })
  }

  editProfile(profile: Person): void{
    this.selectedProfile = profile
    console.log(this.selectedProfile)
  }

  getPreferences() {
    this.marketService.getAllTouristPreferences(this.user.id).subscribe({
      next: (result: Preference[]) => {
        this.preferences = result;
        console.log("Resultat je:", result)
      }
    })
  }

  deletePreference(id: number) {
    this.marketService.deletePreference(id).subscribe({
      next: (_) => {
        this.getPreferences();
        console.log("Successfully deleted!");
      }
    })
  }

  onEditClicked(pref: Preference) {
    this.selectedPreference = pref
    this.shouldRenderAdd = false
    if(this.shouldRenderPreferenceForm == true)
      this.shouldRenderPreferenceForm = false
    else
      this.shouldRenderPreferenceForm = true

    this.shouldEdit = true
  }

  onAddClicked() {
    this.shouldRenderPreferenceForm = false
    if(this.shouldRenderAdd == true)
      this.shouldRenderAdd = false
    else
      this.shouldRenderAdd = true
    this.shouldEdit = false;
  }
}