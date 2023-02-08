import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconRegistry } from '@angular/material/icon';
import { Blog } from 'src/app/models/blog';
import { BlogService } from 'src/app/services/blog.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-manage-blog',
  templateUrl: './manage-blog.component.html',
  styleUrls: ['./manage-blog.component.css']
})
export class ManageBlogComponent implements OnInit {

  blog: Blog = new Blog();
  unsubscribe = new Subject();
  form: FormGroup;
  showPerc: boolean;
  percentage: string;
  submitText;
  TotalTitle: number;
  title: string;
  GetBlogData: any;
  updateBlog: any;
  constructor(private Formbuild: FormBuilder,
    private blogService: BlogService,
    public snackbar: MatSnackBar,
    private router: Router,
    private storage: AngularFireStorage,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    private dialog: MatDialog) {
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
    this.bindForm();
    this.GetPageData();
  }
  _markAsDirty(group: FormGroup) {
    group.markAsDirty();
    for (const i in group.controls) {
      if (i) {
        group.controls[i].markAsTouched({ onlySelf: true });
      }
    }
  }
  bindForm() {
    this.title = this.blog && this.blog.BlogTitle ? 'Update Existing Blog' : 'Inset New Blog';
    this.submitText = this.blog && this.blog.BlogTitle ? 'Update' : 'Create';
    this.form = this.Formbuild.group(
      {
        BlogTitle: [this.blog ? this.blog.BlogTitle : '', Validators.required],
        ShortDescription: [this.blog ? this.blog.ShortDescription : '', Validators.required,
        Validators.maxLength(680)],
        BlogDescription: [this.blog ? this.blog.BlogDescription : '', Validators.required],
        BlogImage: [this.blog ? this.blog.BlogImage : '', Validators.required],
        BlogUrl: [this.blog ? this.blog.BlogUrl : '']

      }
    );
  }
  get f() { return this.form.controls; }
  SaveBlog() {
    // stop here if form is invalid
    if (this.form.invalid) {
      this._markAsDirty(this.form);
      this.snackbar.open('Error on save. Check the form value', 'Close', {
        duration: 3000,
      });
      return;
    }
    this.blog.BlogTitle = this.form.get('BlogTitle').value;
    this.blog.ShortDescription = this.form.get('ShortDescription').value;
    this.blog.BlogDescription = this.form.get('BlogDescription').value;
    this.blog.BlogImage = this.form.get('BlogImage').value;
    this.blog.BlogUrl = this.form.get('BlogUrl').value;

    this.AddBlog();
  }
  AddBlog() {      // create

    if (this.TotalTitle === 8) {
      this.snackbar.open('You can only upload 8 Blogs.', 'Close', {
        duration: 3000,
      });
      return;
    }
    this.blog.creationDate = new Date().getDate();
    this.blogService.SaveBlogs(this.blog).then(result => {
      if (result && result.id) {
        // this.router.navigate(['/welcome']);
      }
    });
    this.snackbar.open('Blog is saved', 'Close', {
      duration: 3000,
    });

  }

  UpdateBlogPopup(templateRef: TemplateRef<any>, UpdatpageData) {
    this.dialog.open(templateRef,
      { panelClass: 'Dialog-Update-Blog' });
    this.updateBlog = UpdatpageData;
  }

  UpdateBlogs(Updateblog, BlogID) {
    const PageContent = {};
    PageContent['BlogTitle'] = Updateblog.BlogTitle;
    PageContent['BlogDescription'] = Updateblog.BlogDescription;
    PageContent['BlogUrl'] = Updateblog.BlogUrl;
    this.blogService.updateBlogs(BlogID, Updateblog);
    this.snackbar.open('Records Updated successfully', 'Close', {
      duration: 3000,
    });
    this.closeDialog();
  }
  closeDialog() {
    this.dialog.closeAll();
  }

  startUpload(event) {
    // The File object
    this.showPerc = true;
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }
    // The storage path
    const path = `Blogs/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(path);
    const task = fileRef.put(file);

    task.percentageChanges().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(p => this.percentage = p.toString() + '%');
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().pipe(
          takeUntil(this.unsubscribe)
        ).subscribe(url => {
          this.form.patchValue({ 'BlogImage': url });
          this.showPerc = false;
        });
      })
    ).pipe(
      takeUntil(this.unsubscribe)
    ).subscribe();
  }

  GetPageData() {
    this.blogService.GetblogsRecords().subscribe(data => {
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
      this.GetBlogData = d;
    });
  }


  DeleteBlogPopupDialog(del: String) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Are you sure you want to delete the Blog?' }
    }).afterClosed().subscribe(ress => {
      if (ress) {
        this.blogService.DeleteBlog(del).then((res: any) => {
          this.snackbar.open('Blog deleted successfully', 'Close', {
            duration: 3000,
          });
          console.log(ress);
        }).catch((errors: any) => {
          console.log(errors);
        });
      }
    });
  }
  async close() {
    this.router.navigateByUrl('/admin-page');
  }

}
