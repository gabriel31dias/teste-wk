import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from, map, Observable, switchMap, tap } from 'rxjs';
import { Person, Person2 } from '../models/person.model';
import { environment } from '../../environment';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Sale } from '../models/sale.model';



@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private salesCollection: AngularFirestoreCollection<Sale>;

  constructor(private afs: AngularFirestore) { 
    this.salesCollection = this.afs.collection<Sale>('vendas');
  }

  getSales(): Observable<any[]> {
    return this.salesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addSale(cliente: Sale): Observable<string> {
    return from(this.salesCollection.add(cliente))
    .pipe(
      tap(docRef => console.log('Document written with ID: ', docRef.id)),
      switchMap(docRef => docRef.get()),
      map(doc => doc.id)
    );
  }


  deleteSale(id: string | number ): Observable<void> {
    return from( this.salesCollection.doc(id.toString()).delete())
    .pipe(
      tap(docRef => console.log('Document written with ID: ', id))
    );
  }
}
