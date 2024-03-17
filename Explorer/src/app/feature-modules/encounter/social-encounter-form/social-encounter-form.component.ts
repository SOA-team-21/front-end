import { Component, OnInit } from '@angular/core';
import { Location } from '../model/location.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SocialEncounter } from '../model/socialEncounter.model';
import { EncounterService } from '../encounter.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Router } from '@angular/router';
import { MapService } from 'src/app/shared/map/map.service';

@Component({
  selector: 'xp-social-encounter-form',
  templateUrl: './social-encounter-form.component.html',
  styleUrls: ['./social-encounter-form.component.css']
})
export class SocialEncounterFormComponent{

  buttonVisibility: boolean = false

  encounterLocation : Location = {
    longitude: 0,
    latitude: 0
  }

  socialEncounterForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    experience: new FormControl(null, [Validators.required]),
    radius: new FormControl(null, [Validators.required]),
    address: new FormControl('', [Validators.required]),
    participantsNumber: new FormControl(null, [Validators.required]),
  });
  


  constructor(private service: EncounterService, private mapService: MapService, private authService: AuthService, private router: Router){}

  searchAddress(){
    if(this.socialEncounterForm.value.address === "")
    {
      this.buttonVisibility = false
    
    }
    else{
      this.mapService.search(this.socialEncounterForm.value.address!).subscribe({
        next: (result: any) => {
  
            this.encounterLocation.latitude = result[0].lat
            this.encounterLocation.longitude = result[0].lon
  
            if(this.encounterLocation.latitude != 0 && this.encounterLocation.longitude != 0)
              this.buttonVisibility = true
            else
              this.buttonVisibility = false
  
            console.log("Long:",result[0].lon)
            console.log("Lat", result[0].lat)
        },
        error: () => { },
      });
    }
  
  }

  createEncounter(): void{

    const socialEncounter: SocialEncounter = {
      id: 0,
      name: this.socialEncounterForm.value.name || "",
      description: this.socialEncounterForm.value.description || "",
      location: this.encounterLocation || undefined,
      experience: this.socialEncounterForm.value.experience || 0,
      status: 1,
      type: 1,
      radius: this.socialEncounterForm.value.radius || 0,
      participants: [],
      completers: [],
      requiredParticipants: this.socialEncounterForm.value.participantsNumber || 0,
      currentlyInRange: []
    }

    
    if(this.socialEncounterForm.valid)
    {
      this.service.createSocialEncounter(socialEncounter).subscribe({
        next: () => {console.log("New socialEncounter created")}
    });
    this.router.navigate(['home']);
    alert("Social encounter created successfully")
    }

  }
  

}
