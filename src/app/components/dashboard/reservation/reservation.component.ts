import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { ReservationService } from 'src/app/shared/services/reservation.service';
import { SlotsService } from 'src/app/shared/services/slots.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {

  @Input() userId: any;
  
  reservationForm: FormGroup = new FormGroup({});
  slots: any = [];
  
  constructor(private reservationService: ReservationService,
    private slotsService: SlotsService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.reservationForm = new FormGroup({
      vehicleType: new FormControl('car', Validators.required),
      model: new FormControl('', Validators.required),
      regNo: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      timeSlot: new FormControl('', Validators.required),
      serviceType: new FormControl('full', Validators.required),
      userId: new FormControl(this.userId, Validators.required),
      status: new FormControl('Pending', Validators.required),
    });


    this.reservationForm.controls['date'].valueChanges.subscribe(res => {

      this.slotsService.getAll().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )
        )
      ).subscribe(data => {
        console.log(data);
        let dayslots = data.find(d => d.id == res);
        
        if(dayslots){
          let arr: any[] = Object.values(dayslots);

          this.slots = arr.filter(el => el.availableCount).map(k=> k.time);;
        }
      });
    });
  }

  submit(){
    this.reservationService.create(this.reservationForm.value);
    this.toastr.success('Reservation Placed Successfully!', 'Success');
    this.reservationForm.reset();
  }
  
}
