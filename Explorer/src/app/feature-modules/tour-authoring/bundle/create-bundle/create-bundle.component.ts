import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Tour } from '../../model/tour.model';
import { TourAuthoringService } from '../../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Bundle, BundleStatus } from '../../model/bundle.model';

@Component({
  selector: 'xp-create-bundle',
  templateUrl: './create-bundle.component.html',
  styleUrls: ['./create-bundle.component.css']
})
export class CreateBundleComponent implements OnInit {
  
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

  public tours: Tour[]
  public toursForBundle: Tour[] = [];
  public bundle: Bundle = {
    id: 0,
    name: '',
    status: BundleStatus.draft,
    price: 0,
    tours: []
  }
  public price: number = 0;

  constructor(private service: TourAuthoringService){}

  ngOnInit(): void {
    this.service.getTours().subscribe({
      next: (result: PagedResults<Tour>) => {
        this.tours = result.results;
      },
      error: () => {
      }
    })
  }

  addTour(tour: Tour){
    this.toursForBundle.push(tour);
    this.calculatePrice();
    let index = this.tours.indexOf(tour);
    this.tours.splice(index, 1);
  }

  calculatePrice(){
    this.price = 0;
    this.toursForBundle.forEach(
      tour => this.price += tour.price
    );
  }

  removeTour(tourToRemove: Tour){
    let index = this.toursForBundle.indexOf(tourToRemove);
    this.toursForBundle.splice(index, 1);
    this.calculatePrice();
    this.tours.push(tourToRemove);
  }

  create(){
    this.bundle.tours = this.toursForBundle;
    this.service.createBundle(this.bundle).subscribe({
    });
    this.closeModal.emit();
  }
}
