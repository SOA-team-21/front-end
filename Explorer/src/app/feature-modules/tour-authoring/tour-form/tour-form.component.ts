import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { GoTour} from '../model/tour.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { GoPoint } from '../model/points.model';
import { MapRoutingService } from './map-routing.service';
import { GoRequiredTime, TransportType } from '../model/requiredTime.model';
import * as L from 'leaflet';

@Component({
  selector: 'xp-tour-form',
  templateUrl: './tour-form.component.html',
  styleUrls: ['./tour-form.component.css']
})
export class TourFormComponent implements OnInit {

  readonly REDCOLOR = "#FF0000"; //Bycicle
  readonly BLUECOLOR = "#0000FF" //Car
  readonly GREENCOLOR = "#00FF00"; //Walking

  @Output() tourUpdated = new EventEmitter<null>();
  @Input({required: true}) tour: GoTour;
  @Input() shouldEdit: boolean = false;
  
  private readonly pointIcon = L.icon({
      iconUrl: 'assets/icons/flag.png',
      iconSize: [24, 24],
      iconAnchor: [16, 16],
  });
  private readonly currentPointIcon = L.icon({
    iconUrl: 'assets/icons/currentFlag.png',
    iconSize: [24, 24],
    iconAnchor: [16, 16],
 });
  private map: any;
  private markers: L.Marker[] = [];
  private currentMarker: L.Marker;
  private routeLayer: L.Layer;
  routeColor: string = this.BLUECOLOR; //Default value is car, so color is blue

  tourTags: string = "";
  selectedTag: string = "";
  pointForAdd: GoPoint = {
    id: 0,
    tourId: 0,
    Longitude: 0,
    Latitude: 0,
    Public: false,
    Name: '',
    Description: '',
    Picture: ''
  };
  user: User;
  requiredTime: GoRequiredTime = {
    id: 0,
    tourId: 0,
    Minutes: 0,
    TransportType: TransportType.Car
  };
  tourLength: number = 0;

  constructor(private service: TourAuthoringService,
    private authService: AuthService,
    private mapService: MapRoutingService) {
  }

