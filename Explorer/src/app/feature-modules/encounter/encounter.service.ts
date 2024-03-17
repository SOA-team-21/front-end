import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Encounter } from './model/encounter.model';
import { SocialEncounter } from './model/socialEncounter.model';
import { HiddenEncounter } from 'src/app/feature-modules/encounter/model/hidden-encounter.model';
import { environment } from 'src/env/environment';
import { ParticipantLocation } from './model/participant-location.model';
import { MiscEncounter } from './model/misc-encounter.model';

@Injectable({
  providedIn: 'root'
})
export class EncounterService {

  constructor(private http: HttpClient) { }

  getAllEncounters(): Observable<PagedResults<Encounter>> {
    return this.http.get<PagedResults<Encounter>>(environment.apiHost + 'encounters/getAll');
  }

  //Social Encounter

  createSocialEncounter(encounter: SocialEncounter): Observable<SocialEncounter> {
    return this.http.post<SocialEncounter>(environment.apiHost + `social-encounters`, encounter);
  }

  activateSocialEncounter(encounterId: number, location: ParticipantLocation): Observable<Encounter>{
      return this.http.put<Encounter>(environment.apiHost + 'social-encounters/activate-social/' + encounterId, location)
  }

  solveSocialEncounter(encounterId: number, location: ParticipantLocation): Observable<SocialEncounter>{
    return this.http.put<SocialEncounter>(environment.apiHost + 'social-encounters/solve-social/' + encounterId, location)
  }

  getAllSocialEncounters(): Observable<any> {
    return this.http.get<any>(environment.apiHost + 'social-encounters/getAll');
  }

  //Hidden Encounter

  addHiddenEncounter(encounter: HiddenEncounter): Observable<HiddenEncounter> {
    return this.http.post<HiddenEncounter>(environment.apiHost + `hidden-encounters`, encounter);
  }

  getHiddenEncounters(): Observable<any[]> {
    return this.http.get<any[]>(environment.apiHost + `hidden-encounters/getAll`);
  }

  activateHiddenEncounter(encounterId: number, participantLocation: ParticipantLocation): Observable<HiddenEncounter> {
    return this.http.put<HiddenEncounter>(environment.apiHost + 'encounters/activate/' + encounterId, participantLocation);
  }

  solveHiddenEncounter(encounterId: number, participantLocation: ParticipantLocation): Observable<HiddenEncounter> {
    return this.http.put<HiddenEncounter>(environment.apiHost + 'hidden-encounters/solve-hidden/' + encounterId, participantLocation);
  }

  //Misc Encounter

  createMiscEncounter(encounter: MiscEncounter): Observable<MiscEncounter> {
    return this.http.post<MiscEncounter>(environment.apiHost + `misc-encounters`, encounter);
  }

  getAllMiscEncounters(): Observable<any> {
    return this.http.get<any>(environment.apiHost + 'misc-encounters/getAll');
  }

  activateMiscEncounter(encounterId: number, location: ParticipantLocation): Observable<Encounter>{
    return this.http.put<Encounter>(environment.apiHost + 'encounters/activate/' + encounterId, location)
  }

  solveMiscEncounter(encounterId: number, location: ParticipantLocation): Observable<MiscEncounter>{
    return this.http.put<MiscEncounter>(`${environment.apiHost}misc-encounters/solve-misc/${encounterId}?username=${location.username}`, {})
  }
  

}
