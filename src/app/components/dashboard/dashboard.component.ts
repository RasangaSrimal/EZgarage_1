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
      if(!this.authService.userData.adminRole){
        this.reservations = data.filter(d => d.userId == this.authService.userData.uid);;
      }else{
        this.reservations = data;
      }
    });
  }

  setIsActive(key: any){
    this.isActive = {};
    this.isActive[key] = true;
  }

  changeStatus(item: any){
    //console.log(item);
    this.reservationService.update(item.id, item);
  }

  buttonColor:any = "black";
  buttonType:any = "pay";
  isCustomSize = false;
  buttonWidth = 160;
  buttonHeight = 40;
  isTop = window === window.top;

  paymentRequest:any = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
          allowedCardNetworks: ["AMEX", "VISA", "MASTERCARD"]
        },
        tokenizationSpecification: {
          type: "PAYMENT_GATEWAY",
          parameters: {
            gateway: "example",
            gatewayMerchantId: "exampleGatewayMerchantId"
          }
        }
      }
    ],
    merchantInfo: {
      merchantId: "12345678901234567890",
      merchantName: "Demo Merchant"
    },
    transactionInfo: {
      totalPriceStatus: "FINAL",
      totalPriceLabel: "Total",
      totalPrice: "100.00",
      currencyCode: "USD",
      countryCode: "US"
    }
  };

  onLoadPaymentData(event: any) {
    console.log("load payment data", event.detail);
  }
}
