import { Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MarketplaceService } from '../marketplace.service';
import { Preference } from '../model/preference.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-preference-form',
  templateUrl: './preference-form.component.html',
  styleUrls: ['./preference-form.component.css']
})
export class PreferenceFormComponent implements OnInit, OnChanges {
  @Output() preferenceUpdated = new EventEmitter<null>();
  @Input() preference: Preference;
  @Input() shouldEdit: boolean;

  private user: User;
  preferenceForm = new FormGroup({
    difficulty: new FormControl(0, [Validators.required]),
    transport: new FormControl('', [Validators.required]),
    tags: new FormControl('', [Validators.required])
  })

  constructor(private service: MarketplaceService,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.preferenceForm.reset();
    if(this.shouldEdit){
      this.preferenceForm.patchValue(this.preference);
    }
  }

  addPreference() {
    const preference: Preference = {
      userId: this.user.id,
      difficulty: this.preferenceForm.value.difficulty || 0,
      transport: this.preferenceForm.value.transport || "",
      tags: this.preferenceForm.value.tags || ""
    }

    this.service.addPreference(preference).subscribe({
      next: (result) => {
        this.preferenceUpdated.emit();
      }
    })
  }

  editPreference() {
    const preference: Preference = {
      id: this.preference.id,
      userId: this.preference.userId,
      difficulty: this.preferenceForm.value.difficulty || 0,
      transport: this.preferenceForm.value.transport || "",
      tags: this.preferenceForm.value.tags || ""
    }

    console.log(preference);

    this.service.updatePreference(preference).subscribe({
      next: (result) => {
        this.preferenceUpdated.emit();
      }
    })
    this.preferenceForm.reset();
    this.ngOnInit()
  }
}