  ngOnInit(): void {
    if(this.shouldEdit){
      this.initializeTourFields();
    }
    this.initializeMap();
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  private initializeTourFields(){
    this.tourLength = this.tour.Length;
    if(this.tour.RequiredTimes != null && this.tour.RequiredTimes.length > 0){
      this.requiredTime = this.tour.RequiredTimes[0];
    }
    else {
      this.requiredTime = {
        id: 0,
        tourId: this.tour.id,
        Minutes: 0,
        TransportType: TransportType.Car
      }
    }
    
    this.tourTags = "";
    this.tour.Tags.forEach(t =>  {
      this.tourTags += "#" + t  + " "
    });
  }

  private initializeMap() {
    let initialView = [0, 0];
    if(this.tour.KeyPoints != null && this.tour.KeyPoints.length > 1){
      initialView[0] = this.tour.KeyPoints[0].Latitude;
      initialView[1] = this.tour.KeyPoints[0].Longitude;
    }
    this.map = L.map('mapDiv').setView([initialView[0], initialView[1]], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
    this.map.on('click', (event: any) => {
        this.setCurrentMarker(event);
    });
    this.initializeKeyPoints(this.tour.KeyPoints);
  }

  private initializeKeyPoints(keypoints: GoPoint[]){
    if(keypoints == null || keypoints.length < 1) return;
    keypoints.forEach(point => {
        this.markers.push(L.marker([point.Latitude, point.Longitude], {icon: this.pointIcon}).addTo(this.map));
    })
  }

  private setCurrentMarker(event: any) {
    if (this.currentMarker != undefined) {
      this.map.removeLayer(this.currentMarker);
    }
    this.currentMarker = L.marker([event.latlng.lat, event.latlng.lng], {icon: this.currentPointIcon}).addTo(this.map);
  }

  private calculateRoute(): void{
    if (this.markers.length < 2) {
      alert('Error! Not enough key keypoints entered to display route.'); return;
    }
    this.mapService.calculateRoute(this.markers).subscribe({
      next: (routeInfo) => {
        this.tourLength = routeInfo.routeLength;
        this.requiredTime.Minutes =  Math.round(routeInfo.routeDuration / 60); //Initial value is in seconds, conversion to minutes required
        this.tour.RequiredTimes[0].Minutes = this.requiredTime.Minutes;
        this.tour.RequiredTimes[0].TransportType = this.requiredTime.TransportType;
        this.displayRoute(routeInfo.route);
      },
      error: (error) => {
        console.error('Error calculating route:', error);
      }
    });
  }

  private displayRoute(routeData: any): void{
    if(this.routeLayer != undefined){
      this.routeLayer.removeFrom(this.map);
    }
    this.routeLayer = L.polyline(routeData, {color: this.routeColor}).addTo(this.map);
  }

  changeTransportType() {
    this.changeRouteColor(this.requiredTime.TransportType);
    this.mapService.changeTransportationType(this.requiredTime.TransportType);
    this.calculateRoute();
  }
  
  private changeRouteColor(transportType: TransportType) {
    switch(transportType.toString()){
      case "TransportType.Bicycle": this.routeColor = this.REDCOLOR; break;
      case "TransportType.Car": this.routeColor = this.BLUECOLOR; break;
      case "TransportType.Walking": this.routeColor = this.GREENCOLOR; break;
      default: console.log('Unexpected Transport Type:', transportType); 
    }
  }  

  addTag(tag: string) {
    this.tour.Tags.push(tag);
    this.tourTags = "";
    this.tour.Tags.forEach( t => {
      this.tourTags += "#" +  t + " "
    });
  }

  removePoint(point: GoPoint){
    let index = this.tour.KeyPoints.indexOf(point);
    this.tour.KeyPoints.splice(index, 1);
    
    let layerToRemove = this.markers.splice(index, 1); //Need to delete marker too, return value is array
    if (layerToRemove != undefined) {
      this.map.removeLayer(layerToRemove[0]);
    }
    this.calculateRoute(); //Again, calculate route
  }

  addCheckpoint(){
    this.pointForAdd.Latitude = this.currentMarker.getLatLng().lat;
    this.pointForAdd.Longitude = this.currentMarker.getLatLng().lng;
    this.pointForAdd.tourId = this.tour.id;
    if(this.tour.KeyPoints == null){
      this.tour.KeyPoints = []
    }
    if(this.tour.KeyPoints[-1] == this.pointForAdd){
      alert('Same last key point, please change!');return;
    }
    this.tour.KeyPoints.push(this.pointForAdd);
    this.markers.push(L.marker([this.currentMarker.getLatLng().lat, this.currentMarker.getLatLng().lng], {icon: this.pointIcon}).addTo(this.map));

    console.log('Marker added: ', this.currentMarker.getLatLng());
    this.calculateRoute();
    this.pointForAdd ={ 
      id: 0,
      tourId: 0,
      Longitude: 0,
      Latitude: 0,
      Public: false,
      Name: '',
      Description: '',
      Picture: ''
    }
  }

  private validateTourInput(): boolean{
    if(this.tour.Name === "" || this.tour.Description === "") return false;
    if(this.tour.Difficult < 1) return false;
    if(this.tour.Price < 0) return false;
    if(this.tour.RequiredTimes == undefined) return false;
    return true;
  }

  save() {
    if(!this.shouldEdit){
      this.tour.authorId = this.user.id
      this.tour.Length = 0;
      this.tour.PublishTime = null;
      this.tour.ArchiveTime = null;
      this.tour.Status = 0;
      this.tour.MyOwn = false;
      if(!this.validateTourInput()){
        alert('Error! All fields must be entered!'); return;
      }
      console.log("Tour to create: ", this.tour);
      this.service.addTour(this.tour).subscribe({
        next: (response) => {
          if(response != undefined){
            alert("Tour added!");
            this.tourUpdated.emit();
          }
        },
        error: (err) => {
          alert("Error! " + err);
        }
      })
    }
    else{
      if(!this.validateTourInput()){
        alert('Error! All fields must be entered!'); return;
      }
      if(this.tour.KeyPoints.length < 2){
        alert('Error! Must enter at least 2 key keypoints!'); return;
      }
      console.log("Tour to update: ", this.tour);
      this.service.updateTour(this.tour).subscribe({
        next: (response) => {
          if(response != undefined){
            alert("Tour updated!");
            this.tourUpdated.emit();
          }
        },
        error: (err) => {
          alert("Error! " + err);
        }});
      }
  }
}