import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TourExecutionService } from "../tour-execution.service";
import { GoPoint, Point } from '../../tour-authoring/model/points.model';
import { GoToken, GoTourExecution , GoPointTask, GoPosition} from '../model/tour-lifecycle.model';
import { GoTour } from '../../tour-authoring/model/tour.model';
import { Router } from '@angular/router';
import { SocialEncounter } from '../../encounter/model/socialEncounter.model';
import { GoHiddenEncounter, HiddenEncounter } from '../../encounter/model/hidden-encounter.model';
import { EncounterService } from '../../encounter/encounter.service';
import { ParticipantLocation } from '../../encounter/model/participant-location.model';
import { Encounter, GoEncounter } from '../../encounter/model/encounter.model';
import { MiscEncounter } from '../../encounter/model/misc-encounter.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';

@Component({
  selector: 'xp-tour-execution-lifecycle',
  templateUrl: './position-simulator.component.html',
  styleUrls: ['./position-simulator.component.css']
})
export class PositionSimulatorComponent implements OnInit {
  
  private goToken : GoToken;
  tourExecution: GoTourExecution
  doneTasks: GoPointTask[]
  updatedExecution: GoTourExecution
  tour: GoTour
  partLocation: ParticipantLocation
  
  isShowReviewFormEnabled: boolean = false;
  isCreateBlogFormEnabled: boolean = false;
  showReviewForm() {
    this.isShowReviewFormEnabled = !this.isShowReviewFormEnabled;
  }

  showBlogForm() {
    this.isCreateBlogFormEnabled = !this.isShowReviewFormEnabled;
  }

  hiddenEncounters: any[] = []
  socialEncounters: any[] = []
  miscEncounters: any[] = []

  selectedHiddenEncounter: GoHiddenEncounter = {
    "id": 0,
    "Name": "",
    "Description": "Encounter Description",
    "Location": {
      "latitude": 45.248376910202616,
      "longitude": 19.836076282798334,
    },
    "Experience": 50,
    "Status": 2,
    "Type": 1,
    "Radius": 100,
    "Participants": [],
    "Completers": [],
    "Image": "",
    "Position": {
      "latitude": 0,
      "longitude": 0
    }
  }

  showMap: boolean = true;
  showMessage: boolean = false;
  showDiv: boolean = false;

  clickedBlackMarker: boolean = false
  canActivateHiddenEncounter: boolean = true
  canSolveHiddenEncounter: boolean = false

  activatedHiddenEncounter: GoEncounter = {
    "id": 0,
    "Name": "",
    "Description": "Encounter Description",
    "Location": {
      "latitude": 45.248376910202616,
      "longitude": 19.836076282798334,
    },
    "Experience": 50,
    "Status": 2,
    "Type": 1,
    "Radius": 100,
    "Participants": [],
    "Completers": []
  }

  lastTaskPoint: Point = {
    longitude: 1,
    latitude: 1,
    name: "",
    description: "",
    picture: "",
    public: false
  }

  clickedMarker: boolean = false
  clickedYellowMarker: boolean = false
  canActivate: boolean = true
  canSolve: boolean = true

  activatedEncounter: Encounter 
  solvedSocialEncounter: SocialEncounter
  solvedSocialEncounters: SocialEncounter[] = []
  activatedSocialEncounters: Encounter[] = []

  activatedMisc: MiscEncounter
  solvedMisc: MiscEncounter
  solvedMiscEncounters: MiscEncounter[] = []
  activatedMiscEncounters: Encounter[] = []

  encounterModal: SocialEncounter ={
    "id": 0,
    "name": "",
    "description": "Encounter Description",
    "location": {
      "latitude": 45.248376910202616,
      "longitude": 19.836076282798334,
    },
    "experience": 50,
    "status": 2,
    "type": 1,
    "radius": 100,
    "participants": [],
    "completers": [],
    "requiredParticipants": 0,
    "currentlyInRange": []
  };

