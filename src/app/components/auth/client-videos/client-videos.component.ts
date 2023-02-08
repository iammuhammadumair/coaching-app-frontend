import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFirestoreModule, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { VideosService } from 'src/app/services/videos.service';
import { error } from 'protractor';
import { Video } from 'src/app/models/video';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireStorage } from '@angular/fire/storage';
import { takeUntil, finalize } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUser } from './../../../models/AppUser';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-client-videos',
  templateUrl: './client-videos.component.html',
  styleUrls: ['./client-videos.component.css']
})
export class ClientVideosComponent implements OnInit {

  PageTitle: string;
  PageDescription1: string;
  PageDescription2: string;
  PageContentData: any;
  UpdatepageContent: any;
  UpdatePageContet: any;
  TotalTitle: number;
  VideosRecords: any;
  videotitle: string;
  videoDescription: string;
  videoUrl: string;
  message: string;
  updateRecord: any;
  videoRef: AngularFirestoreCollection<Video>;
  videodetails: Observable<Video[]>;
  videoShowPerc: boolean;
  unsubscribe = new Subject();
  Videos: Video = new Video();
  videoPercentage = 0;
  videoPercentageString: string;
  form: FormGroup;
  isNew = false;
  userRef: Observable<AppUser | null>;
  file: string;
  user: AppUser;
  DisplayVideoRecords: any[] = [];
  TotalVideos: number;

  constructor(public VideoServices: VideosService,
    public snackbar: MatSnackBar,
    private storage: AngularFireStorage,
    private formbui: FormBuilder,
    private authenticationService: AuthenticationService,
    private Firestore: AngularFirestore,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    private router: Router,
    private dialog: MatDialog) {
    this.videoRef = this.Firestore.collection<Video>(
      'UploadVideos', ref => ref

    );
    this.videodetails = this.videoRef.valueChanges();
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
    this.TotalVideos = 0;
  }

  ngOnInit() {
    this.VideoServices.GetVideosRecords().subscribe(data => {

      const d = [];
      let counter = 0;
      this.TotalVideos = 0;
      data.forEach(e => {
        const id = e.payload.doc.id;
        d.push(e.payload.doc.data());
        d[counter].ID = id;
        counter = counter + 1;
        this.TotalVideos = this.TotalVideos + 1;
      });
      this.VideosRecords = d;
    });
    this.GetPageData();
  }

