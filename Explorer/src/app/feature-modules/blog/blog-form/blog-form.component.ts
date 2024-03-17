import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Blog } from '../model/blog.model';
import { BlogService } from '../blog.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Tour } from '../../tour-authoring/model/tour.model';


@Component({
  selector: 'xp-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent implements OnInit {

  @Input() tour: Tour;

  blogForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    additionalDescription: new FormControl('')
  });
  imageUrls: string[] = [];
  imageUrl: string = "";
  user: User;

  blogCreated = false; 

  constructor(private authService: AuthService, private service: BlogService) {}

  onDataReceived(emittedTour: any) {
    this.tour = emittedTour;
  }
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    })

    if (this.tour) {
      const pointsDescriptions = this.tour.points.map(point => `${point.name}: ${point.description}`).join('\n');
      const descriptionWithPoints = `Required Time: 60m, Length: ${this.tour.length} km\n\nPoints:\n${pointsDescriptions}`;

      this.blogForm.patchValue({
        title: `My tour: ` + this.tour.name,
        description: descriptionWithPoints
      });
    }

  }

  addImage(): void{
    if (this.imageUrl == undefined) return;
    this.imageUrls.push(this.imageUrl);
    console.log('Image added: ' + this.imageUrl);
    this.imageUrl = "";
  }
  
  addBlog(): void{
    if(this.blogForm.invalid){
      return;
    }
    let finalDescription = this.blogForm.value.description || "";

    if (this.blogForm.value.additionalDescription) {
      finalDescription += `\n\n${this.blogForm.value.additionalDescription}`;
    }
    const blog: Blog = {
      title: this.blogForm.value.title || "",
      description: finalDescription,
      images: this.imageUrls,
      creationDate: new Date(),
      userId: this.user.id,
      netVotes: 0,
      status: 1
    };
    console.log("Blog to add: ", blog);
    blog.creationDate.toISOString();

    this.service.addBlog(blog).subscribe({
        next: () => {
          console.log("New blog created")
          
          this.blogCreated = true;

          this.blogForm.reset();
          this.imageUrls = [];
          this.imageUrl = '';
      
      }
    });
  }
}