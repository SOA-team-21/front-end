import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Point } from '../model/points.model';
import { MapRoutingService } from './map-routing.service';
import { RequiredTime, TransportType } from '../model/requiredTime.model';
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
  @Input({required: true}) tour: Tour;
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
  pointForAdd: Point = {
    longitude: 0,
    latitude: 0,
    public: false,
    name: '',
    description: '',
    picture: ''
  };
  user: User;
  requiredTime: RequiredTime = {
    minutes: 0,
    transportType: TransportType.Car
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
    this.tourLength = this.tour.length;
    this.requiredTime = this.tour.requiredTimes[0];
    this.tourTags = "";
    this.tour.tags.forEach(t =>  {
      this.tourTags += "#" + t.Name  + " "
    });
  }

  private initializeMap() {
    let initialView = [0, 0];
    if(this.tour.points.length > 1){
      initialView[0] = this.tour.points[0].latitude;
      initialView[1] = this.tour.points[0].longitude;
    }
    this.map = L.map('mapDiv').setView([initialView[0], initialView[1]], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
    this.map.on('click', (event: any) => {
        this.setCurrentMarker(event);
    });
    this.initializeKeyPoints(this.tour.points);
  }

  private initializeKeyPoints(points: Point[]){
    if(points.length < 1) return;
    points.forEach(point => {
        this.markers.push(L.marker([point.latitude, point.longitude], {icon: this.pointIcon}).addTo(this.map));
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
      alert('Error! Not enough key points entered to display route.'); return;
    }
    this.mapService.calculateRoute(this.markers).subscribe({
      next: (routeInfo) => {
        this.tourLength = routeInfo.routeLength;
        this.requiredTime.minutes =  Math.round(routeInfo.routeDuration / 60); //Initial value is in seconds, conversion to minutes required
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
    this.changeRouteColor(this.requiredTime.transportType);
    this.mapService.changeTransportationType(this.requiredTime.transportType);
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
    this.tour.tags.push({
      Name: tag
    });
    this.tourTags = "";
    this.tour.tags.forEach( t => {
      this.tourTags += "#" +  t.Name + " "
    });
  }

  removePoint(point: Point){
    let index = this.tour.points.indexOf(point);
    this.tour.points.splice(index, 1);
    
    let layerToRemove = this.markers.splice(index, 1); //Need to delete marker too, return value is array
    if (layerToRemove != undefined) {
      this.map.removeLayer(layerToRemove[0]);
    }
    this.calculateRoute(); //Again, calculate route
  }

  addCheckpoint(){
    this.pointForAdd.latitude = this.currentMarker.getLatLng().lat;
    this.pointForAdd.longitude = this.currentMarker.getLatLng().lng;
    if(this.tour.points[-1] == this.pointForAdd){
      alert('Same last key point, please change!');return;
    }
    this.tour.points.push(this.pointForAdd);
    this.markers.push(L.marker([this.currentMarker.getLatLng().lat, this.currentMarker.getLatLng().lng], {icon: this.pointIcon}).addTo(this.map));

    console.log('Marker added: ', this.currentMarker.getLatLng());
    this.calculateRoute();
    this.pointForAdd =  
    { longitude: 0,
      latitude: 0,
      public: false,
      name: '',
      description: '',
      picture: ''
    }
  }

  private validateTourInput(): boolean{
    if(this.tour.name === "" || this.tour.description === "") return false;
    if(this.tour.difficult < 1) return false;
    if(this.tour.length <= 0) return false;
    if(this.tour.price < 0) return false;
    if(this.tour.requiredTimes == undefined) return false;
    return true;
  }

  save() {
    if(!this.shouldEdit){
      this.tour.authorId = this.user.id
      this.tour.requiredTimes.push(this.requiredTime);
      this.tour.length = this.tourLength;
      this.tour.publishTime = new Date().toISOString();
      this.tour.arhiveTime =new Date().toISOString();
      this.tour.status = 1;
      this.tour.myOwn = false;
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
      if(this.tour.points.length < 2){
        alert('Error! Must enter at least 2 key points!'); return;
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