  miscModal: MiscEncounter ={
    "id": 0,
    "name": "",
    "description": "Encounter Description",
    "location": {
      "latitude": 45.248376910202616,
      "longitude": 19.836076282798334,
    },
    "experience": 50,
    "status": 2,
    "type": 1,
    "radius": 100,
    "participants": [],
    "completers": [],
  };

  @Output() points: GoPoint[] = []

  positionForm = new FormGroup({
    longitude: new FormControl(-1, [Validators.required]),
    latitude: new FormControl(-1, [Validators.required])
  })

  constructor(private service: TourExecutionService, private encounterService: EncounterService, private tourService: TourAuthoringService, private router: Router) {
  }

  ngOnInit(): void {

    this.goToken = history.state.token;
    this.service.startExecution(this.goToken).subscribe({
      next: (result: GoTourExecution) => {
        console.log('Result: ', result)
        this.tourExecution = result;
        this.tourService.getTourById(this.goToken.tourId).subscribe({
          next: (response: GoTour) => {
            console.log('Received Tour: ', response);
            this.tour = response;
            this.points = this.tour.KeyPoints;
          }
        })
      },
      error: (error) => {
        console.error('Error starting execution:', error);
      }
    });

    this.getSocialEncounters(); 
    this.getHiddenEncounters();
    this.getMiscEncounters();
  }


  // TOUR EXECUTION
  GetLatitude(latitude: number) {
    console.log(latitude);
    this.positionForm.get('latitude')?.patchValue(latitude);
  }
  GetLongitude(longitude: number) {
    console.log(longitude);
    this.positionForm.get('longitude')?.patchValue(longitude);

  }

  confirmPosition() {
    const position: GoPosition = {
      Longitude: Number(this.positionForm.value.longitude),
      Latitude: Number(this.positionForm.value.latitude),
      LastActivity: new Date(Date.now())
    }

    this.service.updatePosition(this.tourExecution.id, position).subscribe({
      next: (result: GoTourExecution) => {
        this.updatedExecution = result
        this.doneTasks = this.getCompletedPoints(this.updatedExecution)
        this.completeTour()
      }
    })
  }

  completeTour(){
      if(this.doneTasks.length == this.tour.KeyPoints.length){
        this.showMap = false;          
        this.showMessage = true;
      }
  }

  getCompletedPoints(tourExecution: GoTourExecution): GoPointTask[] {
    if (tourExecution.Tasks) {
      return tourExecution.Tasks.filter((pointTask) => pointTask.Done === true);
    } else
      return [];
  }

  quitTour() {
    this.service.exitTour(this.tourExecution).subscribe({
      next: (result: GoTourExecution) => {
        console.log(result)
      }
    })
    this.showMessage = true
    this.showMap = false
  }

  returnToHomePage() {
    this.router.navigate(['/']);
  }

  hideDiv() {
    this.showDiv = false;
  }

  // ENCOUNTERS
  handleMarkerClick(encounter: SocialEncounter) {
    console.log('Marker clicked:', encounter);
    this.encounterModal = encounter;
    if(this.encounterModal.type === 1){
        this.clickedMarker = true;
        this.clickedBlackMarker = false;
        this.clickedYellowMarker = false;
    }
  }

  handleBlackMarkerClick(hiddenEncounter: GoHiddenEncounter) {
    this.selectedHiddenEncounter = hiddenEncounter;
    if (this.selectedHiddenEncounter.Type == 2) {
      this.clickedBlackMarker = true;
      this.clickedMarker = false;
      this.clickedYellowMarker = false;
    }
  }

  handleYellowMarkerClick(miscEncounter: MiscEncounter) {
    this.miscModal = miscEncounter;
    if (this.miscModal.type == 3) {
      this.clickedYellowMarker = true;
      this.clickedBlackMarker = false;
      this.clickedMarker = false;
    }
  }

