import {Component, OnInit} from '@angular/core';
import {Object} from "../model/object.model";
import {TourAuthoringService} from "../tour-authoring.service";
import {PagedResults} from "../../../shared/model/paged-results.model";

@Component({
  selector: 'xp-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent implements OnInit{

  objects: Object[] = [];
  selectedObject: Object;
  shouldEdit: boolean;
  shouldRenderObjectForm: boolean = false;
  constructor(private service: TourAuthoringService) {
  }

  ngOnInit(): void {
    this.getObjects()
  }

  getObjects(): void {
    this.service.getObjects().subscribe({
      next: (result: PagedResults<Object>) => {
        this.objects = result.results;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  onEditClicked(object: Object): void{
    this.shouldEdit = true;
    this.selectedObject = object;
  }

  onAddClicked(): void{
    this.shouldRenderObjectForm = true;
    this.shouldEdit = false;
  }

  deleteObject(id: number | undefined): void{
    this.service.deleteObjects(id).subscribe({
      next: (_)=> {
        this.getObjects();
      }
    })
  }
}
