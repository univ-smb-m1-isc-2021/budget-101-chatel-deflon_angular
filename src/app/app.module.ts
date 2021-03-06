import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import {MatCardModule} from "@angular/material/card";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from "@angular/material/form-field";
import {MatTableModule} from "@angular/material/table";

import {HomepageComponent} from './components/homepage/homepage.component';
import {ManagingDataComponent} from './components/managing-data/managing-data.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {ChartsComponent} from './components/charts/charts.component';
import {BudgetListComponent} from './components/budget-list/budget-list.component';
import {BudgetFormComponent} from './components/budget-form/budget-form.component';
import {BudgetEditComponent} from './components/budget-edit/budget-edit.component';
import {TransactionListComponent} from './components/transaction-list/transaction-list.component';
import {TransactionFormComponent} from './components/transaction-form/transaction-form.component';
import {TransactionEditComponent} from './components/transaction-edit/transaction-edit.component';
import {UserSettingsComponent} from './components/user-settings/user-settings.component';
import {UserEditComponent} from './components/user-edit/user-edit.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {TokenInterceptor} from "./auth/token.interceptor";

import * as PlotlyJS from 'plotly.js-dist-min';
import {PlotlyModule} from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ChartsComponent,
    HeaderComponent,
    FooterComponent,
    ManagingDataComponent,
    BudgetListComponent,
    BudgetFormComponent,
    BudgetEditComponent,
    TransactionFormComponent,
    TransactionEditComponent,
    TransactionListComponent,
    LoginComponent,
    UserSettingsComponent,
    UserEditComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // Imports pour les formulaires
    FormsModule,
    ReactiveFormsModule,
    // Imports Angular Material
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTableModule,
    // Import pour les graphiques
    PlotlyModule
  ],
  exports: []
  ,
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {floatLabel: 'always'}
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
