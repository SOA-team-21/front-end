import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Club } from '../model/club.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.css']
})
export class ClubFormComponent {
  @Output() clubsUpdated = new EventEmitter<null>();
  @Input() club: Club;
  @Input() shouldEdit: boolean = false;

  user: User | undefined;

  constructor(private service: TourAuthoringService, private authService: AuthService){}

  ngOnChanges(): void {
    this.clubForm.reset();
    if(this.shouldEdit) {
      this.clubForm.patchValue(this.club);
    }
    this.authService.user$.subscribe(user => {
      this.user = user;
    })
  }

  clubForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    url: new FormControl('')
  })

  addClub() : void {
    console.log(this.clubForm.value)

    const club: Club = {
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      url: this.clubForm.value.url || "",
      ownerId: 1
    }

    this.service.addClub(club).subscribe();
    next:(_: any) => {
      this.clubsUpdated.emit()
    }
  }

  editClub() : void {
    const club: Club = {
      id: this.club.id,
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      url: this.clubForm.value.url || "",
      ownerId: this.club.ownerId
    }
    this.service.updateClub(club).subscribe();
    next:(_: any) => {
      this.clubsUpdated.emit()
    }
  }

}
