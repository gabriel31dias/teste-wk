import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from, map, Observable, switchMap, tap } from 'rxjs';
import { Person, Person2 } from '../models/person.model';
import { environment } from '../../environment';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';



@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private clientesCollection: AngularFirestoreCollection<Person2>;


  constructor(private afs: AngularFirestore) { 

    this.clientesCollection = this.afs.collection<Person2>('clientes');
  }


  getClientes(): Observable<any[]> {
    return this.clientesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addCliente(cliente: Person2): Observable<string> {
    return from(this.clientesCollection.add(cliente))
    .pipe(
      tap(docRef => console.log('Document written with ID: ', docRef.id)),
      switchMap(docRef => docRef.get()),
      map(doc => doc.id)
    );
  }

  updatePerson(id: string, updatedPersonData: Person2): Observable<void> {
    return from(this.clientesCollection.doc(id.toString()).update(updatedPersonData))
      .pipe(
        tap(() => console.log('Document updated with ID: ', id))
      );
  }


  deletePerson(id: string | number ): Observable<void> {
    return from( this.clientesCollection.doc(id.toString()).delete())
    .pipe(
      tap(docRef => console.log('Document written with ID: ', id))
    );
  }
}
