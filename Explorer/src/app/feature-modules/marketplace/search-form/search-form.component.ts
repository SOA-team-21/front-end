import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { MarketplaceService } from '../marketplace.service';

@Component({
  selector: 'xp-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
  @Output() searchClicked = new EventEmitter<null>();
  
  searchForm = new FormGroup({
    longitude: new FormControl('', [Validators.required]),
    latitude: new FormControl('', [Validators.required]),
    distance: new FormControl(0, [Validators.required])
  })
  public isCollapsed = false;

  constructor(private router: Router, private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    const isReloaded = sessionStorage.getItem('isReloaded');
    if (!isReloaded) {
      sessionStorage.setItem('isReloaded', 'true');
      window.location.reload();
    } else {
    sessionStorage.removeItem('isReloaded');
    }
    
    let map = document.getElementById("map");
    if (map != null) {
      map.style.height = "25rem";
      map.style.width = "86rem";
    }

    this.router.events.subscribe((event) => { //TREBALO BI DA RADI OVAKO, ISTESTIRAO SAM
      if (event instanceof NavigationEnd) {
        const currentUrl = this.router.createUrlTree(this.route.snapshot.url).toString();
        if (currentUrl === '/search-results') {
          this.searchClicked.emit();
        }
      }
    });
  }

  setLongitude(long: number) {
    this.searchForm.get('longitude')?.setValue(long.toString());
  }

  setLatitude(lat: number) {
    this.searchForm.get('latitude')?.setValue(lat.toString());
  }
  
  setDistance(event: Event){
    const distance = +(event.target as HTMLInputElement).value;
    this.searchForm.get('distance')?.setValue(distance)
  }

  searchClick() {
    if(this.searchForm.valid){
      let longitudeValue = this.searchForm.value.longitude;
      let latitudeValue = this.searchForm.value.latitude;
      let distanceValue = this.searchForm.value.distance;
      this.router.navigate(['/search-results'], { queryParams: { longitude: longitudeValue, latitude: latitudeValue, distance: distanceValue}})    }
  }
}
