import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Person } from '../model/userprofile.model';
import { AdministrationService } from '../administration.service';


@Component({
  selector: 'xp-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent implements OnChanges {

  @Input() profile: Person;
  @Output() profileUpdated = new EventEmitter<null>();
  
  constructor(private service: AdministrationService) {
  }
  ngOnChanges(): void {
    //this.profileForm.patchValue(this.profile);
  }

  profileForm = new FormGroup({
      picture: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      bio: new FormControl('', [Validators.required]),
      quote: new FormControl('', [Validators.required])
  });

  saveProfile(): void{
    const person: Person = {
      id: this.profile.id || -1,
      userId: this.profile.userId || -1,
      Picture: this.profile.Picture,
      Name: this.profileForm.value.name || "",
      Surname: this.profileForm.value.surname || "",
      Bio: this.profileForm.value.bio || "",
      Quote: this.profileForm.value.quote || "",
      Xp: this.profile.Xp,
      Level: this.profile.Level
    };
    person.id = this.profile.id;
    this.service.updateUser(person).subscribe({
      next: (_) => { this.profileUpdated.emit();}
    });
  }
  
  encodeImages(selectedFiles: FileList) {
    for(let i = 0; i < selectedFiles.length; i++){
      const file = selectedFiles[i];
      const reader = new FileReader();

      reader.onload = (event: any) => {
        this.profile.Picture = event.target.result;
      }

      reader.readAsDataURL(file);
    }
  }


  onSelectedFile(event: any) {
    const selectedFiles: FileList = event.target.files;

    if (selectedFiles.length > 0) {
      this.encodeImages(selectedFiles);
    }
  }

  removeImage():void{
    this.profile.Picture = " ";
  }
}
