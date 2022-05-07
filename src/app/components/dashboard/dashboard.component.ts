import { Component, OnInit } from '@angular/core';
import { ReservationService } from 'src/app/shared/services/reservation.service';
import { AuthService } from '../../shared/services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {

  isActive: any = { 'profile' : true};
  reservations: any = [];

  constructor(public authService: AuthService,
    private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.retrieveTutorials();
  }


  retrieveTutorials(): void {
    this.reservationService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log(data);
      this.reservations = data.filter(d => d.userId == this.authService.userData.uid);;
    });
  }

  setIsActive(key: any){
    this.isActive = {};
    this.isActive[key] = true;
  }
}
