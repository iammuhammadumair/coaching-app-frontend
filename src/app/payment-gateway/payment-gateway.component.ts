import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { AppUser, countriesList } from '../models/AppUser';
import { AuthenticationService } from '../services/authentication.service';


@Component({
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.css']
})
export class PaymentGatewayComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
  ) { }
  
  @Input() profile = null;
  @Input() coach;
  // @Input() continent;
  // @Input() paymentType;

  // @Input() user = null;
  @Input() account = null;
  @Input() paypalButtonHeadingText;
  @Output() payment = new EventEmitter();
  @Output() closePaymentModal = new EventEmitter();
  @Output() paymentMade = new EventEmitter();


  user: AppUser;
  // continent;

  ngOnInit(): void {


    this.authenticationService.user.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
    
    if(this.user){
      // console.log('user')
      // this.searchForContinent(this.user.countryOfResidence)
    // }else {
      // console.log('no user')
      // this.searchForContinent(this.profile['countryOfResidenceCtrl'].value)
    }


    // if(this.profile){
    //   this.profile['countryOfResidenceCtrl'].valueChanges.subscribe(val => {
    //     this.searchForContinent(val)
    //   });
    // }

  }

  // searchForContinent(countryCode) {
  //   let countryObject = countriesList.find(x => x.code === countryCode)
  //   this.continent = countryObject.cname;
  // }

}
