import { Component, OnInit } from '@angular/core';
import { EncounterService } from '../encounter.service';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HiddenEncounter } from '../model/hidden-encounter.model';
import { Location } from '../model/location.model';
import { Point } from '../../tour-authoring/model/points.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';


@Component({
  selector: 'hidden-encounter-form',
  templateUrl: './hidden-encounter-form.component.html',
  styleUrls: ['./hidden-encounter-form.component.css']
}) 
export class HiddenEncounterFormComponent implements OnInit {
  

  points: Point[] = [];

  encounterForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    experience: new FormControl(null, [Validators.required]),
    radius: new FormControl(null, [Validators.required]),
    longitude: new FormControl(null, [Validators.required]),
    latitude: new FormControl(null, [Validators.required]),
    imageUrl: new FormControl('', [Validators.required]),
    range: new FormControl('', [Validators.required]),
    chosenPoint: new FormControl(null, [Validators.required as ValidatorFn]),
  });


  constructor(private service: EncounterService, private tourService: TourAuthoringService) {}


  ngOnInit(): void {
    this.getPoints();
  }

  encounterImage: string;
  selectedPoint?: Point;
  pointLocation: Location;

  addEncounter(): void{
    const EncounterLocation : Location = {
      longitude: this.encounterForm.value.longitude || 0,
      latitude: this.encounterForm.value.latitude || 0,
      }

    const hiddenEncounter: HiddenEncounter = {
      id: 0,
      name: this.encounterForm.value.name || "",
      description: this.encounterForm.value.description || "",
      location: EncounterLocation || null,
      experience: this.encounterForm.value.experience || 0,
      status: 1,
      type: 2,
      radius: this.encounterForm.value.radius || 0,
      participants: [],
      completers: [],
      image: this.encounterImage,
      pointLocation: this.pointLocation || null,

      }

      this.service.addHiddenEncounter(hiddenEncounter).subscribe({
        next: () => {console.log("New hiddenEncounter created")}
    });
  };

    encodeImages(selectedFiles: FileList) {
      for(let i = 0; i < selectedFiles.length; i++){
        const file = selectedFiles[i];
        const reader = new FileReader();
  
        reader.onload = (event: any) => {
          this.encounterImage= event.target.result;
        }
  
        reader.readAsDataURL(file);
      }
    }
  
    onFileSelected(event: any) {
      const selectedFiles: FileList = event.target.files;
  
      if (selectedFiles.length > 0) {
        this.encodeImages(selectedFiles);
      }
    }


  setSelectedPoint(point: Point) {
    this.selectedPoint = point;
    this.pointLocation = {
      latitude: point.latitude,
      longitude: point.longitude
    };
  }

  getPoints(): void {
    this.tourService.getAllPublicPointsForTours().subscribe({
      next: (result: Point[]) => {
        this.points = result;
      },
      error: () => {
      }
    })
  }
} 
