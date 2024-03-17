import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'xp-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [FormsModule],
})
export class SearchComponent {
  startDate: string;
  endDate: string;   

  startDatePlaceholder = 'Start Date';
  endDatePlaceholder = 'End Date';
}
