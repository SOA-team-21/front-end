import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Tour } from './model/tour.model';
import { Problem } from './model/problem.model';
import {PagedResults} from "../../shared/model/paged-results.model";
import {Point} from "./model/points.model";
import { TourReview } from './model/tourReview.model';
import { Club } from './model/club.model';
import { ClubInvitation } from './model/clubInvitation.model';
import { MembershipRequest } from './model/membership-request.model';
import { ClubMember } from './model/clubMember.model';
import {Object} from "./model/object.model";
import { tap } from 'rxjs';
import { Sale } from '../marketplace/model/sale.model';
import { Bundle } from './model/bundle.model';
import { Campaign } from './model/campaign.model';
import { OrderItem } from '../marketplace/model/order-item.model';
import { ShoppingCart } from '../marketplace/model/shopping-cart.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {
    


  constructor(private http: HttpClient) { }

  getPoints(): Observable<PagedResults<Point>>{
    return this.http.get<PagedResults<Point>>(environment.apiHost + 'author/points');
  }

  deletePoints(id: number | undefined): Observable<Point> {
    return this.http.delete<Point>(environment.apiHost + 'author/points/' + id);
  }

  setPublicPoint(id: number, pointName: string): Observable<Tour> {
    return this.http.patch<Tour>(environment.apiHost + 'author/tour/publishPoint/' + id + '?pointName=' + pointName, {});
  }

  getTours(): Observable<PagedResults<Tour>> {
    return this.http.get<PagedResults<Tour>>(environment.apiHost + 'author/tour/getAll');
  }

  getTourById(id: number | undefined): Observable<Tour> {
    console.log(id);
    return this.http.get<Tour>(environment.apiHost + 'author/tour/getById/' + id);
  }

  deleteTour(id: number): Observable<Tour> {
    return this.http.delete<Tour>(environment.apiHost + 'author/tour/' + id);
  }

  addTour(tour: Tour): Observable<Tour> {
    console.log(tour);
    return this.http.post<Tour>(environment.apiHost + 'author/tour', tour);
  }

  updateTour(tour: Tour): Observable<Tour> {
    return this.http.put<Tour>(environment.apiHost + 'author/tour/' + tour.id, tour);
  }

  addTourReview(tour:Tour,tourReview: TourReview): Observable<TourReview>{
    return this.http.post<TourReview>(environment.apiHost + 'author/tour/rateTour/'+ tour.id,tourReview);
  }

  getTourReviews(): Observable<PagedResults<TourReview>> {
    return this.http.get<PagedResults<TourReview>>(environment.apiHost + 'author/tour/get');
  }

  addClub(club: Club) : Observable<Club>{
    return this.http.post<Club>(environment.apiHost + 'club', club)
  }

  getClubs() : Observable<PagedResults<Club>> {
    return this.http.get<PagedResults<Club>>(environment.apiHost + 'club/getAll')
  }

  updateClub(club: Club): Observable<Club> {
    return this.http.put<Club>(environment.apiHost + 'club/' + club.id, club);
  }

  addClubInvitation(clubInvitation: ClubInvitation): Observable<ClubInvitation>{
    return this.http.post<ClubInvitation>(environment.apiHost + 'tourist/clubInvitation', clubInvitation);
  }

  getClubInvitations(): Observable<PagedResults<ClubInvitation>> {
    return this.http.get<PagedResults<ClubInvitation>>(environment.apiHost + 'tourist/clubInvitation/getAll')
  }


  deleteClubInvitation(id: number): Observable<ClubInvitation> {
    return this.http.delete<ClubInvitation>(environment.apiHost + 'tourist/clubInvitation/' + id);
  }

  addProblem(tourId: number, problem: Problem): Observable<Problem> {
    return this.http.post<Problem>(environment.apiHost + 'author/tour/addProblem/'+ tourId,problem);
  }

  createMembershipRequest(membershipRequest:MembershipRequest){
    return this.http.post<MembershipRequest>(environment.apiHost + 'membershipRequests', membershipRequest);
  }

  getAllMembershipRequests (){
    return this.http.get<PagedResults<MembershipRequest>>(environment.apiHost + 'membershipRequests/getAll')
  }

  acceptMembershipRequest (membershipRequest:MembershipRequest){
    console.log(membershipRequest);
    return this.http.put<MembershipRequest>(environment.apiHost + 'membershipRequests/accept/' + membershipRequest.id, membershipRequest)
  }

  rejectMembershipRequest (membershipRequest:MembershipRequest){
    return this.http.put<MembershipRequest>(environment.apiHost + 'membershipRequests/reject/' + membershipRequest.id, membershipRequest)
  }

  getClubMembers(): Observable<PagedResults<ClubMember>> {
    return this.http.get<PagedResults<ClubMember>>(environment.apiHost + 'tourist/clubMember/getAll')
  }


  deleteClubMember(id: number): Observable<ClubMember> {
    return this.http.delete<ClubMember>(environment.apiHost + 'tourist/clubMember/' + id);
  }

  getPointsForTour(id: number): Observable<any> {
    return this.http.get<any>(environment.apiHost + `author/points/getAllForTour/${id}`);
  }

  getObjects(): Observable<PagedResults<Object>>{
    return this.http.get<PagedResults<Object>>(environment.apiHost + 'author/objects');
  }

  deleteObjects(id: number | undefined): Observable<Object> {
    return this.http.delete<Object>(environment.apiHost + 'author/objects/' + id);
  }

  addObject(object: Object): Observable<Object> {
    return this.http.post<Object>(environment.apiHost + 'author/objects',object);
  }

  updateObject(object: Object): Observable<Object> {
    return this.http.put<Object>(environment.apiHost + 'author/objects/' + object.id, object);
  }

  setPublicObject(id: number): Observable<Object> {
    return this.http.patch<Object>(environment.apiHost + 'author/objects/setPublic/' + id, {});
  }

  getAverageRating(tourId: number): Observable<number> {
    return this.http.get<number>(environment.apiHost + 'author/tour/averageRating/' + tourId)
  }

  arhiveTour(id: number): Observable<any> {
    return this.http.get<any>(environment.apiHost + 'author/tour/arhiveTour/' + id);
  }

  publishTour(id: number): Observable<any> {
    return this.http.get<any>(environment.apiHost + 'author/tour/publishTour/' + id);
  }
  
  getAllProblems(user: User): Observable<PagedResults<Problem>> {
    return this.http.get<PagedResults<Problem>>(environment.apiHost + 'author/problems/getAll/'+ user.id)
     .pipe(
       tap(data => console.log('API Response:', data)),
     );
  }
  respondToProblem(id: number, response: string): Observable<PagedResults<Problem>> {
    return this.http.patch<PagedResults<Problem>>(`${environment.apiHost}author/problems/respondToProblem/${id}/${response}`, null)
      .pipe(
        tap(data => console.log('Response to problem:', data)),
      );
  }
  getProblemsForTour(id: number): Observable<any> {
    return this.http.get<any>(environment.apiHost + `author/problems/getToursProblems/${id}`);
  }
  problemNotSolved(id: number, comment: string): Observable<PagedResults<Problem>> {
    return this.http.patch<PagedResults<Problem>>(`${environment.apiHost}tourist/problem/problemNotSolved/${id}/${comment}`, comment)
      .pipe(
        tap(data => console.log('Problem marked as not solved:', data)),
      );
  }

  solveProblem(id: number): Observable<PagedResults<Problem>> {
    return this.http.patch<PagedResults<Problem>>(`${environment.apiHost}tourist/problem/solveProblem/${id}`, null)
      .pipe(
        tap(data => console.log('Response to problem:', data)),
      );
  }
  getAllTouristsProblems(user: User): Observable<PagedResults<Problem>> {
    return this.http.get<PagedResults<Problem>>(environment.apiHost + 'tourist/problem/getAll/'+ user.id);
  }
  getToursOnSale(): Observable<PagedResults<Tour>> {
    console.log('Entering getToursOnSale in service');
    return this.http.get<PagedResults<Tour>>(environment.apiHost + 'author/sale/getAllToursOnSale');
  }
  getAllSales(): Observable<PagedResults<Sale>> { 
    return this.http.get<PagedResults<Sale>>(environment.apiHost + 'author/sale/getAll');
  }

  activateSale(saleId: number) {
    return this.http.get<any>(environment.apiHost + 'author/sale/activate/' + saleId);
  }
  getAllBundles(): Observable<any> {
    return this.http.get<any>(environment.apiHost + 'author/bundle/getAll');
  }

  archiveBundle(id: number): Observable<any>{
    return this.http.get<any>(environment.apiHost + 'author/bundle/archive/' + id);
  }

  publishBundle(id: number): Observable<any>{
    return this.http.get<any>(environment.apiHost + 'author/bundle/publish/' + id);
  }

  deleteBundle(id: number): Observable<any>{
    return this.http.delete<any>(environment.apiHost + 'author/bundle/delete/' + id);
  }
  getAllPublicPointsForTours(): Observable<Point []> {
    return this.http.get<Point []>(environment.apiHost + 'author/tour/getAllPointsForTours');
  }
  findToursContainingPoints(selectedPoints: Point[]): Observable<Tour []> {
    return this.http.put<Tour[]>(environment.apiHost + 'author/tour/findTours', selectedPoints);
  }
  createBundle(dataIn: any): Observable<any>{
    return this.http.post<any>(environment.apiHost + 'author/bundle/create', dataIn);
  }


  createCampaign(campaign: Campaign): Observable<any> {
    return this.http.post<Campaign>(environment.apiHost + 'tourist/campaign', campaign);
  }

  getCampaigns(touristId: number): Observable<PagedResults<Campaign>> {
    return this.http.get<PagedResults<Campaign>>(environment.apiHost + 'tourist/campaign/getAll/' + touristId);
  }
  addToCart(orderItem: OrderItem, userId: number): Observable<ShoppingCart>{
    const queryParams  = new HttpParams().set('userId', userId);
    return this.http.post<ShoppingCart>(environment.apiHost + 'tourist/order/addToCart', orderItem, { params: queryParams });
  }
  findToursReviewedByUsersIFollow(currentUserId: number, ratedTourId: number): Observable<Tour []> {
    const queryParams = new HttpParams()
        .set('currentUserId', currentUserId.toString())
        .set('ratedTourId', ratedTourId.toString());

    return this.http.put<Tour []>(environment.apiHost + 'author/tour/findToursByFollowers', null, { params: queryParams });
  }
  getIdByName(name: string): Observable<number> {
    return this.http.get<number>(environment.apiHost + 'author/tour/getIdByName/' + name);
  }
}

