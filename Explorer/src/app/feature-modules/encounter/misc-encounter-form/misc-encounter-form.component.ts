import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EncounterService } from '../encounter.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Router } from '@angular/router';
import { Location } from '../model/location.model';
import { MiscEncounter } from '../model/misc-encounter.model';
import { MapService } from 'src/app/shared/map/map.service';

@Component({
  selector: 'xp-misc-encounter-form',
  templateUrl: './misc-encounter-form.component.html',
  styleUrls: ['./misc-encounter-form.component.css']
})
export class MiscEncounterFormComponent {

  buttonVisibility: boolean = false
  encounterLocation : Location = {
    longitude: 0,
    latitude: 0
  }

  miscEncounterForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    experience: new FormControl(null, [Validators.required]),
    radius: new FormControl(null, [Validators.required]),
    address: new FormControl('', [Validators.required]),
  });
  


  constructor(private service: EncounterService, private mapService: MapService, private authService: AuthService, private router: Router){}

  searchAddress(){
    if(this.miscEncounterForm.value.address === "")
    {
      this.buttonVisibility = false
    
    }
    else{
      this.mapService.search(this.miscEncounterForm.value.address!).subscribe({
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
    
    const miscEncounter: MiscEncounter = {
      id: 0,
      name: this.miscEncounterForm.value.name || "",
      description: this.miscEncounterForm.value.description || "",
      location: this.encounterLocation || undefined,
      experience: this.miscEncounterForm.value.experience || 0,
      status: 1,
      type: 3,
      radius: this.miscEncounterForm.value.radius || 0,
      participants: [],
      completers: [],
    }

    
    if(this.miscEncounterForm.valid)
    {
      this.service.createMiscEncounter(miscEncounter).subscribe({
        next: () => {console.log("New miscEncounter created")}
    });
    this.router.navigate(['home']);
    alert("Misc encounter created successfully")
    }

  }

}
