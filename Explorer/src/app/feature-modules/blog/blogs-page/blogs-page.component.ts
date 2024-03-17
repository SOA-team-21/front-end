import { Component, OnInit, Output } from '@angular/core';
import { BlogService } from '../blog.service';
import { Blog } from '../model/blog.model';
import { BlogStatus } from '../blog.status';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { AdministrationService } from '../../administration/administration.service';
import { forkJoin } from 'rxjs';
import { User } from 'src/app/infrastructure/auth/model/user.model';



@Component({
  selector: 'xp-blogs-page',
  templateUrl: './blogs-page.component.html',
  styleUrls: ['./blogs-page.component.css']
})
export class BlogsPageComponent implements OnInit {

  blogs: Blog[] = [];
  selectedBlog: Blog;
  loggedInUserId: number = 0;
  followers: User[] = [];
  constructor(private service: BlogService, private authService: AuthService, private administrationService: AdministrationService){}
  
  ngOnInit(): void {
    console.log(this.blogs)
    this.authService.user$.subscribe(user => {
      this.loggedInUserId = user.id; 
      console.log(this.loggedInUserId)
    });
    this.getWantedBlogs();
  }
  getWantedBlogs(): void {
    this.service.getBlogs().subscribe({
      next: (result: PagedResults<Blog>) => {
        this.blogs = result.results; 
        console.log(this.blogs); 
        this.blogs.forEach(blog => {
                if(!this.loggedInUserId){
                  if (blog.title.includes('My tour')) {
                    this.blogs = this.blogs.filter(b => b !== blog);
                  }
                }else if (blog.userId !== this.loggedInUserId && blog.title.includes('My tour')) {
                this.administrationService.getUserFollowers(blog.userId).subscribe((result: any) => {
                  this.followers = result;
                  if(this.followers === null){
                    this.blogs = this.blogs.filter(b => b !== blog);
                  }
                  const isFollower = this.followers.some((follower: any) => follower.userId === this.loggedInUserId);
        
                  if (!isFollower) {
                    this.blogs = this.blogs.filter(b => b !== blog);
                  }
                });
              }
            });
      },
      error: () => {
        console.log('Error! Could not get Blogs!');
      }
    });
  }

  getBlogs(): void{
    this.service.getBlogs().subscribe({
      next: (result: PagedResults<Blog>) => {
        this.blogs = result.results;
      },
      error: () => {
        console.log('Error! Could not get Blogs!');
      }
    })
  }

  filterBlogs(filter: BlogStatus): void{
      this.service.getFilteredBlogs(filter).subscribe({
        next: (result: Blog[]) => {
          this.blogs = result;
        },
        error: () => {
          console.log("Error! Could not filter blogs!");
        }
      })
  }
}