  uploadvideo() {
    if (this.TotalVideos === 4) {

      this.snackbar.open('You can only upload 4 videos.', 'Close', {
        duration: 3000,
      });
      return;
    }
    // The storage path
    this.videoShowPerc = true;
    const path = `HomePageVideos/${new Date().getTime()}_${this.file}`;
    const fileRef = this.storage.ref(path);
    const task = fileRef.put(this.file);

    task.percentageChanges().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(
      p => {
        this.videoPercentage = parseInt(p.toString(), null);
        this.videoPercentageString = p.toString().split('.')[0] + '%';
      }
    );
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().pipe(
          takeUntil(this.unsubscribe)
        ).subscribe(url => {

          this.videoUrl = url;
          // this.form.patchValue({ 'coachVideoUrl': url });
          this.videoShowPerc = false;
          if (this.videoUrl === '') {
            return;
          }
          const Record = {};
          Record['videotitle'] = this.videotitle;
          Record['videoDescription'] = this.videoDescription;
          Record['videoUrl'] = this.videoUrl;
          this.VideoServices.SaveVideo(Record).then(res => {
            this.snackbar.open('Video successfully Uploaded', 'Close', {
              duration: 3000,
            });
            this.videoPercentage = 0;
            this.videoPercentageString = '';
            this.videotitle = '';
            this.videoDescription = '';
            this.videoUrl = '';
            this.videoShowPerc = false;
            this.router.navigate(['/add-videos']);
            console.log(res);

          }).catch((er: any) => {
            console.log(er);
          });
        });
      })
    ).pipe(
      takeUntil(this.unsubscribe)
    ).subscribe();

  }
  saveVideo() {
    this.uploadvideo();

  }
  reloadPage() {
    window.location.reload();
  }

  startUploadVideo(event) {
    // The File object
    this.file = event.target.files[0];
    if (!this.file) {
      return;
    }
    this.videoShowPerc = true;
    // Client-side validation example
    if (this.file && this.file && !this.validateVideoExt(this.file['name'])) {
      console.error('unsupported file type :( ');
      this.snackbar.open('Unsupported file type. You can upload .mov and .mp4 files.', 'Close', {
        duration: 3000,
      });
      return;
    }

  }

  validateVideoExt(name: String) {
    const ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() === 'mov' || ext.toLowerCase() === 'mp4') {
      return true;
    } else {
      return false;
    }

  }
  openDeleteREDialog(del: String) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Are you sure you want to delete the video?' }
    }).afterClosed().subscribe((ress: any) => {
      if (ress) {
        this.VideoServices.deleterecord(del).then((res: any) => {
          this.snackbar.open('Video deleted successfully', 'Close', {
            duration: 3000,
          });
          this.videoPercentage = 0;
          this.videoPercentageString = '';
          this.videoShowPerc = false;
          console.log(ress);
        }).catch((errors: any) => {
          console.log(errors);
        });
      }
    });
  }

  UpdateRecords(templateRef: TemplateRef<any>, Record) {
    this.dialog.open(templateRef,
      { panelClass: 'custom-Dialog' });
    this.updateRecord = Record;

  }
  UpdateVideo(UpdateRecord, VideoID) {
    const record = {};
    record['videotitle'] = UpdateRecord.videotitle;
    record['videoDescription'] = UpdateRecord.videoDescription;
    this.VideoServices.updateVideo(VideoID, record);
    this.snackbar.open('Records Updated successfully', 'Close', {
      duration: 3000,
    });
    this.closeDialog();
  }

  closeDialog() {
    this.dialog.closeAll();
  }
  // PageTitle function

  SavePageTitle() {
    if (this.TotalTitle === 1) {
      this.snackbar.open('You can only upload 1 Page Title.', 'Close', {
        duration: 3000,
      });
      return;
    }
    const PagContent = {};
    PagContent['PageTitle'] = this.PageTitle;
    PagContent['PageDescription1'] = this.PageDescription1;
    PagContent['PageDescription2'] = this.PageDescription2;
    this.VideoServices.SaveContent(PagContent).then(res => {
      this.snackbar.open('Video Page Title successfully Added', 'Close', {
        duration: 3000,
      });
      this.PageTitle = '';
      this.PageDescription1 = '';
      this.PageDescription2 = '';

      console.log(res);
    }).catch((err: any) => {
      console.log(err);
    });
  }

  GetPageData() {
    this.VideoServices.GetPageContentRecords().subscribe(data => {
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
      { panelClass: 'Dialog-Update-Page-Content' });
    this.UpdatePageContet = UpdatpageData;
  }

  UpdatePagetitle(UpdatePageContent, ContentID) {
    const PageContent = {};
    PageContent['PageTitle'] = UpdatePageContent.PageTitle;
    PageContent['PageDescription1'] = UpdatePageContent.PageDescription1;
    PageContent['PageDescription2'] = UpdatePageContent.PageDescription2;
    this.VideoServices.updatePageTitile(ContentID, PageContent);
    this.snackbar.open('Records Updated successfully', 'Close', {
      duration: 3000,
    });
    this.closeDialog();
  }
  openDeletePageTitleDialog(del: String) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Are you sure you want to delete the Nlp Video page Title?' }
    }).afterClosed().subscribe(ress => {
      if (ress) {
        this.VideoServices.deletePageTitle(del).then((res: any) => {
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
    async close() {
    this.router.navigateByUrl('/admin-page');
}
}
