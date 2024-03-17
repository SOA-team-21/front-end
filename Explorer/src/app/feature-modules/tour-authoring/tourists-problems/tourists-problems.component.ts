import { Component } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tourists-problems',
  templateUrl: './tourists-problems.component.html',
  styleUrls: ['./tourists-problems.component.css']
})
export class TouristsProblemsComponent {
  constructor(private service: TourAuthoringService, private authService: AuthService) { }
  problems: any[] = [];
  shouldRenderUnsolvedForm = false;
  selectedProblem: any;
  user: User;
  
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user; 
    })
    this.service.getAllTouristsProblems(this.user).subscribe({
      next: (result: any) => {  
          this.problems = result;
          console.log('Data loaded successfully:', this.problems);
      },
      error: (error) => {
        console.error('API error:', error);
        // Handle error as needed
      }
    });
  }

  notSolvedForm = new FormGroup({
    comment: new FormControl('', [Validators.required])
  });

  onUnsolvedClicked(problem: any): void {
    this.selectedProblem = problem;
    this.shouldRenderUnsolvedForm = true;
  }

  onIsNotSolved(): void {
    const response = this.notSolvedForm.get('comment')?.value;

    if (response !== null && response !== undefined) {
      this.service.problemNotSolved(this.selectedProblem.id, response)
        .subscribe(
          (result) => {
            // Update the data after a successful response
            this.updateData();
            console.log('Response submitted successfully:', result);
          },
          (error) => {
            console.error('Error submitting response:', error);
            // Handle error as needed
          }
        );
    }
  }

  onSolvedClicked(problem: any): void {
    this.selectedProblem = problem;
    this.service.solveProblem(this.selectedProblem.id)
        .subscribe(
          (result) => {
            // Update the data after a successful response
            this.updateData();
            console.log('Response submitted successfully:', result);
          },
          (error) => {
            console.error('Error submitting response:', error);
            // Handle error as needed
          }
        );
  }
  private updateData(): void {
    // Fetch the updated data from the service or update the existing data
    this.service.getAllTouristsProblems(this.user).subscribe({
      next: (result: any) => {
        this.problems = result;
        console.log('Data updated successfully:', this.problems);
      },
      error: (error) => {
        console.error('API error:', error);
        // Handle error as needed
      }
    });
  }
}