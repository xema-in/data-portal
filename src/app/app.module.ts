import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

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
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';

import { AppComponent } from './app.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { ServerSelectionComponent } from './server-selection/server-selection.component';
import { LoginComponent } from './login/login.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { LogoutControlComponent } from './logout-control/logout-control.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [

  // application pages
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full' },
      { path: 'recordings/search', component: DashboardComponent },
      { path: 'reports/cdr', component: DashboardComponent },
    ]
  },

  // login, forgot password pages
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      { path: 'server', component: ServerSelectionComponent },
      { path: 'login', component: LoginComponent },
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
    ServerSelectionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    RouterModule.forRoot(routes, { useHash: true }),
    ReactiveFormsModule,

    MatButtonModule, MatCardModule, MatDialogModule, MatTableModule, MatSortModule,
    MatInputModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule,
    MatTabsModule, MatSidenavModule, MatBadgeModule, MatFormFieldModule, MatIconModule,
    MatToolbarModule, MatDividerModule, MatGridListModule, MatSelectModule, MatProgressBarModule,
    MatChipsModule, MatPaginatorModule, MatMenuModule, MatListModule, MatExpansionModule,

  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
