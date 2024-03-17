import { Component, OnInit } from '@angular/core';
import { Equipment } from '../model/equipment.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TouristEquipment } from '../model/tourist-equipment.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'xp-equipment-record',
  templateUrl: './equipment-record.component.html',
  styleUrls: ['./equipment-record.component.css']
})
export class EquipmentRecordComponent implements OnInit {

  user: User | undefined;
  equipments: Equipment[] = [];
  selectedEquipment: Equipment;

  constructor(private authService: AuthService,private service: AdministrationService) {}

  ngOnInit(): void {
    this.getEquipment();
    this.authService.user$.subscribe(user => {
      this.user = user;
    })
  }

  getEquipment(): void {
    this.service.getEquipment().subscribe({
      next: (result: PagedResults<Equipment>) => {
        this.equipments = result.results;
      },
      error: () => {
      }
    })
  }

  addEquipmentRecord(equipment: Equipment): void{
    this.selectedEquipment = equipment;
    
    const touristEquipment: TouristEquipment = {
      touristId: this.user?.id || -1,
      equipmentId: this.selectedEquipment.id || -1,
    }
    this.service.addTouristEquipment(touristEquipment).subscribe({
      next: () => {
       }
    });
    console.log(touristEquipment);
  }

  removeEquipmentRecord(equipment: Equipment): void {
    const touristId = this.user?.id || -1;
    const equipmentId = equipment.id || -1;

    this.getTouristEquipmentByIds(touristId, equipmentId).subscribe((touristEquipment) => {
      if (touristEquipment) {
        const touristEquipmentId = touristEquipment.id || -1;
        this.service.removeTouristEquipment(touristEquipmentId).subscribe({
          next: () => {
          }
        });
      }
    });
  }

  getTouristEquipmentByIds(touristId: number, equipmentId: number): Observable<TouristEquipment | null> {
    return this.service.getTouristEquipment().pipe(
      map((pagedResults) => {
        const touristEquipment = pagedResults.results.find(
          (item) =>
            item.touristId === touristId && item.equipmentId === equipmentId
        );
        return touristEquipment || null;
      })
    );
  }
}
