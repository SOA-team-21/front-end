import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Person } from './model/userprofile.model';
import { Problem } from '../tour-authoring/model/problem.model';
import { AppRating } from './model/app-rating.model';
import { TouristEquipment } from './model/tourist-equipment.model';
import { User, UserInfo } from 'src/app/infrastructure/auth/model/user.model';
import { PublicRegistrationRequest } from './model/public-registration-request.model';
import { UserNotification } from 'src/app/infrastructure/auth/model/user.model';
import { Wallet } from '../marketplace/model/wallet.model';


@Injectable({
  providedIn: 'root'
})
export class AdministrationService {
  
  

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'administration/equipment')
  }

  deleteEquipment(id: number): Observable<Equipment> {
    return this.http.delete<Equipment>(environment.apiHost + 'administration/equipment/' + id);
  }

  addEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(environment.apiHost + 'administration/equipment', equipment);
  }

  updateEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(environment.apiHost + 'administration/equipment/' + equipment.id, equipment);
  }

  //Profile, Administration

  getUser(id: number): Observable<Person>{
    return this.http.get<Person>(environment.apiHost + 'userprofile/' + id);
  }

  updateUser(profile: Person): Observable<Person> {
    return this.http.put<Person>(environment.apiHost + 'userprofile/updateUser/' + profile.id, profile);
  }
  getProblems(): Observable<PagedResults<Problem>> {
    return this.http.get<PagedResults<Problem>>(environment.apiHost + 'administration/problems')
  }

  getAllUsers(): Observable<UserInfo[]> {
    return this.http.get<UserInfo[]>(environment.apiHost + 'administration/users/getAll');
  }
  
  blockUser(username: string): Observable<UserInfo> {
    const url = `${environment.apiHost}administration/users/block-user?username=` + username;
    return this.http.post<UserInfo>(url, {});
  }
  
  getUserFollowers(id: number): Observable<PagedResults<User>> {
    return this.http.get<PagedResults<User>>(environment.apiHost + 'userprofile/followers/' + id);
  }

  getUsersToFollow(): Observable<PagedResults<User>> {
    return this.http.get<PagedResults<User>>(environment.apiHost + 'userprofile/allUsers');
  }

  followUser(userId: number, userToFollowId: number) {
    return this.http.patch<User>(environment.apiHost + 'userprofile/followers/' + userId + '/follow/' + userToFollowId, {});
  }

  unfollowUser(userId: number, userToUnfollowId: number) {
    return this.http.patch<User>(environment.apiHost + 'userprofile/followers/' + userId + '/unfollow/' + userToUnfollowId, {});
  }

  canUserUseBlog(userId: number): Observable<boolean> {
    return this.http.get<boolean>(environment.apiHost + 'userprofile/canUserUseBlog/' + userId);
  }

  //Wallet

  getUserWallet(userId: number): Observable<Wallet> {
    return this.http.get<Wallet>(environment.apiHost + 'tourist/wallet/getByUserId/' + userId);
  }

  getAllWallets(): Observable<PagedResults<Wallet>> {
    return this.http.get<PagedResults<Wallet>>(environment.apiHost + 'tourist/wallet');
  }

  addCoins(userId: number, coins: number): Observable<Wallet> {
    return this.http.patch<Wallet>(environment.apiHost + 'tourist/wallet/addCoins/' + userId, coins)
  }

  //Notifications
  getUserNotifications(userId: number): Observable<PagedResults<User>> {
    return this.http.get<PagedResults<User>>(environment.apiHost + 'notifications/' + userId);
  }

  markAsReadNotification(userId: number, notificationId: number | undefined){
    return this.http.patch<User>(environment.apiHost + 'notifications/user/' + userId + '/status/' + notificationId, {});
  }

  sendNotificationToFollowers(notification: UserNotification){
    return this.http.patch<User>(environment.apiHost + 'notifications', notification);
  }

  notifyUser(receiverId: number, notification: UserNotification){
    return this.http.patch<User>(environment.apiHost + 'notifications/' + receiverId, notification);
  }

  removeNotification(userId: number, notificationId: number | undefined){
    return this.http.patch<User>(environment.apiHost + 'notifications/user/' + userId + '/delete/' + notificationId, {})
  }

  // App ratings
  getAppRatings(): Observable<PagedResults<AppRating>> {
    return this.http.get<PagedResults<AppRating>>(environment.apiHost + 'administration/app-ratings')
  }
  addAppRating(rating: AppRating): Observable<AppRating> {
    return this.http.post<AppRating>(environment.apiHost + 'administration/app-ratings', rating);
  }

  //Tourist equipment record
  getTouristEquipment(): Observable<PagedResults<TouristEquipment>> {
    return this.http.get<PagedResults<TouristEquipment>>(environment.apiHost + 'tourist/equipment')
  }

  addTouristEquipment(touristEquipment: TouristEquipment): Observable<TouristEquipment>{
    return this.http.post<TouristEquipment>(environment.apiHost + 'tourist/equipment', touristEquipment);
  }
  removeTouristEquipment(id: number): Observable<TouristEquipment> {
    return this.http.delete<TouristEquipment>(environment.apiHost + 'tourist/equipment/' + id);
  }

  //Public registration request

  getPublicRegistrationRequests() : Observable<PagedResults<PublicRegistrationRequest>> {
    return this.http.get<PagedResults<PublicRegistrationRequest>>(environment.apiHost + 'administration/registrationRequests')
  }

  getAllPendingRequests() : Observable<PublicRegistrationRequest[]> {
    return this.http.get<PublicRegistrationRequest[]>(environment.apiHost + 'administration/registrationRequests/getAllPending')
  }

  addPublicRegistrationRequest(publicRegistrationRequest: PublicRegistrationRequest): Observable<PublicRegistrationRequest>{
    return this.http.post<PublicRegistrationRequest>(environment.apiHost + 'administration/registrationRequests', publicRegistrationRequest);
  }

  updatePublicRegistrationRequest(publicRegistrationRequest: PublicRegistrationRequest): Observable<PublicRegistrationRequest>{
    return this.http.put<PublicRegistrationRequest>(environment.apiHost + 'administration/registrationRequests/' + publicRegistrationRequest.id, publicRegistrationRequest);
  }
  setDeadlineForProblem(problemId: number, newDeadline: Date): Observable<any> {
    const url = `${environment.apiHost}administration/problems/set-deadline/${problemId}`;
    const requestBody = newDeadline.toISOString(); // Samo vrednost datuma
    return this.http.patch(url, `"${requestBody}"`, { headers: { 'Content-Type': 'application/json' } }).pipe(
     
    );
  }
  
  
  deleteProblem(id: number): Observable<Problem> {
    return this.http.delete<Problem>(environment.apiHost + 'administration/problems/' + id + '/delete');
  }
  getUnresolvedProblemsWithDeadline(): Observable<PagedResults<Problem>> {
    return this.http.get<PagedResults<Problem>>(environment.apiHost + 'administration/problems/getall');
  }
 


}
