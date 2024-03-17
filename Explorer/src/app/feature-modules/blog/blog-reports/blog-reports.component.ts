import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { BlogReport } from '../../blog/model/blog.model';
import { BlogService } from '../blog.service';
import { AdministrationService } from '../../administration/administration.service';
import { UserInfo } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-blog-reports',
  templateUrl: './blog-reports.component.html',
  styleUrls: ['./blog-reports.component.css']
})
export class BlogReportsComponent implements OnInit {

  unreviewedReports: BlogReport[] = [];
  reviewedReports: BlogReport[] = [];
  selectedReport: BlogReport = {} as BlogReport;
  reportReasons: string[] = [
    "",
    "Spam",
    "Hate speech",
    "False information",
    "Bullying or harassment",
    "Violence or dangerous organizations"
  ];
  users: UserInfo[] = [];

  constructor(private blogService: BlogService, private el: ElementRef, private administrationService: AdministrationService) { }

  ngOnInit(): void {
    this.getReports();

    this.administrationService.getAllUsers().subscribe(users => {
      this.users = users;
      if (this.unreviewedReports != null) {
        this.unreviewedReports.forEach(report => {
          const user = this.users.find(u => u.id === report.userId);
          if (user) {
            report.username = user.username;
          }
        });
      }
      if (this.reviewedReports != null) {
        this.reviewedReports.forEach(report => {
          const user = this.users.find(u => u.id === report.userId);
          if (user) {
            report.username = user.username;
          }
        });
      }
    });



  }

  getReports() {
    console.log("Fetching reports...");
    this.blogService.getUnreviewedReports().subscribe(reports => {
      this.unreviewedReports = reports;
      console.log(reports.length + " unreviewed reports fetched.")
    });
    this.blogService.getReviewedReports().subscribe(reports => {
      this.reviewedReports = reports;
      console.log(reports.length + " reviewed reports fetched.")
    });
  }

  selectReport(report: BlogReport) {
    this.selectedReport = report;
  }

  acceptReport() {
    this.blogService.reviewReport(this.selectedReport.blogId, true, this.selectedReport).subscribe(() => {
      this.getReports();
      const closeButton = this.el.nativeElement.querySelector('#close-accept-report-modal-button');
      if (closeButton) {
        closeButton.click();
      }
    });
    this.blogService.deleteReportedComment(this.selectedReport.blogId, this.selectedReport).subscribe(() => { });
  }

  denyReport() {
    this.blogService.reviewReport(this.selectedReport.blogId, false, this.selectedReport).subscribe(() => {
      this.getReports();
      const closeButton = this.el.nativeElement.querySelector('#close-deny-report-modal-button');
      if (closeButton) {
        closeButton.click();
      }
    });
  }

}