  socialEncounterButton(){

    if(this.encounterModal.completers?.some(participant => participant.username === this.service.user.value.username)){
      this.canSolve = false
      this.canActivate = false     
    }

    if(this.solvedSocialEncounters.some(encounter => encounter.id === this.encounterModal.id) ||
      !this.encounterModal.currentlyInRange.some(participant => participant.username === this.service.user.value.username) &&
   this.encounterModal.completers?.some(participant => participant.username === this.service.user.value.username)
   || (this.encounterModal.currentlyInRange.some(participant => participant.username === this.service.user.value.username) &&
   !this.encounterModal.completers?.some(participant => participant.username === this.service.user.value.username)))
        this.canSolve = false;
    else
        this.canSolve = true;

    if(!this.encounterModal.participants?.some(participant => participant.username === this.service.user.value.username)
    && !this.encounterModal.completers?.some(participant => participant.username === this.service.user.value.username) &&
    !this.activatedSocialEncounters.some(encounter => encounter.id === this.encounterModal.id))
        this.canActivate = true;
    else
        this.canActivate = false;

    if(this.canActivate)
      this.canSolve = false

    this.clickedMarker = false;
  }
  hiddenEncounterButton() {
    this.clickedBlackMarker = false;
    if(this.selectedHiddenEncounter.Participants?.some(participant => participant.Username === this.service.user.value.username)){
      this.canActivateHiddenEncounter = false;
    }
  }
  miscEncounterButton() {
    if(this.encounterModal.completers?.some(participant => participant.username === this.service.user.value.username)){
      this.canSolve = false
      this.canActivate = false     
    }
    if(this.solvedMiscEncounters.some(encounter => encounter.id === this.miscModal.id)
       ||
       this.miscModal.completers?.some(participant => participant.username === this.service.user.value.username))
          this.canSolve = false;
    else
          this.canSolve = true;

    if(!this.miscModal.participants?.some(participant => participant.username === this.service.user.value.username)
      && !this.miscModal.completers?.some(participant => participant.username === this.service.user.value.username) &&
      !this.activatedMiscEncounters.some(encounter => encounter.id === this.miscModal.id))
          this.canActivate = true;
    else
          this.canActivate = false;
    if(this.canActivate)
        this.canSolve = false
      this.clickedYellowMarker = false;
  }
  activateSocialEncounter(){
    if(this.encounterModal.name != ""){
      this.partLocation =
       {"username": this.service.user.value.username,
        "latitude": this.updatedExecution.Position.Latitude,
        "longitude": this.updatedExecution.Position.Longitude,
                  }
      this.encounterService.activateSocialEncounter(this.encounterModal.id, this.partLocation).subscribe({
        next: (result: Encounter) => {
              this.activatedEncounter = result;
              this.encounterModal.participants = result.participants;
              this.activatedSocialEncounters.push(result);
              if(this.activatedEncounter.participants?.some(participant => participant.username === this.service.user.value.username)){
                  this.canActivate = false;
                  this.canSolve = true;
              }
              console.log("aktivirani: ", result)
        }
      })
    } 
  }

  solveSocialEncounter(){
    if(this.encounterModal.name != ""){
      this.partLocation =
       {"username": this.service.user.value.username,
        "latitude": this.updatedExecution.Position.Latitude,
        "longitude": this.updatedExecution.Position.Longitude,
                  }
      this.encounterService.solveSocialEncounter(this.encounterModal.id, this.partLocation).subscribe({
        next: (result: SocialEncounter) => {
          this.solvedSocialEncounter = result;
          this.encounterModal.participants = result.participants;
          this.solvedSocialEncounters.push(result);
          if (
            (!this.solvedSocialEncounter.participants || this.solvedSocialEncounter.participants.length === 0) ||
            this.solvedSocialEncounter.currentlyInRange.some(
              participant => participant.username === this.service.user.value.username
            )
          ) {
            this.canSolve = false;
          }
          console.log(result);
        }
      })
    } 
  }

