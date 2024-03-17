import { Component, OnInit } from '@angular/core';
import { Campaign } from '../model/campaign.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourAuthoringService } from '../tour-authoring.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { timer } from 'rxjs/internal/observable/timer';

@Component({
  selector: 'xp-tour-campaigns',
  templateUrl: './tour-campaigns.component.html',
  styleUrls: ['./tour-campaigns.component.css']
})
export class TourCampaignsComponent implements OnInit {

  campaigns: Campaign[] = [];
  user: User | undefined;
  hasCampaigns: undefined | boolean = undefined;

  constructor(private authService: AuthService, private tourService: TourAuthoringService) { }

  ngOnInit(): void {
    
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getCampaigns();
    // Covek se zabavlja
    // timer(1500).subscribe(() => {
    //   this.getCampaigns();
    // });
  }

  getCampaigns() {
    this.tourService.getCampaigns(this.user!.id).subscribe((campaigns: any) => {
      this.campaigns = campaigns;
      if (this.campaigns.length > 0) this.hasCampaigns = true;
      else this.hasCampaigns = false;
    });
  }

}
