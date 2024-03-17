import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { ProfileComponent } from 'src/app/feature-modules/administration/profile/profile.component';
import { ProblemFormComponent } from 'src/app/feature-modules/tour-authoring/problem-form/problem-form.component';
import { ProblemsComponent } from 'src/app/feature-modules/administration/problems/problems.component';
import { OverviewComponent } from 'src/app/feature-modules/administration/admin/overview.component';
import { BlogFormComponent } from 'src/app/feature-modules/blog/blog-form/blog-form.component';
import { TourComponent } from 'src/app/feature-modules/tour-authoring/tour/tour.component';
import { AppRatingsComponent } from 'src/app/feature-modules/administration/app-ratings/app-ratings.component';
import { AppRatingFormComponent } from 'src/app/feature-modules/administration/app-rating-form/app-rating-form.component';
import { EquipmentRecordComponent } from 'src/app/feature-modules/administration/equipment-record/equipment-record.component';
import { ClubComponent } from 'src/app/feature-modules/tour-authoring/club/club.component';
import { ClubInvitationFormComponent } from 'src/app/feature-modules/tour-authoring/club-invitation-form/club-invitation-form.component';
import { ClubInvitationsComponent } from 'src/app/feature-modules/tour-authoring/club-invitations/club-invitations.component';
import { MembershipRequestComponent } from 'src/app/feature-modules/tour-authoring/membership-request/membership-request.component';
import { ClubMembersComponent } from 'src/app/feature-modules/tour-authoring/club-members/club-members.component';
import {ObjectComponent} from "../../feature-modules/tour-authoring/object/object.component";
import { ShoppingCartComponent } from 'src/app/feature-modules/marketplace/shopping-cart/shopping-cart.component';
import {
  PositionSimulatorComponent
} from "../../feature-modules/tour-execution/position-simulator/position-simulator.component";
import { SearchResultsComponent } from 'src/app/feature-modules/marketplace/search-results/search-results.component';
import { FindPeopleComponent } from 'src/app/feature-modules/administration/find-people/find-people.component';
import { DetailedBlogComponent } from 'src/app/feature-modules/blog/detailed-blog/detailed-blog.component';
import { BlogsPageComponent } from 'src/app/feature-modules/blog/blogs-page/blogs-page.component';
import { PublicRegistrationRequestsComponent } from 'src/app/feature-modules/administration/public-registration-requests/public-registration-requests.component';
import { PurchasedToursComponent } from 'src/app/feature-modules/tour-execution/purchased-tours/purchased-tours.component';
import { BundleComponent } from 'src/app/feature-modules/tour-authoring/bundle/bundle.component';
import { ShowTourComponent } from 'src/app/feature-modules/marketplace/show-tour/show-tour.component';
import { AuthorsProblemsComponent } from '../../feature-modules/tour-authoring/authors-problems/authors-problems.component';
import { TouristsProblemsComponent } from 'src/app/feature-modules/tour-authoring/tourists-problems/tourists-problems.component';
import { CouponComponents } from 'src/app/feature-modules/marketplace/coupons/coupons.components';
import { ToursOnSaleComponent } from 'src/app/feature-modules/marketplace/tours-on-sale/tours-on-sale.component';
import { ActivateSaleComponent } from 'src/app/feature-modules/marketplace/activate-sale/activate-sale.component';
import { ActivateAccountComponent } from '../auth/activate-account/activate-account.component';
import { PointsViewComponent } from 'src/app/feature-modules/tour-authoring/points-view/points-view.component';
import { TourCampaignsComponent } from 'src/app/feature-modules/tour-authoring/tour-campaigns/tour-campaigns.component';
import { TourCampaignFormComponent } from 'src/app/feature-modules/tour-authoring/tour-campaign-form/tour-campaign-form.component';
import { HiddenEncounterFormComponent } from 'src/app/feature-modules/encounter/hidden-encounter-form/hidden-encounter-form.component';
import { SocialEncounterFormComponent } from 'src/app/feature-modules/encounter/social-encounter-form/social-encounter-form.component';
import { MiscEncounterFormComponent } from 'src/app/feature-modules/encounter/misc-encounter-form/misc-encounter-form.component';
import { EncounterCreationComponent } from 'src/app/feature-modules/encounter/encounter-creation/encounter-creation.component';
import { TourCommunityRecommendComponent } from 'src/app/feature-modules/tour-authoring/tour-community-recommend/tour-community-recommend.component';
import { ForgotPasswordComponent } from '../auth/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from '../auth/change-password/change-password.component';
import { BlogReportsComponent } from 'src/app/feature-modules/blog/blog-reports/blog-reports.component'; 
import { CalendarComponent } from 'src/app/feature-modules/administration/calendar/calendar.component'; 
import { TourStatisticsComponent } from 'src/app/feature-modules/tour-execution/tour-statistics/tour-statistics.component'; 
import { TourOwnViewComponent } from 'src/app/feature-modules/tour-authoring/tour-own-view/tour-own-view.component';
const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'profile', component: ProfileComponent, canActivate:[AuthGuard]},
  {path: 'problem-form', component: ProblemFormComponent},
  {path: 'problems', component: ProblemsComponent},
  {path: 'overview', component: OverviewComponent},
  {path: 'blog-creation', component: BlogFormComponent, canActivate: [AuthGuard]},
  {path: 'tours', component: TourComponent, canActivate: [AuthGuard]},
  {path: 'app-ratings', component: AppRatingsComponent},
  {path: 'app-rating-form', component: AppRatingFormComponent},
  {path: 'equipment-record', component: EquipmentRecordComponent},
  {path: 'club', component: ClubComponent},
  {path: 'invitations', component: ClubInvitationFormComponent},
  {path: 'club-invitations', component: ClubInvitationsComponent},
  {path: 'membership-requests', component: MembershipRequestComponent},
  {path: 'club-members', component: ClubMembersComponent},
  {path: 'objects', component: ObjectComponent},
  {path: 'shopping-cart', component: ShoppingCartComponent},
  {path: 'tour-execution-lifecycle', component: PositionSimulatorComponent},
  {path: 'search-results', component: SearchResultsComponent},
  {path: 'find-people', component: FindPeopleComponent},
  {path: 'detailed-blog/:blogId', component: DetailedBlogComponent, canActivate: [AuthGuard]},
  {path: 'all-blogs', component: BlogsPageComponent},
  {path: 'public-registration-requests', component: PublicRegistrationRequestsComponent},
  {path: 'purchased-tours', component: PurchasedToursComponent},
  {path: 'all-bundles', component: BundleComponent},
  {path: 'show-tour/:tourId', component: ShowTourComponent},
  {path: 'authors-problems', component: AuthorsProblemsComponent},
  {path: 'tourists-problems', component: TouristsProblemsComponent},
  {path: 'coupons', component: CouponComponents},
  {path: 'tours-on-sale', component: ToursOnSaleComponent},
  {path: 'activate-sale', component: ActivateSaleComponent},
  {path: 'activate', component: ActivateAccountComponent},
  {path: 'points-view', component: PointsViewComponent},
  {path: 'hidden-encounter-form', component: HiddenEncounterFormComponent},
  {path: 'tour-campaigns', component: TourCampaignsComponent},
  {path: 'tour-campaign-form', component: TourCampaignFormComponent},
  {path: 'social-encounter-form', component: SocialEncounterFormComponent},
  {path: 'misc-encounter-form', component: MiscEncounterFormComponent},
  {path: 'encounter-creation', component: EncounterCreationComponent},
  {path: 'tour-community-recommend/:tourId', component: TourCommunityRecommendComponent },
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'change-password', component: ChangePasswordComponent},
  {path: 'blog-reports', component: BlogReportsComponent}, //, canActivate: [AuthGuard]},
  {path: 'app-calendar', component: CalendarComponent},
  {path: 'tour-statistics', component: TourStatisticsComponent},
  {path: 'tour-own-view', component: TourOwnViewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }