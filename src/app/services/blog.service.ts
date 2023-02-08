import { Injectable } from '@angular/core';
import { Blog } from '../models/blog';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();
  BasePath = 'Blogs';
  blofRef: AngularFirestoreCollection<Blog>;
  private subject = new Subject<any>();
  blogs: Observable<Blog>;
  constructor(private afdb: AngularFirestore) {
    this.blofRef = afdb.collection<Blog>(this.BasePath, ref => ref.where('deleted', '==', false));

  }
  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  SaveBlogs(blog: Blog): Promise<any> {
    const param: Blog = {
      BlogTitle: blog.BlogTitle ? blog.BlogTitle : null,
      ShortDescription: blog.ShortDescription ? blog.ShortDescription : null,
      BlogDescription: blog.BlogDescription ? blog.BlogDescription : null,
      BlogImage: blog.BlogImage ? blog.BlogImage : null,
      creationDate: blog.creationDate ? blog.creationDate : null,
      BlogUrl: blog.BlogUrl ? blog.BlogUrl : null
    };
    return this.blofRef.add(param);
  }

  GetblogsRecords() {
    return this.afdb.collection('Blogs').snapshotChanges();
  }

  getClickEvent(id: any): Observable<any> {
    return this.subject.asObservable();
  }

  sendClickEvent(id: any) {
    this.subject.next(id);
    return;
  }

  updateBlogs(BlogID, Updateblog) {
    this.afdb.doc('Blogs/' + BlogID).update(Updateblog);
  }

  DeleteBlog(Data) {
    return this.afdb.collection('Blogs').doc(Data).delete();
  }
   SaveContent(PagContent) {
    return this.afdb.collection('BlogPageTitle').add(PagContent);
  }

  GetPageContentRecords() {
    return this.afdb.collection('BlogPageTitle').snapshotChanges();
  }

  updatePageTitile(Content_Id, UpdatePageContent) {
    this.afdb.doc('BlogPageTitle/' + Content_Id).update(UpdatePageContent);
  }
  deletePageTitle(Data) {
    return this.afdb.collection('BlogPageTitle').doc(Data).delete();
  }

}
