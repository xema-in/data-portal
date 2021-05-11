import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';

import { NgxAudioPlayerModule } from 'ngx-audio-player';

import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth.interceptor';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { ServerSelectionComponent } from './server-selection/server-selection.component';
import { LoginComponent } from './login/login.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { LogoutControlComponent } from './logout-control/logout-control.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchRecordingsComponent } from './search-recordings/search-recordings.component';
import { CdrReportComponent } from './cdr-report/cdr-report.component';
import { RecordingsPlaybackDialogComponent } from './recordings-playback-dialog/recordings-playback-dialog.component';
import { DatasetsListComponent } from './datasets-list/datasets-list.component';
import { ExploreDatasetComponent } from './explore-dataset/explore-dataset.component';
import { MissedcallReportComponent } from './missedcall-report/missedcall-report.component';
import { GenericReportComponent } from './generic-report/generic-report.component';
import { PageNotfoundComponent } from './page-notfound/page-notfound.component';
import { CallRecordingsComponent } from './call-recordings/call-recordings.component';
import { CdrDownloadComponent } from './cdr-download/cdr-download.component';

const routes: Routes = [

  // login, forgot password pages
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      { path: 'server', component: ServerSelectionComponent },
      { path: 'login', component: LoginComponent },
    ]
  },

  // application pages
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full' },
      { path: 'recordings/search', component: SearchRecordingsComponent },
      { path: 'reports/cdr', component: CdrReportComponent },
      { path: 'reports/missedcalls', component: MissedcallReportComponent },

      { path: 'cdr/:groupId/:reportId', component: CdrDownloadComponent },
      { path: 'recordings/:groupId/:reportId', component: CallRecordingsComponent },
      { path: 'generic/:groupId/:reportId', component: GenericReportComponent },
      { path: ':groupId/:reportId', component: GenericReportComponent }, // keep at the end of reports
      { path: '**', component: PageNotfoundComponent },
    ]
  },

];

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    LeftMenuComponent,
    LogoutControlComponent,
    LoginLayoutComponent,
    DashboardComponent,
    LoginComponent,
    ServerSelectionComponent,
    SearchRecordingsComponent,
    CdrReportComponent,
    RecordingsPlaybackDialogComponent,
    DatasetsListComponent,
    ExploreDatasetComponent,
    MissedcallReportComponent,
    GenericReportComponent,
    PageNotfoundComponent,
    CallRecordingsComponent,
    CdrDownloadComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    RouterModule.forRoot(routes, { useHash: true }),
    ReactiveFormsModule,
    HttpClientModule,

    MatButtonModule, MatCardModule, MatDialogModule, MatTableModule, MatSortModule,
    MatInputModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule,
    MatTabsModule, MatSidenavModule, MatBadgeModule, MatFormFieldModule, MatIconModule,
    MatToolbarModule, MatDividerModule, MatGridListModule, MatSelectModule, MatProgressBarModule,
    MatChipsModule, MatPaginatorModule, MatMenuModule, MatListModule, MatExpansionModule,

    NgxAudioPlayerModule,

  ],
  exports: [RouterModule],
  entryComponents: [
    RecordingsPlaybackDialogComponent
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
