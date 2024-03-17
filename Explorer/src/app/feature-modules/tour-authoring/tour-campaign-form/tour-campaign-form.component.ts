import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Tour } from '../model/tour.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourAuthoringService } from '../tour-authoring.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { Campaign } from '../model/campaign.model';

@Component({
  selector: 'xp-tour-campaign-form',
  templateUrl: './tour-campaign-form.component.html',
  styleUrls: ['./tour-campaign-form.component.css']
})
export class TourCampaignFormComponent implements OnInit {

  availableTours: Tour[] = [];
  selectedTours: Tour[] = [];

  totalDifficulty: number = 0;
  totalLength: number = 0;
  user: User | undefined;
  campaignName: string = '';

  constructor(private authService: AuthService, private tourService: TourAuthoringService, private tourExeService: TourExecutionService) { }

  ngOnInit(): void {

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getAvailableTours();
  }

  getAvailableTours() {
    this.tourService.getTours().subscribe((pagedResults: PagedResults<Tour>) => {
      this.availableTours = pagedResults.results;
      this.tourExeService.getTouristTokens(this.user?.id!).subscribe((tokens) => {
        this.availableTours = this.availableTours.filter((tour) => {
          return tokens.find((token) => token.tourId === tour.id) !== undefined;
        });
        this.sortTours();
      });
    });
  }

  sortTours() {
    this.availableTours.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name === b.name) { return 0; }
      return 1;
    });
  }

  selectTour(tour: Tour) {
    this.selectedTours.push(tour);
    this.availableTours = this.availableTours.filter((t) => t.id !== tour.id);
    this.totalDifficulty = this.calculateDifficulty();
    this.totalLength += tour.length;
  }

  deselectTour(tour: Tour) {
    this.selectedTours = this.selectedTours.filter((t) => t.id !== tour.id);
    this.availableTours.push(tour);
    this.totalDifficulty = this.calculateDifficulty();
    this.totalLength -= tour.length;
    this.sortTours();
  }

  moveUp(tour: Tour) {
    const index = this.selectedTours.indexOf(tour);
    if (index > 0) {
      this.selectedTours.splice(index, 1);
      this.selectedTours.splice(index - 1, 0, tour);
    }
  }

  moveDown(tour: Tour) {
    const index = this.selectedTours.indexOf(tour);
    if (index < this.selectedTours.length - 1) {
      this.selectedTours.splice(index, 1);
      this.selectedTours.splice(index + 1, 0, tour);
    }
  }

  calculateDifficulty() {
    if (this.selectedTours.length === 0) return 0;
    this.totalDifficulty = 0;
    this.selectedTours.forEach((tour) => {
      this.totalDifficulty += tour.difficult;
    });
    return Math.round(this.totalDifficulty / this.selectedTours.length);
  }


  createCampaign() {
    const campaign: Campaign = {
      id: 0,
      title: this.campaignName,
      tours: this.selectedTours.map(tour => ({ ...tour, guides: null })),
      touristId: this.user?.id!,
      difficult: this.totalDifficulty,
      length: this.totalLength,
    };

    this.tourService.createCampaign(campaign).subscribe((campaign) => {
      alert("Campaign created successfully!")
    }, (error) => {
      alert("Error creating campaign!");
    });
  }


}
