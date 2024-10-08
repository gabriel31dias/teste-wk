import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../../environment';
import { PersonsComponent } from './persons/persons.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonService } from './services/person.service';

import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CurrencyMaskDirective } from './currency-mask.directive';
import { SalesService } from './services/sales.service';
import { ProductService } from './services/product.service';


@NgModule({
  declarations: [
    AppComponent,
    PersonsComponent,
    CurrencyMaskDirective
  ],
  imports: [
    BrowserModule,
    NgxMaskDirective,
    AppRoutingModule, CommonModule, HttpClientModule, ReactiveFormsModule
  ],
  exports: [CurrencyMaskDirective],
  providers: [
    provideNgxMask({ /* opções de cfg */ }),
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp( environment.firebaseConfig )),
    provideFirestore(() => getFirestore()),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
    PersonService,
    SalesService,
    ProductService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
