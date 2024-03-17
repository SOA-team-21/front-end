import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TextFieldModule } from "@angular/cdk/text-field";
import { TourReviewFormComponent } from './tour-review-form/tour-review-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { MatRadioModule } from '@angular/material/radio';
import { TourComponent } from './tour/tour.component';
import { TourFormComponent } from './tour-form/tour-form.component';
import { ClubComponent } from './club/club.component';
import { ClubFormComponent } from './club-form/club-form.component';
import { ClubInvitationFormComponent } from './club-invitation-form/club-invitation-form.component';
import { ClubInvitationsComponent } from './club-invitations/club-invitations.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProblemFormComponent } from './problem-form/problem-form.component';
import { MembershipRequestComponent } from './membership-request/membership-request.component';
import { ClubMembersComponent } from './club-members/club-members.component';
import { TourReviewComponent } from './tour-review/tour-review.component';
import { ObjectComponent } from './object/object.component';
import { ObjectFormComponent } from './object-form/object-form.component';
import { BundleComponent } from './bundle/bundle.component';
import { CreateBundleComponent } from './bundle/create-bundle/create-bundle.component';
import { AuthorsProblemsComponent } from './authors-problems/authors-problems.component';
import { TouristsProblemsComponent } from './tourists-problems/tourists-problems.component';
import { PointsViewComponent } from './points-view/points-view.component';
import { TourCampaignsComponent } from './tour-campaigns/tour-campaigns.component';
import { TourCampaignFormComponent } from './tour-campaign-form/tour-campaign-form.component';
import { TourCommunityRecommendComponent } from './tour-community-recommend/tour-community-recommend.component';
import { TourOwnViewComponent } from './tour-own-view/tour-own-view.component';


@NgModule({
  declarations: [
    TourReviewFormComponent,
    TourComponent,
    TourFormComponent,
    ClubComponent,
    ClubFormComponent,
    ClubInvitationFormComponent,
    ClubInvitationsComponent,
    ProblemFormComponent,
    MembershipRequestComponent,
    ClubMembersComponent,
    TourReviewComponent,
    ObjectComponent,
    ObjectFormComponent,
    BundleComponent,
    CreateBundleComponent,
    AuthorsProblemsComponent,
    TouristsProblemsComponent,
    PointsViewComponent,
    TourCampaignsComponent,
    TourCampaignFormComponent,
    TourCommunityRecommendComponent,
    TourOwnViewComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TextFieldModule,
    MatRadioModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    TourComponent,
    TourFormComponent,
    TourReviewFormComponent,
    ClubComponent,
    ClubFormComponent,
    ClubInvitationFormComponent,
    ClubInvitationsComponent,
    ProblemFormComponent,
    ClubMembersComponent,
    ObjectComponent,
    ObjectFormComponent,
    AuthorsProblemsComponent,
    TouristsProblemsComponent,
    PointsViewComponent,
    TourCampaignsComponent,
    TourCampaignFormComponent,
    TourCommunityRecommendComponent,
    TourOwnViewComponent
  ]
})
export class TourAuthoringModule { }
