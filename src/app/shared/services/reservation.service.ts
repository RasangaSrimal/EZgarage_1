import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private dbPath = '/reservations';
  slots: AngularFirestoreCollection<any>;
  
  constructor(private db: AngularFirestore) {
    this.slots = db.collection(this.dbPath);
  }
  getAll(): AngularFirestoreCollection<any> {
    return this.slots;
  }
  create(slot: any): any {
    return this.slots.add({ ...slot });
  }
  update(id: string, data: any): Promise<void> {
    return this.slots.doc(id).update(data);
  }
  delete(id: string): Promise<void> {
    return this.slots.doc(id).delete();
  }
}
