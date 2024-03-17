import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Blog, BlogRating, BlogReport } from './model/blog.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { BlogComment } from './model/blog.model';
import { environment } from 'src/env/environment';
import { BlogStatus } from './blog.status';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  addBlog(blog: Blog): Observable<Blog>{
    return this.http.post<Blog>(environment.apiHost + `blog`, blog);
  }

  publishBlog(blogId: number): Observable<Blog>{
    return this.http.patch<Blog>(environment.apiHost + `blog/publish/` + blogId, {});
  }

  getBlog(blogId: number): Observable<Blog>{
    return this.http.get<Blog>(environment.apiHost + `blog/get/` + blogId);
  }

    getBlogs(): Observable<PagedResults<Blog>>{
    return this.http.get<PagedResults<Blog>>(environment.apiHost + `blog/getAll`);
  }

  getFilteredBlogs(filter: BlogStatus): Observable<Blog[]>{
    return this.http.get<Blog[]>(environment.apiHost + `blog/getFiltered?filter=` + filter);
  }

  getComments(): Observable<PagedResults<BlogComment>>{
    return this.http.get<PagedResults<BlogComment>>(environment.apiHost + `tourist/blogComment/getAll`);
  }

  rateBlog(blogId: number, blogRating: BlogRating): Observable<Blog>{
    return this.http.post<Blog>(environment.apiHost + `blog/rate/` + blogId, blogRating);
  }

  updateBlogComment(blogId : number, blogComment : BlogComment) : Observable<Blog> {
    return this.http.put<Blog>(environment.apiHost + `blog/updateBlogComment/` + blogId, blogComment);
  }

  leaveBlogComment(blogId : number, blogComment : BlogComment) : Observable<Blog> {
    return this.http.post<Blog>(environment.apiHost + `blog/commentBlog/` + blogId, blogComment);
  }
  deleteBlogComment(blogId : number, _blogComment : BlogComment) : Observable<Blog> {
    return this.http.put<Blog>(environment.apiHost + `blog/deleteBlogComment/` + blogId, _blogComment);
  }


  reportComment(blogId : number, report : BlogReport) : Observable<Blog> {
    return this.http.post<Blog>(environment.apiHost + `blog/reportBlogComment/` + blogId, report);
  }

  didUserReportComment(blogId: number, userId: number, comment: BlogComment) : Observable<boolean> {
    return this.http.get<boolean>(environment.apiHost + `blog/didUserReportComment/` + blogId + `/` + userId + "/" + comment.timeCreated);
  }

  getReviewedReports(): Observable<BlogReport[]> {
    return this.http.get<BlogReport[]>(environment.apiHost + `blog/getReviewedReports`);
  }

  getUnreviewedReports(): Observable<BlogReport[]> {
    return this.http.get<BlogReport[]>(environment.apiHost + `blog/getUnreviewedReports`);
  }

  reviewReport(blogId: number, isAccepted: boolean, report: BlogReport) {
    return this.http.put(environment.apiHost + `blog/reviewReport/` + blogId + `/` + isAccepted, report);
  }

  deleteReportedComment(blogId: number, report: BlogReport) {
    return this.http.put(environment.apiHost + `blog/deleteReportedBlogComment/` + blogId, report);
  }


}
