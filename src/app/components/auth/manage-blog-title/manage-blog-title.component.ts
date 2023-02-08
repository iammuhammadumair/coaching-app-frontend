import { Component, OnInit, TemplateRef } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconRegistry} from '@angular/material/icon';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
@Component({
  selector: 'app-manage-blog-title',
  templateUrl: './manage-blog-title.component.html',
  styleUrls: ['./manage-blog-title.component.css']
})
export class ManageBlogTitleComponent implements OnInit {
  //  Blog page titile
  PageTitle: string;
  PageDescription: string;
  // PageDescription2: string;
  PageContentData: any;
  UpdatepageContent: any;
  UpdatePageContet: any;
  TotalTitle: number;
  constructor(private blogService: BlogService,
    public snackbar: MatSnackBar,
    private dialog: MatDialog,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    public router: Router) {
    iconRegistry.addSvgIcon(
      'update',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon/update.svg')
    );
    iconRegistry.addSvgIcon(
      'delete',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon/delete.svg')
    );
    iconRegistry.addSvgIcon(
      'play',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon/play.svg')
    );
  }

  ngOnInit() {
    this.GetPageContentData();
  }

  // Manage Blog page title and description section

  SavePageTitle() {
    if (this.TotalTitle === 1) {
      this.snackbar.open('You can only upload 1 Page Title.', 'Close', {
        duration: 3000,
      });
      return;
    }
    const PagContent = {};
    PagContent['PageTitle'] = this.PageTitle;
    PagContent['PageDescription'] = this.PageDescription;
    // PagContent['PageDescription2'] = this.PageDescription2;
    this.blogService.SaveContent(PagContent).then(res => {
      this.snackbar.open('Video Page Title successfully Added', 'Close', {
        duration: 3000,
      });
      this.PageTitle = '';
      this.PageDescription = '';
      // this.PageDescription2 = '';

      console.log(res);
    }).catch((err: any) => {
      console.log(err);
    });
  }

  GetPageContentData() {
    this.blogService.GetPageContentRecords().subscribe(data => {
      const d = [];
      let counter = 0;
      this.TotalTitle = 0;
      data.forEach(e => {
        const id = e.payload.doc.id;
        d.push(e.payload.doc.data());
        d[counter].ID = id;
        counter = counter + 1;
        this.TotalTitle = this.TotalTitle + 1;
      });
      this.PageContentData = d;
      console.log(this.PageContentData);
    });
  }

  UpdatePageContext(templateRef: TemplateRef<any>, UpdatpageData) {
    this.dialog.open(templateRef,
      { panelClass: 'Dialog-Update-Blog-Page-Content' });
    this.UpdatePageContet = UpdatpageData;
  }

  UpdatePagetitle(UpdatePageContent, ContentID) {
    const PageContent = {};
    PageContent['PageTitle'] = UpdatePageContent.PageTitle;
    PageContent['PageDescription'] = UpdatePageContent.PageDescription;
    // PageContent['PageDescription2'] = UpdatePageContent.PageDescription2;
    this.blogService.updatePageTitile(ContentID, PageContent);
    this.snackbar.open('Records Updated successfully', 'Close', {
      duration: 3000,
    });
    this.closeDialog();
  }

  closeDialog() {
    this.dialog.closeAll();
  }
  async close() {
    this.router.navigateByUrl('/manage-blog');
  }
  openDeletePageTitleDialog(del: String) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Are you sure you want to delete the Nlp Video page Title?' }
    }).afterClosed().subscribe(ress => {
      if (ress) {
        this.blogService.deletePageTitle(del).then((res: any) => {
          this.snackbar.open('Nlp Video page Title deleted successfully', 'Close', {
            duration: 3000,
          });
          console.log(ress);
        }).catch((errors: any) => {
          console.log(errors);
        });
      }
    });
  }

}
