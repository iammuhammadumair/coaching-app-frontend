import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAdminsComponent } from './home-admins.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment.dev';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { HttpClientModule } from '@angular/common/http';
import { SymbolByCurrencyPipe } from 'src/app/pipes/symbol-by-currency.pipe';

describe('HomeAdminsComponent', () => {
  let component: HomeAdminsComponent;
  let fixture: ComponentFixture<HomeAdminsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientModule,
        MatIconModule,
        MatCheckboxModule,
        MatListModule,
        MatDialogModule,
        FlexLayoutModule,
        RouterModule.forRoot([]),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFirestoreModule,
        AngularFireStorageModule
      ],
      declarations: [
        HomeAdminsComponent
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue : '/' },
        SymbolByCurrencyPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
