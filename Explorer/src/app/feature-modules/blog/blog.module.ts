import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogFormComponent } from './blog-form/blog-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DetailedBlogComponent } from './detailed-blog/detailed-blog.component';
import { BlogsPageComponent } from './blogs-page/blogs-page.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogReportsComponent } from './blog-reports/blog-reports.component';

@NgModule({
  declarations: [
    BlogFormComponent,
    DetailedBlogComponent,
    BlogsPageComponent,
    BlogReportsComponent
  ],
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    TextFieldModule,
    MatRadioModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    BlogFormComponent,
    DetailedBlogComponent,
    BlogsPageComponent
  ]
})
export class BlogModule { }
