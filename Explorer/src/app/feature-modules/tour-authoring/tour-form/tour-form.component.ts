import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { MapComponent } from 'src/app/shared/map/map.component';
import { Point } from '../model/points.model';
import { TransportType } from '../model/requiredTime.model';

@Component({
  selector: 'xp-tour-form',
  templateUrl: './tour-form.component.html',
  styleUrls: ['./tour-form.component.css']
})
export class TourFormComponent implements OnChanges, OnInit {

  @ViewChild('xp-map') map: MapComponent;
  @Output() tourUpdated = new EventEmitter<null>();
  @Input() tour: Tour;
  @Input() shouldEdit: boolean = false;
  pointForAdd: Point = {
    longitude: 0,
    latitude: 0,
    public: false,
    name: '',
    description: '',
    picture: ''
  };
  user: User;
  longitude: number = 0;
  latitude: number = 0;

  constructor(private service: TourAuthoringService,
    private authService: AuthService,
    private token: TokenStorage) {
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnChanges(): void {
  }


  setLongitude(long: number) {
    this.longitude = long;
  }

  setLatitude(lat: number) {
    this.latitude = lat;
  }

  resetSelectedPoint(): void {
    this.map.points = [];
    this.longitude = 0;
    this.latitude = 0;
  }

  removePoint(point: Point){
    let index = this.tour.points.indexOf(point);
    this.tour.points.slice(index, 1);
  }

  save() {
    this.tour.id=4;
    this.tour.length = 50
    this.tour.publishTime = new Date().toISOString();
    this.tour.arhiveTime =new Date().toISOString();
    this.tour.status = 1;
    this.tour.myOwn = false;
    this.service.addTour(this.tour).subscribe({
      next: () => { }
    });
  }

  addCheckpoint(){
    this.tour.points.push(this.pointForAdd);
    console.log(this.pointForAdd);
    this.pointForAdd =     {longitude: 0,
    latitude: 0,
    public: false,
    name: '',
    description: '',
    picture: ''
    }
  }
}
