import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from, map, Observable, switchMap, tap } from 'rxjs';
import { Person, Person2 } from '../models/person.model';
import { environment } from '../../environment';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productCollection: AngularFirestoreCollection<Product>;

  constructor(private afs: AngularFirestore) { 
    this.productCollection = this.afs.collection<Product>('produtos');
  }

  getProducts(): Observable<any[]> {
    return this.productCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addProduct(cliente: Product): Observable<string> {
    return from(this.productCollection.add(cliente))
    .pipe(
      tap(docRef => console.log('Document written with ID: ', docRef.id)),
      switchMap(docRef => docRef.get()),
      map(doc => doc.id)
    );
  }

  updateProduct(id: string, updatedPersonData: Product): Observable<void> {
    return from(this.productCollection.doc(id.toString()).update(updatedPersonData))
      .pipe(
        tap(() => console.log('Document updated with ID: ', id))
      );
  }

  deleteProduct(id: string | number ): Observable<void> {
    return from( this.productCollection.doc(id.toString()).delete())
    .pipe(
      tap(docRef => console.log('Document written with ID: ', id))
    );
  }
}