  activateHiddenEncounter() {
    if (this.selectedHiddenEncounter.id != null) {
      this.partLocation =
      {
        "username": this.service.user.value.username,
        "latitude": this.updatedExecution.Position.Latitude,
        "longitude": this.updatedExecution.Position.Longitude,
      }
      console.log('ucesnici izabranog:', this.selectedHiddenEncounter)
      this.encounterService.activateHiddenEncounter(this.selectedHiddenEncounter.id, this.partLocation).subscribe({
        next: (result: GoEncounter) => {
          this.activatedHiddenEncounter = result;
          console.log(this.activatedHiddenEncounter)
          console.log(this.activatedHiddenEncounter.Participants)
          console.log(this.service.user.value.username)
          if (this.activatedHiddenEncounter && this.activatedHiddenEncounter.Participants?.some(participant => participant.Username === this.service.user.value.username)) {
            //this.canSolveHiddenEncounter = true;
            //this.canActivateHiddenEncounter = false;
          }
        }
      })
    }
  }


  solveHiddenEncounter() {
    if (this.selectedHiddenEncounter.id != null) {
      this.partLocation =
      {
        "username": this.service.user.value.username,
        "latitude": this.updatedExecution.Position.Latitude,
        "longitude": this.updatedExecution.Position.Longitude,
      }
      this.encounterService.solveHiddenEncounter(this.selectedHiddenEncounter.id, this.partLocation).subscribe({
        next: (result: GoHiddenEncounter) => {
          this.activatedHiddenEncounter = result;
          if (this.activatedHiddenEncounter && this.activatedHiddenEncounter.Completers?.some(completer => completer.username === this.service.user.value.username)) {
            this.canSolveHiddenEncounter = false;
            this.canActivateHiddenEncounter = true;
          }
        }
      })
    }
  }

  activateMiscEncounter(){
    if(this.miscModal.name != ""){
      this.partLocation =
       {"username": this.service.user.value.username,
        "latitude": this.updatedExecution.Position.Latitude,
        "longitude": this.updatedExecution.Position.Longitude,
                  }
      this.encounterService.activateMiscEncounter(this.miscModal.id, this.partLocation).subscribe({
        next: (result: Encounter) => {
              this.activatedMisc = result;
              this.miscModal.participants = result.participants;
              this.activatedMiscEncounters.push(result);
              if(this.activatedMisc.participants?.some(participant => participant.username === this.service.user.value.username)){
                  this.canActivate = false;
                  this.canSolve = true;
              }
              console.log("aktivirani: ", result)
        }
      })
    } 
  }

  solveMiscEncounter(){
    if(this.miscModal.name != ""){
      this.partLocation =
       {"username": this.service.user.value.username,
        "latitude": this.updatedExecution.Position.Latitude,
        "longitude": this.updatedExecution.Position.Longitude,
                  }
      this.encounterService.solveMiscEncounter(this.miscModal.id, this.partLocation).subscribe({
        next: (result: MiscEncounter) => {
          this.solvedMisc = result;
          this.miscModal.participants = result.participants;
          this.solvedMiscEncounters.push(result);
          if (
            (!this.solvedMisc.participants || this.solvedMisc.participants.length === 0)
          ) {
            this.canSolve = false;
          }
          console.log(result);
        }
      })
    } 
  }

  private getHiddenEncounters() {
    this.encounterService.getHiddenEncounters().subscribe({
      next: (result: any[]) => {
        this.hiddenEncounters = result;
      },
      error: () => {
      }
    })
  }

  private getSocialEncounters() {
    this.encounterService.getAllSocialEncounters().subscribe({
      next: (result: any[]) => {
        this.socialEncounters = result;
      },
      error: () => {
      }
    })
  }

  private getMiscEncounters() {
    this.encounterService.getAllMiscEncounters().subscribe({
      next: (result: any[]) => {
        this.miscEncounters = result;
      },
      error: () => {
      }
    })
  }
}