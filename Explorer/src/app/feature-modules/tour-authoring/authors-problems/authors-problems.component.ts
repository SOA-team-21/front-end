import { Component } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Problem } from '../../tour-authoring/model/problem.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-authors-problems',
  templateUrl: './authors-problems.component.html',
  styleUrls: ['./authors-problems.component.css']
})
export class AuthorsProblemsComponent {
  constructor(private service: TourAuthoringService, private authService: AuthService) { }

  problems: any[] = [];
  shouldRenderRespondForm = false;
  selectedProblem: any; 
  user: User;
  
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user; 
    })
    this.service.getAllProblems(this.user).subscribe({
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

  respondForm = new FormGroup({
    response: new FormControl('', [Validators.required])
  });

  onRespondClicked(problem: any): void {
    this.selectedProblem = problem;
    this.shouldRenderRespondForm = true;
  }

  onSubmitResponse(): void {
    const response = this.respondForm.get('response')?.value;

    if (response !== null && response !== undefined) {
      this.service.respondToProblem(this.selectedProblem.id, response)
        .subscribe(
          (result) => {
            // Handle the result as needed
            console.log('Response submitted successfully:', result);
          },
          (error) => {
            console.error('Error submitting response:', error);
            // Handle error as needed
          }
        );
    }
  }
}
