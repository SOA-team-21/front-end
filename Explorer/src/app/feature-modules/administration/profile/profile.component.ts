import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Person } from '../model/userprofile.model';
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

  user: User;
  person: Person;
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
    this.getFollowers();
    this.getPreferences();
    // const isReloaded = sessionStorage.getItem('isReloaded');
    // if (!isReloaded || this.preferences.length == 0) {
    //   sessionStorage.setItem('isReloaded', 'true');
    //   window.location.reload();
    // } else {
    //   sessionStorage.removeItem('isReloaded');
    // }   
  }

  getUser(): void {
    this.authService.user$.pipe(
      switchMap((user: User) => {
        this.user = user;
        this.getWallet(user.id);
        return this.service.getUser(this.user.id);
      })
    ).subscribe((result: any) => {
      this.person = result;
      console.log(this.person);
    });
  } 

  getFollowers(): void {
    this.service.getUserFollowers(this.user.id).subscribe((result: any) => {
      this.user.followers = result;
    });
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
