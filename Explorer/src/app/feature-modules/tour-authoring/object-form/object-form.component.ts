import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Category, Object} from "../model/object.model";
import {TourAuthoringService} from "../tour-authoring.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { AdministrationService } from '../../administration/administration.service';
import { Obj } from '@popperjs/core';
import { PublicRegistrationRequest } from '../../administration/model/public-registration-request.model';

@Component({
  selector: 'xp-object-form',
  templateUrl: './object-form.component.html',
  styleUrls: ['./object-form.component.css']
})
export class ObjectFormComponent implements OnChanges {

  @Output() objectUpdated = new EventEmitter<null>;
  @Input() object: Object;
  @Input() shouldEdit: boolean = false;
  addedObject: Object | null = null;

  constructor(private service: TourAuthoringService, private administrationService: AdministrationService) {
  }

  objectsForm = new FormGroup({
    longitude: new FormControl(-1, [Validators.required]),
    latitude: new FormControl(-1, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    picture: new FormControl('', [Validators.required]),
    category: new FormControl(Category.other, [Validators.required]),
    checkBoxControl: new FormControl(false),
  })

  addObject() {
    console.log(this.objectsForm.value);
    const object: Object = {
      id: 0,
      longitude: Number(this.objectsForm.value.longitude),
      latitude: Number(this.objectsForm.value.latitude),
      name: this.objectsForm.value.name || '',
      description: this.objectsForm.value.description || '',
      picture: this.objectsForm.value.picture || '',
      category: this.objectsForm.value.category || Category.other
    }

    this.service.addObject(object).subscribe({
      next: (result : Object) => {
        this.objectUpdated.emit()
        this.addedObject = result;

        const checkBoxValue = this.objectsForm.value.checkBoxControl;
        if(checkBoxValue) {
          const registrationRequest: PublicRegistrationRequest = {
            objectId : this.addedObject?.id || 0,
            objectName: this.addedObject?.name || '',
            tourId: -1,
            pointName: '',
            comment: '',
            status: 'Pending'
        }

        this.administrationService.addPublicRegistrationRequest(registrationRequest).subscribe({
          next: () => {
          }
        })
        }
      }
    });

  }

  updateObject(): void {
    const object: Object = {
      id: this.object.id,
      longitude: Number(this.objectsForm.value.longitude),
      latitude: Number(this.objectsForm.value.latitude),
      name: this.objectsForm.value.name || '',
      description: this.objectsForm.value.description || '',
      picture: this.objectsForm.value.picture || '',
      category: this.objectsForm.value.category || Category.other
    }

    this.service.updateObject(object).subscribe({
      next: (_) => {
        this.objectUpdated.emit();
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.objectsForm.reset();
    if (this.shouldEdit) {
      this.objectsForm.patchValue(this.object);
    }
  }

  GetLatitude(latitude: number) {
    console.log(latitude);
    this.objectsForm.get('latitude')?.patchValue(latitude);
  }

  GetLongitude(longitude: number) {
    console.log(longitude);
    this.objectsForm.get('longitude')?.patchValue(longitude);

  }
}

